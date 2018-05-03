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
    if (window.map.mapsection.contains(mapCard)) {
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

  var getCards = function (offers) {
    var pinArticle = document.querySelector('template').content.querySelector('.map__card');
    var afterArticle = document.querySelector('.map__filters-container');
    closeCards();
    var newArticle = pinArticle.cloneNode(true);
    newArticle.querySelector('.popup__avatar').src = offers.author.avatar;
    newArticle.querySelector('.popup__title').textContent = offers.offer.title;
    newArticle.querySelector('.popup__text--address').textContent = offers.offer.address;
    newArticle.querySelector('.popup__text--price').textContent = offers.offer.price + ' ₽/ночь';
    newArticle.querySelector('.popup__type').textContent = typesDictionary[offers.offer.type];
    newArticle.querySelector('.popup__text--capacity').textContent = offers.offer.rooms + ' комнаты для ' + offers.offer.guests + ' гостей';
    newArticle.querySelector('.popup__text--time').textContent = 'Заезд после ' + offers.offer.checkin + ', выезд до ' + offers.offer.checkout;
    newArticle.querySelector('.popup__features').textContent = '';
    newArticle.querySelector('.popup__features').appendChild(getFeatures(offers.offer.features));
    newArticle.querySelector('.popup__features + p').textContent = offers.offer.description;
    newArticle.querySelector('.popup__photos').textContent = '';
    newArticle.querySelector('.popup__photos').appendChild(getPhotos(offers.offer.photos));
    window.map.mapsection.insertBefore(newArticle, afterArticle);
    document.addEventListener('keydown', cardСloseKeydownHandler);
    document.addEventListener('click', cardCloseClickHandler);
    return newArticle;
  };

  window.card = {
    getcards: getCards,
    closecards: closeCards
  };

})();
