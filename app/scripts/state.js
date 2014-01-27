(function() {

  var state = {
    player: null,
    entities: {},
    walls: [],
    obstacles: [],
    serverTime: 0,
    serverTick: 0,
    clientTick: 0
  }

  function BL(state) {

    var self = this;

    var hasProp = function(prop) {
      return Object.prototype.hasOwnProperty.call(state.entities, prop);
    }

    this.setEntity = function(id, entity) {
      state.entities[id] = entity;
    }

    this.getEntity = function(id) {
      return hasProp(id) ? state.entities[id] : null;
    }

    this.removeEntity = function(id) {
      delete state.entities[id];
    }

    this.getPlayer = function() {
      return state.player;
    }

    this.getObstacles = function() {
      return state.obstacles;
    }

    this.setServerTime = function(serverTime) {
      state.serverTime = serverTime;
    }

    this.getServerTime = function() {
      return state.serverTime;
    }

    this.setServerTick = function(serverTick) {
      state.serverTick = serverTick;
    }

    this.getServerTick = function() {
      return state.serverTick;
    }

    this.setClientTick = function(clientTick) {
      state.clientTick = clientTick;
    }

    this.getClientTick = function() {
      return state.clientTick;
    }

    this.getTickOffset = function() {
      return state.clientTick - state.serverTick;
    }

    this.incrementClientTick = function() {
      return state.clientTick += 1;
    }

    this.tick = function() {
      setPreciseInterval(function() {
        self.incrementClientTick();
        eventEmitter.emit('usercmd', self.getClientTick());
      }, 15);
    }

    eventEmitter.on('player:create:complete', function(player) {
      state.player = player;
    });

    eventEmitter.on('entity:create:complete', function(entity) {
      self.setEntity(entity.id, entity);
    });
  }

  window.BL = new BL(state);
})();
