(function() {

  var EventNameReverseLookup = {
    "session:start": 'a',
    "incoming.tick": 'b',
    "outgoing.tick": 'c'
  };

  var EventNameLookup = {
    'a': "session:start",
    'b': "incoming.tick",
    'c': "outgoing.tick"
  };

  var ws = new window.WebSocket("ws://127.0.0.1:8080/");
  ws.binaryType = "arraybuffer";

  var PLACEHOLDER = 'placeholder';

  ws.onerror = function() {
    throw 'Could not connect';
  }

  ws.onopen = function() {
    eventEmitter.emit('connected');
  }

  ws.onmessage = function(event) {
    var dataArr = new DataView(event.data);

    var event = EventNameLookup[String.fromCharCode(dataArr.getInt16(0))];
    eventEmitter.emit(event, DECODERS[event](dataArr));
  }

  eventEmitter.on('network:send', function(data) {
    ws.send(data);
  });

  var tickId;

  eventEmitter.on('player:pointerlock:enter', function() {
    (function sendTick() {
      tickId = setTimeout(function() {
        var player = BL.getPlayer();
        var p = player.position;
        var r = player.rotation;
        var dataView = new DataView(new ArrayBuffer(24));
        dataView.setFloat32(0, p.x);
        dataView.setFloat32(4, p.y);
        dataView.setFloat32(8, p.z);
        dataView.setFloat32(12, r.x);
        dataView.setFloat32(16, r.y);
        dataView.setFloat32(20, r.z);
        eventEmitter.emit('network:send', dataView.buffer);
        sendTick();
      }, 30);
    })();
  });

  eventEmitter.on('player:pointerlock:exit', function() {
    clearInterval(tickId);
  });

  eventEmitter.on('session:start', function(data) {
    eventEmitter.emit('player:create:start', data.id);
    eventEmitter.emit('box:create:start', data.objects);
  });

  eventEmitter.on('incoming.tick', function(data) {
    for (var i = 0; i < data.length; i++) {
      var player = data[i];
      var entity = BL.getEntity(player.id);
      var position = [player.px, player.py, player.pz];
      var rotation = [0, player.ry, player.rz];
      if (typeof entity === "object" && entity !== null) {
        entity.position.fromArray(position);
        entity.rotation.fromArray(rotation);
      } else if (entity === null) {
        BL.setEntity(player.id, PLACEHOLDER);
        eventEmitter.emit('entity:create:start', player.id, position, rotation);
      }
    }
  });

  window.ws = ws;
})();
