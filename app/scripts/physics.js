importScripts(
    '../bower_components/threejs/build/three.js'
  , '../bower_components/eventEmitter/EventEmitter.js'
  , 'vendor/cannon.js'
  , 'events.js'
  , 'cannon.js'
);

console.log('hi');

onmessage = function(event) {
  eventEmitter.emit(event.data.name, event.data.data);
}

eventEmitter.on('physics:update', function(position, rotation) {
  var message = {
    name: 'physics:update',
    data: {
      position: position,
      rotation: rotation
    }
  }
  postMessage(message);
});
