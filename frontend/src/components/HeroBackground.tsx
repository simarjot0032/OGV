'use client';
import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadFull } from 'tsparticles';
import type { Engine } from '@tsparticles/engine';
import { ParticlesOptions } from '@app-types/ParticlesTypes';

export const HeroBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    const initParticles = async () => {
      await initParticlesEngine(async (engine: Engine) => {
        await loadFull(engine);
      });
      setInit(true);
    };
    void initParticles();
  }, []);

  return (
    <>
      {init && (
        <>
          <Particles
            id="particles"
            options={ParticlesOptions}
            className="particles"
          />
        </>
      )}
    </>
  );
};
