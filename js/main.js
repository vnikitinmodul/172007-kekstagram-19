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

var uploadedImage = {
  SIZE_VALUE_STEP: 25,
  SIZE_MIN: 25,
  SIZE_MAX: 100,
  DEFAULT_SIZE_VALUE: 100,
  size: 100,
  scaleControlSmaller: document.querySelector('.scale__control--smaller'),
  scaleControlBigger: document.querySelector('.scale__control--bigger'),
  scaleControlValue: document.querySelector('.scale__control--value'),
  uploadPreviewImage: document.querySelector('.img-upload__preview img'),
  getDefaultSize: function () {
    return this.DEFAULT_SIZE_VALUE;
  },
  getSize: function () {
    return this.size + '%';
  },
  setSize: function (value) {
    this.size = value;
    this.scaleControlValue.value = this.size + '%';
    this.uploadPreviewImage.style.transform = 'scale(' + this.size / 100 + ')';
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
  }
};

var socialComments = document.querySelector('.social__comments');
var bodyBlock = document.querySelector('body');
var uploadFile = document.querySelector('#upload-file');
var uploadCancel = document.querySelector('#upload-cancel');


// Функции

var getRandomNum = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var getComments = function () {
  var commentsArray = [];

  for (var i = 0; i < getRandomNum(CommentsNum.MIN, CommentsNum.MAX); i++) {
    var currentComment = {
      avatar: 'img/avatar-' + getRandomNum(AvatarsNum.MIN, AvatarsNum.MAX) + '.svg',
      message: COMMENTS[getRandomNum(0, COMMENTS.length - 1)],
      name: NAMES[getRandomNum(0, NAMES.length - 1)]
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
      likes: getRandomNum(LikesNum.MIN, LikesNum.MAX),
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

  return template;
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

  pictureImage.src = data[0].url;
  pictureLikes.textContent = data[0].likes;
  pictureComments.textContent = data[0].comments;
  socialCaption.textContent = data[0].description;
};

var showBlock = function (selector) {
  var block = document.querySelector(selector);

  block.classList.remove('hidden');
};

var hideBlock = function (selector) {
  var block = document.querySelector(selector);

  block.classList.add('hidden');
};

var switchBodyModalMode = function (hide) {
  if (hide) {
    bodyBlock.classList.remove('modal-open');
  } else {
    bodyBlock.classList.add('modal-open');
  }
};

var showPhotoModal = function () {
  switchBodyModalMode();
  showBlock('.big-picture');
};

var hidePhotoModal = function () {
  switchBodyModalMode(true);
  hideBlock('.big-picture');
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
  var commentsArray = data[0].comments;

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
  hideBlock('.img-upload__overlay');
  uploadFile.value = '';
  document.removeEventListener('keydown', onPopupEscPress);
  uploadedImage.scaleControlSmaller.removeEventListener('click', onScaleControlSmallerClick);
  uploadedImage.scaleControlBigger.removeEventListener('click', onScaleControlBiggerClick);
};


// Обработчики

var onUploadFileChange = function () {
  switchBodyModalMode();
  showBlock('.img-upload__overlay');
  uploadedImage.setSize(uploadedImage.getDefaultSize());
  document.addEventListener('keydown', onPopupEscPress);
  uploadedImage.scaleControlSmaller.addEventListener('click', onScaleControlSmallerClick);
  uploadedImage.scaleControlBigger.addEventListener('click', onScaleControlBiggerClick);
};

var onSetupCloseClick = function () {
  closeUploadForm();
};

var onPopupEscPress = function (evt) {
  if (evt.key === Keys.ESC) {
    closeUploadForm();
  }
};

var onScaleControlSmallerClick = function () {
  uploadedImage.setSizeSmaller();
};

var onScaleControlBiggerClick = function () {
  uploadedImage.setSizeBigger();
};


// Вызов обработчиков

uploadFile.addEventListener('change', onUploadFileChange);

uploadCancel.addEventListener('click', onSetupCloseClick);


// Вызов функций

var photosData = generateData(PHOTOS_NUM);

clonePhotos(photosData);

setPictureData(photosData);

clearComments();

putComments(photosData, renderComment());

hideBlock('.social__comment-count');

hideBlock('.comments-loader');
