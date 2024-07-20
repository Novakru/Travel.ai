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
      script.src = 'https://webapi.amap.com/maps?v=2.0&key=12d540f479e0d7e32221eb00e0cd15a7&plugin=AMap.Driving,AMap.Geocoder';
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
      });
      mapRef.current = map;

      const fetchLatLngs = async () => {
        const allLatLngs: AddressWithLatLng[][] = [];
        console.log('Fetching locations...');        
        for (const dayAddresses of addresses) {
          console.log('Fetching locations for a day...');
          const dayLatLngs: AddressWithLatLng[] = [];
          for (const addressInfo of dayAddresses) {
            console.log(`Fetching location for ${addressInfo.address}...`);
            try {
              console.log(`Fetching location for ${addressInfo.address}...`);
              const latLng = await getLatLng(addressInfo);
              console.log(`Location for ${addressInfo.address} fetched`);
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

      const getLatLng = (addressInfo: Address): Promise<AddressWithLatLng> => {
        return new Promise((resolve, reject) => {
          AMap.plugin('AMap.Geocoder', function() {
            const geocoder = new AMap.Geocoder({
              city: geocodeInfo?.region || '010',
            });
            console.log(`Getting location for ${addressInfo.address}...`);

            geocoder.getLocation(addressInfo.address, (status: string, result: any) => {
              if (status === 'complete' && result.geocodes.length) {
                const location = result.geocodes[0].location;
                resolve({
                  address: addressInfo.address,
                  lng: location.lng,
                  lat: location.lat,
                });
              } else {
                reject(`Failed to get location for ${addressInfo.address}`);
              }
            });
          });
        });
      };

      if (addresses.length > 0 && geocodeInfo) {
        fetchLatLngs();
      }
    };

    if (addresses.length > 0 && geocodeInfo) {
      loadMapScripts();
    }
  }, [addresses, geocodeInfo]);

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
      console.log(`Route ${routeKey} removed`);
    } else {
      const driving = new AMap.Driving({
        map: mapRef.current,
        panel: 'panel',
      });

      driving.search([
        { keyword: start.address, city: geocodeInfo?.region || '' },
        { keyword: end.address, city: geocodeInfo?.region || '' }
      ], (status: string, result: any) => {
        if (status === 'complete') {
          setDrivingRoutes((prevRoutes) => ({ ...prevRoutes, [routeKey]: driving }));
          console.log(`Route ${routeKey} added`);
        } else {
          console.error('路线计算失败:', result);
        }
      });
    }
  };

  return (
    <div className="App">
      <div className="mapContainer" id="mapContainer"></div>
      <div className="bottom">
        <div className="left" id="addressListContainer">
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
