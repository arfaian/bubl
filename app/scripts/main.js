var camera, scene, renderer, controls, player, floor, clock;
var paused= true, frameDelta = 0, INV_MAX_FPS = 1 / 100;

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
    player.update(INV_MAX_FPS);
    player.collideFloor(floor.position.y);
    frameDelta -= INV_MAX_FPS;
    updateDebug();
  }

  requestAnimationFrame(animate);
}



function startAnimating() {
  if (paused) {
    paused = false;
    clock.start();
    requestAnimationFrame(animate);
    eventEmitter.emit('startAnimating');
  }
}

function stopAnimating() {
  paused = true;
  clock.stop();
  eventEmitter.emit('stopAnimating');
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
  rotationX.innerHTML = player.rotation.x;
  rotationY.innerHTML = player.rotation.y;
  rotationZ.innerHTML = player.rotation.z;
  positionX.innerHTML = player.position.x;
  positionY.innerHTML = player.position.y;
  positionZ.innerHTML = player.position.z;
  velocityX.innerHTML = player.velocity.x;
  velocityY.innerHTML = player.velocity.y;
  velocityZ.innerHTML = player.velocity.z;
}

function setupBlocker() {
  var blocker = document.getElementById('blocker');
  var instructions = document.getElementById('instructions');

  function onEnter() {
    controls.enabled = true;
    blocker.style.display = 'none';
    startAnimating();
  }

  function onExit() {
    controls.enabled = false;
    stopAnimating();

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

  camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 10000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function setupWorld() {
  createFloor();
}

function setupPlayer() {
  player = new Player();
  player.position.y = 40;
  player.add(camera);
  controls = new Controls(player);
  scene.add(player);
  eventEmitter.emit('player:created', player);
}

function createFloor() {
  var floorGeometry = new THREE.PlaneGeometry(2000, 2000, 20, 20);
  var floorMaterial = new THREE.MeshBasicMaterial({color: 0x9db3b5, overdraw: true});
  floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = Math.PI * -0.5;
  floor.position.set(100, 0, -100);
  scene.add(floor);
}

eventEmitter.on('new_entity', function(position, rotation, cb) {
  THREE.ImageUtils.loadTexture('images/face.png', undefined, function(texture) {
    var geometry = new THREE.CubeGeometry(Player.RADIUS*2, Player.RADIUS*2, Player.RADIUS*2);
    var material = new THREE.MeshBasicMaterial({ map: texture });
    for (var i = 0; i < numEnemies; i++) {
      var entity = new Player(geometry.clone(), material.clone());
      entity.position.fromArray(position);
      entity.rotation.fromArray(rotation);
      scene.add(entity);
      cb(entity);
    }
  });
});

setup();
