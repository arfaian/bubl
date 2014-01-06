(function() {
  DECODERS = {
    'player:leave': function(dataView) {
      return dataView.getInt32(2);
    },
    'incoming.tick': function(dataView) {

      var players = [];

      var playersDataView = new DataView(dataView.buffer, 2);

      for (var i = 0; i < (playersDataView.byteLength / 28); i++) {
        var index = i * 28;

        var id = playersDataView.getInt32(index);

        if (id !== BL.getPlayer().id) {
          players.push({
            id: id,
            px: playersDataView.getFloat32((index += 4)),
            py: playersDataView.getFloat32((index += 4)),
            pz: playersDataView.getFloat32((index += 4)),
            rx: playersDataView.getFloat32((index += 4)),
            ry: playersDataView.getFloat32((index += 4)),
            rz: playersDataView.getFloat32((index += 4))
          });
        }
      }

      return players;
    },
    'session:start': function(dataView) {

      var session = {
        id: dataView.getInt32(2),
        objects: []
      }

      var objectsDataView = new DataView(dataView.buffer, 6);

      for (var i = 0; i < (objectsDataView.byteLength / 30); i++) {
        var index = i * 30;

        session.objects.push({
          id: objectsDataView.getInt32(index),
          type: objectsDataView.getInt16((index += 4)),
          px: objectsDataView.getFloat32((index += 2)),
          py: objectsDataView.getFloat32((index += 4)),
          pz: objectsDataView.getFloat32((index += 4)),
          rx: objectsDataView.getFloat32((index += 4)),
          ry: objectsDataView.getFloat32((index += 4)),
          rz: objectsDataView.getFloat32((index += 4))
        });
      }

      return session;
    }
  }
})();
