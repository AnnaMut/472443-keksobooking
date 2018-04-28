'use strict';

(function () {

  var TAIL_SHIFT_X = 31;
  var TAIL_SHIFT_Y = 77;

  var MapCoords = {
    TOP: 150 - TAIL_SHIFT_Y,
    BOTTOM: 500,
    LEFT: 0,
    RIGHT: 1100 - TAIL_SHIFT_X
  };

  var startCoords = {};
  var mainPin = document.querySelector('.map__pin--main');
  var addressPart = document.querySelector('#address');

  var closePageOverlay = function () {
    window.constandvars.mapsection.classList.remove('map--faded');
  };

  var getActiveFieldsets = function () {
    var form = document.querySelector('.ad-form');
    var formFieldsets = document.querySelectorAll('.ad-form fieldset');
    form.classList.remove('ad-form--disabled');
    formFieldsets.forEach(function (item) {
      item.removeAttribute('disabled');
    });
  };

  var fillAddressCoords = function (x, y) {
    var positionX = parseInt(x, 10);
    var positionY = parseInt(y, 10);
    addressPart.value = positionX + ', ' + positionY;
  };

  var mainPinMouseUpHandler = function () {
    closePageOverlay();
    getActiveFieldsets();
    window.backend.loaddata(successHandler, window.backend.errorhandler);
    mainPin.removeEventListener('mouseup', mainPinMouseUpHandler);
    window.constandvars.mapsection.removeEventListener('mousemove', mouseMoveHandler);
    fillAddressCoords(mainPin.offsetLeft + TAIL_SHIFT_X, mainPin.offsetTop + TAIL_SHIFT_Y);
  };

  var successHandler = function (offers) {
    window.constandvars.offers = offers;
    window.pin.getpins();
  };

  var mouseMoveHandler = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var pinPosition = {
      left: mainPin.offsetLeft - shift.x,
      top: mainPin.offsetTop - shift.y
    };

    var limitPosition = function (element, min, max) {
      return Math.min(Math.max(element, min), max);
    };

    pinPosition.left = limitPosition(pinPosition.left, MapCoords.LEFT, MapCoords.RIGHT);
    pinPosition.top = limitPosition(pinPosition.top, MapCoords.TOP, MapCoords.BOTTOM);

    mainPin.style.left = pinPosition.left + 'px';
    mainPin.style.top = pinPosition.top + 'px';

    var newAddresscoors = {
      x: pinPosition.left + 'px',
      y: pinPosition.top + TAIL_SHIFT_Y + 'px',
    };
    fillAddressCoords(newAddresscoors.x, newAddresscoors.y);
  };

  mainPin.addEventListener('mousedown', function (downEvt) {
    startCoords = {
      x: downEvt.clientX,
      y: downEvt.clientY
    };
    window.constandvars.mapsection.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mainPinMouseUpHandler);
  });

  window.map = {
    mainpinmouseuphandler: mainPinMouseUpHandler,
    mainpin: mainPin
  };

  var KeyCodes = {
    ESC: 27,
    ENTER: 13
  };
  var mainPinKeyDownHandler = function (evt) {
    if (evt.keyCode === KeyCodes.ENTER) {
      mainPinMouseUpHandler();
    }
    mainPin.removeEventListener('keydown', mainPinKeyDownHandler);
  };
  mainPin.addEventListener('keydown', mainPinKeyDownHandler);

})();
