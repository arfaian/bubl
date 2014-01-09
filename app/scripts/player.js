function Player(id, geometry, material) {
  var args = Array.prototype.slice.apply(arguments, [1, 3]);
  THREE.Mesh.apply(this, args);
  this.id = id;
  this.canJump = true;
  this.rotation.order = 'YXZ';
  this.cameraHeight = 40;
  this.jumpHeight = 225;
  this.constrainVerticalLook = true;
  this.inverseLook = new THREE.Vector3(-1, -1, -1);
  this.mouseSensitivity = new THREE.Vector3(0.25, 0.25, 0.25);
  this.velocity = new THREE.Vector3();
  this.acceleration = new THREE.Vector3(0, -150, 0);
  this.ambientFriction = new THREE.Vector3(-10, 0, -10);
  this.ambientAirFriction = new THREE.Vector3(-0.5, 0, -0.5);
  this.moveDirection = {
    FORWARD: false,
    BACKWARD: false,
    LEFT: false,
    RIGHT: false
  }
}

Player.prototype = Object.create(THREE.Mesh.prototype);
Player.prototype.constructor = Player;
Player.SPEED = 200;
Player.RADIUS = 20;

Player.prototype.collideFloor = function(floorY) {
  if (this.position.y - this.cameraHeight <= floorY &&
        this.position.y - this.cameraHeight * 0.5 > floorY) {
    this.velocity.y = Math.max(0, this.velocity.y);
    this.position.y = this.cameraHeight + floorY;
    this.canJump = true;
    return true;
  }
  return false;
};

Player.prototype.jump = function(distance) {
  if (this.canJump) {
    distance = distance || this.jumpHeight;
    var thrust = Math.sqrt(Math.abs(2 * distance * this.acceleration.y));
    this.velocity.y += thrust;
    eventEmitter.emit('player:jump');
    this.canJump = false;
  }
};
