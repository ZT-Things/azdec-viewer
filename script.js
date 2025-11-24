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

const x_z = generateCircleLine();
x_z.rotation.x = 90 * (Math.PI / 180);
scene.add( x_z );

function generateTransparentCylinder() {
  const geometry = new THREE.CylinderGeometry(50, 50, 0.1, 64);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.1,
    side: THREE.DoubleSide,
  });

  const cylinder = new THREE.Mesh(geometry, material);

  return cylinder;
}

const innerCylinder = generateTransparentCylinder();
scene.add(innerCylinder);



// Lines
// X line
const x_points = [ new THREE.Vector3(-50, 0, 0), new THREE.Vector3(50, 0, 0) ];
const x_geometry = new THREE.BufferGeometry().setFromPoints(x_points);
const x_line = new THREE.Line(
  x_geometry,
  new THREE.LineBasicMaterial({ color: 0x222222 }) // red
);
scene.add(x_line);
//
// // Y line
// const y_points = [ new THREE.Vector3(0, -50, 0), new THREE.Vector3(0, 50, 0) ];
// const y_geometry = new THREE.BufferGeometry().setFromPoints(y_points);
// const y_line = new THREE.Line(
//   y_geometry,
//   new THREE.LineBasicMaterial({ color: 0x00ff00 }) // green
// );
// scene.add(y_line);
//
// Z line
const z_points = [ new THREE.Vector3(0, 0, -50), new THREE.Vector3(0, 0, 50) ];
const z_geometry = new THREE.BufferGeometry().setFromPoints(z_points);
const z_line = new THREE.Line(
  z_geometry,
  new THREE.LineBasicMaterial({ color: 0x222222 }) // blue
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

function createStickman(scale = 1) {
  const stickmanGroup = new THREE.Group();

  // Head (sphere)
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(3 * scale, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xffcc99 })
  );
  head.position.y = 8 * scale;
  stickmanGroup.add(head);

  // Body (box)
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(2 * scale, 6 * scale, 2 * scale),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
  );
  body.position.y = 2 * scale;
  stickmanGroup.add(body);

  // Left arm (box)
  const leftArm = new THREE.Mesh(
    new THREE.BoxGeometry(6 * scale, 1.5 * scale, 1 * scale),
    new THREE.MeshStandardMaterial({ color: 0xffcc99 })
  );
  leftArm.position.set(-3.5 * scale, 5 * scale, 0);
  stickmanGroup.add(leftArm);

  // Right arm (box)
  const rightArm = new THREE.Mesh(
    new THREE.BoxGeometry(6 * scale, 1.5 * scale, 1 * scale),
    new THREE.MeshStandardMaterial({ color: 0xffcc99 })
  );
  rightArm.position.set(3.5 * scale, 5 * scale, 0);
  stickmanGroup.add(rightArm);

  // Left leg (box)
  const leftLeg = new THREE.Mesh(
    new THREE.BoxGeometry(1 * scale, 5 * scale, 1 * scale),
    new THREE.MeshStandardMaterial({ color: 0x4a4a4a })
  );
  leftLeg.position.set(-1.2 * scale, -2.5 * scale, 0);
  stickmanGroup.add(leftLeg);

  // Right leg (box)
  const rightLeg = new THREE.Mesh(
    new THREE.BoxGeometry(1 * scale, 5 * scale, 1 * scale),
    new THREE.MeshStandardMaterial({ color: 0x4a4a4a })
  );
  rightLeg.position.set(1.2 * scale, -2.5 * scale, 0);
  stickmanGroup.add(rightLeg);

  return stickmanGroup;
}

const stickman = createStickman(0.25);
scene.add(stickman);

function makeTextSprite(message, parameters = {}) {
  const font = parameters.font || "48px Arial";
  const fillStyle = parameters.fillStyle || "white";

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { alpha: true }); // ensure alpha channel

  // Measure text
  ctx.font = font;
  const textMetrics = ctx.measureText(message);
  const textWidth = textMetrics.width;
  const textHeight = 48;

  const padding = 20;

  canvas.width = Math.pow(2, Math.ceil(Math.log2(textWidth + padding * 2)));
  canvas.height = Math.pow(2, Math.ceil(Math.log2(textHeight + padding * 2)));

  // Clear background (just to be explicit)
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw text
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
    color: 0xffffff, // ensure no tint
    depthWrite: false, // avoids renderOrder issues
  });

  const sprite = new THREE.Sprite(spriteMaterial);

  // Scale sprite to text aspect ratio
  const scale = (textWidth + padding * 2) / 10;
  sprite.scale.set(scale, scale * 0.8, 1);

  sprite.renderOrder = 0; // safe

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

// const observer = makeTextSprite("Obs");
// observer.position.set(0, 0, 0);
// observer.renderOrder = -1;
// scene.add(observer);

// Generate star

function createAngleIndicator(origin, radius, startDeg, endDeg, altitudeDeg, color = 0xff0000) {
  // ============ HORIZONTAL (AZIMUTH) ============
  const startRad = THREE.MathUtils.degToRad(startDeg);
  const endRad = THREE.MathUtils.degToRad(endDeg);

  const hPoints = [];
  const segments = 50;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = startRad + t * (endRad - startRad);
    const x = origin.x + radius * Math.cos(angle);
    const z = origin.z + radius * Math.sin(angle);
    const y = origin.y;
    hPoints.push(new THREE.Vector3(x, y, z));
  }

  const hGeometry = new THREE.BufferGeometry().setFromPoints(hPoints);
  const hMaterial = new THREE.LineBasicMaterial({ color });
  const hArcLine = new THREE.Line(hGeometry, hMaterial);
  scene.add(hArcLine);

  // Horizontal indicator line (midpoint)
  const hMidAngle = (startRad + endRad);
  const straightLength = 50;
  const hStraightEnd = new THREE.Vector3(
    origin.x + straightLength * Math.cos(hMidAngle),
    origin.y,
    origin.z + straightLength * Math.sin(hMidAngle)
  );
  const hStraightGeometry = new THREE.BufferGeometry().setFromPoints([origin, hStraightEnd]);
  const hStraightLine = new THREE.Line(hStraightGeometry, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
  scene.add(hStraightLine);

  // ============ VERTICAL (ALTITUDE) ============
  // The altitude arc should be in a vertical plane oriented along the azimuth direction
  const azimuthRad = THREE.MathUtils.degToRad(endDeg); // Use end azimuth direction
  const altStartRad = THREE.MathUtils.degToRad(0);
  const altEndRad = THREE.MathUtils.degToRad(altitudeDeg);

  const vPoints = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const elevationAngle = altStartRad + t * (altEndRad - altStartRad);

    // Distance from vertical axis at this elevation
    const horizontalDist = radius * Math.cos(elevationAngle);
    // Height above horizontal plane
    const verticalDist = radius * Math.sin(elevationAngle);

    // Apply azimuth rotation to horizontal component
    const x = origin.x + horizontalDist * Math.cos(azimuthRad);
    const z = origin.z + horizontalDist * Math.sin(azimuthRad);
    const y = origin.y + verticalDist;

    vPoints.push(new THREE.Vector3(x, y, z));
  }

  const vGeometry = new THREE.BufferGeometry().setFromPoints(vPoints);
  const vMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
  const vArcLine = new THREE.Line(vGeometry, vMaterial);
  scene.add(vArcLine);

  // Vertical indicator line (midpoint of altitude arc)
  const vMidAngle = (altStartRad + altEndRad);
  const vHorizontalDist = straightLength * Math.cos(vMidAngle);
  const vVerticalDist = straightLength * Math.sin(vMidAngle);

  const vStraightEnd = new THREE.Vector3(
    origin.x + vHorizontalDist * Math.cos(azimuthRad),
    origin.y + vVerticalDist,
    origin.z + vHorizontalDist * Math.sin(azimuthRad)
  );
  const vStraightGeometry = new THREE.BufferGeometry().setFromPoints([origin, vStraightEnd]);
  const vStraightLine = new THREE.Line(vStraightGeometry, new THREE.LineBasicMaterial({ color: 0xffff00 }));
  scene.add(vStraightLine);

  return {
    horizontal: { arcLine: hArcLine, line: hStraightLine },
    vertical: { arcLine: vArcLine, line: vStraightLine }
  };
}

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
let angle = null;
let azimuth_angle = null;
let altitude_angle = null;

function disposeAngle() {
  // Dispose star
  if (star) {
    scene.remove(star);
    star.geometry?.dispose();
    star.material?.dispose();
    star = null;
  }

  // Dispose angle
  if (angle) {
    // horizontal
    if (angle.horizontal?.arcLine) {
      scene.remove(angle.horizontal.arcLine);
      angle.horizontal.arcLine.geometry?.dispose();
      angle.horizontal.arcLine.material?.dispose();
    }
    if (angle.horizontal?.line) {
      scene.remove(angle.horizontal.line);
      angle.horizontal.line.geometry?.dispose();
      angle.horizontal.line.material?.dispose();
    }

    // vertical
    if (angle.vertical?.arcLine) {
      scene.remove(angle.vertical.arcLine);
      angle.vertical.arcLine.geometry?.dispose();
      angle.vertical.arcLine.material?.dispose();
    }
    if (angle.vertical?.line) {
      scene.remove(angle.vertical.line);
      angle.vertical.line.geometry?.dispose();
      angle.vertical.line.material?.dispose();
    }

    angle = null;
  }

  // Dispose azimuth_angle sprite
  if (azimuth_angle) {
    scene.remove(azimuth_angle);
    if (azimuth_angle.material.map) azimuth_angle.material.map.dispose();
    azimuth_angle.material.dispose();
    azimuth_angle = null;
  }

  // Dispose altitude_angle sprite
  if (altitude_angle) {
    scene.remove(altitude_angle);
    if (altitude_angle.material.map) altitude_angle.material.map.dispose();
    altitude_angle.material.dispose();
    altitude_angle = null;
  }
}

azimuth_input.addEventListener("input", (e) => {
  let v = parseInt(e.target.value);
  if (isNaN(v)) return;
  e.target.value = Math.max(0, Math.min(359, v));
});

altitude_input.addEventListener("input", (e) => {
  let v = parseInt(e.target.value);
  if (isNaN(v)) return;
  e.target.value = Math.max(-90, Math.min(90, v));
});

document.getElementById("renderBtn").addEventListener("click", () => {
  // Remove previous star
  if (star) {
    scene.remove(star);
    if (star.geometry) star.geometry.dispose();
    if (star.material) star.material.dispose();
    star = null;
  }

  // Remove previous angle indicator
  if (angle) {
    disposeAngle(angle);
    angle = null;
  }

  // Get input values
  const azimuth = parseFloat(document.getElementById("azimuth_input").value);
  const altitude = parseFloat(document.getElementById("altitude_input").value);

  // Convert degrees to radians
  const azRad = THREE.MathUtils.degToRad(azimuth);
  const altRad = THREE.MathUtils.degToRad(altitude);

  // Set radius for placement
  const radius = 20;

  // Convert spherical to Cartesian coordinates
  const x = radius * Math.cos(altRad) * Math.cos(azRad);
  const y = radius * Math.sin(altRad);
  const z = radius * Math.cos(altRad) * Math.sin(azRad);

  // Create new angle indicator and star
  angle = createAngleIndicator(new THREE.Vector3(0, 0, 0), 20, 0, azimuth, altitude, 0xaaaaaa);
  star = generateStar(azimuth, altitude);

  // Position star according to azimuth & altitude
  scene.add(star);

  // Position text labels
  azimuth_angle = makeTextSprite(azimuth.toString());
  azimuth_angle.position.set(x, 0, z / 2); // slightly above the star
  azimuth_angle.renderOrder = -1;
  scene.add(azimuth_angle);

  altitude_angle = makeTextSprite(altitude.toString());
  altitude_angle.position.set(x, y - 10, z); // slightly below the star
  altitude_angle.renderOrder = -1;
  scene.add(altitude_angle);
});

// Animation

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);

function animate() {
  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera)
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
})
