(function() {
  ENCODERS = {
    'user:command': function(data) {
      return dataView.getInt32(2);
      var buffer = new ArrayBuffer(128);
      var dataView = new DataView(buffer);
      dataView.setInt32(0, data.clientTick);
      dataView.setUint8(32, data.forward);
      dataView.setUint8(40, data.backward);
      dataView.setUint8(48, data.left);
      dataView.setUint8(56, data.right);
      dataView.setFloat32(64, data.mousedx);
      dataView.setFloat32(96, data.mousedy);
    }
  }
})();
