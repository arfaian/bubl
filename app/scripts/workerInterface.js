var worker = new Worker('scripts/physics.js');

eventEmitter.defineEvents(['physics:update', 'physics:player:create', 'physics:entity:create', 'physics:box:add']);

worker.onmessage = function(event) {
  eventEmitter.emit(event.data.name, event.data.data);
}

worker.onerror = function(error) {
  console.error(error.message);
  throw error;
}

eventEmitter.on('physics:player:create', function(player) {
  var data = {
    name: 'physics:player:create',
    data: {
      x: player.position.x,
      y: player.position.y,
      z: player.position.z
    }
  }
  worker.postMessage(data);
});

eventEmitter.on('animate', function() {
  var message = {
    name: 'animate',
    data: {
      p: {
        x: player.position.x,
        y: player.position.y,
        z: player.position.z
      },
      r: {
        x: player.rotation.x,
        y: player.rotation.y,
        z: player.rotation.z
      },
      commands: {
        clientTick: BL.getClientTick(),
        forward: controls.forward,
        backward: controls.backward,
        left: controls.left,
        right: controls.right,
        mousedx: controls.mousedx,
        mousedy: controls.mousedy
      }
    }
  }

  eventEmitter.emit('user:command', message.data.commands);

  // TODO: move elsewhere
  controls.mousedy = controls.mousedx = 0;

  worker.postMessage(message);
});

eventEmitter.on('physics:update', function(data) {
  player.position.x = data.position.x;
  player.position.y = data.position.y;
  player.position.z = data.position.z;
  player.rotation.x = data.rotation.x;
  player.rotation.y = data.rotation.y;
  player.rotation.z = data.rotation.z;
});
