'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;
  var lastTimeOut = 0;

  var setDebounce = function (cb) {
    if (lastTimeOut) {
      clearTimeout(lastTimeOut);
    }
    lastTimeOut = setTimeout(cb, DEBOUNCE_INTERVAL);
  };

  window.debounce = {
    setDebounce: setDebounce
  };

})();
