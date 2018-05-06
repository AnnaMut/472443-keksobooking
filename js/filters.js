'use strict';

(function () {

  var ANY_FILTER = 'any';

  var homeType = document.querySelector('#housing-type');
  var homePrice = document.querySelector('#housing-price');
  var homeRooms = document.querySelector('#housing-rooms');
  var homeGuests = document.querySelector('#housing-guests');
  var homeFeatures = document.querySelector('#housing-features');
  var featuresCollection = homeFeatures.querySelectorAll('input');

  var Prices = {
    low: {min: 0, max: 9999},
    middle: {min: 10000, max: 49999},
    high: {min: 50000, max: 1000000},
    any: {min: 0, max: 1000000}
  };

  var getHomeType = function (offer) {
    return homeType.value === ANY_FILTER ? true : homeType.value === offer.offer.type;
  };

  var getHomePrice = function (offer) {
    var priceType = Prices[homePrice.value];
    return offer.offer.price >= priceType.min && offer.offer.price <= priceType.max;
  };

  var getHomeRooms = function (offer) {
    return homeRooms.value === ANY_FILTER ? true : +homeRooms.value === offer.offer.rooms;
  };

  var getHomeGuests = function (offer) {
    return homeGuests.value === ANY_FILTER ? true : +homeGuests.value === offer.offer.guests;
  };

  var getHomeFeatures = function (offer) {
    var checkedFeatures = [];
    featuresCollection.forEach(function (item) {
      if (item.checked) {
        checkedFeatures.push(item.value);
      }
    });
    var isChecked = true;
    checkedFeatures.forEach(function (item) {
      if (!offer.offer.features.includes(item)) {
        isChecked = false;
      }
    });
    return isChecked;
  };

  var filterChangeHandler = function () {
    window.card.closeCards();
    window.map.removePins();
    var offers = window.map.offers.slice(0);
    var filteredOffers = offers
        .filter(getHomeType)
        .filter(getHomePrice)
        .filter(getHomeRooms)
        .filter(getHomeGuests)
        .filter(getHomeFeatures);
    window.debounce.setDebounce(window.map.renderPins(filteredOffers));
  };

  var resetFilters = function () {
    homeType.value = ANY_FILTER;
    homePrice.value = ANY_FILTER;
    homeRooms.value = ANY_FILTER;
    homeGuests.value = ANY_FILTER;
    featuresCollection.forEach(function (item) {
      item.checked = false;
      return item;
    });
  };

  homeType.addEventListener('change', filterChangeHandler);
  homePrice.addEventListener('change', filterChangeHandler);
  homeRooms.addEventListener('change', filterChangeHandler);
  homeGuests.addEventListener('change', filterChangeHandler);
  homeFeatures.addEventListener('change', filterChangeHandler);

  window.filters = {
    resetFilters: resetFilters
  };

})();

