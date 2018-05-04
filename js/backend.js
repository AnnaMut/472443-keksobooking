'use strict';

(function () {

  var Url = {
    POST: 'https://js.dump.academy/keksobooking',
    GET: 'https://js.dump.academy/keksobooking/data'
  };
  var SUCСESS_STATUS = 200;
  var TIME_OUT = 10000;

  var Messages = {
    RESPONSE: 'Статус ответа: ',
    CONNECTION_ERROR: 'Произошла ошибка соединения',
    TIME_ERROR: 'Запрос не успел выполниться за '
  };

  var getRequest = function (successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCСESS_STATUS) {
        successHandler(xhr.response);
      } else {
        errorHandler(Messages.RESPONSE + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      errorHandler(Messages.CONNECTION_ERROR);
    });
    xhr.addEventListener('timeout', function () {
      errorHandler(Messages.TIME_ERROR + xhr.timeout + 'мс');
    });

    xhr.timeout = TIME_OUT;
    return xhr;
  };

  var loadData = function (successHandler, errorHandler) {
    var xhr = getRequest(successHandler, errorHandler);
    xhr.open('GET', Url.GET);
    xhr.send();
  };

  var sendData = function (data, successHandler, errorHandler) {
    var xhr = getRequest(successHandler, errorHandler);
    xhr.open('POST', Url.POST);
    xhr.send(data);
  };

  var errorHandler = function (text) {
    var node = document.createElement('div');
    node.classList.add('error-node');
    document.body.insertAdjacentElement('afterbegin', node);
    node.textContent = text;
    node.addEventListener('click', removeErrorMessageHandler);
    return node;
  };

  var removeErrorMessageHandler = function (evt) {
    document.body.removeChild(evt.target);
    evt.target.removeEventListener('click', removeErrorMessageHandler);
  };

  window.backend = {
    loadData: loadData,
    sendData: sendData,
    errorHandler: errorHandler
  };

})();
