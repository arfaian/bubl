(function() {
  var ws = new window.WebSocket("ws://127.0.0.1:8080/");

  var PLACEHOLDER = 'placeholder';

  ws.onerror = function() {
    throw 'Could not connect';
  }

  var tickId;

  eventEmitter.on('startAnimating', function() {
    (function sendTick() {
      tickId = setTimeout(function() {
        var player = BL.getPlayer();
        var data = {
          position: [
            player.position.x,
            player.position.y,
            player.position.z
          ],
          rotation: [
            0,
            player.rotation.y,
            player.rotation.z
          ]
        }
        ws.send(JSON.stringify({ event: 'outgoing.tick', data: data }));
        sendTick();
      }, 30);
    })();
  });

  eventEmitter.on('stopAnimating', function() {
    clearInterval(tickId);
  });

  ws.onopen = function() {
    eventEmitter.emit('connected');

    ws.onmessage = function(event) {
      var message = JSON.parse(event.data);
      eventEmitter.emit(message.event, message.body);
    }

    eventEmitter.on('session:start', function(session) {
      eventEmitter.emit('player:create:start', session.id);
    });

    eventEmitter.on('incoming.tick', function(data) {
      console.log(data);
      for (var id in data) {
        var entity = entities[id];
        if (entity && entity !== PLACEHOLDER) {
          var position = data[id].position;
          var rotation = data[id].rotation;
          entity.position.fromArray(position);
          entity.rotation.fromArray(rotation);
        } else {
          BL.setEntity(id) = PLACEHOLDER;
          eventEmitter.emit('entity:create:start', id, position, rotation);
        }
      }
    });
  }



  window.ws = ws;
})();
