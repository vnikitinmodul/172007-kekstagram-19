'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  var UtilClass = {
    MODAL_OPEN: 'modal-open',
    HIDDEN: 'hidden'
  };

  var ErrorParam = {
    TIMEOUT: 5000,
    CLASS: 'error-notify'
  };

  var Key = {
    ESC: 'Escape',
    ENTER: 'Enter'
  };

  var bodyElement = document.querySelector('body');
  var lastTimeout;

  var getBlock = function (selector) {
    return typeof selector === 'string' ? document.querySelector(selector) : selector;
  };

  var getRandomNum = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  var showBlock = function (selector) {
    getBlock(selector).classList.remove(UtilClass.HIDDEN);
  };

  var hideBlock = function (selector) {
    getBlock(selector).classList.add(UtilClass.HIDDEN);
  };

  var isStringInString = function (value, text) {
    return text.indexOf(value) !== -1;
  };

  var cutSymbols = function (symbols, value) {
    var valueArray = value.split(symbols);

    for (var i = valueArray.length - 1; i >= 0; i--) {
      if (valueArray[i] === symbols || !valueArray[i].length) {
        valueArray.splice(i, 1);
      }
    }

    return valueArray.join(symbols);
  };

  var arrayToLowerCase = function (array) {
    for (var j = 0; j < array.length; j++) {
      array[j] = array[j].toLowerCase();
    }

    return array;
  };

  var switchBodyModalMode = function (hide) {
    if (hide) {
      bodyElement.classList.remove(UtilClass.MODAL_OPEN);
    } else {
      bodyElement.classList.add(UtilClass.MODAL_OPEN);
    }
  };

  var showError = function (text) {
    var errorBlock = document.createElement('div');

    errorBlock.classList.add(ErrorParam.CLASS);
    errorBlock.textContent = text;
    bodyElement.appendChild(errorBlock);
    setTimeout(function () {
      errorBlock.remove();
    }, ErrorParam.TIMEOUT);
  };

  var debounce = function (callback) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(callback, DEBOUNCE_INTERVAL);
  };

  window.util = {
    Key: Key,
    getRandomNum: getRandomNum,
    showBlock: showBlock,
    hideBlock: hideBlock,
    isStringInString: isStringInString,
    cutSymbols: cutSymbols,
    arrayToLowerCase: arrayToLowerCase,
    switchBodyModalMode: switchBodyModalMode,
    showError: showError,
    debounce: debounce
  };
}());
