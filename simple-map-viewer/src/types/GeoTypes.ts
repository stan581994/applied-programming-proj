export interface FeatureProperties {
  title?: string;
  description?: string;
  color?: string;
  [key: string]: any;
}

// Define a more flexible GeoJSON type for imported JSON files
export interface GeoJSONFeature {
  type: string;
  properties: FeatureProperties;
  geometry: {
    type: string;
    coordinates: number[][] | number[][][] | number[][][][];
  };
}

export interface GeoJSONLayer {
  type: string;
  features: GeoJSONFeature[];
}

export interface LayerDefinition {
  id: string;
  name: string;
  data: GeoJSONLayer;
  visible: boolean;
}
