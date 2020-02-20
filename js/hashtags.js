'use strict';

(function () {
  var HashParam = {
    START_SYMBOL: '#',
    SEPARATION_SYMBOL: ' ',
    MAX_COUNT: 5,
    MIN_LENGTH: 1,
    MAX_LENGTH: 20
  };

  var hashValidation = {
    checkHashes: function (value, condition) {
      var hashArray = window.util.arrayToLowerCase(window.util.cutSymbols(HashParam.SEPARATION_SYMBOL, value).split(HashParam.SEPARATION_SYMBOL));
      for (var c = 0; c < hashArray.length; c++) {
        if (condition(hashArray[c], hashArray)) {
          return false;
        }
      }
      return true;
    },
    symbols: function (value) {
      var regSymbols = new RegExp('[^A-Za-zА-Яа-я0-9' + HashParam.SEPARATION_SYMBOL + HashParam.START_SYMBOL + ']');
      return value.search(regSymbols) === -1;
    },
    hasStart: function (value) {
      return this.checkHashes(value, this.hasStartCondition);
    },
    hasStartCondition: function (item) {
      return item.indexOf(HashParam.START_SYMBOL) !== 0;
    },
    hasSeparation: function (value) {
      return this.checkHashes(value, this.hasSeparationCondition);
    },
    hasSeparationCondition: function (item) {
      return window.util.isStringInString(HashParam.START_SYMBOL, item.slice(HashParam.START_SYMBOL.length));
    },
    maxCount: function (value) {
      var regMaxCount = new RegExp(HashParam.START_SYMBOL, 'g');
      return value.match(regMaxCount).length <= HashParam.MAX_COUNT;
    },
    minLength: function (value) {
      return this.checkHashes(value, this.minLengthCondition);
    },
    minLengthCondition: function (item) {
      return item.slice(HashParam.START_SYMBOL.length).length < HashParam.MIN_LENGTH;
    },
    maxLength: function (value) {
      return this.checkHashes(value, this.maxLengthCondition);
    },
    maxLengthCondition: function (item) {
      return item.slice(HashParam.START_SYMBOL.length).length > HashParam.MAX_LENGTH;
    },
    noDouble: function (value) {
      return this.checkHashes(value, this.noDoubleCondition);
    },
    noDoubleCondition: function (item, array) {
      return array.indexOf(item, array.indexOf(item) + 1) !== -1;
    }
  };

  var hashErrorMessage = {
    symbols: 'Хэштег может содержать только буквы и цифры',
    hasStart: 'Хэштег должен начинаться с символа ' + HashParam.START_SYMBOL,
    hasSeparation: 'Хэштеги должны быть разделены пробелом',
    maxCount: 'Должно быть не более ' + HashParam.MAX_COUNT + ' хэштегов',
    minLength: 'Длина хэштега должна быть не менее ' + HashParam.MIN_LENGTH,
    maxLength: 'Длина хэштега должна быть не более ' + HashParam.MAX_LENGTH,
    noDouble: 'Хэштеги не должны повторяться'
  };

  var onTextHahtagsInput = function (evt) {
    var target = evt.target;
    var value = evt.target.value;

    if (!value) {
      target.setCustomValidity('');
    } else if (!hashValidation.symbols(value)) {
      target.setCustomValidity(hashErrorMessage.symbols);
    } else if (!hashValidation.hasStart(value)) {
      target.setCustomValidity(hashErrorMessage.hasStart);
    } else if (!hashValidation.hasSeparation(value)) {
      target.setCustomValidity(hashErrorMessage.hasSeparation);
    } else if (!hashValidation.maxCount(value)) {
      target.setCustomValidity(hashErrorMessage.maxCount);
    } else if (!hashValidation.minLength(value)) {
      target.setCustomValidity(hashErrorMessage.minLength);
    } else if (!hashValidation.maxLength(value)) {
      target.setCustomValidity(hashErrorMessage.maxLength);
    } else if (!hashValidation.noDouble(value)) {
      target.setCustomValidity(hashErrorMessage.noDouble);
    } else {
      target.setCustomValidity('');
    }
  };

  var textHahtags = document.querySelector('.text__hashtags');

  textHahtags.addEventListener('input', onTextHahtagsInput);

}());
