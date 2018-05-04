'use strict';

(function () {

  var MAX_PRICE = 1000000;

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

  var PricesLimits = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };

  var LabelLimits = {
    MINIMUM: 30,
    MAXIMUM: 100
  };

  var Guests = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  var FormTitleValidationMessages = {
    TOO_SHORT: 'Заголовок объявления должен состоять минимум из ' + LabelLimits.MINIMUM + ' символов',
    TOO_LONG: 'Заголовок объявления не должен превышать ' + LabelLimits.MAXIMUM + ' символов',
    VALUE_MISSING: 'Пожалуйста, введите заголовок Вашего объявления'
  };

  var FormPriceValidationMesssages = {
    RANGE_UNDER_FLOW: 'Цена для данного типа жилья слишком мала',
    RANGE_OVER_FLOW: 'Цена не должна превышать ' + MAX_PRICE,
    VALUE_MISSING: 'Пожалуйста, введите цену'
  };

  var formTitleInvalidHandler = function () {
    var validity = formTitle.validity;
    if (validity.valid) {
      formTitle.setCustomValidity('');
      formTitle.classList.remove(invalidBorderColorClass);
      return;
    }
    if (validity.tooShort) {
      formTitle.setCustomValidity(FormTitleValidationMessages.TOO_SHORT);
      formTitle.classList.add(invalidBorderColorClass);
      return;
    }
    if (validity.tooLong) {
      formTitle.setCustomValidity(FormTitleValidationMessages.TOO_LONG);
      formTitle.classList.add(invalidBorderColorClass);
      return;
    }
    if (validity.valueMissing) {
      formTitle.setCustomValidity(FormTitleValidationMessages.VALUE_MISSING);
      formTitle.classList.add(invalidBorderColorClass);
      return;
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
    formPrice.min = PricesLimits[formType.value.toUpperCase()];
  };

  var formPriceInvalidHandler = function () {
    var validity = formPrice.validity;
    if (validity.valid) {
      formPrice.setCustomValidity('');
      formPrice.classList.remove(invalidBorderColorClass);
      return;
    }
    if (validity.rangeUnderflow) {
      formPrice.setCustomValidity(FormPriceValidationMesssages.RANGE_UNDER_FLOW);
      formPrice.classList.add(invalidBorderColorClass);
      return;
    }
    if (validity.rangeOverflow) {
      formPrice.setCustomValidity(FormPriceValidationMesssages.RANGE_OVER_FLOW);
      formPrice.classList.add(invalidBorderColorClass);
      return;
    }
    if (validity.valueMissing) {
      formPrice.setCustomValidity(FormPriceValidationMesssages.VALUE_MISSING);
      formPrice.classList.add(invalidBorderColorClass);
      return;
    }
  };

  var formPriceChangeHandler = function () {
    formPrice.setCustomValidity('');
    formPrice.classList.remove(invalidBorderColorClass);
  };

  var formRoomNumberChangeHandler = function () {
    var key = formRoomNumber.value;
    formRoomCapacity.value = Guests[key][0];
    for (var i = 0; i < formRoomCapacity.options.length; i++) {
      if (Guests[key].indexOf(formRoomCapacity.options[i].value) === -1) {
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

  var resetFormClickHandler = function () {
    window.map.deactivatepage();
  };

  var successHandler = function () {
    window.map.deactivatepage();
    formTitle.classList.remove(invalidBorderColorClass);
    formPrice.classList.remove(invalidBorderColorClass);
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
  form.addEventListener('change', formRoomNumberChangeHandler);
  formTimeOutSelect.addEventListener('change', formTimeOutChangeHandler);
  formTimeInSelect.addEventListener('change', formTimeInChangeHandler);
  formSubmitButton.addEventListener('click', formSubmitButtonClickHandler);
  formResetButton.addEventListener('click', resetFormClickHandler);
  form.addEventListener('submit', sendDataHandler);

})();
