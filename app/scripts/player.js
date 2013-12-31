function Player(id, geometry, material) {
  THREE.Mesh.apply(this, Array.prototype.slice.apply(arguments, [1, 3]));
  this.id = id;
  this.canJump = true;
  this.fly = false;
  this.rotation.order = 'YXZ';
  this._aggregateRotation = new THREE.Vector3();
  this.cameraHeight = 40;
  this.jumpHeight = 125;
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

Player.prototype.update = (function() {
  var halfAccel = new THREE.Vector3();
  var scaledVelocity = new THREE.Vector3();

  return function(delta) {
    // Compute look vector
    var r = this._aggregateRotation
      .multiply(this.inverseLook)
      .multiply(this.mouseSensitivity)
      .multiplyScalar(delta)
      .add(this.rotation);
    if (this.constrainVerticalLook) {
      r.x = Math.max(Math.PI * -0.5, Math.min(Math.PI * 0.5, r.x));
    }
    if (!this.fly) {
      this.rotation.x = 0;
    }

    // Thrust
    if (this.moveDirection.FORWARD) this.velocity.z -= Player.SPEED;
    if (this.moveDirection.LEFT) this.velocity.x -= Player.SPEED;
    if (this.moveDirection.BACKWARD) this.velocity.z += Player.SPEED;
    if (this.moveDirection.RIGHT) this.velocity.x += Player.SPEED;

    // Move
    halfAccel.copy(this.acceleration).multiplyScalar(delta * 0.5);
    this.velocity.add(halfAccel);
    var squaredManhattanVelocity = this.velocity.x*this.velocity.x + this.velocity.z*this.velocity.z;
    if (squaredManhattanVelocity > Player.SPEED*Player.SPEED) {
      var scalar = Player.SPEED / Math.sqrt(squaredManhattanVelocity);
      this.velocity.x *= scalar;
      this.velocity.z *= scalar;
    }
    scaledVelocity.copy(this.velocity).multiplyScalar(delta);
    this.translateX(scaledVelocity.x);
    this.translateZ(scaledVelocity.z);
    this.position.y += scaledVelocity.y;
    this.velocity.add(halfAccel);

    // Ambient forces
    this.velocity.add(scaledVelocity.multiply(
      this.ambientFriction
    ));

    // Look
    this.rotation.set(r.x, r.y, r.z);
    this._aggregateRotation.set(0, 0, 0);
  };
})();

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

Player.prototype.rotate = function(x, y, z) {
  this._aggregateRotation.x += x;
  this._aggregateRotation.y += y;
  this._aggregateRotation.z += z;
};


Player.prototype.jump = function(distance) {
  if (this.canJump) {
    distance = distance || this.jumpHeight;
    var thrust = Math.sqrt(Math.abs(2 * distance * this.acceleration.y));
    this.velocity.y += thrust;
    this.canJump = false;
  }
};
