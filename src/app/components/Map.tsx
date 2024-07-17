import React, { useState, useEffect } from 'react';
import '../../../styles/map.css';

declare global {
  interface Window {
    AMap: any;
    _AMapSecurityConfig: any;
  }
}

const App: React.FC = () => {
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<{ day: number; addresses: { address: string; location: any }[] }[]>([]);
  const [drivingRoutes, setDrivingRoutes] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const initMap = () => {
      const mapInstance = new window.AMap.Map('mapContainer', {
        zoom: 12,
        center: [116.397428, 39.90923],
      });
      setMap(mapInstance);
    };

    const loadMapScripts = () => {
      const script = document.createElement('script');
      script.src = 'https://webapi.amap.com/maps?v=2.0&key=5c59c24345b887271ff5578bacc4c4d1';
      script.async = true;
      script.onload = () => {
        window._AMapSecurityConfig = {
          securityJsCode: '78a617fc9d8d6b1c8685af066bec7470',
        };
        initMap();
      };
      document.body.appendChild(script);
    };

    loadMapScripts();
    clearStoredAddresses();
  }, []);

  useEffect(() => {
    if (map) {
      fetchPreStoredAddresses();
    }
  }, [map]);

  useEffect(() => {
    if (addresses.length > 0) {
      addresses.forEach(dayObj => {
        dayObj.addresses.forEach(addressObj => {
          const { address, location } = addressObj;
          addMarker(address, new window.AMap.LngLat(location.lng, location.lat));
        });
      });
    }
  }, [addresses]);

  const addMarker = (address: string, location: any) => {
    const marker = new window.AMap.Marker({
      position: location,
      map,
      extData: { address },
    });
    setMarkers((prevMarkers) => [...prevMarkers, marker]);
  };

  const clearStoredAddresses = () => {
    fetch('http://127.0.0.1:5000/clearAddresses', {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log('Stored addresses cleared');
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  const fetchPreStoredAddresses = () => {
    fetch('http://127.0.0.1:5000/getPreStoredAddresses')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          data.addresses.forEach((dayObj: { address: string }[], dayIndex: number) => {
            dayObj.forEach((addressObj: { address: string }, addressIndex: number) => {
              searchAddress(addressObj.address, dayIndex, addressIndex);
            });
          });
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  const searchAddress = (address: string, dayIndex: number, addressIndex: number) => {
    window.AMap.plugin('AMap.Geocoder', () => {
      const geocoder = new window.AMap.Geocoder({ city: '全国' });

      geocoder.getLocation(address, (status: string, result: any) => {
        if (status === 'complete' && result.geocodes.length) {
          const location = result.geocodes[0].location;
          saveAddressToBackend(address, location, dayIndex);
        } else {
          console.error('无法找到该地址:', address);
        }
      });
    });
  };

  const saveAddressToBackend = (address: string, location: any, dayIndex: number) => {
    fetch('http://127.0.0.1:5000/saveAddress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address,
        location: { lng: location.lng, lat: location.lat },
        day_index: dayIndex
      }),
    })
      .then((response) => response.json())
      .then(() => {
        fetchAddresses();
      })
      .catch((error) => console.error('Error:', error));
  };

  const fetchAddresses = () => {
    fetch('http://127.0.0.1:5000/getAddresses')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const newAddresses = data.addresses.map((day: { address: string; location: { lng: number; lat: number } }[], dayIndex: number) => ({
            day: dayIndex + 1,
            addresses: day.map((addressObj: { address: string; location: { lng: number; lat: number } }) => ({
              address: addressObj.address,
              location: new window.AMap.LngLat(addressObj.location.lng, addressObj.location.lat)
            }))
          }));
          setAddresses(newAddresses);
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  const toggleRoute = (start: any, end: any, routeKey: string) => {
    if (drivingRoutes[routeKey]) {
      drivingRoutes[routeKey].clear();
      const newRoutes = { ...drivingRoutes };
      delete newRoutes[routeKey];
      setDrivingRoutes(newRoutes);
      console.log(`Route ${routeKey} removed`);
    } else {
      window.AMap.plugin('AMap.Driving', () => {
        const driving = new window.AMap.Driving({
          map: map,
          panel: 'panel',
        });

        driving.search(start, end, (status: string, result: any) => {
          if (status === 'complete') {
            setDrivingRoutes((prevRoutes) => ({ ...prevRoutes, [routeKey]: driving }));
            console.log(`Route ${routeKey} added`);
          } else {
            console.error('路线计算失败:', result);
          }
        });
      });
    }
  };

  return (
    <div className="App">
      <div className="mapContainer" id="mapContainer"></div>
      <div className="bottom">
        <div className="left" id="addressListContainer">
          {addresses.map((dayObj, dayIndex) => (
            <div key={dayIndex} className="day-block">
              <h3>第{dayObj.day}天</h3>
              <div className="address-row">
                {dayObj.addresses.map((addressObj, addressIndex) => (
                  <div key={addressIndex} className="address-block">
                    <div className="address-item">{addressObj.address}</div>
                    {addressIndex < dayObj.addresses.length - 1 && (
                      <button
                        className="route-button"
                        onClick={() =>
                          toggleRoute(
                            addressObj.location,
                            dayObj.addresses[addressIndex + 1].location,
                            `${dayIndex}-${addressIndex}-${addressIndex + 1}`
                          )
                        }
                      >
                        ⬤
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

export default App;
