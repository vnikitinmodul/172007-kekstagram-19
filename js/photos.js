'use strict';

(function () {
  var PHOTOS_NUM = 25;

  var LikesNum = {
    MIN: 15,
    MAX: 200
  };

  var renderPhoto = function (template, item) {
    template.querySelector('.picture__img').src = item.url;
    template.querySelector('.picture__likes').textContent = item.likes;
    template.querySelector('.picture__comments').textContent = item.comments.length;

    template.addEventListener('click', function () {
      window.picture.showPicture(item);
    });

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

    pictureImage.src = data.url;
    pictureLikes.textContent = data.likes;
    pictureComments.textContent = data.comments;
    socialCaption.textContent = data.description;
  };

  var generateData = function (num) {
    var data = [];

    for (var j = 0; j < num; j++) {
      var item = {
        url: 'photos/' + (j + 1) + '.jpg',
        description: 'Некое фото',
        likes: window.util.getRandomNum(LikesNum.MIN, LikesNum.MAX),
        comments: window.comments.get()
      };

      data.push(item);
    }

    return data;
  };

  var photosData = generateData(PHOTOS_NUM);

  clonePhotos(photosData);

  window.photos = {
    setPictureData: setPictureData
  };

}());
