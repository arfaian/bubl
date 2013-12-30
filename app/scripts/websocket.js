(function() {
  var ws = new window.WebSocket("ws://127.0.0.1:8080/");

  var PLACEHOLDER = 'placeholder';

  var entities = ws.entities = {};

  ws.onerror = function() {
    throw 'Could not connect';
  }

  var tickId;

  eventEmitter.on('player:created', function(player) {
    entities[-1] = player;
  });

  eventEmitter.on('startAnimating', function() {
    (function sendTick() {
      tickId = setTimeout(function() {
        var player = entities[-1];
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
          entity = new Entity(position, rotation);
          entities[id] = PLACEHOLDER;
          eventEmitter.emit('new_entity', position, rotation, function(e) {
            entities[id] = e;
          });
        }
      }
    });
  }



  window.ws = ws;
})();
