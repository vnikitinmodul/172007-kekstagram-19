'use strict';


// Переменные

var PHOTOS_NUM = 25;

var COMMENT_IMG_SIZE = 35;

var LikesNum = {
  MIN: 15,
  MAX: 200
};

var CommentsNum = {
  MIN: 1,
  MAX: 2
};

var AvatarsNum = {
  MIN: 1,
  MAX: 6
};

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var NAMES = [
  'Артём',
  'Вася',
  'Игорь',
  'Таня',
  'Юля',
  'Саша',
  'Катя',
  'Женя'
];

var Keys = {
  ESC: 'Escape',
  ENTER: 'Enter'
};

var utils = {
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
    return ~text.indexOf(value);
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
  }
};

var UploadedImageControls = {
  scaleControlSmaller: document.querySelector('.scale__control--smaller'),
  scaleControlBigger: document.querySelector('.scale__control--bigger'),
  effectLevelPin: document.querySelector('.effect-level__pin'),
  effectLevelDepth: document.querySelector('.effect-level__depth')
};

var uploadedImage = {
  SIZE_VALUE_STEP: 25,
  SIZE_MIN: 25,
  SIZE_MAX: 100,
  DEFAULT_SIZE_VALUE: 100,
  DEFAULT_EFFECT: 'none',
  DEFAULT_EFFECT_VALUE: 100,
  DEFAULT_FILTER: '',
  size: 100,
  effect: 'none',
  effectValue: 100,
  filter: '',
  uploadPreviewImage: document.querySelector('.img-upload__preview img'),
  scaleControlValue: document.querySelector('.scale__control--value'),
  effectLevelValue: document.querySelector('.effect-level__value'),
  getDefaultSize: function () {
    return this.DEFAULT_SIZE_VALUE;
  },
  getDefaultEffect: function () {
    return this.DEFAULT_EFFECT;
  },
  getDefaultEffectValue: function () {
    return this.DEFAULT_EFFECT_VALUE;
  },
  getDefaultFilter: function () {
    return this.DEFAULT_FILTER;
  },
  setSize: function (value) {
    this.size = value;
    this.scaleControlValue.value = value + '%';
    this.uploadPreviewImage.style.transform = 'scale(' + value / 100 + ')';
  },
  setEffect: function (filter) {
    this.effect = filter;
    this.setEffectValue(this.DEFAULT_EFFECT_VALUE);
    this.uploadPreviewImage.className = '';
    this.uploadPreviewImage.classList.add('effects__preview--' + filter);
  },
  setEffectValue: function (value) {
    this.effectValue = value;
    UploadedImageControls.effectLevelPin.style.left = value + '%';
    UploadedImageControls.effectLevelDepth.style.width = value + '%';
  },
  setSizeSmaller: function () {
    if (this.size > this.SIZE_MIN) {
      var newSize = this.size - this.SIZE_VALUE_STEP;
      this.setSize(newSize);
    }
  },
  setSizeBigger: function () {
    if (this.size < this.SIZE_MAX) {
      var newSize = this.size + this.SIZE_VALUE_STEP;
      this.setSize(newSize);
    }
  },
  setFilter: function (value) {
    this.filter = value;
    this.uploadPreviewImage.style.filter = value;
  }
};

var HashParam = {
  START_SYMBOL: '#',
  SEPARATION_SYMBOL: ' ',
  MAX_COUNT: 5,
  MIN_LENGTH: 1,
  MAX_LENGTH: 20
};

var hashValidation = {
  checkHashes: function (value, condition) {
    var hashArray = utils.arrayToLowerCase(utils.cutSymbols(HashParam.SEPARATION_SYMBOL, value).split(HashParam.SEPARATION_SYMBOL));
    for (var c = 0; c < hashArray.length; c++) {
      if (condition(hashArray[c], hashArray)) {
        return false;
      }
    }
    return true;
  },
  symbols: function (value) {
    var regSymbols = new RegExp('[^A-Za-zА-Яа-я0-9' + HashParam.SEPARATION_SYMBOL + HashParam.START_SYMBOL + ']');
    return !~value.search(regSymbols);
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
    return utils.isStringInString(HashParam.START_SYMBOL, item.slice(HashParam.START_SYMBOL.length));
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
    return ~array.indexOf(item, array.indexOf(item) + 1);
  }
};

var hashErrorMessages = {
  symbols: 'Хэштег может содержать только буквы и цифры',
  hasStart: 'Хэштег должен начинаться с символа ' + HashParam.START_SYMBOL,
  hasSeparation: 'Хэштеги должны быть разделены пробелом',
  maxCount: 'Должно быть не более ' + HashParam.MAX_COUNT + ' хэштегов',
  minLength: 'Длина хэштега должна быть не менее ' + HashParam.MIN_LENGTH,
  maxLength: 'Длина хэштега должна быть не более ' + HashParam.MAX_LENGTH,
  noDouble: 'Хэштеги не должны повторяться'
};

var socialComments = document.querySelector('.social__comments');
var bodyBlock = document.querySelector('body');
var uploadFile = document.querySelector('#upload-file');
var uploadCancel = document.querySelector('#upload-cancel');
var pictureCancel = document.querySelector('#picture-cancel');
var effectsRadio = document.querySelectorAll('.effects__radio');
var uploadSelectImage = document.querySelector('#upload-select-image');
var textHahtags = document.querySelector('.text__hashtags');
var socialFooterText = document.querySelector('.social__footer-text');
var textDescription = document.querySelector('.text__description');


// Функции

var getComments = function () {
  var commentsArray = [];

  for (var i = 0; i < utils.getRandomNum(CommentsNum.MIN, CommentsNum.MAX); i++) {
    var currentComment = {
      avatar: 'img/avatar-' + utils.getRandomNum(AvatarsNum.MIN, AvatarsNum.MAX) + '.svg',
      message: COMMENTS[utils.getRandomNum(0, COMMENTS.length - 1)],
      name: NAMES[utils.getRandomNum(0, NAMES.length - 1)]
    };

    commentsArray.push(currentComment);
  }

  return commentsArray;
};

var generateData = function (num) {
  var data = [];

  for (var j = 0; j < num; j++) {
    var item = {
      url: 'photos/' + (j + 1) + '.jpg',
      description: 'Некое фото',
      likes: utils.getRandomNum(LikesNum.MIN, LikesNum.MAX),
      comments: getComments()
    };

    data.push(item);
  }

  return data;
};

var renderPhoto = function (template, item) {
  template.querySelector('.picture__img').src = item.url;
  template.querySelector('.picture__likes').textContent = item.likes;
  template.querySelector('.picture__comments').textContent = item.comments.length;

  template.addEventListener('click', function () {
    showPicture(item);
  });

  template.addEventListener('keydown', function (evt) {
    if (evt.key === Keys.ENTER) {
      showPicture(item);
    }
  });

  return template;
};

var showPicture = function (data) {
  setPictureData(data);
  clearComments();
  putComments(data, renderComment());
  showPhotoModal();
};

var clonePhotos = function (data) {
  var templatePicture = document.querySelector('#picture').content.querySelector('.picture');
  var photosList = document.querySelector('.pictures');

  for (var k = 0; k < data.length; k++) {
    var currentPicture = renderPhoto(templatePicture.cloneNode(true), data[k]);

    photosList.appendChild(currentPicture);
  }
};

var setPictureData = function (data) {
  var pictureImage = document.querySelector('.big-picture__img img');
  var pictureLikes = document.querySelector('.likes-count');
  var pictureComments = document.querySelector('.comments-count');
  var socialCaption = document.querySelector('.social__caption');

  pictureImage.src = data.url;
  pictureLikes.textContent = data.likes;
  pictureComments.textContent = data.comments;
  socialCaption.textContent = data.description;
};

var switchBodyModalMode = function (hide) {
  if (hide) {
    bodyBlock.classList.remove('modal-open');
  } else {
    bodyBlock.classList.add('modal-open');
  }
};

var showPhotoModal = function () {
  document.addEventListener('keydown', onPictureEscPress);
  pictureCancel.addEventListener('click', onPictureCloseClick);
  switchBodyModalMode();
  utils.showBlock('.big-picture');
};

var hidePhotoModal = function () {
  document.removeEventListener('keydown', onPictureEscPress);
  pictureCancel.removeEventListener('click', onPictureCloseClick);
  switchBodyModalMode(true);
  utils.hideBlock('.big-picture');
};

var clearComments = function () {
  var currentComments = socialComments.querySelectorAll('.social__comment');

  for (var c = 0; c < currentComments.length; c++) {
    currentComments[c].remove();
  }
};

var renderComment = function () {
  var commentTemplate = document.createElement('li');
  var commentImg = document.createElement('img');
  var commentText = document.createElement('p');

  commentTemplate.classList.add('social__comment');
  commentImg.classList.add('social__picture');
  commentText.classList.add('social__text');

  commentImg.width = COMMENT_IMG_SIZE;
  commentImg.height = COMMENT_IMG_SIZE;

  commentTemplate.appendChild(commentImg);
  commentTemplate.appendChild(commentText);

  return commentTemplate;
};

var putComments = function (data, template) {
  var commentsArray = data.comments;

  for (var l = 0; l < commentsArray.length; l++) {
    var currentCommentDOM = template.cloneNode(true);
    var currentComment = commentsArray[l];

    currentCommentDOM.querySelector('.social__picture').src = currentComment.avatar;
    currentCommentDOM.querySelector('.social__picture').alt = currentComment.name;
    currentCommentDOM.querySelector('.social__text').textContent = currentComment.message;
    socialComments.appendChild(currentCommentDOM);
  }
};


var closeUploadForm = function () {
  switchBodyModalMode(true);
  utils.hideBlock('.img-upload__overlay');
  uploadFile.value = '';
  document.removeEventListener('keydown', onSetupEscPress);
  uploadCancel.removeEventListener('click', onSetupCloseClick);
  UploadedImageControls.scaleControlSmaller.removeEventListener('click', onScaleControlSmallerClick);
  UploadedImageControls.scaleControlBigger.removeEventListener('click', onScaleControlBiggerClick);
  for (var m = 0; m < effectsRadio.length; m++) {
    effectsRadio[m].removeEventListener('change', onEffectsChange);
  }
};


// Обработчики

var onUploadFileChange = function () {
  switchBodyModalMode();
  utils.showBlock('.img-upload__overlay');
  uploadedImage.setSize(uploadedImage.getDefaultSize());
  uploadedImage.setEffectValue(uploadedImage.getDefaultEffectValue());

  document.addEventListener('keydown', onSetupEscPress);
  uploadCancel.addEventListener('click', onSetupCloseClick);
  UploadedImageControls.scaleControlSmaller.addEventListener('click', onScaleControlSmallerClick);
  UploadedImageControls.scaleControlBigger.addEventListener('click', onScaleControlBiggerClick);
  for (var m = 0; m < effectsRadio.length; m++) {
    effectsRadio[m].addEventListener('change', onEffectsChange);
  }
};

var onSetupCloseClick = function () {
  closeUploadForm();
};

var onSetupEscPress = function (evt) {
  if (evt.key === Keys.ESC && evt.target && evt.target !== textHahtags && evt.target !== textDescription) {
    closeUploadForm();
  }
};

var onPictureCloseClick = function () {
  hidePhotoModal();
};

var onPictureEscPress = function (evt) {
  if (evt.key === Keys.ESC && evt.target && evt.target !== socialFooterText) {
    hidePhotoModal();
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
  UploadedImageControls.effectLevelPin.addEventListener('mousemove', onEffectLevelPinMousemove);
  UploadedImageControls.effectLevelPin.addEventListener('mouseup', onEffectLevelPinMouseup);
};

var onEffectLevelPinMousemove = function () {
  // console.log(evt);
};

var onEffectLevelPinMouseup = function () {
  UploadedImageControls.effectLevelPin.removeEventListener('mousemove', onEffectLevelPinMousemove);
  UploadedImageControls.effectLevelPin.removeEventListener('mouseup', onEffectLevelPinMouseup);
};

var onUploadSelectImageSubmit = function () {
  //
};

var onTextHahtagsInput = function (evt) {
  var target = evt.target;
  var value = evt.target.value;

  if (!value) {
    target.setCustomValidity('');
  } else if (!hashValidation.symbols(value)) {
    target.setCustomValidity(hashErrorMessages.symbols);
  } else if (!hashValidation.hasStart(value)) {
    target.setCustomValidity(hashErrorMessages.hasStart);
  } else if (!hashValidation.hasSeparation(value)) {
    target.setCustomValidity(hashErrorMessages.hasSeparation);
  } else if (!hashValidation.maxCount(value)) {
    target.setCustomValidity(hashErrorMessages.maxCount);
  } else if (!hashValidation.minLength(value)) {
    target.setCustomValidity(hashErrorMessages.minLength);
  } else if (!hashValidation.maxLength(value)) {
    target.setCustomValidity(hashErrorMessages.maxLength);
  } else if (!hashValidation.noDouble(value)) {
    target.setCustomValidity(hashErrorMessages.noDouble);
  } else {
    target.setCustomValidity('');
  }
};


// Вызов обработчиков

uploadFile.addEventListener('change', onUploadFileChange);

UploadedImageControls.effectLevelPin.addEventListener('mousedown', onEffectLevelPinMousedown);

uploadSelectImage.addEventListener('submit', onUploadSelectImageSubmit);

textHahtags.addEventListener('input', onTextHahtagsInput);


// Вызов функций

var photosData = generateData(PHOTOS_NUM);

clonePhotos(photosData);

utils.hideBlock('.social__comment-count');

utils.hideBlock('.comments-loader');
