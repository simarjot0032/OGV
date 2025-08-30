'use client';
import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { CrossIcon } from '@icons/Cross.icon';
import { Paragraph } from '@components/common';

interface ModelPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: File | null;
}

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

export const ModelPreviewModal: React.FC<ModelPreviewModalProps> = ({
  isOpen,
  onClose,
  file,
}) => {
  const [modelUrl, setModelUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [modelScale, setModelScale] = useState(0.02);
  const [showGrid, setShowGrid] = useState(true);

  const convertAndPreview = useCallback(async () => {
    if (!file) return;

    setIsLoading(true);
    setError('');

    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension === 'obj') {
        const url = URL.createObjectURL(file);
        setModelUrl(url);
      } else {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('outputFormat', JSON.stringify(['obj']));

        const url = process.env.NEXT_PUBLIC_BACKEND_URL;
        const response = await fetch(`${url}`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setModelUrl(url);
        } else {
          throw new Error('Failed to convert file');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert file');
      console.error('Conversion error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [file]);

  useEffect(() => {
    if (isOpen && file) {
      void convertAndPreview();
    }
  }, [isOpen, file, convertAndPreview]);

  if (!isOpen) return null;

  return (
    <div className="model-preview-modal-overlay">
      <div className="model-preview-modal">
        <div className="model-preview-modal-header">
          <h3>3D Model Preview</h3>
          <CrossIcon
            color="#000"
            onClick={onClose}
            width={35}
            height={35}
            className="model-preview-modal-close"
          />
        </div>

        <div className="model-preview-modal-content">
          {isLoading && (
            <div className="model-preview-loading">
              <Paragraph paragraph="Converting and loading model..." />
            </div>
          )}

          {error && (
            <div className="model-preview-error">
              <Paragraph paragraph={`Error: ${error}`} />
              <button
                onClick={convertAndPreview}
                className="model-preview-retry"
              >
                Retry
              </button>
            </div>
          )}

          {modelUrl && !isLoading && !error && (
            <>
              <div className="model-preview-controls">
                <div className="model-preview-control-row">
                  <div className="model-preview-scale-control">
                    <Paragraph paragraph="Scale:" />
                    <input
                      type="range"
                      min="0.001"
                      max="0.1"
                      step="0.001"
                      value={modelScale}
                      onChange={(e) =>
                        setModelScale(parseFloat(e.target.value))
                      }
                      className="model-preview-scale-slider"
                    />
                    <Paragraph paragraph={modelScale.toFixed(3)} />
                  </div>
                  <div className="model-preview-grid-control">
                    <Paragraph paragraph="Grid:" />
                    <button
                      onClick={() => setShowGrid(!showGrid)}
                      className={`model-preview-grid-toggle ${showGrid ? 'active' : ''}`}
                    >
                      {showGrid ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="model-preview-canvas-container">
                <Canvas
                  camera={{ position: [0.5, 0.5, 0.5], fov: 75 }}
                  className="model-preview-canvas"
                  style={{ background: '#f0f0f0' }}
                >
                  <ambientLight intensity={0.6} />
                  <directionalLight position={[10, 10, 5]} intensity={1.2} />
                  <directionalLight position={[-10, -10, -5]} intensity={0.8} />

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
                    <Model url={modelUrl} scale={modelScale} />
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
                    keyPanSpeed={10}
                    screenSpacePanning={true}
                    maxPolarAngle={Math.PI}
                    minPolarAngle={0}
                    maxAzimuthAngle={Infinity}
                    minAzimuthAngle={-Infinity}
                  />
                </Canvas>
              </div>

              <div className="model-preview-instructions">
                <Paragraph
                  paragraph="Controls:"
                  className="model-preview-instructions-title"
                />
                <Paragraph paragraph="Left click + drag = Rotate" />
                <Paragraph paragraph="Right click + drag = Pan" />
                <Paragraph paragraph="Scroll wheel = Zoom" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
