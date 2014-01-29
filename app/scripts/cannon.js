(function() {

  var inputVelocity = new THREE.Vector3()
    , inputQuaternion = new THREE.Quaternion()
    , SPEED = 200
    , INV_MAX_FPS = 1 / 100
    , collisionBody = null
    ;

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

  world.gravity.set(0,-50,0);
  world.broadphase = new CANNON.NaiveBroadphase();

  // Create a slippery material (friction coefficient = 0.0)
  physicsMaterial = new CANNON.Material("slipperyMaterial");
  var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
                                                          physicsMaterial,
                                                          1.0, // friction coefficient
                                                          0.3  // restitution
                                                          );
  // We must add the contact materials to the world
  world.addContactMaterial(physicsContactMaterial);

  eventEmitter.on('physics:player:create', function(position) {
    var contactNormal = new CANNON.Vec3();
    var upAxis = new CANNON.Vec3(0,1,0);
    collisionBody = addEntitySphere(position);
    collisionBody.addEventListener("collide", function(e){
      var contact = e.contact;

      if(contact.bi.id == collisionBody.id)
        contact.ni.negate(contactNormal);
      else
        contact.ni.copy(contactNormal);

      if(contactNormal.dot(upAxis) > 0.5) {
        //canJump = true;
      }
    });
  });

  eventEmitter.on('physics:entity:create', function(entity) {
    addEntitySphere(entity);
  });

  function addEntitySphere(position) {
    var mass = 150, radius = 40;
    sphereShape = new CANNON.Sphere(radius);
    sphereBody = new CANNON.RigidBody(mass, sphereShape, physicsMaterial);
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

  eventEmitter.on('physics:box:add', function(box) {
    world.add(box);
  });

  var aggregateRotation = new THREE.Vector3(0, 0, 0)
    , inverseLook = new THREE.Vector3(-1, -1, -1)
    , mouseSensitivity = new THREE.Vector3(0.25, 0.25, 0.25)
    ;

  eventEmitter.on('animate', function(data) {
    world.step(INV_MAX_FPS);

    inputVelocity.set(0, 0, 0);

    if (data.commands.forward) inputVelocity.z -= SPEED;
    if (data.commands.left) inputVelocity.x -= SPEED;
    if (data.commands.backward) inputVelocity.z += SPEED;
    if (data.commands.right) inputVelocity.x += SPEED;

    var r = aggregateRotation
      .multiply(inverseLook)
      .multiply(mouseSensitivity)
      .multiplyScalar(INV_MAX_FPS)
      .add(data.r);
    data.r.x = r.x;
    data.r.y = r.y;
    data.r.z = r.z;
    aggregateRotation.set(0, 0, 0);
    aggregateRotation.x += data.commands.mousedy;
    aggregateRotation.y += data.commands.mousedx;


    var euler = new THREE.Euler();
    euler.x = data.r.x;
    euler.y = data.r.y;
    euler.z = data.r.z;
    inputQuaternion.setFromEuler(euler, true);
    inputVelocity.applyQuaternion(inputQuaternion);

    inputVelocity.multiplyScalar(INV_MAX_FPS);

    collisionBody.velocity.x += inputVelocity.x;
    collisionBody.velocity.z += inputVelocity.z;

    eventEmitter.emit('physics:update', collisionBody.position, data.r);
  });

/*
  eventEmitter.on('player:jump', function() {
    player.collisionBody.velocity.y += 120;
  });
*/

})();
