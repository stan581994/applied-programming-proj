# Overview

This project is a simple map viewer application built with React, TypeScript, and Leaflet. It allows users to view and toggle different GeoJSON layers on an interactive map. The application currently displays parks and roads data for a section of New York City.

The project demonstrates:
- Integration of Leaflet maps in a React application
- Working with GeoJSON data
- Layer management and visibility toggling
- TypeScript for type safety

{Provide a link to your YouTube demonstration. It should be a one minute demo of the software running and a walkthrough of the code.}

[Software Demo Video](https://www.youtube.com/watch?v=z6tOF3Upmsw)

# Development Environment

To work with this project, you'll need:

- Node.js (latest LTS version recommended)
- npm or yarn package manager
- A modern web browser

The project uses the following technologies:
- React 19
- TypeScript
- Vite (for fast development and building)
- Leaflet (for interactive maps)
- ESLint (for code quality)

# Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```
4. Open your browser and navigate to the URL shown in the terminal (typically http://localhost:5173)

# Building for Production

To create a production build:
```bash
npm run build
```

The built files will be in the `dist` directory and can be deployed to any static hosting service.

# Project Structure

- `src/components/` - React components including Map and LayerControl
- `src/data/` - GeoJSON data files for parks and roads
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions for working with GeoJSON and Leaflet

# Useful Websites

* [React Documentation](https://react.dev/)
* [TypeScript Documentation](https://www.typescriptlang.org/docs/)
* [Leaflet Documentation](https://leafletjs.com/reference.html)
* [GeoJSON Specification](https://geojson.org/)
* [Vite Documentation](https://vitejs.dev/guide/)
