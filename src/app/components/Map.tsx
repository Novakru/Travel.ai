import React, { useState, useEffect } from 'react';
import './CSS/map.css';

declare global {
  interface Window {
    AMap: any;
    _AMapSecurityConfig: any;
  }
}

const App: React.FC = () => {
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<{ address: string; location: any }[]>([]);
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
  }, []);

  useEffect(() => {
    if (map) {
      fetchPreStoredAddresses();
    }
  }, [map]);

  useEffect(() => {
    if (addresses.length > 0) {
      addresses.forEach((addressObj) => {
        const { address, location } = addressObj;
        addMarker(address, new window.AMap.LngLat(location.lng, location.lat));
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

  const fetchPreStoredAddresses = () => {
    fetch('http://127.0.0.1:5000/getPreStoredAddresses')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          data.addresses.forEach((addressObj: { address: string }) => {
            searchAddress(addressObj.address);
          });
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  const searchAddress = (address: string) => {
    window.AMap.plugin('AMap.Geocoder', () => {
      const geocoder = new window.AMap.Geocoder({ city: '全国' });

      geocoder.getLocation(address, (status: string, result: any) => {
        if (status === 'complete' && result.geocodes.length) {
          const location = result.geocodes[0].location;
          saveAddressToBackend(address, location);
        } else {
          console.error('无法找到该地址:', address);
        }
      });
    });
  };

  const saveAddressToBackend = (address: string, location: any) => {
    fetch('http://127.0.0.1:5000/saveAddress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address,
        location: { lng: location.lng, lat: location.lat },
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
          setAddresses(data.addresses);
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
      <div className="left">
        <div id="mapContainer" className="mapContainer"></div>
      </div>
      <div className="right">
        <div id="addressListContainer">
          <h3>已选择的地址</h3>
          <div id="addressList">
            {addresses.map((addressObj, index) => (
              <div key={index} className="address-block">
                <div className="address-item">{addressObj.address}</div>
                {index < addresses.length - 1 && (
                  <button
                    className="route-button"
                    onClick={() =>
                      toggleRoute(
                        new window.AMap.LngLat(addressObj.location.lng, addressObj.location.lat),
                        new window.AMap.LngLat(addresses[index + 1].location.lng, addresses[index + 1].location.lat),
                        `${index}-${index + 1}`
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
        <div id="panel" className="panel"></div>
      </div>
    </div>
  );
};

export default App;
