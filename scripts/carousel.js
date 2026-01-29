(function () {
  'use strict';

  var intervalMs = 3000;
  var selectors = ['.service-carousel', '.about-carousel', '.price-guide-carousel'];
  var carousels = document.querySelectorAll(selectors.join(', '));

  carousels.forEach(function (carousel) {
    var imgs = Array.from(carousel.querySelectorAll('img'));
    if (!imgs.length) {
      return;
    }
    var index = 0;
    imgs.forEach(function (img) {
      img.classList.remove('is-active');
    });
    imgs[0].classList.add('is-active');
    if (imgs.length < 2) {
      return;
    }
    setInterval(function () {
      imgs[index].classList.remove('is-active');
      index = (index + 1) % imgs.length;
      imgs[index].classList.add('is-active');
    }, intervalMs);
  });
})();
