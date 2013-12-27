var camera, scene, renderer, controls, player, floor, clock;
var frameDelta = 0, INV_MAX_FPS = 1 / 100;

function setup() {
  setupBlocker();
  setupThreeJS();
  setupWorld();
  setupPlayer();

  requestAnimationFrame(animate);
}

function animate() {
  renderer.render(scene, camera);

  frameDelta += clock.getDelta();
  while (frameDelta >= INV_MAX_FPS) {
    player.update(clock.getDelta());
    player.collideFloor(floor.position.y);
    frameDelta -= INV_MAX_FPS;
    updateDebug();
  }

  requestAnimationFrame(animate);
}

var rotationX = document.getElementById('rotationx');
var rotationY = document.getElementById('rotationy');
var rotationZ = document.getElementById('rotationz');
var positionX = document.getElementById('positionx');
var positionY = document.getElementById('positiony');
var positionZ = document.getElementById('positionz');
var velocityX = document.getElementById('velocityx');
var velocityY = document.getElementById('velocityy');
var velocityZ = document.getElementById('velocityz');

function updateDebug() {
  rotationX.innerHtml = player.rotation.x;
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
  scene.fog = new THREE.FogExp2(0xffffff, 0.001);

  var light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(1, 1, 1);
  scene.add(light);

  var light = new THREE.DirectionalLight(0xffffff, 0.75);
  light.position.set(-1, - 0.5, -1);
  scene.add(light);

  clock = new THREE.Clock(false);
  clock.start();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function setupWorld() {
  createFloor();
}

function setupPlayer() {
  player = new Player();
  player.position.y = 20;
  player.add(camera);
  controls = new Controls(player);
  scene.add(player);
}

function createFloor() {
  var floorGeometry = new THREE.PlaneGeometry(200, 200, 20, 20);
  var floorMaterial = new THREE.MeshBasicMaterial({color: 0x9db3b5, overdraw: true});
  floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -90 * Math.PI / 180;
  scene.add(floor);
}

setup();
