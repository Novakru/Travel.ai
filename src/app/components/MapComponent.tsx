import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../../../styles/map.css';
import { FaRoute, FaTimes } from 'react-icons/fa'; // 引入图标

interface Address {
  address: string;
}

interface LatLng {
  lng: number;
  lat: number;
}

interface AddressWithLatLng extends Address, LatLng {}

const MapComponent: React.FC = () => {
  const [geocodeInfo, setGeocodeInfo] = useState<{ region: string } | null>(null);
  const [addresses, setAddresses] = useState<Address[][]>([]);
  const [latLngs, setLatLngs] = useState<AddressWithLatLng[][]>([]);
  const [drivingRoutes, setDrivingRoutes] = useState<{ [key: string]: any }>({});
  const [routeType, setRouteType] = useState<string>('Driving');
  const [liveWeather, setLiveWeather] = useState<any>(null);
  const [forecastWeather, setForecastWeather] = useState<any>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    const fetchGeocodeInfo = async () => {
      try {
        const response = await axios.get('http://localhost:5000/map/getGeocodeInfo');
        if (response.data.success) {
          setGeocodeInfo(response.data.geocode_info);
        }
      } catch (error) {
        console.error('Error fetching geocode info:', error);
      }
    };

    const fetchAddresses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/map/getAddresses');
        if (response.data.success) {
          setAddresses(response.data.addresses);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    fetchGeocodeInfo();
    fetchAddresses();
  }, []);

  useEffect(() => {
    const loadMapScripts = () => {
      const script = document.createElement('script');
      script.src = 'https://webapi.amap.com/maps?v=2.0&key=12d540f479e0d7e32221eb00e0cd15a7&plugin=AMap.Driving,AMap.Walking,AMap.Riding,AMap.Transfer,AMap.Weather,AMap.Geocoder,AMap.ControlBar,AMap.ToolBar';
      script.async = true;
      script.onload = () => {
        window._AMapSecurityConfig = {
          securityJsCode: 'a1c7186f1d6c1e4366ebd69a3baec0ee',
        };
        initMap();
      };
      document.body.appendChild(script);
    };

    const initMap = () => {
      const AMap = (window as any).AMap;
      const map = new AMap.Map('mapContainer', {
        resizeEnable: true,
        center: [116.397428, 39.90923], // 北京市中心
        zoom: 13,
        pitch: 50, // 开启3D视图
        rotation: -15,
        viewMode: '3D', // 开启3D视图
        zooms: [2, 20],
      });
      mapRef.current = map;

      const controlBar = new AMap.ControlBar({
        position: {
          right: '10px',
          top: '10px',
        },
      });
      map.addControl(controlBar);

      const toolBar = new AMap.ToolBar({
        position: {
          right: '40px',
          top: '110px',
        },
      });
      map.addControl(toolBar);

      const getLatLng = (addressInfo: Address): Promise<AddressWithLatLng> => {
        return new Promise((resolve, reject) => {
          const AMap = (window as any).AMap;
          AMap.plugin('AMap.Geocoder', function() {
            const geocoder = new AMap.Geocoder({
              city: geocodeInfo?.region || '010',
            });
      
            const timeoutId = setTimeout(() => {
              reject(new Error(`Timed out to get location for ${addressInfo.address}`));
            }, 2000); // 2秒超时
      
            geocoder.getLocation(addressInfo.address, (status: string, result: any) => {
              clearTimeout(timeoutId); // 成功获取到位置后，清除超时计时器
              if (status === 'complete' && result.geocodes.length) {
                const location = result.geocodes[0].location;
                resolve({
                  address: addressInfo.address,
                  lng: location.lng,
                  lat: location.lat,
                });
              } else {
                reject(new Error(`Failed to get location for ${addressInfo.address}`));
              }
            });
          });
        });
      };
      
      const fetchLatLngs = async () => {
        const allLatLngs: AddressWithLatLng[][] = [];
        for (const dayAddresses of addresses) {
          const dayLatLngs: AddressWithLatLng[] = [];
          for (const addressInfo of dayAddresses) {
            try {
              const latLng = await getLatLng(addressInfo);
              dayLatLngs.push(latLng);
              new AMap.Marker({
                map,
                position: [latLng.lng, latLng.lat],
                title: latLng.address,
              });
            } catch (error) {
              console.error(error);
            }
          }
          allLatLngs.push(dayLatLngs);
        }
        setLatLngs(allLatLngs);
      };

      if (addresses.length > 0 && geocodeInfo) {
        fetchLatLngs();
        fetchWeather(geocodeInfo.region);
      }
    };

    if (addresses.length > 0 && geocodeInfo) {
      loadMapScripts();
      loadMapScripts();
    }
  }, [addresses, geocodeInfo]);

  const fetchWeather = (city: string) => {
    const AMap = (window as any).AMap;
    AMap.plugin('AMap.Weather', function() {
      const weather = new AMap.Weather();
      weather.getLive(city, function(err: any, data: any) {
        if (!err) {
          setLiveWeather(data);
        }
      });
      weather.getForecast(city, function(err: any, data: any) {
        if (!err) {
          setForecastWeather(data);
        }
      });
    });
  };

  const toggleRoute = (start: AddressWithLatLng, end: AddressWithLatLng, routeKey: string) => {
    if (!mapRef.current) {
      return;
    }

    const AMap = (window as any).AMap;

    if (drivingRoutes[routeKey]) {
      drivingRoutes[routeKey].clear();
      const newRoutes = { ...drivingRoutes };
      delete newRoutes[routeKey];
      setDrivingRoutes(newRoutes);
    } else {
      const createRoute = (RouteClass: any) => {
        const route = new RouteClass({
          map: mapRef.current,
          panel: 'panel',
        });

        route.search([
          { keyword: start.address, city: geocodeInfo?.region || '' },
          { keyword: end.address, city: geocodeInfo?.region || '' }
        ], (status: string, result: any) => {
          if (status === 'complete') {
            setDrivingRoutes((prevRoutes) => ({ ...prevRoutes, [routeKey]: route }));
          } else {
            console.error(`${routeType}路线数据查询失败:`, result);
          }
        });
      };

      switch (routeType) {
        case 'Driving':
          createRoute(AMap.Driving);
          break;
        case 'Walking':
          createRoute(AMap.Walking);
          break;
        case 'Riding':
          createRoute(AMap.Riding);
          break;
        case 'Transfer':
          createRoute(AMap.Transfer);
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="App">
      <div className="weather-info">
        {liveWeather && (
          <div className="live-weather">
            <h4>实时天气</h4>
            <p>城市/区：{liveWeather.city}</p>
            <p>天气：{liveWeather.weather}</p>
            <p>温度：{liveWeather.temperature}℃</p>
            <p>风向：{liveWeather.windDirection}</p>
            <p>风力：{liveWeather.windPower} 级</p>
            <p>空气湿度：{liveWeather.humidity}</p>
            <p>发布时间：{liveWeather.reportTime}</p>
          </div>
        )}
        {forecastWeather && (
          <div className="forecast-weather">
            <h4>天气预报</h4>
            {forecastWeather.forecasts.map((dayWeather: any, index: number) => (
              <p key={index}>{dayWeather.date} <span className="weather">{dayWeather.dayWeather}</span> {dayWeather.nightTemp}~{dayWeather.dayTemp}℃</p>
            ))}
          </div>
        )}
      </div>
      <div className="mapContainer" id="mapContainer"></div>
      <div className="bottom">
        <div className="left" id="addressListContainer">
          <select onChange={(e) => setRouteType(e.target.value)} value={routeType}>
            <option value="Driving">驾车</option>
            <option value="Walking">步行</option>
            <option value="Riding">骑行</option>
            <option value="Transfer">公交</option>
          </select>
          {latLngs.map((dayLatLngs, dayIndex) => (
            <div className="day-block" key={dayIndex}>
              <h2>{`第${dayIndex + 1}天`}</h2>
              <div className="address-row">
                {dayLatLngs.map((latLng, addressIndex) => (
                  <div className="address-block" key={addressIndex}>
                    <span className="address-item">{latLng.address}</span>
                    {addressIndex < dayLatLngs.length - 1 && (
                      <button
                        className="route-button"
                        onClick={() =>
                          toggleRoute(
                            latLng,
                            dayLatLngs[addressIndex + 1],
                            `day${dayIndex}-route${addressIndex}`
                          )
                        }
                      >
                        {drivingRoutes[`day${dayIndex}-route${addressIndex}`] ? <FaTimes /> : <FaRoute />}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="right" id="panel"></div>
      </div>
    </div>
  );
};

export default MapComponent;
