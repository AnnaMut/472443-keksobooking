'use strict';

(function () {

  var TAIL_SHIFT_X = 31;
  var TAIL_SHIFT_Y = 77;
  var KEYCODE_ENTER = 13;
  var OFFER_COUNT = 5;

  var MapCoords = {
    TOP: 150,
    BOTTOM: 500,
    LEFT: 0,
    RIGHT: 1200
  };

  var startCoords = {};
  var offers = [];
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

  var getPins = function (data) {
    var pins = [];
    var fragment = document.createDocumentFragment();
    var pinsBox = document.querySelector('.map__pins');
    var counter = Math.min(data.length, OFFER_COUNT);
    for (var i = 0; i < counter; i++) {
      pins[i] = fragment.appendChild(window.pin.createpin(data[i]));
    }
    pinsBox.appendChild(fragment);
  };

  var successHandler = function (data) {
    offers = data.slice(0);
    getPins(offers);
  };

  var mainPinMouseUpHandler = function () {
    closePageOverlay();
    getActiveFieldsets();
    window.backend.loaddata(successHandler, window.backend.errorhandler);
    mainPin.removeEventListener('mouseup', mainPinMouseUpHandler);
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
    var formTitle = form.querySelector('#title');
    var formPrice = form.querySelector('#price');
    form.reset();
    formTitle.classList.remove('invalidcolor');
    formPrice.classList.remove('invalidcolor');
    window.card.closecards();
    closePins();
    window.filters.resetfilters();
    mapSection.classList.add('map--faded');
    form.classList.add('ad-form--disabled');
    formFieldsets.forEach(function (item) {
      item.setAttribute('disabled', true);
    });
    mainPin.addEventListener('mouseup', mainPinMouseUpHandler);
  };

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    startCoords = {
      x: evt.clientX,
      y: evt.clientY
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

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  mainPin.addEventListener('mouseup', mainPinMouseUpHandler);
  mainPin.addEventListener('keydown', mainPinKeyDownHandler);

  window.map = {
    mapsection: mapSection,
    getpins: getPins,
    closepins: closePins,
    offers: offers,
    deactivatepage: deactivatePage,
  };

})();
