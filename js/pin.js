'use strict';

(function () {

  var PIN_WIDTH = 40;
  var PIN_HEIGHT = 44;

  var createPin = function (data) {
    var pin = document.querySelector('template').content.querySelector('.map__pin');
    var newPin = pin.cloneNode(true);
    newPin.style.left = data.location.x - PIN_WIDTH + 'px';
    newPin.style.top = data.location.y - PIN_HEIGHT + 'px';
    newPin.querySelector('img').src = data.author.avatar;
    newPin.addEventListener('click', function () {
      window.card.getCards(data);
    });

    return newPin;
  };

  window.pin = {
    createPin: createPin
  };

})();
