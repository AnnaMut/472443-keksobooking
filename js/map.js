'use strict';

(function () {

  var TAIL_SHIFT_X = 31;
  var TAIL_SHIFT_Y = 77;
  var KEYCODE_ENTER = 13;

  var MapCoords = {
    TOP: 150,
    BOTTOM: 500,
    LEFT: 0,
    RIGHT: 1200
  };

  var startCoords = {};
  var mainPin = document.querySelector('.map__pin--main');
  var mapSection = document.querySelector('.map');
  var addressPart = document.querySelector('#address');

  var closePageOverlay = function () {
    mapSection.classList.remove('map--faded');
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
    document.removeEventListener('mouseup', mainPinMouseUpHandler);
    document.removeEventListener('mousemove', mouseMoveHandler);
    fillAddressCoords(mainPin.offsetLeft + TAIL_SHIFT_X / 2, mainPin.offsetTop + TAIL_SHIFT_Y);
  };

  var mainPinKeyDownHandler = function (evt) {
    if (evt.keyCode === KEYCODE_ENTER) {
      mainPinMouseUpHandler();
    }
  };

  var closePins = function () {
    var mapPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    mapPins.forEach(function (item) {
      item.parentNode.removeChild(item);
    });
  };

  var deactivatePage = function () {
    var form = document.querySelector('.ad-form');
    var formFieldsets = document.querySelectorAll('.ad-form fieldset');
    form.reset();
    window.card.closecards();
    closePins();
    window.filters.resetfilters();
    mapSection.classList.add('map--faded');
    form.classList.add('ad-form--disabled');
    formFieldsets.forEach(function (item) {
      item.setAttribute('disabled', true);
    });
  };

  var successHandler = function (offers) {
    window.pin.getpins(offers);
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
      x: mainPin.offsetLeft - shift.x,
      y: mainPin.offsetTop - shift.y
    };

    var Border = {
      TOP: MapCoords.TOP - TAIL_SHIFT_Y,
      BOTTOM: MapCoords.BOTTOM - TAIL_SHIFT_Y,
      LEFT: MapCoords.LEFT,
      RIGHT: MapCoords.RIGHT - TAIL_SHIFT_X
    };

    if (pinPosition.x >= Border.LEFT && pinPosition.x <= Border.RIGHT) {
      mainPin.style.left = pinPosition.x + 'px';
    }

    if (pinPosition.y >= Border.TOP && pinPosition.y <= Border.BOTTOM) {
      mainPin.style.top = pinPosition.y + 'px';
    }

    var addressCoordsX = pinPosition.x + Math.ceil(TAIL_SHIFT_X / 2);
    var addressCoordsY = pinPosition.y + TAIL_SHIFT_Y;

    fillAddressCoords(addressCoordsX, addressCoordsY);
  };

  mainPin.addEventListener('mousedown', function (downEvt) {
    downEvt.preventDefault();
    startCoords = {
      x: downEvt.clientX,
      y: downEvt.clientY
    };
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mainPinMouseUpHandler);
  });

  mainPin.addEventListener('keydown', mainPinKeyDownHandler);

  window.map = {
    mapsection: mapSection,
    closepins: closePins,
    deactivatepage: deactivatePage,
  };

})();
