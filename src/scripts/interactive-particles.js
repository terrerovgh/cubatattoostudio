import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.175.0/build/three.module.js';

let camera, scene, renderer, particles, clock;

function init() {
  const container = document.getElementById('container');
  if (!container) {
    console.error('Error: container element not found for particles.');
    return;
  }

  console.log('Initializing scene and renderer');

  // Scene setup
  scene = new THREE.Scene();
  console.log('Scene created');

  // Camera setup
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
  camera.position.z = 1000;
  console.log('Camera initialized');

  // Renderer setup
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  console.log('Renderer setup complete');

  // Clock for animation
  clock = new THREE.Clock();
  console.log('Clock initialized');

  // Load SVG as texture and create particles
  const loader = new THREE.TextureLoader();
  loader.load('/logo-stack.svg', (texture) => {
    console.log('Texture loaded successfully');
    const geometry = new THREE.InstancedBufferGeometry();

    // Define a quad for each particle
    const positions = new Float32Array([
      -0.5, 0.5, 0.0,
      0.5, 0.5, 0.0,
      -0.5, -0.5, 0.0,
      0.5, -0.5, 0.0
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const uvs = new Float32Array([
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      1.0, 1.0
    ]);
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    geometry.setIndex(new THREE.BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1));

    // Instanced attributes
    const numParticles = 10000;
    const offsets = new Float32Array(numParticles * 3);
    const angles = new Float32Array(numParticles);

    for (let i = 0; i < numParticles; i++) {
      offsets[i * 3 + 0] = Math.random() * 2000 - 1000;
      offsets[i * 3 + 1] = Math.random() * 2000 - 1000;
      offsets[i * 3 + 2] = Math.random() * 2000 - 1000;

      angles[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute('offset', new THREE.InstancedBufferAttribute(offsets, 3));
    geometry.setAttribute('angle', new THREE.InstancedBufferAttribute(angles, 1));

    // Material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: texture },
        time: { value: 0.0 }
      },
      vertexShader: `
        attribute vec3 offset;
        attribute float angle;
        uniform float time;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vec3 pos = position;
          pos.x += sin(time + offset.y) * 0.1;
          pos.y += cos(time + offset.x) * 0.1;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(offset + pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        varying vec2 vUv;

        void main() {
          gl_FragColor = texture2D(map, vUv);
        }
      `,
      transparent: true
    });

    // Use Mesh instead of Points
    particles = new THREE.Mesh(geometry, material);
    scene.add(particles);
    console.log('Particles added to the scene');
  }, undefined, (error) => {
    console.error('An error occurred while loading the texture:', error);
  });

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

  if (particles) {
    particles.rotation.y = elapsedTime * 0.1;
    if (particles.material.uniforms.time) {
      particles.material.uniforms.time.value = elapsedTime;
    }
  }

  renderer.render(scene, camera);
}

// Initialize and start the animation
init();
animate();
