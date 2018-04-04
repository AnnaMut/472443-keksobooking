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

var randomSort = function () {
  return Math.random() - 0.5;
};

var getRandomSubarray = function (arr) {
  var copyArr = arr.sort(randomSort);
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
        'title': offerTitles.sort(randomSort)[i],
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
};

getOffers(OFFER_COUNT);

var mapSection = document.querySelector('.map');
var closePageOverlay = function () {
  mapSection.classList.remove('map--faded');
};
closePageOverlay();
var pinsClass = '.map__pin';

var getPins = function () {
  var pinsBox = document.querySelector('.map__pins');
  var pinTemplate = document.querySelector('template').content.querySelector(pinsClass);
  var pinFragment = document.createDocumentFragment();
  for (var i = 0; i < OFFER_COUNT; i++) {
    var template = pinTemplate.cloneNode(true);
    template.style.left = offers[i].location.x - PIN_WIDTH + 'px';
    template.style.top = offers[i].location.y - PIN_HEIGHT + 'px';
    template.querySelector('img').src = offers[i].author.avatar;
    pinFragment.appendChild(template);
  }
  pinsBox.appendChild(pinFragment);
};

getPins();

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

var getArticles = function () {
  var pinArticle = document.querySelector('template').content.querySelector('.map__card');
  var afterArticle = document.querySelector('.map__filters-container');
  var newArticle = pinArticle.cloneNode(true);
  var articleFragment = document.createDocumentFragment();
  articleFragment.appendChild(newArticle);
  mapSection.insertBefore(newArticle, afterArticle);

  for (var i = 0; i < OFFER_COUNT; i++) {
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
  }
};

getArticles();
