'use strict';

var PHOTOS_NUM = 25;

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

clonePhotos(generateData(PHOTOS_NUM));
