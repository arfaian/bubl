function setPreciseInterval(fn, timeInMillis) {
  fn();

  var start = window.performance.now()
    , timeoutTime = timeInMillis
    ;

  (function wrapper() {
    setTimeout(function() {
      var current = window.performance.now()
      var offset = current - start - timeInMillis;
      timeoutTime -= offset;
      start = current;

      fn();
      wrapper();
    }, timeoutTime);
  })();
}
