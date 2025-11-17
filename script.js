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

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Circle along the x and y axis

function generateCircleLine() {
  return new THREE.Mesh(
    new THREE.RingGeometry( 49.85, 50, 64 ),
    new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } ),
  );
}

function generateStraightLine() {
  return new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.15, 100),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
  );
}

const x_y = generateCircleLine();
x_y.rotation.y = 0;
scene.add( x_y );

// Circle along the z and y axis

const z_y = generateCircleLine();
z_y.rotation.y = 90 * (Math.PI / 180);
scene.add( z_y );

// Circle along the x and z axis

const x_z = generateCircleLine();
x_z.rotation.x = 90 * (Math.PI / 180);
scene.add( x_z );

// Lines

// X line
const x_points = [ new THREE.Vector3(-50, 0, 0), new THREE.Vector3(50, 0, 0) ];
const x_geometry = new THREE.BufferGeometry().setFromPoints(x_points);
const x_line = new THREE.Line(
  x_geometry,
  new THREE.LineBasicMaterial({ color: 0xff0000 }) // red
);
scene.add(x_line);

// Y line
const y_points = [ new THREE.Vector3(0, -50, 0), new THREE.Vector3(0, 50, 0) ];
const y_geometry = new THREE.BufferGeometry().setFromPoints(y_points);
const y_line = new THREE.Line(
  y_geometry,
  new THREE.LineBasicMaterial({ color: 0x00ff00 }) // green
);
scene.add(y_line);

// Z line
const z_points = [ new THREE.Vector3(0, 0, -50), new THREE.Vector3(0, 0, 50) ];
const z_geometry = new THREE.BufferGeometry().setFromPoints(z_points);
const z_line = new THREE.Line(
  z_geometry,
  new THREE.LineBasicMaterial({ color: 0x0000ff }) // blue
);
scene.add(z_line);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(50, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0xaaaaaa,
    transparent: true,
    opacity: 0.2,
  }),
);

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
