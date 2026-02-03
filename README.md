# 3D Hologram Visualization - Interactive Prototype

A web-based interactive 3D visualization system featuring hologram-style rendering and hand gesture controls for exploring complex machines like supercars, jets, and rockets.

## 🌟 Features

- **Hologram-Style 3D Rendering**: Futuristic visualization with animated grid, dramatic lighting, and glow effects
- **Hand Gesture Control**: Real-time gesture detection using MediaPipe Hands
  - ✌️ Two fingers spread → Zoom in
  - 🤏 Two fingers pinch → Zoom out
  - ✋ Open hand → Explode model
  - ✊ Closed fist → Assemble model
  - 👉 Horizontal swipe → Rotate model
- **Exploded View**: Smooth GSAP-powered animations to dismantle and reassemble 3D models
- **Interactive Parts**: Hover highlighting and click to view part information
- **Mouse Controls**: Fallback orbit controls for rotation, zoom, and pan
- **Responsive Design**: Works on desktop and tablet devices
- **Performance Optimized**: Throttled gesture updates and efficient rendering

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool and dev server
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Helpful Three.js utilities

### 3D Graphics
- **Three.js** - WebGL 3D library
- **GSAP** - Smooth animation library

### Computer Vision
- **MediaPipe Hands** - Hand tracking and landmark detection
- **Webcam API** - Browser camera access

### State Management
- **Zustand** - Lightweight state management

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Modern browser** with WebGL 2.0 support (Chrome or Edge recommended)
- **Webcam** (for gesture controls)

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The application will open at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## 📖 Usage Guide

### Mouse Controls (Default)

- **Left Click + Drag**: Rotate camera around model
- **Right Click + Drag**: Pan camera
- **Scroll Wheel**: Zoom in/out
- **Click on Part**: View part information

### Gesture Controls

1. Click the **Gesture: OFF** button to enable webcam
2. Allow webcam permissions when prompted
3. Position your hand in front of the camera
4. Perform gestures:

| Gesture | Action |
|---------|--------|
| Two fingers spread (✌️ apart) | Zoom in |
| Two fingers pinch (🤏 together) | Zoom out |
| Open hand (✋ all fingers extended) | Explode model |
| Closed fist (✊ all fingers curled) | Assemble model |
| Swipe left/right (👉 move hand) | Rotate model |

### Manual Controls

- **Explode/Assemble Button**: Toggle dismantled view
- **Guide Button**: Show/hide gesture reference

## 📁 Project Structure

```
3d.prototype/
├── public/
│   └── models/              # 3D model files (GLTF/GLB)
├── src/
│   ├── components/
│   │   ├── UI/
│   │   │   ├── ControlPanel.tsx    # Control buttons and gesture guide
│   │   │   ├── LoadingScreen.tsx   # Loading state component
│   │   │   └── PartInfo.tsx        # Part information panel
│   │   ├── Scene.tsx               # Main Three.js scene
│   │   ├── HologramEnvironment.tsx # Lighting and effects
│   │   ├── Model.tsx               # 3D model renderer
│   │   ├── Controls.tsx            # Camera controls
│   │   └── GestureDetector.tsx     # Hand tracking component
│   ├── config/
│   │   └── sceneConfig.ts          # Scene and gesture settings
│   ├── store/
│   │   └── useAppStore.ts          # Global state management
│   ├── utils/
│   │   ├── gestureRecognition.ts   # Gesture detection logic
│   │   ├── gestureActions.ts       # Map gestures to actions
│   │   ├── modelParser.ts          # Parse 3D model parts
│   │   └── performance.ts          # Performance utilities
│   ├── App.tsx                     # Main application component
│   ├── main.tsx                    # Application entry point
│   ├── index.css                   # Global styles
│   └── App.css                     # App-level styles
├── index.html                      # HTML entry point
├── vite.config.ts                  # Vite configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies and scripts
```

## 🎨 Customization

### Adding Your Own 3D Models

1. Export your model as **GLTF** or **GLB** format from Blender, Maya, or other 3D software
2. Ensure the model has **separate mesh parts** for explosion effects
3. Place the file in `public/models/`
4. Update `src/config/sceneConfig.ts`:

```typescript
model: {
  defaultPath: '/models/your-model.glb',
  scale: 1,
  position: [0, 0, 0],
}
```

5. Modify `src/components/Model.tsx` to use `useGLTF`:

```typescript
const { scene } = useGLTF(SCENE_CONFIG.model.defaultPath);
```

### Adjusting Gesture Sensitivity

Edit `src/config/sceneConfig.ts`:

```typescript
gestures: {
  zoomSensitivity: 0.01,      // Higher = faster zoom
  rotateSensitivity: 0.005,   // Higher = faster rotation
  pinchThreshold: 0.08,       // Finger distance for pinch
  spreadThreshold: 0.15,      // Finger distance for spread
  fistThreshold: 0.5,         // Hand closure for fist
  swipeThreshold: 0.02,       // Movement speed for swipe
}
```

### Changing Explosion Intensity

Edit `src/config/sceneConfig.ts`:

```typescript
explosion: {
  intensity: 3,           // Distance parts move (higher = more dramatic)
  duration: 1.5,          // Animation duration in seconds
  ease: 'power2.inOut',   // GSAP easing function
}
```

## 🐛 Troubleshooting

### Webcam Not Working

- **Check permissions**: Ensure your browser has webcam access
- **HTTPS required**: MediaPipe requires HTTPS in production (use localhost for development)
- **Browser compatibility**: Use Chrome or Edge for best support

### Model Not Loading

- **Check file path**: Ensure the model file exists in `public/models/`
- **Check console**: Look for loading errors in browser DevTools
- **File format**: Ensure the model is GLTF (.gltf) or GLB (.glb)

### Performance Issues

- **Reduce gesture throttle**: Lower `throttleMs` in `sceneConfig.ts`
- **Simplify model**: Use models with fewer polygons
- **Disable shadows**: Set `castShadow: false` in scene config
- **Lower resolution**: Reduce canvas DPR in `Scene.tsx`

### Gestures Not Detected

- **Lighting**: Ensure good lighting on your hand
- **Distance**: Keep hand 1-2 feet from camera
- **Background**: Use a simple background
- **Sensitivity**: Adjust thresholds in `sceneConfig.ts`

## 🔧 Advanced Configuration

### Scene Lighting

Edit `src/components/HologramEnvironment.tsx` to customize:
- Ambient light intensity and color
- Spotlight position and intensity
- Hemisphere light colors
- Fog distance and color

### Part Information

Edit `src/utils/modelParser.ts` in the `getPartMetadata()` function to customize part descriptions based on naming patterns.

### Camera Limits

Edit `src/config/sceneConfig.ts`:

```typescript
camera: {
  fov: 50,                    // Field of view
  minDistance: 3,             // Minimum zoom distance
  maxDistance: 20,            // Maximum zoom distance
  minPolarAngle: Math.PI / 6, // Minimum vertical angle
  maxPolarAngle: Math.PI / 2, // Maximum vertical angle
}
```

## 📝 Code Comments

The codebase is extensively commented to explain:
- Gesture recognition algorithms
- 3D transformation logic
- Animation timing
- State management flow
- Performance optimizations

## 🚧 Current Limitations

- **Single hand tracking**: Only one hand detected at a time
- **Procedural model**: Uses a demo car model (replace with real GLTF files)
- **No physics**: Explosions use fixed directions, not physics simulation
- **Browser-only**: No mobile app version (PWA possible)

## 🔮 Future Enhancements

- [ ] Support for multiple 3D models (switchable)
- [ ] AR mode using WebXR
- [ ] Two-hand gestures
- [ ] Custom ML gesture training
- [ ] Model annotation tools
- [ ] Share/export exploded views
- [ ] VR headset support

## 📄 License

This project is provided as-is for demonstration purposes.

## 🙏 Acknowledgments

- **Three.js** - 3D graphics library
- **MediaPipe** - Hand tracking ML models
- **GSAP** - Animation platform
- **React Three Fiber** - React integration for Three.js

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for errors
3. Ensure all dependencies are installed correctly
4. Verify webcam permissions are granted

---

**Built with ❤️ using React, Three.js, and MediaPipe**
