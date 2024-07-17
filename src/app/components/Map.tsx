import React, { useState, useEffect } from 'react';
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
  const [addressLocations, setAddressLocations] = useState<{ address: string; location: any }[]>([]);
  const [drivingRoutes, setDrivingRoutes] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<{ address: string }[]>([]);
  const [addressInput, setAddressInput] = useState('');

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

  useEffect(() => {
    if (map) {
      map.on('rightclick', handleMapRightClick);
    }
  }, [map]);

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

  const addMarker = (address: string, location: any) => {
    const marker = new window.AMap.Marker({
      position: location,
      map,
      extData: { address },
    });
    setMarkers((prevMarkers) => [...prevMarkers, marker]);
    setAddressLocations((prevLocations) => [...prevLocations, { address, location }]);

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

  const fetchAddresses = () => {
    fetch('http://127.0.0.1:5000/getAddresses')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setAddresses(data.addresses);

          // 清空当前路线按钮
          const panel = document.getElementById('panel');
          if (panel) {
            panel.innerHTML = '';
          }

          // 为每两个连续的地点生成路线按钮
          for (let i = 0; i < data.addresses.length - 1; i++) {
            const start = data.addresses[i].address;
            const end = data.addresses[i + 1].address;

            const routeButton = document.createElement('button');
            routeButton.textContent = `${start} -> ${end}`;
            routeButton.className = 'route-button';
            routeButton.onclick = function () {
              calculateRoute(i);
            };

            if (panel) {
              panel.appendChild(routeButton);
            }
          }
        }
      })
      .catch((error) => console.error('Error:', error));
  };

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

  const clearAddresses = () => {
    fetch('http://127.0.0.1:5000/clearAddresses', { method: 'POST' })
      .then((response) => response.json())
      .catch((error) => console.error('Error:', error));
  };

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
    setAddressLocations((prevLocations) => prevLocations.filter((loc) => loc.address !== address));
  };

  const calculateRoute = (index: number) => {
    if (index >= addressLocations.length - 1) {
      return;
    }

    window.AMap.plugin('AMap.Driving', () => {
      const driving = new window.AMap.Driving({
        map: map,
        panel: 'panel',
      });

      const start = addressLocations[index].location;
      const end = addressLocations[index + 1].location;

      console.log(`Calculating route from ${start} to ${end}`);
      driving.search(start, end, (status: string, result: any) => {
        if (status === 'complete') {
          console.log(`路线 ${index + 1} 计算成功`);
          const newDrivingRoutes = [...drivingRoutes];
          newDrivingRoutes[index] = driving;
          setDrivingRoutes(newDrivingRoutes);
        } else {
          console.error(`路线 ${index + 1} 计算失败：` + result);
        }
      });
    });
  };

  const clearRoutes = () => {
    drivingRoutes.forEach((driving) => {
      if (driving) driving.clear();
    });
    console.log(`全部路线已清除`);
    setDrivingRoutes([]);
    fetchAddresses(); // 保留面板内容，以便用户可以再次点击按钮查看路线
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
