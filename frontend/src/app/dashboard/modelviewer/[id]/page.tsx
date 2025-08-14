'use client';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { Suspense, useState } from 'react';
import { Camera } from 'three';
import {
  cameraPresets,
  zoomPresets,
  scalePresets,
  bgColors,
} from '@/constants';

function Model({ url, scale }: { url: string; scale: number }) {
    const obj = useLoader(OBJLoader, url);
    
    return (
      <primitive 
        object={obj} 
        scale={[scale, scale, scale]}
        position={[0, 0, 0]}
      />
    );
}
const ModelViewerPage = () => {
  const [currentView, setCurrentView] = useState('perspective');
  const [cameraRef, setCameraRef] = useState<Camera | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [bgColor, setBgColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(8);
  const [modelScale, setModelScale] = useState(0.01);


  const handleViewChange = (view: string) => {
    setCurrentView(view);
    if (cameraRef) {
      const preset = cameraPresets[view];
      if (preset) {
        cameraRef.position.set(
          preset.position[0],
          preset.position[1],
          preset.position[2]
        );
        cameraRef.rotation.set(
          preset.rotation[0],
          preset.rotation[1],
          preset.rotation[2]
        );
      }
    }
  };

  const handleBgColorChange = (color: string) => {
    setBgColor(color);
    setShowColorPicker(false);
  };

  const handleZoomChange = (distance: number) => {
    setCurrentZoom(distance);
    if (cameraRef) {
      const currentPosition = cameraRef.position.clone();
      const direction = currentPosition.normalize();
      cameraRef.position.copy(direction.multiplyScalar(distance));
    }
  };

  const handleScaleChange = (scale: number) => {
    setModelScale(scale);
  };
  return <>
   <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Canvas
        camera={{ position: [3, 3, 3], fov: 75 }}
        style={{ background: bgColor }}
        onCreated={({ camera }) => setCameraRef(camera)}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <directionalLight position={[-10, -10, -5]} intensity={0.8} />
        <directionalLight position={[0, 10, 0]} intensity={0.6} />
        <directionalLight position={[0, -10, 0]} intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, -5]} intensity={0.6} />
        <pointLight position={[0, 0, 10]} intensity={0.4} />
        <pointLight position={[0, 0, -10]} intensity={0.4} />
        
        {showGrid && (
          <Grid 
            args={[10, 10]} 
            cellSize={1} 
            cellThickness={0.5} 
            cellColor="#6f6f6f" 
            sectionSize={5} 
            sectionThickness={1} 
            sectionColor="#9d4b4b" 
            fadeDistance={30} 
            fadeStrength={1} 
            followCamera={false} 
            infiniteGrid={true} 
          />
        )}
        
        <Suspense fallback={null}>
          <Model url="https://res.cloudinary.com/dlcdglbil/raw/upload/v1754076053/convertedToObj/e8taefm9dyyin7zhoaav.obj" scale={modelScale} />
        </Suspense>
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={0.05}
          maxDistance={100}
          rotateSpeed={0.8}
          panSpeed={0.8}
          zoomSpeed={1.2}
          dampingFactor={0.05}
          enableDamping={true}
          autoRotate={autoRotate}
          autoRotateSpeed={1}
          keyPanSpeed={10}
          screenSpacePanning={true}
          maxPolarAngle={Math.PI}
          minPolarAngle={0}
          maxAzimuthAngle={Infinity}
          minAzimuthAngle={-Infinity}
        />
      </Canvas>
      
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        color: 'white',
        background: 'rgba(0,0,0,0.8)',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        minWidth: '180px'
      }}>
        <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>📏 Model Scale:</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '5px', marginBottom: '10px' }}>
          {scalePresets.map((scale) => (
            <button
              key={scale.name}
              onClick={() => handleScaleChange(scale.scale)}
              style={{
                padding: '6px 12px',
                background: modelScale === scale.scale ? '#4CAF50' : '#333',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                textAlign: 'left'
              }}
            >
              {scale.name} ({scale.scale})
            </button>
          ))}
        </div>
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <input
            type="range"
            min="0.001"
            max="0.5"
            step="0.001"
            value={modelScale}
            onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
            style={{
              width: '100%',
              height: '6px',
              borderRadius: '3px',
              background: '#333',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
          <div style={{ fontSize: '11px', marginTop: '5px' }}>
            Current Scale: {modelScale.toFixed(3)}
          </div>
        </div>
      </div>
      
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '220px',
        color: 'white',
        background: 'rgba(0,0,0,0.8)',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        minWidth: '180px'
      }}>
        <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>🔍 Zoom Level:</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '5px' }}>
          {zoomPresets.map((zoom) => (
            <button
              key={zoom.name}
              onClick={() => handleZoomChange(zoom.distance)}
              style={{
                padding: '6px 12px',
                background: currentZoom === zoom.distance ? '#4CAF50' : '#333',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                textAlign: 'left'
              }}
            >
              {zoom.name} ({zoom.distance}x)
            </button>
          ))}
        </div>
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <input
            type="range"
            min="0.05"
            max="50"
            step="0.1"
            value={currentZoom}
            onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
            style={{
              width: '100%',
              height: '6px',
              borderRadius: '3px',
              background: '#333',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
          <div style={{ fontSize: '11px', marginTop: '5px' }}>
            Current: {currentZoom.toFixed(1)}x
          </div>
        </div>
      </div>
      
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        color: 'white',
        background: 'rgba(0,0,0,0.8)',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        minWidth: '200px'
      }}>
        <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>🎨 Background Color:</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginBottom: '10px' }}>
          {bgColors.slice(0, 6).map((color) => (
            <button
              key={color.value}
              onClick={() => handleBgColorChange(color.value)}
              style={{
                padding: '8px 12px',
                background: color.value,
                color: color.name === 'White' || color.name === 'Light Gray' ? '#000' : '#fff',
                border: bgColor === color.value ? '2px solid #4CAF50' : '1px solid #666',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 'bold'
              }}
            >
              {color.name}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
          {bgColors.slice(6).map((color) => (
            <button
              key={color.value}
              onClick={() => handleBgColorChange(color.value)}
              style={{
                padding: '8px 12px',
                background: color.value,
                color: color.name === 'White' || color.name === 'Light Gray' ? '#000' : '#fff',
                border: bgColor === color.value ? '2px solid #4CAF50' : '1px solid #666',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 'bold'
              }}
            >
              {color.name}
            </button>
          ))}
        </div>
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => handleBgColorChange(e.target.value)}
            style={{
              width: '100%',
              height: '30px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          />
        </div>
      </div>
      
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        background: 'rgba(0,0,0,0.8)',
        padding: '10px 15px',
        borderRadius: '8px',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          style={{
            padding: '8px 16px',
            background: autoRotate ? '#4CAF50' : '#666',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {autoRotate ? '⏸️ Stop Auto-Rotate' : '🔄 Start Auto-Rotate'}
        </button>
      </div>
      
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        background: 'rgba(0,0,0,0.8)',
        padding: '10px 15px',
        borderRadius: '8px',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <button
          onClick={() => setShowGrid(!showGrid)}
          style={{
            padding: '8px 16px',
            background: showGrid ? '#4CAF50' : '#666',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {showGrid ? '🔲 Hide Grid' : '⬜ Show Grid'}
        </button>
      </div>
      
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        color: 'white',
        background: 'rgba(0,0,0,0.8)',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        minWidth: '200px'
      }}>
        <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>📐 Perspective Views:</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
          {Object.keys(cameraPresets).map((view) => (
            <button
              key={view}
              onClick={() => handleViewChange(view)}
              style={{
                padding: '8px 12px',
                background: currentView === view ? '#4CAF50' : '#333',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                textTransform: 'capitalize'
              }}
            >
              {view}
            </button>
          ))}
        </div>
      </div>
      
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        background: 'rgba(0,0,0,0.7)',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div><strong>Controls:</strong></div>
        <div>🖱️ Left click + drag = Rotate 360°</div>
        <div>🖱️ Right click + drag = Pan</div>
        <div>🖱️ Scroll wheel = Zoom</div>
        <div>📐 Click buttons for preset views</div>
        <div>🔲 Toggle grid on/off</div>
        <div>🔄 Auto-rotate for continuous 360°</div>
        <div>🎨 Change background color</div>
        <div>🔍 Enhanced zoom controls</div>
        <div>💡 Improved lighting for all angles</div>
        <div>📏 Scale model size up/down</div>
      </div>
    </div>
    </>

};

export default ModelViewerPage;
