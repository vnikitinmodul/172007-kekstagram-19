'use strict';

(function () {
  var URL_PHOTOS = 'https://js.dump.academy/kekstagram/data';

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


  var onStatusError = function (status) {
    window.util.showError(status);
  };

  // clonePhotos(photosData);
  window.backend.load(URL_PHOTOS, clonePhotos, onStatusError);

  window.photos = {
    setPictureData: setPictureData
  };

}());
