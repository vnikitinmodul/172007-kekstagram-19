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
  // var DEFAULT_FILTER = '';

  var uploadedImageSize = DEFAULT_SIZE_VALUE;
  var uploadedImageEffect = DEFAULT_EFFECT;
  // var uploadedImageEffectValue = DEFAULT_EFFECT_VALUE;
  // var uploadedImageFilter = DEFAULT_FILTER;

  var uploadFile = document.querySelector('#upload-file');
  var uploadCancel = document.querySelector('#upload-cancel');
  var uploadSubmit = document.querySelector('#upload-submit');
  var uploadSelectImage = document.querySelector('#upload-select-image');
  var effectsRadio = document.querySelectorAll('.effects__radio');
  var textDescription = document.querySelector('.text__description');
  var textHahtags = document.querySelector('.text__hashtags');
  var scaleControlSmaller = document.querySelector('.scale__control--smaller');
  var scaleControlBigger = document.querySelector('.scale__control--bigger');
  var effectLevelPin = document.querySelector('.effect-level__pin');
  var effectLevelLine = document.querySelector('.effect-level__line');
  var effectLevelDepth = document.querySelector('.effect-level__depth');
  var uploadPreviewImage = document.querySelector('.img-upload__preview img');
  var scaleControlValue = document.querySelector('.scale__control--value');
  var effectLevelValue = document.querySelector('.effect-level__value');
  var successMessage = document.querySelector('#success').content.querySelector('.success');
  var successButton = successMessage.querySelector('.success__button');
  var errorMessage = document.querySelector('#error').content.querySelector('.error');
  var errorButton = errorMessage.querySelector('.error__button');

  var Effect = {
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
      scaleControlValue.value = value + '%';
      uploadPreviewImage.style.transform = 'scale(' + value / 100 + ')';
    },
    setEffect: function (filter) {
      uploadedImageEffect = filter;
      this.setEffectValue(DEFAULT_EFFECT_VALUE, true);
      uploadPreviewImage.className = '';
      if (filter === DEFAULT_EFFECT) {
        uploadPreviewImage.style.filter = '';
        window.util.hideBlock('.effect-level');
      } else {
        this.setFilter(effectMethods.getFilter(filter, DEFAULT_EFFECT_VALUE));
        uploadPreviewImage.classList.add('effects__preview--' + filter);
        window.util.showBlock('.effect-level');
      }
    },
    setEffectValue: function (value, moveSlider) {
      effectLevelValue.setAttribute('value', value);
      if (moveSlider) {
        effectLevelPin.style.left = value + '%';
        effectLevelDepth.style.width = value + '%';
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
      uploadPreviewImage.style.filter = value;
    }
  };

  var effectMethods = {
    getStep: function (filter) {
      var currentFilter = Effect[filter];
      return (currentFilter.MAX - currentFilter.MIN) / SLIDER_SCALE;
    },
    getFilter: function (filter, value) {
      var currentFilter = Effect[filter];
      var filterStyle = currentFilter.FILTER_NAME + '(';
      filterStyle += value * this.getStep(filter) + currentFilter.MIN;
      filterStyle += currentFilter.UNIT + ')';
      return filterStyle;
    }
  };

  var closeUploadForm = function () {
    window.util.switchBodyModalMode(true);
    window.util.hideBlock('.img-upload__overlay');
    uploadFile.value = '';
    textHahtags.value = '';
    textDescription.value = '';
    document.querySelector('#effect-none').checked = true;
    document.removeEventListener('keydown', onSetupEscPress);
    uploadCancel.removeEventListener('click', onSetupCloseClick);
    scaleControlSmaller.removeEventListener('click', onScaleControlSmallerClick);
    scaleControlBigger.removeEventListener('click', onScaleControlBiggerClick);
    for (var m = 0; m < effectsRadio.length; m++) {
      effectsRadio.forEach(function (item) {
        item.removeEventListener('change', onEffectChange);
      });
    }
  };

  var calculateSliderValue = function (value, scale, maxValue) {
    return Math.floor(value / maxValue * scale);
  };

  var showSuccessMessage = function () {
    document.querySelector('main').appendChild(successMessage);

    document.addEventListener('keydown', onSuccessEscPress);
    successButton.addEventListener('click', onSuccessButtonClick);
    successMessage.addEventListener('click', onSuccessClick);
  };

  var showErrorMessage = function () {
    document.querySelector('main').appendChild(errorMessage);

    document.addEventListener('keydown', onErrorEscPress);
    errorButton.addEventListener('click', onErrorButtonClick);
    errorMessage.addEventListener('click', onErrorClick);
  };

  var hideSuccessMessage = function () {
    document.removeEventListener('keydown', onSuccessEscPress);
    successButton.removeEventListener('click', onSuccessButtonClick);
    successMessage.removeEventListener('click', onSuccessClick);
    successMessage.remove();
  };

  var hideErrorMessage = function () {
    document.removeEventListener('keydown', onErrorEscPress);
    document.removeEventListener('click', onErrorButtonClick);
    errorMessage.removeEventListener('click', onErrorClick);
    errorMessage.remove();
  };

  var renderPreview = function (input, img, onLoad) {
    var reader = new FileReader();

    reader.onload = function (evt) {
      onLoad(img, evt.target.result);
    };

    reader.readAsDataURL(uploadFile.files[0]);
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
    uploadFile.blur();

    if (uploadFile.files && uploadFile.files[0]) {
      renderPreview(uploadFile, uploadPreviewImage, onReaderLoaded);
    }

    document.addEventListener('keydown', onSetupEscPress);
    uploadCancel.addEventListener('click', onSetupCloseClick);
    scaleControlSmaller.addEventListener('click', onScaleControlSmallerClick);
    scaleControlBigger.addEventListener('click', onScaleControlBiggerClick);
    effectsRadio.forEach(function (item) {
      item.addEventListener('change', onEffectChange);
    });
  };

  var onReaderLoaded = function (img, result) {
    img.src = result;
    window.util.switchBodyModalMode();
    window.util.showBlock('.img-upload__overlay');
    // uploadSubmit.focus();
    uploadedImage.setSize(DEFAULT_SIZE_VALUE);
    uploadedImage.setEffect(DEFAULT_EFFECT);
    uploadedImage.setEffectValue(DEFAULT_EFFECT_VALUE, true);
  };

  var onSetupCloseClick = function () {
    closeUploadForm();
  };

  var onSetupEscPress = function (evt) {
    if (evt.key === window.util.Key.ESC && evt.target && evt.target !== textHahtags && evt.target !== textDescription) {
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
    var lineWidth = effectLevelLine.offsetWidth;
    var lineLeft = effectLevelLine.getBoundingClientRect().left;
    var lineRight = effectLevelLine.getBoundingClientRect().right;
    var shift = startCoord - evt.clientX;
    var pinPos = effectLevelPin.offsetLeft - shift;

    if (evt.clientX < lineLeft) {
      pinPos = 0;
    } else if (evt.clientX > lineRight) {
      pinPos = lineWidth;
    }

    startCoord = evt.clientX;

    effectLevelPin.style.left = pinPos + 'px';

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

  uploadSelectImage.addEventListener('submit', onUploadSelectImageSubmit);
  uploadFile.addEventListener('change', onUploadFileChange);
  effectLevelPin.addEventListener('mousedown', onEffectLevelPinMousedown);
}());
