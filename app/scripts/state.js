(function() {

  var state = {
    player: null,
    entities: {}
  }

  function BL(state) {

    var self = this;

    var hasProp = function(prop) {
      return Object.prototype.hasOwnProperty.call(s.entities, prop);
    }

    this.setEntity = function(id, entity) {
      if (!hasProp(id)) {
        state.entities[id];
      }
    }

    this.getEntity = function(id) {
      return hasProp(id) ? state.entities[id] : null;
    }

    this.getPlayer = function() {
      return state.player;
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
