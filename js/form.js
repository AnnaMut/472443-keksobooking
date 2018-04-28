'use strict';

(function () {

  var MAX_PRICE = 1000000;

  var formFieldsets = document.querySelectorAll('.ad-form fieldset');
  var form = document.querySelector('.ad-form');
  var formTitle = form.querySelector('#title');
  var invalidBorderColorClass = 'invalidcolor';
  var formType = form.querySelector('#type');
  var formPrice = form.querySelector('#price');
  var formRoomNumber = form.querySelector('#room_number');
  var formRoomCapacity = form.querySelector('#capacity');
  var formTimeInSelect = form.querySelector('#timein');
  var formTimeOutSelect = form.querySelector('#timeout');
  var formSubmitButton = form.querySelector('.ad-form__submit');
  var formResetButton = form.querySelector('.ad-form__reset');
  var successMessage = document.querySelector('.success');

  var pricesLimits = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  var labelLimits = {
    'minimum': 30,
    'maximum': 100
  };

  var guests = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  var formTitleValidationMessages = {
    tooShort: 'Заголовок объявления должен состоять минимум из ' + labelLimits.minimum + ' символов',
    tooLong: 'Заголовок объявления не должен превышать ' + labelLimits.maximum + ' символов',
    valueMissing: 'Пожалуйста, введите заголовок Вашего объявления'
  };

  var formPriceValidationMesssages = {
    rangeUnderflow: 'Цена для данного типа жилья слишком мала',
    rangeOverflow: 'Цена не должна превышать ' + MAX_PRICE,
    valueMissing: 'Пожалуйста, введите цену'
  };

  var closePins = function () {
    var mapPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    mapPins.forEach(function (item) {
      item.parentNode.removeChild(item);
    });
  };

  var formTitleInvalidHandler = function () {
    var validity = formTitle.validity;
    switch (validity) {
      case (validity.valid):
        formTitle.setCustomValidity('');
        formTitle.classList.remove(invalidBorderColorClass);
        break;

      case (validity.tooShort):
        formTitle.setCustomValidity(formTitleValidationMessages.tooShort);
        formTitle.classList.add(invalidBorderColorClass);
        break;

      case (validity.tooLong):
        formTitle.setCustomValidity(formTitleValidationMessages.tooLong);
        formTitle.classList.add(invalidBorderColorClass);
        break;

      case (validity.valueMissing):
        formTitle.setCustomValidity(formTitleValidationMessages.valueMissing);
        formTitle.classList.add(invalidBorderColorClass);
        break;
    }
  };

  var formTitleBlurHandler = function (evt) {
    evt.target.checkValidity();
  };

  var formTitleFocusHandler = function () {
    formTitle.classList.remove(invalidBorderColorClass);
  };

  var formTitleChangeHandler = function () {
    formTitle.setCustomValidity('');
    formTitle.classList.remove(invalidBorderColorClass);
  };

  var formTypeChangeHandler = function () {
    formPrice.min = pricesLimits[formType.value];
  };

  var formPriceInvalidHandler = function () {
    var validity = formPrice.validity;
    switch (validity) {
      case (validity.valid):
        formPrice.setCustomValidity('');
        formPrice.classList.remove(invalidBorderColorClass);
        break;
      case (validity.rangeUnderflow):
        formPrice.setCustomValidity(formPriceValidationMesssages.rangeUnderflow);
        formPrice.classList.add(invalidBorderColorClass);
        break;
      case (validity.rangeOverflow):
        formPrice.setCustomValidity(formPriceValidationMesssages.rangeOverflow);
        formPrice.classList.add(invalidBorderColorClass);
        break;

      case (validity.valueMissing):
        formPrice.setCustomValidity(formPriceValidationMesssages.valueMissing);
        formPrice.classList.add(invalidBorderColorClass);
        break;
    }
  };

  var formPriceChangeHandler = function () {
    formPrice.setCustomValidity('');
    formPrice.classList.remove(invalidBorderColorClass);
  };

  var formRoomNumberChangeHandler = function () {
    var key = formRoomNumber.value;
    formRoomCapacity.value = guests[key][0];
    for (var i = 0; i < formRoomCapacity.options.length; i++) {
      if (guests[key].indexOf(formRoomCapacity.options[i].value) === -1) {
        formRoomCapacity.options[i].setAttribute('disabled', '');
      } else {
        formRoomCapacity.options[i].removeAttribute('disabled');
      }
    }
  };

  var formTimeOutChangeHandler = function () {
    formTimeInSelect.value = formTimeOutSelect.value;
  };

  var formTimeInChangeHandler = function () {
    formTimeOutSelect.value = formTimeInSelect.value;
  };

  var formSubmitButtonClickHandler = function () {
    formTitle.addEventListener('invalid', formTitleInvalidHandler);
    formPrice.addEventListener('invalid', formPriceInvalidHandler);
  };

  var deactivatePage = function () {
    formTitle.classList.remove(invalidBorderColorClass);
    formPrice.classList.remove(invalidBorderColorClass);
    form.reset();
    window.card.closecards();
    closePins();
    window.constandvars.mapsection.classList.add('map--faded');
    form.classList.add('ad-form--disabled');
    formFieldsets.forEach(function (item) {
      item.setAttribute('disabled', true);
    });
  };

  var resetFormClickHandler = function () {
    deactivatePage();
  };

  var successHandler = function () {
    deactivatePage();
    successMessage.classList.remove('hidden');
    successMessage.addEventListener('click', removeSuccessMessageHandler);
  };

  var removeSuccessMessageHandler = function () {
    successMessage.classList.add('hidden');
    successMessage.removeEventListener('click', removeSuccessMessageHandler);
  };

  var sendDataHandler = function (evt) {
    window.backend.senddata(new FormData(form), successHandler, window.backend.errorhandler);
    evt.preventDefault();
  };

  formTitle.addEventListener('blur', formTitleBlurHandler);
  formTitle.addEventListener('focus', formTitleFocusHandler);
  formTitle.addEventListener('change', formTitleChangeHandler);
  formPrice.addEventListener('change', formTypeChangeHandler);
  formPrice.addEventListener('change', formPriceChangeHandler);
  formRoomNumber.addEventListener('change', formRoomNumberChangeHandler);
  formTimeOutSelect.addEventListener('change', formTimeOutChangeHandler);
  formTimeInSelect.addEventListener('change', formTimeInChangeHandler);
  formSubmitButton.addEventListener('click', formSubmitButtonClickHandler);
  formResetButton.addEventListener('click', resetFormClickHandler);
  form.addEventListener('submit', sendDataHandler);

})();
