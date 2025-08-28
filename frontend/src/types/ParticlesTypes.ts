import type { IOptions, RecursivePartial } from '@tsparticles/engine';

export const ParticlesOptions: RecursivePartial<IOptions> = {
  fullScreen: { enable: false },
  fpsLimit: 120,
  background: { color: 'transparent' },
  particles: {
    number: {
      value: 20,
      density: { enable: false },
    },
    color: { value: '#ffffff' },
    shape: { type: 'triangle' },
    opacity: { value: 0.6 },
    size: { value: { min: 4, max: 6 } },
    move: { enable: true, speed: 1, outModes: { default: 'bounce' } },
    links: {
      enable: true,
      distance: 100,
      color: '#ffffff',
      opacity: 0.3,
      width: 1,
    },
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: 'trail' },
      onClick: { enable: true, mode: 'push' },
    },
    modes: {
      trail: {
        delay: 0.01,
        quantity: 2,
        particles: {
          color: { value: '#d0245e' },
          shape: { type: ['circle', 'triangle'] },
          size: { value: { min: 2, max: 4 } },
          links: { enable: false },
          life: { duration: { value: 2 }, count: 1 },
          move: { speed: 2 },
        },
      },
      push: {
        quantity: 4,
        particles: {
          color: { value: '#14b8a6' },
          shape: { type: 'square' },
          size: { value: { min: 2, max: 5 } },
          links: { enable: false },
          life: { duration: { value: 3 }, count: 1 },
          move: { speed: 3 },
        },
      },
    },
  },
  detectRetina: true,
};
