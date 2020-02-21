'use strict';

(function () {
  var uploadFile = document.querySelector('#upload-file');
  var uploadCancel = document.querySelector('#upload-cancel');
  var uploadSelectImage = document.querySelector('#upload-select-image');
  var effectsRadio = document.querySelectorAll('.effects__radio');
  var textDescription = document.querySelector('.text__description');
  var textHahtags = document.querySelector('.text__hashtags');
  var scaleControlSmaller = document.querySelector('.scale__control--smaller');
  var scaleControlBigger = document.querySelector('.scale__control--bigger');
  var effectLevelPin = document.querySelector('.effect-level__pin');
  var effectLevelDepth = document.querySelector('.effect-level__depth');
  var uploadPreviewImage = document.querySelector('.img-upload__preview img');
  var scaleControlValue = document.querySelector('.scale__control--value');
  // var effectLevelValue = document.querySelector('.effect-level__value');

  var DEFAULT_SIZE_VALUE = 100;
  var DEFAULT_EFFECT = 'none';
  var DEFAULT_EFFECT_VALUE = 100;
  // var DEFAULT_FILTER = '';
  var uploadedImageSize = DEFAULT_SIZE_VALUE;
  // var uploadedImageEffect = DEFAULT_EFFECT;
  // var uploadedImageEffectValue = DEFAULT_EFFECT_VALUE;
  // var uploadedImageFilter = DEFAULT_FILTER;
  var SIZE_VALUE_STEP = 25;
  var SIZE_MIN = 25;
  var SIZE_MAX = 100;

  var uploadedImage = {
    setSize: function (value) {
      uploadedImageSize = value;
      scaleControlValue.value = value + '%';
      uploadPreviewImage.style.transform = 'scale(' + value / 100 + ')';
    },
    setEffect: function (filter) {
      // uploadedImageEffect = filter;
      this.setEffectValue(DEFAULT_EFFECT_VALUE);
      uploadPreviewImage.className = '';
      if (filter !== 'none') {
        uploadPreviewImage.classList.add('effects__preview--' + filter);
      }
    },
    setEffectValue: function (value) {
      // uploadedImageEffectValue = value;
      effectLevelPin.style.left = value + '%';
      effectLevelDepth.style.width = value + '%';
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
      // uploadedImageFilter = value;
      uploadPreviewImage.style.filter = value;
    }
  };

  var closeUploadForm = function () {
    window.util.switchBodyModalMode(true);
    window.util.hideBlock('.img-upload__overlay');
    uploadFile.value = '';
    document.removeEventListener('keydown', onSetupEscPress);
    uploadCancel.removeEventListener('click', onSetupCloseClick);
    scaleControlSmaller.removeEventListener('click', onScaleControlSmallerClick);
    scaleControlBigger.removeEventListener('click', onScaleControlBiggerClick);
    for (var m = 0; m < effectsRadio.length; m++) {
      effectsRadio[m].removeEventListener('change', onEffectsChange);
    }
  };


  var onUploadFileChange = function () {
    window.util.switchBodyModalMode();
    window.util.showBlock('.img-upload__overlay');
    uploadedImage.setSize(DEFAULT_SIZE_VALUE);
    uploadedImage.setEffect(DEFAULT_EFFECT);
    uploadedImage.setEffectValue(DEFAULT_EFFECT_VALUE);

    document.addEventListener('keydown', onSetupEscPress);
    uploadCancel.addEventListener('click', onSetupCloseClick);
    scaleControlSmaller.addEventListener('click', onScaleControlSmallerClick);
    scaleControlBigger.addEventListener('click', onScaleControlBiggerClick);
    for (var m = 0; m < effectsRadio.length; m++) {
      effectsRadio[m].addEventListener('change', onEffectsChange);
    }
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

  var onEffectsChange = function (evt) {
    uploadedImage.setEffect(evt.target.value);
  };

  var onEffectLevelPinMousedown = function () {
    effectLevelPin.addEventListener('mousemove', onEffectLevelPinMousemove);
    effectLevelPin.addEventListener('mouseup', onEffectLevelPinMouseup);
  };

  var onEffectLevelPinMousemove = function () {
    // console.log(evt);
  };

  var onEffectLevelPinMouseup = function () {
    effectLevelPin.removeEventListener('mousemove', onEffectLevelPinMousemove);
    effectLevelPin.removeEventListener('mouseup', onEffectLevelPinMouseup);
  };


  var onUploadSelectImageSubmit = function () {
    //
  };

  uploadSelectImage.addEventListener('submit', onUploadSelectImageSubmit);
  uploadFile.addEventListener('change', onUploadFileChange);
  effectLevelPin.addEventListener('mousedown', onEffectLevelPinMousedown);
}());
