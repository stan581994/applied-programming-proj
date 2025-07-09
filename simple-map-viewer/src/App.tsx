import { useState, useEffect } from 'react';
import './App.css';
import Map from './components/Map';
import LayerControl from './components/LayerControl';
import type { LayerDefinition } from './types/GeoTypes';

// Import GeoJSON data
import parksData from './data/parks.json';
import roadsData from './data/roads.json';

// Basic Requirement 1: Display output to the terminal
console.log('Application initialized');
console.log('Loaded GeoJSON data:', { parks: parksData, roads: roadsData });

// Basic Requirement 3: Classes
class MapDataManager {
  private layers: LayerDefinition[];
  
  constructor(initialLayers: LayerDefinition[]) {
    this.layers = initialLayers;
    console.log('MapDataManager initialized with layers:', this.layers.length);
  }
  
  getLayers(): LayerDefinition[] {
    return this.layers;
  }
  
  toggleLayerVisibility(id: string, visible: boolean): LayerDefinition[] {
    this.layers = this.layers.map(layer => 
      layer.id === id ? { ...layer, visible } : layer
    );
    return this.layers;
  }
  
  // Basic Requirement 2: Recursion
  findLayerById(id: string, layers = this.layers, index = 0): LayerDefinition | null {
    // Base case: end of array
    if (index >= layers.length) {
      return null;
    }
    
    // Found the layer
    if (layers[index].id === id) {
      return layers[index];
    }
    
    // Recursive case: check next layer
    return this.findLayerById(id, layers, index + 1);
  }
}

// Basic Requirement 5: Asynchronous functions
async function fetchAdditionalData(url: string): Promise<any> {
  try {
    console.log(`Fetching data from: ${url}`);
    // This is a simulation since we're not actually fetching external data
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, message: 'Data fetched successfully' });
      }, 1000);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return { success: false, error };
  }
}

function App() {
  // Basic Requirement 4: Lists
  const initialLayersList: LayerDefinition[] = [
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
  ];
  
  const [layers, setLayers] = useState<LayerDefinition[]>(initialLayersList);
  const [dataManager] = useState(new MapDataManager(initialLayersList));
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle layer visibility toggle
  const handleLayerToggle = (id: string, visible: boolean) => {
    console.log(`Toggling layer visibility: ${id} -> ${visible}`);
    setLayers(prevLayers => 
      prevLayers.map(layer => 
        layer.id === id ? { ...layer, visible } : layer
      )
    );
    
    // Using our class method
    const updatedLayers = dataManager.toggleLayerVisibility(id, visible);
    console.log('Updated layers through class:', updatedLayers);
  };
  
  // Using async function
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      console.log('Loading additional data...');
      
      try {
        const result = await fetchAdditionalData('https://example.com/api/mapdata');
        console.log('Async data loading result:', result);
      } catch (error) {
        console.error('Error in async operation:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Using recursion through class method
    const parkLayer = dataManager.findLayerById('parks');
    console.log('Found park layer using recursive search:', parkLayer);
  }, [dataManager]);

  return (
    <div className="app-container">
      <header className="header">
        <h1>Simple Map Viewer</h1>
        {isLoading && <div className="loading-indicator">Loading additional data...</div>}
      </header>
      <div className="main-content">
        <div className="sidebar">
          <LayerControl 
            layers={layers} 
            onLayerToggle={handleLayerToggle} 
          />
          <div className="debug-info">
            <p>Active Layers: {layers.filter(l => l.visible).length}/{layers.length}</p>
          </div>
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
