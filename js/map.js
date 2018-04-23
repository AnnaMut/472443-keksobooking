'use strict';

var OFFER_COUNT = 8;
var MAP = {
  'left': 300,
  'top': 150,
  'right': 900,
  'bottom': 500
};

var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var ROOM_MIN = 1;
var ROOM_MAX = 5;
var GUESTS_MIN = 1;
var GUESTS_MAX = 20;
var PIN_WIDTH = 40;
var PIN_HEIGHT = 44;
var MAX_PRICE = 1000000;
var MAIN_PIN_WIDTH = 62;
var MAIN_PIN_HEIGHT = 62;

var offerTitles = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var offerTypes = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var offerCheckInTimes = [
  '12:00',
  '13:00',
  '14:00'];

var offerCheckOutTimes = [
  '12:00',
  '13:00',
  '14:00'];

var offerFeatures = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var offerPhotos = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var KeyCodes = {
  ESC: 27,
  ENTER: 13
};

var MapCoords = {
  TOP: 150,
  BOTTOM: 500,
  LEFT: 0,
  RIGHT: 1100
};
var startCoords = {};

var pinPrefix = 'pin-';
var mainPin = document.querySelector('.map__pin--main');
var mapSection = document.querySelector('.map');
var addressPart = document.querySelector('#address');
var pinClass = '.map__pin';
var formFieldsets = document.querySelectorAll('.ad-form fieldset');
var form = document.querySelector('.ad-form');
var formTitle = form.querySelector('#title');
var invalidBorderColorClass = 'invalidcolor';
var formType = form.querySelector('#type');
var formPrice = form.querySelector('#price');
var formRoomNumber = form.querySelector('#room_number');
var formRoomCapacity = form.querySelector('#capacity');
var formTimeInSelect = form.querySelector('#timein');
var formTimeOutSelect = form.querySelector('#timeout');
var formSubmitButton = form.querySelector('.ad-form__submit');
var formResetButton = form.querySelector('.ad-form__reset');

var pricesLimits = {
  'bungalo': 0,
  'flat': 1000,
  'house': 5000,
  'palace': 10000
};

var labelLimits = {
  'minimum': 30,
  'maximum': 100
};

var guests = {
  '1': ['1'],
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': ['0']
};

var formTitleValidationMessages = {
  tooShort: 'Заголовок объявления должен состоять минимум из ' + labelLimits.minimum + ' символов',
  tooLong: 'Заголовок объявления не должен превышать ' + labelLimits.maximum + ' символов',
  valueMissing: 'Пожалуйста, введите заголовок Вашего объявления'
};

var formPriceValidationMesssages = {
  rangeUnderflow: 'Цена для данного типа жилья слишком мала',
  rangeOverflow: 'Цена не должна превышать ' + MAX_PRICE,
  valueMissing: 'Пожалуйста, введите цену'
};

var randomSort = function () {
  return Math.random() - 0.5;
};

var getRandomSubarray = function (arr) {
  var copyArr = arr.slice(0).sort(randomSort);
  return copyArr.slice(0, 1 + Math.floor(Math.random() * arr.length));
};

var getRandomElement = function (arr) {
  var randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

var getRandomFromInterval = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var getSortArray = function (arr) {
  return arr.slice(0).sort(randomSort);
};

var offers = [];
var getOffers = function () {
  for (var i = 0; i < OFFER_COUNT; i++) {
    var сoordinateX = getRandomFromInterval(MAP.left, MAP.right);
    var сoordinateY = getRandomFromInterval(MAP.top, MAP.bottom);

    offers.push({
      'author': {
        'avatar': 'img/avatars/user0' + (i + 1) + '.png',
      },

      'offer': {
        'title': offerTitles[i],
        'address': сoordinateX + ',' + сoordinateY,
        'price': getRandomFromInterval(PRICE_MIN, PRICE_MAX),
        'type': getRandomElement(offerTypes),
        'rooms': getRandomFromInterval(ROOM_MIN, ROOM_MAX),
        'guests': getRandomFromInterval(GUESTS_MIN, GUESTS_MAX),
        'checkin': getRandomElement(offerCheckInTimes),
        'checkout': getRandomElement(offerCheckOutTimes),
        'features': getRandomSubarray(offerFeatures),
        'description': '',
        'photos': getSortArray(offerPhotos),
      },

      'location': {
        'x': сoordinateX,
        'y': сoordinateY,
      }
    });
  }
  return offers;
};

getOffers(OFFER_COUNT);

var closePageOverlay = function () {
  mapSection.classList.remove('map--faded');
};

var typesDictionary = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

var getFeatures = function (arr) {
  var newFeature = document.createElement('li');
  newFeature.classList.add('feature');
  var featuresBox = document.createDocumentFragment();

  for (var i = 0; i < arr.length; i++) {
    var featurePoint = newFeature.cloneNode();
    featurePoint.classList.add('feature--' + arr[i]);
    featuresBox.appendChild(featurePoint);
  }
  return featuresBox;
};

var getPhotos = function (arr) {
  var photoTemlate = document.createElement('img');
  var photoBox = document.createDocumentFragment();
  for (var i = 0; i < arr.length; i++) {
    var photoItemli = photoTemlate.cloneNode(true);
    photoItemli.src = arr[i];
    photoItemli.style = 'width:' + '70px';
    photoItemli.style = 'height:' + '70px';
    photoBox.appendChild(photoItemli);
  }
  return photoBox;
};

var cardCloseClickHandler = function (evt) {
  if (evt.target.classList.contains('popup__close')) {
    closeCards();
  }
};

var cardСloseKeydownHandler = function (evt) {
  if (evt.keyCode === KeyCodes.ESC) {
    closeCards();
  }
};
var closeCards = function () {
  var mapCard = document.querySelector('.map__card');
  if (mapSection.contains(mapCard)) {
    mapCard.remove();
  }
  document.removeEventListener('keydown', cardСloseKeydownHandler);
};

var getCards = function (i) {
  var pinArticle = document.querySelector('template').content.querySelector('.map__card');
  var afterArticle = document.querySelector('.map__filters-container');
  closeCards();
  var newArticle = pinArticle.cloneNode(true);
  newArticle.querySelector('.popup__avatar').src = offers[i].author.avatar;
  newArticle.querySelector('.popup__title').textContent = offers[i].offer.title;
  newArticle.querySelector('.popup__text--address').textContent = offers[i].offer.address;
  newArticle.querySelector('.popup__text--price').textContent = offers[i].offer.price + ' ₽/ночь';
  newArticle.querySelector('.popup__type').textContent = typesDictionary[offers[i].offer.type];
  newArticle.querySelector('.popup__text--capacity').textContent = offers[i].offer.rooms + ' комнаты для ' + offers[i].offer.guests + ' гостей';
  newArticle.querySelector('.popup__text--time').textContent = 'Заезд после ' + offers[i].offer.checkin + ', выезд до ' + offers[i].offer.checkout;
  newArticle.querySelector('.popup__features').textContent = '';
  newArticle.querySelector('.popup__features').appendChild(getFeatures(offers[i].offer.features));
  newArticle.querySelector('.popup__features + p').textContent = offers[i].offer.description;
  newArticle.querySelector('.popup__photos').textContent = '';
  newArticle.querySelector('.popup__photos').appendChild(getPhotos(offers[i].offer.photos));
  mapSection.insertBefore(newArticle, afterArticle);
  document.addEventListener('keydown', cardСloseKeydownHandler);
  document.addEventListener('click', cardCloseClickHandler);
  return newArticle;
};

var pinClickHandler = function (evt) {
  closeCards();
  var index = parseInt(evt.currentTarget.id.substr(pinPrefix.length), 10);
  getCards(index);
};

var getPins = function () {
  var pinsBox = document.querySelector('.map__pins');
  var pinTemplate = document.querySelector('template').content.querySelector(pinClass);
  var pinFragment = document.createDocumentFragment();
  for (var i = 0; i < OFFER_COUNT; i++) {
    var template = pinTemplate.cloneNode(true);
    template.style.left = offers[i].location.x - PIN_WIDTH + 'px';
    template.style.top = offers[i].location.y - PIN_HEIGHT + 'px';
    template.querySelector('img').src = offers[i].author.avatar;
    template.id = pinPrefix + i;
    pinFragment.appendChild(template);
    template.addEventListener('click', pinClickHandler);
  }
  pinsBox.appendChild(pinFragment);
};

var mainPinMouseUpHandler = function () {
  closePageOverlay();
  getActiveFieldsets();
  getPins();
  mainPin.removeEventListener('mouseup', mainPinMouseUpHandler);
};

var getActiveFieldsets = function () {
  form.classList.remove('ad-form--disabled');
  formFieldsets.forEach(function (item) {
    item.removeAttribute('disabled');
  });
};

var closePins = function () {
  var mapPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
  mapPins.forEach(function (item) {
    item.parentNode.removeChild(item);
  });
};

var formTitleInvalidHandler = function () {
  var validity = formTitle.validity;
  switch (validity) {
    case (validity.valid):
      formTitle.setCustomValidity('');
      formTitle.classList.remove(invalidBorderColorClass);
      break;

    case (validity.tooShort):
      formTitle.setCustomValidity(formTitleValidationMessages.tooShort);
      formTitle.classList.add(invalidBorderColorClass);
      break;

    case (validity.tooLong):
      formTitle.setCustomValidity(formTitleValidationMessages.tooLong);
      formTitle.classList.add(invalidBorderColorClass);
      break;

    case (validity.valueMissing):
      formTitle.setCustomValidity(formTitleValidationMessages.valueMissing);
      formTitle.classList.add(invalidBorderColorClass);
      break;
  }
};

var formTitleBlurHandler = function (evt) {
  evt.target.checkValidity();
};

var formTitleFocusHandler = function () {
  formTitle.classList.remove(invalidBorderColorClass);
};

var formTitleChangeHandler = function () {
  formTitle.setCustomValidity('');
  formTitle.classList.remove(invalidBorderColorClass);
};

var formTypeChangeHandler = function () {
  formPrice.min = pricesLimits[formType.value];
};

var formPriceInvalidHandler = function () {
  var validity = formPrice.validity;
  switch (validity) {
    case (validity.valid):
      formPrice.setCustomValidity('');
      formPrice.classList.remove(invalidBorderColorClass);
      break;
    case (validity.rangeUnderflow):
      formPrice.setCustomValidity(formPriceValidationMesssages.rangeUnderflow);
      formPrice.classList.add(invalidBorderColorClass);
      break;
    case (validity.rangeOverflow):
      formPrice.setCustomValidity(formPriceValidationMesssages.rangeOverflow);
      formPrice.classList.add(invalidBorderColorClass);
      break;

    case (validity.valueMissing):
      formPrice.setCustomValidity(formPriceValidationMesssages.valueMissing);
      formPrice.classList.add(invalidBorderColorClass);
      break;
  }
};

var formPriceChangeHandler = function () {
  formPrice.setCustomValidity('');
  formPrice.classList.remove(invalidBorderColorClass);
};

var formRoomNumberChangeHandler = function () {
  var key = formRoomNumber.value;
  formRoomCapacity.value = guests[key][0];
  for (var i = 0; i < formRoomCapacity.options.length; i++) {
    if (guests[key].indexOf(formRoomCapacity.options[i].value) === -1) {
      formRoomCapacity.options[i].setAttribute('disabled', '');
    } else {
      formRoomCapacity.options[i].removeAttribute('disabled');
    }
  }
};

var formTimeOutChangeHandler = function () {
  formTimeInSelect.value = formTimeOutSelect.value;
};

var formTimeInChangeHandler = function () {
  formTimeOutSelect.value = formTimeInSelect.value;
};

var formSubmitButtonClickHandler = function () {
  formTitle.addEventListener('invalid', formTitleInvalidHandler);
  formPrice.addEventListener('invalid', formPriceInvalidHandler);
};

var resetFormClickHandler = function () {
  formTitle.classList.remove(invalidBorderColorClass);
  formPrice.classList.remove(invalidBorderColorClass);
  form.reset();
  closeCards();
  closePins();
  mapSection.classList.add('map--faded');
  form.classList.add('ad-form--disabled');
  formFieldsets.forEach(function (item) {
    item.setAttribute('disabled', true);
  });
  mainPin.addEventListener('mouseup', mainPinMouseUpHandler);
};

var fillAddressCoords = function (x, y) {
  var positionX = parseInt(x, 10);
  var positionY = parseInt(y, 10) + MAIN_PIN_HEIGHT / 2;
  addressPart.value = positionX + ', ' + positionY;
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

  fillAddressCoords(mainPin.offsetLeft, mainPin.offsetTop);

  var pinPosition = {
    top: mainPin.offsetTop - shift.y,
    left: mainPin.offsetLeft - shift.x
  };

  var limitPosition = function (element, min, max) {
    return Math.min(Math.max(element, min), max);
  };

  pinPosition.left = limitPosition(pinPosition.left, MapCoords.LEFT + Math.ceil(MAIN_PIN_WIDTH / 2), MapCoords.RIGHT - Math.ceil(MAIN_PIN_WIDTH / 2));
  pinPosition.top = limitPosition(pinPosition.top, MapCoords.TOP - Math.ceil(MAIN_PIN_HEIGHT / 2), MapCoords.BOTTOM - Math.ceil(MAIN_PIN_HEIGHT / 2));

  mainPin.style.top = pinPosition.top + 'px';
  mainPin.style.left = pinPosition.left + 'px';
  fillAddressCoords(mainPin.style.top, mainPin.style.left);
};

var mouseUpHandler = function (upEvt) {
  upEvt.preventDefault();
  document.removeEventListener('mousemove', mouseMoveHandler);
  document.removeEventListener('mouseup', mouseUpHandler);
};

var mainPinMouseDownHandler = function (downEvt) {
  startCoords = {
    x: downEvt.clientX,
    y: downEvt.clientY
  };
  document.addEventListener('mousemove', mouseMoveHandler);
  document.addEventListener('mouseup', mouseUpHandler);
};

mainPin.addEventListener('mouseup', mainPinMouseUpHandler);// удалила на строке 284

formTitle.addEventListener('blur', formTitleBlurHandler);
formTitle.addEventListener('focus', formTitleFocusHandler);
formTitle.addEventListener('change', formTitleChangeHandler);
formPrice.addEventListener('change', formTypeChangeHandler);
formPrice.addEventListener('change', formPriceChangeHandler);
formRoomNumber.addEventListener('change', formRoomNumberChangeHandler);
formTimeOutSelect.addEventListener('change', formTimeOutChangeHandler);
formTimeInSelect.addEventListener('change', formTimeInChangeHandler);
formSubmitButton.addEventListener('click', formSubmitButtonClickHandler);
formResetButton.addEventListener('click', resetFormClickHandler);


mainPin.addEventListener('mousedown', mainPinMouseDownHandler);
