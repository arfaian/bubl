(function() {
  var WebSocket = window['MozWebSocket'] ? MozWebSocket : WebSocket;
  var ws = new WebSocket("ws://127.0.0.1:8080/");

  ws.on = bean.on;
  ws.emit = bean.fire;
  ws.once = bean.one;
  ws.off = bean.off;

  ws.onopen = function() {
    ws.emit('connected');

    ws.onmessage = function(event) {
      var message = JSON.parse(event.data);
      ws.emit(message.event, message.body);
    }

    ws.on('incoming.tick', function(data) {
      console.log(data);
    });

    (function sendTick() {
      setTimeout(function() {
        ws.send(JSON.stringify({ event: 'outgoing.tick', data: { test: 'hi'}}));
        sendTick();
      }, 30);
    })();
  }



  window.network = ws;
})();
