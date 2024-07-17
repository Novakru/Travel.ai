import React, { useState, useEffect, useRef } from 'react';
import '../map.css';

declare global {
  interface Window {
    AMap: any;
    _AMapSecurityConfig: any;
  }
}

const App: React.FC = () => {
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const addressLocationsRef = useRef<{ address: string; location: any }[]>([]);
  const drivingRoutesRef = useRef<any[]>([]);
  const [addresses, setAddresses] = useState<{ address: string; location: any }[]>([]);
  const [addressInput, setAddressInput] = useState('');

  // Initialize the map and load map scripts
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
    clearAddresses();
    fetchAddresses();
  }, []);

  // Handle right-click on the map to add a marker
  useEffect(() => {
    if (map) {
      map.on('rightclick', handleMapRightClick);
    }
  }, [map]);

  useEffect(() => {
    console.log('Address locations updated:', addressLocationsRef.current);
  }, [addressLocationsRef.current]);

  // Handle right-click to add a marker and get address using reverse geocoding
  const handleMapRightClick = (e: any) => {
    const { lnglat } = e;
    map.setCenter(lnglat);
    map.setZoom(13);

    window.AMap.plugin('AMap.Geocoder', () => {
      const geocoder = new window.AMap.Geocoder();
      geocoder.getAddress(lnglat, (status: string, result: any) => {
        if (status === 'complete' && result.regeocode) {
          const address = result.regeocode.formattedAddress;
          addMarker(address, lnglat);
        } else {
          alert('无法找到该地址，请重新输入国内合法地址');
        }
      });
    });
  };

  // Add a marker to the map and save the address and location to the backend
  const addMarker = (address: string, location: any) => {
    const marker = new window.AMap.Marker({
      position: location,
      map,
      extData: { address },
    });
    setMarkers((prevMarkers) => [...prevMarkers, marker]);
    addressLocationsRef.current = [...addressLocationsRef.current, { address, location }];

    fetch('http://127.0.0.1:5000/saveAddress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address,
        location: { lng: location.getLng(), lat: location.getLat() },
      }),
    })
      .then((response) => response.json())
      .then(() => {
        fetchAddresses();
      })
      .catch((error) => console.error('Error:', error));
  };

  // Search for an address and add a marker to the map
  const searchAddress = () => {
    if (!addressInput.trim()) {
      alert('请输入一个有效的地址');
      return;
    }

    window.AMap.plugin('AMap.Geocoder', () => {
      const geocoder = new window.AMap.Geocoder({ city: '全国' });

      geocoder.getLocation(addressInput, (status: string, result: any) => {
        if (status === 'complete' && result.geocodes.length) {
          const location = result.geocodes[0].location;
          map.setCenter(location);
          map.setZoom(13);
          addMarker(addressInput, location);
        } else {
          alert('无法找到该地址，请重新输入国内合法地址');
        }
      });
    });
  };

  // Fetch addresses from the backend and update the address list and address locations
  const fetchAddresses = () => {
    fetch('http://127.0.0.1:5000/getAddresses')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setAddresses(data.addresses);

          const updatedAddressLocations = data.addresses.map((addressObj: { address: string; location: { lng: number; lat: number } }) => ({
            address: addressObj.address,
            location: new window.AMap.LngLat(addressObj.location.lng, addressObj.location.lat),
          }));
          addressLocationsRef.current = updatedAddressLocations;

          const panel = document.getElementById('panel');
          if (panel) {
            panel.innerHTML = '';
          }

          for (let i = 0; i < data.addresses.length - 1; i++) {
            const start = data.addresses[i].address;
            const end = data.addresses[i + 1].address;

            const routeButton = document.createElement('button');
            routeButton.textContent = `${start} -> ${end}`;
            routeButton.className = 'route-button';
            routeButton.onclick = () => calculateRoute(i);

            if (panel) {
              panel.appendChild(routeButton);
            }
          }
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  // Delete an address and its marker from the map and backend
  const deleteAddress = (address: string) => {
    fetch('http://127.0.0.1:5000/deleteAddress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    })
      .then((response) => response.json())
      .then(() => {
        removeMarker(address);
        fetchAddresses();
      })
      .catch((error) => console.error('Error:', error));
  };

  // Clear all addresses and markers
  const clearAddresses = () => {
    fetch('http://127.0.0.1:5000/clearAddresses', { method: 'POST' })
      .then((response) => response.json())
      .catch((error) => console.error('Error:', error));
  };

  // Remove a marker from the map
  const removeMarker = (address: string) => {
    setMarkers((prevMarkers) => {
      const updatedMarkers = prevMarkers.filter((marker) => {
        if (marker.getExtData().address === address) {
          marker.setMap(null);
          return false;
        }
        return true;
      });
      return updatedMarkers;
    });
    addressLocationsRef.current = addressLocationsRef.current.filter((loc) => loc.address !== address);
  };

  // Calculate and display the driving route between two addresses
  const calculateRoute = (index: number) => {
    console.log(`计算路线 ${index + 1}...`);
    if (index >= addressLocationsRef.current.length - 1) {
      console.log(`无法计算路线 ${index + 1}，因为 ${index} >= ${addressLocationsRef.current.length - 1}`);
      return;
    }
    console.log(`addressLocations: ${JSON.stringify(addressLocationsRef.current)}`);

    window.AMap.plugin('AMap.Driving', () => {
      const driving = new window.AMap.Driving({
        map: map,
        panel: 'panel',
      });

      const start = addressLocationsRef.current[index].location;
      console.log(`start: ${start}`);
      const end = addressLocationsRef.current[index + 1].location;
      console.log(`end: ${end}`);

      console.log(`Calculating route from ${start} to ${end}`);
      driving.search(start, end, (status: string, result: any) => {
        if (status === 'complete') {
          console.log(`路线 ${index + 1} 计算成功`);
          drivingRoutesRef.current[index] = driving;
        } else {
          console.error(`路线 ${index + 1} 计算失败：` + result);
        }
      });
    });
  };

  // Clear all driving routes from the map
  const clearRoutes = () => {
    drivingRoutesRef.current.forEach((driving) => {
      if (driving) driving.clear();
    });
    drivingRoutesRef.current = [];
    console.log(`全部路线已清除`);
  };

  return (
    <div className="App">
      <div id="searchContainer">
        <input
          type="text"
          id="addressInput"
          placeholder="输入地址"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
        />
        <button onClick={searchAddress}>搜索</button>
      </div>
      <div id="mapContainer" className="mapContainer"></div>
      <div id="addressListContainer">
        <h3>已选择的地址</h3>
        <ul id="addressList">
          {addresses.map((addressObj, index) => (
            <li key={index} className="address-item">
              {addressObj.address}
              <button onClick={() => deleteAddress(addressObj.address)}>删除</button>
            </li>
          ))}
        </ul>
      </div>
      <div id="panel" className="panel"></div>
      <button id="clearRoutesButton" onClick={clearRoutes} className="clearRoutesButton">
        清除所有路线
      </button>
    </div>
  );
};

export default App;
