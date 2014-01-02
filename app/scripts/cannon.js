(function() {

  var inputVelocity = new THREE.Vector3();
  var inputQuaternion = new THREE.Quaternion();

  // Setup our world
  world = new CANNON.World();
  world.quatNormalizeSkip = 0;
  world.quatNormalizeFast = false;

  var solver = new CANNON.GSSolver();

  world.defaultContactMaterial.contactEquationStiffness = 1e9;
  world.defaultContactMaterial.contactEquationRegularizationTime = 4;

  solver.iterations = 7;
  solver.tolerance = 0.1;
  var split = true;
  if(split)
      world.solver = new CANNON.SplitSolver(solver);
  else
      world.solver = solver;

  world.gravity.set(0,-20,0);
  world.broadphase = new CANNON.NaiveBroadphase();

  // Create a slippery material (friction coefficient = 0.0)
  physicsMaterial = new CANNON.Material("slipperyMaterial");
  var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
                                                          physicsMaterial,
                                                          0.0, // friction coefficient
                                                          0.3  // restitution
                                                          );
  // We must add the contact materials to the world
  world.addContactMaterial(physicsContactMaterial);

  eventEmitter.on('physics:player:create', function(player) {
    var contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
    var upAxis = new CANNON.Vec3(0,1,0);
    var sphere = addEntitySphere(player);
    sphere.addEventListener("collide", function(e){
      var contact = e.contact;

      if(contact.bi.id == sphere.id)
        contact.ni.negate(contactNormal);
      else
        contact.ni.copy(contactNormal);

      if(contactNormal.dot(upAxis) > 0.5) {
        //canJump = true;
      }
    });
    player.collisionBody = sphere;
  });

  eventEmitter.on('physics:entity:create', function(entity) {
    addEntitySphere(entity);
  });

  function addEntitySphere(entity) {
    var mass = 5, radius = 40, position = entity.position;
    sphereShape = new CANNON.Sphere(radius);
    sphereBody = new CANNON.RigidBody(mass,sphereShape,physicsMaterial);
    sphereBody.position.set(position.x, position.y, position.z);
    sphereBody.linearDamping = 0.9;
    world.add(sphereBody);
    return sphereBody;
  }

  // Create a plane
  var groundShape = new CANNON.Plane();
  var groundBody = new CANNON.RigidBody(0,groundShape,physicsMaterial);
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
  world.add(groundBody);

  eventEmitter.on('animate', function(invMaxFps) {
    world.step(invMaxFps);
  });

  eventEmitter.on('physics:box:add', function(box) {
    world.add(box);
  });

  eventEmitter.on('player:move', function(position, velocity, rotation) {
    inputVelocity.set(0, 0, 0);

    if (player.moveDirection.FORWARD) inputVelocity.z -= Player.SPEED;
    if (player.moveDirection.LEFT) inputVelocity.x -= Player.SPEED;
    if (player.moveDirection.BACKWARD) inputVelocity.z += Player.SPEED;
    if (player.moveDirection.RIGHT) inputVelocity.x += Player.SPEED;

    var r = new THREE.Euler();
    r.x = player.rotation.x;
    r.y = player.rotation.y;
    r.z = player.rotation.z;
    inputQuaternion.setFromEuler(r, true);
    inputVelocity.applyQuaternion(inputQuaternion);

    inputVelocity.multiplyScalar((1 / 100));

    player.collisionBody.velocity.x += inputVelocity.x;
    player.collisionBody.velocity.z += inputVelocity.z;

    player.collisionBody.position.copy(player.position);
  });

  eventEmitter.on('player:jump', function() {
    player.collisionBody.velocity.y += 120;
  });

})();
