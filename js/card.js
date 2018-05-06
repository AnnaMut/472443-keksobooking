'use strict';

(function () {

  var KEYCODE_ESC = 27;

  var ApartmentType = {
    PALACE: 'Дворец',
    FLAT: 'Квартира',
    HOUSE: 'Дом',
    BUNGALO: 'Бунгало'
  };

  var getFeatures = function (data) {
    var features = document.createDocumentFragment();
    var feature = document.createElement('li');
    feature.classList.add('popup__feature');
    feature.classList.add('popup__feature--' + data);
    features.appendChild(feature);
    return features;
  };


  var getPhotos = function (data) {
    var photos = document.createDocumentFragment();
    var photo = document.createElement('img');
    photo.classList.add('popup__photo');
    photo.src = data;
    photo.style = 'width:' + '70px';
    photo.style = 'height:' + '70px';
    photos.appendChild(photo);
    return photos;
  };

  var removeActiveClass = function () {
    var activePin = document.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
  };

  var closeCards = function () {
    var card = window.map.mapSection.querySelector('.map__card');
    if (card) {
      card.remove();
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
    if (evt.keyCode === KEYCODE_ESC) {
      closeCards();
    }
  };

  var getCards = function (data) {
    var card = document.querySelector('template').content.querySelector('.map__card');
    closeCards();
    var newCard = card.cloneNode(true);
    newCard.querySelector('.popup__avatar').src = data.author.avatar;
    newCard.querySelector('.popup__title').textContent = data.offer.title;
    newCard.querySelector('.popup__text--address').textContent = data.offer.address;
    newCard.querySelector('.popup__text--price').textContent = data.offer.price + ' ₽/ночь';
    newCard.querySelector('.popup__type').textContent = ApartmentType[data.offer.type.toUpperCase()];
    newCard.querySelector('.popup__text--capacity').textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
    newCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
    newCard.querySelector('.popup__features').textContent = '';
    data.offer.features.forEach(function (item) {
      newCard.querySelector('.popup__features').appendChild(getFeatures(item));
    });
    newCard.querySelector('.popup__features + p').textContent = data.offer.description;
    newCard.querySelector('.popup__photos').textContent = '';
    data.offer.photos.forEach(function (item) {
      newCard.querySelector('.popup__photos').appendChild(getPhotos(item));
    });
    window.map.mapSection.insertBefore(newCard, document.querySelector('.map__filters-container'));
    document.addEventListener('keydown', cardСloseKeydownHandler);
    document.addEventListener('click', cardCloseClickHandler);
    return newCard;
  };

  window.card = {
    getCards: getCards,
    closeCards: closeCards
  };

})();
