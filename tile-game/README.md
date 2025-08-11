# Overview

As a software engineer, I developed this 2D Tile Adventure Game to deepen my understanding of game development principles and JavaScript frameworks. This project serves as a comprehensive learning exercise in implementing core game mechanics, physics systems, and interactive user interfaces using modern web technologies.

## Game Description

This is a complete 2D tile-based adventure game featuring:
- **Player Character**: Control an adventurer using arrow keys or WASD
- **Combat System**: Engage enemies with a 3-hit combo attack system using spacebar
- **Enemy AI**: Face intelligent orc enemies with patrol behaviors and proximity-based attacks
- **Collectibles**: Gather 8 coins scattered throughout the level (10 points each)
- **Health System**: Manage a 3-heart health system with invulnerability periods
- **Scoring**: Earn points for collecting coins (10pts), hitting enemies (5pts), and defeating enemies (25pts)
- **Victory Condition**: Collect all coins while surviving enemy encounters

## Purpose

This software was created to:
- Master Phaser.js game development framework
- Understand game architecture and design patterns
- Practice JavaScript ES6+ features and object-oriented programming
- Learn physics-based collision detection and response systems
- Implement AI behavior patterns and state management
- Create a complete, playable game that serves as a portfolio piece

## Demo Video

[Software Demo Video](https://www.youtube.com/watch?v=etmvesQkGbc&feature=youtu.be)

# Development Environment

## Game Frameworks & Technologies

### Core Framework
- **[Phaser.js 3.70.0](https://phaser.io/)** - Main game engine
  - **Physics Engine**: Arcade Physics (built-in, gravity disabled for top-down gameplay)
  - **Rendering**: WebGL with Canvas fallback for maximum compatibility
  - **Input System**: Keyboard event handling for WASD and arrow key controls
  - **Animation System**: Built-in sprite animation with frame-based sequences
  - **Scene Management**: Single scene architecture for educational simplicity

### Web Technologies
- **HTML5** - Game container and structure
- **CSS3** - Styling and responsive layout
- **JavaScript ES6+** - Core game logic and object-oriented programming
- **Canvas API** - 2D rendering context (via Phaser.js)
- **WebGL** - Hardware-accelerated graphics (primary renderer)

### Development Tools
- **Visual Studio Code** - Primary IDE with Live Server extension
- **Git** - Version control and project management
- **GitHub** - Repository hosting and collaboration
- **Browser DevTools** - Debugging and performance monitoring

### Asset Management
- **Phaser Graphics API** - Procedural sprite generation for tiles, coins, and UI elements
- **External Sprite Sheets** - Character animations (Adventurer and Orc sprites)
- **CDN Delivery** - Phaser.js loaded from jsDelivr CDN for optimal performance

### Architecture Patterns
- **Single Scene Pattern** - Simplified game structure for educational purposes
- **Component-based Design** - Organized physics groups and collision systems
- **State Management** - Boolean flags and class properties for game state
- **Timer-based Systems** - Reliable timing for combat and invulnerability mechanics

## Programming Language & Libraries

**Primary Language**: JavaScript (ES6+)
- Classes and inheritance for game objects
- Arrow functions and modern syntax
- Destructuring and template literals
- Async/await patterns for resource loading

**Core Library**: Phaser.js 3.70.0
- Comprehensive 2D game framework
- Built-in physics engine (Arcade Physics)
- Sprite and animation management
- Input handling and event systems
- Scene and camera management

**No Build Dependencies**: The project runs directly in browsers without compilation, making it accessible for learning and modification.

# Useful Websites

* [Phaser.js Official Documentation](https://photonstorm.github.io/phaser3-docs/) - Comprehensive API reference
* [Phaser.js Examples](https://phaser.io/examples) - Code examples and tutorials
* [MDN Web Docs - Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) - Canvas rendering fundamentals
* [JavaScript.info](https://javascript.info/) - Modern JavaScript concepts and patterns
* [Game Programming Patterns](https://gameprogrammingpatterns.com/) - Software architecture for games
* [Craftpix.net](https://craftpix.net/) - Source for character sprite sheets
* [jsDelivr CDN](https://www.jsdelivr.com/) - Fast, reliable CDN for Phaser.js delivery

# Future Work

* **Audio System** - Add sound effects for attacks, coin collection, and background music
* **Particle Effects** - Implement visual effects for combat impacts and coin sparkles
* **Multiple Levels** - Create additional tile maps with increasing difficulty
* **Mobile Support** - Add touch controls and responsive design for mobile devices
* **Save System** - Implement localStorage for progress persistence and high scores
* **Advanced Enemy AI** - Add pathfinding algorithms and varied enemy behaviors
* **Power-up System** - Create temporary abilities and health restoration items
* **Level Editor** - Build a tool for creating custom levels and sharing them
* **Multiplayer Mode** - Add local or online cooperative gameplay
* **Performance Optimization** - Implement object pooling and advanced rendering techniques
