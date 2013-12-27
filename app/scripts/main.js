var camera, scene, renderer, controls, time = Date.now();

function setup() {
  setupBlocker();
  setupThreeJS();
  setupWorld();

  requestAnimationFrame(animate);
}

function animate() {
  requestAnimationFrame(animate);

  controls.update(Date.now() - time);
  renderer.render(scene, camera);

  time = Date.now();
}

function setupBlocker() {
  var blocker = document.getElementById('blocker');
  var instructions = document.getElementById('instructions');

  function onEnter() {
    controls.enabled = true;
    blocker.style.display = 'none';
  }

  function onExit() {
    controls.enabled = false;

    blocker.style.display = '-webkit-box';
    blocker.style.display = '-moz-box';
    blocker.style.display = 'box';

    instructions.style.display = '';
  }

  function onError() {
    instructions.style.display = '';
    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
  }

  instructions.addEventListener('click', function(event) {
    instructions.style.display = 'none';
    PL.requestPointerLock(blocker, onEnter, onExit, onError);
  });
}

function setupThreeJS() {
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xffffff, 0, 750);

  var light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(1, 1, 1);
  scene.add(light);

  var light = new THREE.DirectionalLight(0xffffff, 0.75);
  light.position.set(-1, - 0.5, -1);
  scene.add(light);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

  controls = new THREE.PointerLockControls(camera);
  scene.add(controls.getObject());

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function setupWorld() {
  createFloor();
}

function createFloor() {
  var floorGeometry = new THREE.PlaneGeometry(200, 200, 20, 20);
  var floorMaterial = new THREE.MeshBasicMaterial({color: 0x9db3b5, overdraw: true});
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -90 * Math.PI / 180;
  scene.add(floor);
}

setup();
