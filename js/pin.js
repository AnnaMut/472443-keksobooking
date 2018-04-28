'use strict';

(function () {

  var PIN_WIDTH = 40;
  var PIN_HEIGHT = 44;

  var pinClass = '.map__pin';

  var pinClickHandler = function (evt) {
    window.card.closecards();
    var index = parseInt(evt.currentTarget.id.substr(window.constandvars.pinprefix.length), 10);
    evt.currentTarget.classList.add('map__pin--active');
    window.card.getcards(index);
  };

  var getPins = function () {
    var pinsBox = document.querySelector('.map__pins');
    var pinTemplate = document.querySelector('template').content.querySelector(pinClass);
    var pinFragment = document.createDocumentFragment();
    for (var i = 0; i < window.constandvars.offercount; i++) {
      var template = pinTemplate.cloneNode(true);
      template.style.left = window.constandvars.offers[i].location.x - PIN_WIDTH + 'px';
      template.style.top = window.constandvars.offers[i].location.y - PIN_HEIGHT + 'px';
      template.querySelector('img').src = window.constandvars.offers[i].author.avatar;
      template.id = window.constandvars.pinprefix + i;
      pinFragment.appendChild(template);
      template.addEventListener('click', pinClickHandler);
    }
    pinsBox.appendChild(pinFragment);
  };

  window.pin = {
    getpins: getPins
  };

})();
