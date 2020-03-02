'use strict';

(function () {
  var ErrorParam = {
    TIMEOUT: 5000,
    CLASS: 'error-notify'
  };

  var DEBOUNCE_INTERVAL = 500;

  var bodyBlock = document.querySelector('body');
  var lastTimeout;

  window.util = {
    Key: {
      ESC: 'Escape',
      ENTER: 'Enter'
    },
    getRandomNum: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    showBlock: function (selector) {
      var block = document.querySelector(selector);

      block.classList.remove('hidden');
    },
    hideBlock: function (selector) {
      var block = document.querySelector(selector);

      block.classList.add('hidden');
    },
    isStringInString: function (value, text) {
      return text.indexOf(value) !== -1;
    },
    cutSymbols: function (symbols, value) {
      var valueArray = value.split(symbols);

      for (var a = valueArray.length - 1; a >= 0; a--) {
        if (valueArray[a] === symbols || !valueArray[a].length) {
          valueArray.splice(a, 1);
        }
      }

      return valueArray.join(symbols);
    },
    arrayToLowerCase: function (array) {
      for (var b = 0; b < array.length; b++) {
        array[b] = array[b].toLowerCase();
      }

      return array;
    },
    switchBodyModalMode: function (hide) {
      if (hide) {
        bodyBlock.classList.remove('modal-open');
      } else {
        bodyBlock.classList.add('modal-open');
      }
    },
    showError: function (text) {
      var errorBlock = document.createElement('div');

      errorBlock.classList.add(ErrorParam.CLASS);
      errorBlock.textContent = text;
      document.querySelector('body').appendChild(errorBlock);
      setTimeout(function () {
        errorBlock.remove();
      }, ErrorParam.TIMEOUT);
    },
    debounce: function (callback) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(callback, DEBOUNCE_INTERVAL);
    }
  };
}());
