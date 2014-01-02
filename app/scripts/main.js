var camera, scene, renderer, controls, player, floor, clock;
var frameDelta = 0, INV_MAX_FPS = 1 / 100;

function setup() {
  setupThreeJS();
  setupWorld();

  clock.start();
  requestAnimationFrame(animate);
}

function animate() {
  renderer.render(scene, camera);
  eventEmitter.emit('animate:start');

  frameDelta += clock.getDelta();
  while (frameDelta >= INV_MAX_FPS) {
    eventEmitter.emit('animate', INV_MAX_FPS);
    frameDelta -= INV_MAX_FPS;
  }

  eventEmitter.emit('animate:end');
  requestAnimationFrame(animate);
}

var rotationX = document.getElementById('rotationx')
  , rotationY = document.getElementById('rotationy')
  , rotationZ = document.getElementById('rotationz')
  , positionX = document.getElementById('positionx')
  , positionY = document.getElementById('positiony')
  , positionZ = document.getElementById('positionz')
  , velocityX = document.getElementById('velocityx')
  , velocityY = document.getElementById('velocityy')
  , velocityZ = document.getElementById('velocityz')
  , bodypositionX = document.getElementById('bodypositionx')
  , bodypositionY = document.getElementById('bodypositiony')
  , bodypositionZ = document.getElementById('bodypositionz');

function setupBlocker() {
  var blocker = document.getElementById('blocker');
  var instructions = document.getElementById('instructions');

  function onEnter() {
    controls.enabled = true;
    blocker.style.display = 'none';
    eventEmitter.emit('player:pointerlock:enter');
  }

  function onExit() {
    controls.enabled = false;

    blocker.style.display = '-webkit-box';
    blocker.style.display = '-moz-box';
    blocker.style.display = 'box';

    instructions.style.display = '';
    eventEmitter.emit('player:pointerlock:exit');
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

  camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 10000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function setupWorld() {
  createFloor();
  addBoxes();
}

function createFloor() {
  var floorGeometry = new THREE.PlaneGeometry(2000, 2000, 20, 20);
  var floorMaterial = new THREE.MeshBasicMaterial({color: 0x9db3b5, overdraw: true});
  floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = Math.PI * -0.5;
  floor.position.set(100, 0, -100);
  scene.add(floor);
}

function addBoxes() {
  var halfExtents = new CANNON.Vec3(1,1,1);
  var boxShape = new CANNON.Box(halfExtents);
  var boxGeometry = new THREE.CubeGeometry(40, 40, 40);
  var material = new THREE.MeshLambertMaterial({ color: 0xdddddd });
  for(var i = 0; i < 7; i++){
      var x = (Math.random() - 0.5) * 1000;
      var y = 40;
      var z = (Math.random() - 0.5) * 1000;
      var boxMesh = new THREE.Mesh( boxGeometry, material );
      scene.add(boxMesh);
      var boxBody = new CANNON.RigidBody(0, boxShape);
      boxBody.position.set(x,y,z);
      boxMesh.position.set(x,y,z);
      boxMesh.castShadow = true;
      boxMesh.receiveShadow = true;
      boxMesh.useQuaternion = true;
      eventEmitter.emit('physics:box:add', boxBody);
  }
}

eventEmitter.on('entity:create:start', function(id, position, rotation) {
  var geometry = new THREE.CubeGeometry(Player.RADIUS*2, Player.RADIUS*2, Player.RADIUS*2);
  var material = new THREE.MeshNormalMaterial();
  var entity = new Player(id, geometry, material);
  entity.position.fromArray(position);
  entity.rotation.fromArray(rotation);
  entity.overdraw = true;
  scene.add(entity);
  eventEmitter.emit('entity:create:complete', entity);
  eventEmitter.emit('physics:entity:create', entity);
});


eventEmitter.on('player:create:start', function(id) {
  player = new Player(id);
  player.position.y = 40;
  player.add(camera);
  controls = new Controls(player);
  scene.add(player);
  setupBlocker();
  eventEmitter.emit('player:create:complete', player);
  eventEmitter.emit('physics:player:create', player);
  eventEmitter.on('animate', function(invMaxFps) {
    player.update(invMaxFps);
    player.collideFloor(floor.position.y);

    rotationX.innerHTML = player.rotation.x;
    rotationY.innerHTML = player.rotation.y;
    rotationZ.innerHTML = player.rotation.z;
    positionX.innerHTML = player.position.x;
    positionY.innerHTML = player.position.y;
    positionZ.innerHTML = player.position.z;
    velocityX.innerHTML = player.velocity.x;
    velocityY.innerHTML = player.velocity.y;
    velocityZ.innerHTML = player.velocity.z;
    bodypositionX.innerHTML = player.collisionBody.position.x;
    bodypositionY.innerHTML = player.collisionBody.position.y;
    bodypositionZ.innerHTML = player.collisionBody.position.z;
  });
});


setup();
