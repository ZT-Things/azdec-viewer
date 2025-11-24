import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(-100, 80, -80);

let renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

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

function makeTextSprite(message, parameters) {
  const font = parameters?.font || "48px Arial";
  const fillStyle = parameters?.fillStyle || "white";
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Measure text with proper font
  ctx.font = font;
  const textMetrics = ctx.measureText(message);
  const textWidth = textMetrics.width;
  const textHeight = 48;

  // Add padding and ensure power-of-2 dimensions for better texture quality
  const padding = 20;
  canvas.width = Math.pow(2, Math.ceil(Math.log2(textWidth + padding * 2)));
  canvas.height = Math.pow(2, Math.ceil(Math.log2(textHeight + padding * 2)));

  // Redraw text centered on canvas
  ctx.font = font;
  ctx.fillStyle = fillStyle;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    sizeAttenuation: true,
  });

  const sprite = new THREE.Sprite(spriteMaterial);

  // Scale based on actual text width for proper aspect ratio
  const scale = (textWidth + padding * 2) / 10;
  sprite.scale.set(scale, scale * 0.8, 1);

  // Make text always face camera
  sprite.renderOrder = 0;

  return sprite;
}

// Texts - positioned outside the sphere
const north_text = makeTextSprite("N");
north_text.position.set(55, 0, 0);
scene.add(north_text);

const south_text = makeTextSprite("S");
south_text.position.set(-55, 0, 0);
scene.add(south_text);

const west_text = makeTextSprite("W");
west_text.position.set(0, 0, -55);
scene.add(west_text);

const east_text = makeTextSprite("E");
east_text.position.set(0, 0, 55);
scene.add(east_text);

const zenith_text = makeTextSprite("Zenith");
zenith_text.position.set(0, 55, 0);
scene.add(zenith_text);

const observer = makeTextSprite("Observer");
observer.position.set(0, 0, 0);
observer.renderOrder = -1;
scene.add(observer);

// Generate star

function generateStar(azimuth, altitude, radius = 50) {
  altitude = altitude - 90
  azimuth = 360 - azimuth - 90
  const star = new THREE.Mesh(
    new THREE.SphereGeometry(1, 2, 2),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  );

  // convert degrees → radians
  const theta = azimuth * Math.PI / 180; // around Y (left-right)
  const phi   = altitude   * Math.PI / 180; // up-down

  // set spherical position
  star.position.setFromSpherical(
    new THREE.Spherical(radius, phi, theta)
  );

  scene.add(star);
  return star;
}

let star = null;

document.getElementById("renderBtn").addEventListener("click", () => {
  if (star) {
    scene.remove(star);
  }
  const azimuth = document.getElementById("azimuth_input").value;
  const altitude = document.getElementById("altitude_input").value;

  star = generateStar(azimuth, altitude);
});

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
