# 🚀 Quick Start Guide

## ⚠️ Important: Node.js Installation Required

This project requires **Node.js** to run. Currently, Node.js is not installed on your system.

### Step 1: Install Node.js

1. Download Node.js from: **https://nodejs.org/**
2. Choose the **LTS (Long Term Support)** version
3. Run the installer
4. Follow the installation wizard (use default options)
5. Restart your terminal/command prompt

### Step 2: Verify Installation

Open a new terminal and run:
```bash
node --version
npm --version
```

You should see version numbers if installed correctly.

### Step 3: Install Project Dependencies

Navigate to the project folder and install dependencies:

```bash
cd d:\3d.prototype
npm install
```

This will download and install all required packages (~200MB).

### Step 4: Start Development Server

```bash
npm run dev
```

The application will open at **http://localhost:5173**

---

## 🎮 How to Use

### First Launch

1. You'll see a **loading screen** while the 3D model initializes
2. The hologram interface will appear with a blue car model
3. Use **mouse controls** to explore:
   - **Left-click + drag**: Rotate
   - **Scroll wheel**: Zoom
   - **Right-click + drag**: Pan

### Enable Gesture Controls

1. Click the **"Gesture: OFF"** button in the right panel
2. Allow **webcam permissions** when prompted
3. A video preview will appear in the bottom-right corner
4. Position your hand in front of the camera

### Gesture Commands

| Gesture | How to Perform | Action |
|---------|---------------|--------|
| ✌️ **Two Fingers Spread** | Extend index & middle finger apart | Zoom in |
| 🤏 **Two Fingers Pinch** | Bring index & middle finger together | Zoom out |
| ✋ **Open Hand** | Extend all fingers | Explode model |
| ✊ **Closed Fist** | Curl all fingers | Assemble model |
| 👉 **Swipe Left/Right** | Move hand horizontally | Rotate model |

### Part Information

- **Hover** over any part to highlight it
- **Click** on a part to see its name and description
- Info panel appears in bottom-left corner

---

## 📁 What Was Built

✅ **Complete Project Structure** - 27 files organized in modular architecture  
✅ **3D Scene** - Hologram-style environment with animated grid  
✅ **Model System** - Procedural car with 9 separable parts  
✅ **Explosion Engine** - GSAP-powered smooth animations  
✅ **Gesture Detection** - MediaPipe Hands integration  
✅ **Interactive UI** - Control panel, part info, loading screen  
✅ **State Management** - Zustand store for app state  
✅ **Documentation** - README, walkthrough, code comments  

---

## 🔧 Customization

### Replace the Demo Model

The current model is procedurally generated. To use your own:

1. Export a **GLTF** (.gltf) or **GLB** (.glb) file from Blender/Maya
2. Ensure the model has **separate mesh parts**
3. Place file in `d:\3d.prototype\public\models\`
4. Edit `src/config/sceneConfig.ts`:

```typescript
model: {
  defaultPath: '/models/your-model.glb',
}
```

5. Edit `src/components/Model.tsx` to use `useGLTF`:

```typescript
const { scene } = useGLTF('/models/your-model.glb');
```

### Adjust Gesture Sensitivity

Edit `src/config/sceneConfig.ts`:

```typescript
gestures: {
  pinchThreshold: 0.08,    // Lower = easier to trigger
  spreadThreshold: 0.15,   // Lower = easier to trigger
  fistThreshold: 0.5,      // Lower = easier to trigger
  swipeThreshold: 0.02,    // Lower = easier to trigger
}
```

### Change Explosion Intensity

Edit `src/config/sceneConfig.ts`:

```typescript
explosion: {
  intensity: 3,      // Higher = parts spread further
  duration: 1.5,     // Animation time in seconds
}
```

---

## 🎯 Next Steps

1. ✅ **Install Node.js** (see Step 1 above)
2. ✅ **Run `npm install`** to get dependencies
3. ✅ **Run `npm run dev`** to start the app
4. 🎨 **Add your own 3D models** (supercars, jets, rockets)
5. ⚙️ **Customize colors/effects** in CSS files
6. 🚀 **Deploy** to Vercel/Netlify when ready

---

## 📚 Documentation

- **[README.md](file:///d:/3d.prototype/README.md)**: Complete documentation with all features
- **[walkthrough.md](file:///C:/Users/manis/.gemini/antigravity/brain/4446ba11-e4f3-4b9a-8e6c-e9cf5f2f6fa2/walkthrough.md)**: Detailed technical walkthrough
- **Code Comments**: Every file has inline documentation

---

## 🐛 Troubleshooting

**"npm is not recognized"**
→ Install Node.js (see Step 1)

**Webcam not working**
→ Check browser permissions, use HTTPS in production

**Model not loading**
→ Check file path and format (must be GLTF/GLB)

**Gestures not detected**
→ Ensure good lighting, adjust sensitivity in config

---

## ✨ Features at a Glance

🎨 Hologram-style 3D visualization  
👋 Real-time hand gesture controls  
💥 Exploded view with smooth animations  
🖱️ Mouse controls (fallback)  
🔍 Part selection and information  
⚡ Performance optimized  
📱 Responsive design  
🎮 Interactive UI with glassmorphism  

---

**Ready to explore? Install Node.js and run `npm run dev`!**
