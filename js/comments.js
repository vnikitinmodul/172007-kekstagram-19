'use strict';

(function () {
  var COMMENT_IMG_SIZE = 35;

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

  var AvatarsNum = {
    MIN: 1,
    MAX: 6
  };

  var CommentsNum = {
    MIN: 1,
    MAX: 2
  };

  var socialComments = document.querySelector('.social__comments');

  window.util.hideBlock('.social__comment-count');

  window.util.hideBlock('.comments-loader');

  window.comments = {
    clear: function () {
      var currentComments = socialComments.querySelectorAll('.social__comment');

      for (var c = 0; c < currentComments.length; c++) {
        currentComments[c].remove();
      }
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

      for (var i = 0; i < window.util.getRandomNum(CommentsNum.MIN, CommentsNum.MAX); i++) {
        var currentComment = {
          avatar: 'img/avatar-' + window.util.getRandomNum(AvatarsNum.MIN, AvatarsNum.MAX) + '.svg',
          message: COMMENTS[window.util.getRandomNum(0, COMMENTS.length - 1)],
          name: NAMES[window.util.getRandomNum(0, NAMES.length - 1)]
        };

        commentsArray.push(currentComment);
      }

      return commentsArray;
    }
  };

}());
