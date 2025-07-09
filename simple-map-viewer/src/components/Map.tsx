import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { GeoJSONLayer, LayerDefinition, GeoJSONFeature } from '../types/GeoTypes';
import { createStyleFunction, bindFeaturePopup } from '../utils/geoUtils';

interface MapProps {
  center: [number, number];
  zoom: number;
  layers?: LayerDefinition[];
}

const Map = ({ center, zoom, layers = [] }: MapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<Record<string, L.GeoJSON>>({});

  // Initialize map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // Create map instance
      mapRef.current = L.map(mapContainerRef.current).setView(center, zoom);
      
      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }
    
    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, zoom]);

  // Handle layers
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Add new layers or update existing ones
    layers.forEach(layer => {
      const { id, data, visible } = layer;
      
      // Check if layer already exists
      if (id in layersRef.current) {
        const existingLayer = layersRef.current[id];
        
        // Update visibility
        if (visible && mapRef.current && !mapRef.current.hasLayer(existingLayer)) {
          existingLayer.addTo(mapRef.current);
        } else if (!visible && mapRef.current && mapRef.current.hasLayer(existingLayer)) {
          existingLayer.removeFrom(mapRef.current);
        }
      } else {
        // Create new layer
        // Convert our custom GeoJSON type to a format Leaflet can understand
        const geoJsonData = {
          type: "FeatureCollection",
          features: data.features.map(f => ({
            type: f.type,
            properties: f.properties,
            geometry: f.geometry
          }))
        };
        
        const newLayer = L.geoJSON(geoJsonData as any, {
          style: createStyleFunction(data.features[0]?.properties?.color),
          onEachFeature: (feature, layer) => {
            // Convert to our custom feature type
            const customFeature = feature as unknown as GeoJSONFeature;
            bindFeaturePopup(customFeature, layer);
          }
        });
        
        // Add to map if visible
        if (visible && mapRef.current) {
          newLayer.addTo(mapRef.current);
        }
        
        // Store in ref
        layersRef.current[id] = newLayer;
      }
    });
    
    // Remove layers that are no longer in the props
    const layerIds = new Set(layers.map(l => l.id));
    Object.entries(layersRef.current).forEach(([id, layer]) => {
      if (!layerIds.has(id)) {
        if (mapRef.current?.hasLayer(layer)) {
          layer.removeFrom(mapRef.current);
        }
        delete layersRef.current[id];
      }
    });
  }, [layers]);

  return (
    <div 
      ref={mapContainerRef} 
      style={{ 
        height: '100%', 
        width: '100%',
        minHeight: '500px'
      }}
    />
  );
};

export default Map;
