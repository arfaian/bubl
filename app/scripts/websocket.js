(function() {
  var ws = new window.WebSocket("ws://127.0.0.1:8080/");

  var PLACEHOLDER = 'placeholder';

  ws.onerror = function() {
    throw 'Could not connect';
  }

  ws.onopen = function() {
    eventEmitter.emit('connected');
  }

  ws.onmessage = function(event) {
    var message = JSON.parse(event.data);
    eventEmitter.emit(message.event, message.data);
  }

  var tickId;

  eventEmitter.on('startAnimating', function() {
    (function sendTick() {
      tickId = setTimeout(function() {
        var player = BL.getPlayer();
        var data = {
          px: player.position.x,
          py: player.position.y,
          pz: player.position.z,
          ry: player.rotation.y,
          rz: player.rotation.z
        }
        ws.send(JSON.stringify({ event: 'outgoing.tick', data: data }));
        sendTick();
      }, 30);
    })();
  });

  eventEmitter.on('stopAnimating', function() {
    clearInterval(tickId);
  });

  eventEmitter.on('session:start', function(data) {
    eventEmitter.emit('player:create:start', data.id);
  });

  eventEmitter.on('incoming.tick', function(data) {
    console.log(data);
    for (var id in data) {
      var entity = entities[id];
      if (entity && entity !== PLACEHOLDER) {
        var position = [data[id].px, data[id].py, data[id].pz];
        var rotation = [data[id].ry, data[ip].rz];
        entity.position.fromArray(position);
        entity.rotation.fromArray(rotation);
      } else {
        BL.setEntity(id) = PLACEHOLDER;
        eventEmitter.emit('entity:create:start', id, position, rotation);
      }
    }
  });

  window.ws = ws;
})();
