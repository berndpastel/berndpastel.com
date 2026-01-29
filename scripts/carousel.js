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
    var intervalId;
    var stopped = false;

    function show(nextIndex) {
      imgs[index].classList.remove('is-active');
      index = (nextIndex + imgs.length) % imgs.length;
      imgs[index].classList.add('is-active');
    }

    function startInterval() {
      if (imgs.length < 2) {
        return;
      }
      if (stopped) {
        return;
      }
      intervalId = setInterval(function () {
        show(index + 1);
      }, intervalMs);
    }

    imgs.forEach(function (img) {
      img.classList.remove('is-active');
    });
    imgs[0].classList.add('is-active');

    if (imgs.length < 2) {
      return;
    }

    function createNavButton(direction) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'carousel-nav carousel-nav-' + direction;
      button.setAttribute('aria-label', direction === 'prev' ? 'Previous image' : 'Next image');
      button.textContent = direction === 'prev' ? '⬅️' : '➡️';
      button.addEventListener('click', function () {
        show(direction === 'prev' ? index - 1 : index + 1);
        stopped = true;
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      });
      return button;
    }

    carousel.appendChild(createNavButton('prev'));
    carousel.appendChild(createNavButton('next'));

    startInterval();
  });
})();
