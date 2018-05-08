'use strict';

(function () {

  var MAX_PRICE = 1000000;

  var form = document.querySelector('.ad-form');
  var fieldsets = document.querySelectorAll('.ad-form fieldset');
  var title = form.querySelector('#title');
  var invalidBorderColorClass = 'invalidcolor';
  var type = form.querySelector('#type');
  var price = form.querySelector('#price');
  var roomNumber = form.querySelector('#room_number');
  var roomCapacity = form.querySelector('#capacity');
  var timeInSelect = form.querySelector('#timein');
  var timeOutSelect = form.querySelector('#timeout');
  var resetButton = form.querySelector('.ad-form__reset');
  var successMessage = document.querySelector('.success');

  var MaxPrice = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };

  var TitleLength = {
    MINIMUM: 30,
    MAXIMUM: 100
  };

  var MaxGuests = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  var TitleValidationMessages = {
    TOO_SHORT: 'Заголовок объявления должен состоять минимум из ' + TitleLength.MINIMUM + ' символов',
    TOO_LONG: 'Заголовок объявления не должен превышать ' + TitleLength.MAXIMUM + ' символов',
    VALUE_MISSING: 'Пожалуйста, введите заголовок Вашего объявления'
  };

  var PriceValidationMesssages = {
    RANGE_UNDER_FLOW: 'Цена для данного типа жилья слишком мала',
    RANGE_OVER_FLOW: 'Цена не должна превышать ' + MAX_PRICE,
    VALUE_MISSING: 'Пожалуйста, введите цену'
  };

  var activateForm = function () {
    form.classList.remove('ad-form--disabled');
    fieldsets.forEach(function (item) {
      item.removeAttribute('disabled');
    });
  };

  var deactivateForm = function () {
    form.reset();
    title.classList.remove('invalidcolor');
    price.classList.remove('invalidcolor');
    window.upload.removeUpload();
    form.classList.add('ad-form--disabled');
    fieldsets.forEach(function (item) {
      item.setAttribute('disabled', true);
    });
  };

  var titleInvalidHandler = function () {
    var validity = title.validity;
    if (validity.valid) {
      title.setCustomValidity('');
      title.classList.remove(invalidBorderColorClass);
      return;
    }
    if (validity.tooShort) {
      title.setCustomValidity(TitleValidationMessages.TOO_SHORT);
      title.classList.add(invalidBorderColorClass);
      return;
    }
    if (validity.tooLong) {
      title.setCustomValidity(TitleValidationMessages.TOO_LONG);
      title.classList.add(invalidBorderColorClass);
      return;
    }
    if (validity.valueMissing) {
      title.setCustomValidity(TitleValidationMessages.VALUE_MISSING);
      title.classList.add(invalidBorderColorClass);
      return;
    }
  };

  var titleBlurHandler = function (evt) {
    evt.target.checkValidity();
  };

  var titleFocusHandler = function () {
    title.classList.remove(invalidBorderColorClass);
  };

  var titleInputChangeHandler = function () {
    title.setCustomValidity('');
    title.classList.remove(invalidBorderColorClass);
  };

  var typeChangeHandler = function () {
    price.min = MaxPrice[type.value.toUpperCase()];
  };

  var priceInvalidHandler = function () {
    var validity = price.validity;
    if (validity.valid) {
      price.setCustomValidity('');
      price.classList.remove(invalidBorderColorClass);
      return;
    }
    if (validity.rangeUnderflow) {
      price.setCustomValidity(PriceValidationMesssages.RANGE_UNDER_FLOW);
      price.classList.add(invalidBorderColorClass);
      return;
    }
    if (validity.rangeOverflow) {
      price.setCustomValidity(PriceValidationMesssages.RANGE_OVER_FLOW);
      price.classList.add(invalidBorderColorClass);
      return;
    }
    if (validity.valueMissing) {
      price.setCustomValidity(PriceValidationMesssages.VALUE_MISSING);
      price.classList.add(invalidBorderColorClass);
      return;
    }
  };

  var priceBlurHandler = function (evt) {
    evt.target.checkValidity();
  };

  var priceFocusHandler = function () {
    price.classList.remove(invalidBorderColorClass);
  };

  var priceInputChangeHandler = function () {
    price.setCustomValidity('');
    price.classList.remove(invalidBorderColorClass);
  };

  var roomNumberChangeHandler = function () {
    var guests = MaxGuests[roomNumber.value];
    Array.prototype.forEach.call(roomCapacity.options, function (item) {
      if (guests.includes(item.value)) {
        item.removeAttribute('disabled');
      } else {
        item.setAttribute('disabled', '');
      }
    });
    roomCapacity.value = guests[0];
  };

  var roomcapacityChangeHandler = function () {
    var capacityValue = roomCapacity.value;
    if (!MaxGuests[roomNumber.value].includes(capacityValue)) {
      for (var key in MaxGuests) {
        if (MaxGuests[key].includes(capacityValue)) {
          roomNumber.value = key;
          roomNumberChangeHandler();
          return;
        }
      }
    }
  };

  var timeOutChangeHandler = function () {
    timeInSelect.value = timeOutSelect.value;
  };

  var timeInChangeHandler = function () {
    timeOutSelect.value = timeInSelect.value;
  };

  var resetFormClickHandler = function () {
    window.map.deactivatePage();
  };

  var removeSuccessMessageHandler = function () {
    successMessage.classList.add('hidden');
    successMessage.removeEventListener('click', removeSuccessMessageHandler);
  };

  var successHandler = function () {
    window.map.deactivatePage();
    successMessage.classList.remove('hidden');
    successMessage.addEventListener('click', removeSuccessMessageHandler);
  };

  var sendDataHandler = function (evt) {
    window.backend.sendData(new FormData(form), successHandler, window.backend.errorHandler);
    evt.preventDefault();
  };

  title.addEventListener('invalid', titleInvalidHandler);
  title.addEventListener('blur', titleBlurHandler);
  title.addEventListener('focus', titleFocusHandler);
  title.addEventListener('input', titleInputChangeHandler);
  price.addEventListener('invalid', priceInvalidHandler);
  price.addEventListener('change', typeChangeHandler);
  price.addEventListener('blur', priceBlurHandler);
  price.addEventListener('focus', priceFocusHandler);
  price.addEventListener('input', priceInputChangeHandler);
  roomNumber.addEventListener('change', roomNumberChangeHandler);
  roomCapacity.addEventListener('change', roomcapacityChangeHandler);
  timeOutSelect.addEventListener('change', timeOutChangeHandler);
  timeInSelect.addEventListener('change', timeInChangeHandler);
  resetButton.addEventListener('click', resetFormClickHandler);
  form.addEventListener('submit', sendDataHandler);

  window.form = {
    activateForm: activateForm,
    deactivateForm: deactivateForm
  };

})();
