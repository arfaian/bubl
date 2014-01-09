Controls = (function() {
  function Controls() {
    var self = this;
    this.hasPointerlock = false;
    this.forward = false;
    this.left = false;
    this.backward = false;
    this.right = false;
    this.jump = false;
    this.mousedy = 0;
    this.mousedx = 0;

    var onMouseMove = function(event) {
      if (self.hasPointerlock) {
        self.mousedx = event.movementX;
        self.mousedy = event.movementY;
      }
    };

    var onKeyDown = function(event) {

      switch (event.keyCode) {

        case 38: // up
        case 87: // w
          self.forward = true;
          break;

        case 37: // left
        case 65: // a
          self.left = true;
          break;

        case 40: // down
        case 83: // s
          self.backward = true;
          break;

        case 39: // right
        case 68: // d
          self.right = true;
          break;

        case 32: // space
          self.jump = true;
          break;
      }
    };

    var onKeyUp = function(event) {
      switch (event.keyCode) {

        case 38: // up
        case 87: // w
          self.forward = false;
          break;

        case 37: // left
        case 65: // a
          self.left = false;
          break;

        case 40: // down
        case 83: // s
          self.backward = false;
          break;

        case 39: // right
        case 68: // d
          self.right = false;
          break;
      }
    };

    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    eventEmitter.on('player:pointerlock:enter', function() {
      self.hasPointerlock = true;
    });

    eventEmitter.on('player:pointerlock:exit', function() {
      self.hasPointerlock = false;
    });
  }

  Controls.prototype.constructor = Controls;

  return Controls;
})();
