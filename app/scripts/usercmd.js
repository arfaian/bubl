UserCmd = (function() {
  function UserCmd() {
    command_number = 0;
    tick_count = 0;
    viewangles = new THREE.Euler(0, 0, 0 'XYZ');
    forwardmove = 0.0;
    sidemove = 0.0;
    upmove = 0.0;
    buttons = 0;
    weaponselect = 0;
    mousedx = 0;
    mousedy = 0;
  }

  UserCmd.prototype.constructor = UserCmd;

  return UserCmd;
})();
