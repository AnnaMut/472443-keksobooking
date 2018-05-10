'use strict';

(function () {

  var form = document.querySelector('.ad-form');
  var fieldsets = document.querySelectorAll('.ad-form fieldset');
  var title = form.querySelector('#title');
  var invalidBorderColor = 'invalidcolor';
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

  var MaxGuests = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  var titleValidationMessage = 'Заголовок должен быть длиной от 30 до 100 символов';

  var LabelPath = {
    FIRST: 'Цена должна быть от ',
    SECOND: ' до ',
    THIRD: ' рублей'
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

  var setFieldValidity = function (field, isValid, message) {
    if (isValid) {
      field.setCustomValidity('');
      field.classList.remove(invalidBorderColor);
    } else {
      field.setCustomValidity(message);
      field.classList.add(invalidBorderColor);
    }
  };

  var titleInvalidHandler = function () {
    setFieldValidity(title, false, titleValidationMessage);
  };

  var titleInputChangeHandler = function () {
    if (title.value.length >= title.minLength && title.value.length <= title.maxLength) {
      setFieldValidity(title, true);
    }
  };

  var priceInvalidHandler = function () {
    var validationLabel = LabelPath.FIRST + price.min + LabelPath.SECOND + price.max + LabelPath.THIRD;
    setFieldValidity(price, false, validationLabel);
  };

  var priceInputChangeHandler = function () {
    price.min = MaxPrice[type.value.toUpperCase()];
    if (+price.value >= +price.min && +price.value <= +price.max) {
      setFieldValidity(price, true);
    }
  };

  var typeChangeHandler = function () {
    price.min = MaxPrice[type.value.toUpperCase()];
    price.placeholder = MaxPrice[type.value.toUpperCase()];
    setFieldValidity(price, true);
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
    evt.preventDefault();
    window.backend.sendData(new FormData(form), successHandler, window.backend.errorHandler);
  };

  title.addEventListener('invalid', titleInvalidHandler);
  title.addEventListener('input', titleInputChangeHandler);
  type.addEventListener('change', typeChangeHandler);
  price.addEventListener('invalid', priceInvalidHandler);
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
