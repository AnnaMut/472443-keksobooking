'use strict';

(function () {

  var PIN_WIDTH = 40;
  var PIN_HEIGHT = 44;
  var OFFER_COUNT = 8;

  var pin = '.map__pin';

  var createPin = function (offers) {
    var pinTemplate = document.querySelector('template').content.querySelector(pin).cloneNode(true);
    var template = pinTemplate.cloneNode(true);
    template.style.left = offers.location.x - PIN_WIDTH + 'px';
    template.style.top = offers.location.y - PIN_HEIGHT + 'px';
    template.querySelector('img').src = offers.author.avatar;
    template.addEventListener('click', function () {
      window.card.getcards(offers);
    });

    return template;
  };

  var getPins = function (offers) {
    var pins = [];
    var fragment = document.createDocumentFragment();
    var pinsBox = document.querySelector('.map__pins');
    for (var i = 0; i < OFFER_COUNT; i++) {

      pins[i] = fragment.appendChild(createPin(offers[i]));
    }
    pinsBox.appendChild(fragment);
  };

  window.pin = {
    getpins: getPins
  };

})();
