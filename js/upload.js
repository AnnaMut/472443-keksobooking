'use strict';


(function () {

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var avatarChooser = document.querySelector('.ad-form-header__upload input[type=file]');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var imagesChooser = document.querySelector('.ad-form__upload input[type=file]');
  var imagesPreview = document.querySelector('.ad-form__photo-container');
  var photos = imagesPreview.querySelectorAll('div');
  var avatarDefaultSrc = avatarPreview.src;

  var avatarChooserChangeHandler = function () {
    var file = avatarChooser.files[0];
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        avatarPreview.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  };

  var imagesChooserChangeHandler = function () {
    var file = imagesChooser.files[0];
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
    if (matches) {
      var img = document.createElement('img');
      img.className = 'ad-form__photo';
      imagesPreview.appendChild(img);
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        photos[1].classList.remove('ad-form__photo');
        img.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  };

  var removeUpload = function () {
    avatarPreview.src = avatarDefaultSrc;
    var images = imagesPreview.querySelectorAll('img');
    images.forEach(function (it) {
      imagesPreview.removeChild(it);
    });
    photos[1].classList.add('ad-form__photo');
  };

  avatarChooser.addEventListener('change', avatarChooserChangeHandler);
  imagesChooser.addEventListener('change', imagesChooserChangeHandler);

  window.upload = {
    removeUpload: removeUpload
  };

})();
