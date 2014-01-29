(function() {
  var ticks = [];
  var minTick = 0;

  eventEmitter.on('physics:update', function(data) {
    push(data);
  });

  eventEmitter.on('physics:reconciliation', function(data) {
    var tick = ticks.pop();

    if (tick.clientTick !== data.tick) {
      throw "client tick does not match reconciliation tick";
    }

    if (!_.isEqual(tick, data)) {
      console.error("client tick does not equal reconciliation tick")
    }
  });

  function push(data) {
    if (ticks.length > 100) {
      var tick = ticks.shift();
    }
  }

})();
