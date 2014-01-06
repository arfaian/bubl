(function() {

  var state = {
    player: null,
    entities: {},
    walls: [],
    obstacles: []
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

    eventEmitter.on('player:create:complete', function(player) {
      state.player = player;
    });

    eventEmitter.on('entity:create:complete', function(entity) {
      self.setEntity(entity.id, entity);
    });
  }

  window.BL = new BL(state);
})();
