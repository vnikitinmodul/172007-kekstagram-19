'use strict';

(function () {
  var COMMENT_IMG_SIZE = 35;
  var socialComments = document.querySelector('.social__comments');

  window.util.hideBlock('.social__comment-count');

  window.util.hideBlock('.comments-loader');

  window.comments = {
    clear: function () {
      var currentComments = socialComments.querySelectorAll('.social__comment');

      currentComments.forEach(function (item) {
        item.remove();
      });
    },
    render: function () {
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
    },
    put: function (data, template) {
      var commentsArray = data.comments;

      for (var l = 0; l < commentsArray.length; l++) {
        var currentCommentDOM = template.cloneNode(true);
        var currentComment = commentsArray[l];

        currentCommentDOM.querySelector('.social__picture').src = currentComment.avatar;
        currentCommentDOM.querySelector('.social__picture').alt = currentComment.name;
        currentCommentDOM.querySelector('.social__text').textContent = currentComment.message;
        socialComments.appendChild(currentCommentDOM);
      }
    },
    get: function () {
      var commentsArray = [];

      for (var i = 0; i < window.util.getRandomNum(window.mockData.CommentsNum.MIN, window.mockData.CommentsNum.MAX); i++) {
        var currentComment = {
          avatar: 'img/avatar-' + window.util.getRandomNum(window.mockData.AvatarsNum.MIN, window.mockData.AvatarsNum.MAX) + '.svg',
          message: window.mockData.COMMENTS[window.util.getRandomNum(0, window.mockData.COMMENTS.length - 1)],
          name: window.mockData.NAMES[window.util.getRandomNum(0, window.mockData.NAMES.length - 1)]
        };

        commentsArray.push(currentComment);
      }

      return commentsArray;
    }
  };

}());
