import React, { useState } from 'react';
import Chatbot from '../components/Chatbot';
import Map from './MapComponent';

const MainComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('itinerary');

  return (
    <div className="container mx-auto p-6 bg-white bg-opacity-90 border-4 border-customPink rounded-lg shadow-xl max-w-screen-md">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-4 text-customLightPink">Trip Genius✨</h1>
        <div className="flex justify-center gap-4">
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'itinerary' ? 'bg-customOrange text-white' : 'bg-customBrown'} transition duration-300`}
            onClick={() => setActiveTab('itinerary')}
          >
            Itinerary
          </button>
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'info' ? 'bg-customOrange text-white' : 'bg-customBrown'} transition duration-300`}
            onClick={() => setActiveTab('info')}
          >
            Country Info
          </button>
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'map' ? 'bg-customOrange text-white' : 'bg-customBrown'} transition duration-300`}
            onClick={() => setActiveTab('map')}
          >
            Map
          </button>
        </div>
      </header>

      <main className="content mt-6">
        {activeTab === 'itinerary' && (
          <div>
            <h2 className="text-2xl font-bold text-customLightPink">Itinerary</h2>
			<Chatbot/>
          </div>
        )}
        {activeTab === 'info' && (
          <div>
            <h2 className="text-2xl font-bold text-customLightPink">Country Info</h2>
            <p className="text-customLightPink">This is the country info content.</p>
          </div>
        )}
        {activeTab === 'map' && (
          <div>
            <h2 className="text-2xl font-bold text-customLightPink">Map</h2>
            <Map />
          </div>
        )}
      </main>
    </div>
  );
};

export default MainComponent;
