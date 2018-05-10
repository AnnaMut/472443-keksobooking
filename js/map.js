'use strict';

(function () {

  var TAIL_SHIFT_X = 32.5;
  var TAIL_SHIFT_Y = 77;
  var KEYCODE_ENTER = 13;
  var OFFER_COUNT = 5;

  var MainPinDefaultPosition = {
    X: 570,
    Y: 375
  };

  var MoveBorder = {
    TOP: 150,
    BOTTOM: 500,
    LEFT: 0,
    RIGHT: 1200
  };

  var isPageActive = false;
  var startCoords = {};
  var mainPin = document.querySelector('.map__pin--main');
  var mapSection = document.querySelector('.map');
  var addressPart = document.querySelector('#address');

  var activateMap = function () {
    mapSection.classList.remove('map--faded');
  };

  var setDefaultAdressCoords = function () {
    addressPart.value = MainPinDefaultPosition.X + ', ' + MainPinDefaultPosition.Y;
  };

  var resetMainPinPosition = function () {
    mainPin.style.left = MainPinDefaultPosition.X + 'px';
    mainPin.style.top = MainPinDefaultPosition.Y + 'px';
  };

  var fillAddressCoords = function (x, y) {
    var positionX = parseInt(x, 10);
    var positionY = parseInt(y, 10);
    addressPart.value = positionX + ', ' + positionY;
  };

  var renderPins = function (data) {
    var pin = document.createDocumentFragment();
    var pins = document.querySelector('.map__pins');
    var counter = Math.min(data.length, OFFER_COUNT);
    for (var i = 0; i < counter; i++) {
      pin.appendChild(window.pin.createPin(data[i]));
    }
    pins.appendChild(pin);
  };

  var successHandler = function (data) {
    window.map.offers = data.slice(0);
    renderPins(window.map.offers);
  };

  var activatePage = function () {
    if (!isPageActive) {
      activateMap();
      window.form.activateForm();
      window.backend.loadData(successHandler, window.backend.errorHandler);
      fillAddressCoords(mainPin.offsetLeft + TAIL_SHIFT_X, mainPin.offsetTop + TAIL_SHIFT_Y);
      isPageActive = true;
    }
  };

  var mainPinKeyDownHandler = function (evt) {
    if (evt.keyCode === KEYCODE_ENTER) {
      activatePage();
    }
    mainPin.removeEventListener('keydown', mainPinKeyDownHandler);
  };

  var removePins = function () {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (item) {
      item.parentNode.removeChild(item);
    });
  };

  var deactivatePage = function () {
    window.card.closeCards();
    removePins();
    window.filters.resetFilters();
    window.form.deactivateForm();
    mapSection.classList.add('map--faded');
    resetMainPinPosition();
    setDefaultAdressCoords();
    isPageActive = false;
    mainPin.addEventListener('keydown', mainPinKeyDownHandler);
  };

  var mouseMoveHandler = function (moveEvt) {
    activatePage();
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
      TOP: MoveBorder.TOP - TAIL_SHIFT_Y,
      BOTTOM: MoveBorder.BOTTOM - TAIL_SHIFT_Y,
      LEFT: MoveBorder.LEFT,
      RIGHT: MoveBorder.RIGHT - TAIL_SHIFT_X * 2
    };
    if (pinPosition.x >= Border.LEFT && pinPosition.x <= Border.RIGHT) {
      mainPin.style.left = pinPosition.x + 'px';
    }
    if (pinPosition.y >= Border.TOP && pinPosition.y <= Border.BOTTOM) {
      mainPin.style.top = pinPosition.y + 'px';
    }

    var addressCoordsX = pinPosition.x + Math.ceil(TAIL_SHIFT_X);
    var addressCoordsY = pinPosition.y + Math.ceil(TAIL_SHIFT_Y);

    fillAddressCoords(addressCoordsX, addressCoordsY);
  };

  var mouseUpHandler = function () {
    activatePage();
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  mainPin.addEventListener('keydown', mainPinKeyDownHandler);
  setDefaultAdressCoords();

  window.map = {
    mapSection: mapSection,
    renderPins: renderPins,
    removePins: removePins,
    offers: [],
    deactivatePage: deactivatePage,
  };

})();
