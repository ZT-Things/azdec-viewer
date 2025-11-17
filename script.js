import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(100, 50, 100);

let renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(30);

// Main

// const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
// const torus = new THREE.Mesh(geometry, material);
//
// scene.add(torus)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);


// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper);

// Circle along the x and y axis

const x_y = new THREE.Mesh(
  new THREE.RingGeometry( 49.85, 50, 64 ),
  new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } ),
);
x_y.rotation.y = 0;
scene.add( x_y );

// Circle along the z and y axis

const z_y = new THREE.Mesh(
  new THREE.RingGeometry( 49.85, 50, 64 ),
  new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } ),
);
z_y.rotation.y = 90 * (Math.PI / 180);
scene.add( z_y );

// Circle along the x and z axis

const x_z = new THREE.Mesh(
  new THREE.RingGeometry( 49.85, 50, 64 ),
  new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } ),
);
x_z.rotation.x = 90 * (Math.PI / 180);
scene.add( x_z );

// Lines

const x_line = new THREE.Mesh(
  new THREE.BoxGeometry(100, 0.15, 0.15),
  new THREE.MeshBasicMaterial({ color: 0xffffff }),
)

scene.add(x_line);

const y_line = new THREE.Mesh(
  new THREE.BoxGeometry(0.15, 100, 0.15),
  new THREE.MeshBasicMaterial({ color: 0xffffff }),
)

scene.add(y_line);

const z_line = new THREE.Mesh(
  new THREE.BoxGeometry(0.15, 0.15, 100),
  new THREE.MeshBasicMaterial({ color: 0xffffff }),
)

scene.add(z_line);
// Transparent sphere

// 1. Create geometry
const geometry = new THREE.SphereGeometry(50, 32, 32); // radius 1, 32 segments

// 2. Create material with transparency
const material = new THREE.MeshBasicMaterial({
  color: 0xaaaaaa, // green
  transparent: true,
  opacity: 0.2, // 0 = fully invisible, 1 = fully opaque
});

// 3. Create the mesh
const sphere = new THREE.Mesh(geometry, material);

// 4. Add it to the scene
scene.add(sphere);

// Animation

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);

function animate() {
  requestAnimationFrame(animate);

  controls.update();
  // z_y.rotation.y += 0.001;
  // console.log(z_y.rotation.y);
  renderer.render(scene, camera)
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
})
