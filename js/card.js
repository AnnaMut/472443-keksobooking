'use strict';

(function () {

  var KeyCodes = {
    ESC: 27,
    // ENTER: 13 перепишу когда решим что делать с активацией страницы по энтеру
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

  var removeActiveClass = function () {
    var activePin = document.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
  };

  var closeCards = function () {
    var mapCard = document.querySelector('.map__card');
    if (window.constandvars.mapsection.contains(mapCard)) {
      mapCard.remove();
      removeActiveClass();
    }
    document.removeEventListener('keydown', cardСloseKeydownHandler);
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

  var getCards = function (i) {
    var pinArticle = document.querySelector('template').content.querySelector('.map__card');
    var afterArticle = document.querySelector('.map__filters-container');
    closeCards();
    var newArticle = pinArticle.cloneNode(true);
    newArticle.querySelector('.popup__avatar').src = window.constandvars.offers[i].author.avatar;
    newArticle.querySelector('.popup__title').textContent = window.constandvars.offers[i].offer.title;
    newArticle.querySelector('.popup__text--address').textContent = window.constandvars.offers[i].offer.address;
    newArticle.querySelector('.popup__text--price').textContent = window.constandvars.offers[i].offer.price + ' ₽/ночь';
    newArticle.querySelector('.popup__type').textContent = typesDictionary[window.constandvars.offers[i].offer.type];
    newArticle.querySelector('.popup__text--capacity').textContent = window.constandvars.offers[i].offer.rooms + ' комнаты для ' + window.constandvars.offers[i].offer.guests + ' гостей';
    newArticle.querySelector('.popup__text--time').textContent = 'Заезд после ' + window.constandvars.offers[i].offer.checkin + ', выезд до ' + window.constandvars.offers[i].offer.checkout;
    newArticle.querySelector('.popup__features').textContent = '';
    newArticle.querySelector('.popup__features').appendChild(getFeatures(window.constandvars.offers[i].offer.features));
    newArticle.querySelector('.popup__features + p').textContent = window.constandvars.offers[i].offer.description;
    newArticle.querySelector('.popup__photos').textContent = '';
    newArticle.querySelector('.popup__photos').appendChild(getPhotos(window.constandvars.offers[i].offer.photos));
    window.constandvars.mapsection.insertBefore(newArticle, afterArticle);
    document.addEventListener('keydown', cardСloseKeydownHandler);
    document.addEventListener('click', cardCloseClickHandler);
    return newArticle;
  };

  window.card = {
    getcards: getCards,
    closecards: closeCards
  };

})();
