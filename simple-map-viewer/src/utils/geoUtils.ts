import type { FeatureProperties, GeoJSONFeature } from '../types/GeoTypes';
import L from 'leaflet';

/**
 * Creates a style function for GeoJSON features
 * @param defaultColor Default color to use if not specified in properties
 * @returns A style function for Leaflet GeoJSON
 */
export const createStyleFunction = (defaultColor: string = '#3388ff') => {
  return (feature?: any) => {
    return {
      color: feature?.properties?.color || defaultColor,
      weight: 2,
      opacity: 0.7,
      fillOpacity: 0.5
    };
  };
};

/**
 * Creates a popup content string from feature properties
 * @param feature GeoJSON feature with properties
 * @returns HTML string for popup content
 */
export const createPopupContent = (feature: GeoJSONFeature): string => {
  const props = feature.properties;
  if (!props) return 'No properties available';
  
  return `
    <div class="feature-popup">
      <h3>${props.title || 'Unnamed Feature'}</h3>
      <p>${props.description || 'No description available'}</p>
    </div>
  `;
};

/**
 * Binds popup to a feature layer
 * @param feature GeoJSON feature
 * @param layer Leaflet layer
 */
export const bindFeaturePopup = (feature: GeoJSONFeature, layer: L.Layer): void => {
  if (!feature.properties) return;
  
  layer.bindPopup(createPopupContent(feature));
};
