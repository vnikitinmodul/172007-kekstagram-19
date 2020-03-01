'use strict';

(function () {
  var XHR_TIMEOUT = 10000;
  var STATUS_SUCCESS = 200;
  var StatusMessage = {
    STATUS: 'Статус ответа: ',
    SYNTAX_ERROR: 'Синтаксическая ошибка',
    CONNECTION: 'Произошла ошибка соединения',
    TIMEOUT: 'Запрос не успел выполниться за '
  };

  window.backend = {
    initXhr: function (onLoad, onError, url, type) {
      var xhr = new XMLHttpRequest();

      xhr.addEventListener('load', function () {
        if (xhr.status === STATUS_SUCCESS) {
          try {
            JSON.parse(xhr.responseText);
          } catch (e) {
            onError(StatusMessage.SYNTAX_ERROR);
            return;
          }
          onLoad(JSON.parse(xhr.responseText));
          return;
        } else {
          onError(StatusMessage.STATUS + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        onError(StatusMessage.CONNECTION);
      });

      xhr.addEventListener('timeout', function () {
        onError(StatusMessage.TIMEOUT + xhr.timeout + 'мс');
      });

      xhr.timeout = XHR_TIMEOUT;

      xhr.open(type, url);

      return xhr;
    },
    load: function (url, onLoad, onError) {
      var xhr = this.initXhr(onLoad, onError, url, 'GET');
      xhr.send();
    },
    save: function (url, data, onLoad, onError) {
      var xhr = this.initXhr(onLoad, onError, url, 'POST');
      xhr.send(data);
    }
  };
}());
