'use strict';

(function () {
  var URL_UPLOAD = 'https://js.dump.academy/kekstagram';
  var DEFAULT_SIZE_VALUE = 100;
  var DEFAULT_EFFECT = 'none';
  var DEFAULT_EFFECT_VALUE = 100;
  var SIZE_VALUE_STEP = 25;
  var SIZE_MIN = 25;
  var SIZE_MAX = 100;
  var SLIDER_SCALE = 100;

  var uploadedImageSize = DEFAULT_SIZE_VALUE;
  var uploadedImageEffect = DEFAULT_EFFECT;

  var uploadFileElement = document.querySelector('#upload-file');
  var uploadCancelElement = document.querySelector('#upload-cancel');
  var uploadSelectImageElement = document.querySelector('#upload-select-image');
  var effectsRadioElements = document.querySelectorAll('.effects__radio');
  var textDescriptionElement = document.querySelector('.text__description');
  var textHahtagsElement = document.querySelector('.text__hashtags');
  var scaleControlSmallerElement = document.querySelector('.scale__control--smaller');
  var scaleControlBiggerElement = document.querySelector('.scale__control--bigger');
  var effectLevelElement = document.querySelector('.effect-level');
  var effectLevelPinElement = document.querySelector('.effect-level__pin');
  var effectLevelLineElement = document.querySelector('.effect-level__line');
  var effectLevelDepthElement = document.querySelector('.effect-level__depth');
  var uploadPreviewImageElement = document.querySelector('.img-upload__preview img');
  var imgUploadOverlayElement = document.querySelector('.img-upload__overlay');
  var scaleControlValueElement = document.querySelector('.scale__control--value');
  var effectLevelValueElement = document.querySelector('.effect-level__value');
  var successMessageElement = document.querySelector('#success').content.querySelector('.success');
  var successButtonElement = successMessageElement.querySelector('.success__button');
  var errorMessageElement = document.querySelector('#error').content.querySelector('.error');
  var errorButtonElement = errorMessageElement.querySelector('.error__button');

  var effects = {
    chrome: {
      FILTER_NAME: 'grayscale',
      MIN: 0,
      MAX: 1,
      UNIT: ''
    },
    sepia: {
      FILTER_NAME: 'sepia',
      MIN: 0,
      MAX: 1,
      UNIT: ''
    },
    marvin: {
      FILTER_NAME: 'invert',
      MIN: 0,
      MAX: 100,
      UNIT: '%'
    },
    phobos: {
      FILTER_NAME: 'blur',
      MIN: 0,
      MAX: 3,
      UNIT: 'px'
    },
    heat: {
      FILTER_NAME: 'brightness',
      MIN: 1,
      MAX: 3,
      UNIT: ''
    }
  };

  var startCoord = 0;

  var uploadedImage = {
    setSize: function (value) {
      uploadedImageSize = value;
      scaleControlValueElement.value = value + '%';
      uploadPreviewImageElement.style.transform = 'scale(' + value / 100 + ')';
    },
    setEffect: function (filter) {
      uploadedImageEffect = filter;
      this.setEffectValue(DEFAULT_EFFECT_VALUE, true);
      uploadPreviewImageElement.className = '';
      if (filter === DEFAULT_EFFECT) {
        uploadPreviewImageElement.style.filter = '';
        window.util.hideBlock(effectLevelElement);
      } else {
        this.setFilter(effectMethods.getFilter(filter, DEFAULT_EFFECT_VALUE));
        uploadPreviewImageElement.classList.add('effects__preview--' + filter);
        window.util.showBlock(effectLevelElement);
      }
    },
    setEffectValue: function (value, moveSlider) {
      effectLevelValueElement.setAttribute('value', value);
      if (moveSlider) {
        effectLevelPinElement.style.left = value + '%';
        effectLevelDepthElement.style.width = value + '%';
      }
    },
    setSizeSmaller: function () {
      if (uploadedImageSize > SIZE_MIN) {
        var newSize = uploadedImageSize - SIZE_VALUE_STEP;
        this.setSize(newSize);
      }
    },
    setSizeBigger: function () {
      if (uploadedImageSize < SIZE_MAX) {
        var newSize = uploadedImageSize + SIZE_VALUE_STEP;
        this.setSize(newSize);
      }
    },
    setFilter: function (value) {
      uploadPreviewImageElement.style.filter = value;
    }
  };

  var effectMethods = {
    getStep: function (filter) {
      var currentFilter = effects[filter];
      return (currentFilter.MAX - currentFilter.MIN) / SLIDER_SCALE;
    },
    getFilter: function (filter, value) {
      var currentFilter = effects[filter];
      var filterStyle = currentFilter.FILTER_NAME + '(';
      filterStyle += value * this.getStep(filter) + currentFilter.MIN;
      filterStyle += currentFilter.UNIT + ')';
      return filterStyle;
    }
  };

  var closeUploadForm = function () {
    window.util.switchBodyModalMode(true);
    window.util.hideBlock(imgUploadOverlayElement);
    uploadSelectImageElement.reset();
    textHahtagsElement.setCustomValidity('');
    document.removeEventListener('keydown', onSetupEscPress);
    uploadCancelElement.removeEventListener('click', onSetupCloseClick);
    scaleControlSmallerElement.removeEventListener('click', onScaleControlSmallerClick);
    scaleControlBiggerElement.removeEventListener('click', onScaleControlBiggerClick);
    effectsRadioElements.forEach(function (item) {
      item.removeEventListener('change', onEffectChange);
    });
  };

  var calculateSliderValue = function (value, scale, maxValue) {
    return Math.floor(value / maxValue * scale);
  };

  var showSuccessMessage = function () {
    document.querySelector('main').appendChild(successMessageElement);

    document.addEventListener('keydown', onSuccessEscPress);
    successButtonElement.addEventListener('click', onSuccessButtonClick);
    successMessageElement.addEventListener('click', onSuccessClick);
  };

  var showErrorMessage = function () {
    document.querySelector('main').appendChild(errorMessageElement);

    document.addEventListener('keydown', onErrorEscPress);
    errorButtonElement.addEventListener('click', onErrorButtonClick);
    errorMessageElement.addEventListener('click', onErrorClick);
  };

  var hideSuccessMessage = function () {
    document.removeEventListener('keydown', onSuccessEscPress);
    successButtonElement.removeEventListener('click', onSuccessButtonClick);
    successMessageElement.removeEventListener('click', onSuccessClick);
    successMessageElement.remove();
  };

  var hideErrorMessage = function () {
    document.removeEventListener('keydown', onErrorEscPress);
    document.removeEventListener('click', onErrorButtonClick);
    errorMessageElement.removeEventListener('click', onErrorClick);
    errorMessageElement.remove();
  };

  var renderPreview = function (input, img, onLoad) {
    var reader = new FileReader();

    reader.addEventListener('load', function (evt) {
      onLoad(img, evt.target.result);
    });

    reader.readAsDataURL(uploadFileElement.files[0]);
  };

  var onSuccessEscPress = function (evt) {
    if (evt.key === window.util.Key.ESC) {
      hideSuccessMessage();
    }
  };

  var onSuccessButtonClick = function () {
    hideSuccessMessage();
  };

  var onSuccessClick = function (evt) {
    if (evt.target && evt.target.querySelector('.success__inner')) {
      hideSuccessMessage();
    }
  };

  var onErrorEscPress = function (evt) {
    if (evt.key === window.util.Key.ESC) {
      hideErrorMessage();
    }
  };

  var onErrorButtonClick = function () {
    hideErrorMessage();
  };

  var onErrorClick = function (evt) {
    if (evt.target && evt.target.querySelector('.error__inner')) {
      hideErrorMessage();
    }
  };

  var onUploadFileChange = function () {
    uploadFileElement.blur();

    if (uploadFileElement.files && uploadFileElement.files[0]) {
      renderPreview(uploadFileElement, uploadPreviewImageElement, onReaderLoaded);
    }

    document.addEventListener('keydown', onSetupEscPress);
    uploadCancelElement.addEventListener('click', onSetupCloseClick);
    scaleControlSmallerElement.addEventListener('click', onScaleControlSmallerClick);
    scaleControlBiggerElement.addEventListener('click', onScaleControlBiggerClick);
    effectsRadioElements.forEach(function (item) {
      item.addEventListener('change', onEffectChange);
    });
  };

  var onReaderLoaded = function (img, result) {
    img.src = result;
    window.util.switchBodyModalMode();
    window.util.showBlock(imgUploadOverlayElement);
    uploadedImage.setSize(DEFAULT_SIZE_VALUE);
    uploadedImage.setEffect(DEFAULT_EFFECT);
    uploadedImage.setEffectValue(DEFAULT_EFFECT_VALUE, true);
  };

  var onSetupCloseClick = function () {
    closeUploadForm();
  };

  var onSetupEscPress = function (evt) {
    if (evt.key === window.util.Key.ESC && evt.target && evt.target !== textHahtagsElement && evt.target !== textDescriptionElement) {
      closeUploadForm();
    }
  };

  var onScaleControlSmallerClick = function () {
    uploadedImage.setSizeSmaller();
  };

  var onScaleControlBiggerClick = function () {
    uploadedImage.setSizeBigger();
  };

  var onEffectChange = function (evt) {
    uploadedImage.setEffect(evt.target.value);
  };

  var onEffectLevelPinMousedown = function (evt) {
    startCoord = evt.clientX;

    document.addEventListener('mousemove', onEffectLevelPinMousemove);
    document.addEventListener('mouseup', onEffectLevelPinMouseup);
  };

  var onEffectLevelPinMousemove = function (evt) {
    var lineWidth = effectLevelLineElement.offsetWidth;
    var lineLeft = effectLevelLineElement.getBoundingClientRect().left;
    var lineRight = effectLevelLineElement.getBoundingClientRect().right;
    var shift = startCoord - evt.clientX;
    var pinPos = effectLevelPinElement.offsetLeft - shift;

    if (evt.clientX < lineLeft) {
      pinPos = 0;
    } else if (evt.clientX > lineRight) {
      pinPos = lineWidth;
    }

    startCoord = evt.clientX;

    effectLevelPinElement.style.left = pinPos + 'px';

    var resultValue = calculateSliderValue(pinPos, SLIDER_SCALE, lineWidth);

    uploadedImage.setEffectValue(resultValue);
    uploadedImage.setFilter(effectMethods.getFilter(uploadedImageEffect, resultValue));
  };

  var onEffectLevelPinMouseup = function () {
    document.removeEventListener('mousemove', onEffectLevelPinMousemove);
    document.removeEventListener('mouseup', onEffectLevelPinMouseup);
  };

  var onUploadSelectImageSubmit = function (evt) {
    evt.preventDefault();
    window.backend.save(URL_UPLOAD, new FormData(evt.target), onUploadSuccess, onUploadError);
  };

  var onUploadSuccess = function () {
    closeUploadForm();
    showSuccessMessage();
  };

  var onUploadError = function () {
    closeUploadForm();
    showErrorMessage();
  };

  uploadSelectImageElement.addEventListener('submit', onUploadSelectImageSubmit);
  uploadFileElement.addEventListener('change', onUploadFileChange);
  effectLevelPinElement.addEventListener('mousedown', onEffectLevelPinMousedown);
}());
