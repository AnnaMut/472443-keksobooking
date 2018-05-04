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
    LOW: {min: 0, max: 9999},
    MIDDLE: {min: 10000, max: 49999},
    HIGH: {min: 50000, max: 1000000},
    ANY: {min: 0, max: 1000000}
  };

  var getHomeType = function (offer) {
    return homeType.value === ANY_FILTER ? true : homeType.value === offer.offer.type;
  };

  var getHomePrice = function (offer) {
    var priceType = Prices[homePrice.value.toUpperCase()];
    return offer.offer.price >= priceType.min && offer.offer.price <= priceType.max;
  };

  var getHomeRooms = function (offer) {
    return homeRooms.value === ANY_FILTER ? true : +homeRooms.value === offer.offer.rooms;
  };

  var getHomeGuests = function (offer) {
    return homeGuests.value === ANY_FILTER ? true : +homeGuests.value === offer.offer.guests;
  };

  var getHomeFeatures = function (offer) {
    for (var i = 0; i < featuresCollection.length; i++) {
      if (featuresCollection[i].checked && offer.offer.features.indexOf(featuresCollection[i].value) < 0) {
        return false;
      }
    }
    return true;
  };

  var filterChangeHandler = function () {
    window.card.closecards();
    window.map.closepins();
    var offers = window.map.offers.slice(0);
    var filteredOffers = offers
        .filter(getHomeType)
        .filter(getHomePrice)
        .filter(getHomeRooms)
        .filter(getHomeGuests)
        .filter(getHomeFeatures);
    window.debounce.setdebounce(window.map.getpins(filteredOffers));
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
    resetfilters: resetFilters
  };

})();

