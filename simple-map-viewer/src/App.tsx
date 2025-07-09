import { useState, useEffect } from 'react';
import './App.css';
import Map from './components/Map';
import LayerControl from './components/LayerControl';
import type { LayerDefinition } from './types/GeoTypes';

// Import GeoJSON data
import parksData from './data/parks.json';
import roadsData from './data/roads.json';

function App() {
  const [layers, setLayers] = useState<LayerDefinition[]>([
    {
      id: 'parks',
      name: 'Parks',
      data: parksData,
      visible: true
    },
    {
      id: 'roads',
      name: 'Roads',
      data: roadsData,
      visible: true
    }
  ]);

  // Handle layer visibility toggle
  const handleLayerToggle = (id: string, visible: boolean) => {
    setLayers(prevLayers => 
      prevLayers.map(layer => 
        layer.id === id ? { ...layer, visible } : layer
      )
    );
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Simple Map Viewer</h1>
      </header>
      <div className="main-content">
        <div className="sidebar">
          <LayerControl 
            layers={layers} 
            onLayerToggle={handleLayerToggle} 
          />
        </div>
        <div className="map-container">
          <Map 
            center={[40.75, -73.98]} 
            zoom={12} 
            layers={layers} 
          />
        </div>
      </div>
    </div>
  );
}

export default App;
