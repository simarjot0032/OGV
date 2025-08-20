'use client';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { Suspense, useState, useEffect } from 'react';
import { Camera } from 'three';
import { useParams } from 'next/navigation';
import {
  cameraPresets,
  zoomPresets,
  scalePresets,
} from '@/constants';
import '@/styles/ModelViewer.scss';
import { Paragraph } from '@/components';
import { getConvertedFileURL } from '@/utils/ConvertedFileURL';

function Model({ url, scale }: { url: string; scale: number }) {
  const obj = useLoader(OBJLoader, url);

  return (
    <primitive
      object={obj}
      scale={[scale, scale, scale]}
      position={[0, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    />
  );
}

const ModelViewerPage = () => {
  const params = useParams();
  const modelId = params.id as string;
  
  const [currentView, setCurrentView] = useState('perspective');
  const [cameraRef, setCameraRef] = useState<Camera | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [currentZoom, setCurrentZoom] = useState(8);
  const [modelScale, setModelScale] = useState(0.02);
  const [modelUrl, setModelUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');


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

  useEffect(() => {
    const fetchModelUrl = async () => {
      if (!modelId) return;
      
      try {
        setIsLoading(true);
        setError('');
        const url = await getConvertedFileURL(modelId);
        setModelUrl(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load model');
        console.error('Error fetching model URL:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModelUrl();
  }, [modelId]);

  if (isLoading) {
    return (
      <div className="model-viewer-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Paragraph paragraph="Loading model..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="model-viewer-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
          <Paragraph paragraph={`Error: ${error}`} />
          <button onClick={() => window.location.reload()} style={{ marginTop: '10px', padding: '8px 16px' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="model-viewer-container">
        <Canvas
          camera={{ position: [0.5, 0.5, 0.5], fov: 75 }}
          className="model-viewer-canvas"
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
            {modelUrl && (
              <Model
                  url={modelUrl}
                scale={modelScale}
              />
            )}
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
   

        <div className="model-viewer-settings-container model-viewer-settings-container-active">
          <div className="model-viewer-settings-title">
            <h3>Settings</h3>
          </div>
          <div
          className="model-viewer-settings-item-container"
        >
          <div className="model-viewer-settings-item-title">
            Controls:
          </div>
          <div className="model-viewer-settings-item-description">
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
          <div className="model-viewer-settings-button-container">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className="model-viewer-settings-button"
              style={{
                background: showGrid ? 'transparent' : '#d0245e',
                color: showGrid ? '#000' : '#fff',
              }}
            >
              {showGrid ? 'Hide Grid' : 'Show Grid'}
            </button>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className="model-viewer-settings-button"
              style={{
                background: autoRotate ? 'transparent' : '#d0245e',
                color: autoRotate ? '#000' : '#fff',
              }}
            >
              {autoRotate ? 'Stop Auto-Rotate' : 'Start Auto-Rotate'}
            </button>
          </div>

          <div className="model-viewer-settings-item-container">
            <div className="model-viewer-settings-item-title">
              📏 Model Scale:
            </div>
            <div className="model-viewer-settings-select-item">
              {scalePresets.map((scale) => (
                <button
                  key={scale.name}
                  onClick={() => handleScaleChange(scale.scale)}
                  className="model-viewer-settings-select"
                  style={{
                    background:
                      modelScale === scale.scale ? '#d0245e' : 'transparent',
                    color: modelScale === scale.scale ? '#fff' : '#000',
                  }}
                >
                  {scale.name} ({scale.scale})
                </button>
              ))}
            </div>
            <div>
              <input
                type="range"
                min="0.001"
                max="0.5"
                step="0.001"
                value={modelScale}
                onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                className="model-viewer-settings-slider"
              />
              <Paragraph
                paragraph={`Current Scale: ${modelScale.toFixed(3)}`}
                className="model-viewer-settings-slider-value"
              />
            </div>
          </div>

          <div className="model-viewer-settings-item-container">
            <div className="model-viewer-settings-item-title">
              📐 Perspective Views:
            </div>
            <div className="model-viewer-settings-select-item">
              {Object.keys(cameraPresets).map((view) => (
                <button
                  key={view}
                  onClick={() => handleViewChange(view)}
                  className="model-viewer-settings-select"
                  style={{
                    background:
                      currentView === view ? '#d0245e' : 'transparent',
                    color: currentView === view ? '#fff' : '#000',
                  }}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>
          <div className="model-viewer-settings-item-container model-viewer-settings-color-picker-container">
            <div className="model-viewer-settings-item-title">
              🎨 Background Color:
            </div>

              <input
                type="color"
                value={bgColor}
                onChange={(e) => handleBgColorChange(e.target.value)}
                className="model-viewer-settings-color-picker"
              />
          </div>
          <div
className="model-viewer-settings-item-container"
        >
          <div className="model-viewer-settings-item-title">
            🔍 Zoom Level:
          </div>
          <div
            className="model-viewer-settings-select-item"
          >
            {zoomPresets.map((zoom) => (
              <button
                key={zoom.name}
                onClick={() => handleZoomChange(zoom.distance)}
                className="model-viewer-settings-select"
                style={{
                  background:
                    currentZoom === zoom.distance ? '#d0245e' : 'transparent',
                  color: currentZoom === zoom.distance ? '#fff' : '#000',
                }}
              >
                {zoom.name} ({zoom.distance}x)
              </button>
            ))}
          </div>
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <input
              type="range"
              min="0.5"
              max="50"
              step="0.1"
              defaultValue={0.2}
              value={currentZoom}
              onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
              className="model-viewer-settings-slider"
            />
            <Paragraph
              paragraph={`Current Zoom: ${currentZoom.toFixed(1)}x`}
              className="model-viewer-settings-slider-value"
            />
          </div>
        </div>

        </div>
      </div>
    </>
  );
};

export default ModelViewerPage;
