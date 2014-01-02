Controls = function (player) {
  var hasPointerlock = false;

  var onMouseMove = function(event) {
    if (hasPointerlock) {
      player.rotate(event.movementY, event.movementX, 0);
    }
  };

	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				player.moveDirection.FORWARD = true;
				break;

			case 37: // left
			case 65: // a
				player.moveDirection.LEFT = true; break;

			case 40: // down
			case 83: // s
				player.moveDirection.BACKWARD = true;
				break;

			case 39: // right
			case 68: // d
				player.moveDirection.RIGHT = true;
				break;

			case 32: // space
        player.jump();
				break;
		}
	};

	var onKeyUp = function ( event ) {
		switch( event.keyCode ) {

			case 38: // up
			case 87: // w
				player.moveDirection.FORWARD = false;
				break;

			case 37: // left
			case 65: // a
				player.moveDirection.LEFT = false;
				break;

			case 40: // down
			case 83: // s
				player.moveDirection.BACKWARD = false;
				break;

			case 39: // right
			case 68: // d
				player.moveDirection.RIGHT = false;
				break;
		}
	};

	document.addEventListener('mousemove', onMouseMove, false);
	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);

  eventEmitter.on('player:pointerlock:enter', function() {
    hasPointerlock = true;
  });

  eventEmitter.on('player:pointerlock:exit', function() {
    hasPointerlock = false;
  });
};
