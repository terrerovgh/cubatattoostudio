import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.175.0/build/three.module.js';

let camera, scene, renderer, clock;

function init() {
  const container = document.getElementById('container');
  if (!container) {
    console.error('Error: container element not found for particles.');
    return;
  }

  console.log('Initializing scene and renderer for particles');

  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000); // Fondo negro
  console.log('Scene created with black background');

  // Camera setup
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
  camera.position.z = 1000;
  console.log('Camera initialized');

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 1); // Forzar el color de fondo negro con opacidad completa
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  console.log('Renderer setup complete with forced black background');

  // Clock for animation
  clock = new THREE.Clock();
  console.log('Clock initialized');

  // Load SVG as texture and create particles
  const loader = new THREE.TextureLoader();
  loader.load(
    '/logo-black.png',
    (texture) => {
      console.log('Particle texture loaded successfully:', texture);

      const geometry = new THREE.PlaneGeometry(2000, 2000); // Geometría de plano para la imagen de fondo
      const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
      const plane = new THREE.Mesh(geometry, material);

      scene.add(plane);
      console.log('Background image added to the scene:', plane);
    },
    undefined,
    (error) => {
      console.error('An error occurred while loading the particle texture:', error);
    }
  );

  // Resize handling
  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();

  // Zoom out effect
  if (camera.position.z < 3000) {
    camera.position.z += elapsedTime * 100; // Aumentar la velocidad de zoom
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

// Initialize and start the animation
init();
animate();
