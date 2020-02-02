'use strict';

var PHOTOS_NUM = 25;
var LikesNum = {
  MIN: 15,
  MAX: 200
};

var Comments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var Names = [
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

  for (var k = 0; k < getRandomNum(1, 2); k++) {
    var currentComment = {
      avatar: 'img/avatar-' + getRandomNum(1, 6) + '.svg',
      message: Comments[getRandomNum(0, Comments.length - 1)],
      name: Names[getRandomNum(0, Names.length - 1)]
    };

    commentsArray.push(currentComment);
  }

  return commentsArray;
};

var generateData = function (num) {
  var data = [];

  for (var i = 0; i < num; i++) {
    var item = {
      url: 'photos/' + (i + 1) + '.jpg',
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

  for (var j = 0; j < data.length; j++) {
    var currentPicture = renderPhoto(templatePicture.cloneNode(true), data[j]);

    photosList.appendChild(currentPicture);
  }
};

clonePhotos(generateData(PHOTOS_NUM));
