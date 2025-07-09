import { useState, useEffect } from 'react';
import type { LayerDefinition } from '../types/GeoTypes';

interface LayerControlProps {
  layers: LayerDefinition[];
  onLayerToggle: (id: string, visible: boolean) => void;
}

const LayerControl = ({ layers, onLayerToggle }: LayerControlProps) => {
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({});

  // Initialize visible layers from props
  useEffect(() => {
    const initialVisibility: Record<string, boolean> = {};
    layers.forEach(layer => {
      initialVisibility[layer.id] = layer.visible;
    });
    setVisibleLayers(initialVisibility);
  }, []);

  // Handle checkbox change
  const handleToggle = (id: string, checked: boolean) => {
    setVisibleLayers(prev => ({
      ...prev,
      [id]: checked
    }));
    onLayerToggle(id, checked);
  };

  return (
    <div className="layer-control">
      <h3>Layers</h3>
      <div className="layer-list">
        {layers.map(layer => (
          <div key={layer.id} className="layer-item">
            <label>
              <input
                type="checkbox"
                checked={visibleLayers[layer.id] ?? layer.visible}
                onChange={(e) => handleToggle(layer.id, e.target.checked)}
              />
              {layer.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayerControl;
