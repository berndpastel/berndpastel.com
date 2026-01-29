(function () {
  'use strict';

  var SPRITE_SIZE = 50;
  var MAX_SPRITES = 120;
  var LAYER_CLASS = 'junk-scatter-layer';

  function getDocHeight() {
    var body = document.body;
    var html = document.documentElement;
    return Math.max(
      body.scrollHeight,
      html.scrollHeight,
      body.offsetHeight,
      html.offsetHeight,
      body.clientHeight,
      html.clientHeight
    );
  }

  function shuffle(list) {
    var arr = list.slice();
    for (var i = arr.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  function selectImages(list, maxCount) {
    if (!maxCount || list.length <= maxCount) {
      return shuffle(list);
    }
    return shuffle(list).slice(0, maxCount);
  }

  function normalizePath(path) {
    if (!path) {
      return '';
    }
    var cleaned = path.replace(/^\.\//, '');
    if (cleaned.indexOf('junk/') === -1) {
      if (cleaned.indexOf('/') === -1) {
        cleaned = 'junk/' + cleaned;
      } else {
        var parts = cleaned.split('/');
        cleaned = 'junk/' + parts[parts.length - 1];
      }
    } else {
      cleaned = cleaned.slice(cleaned.indexOf('junk/'));
    }
    if (cleaned.charAt(0) === '/') {
      cleaned = cleaned.slice(1);
    }
    return cleaned;
  }

  function parseDirectoryListing(html) {
    var out = [];
    var regex = /href=["']([^"']+\.png)["']/gi;
    var match;
    while ((match = regex.exec(html))) {
      var href = match[1];
      if (!href) {
        continue;
      }
      if (href.indexOf('?') !== -1) {
        href = href.split('?')[0];
      }
      if (!/\.png$/i.test(href)) {
        continue;
      }
      var normalized = normalizePath(href);
      if (normalized) {
        out.push(normalized);
      }
    }
    return out;
  }

  function getImagePaths() {
    if (Array.isArray(window.JUNK_IMAGE_PATHS)) {
      return Promise.resolve(window.JUNK_IMAGE_PATHS.map(normalizePath).filter(Boolean));
    }
    return Promise.resolve([]);
  }

  function positionSprite(sprite, width, height) {
    var x = Math.random();
    var y = Math.random();
    sprite.dataset.x = x.toFixed(6);
    sprite.dataset.y = y.toFixed(6);
    sprite.style.left = Math.max(0, Math.floor((width - SPRITE_SIZE) * x)) + 'px';
    sprite.style.top = Math.max(0, Math.floor((height - SPRITE_SIZE) * y)) + 'px';
  }

  function applyPositions(layer) {
    var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var height = getDocHeight();
    layer.style.height = height + 'px';
    var sprites = layer.querySelectorAll('img');
    sprites.forEach(function (sprite) {
      var x = parseFloat(sprite.dataset.x || '0');
      var y = parseFloat(sprite.dataset.y || '0');
      sprite.style.left = Math.max(0, Math.floor((width - SPRITE_SIZE) * x)) + 'px';
      sprite.style.top = Math.max(0, Math.floor((height - SPRITE_SIZE) * y)) + 'px';
    });
  }

  function createLayer() {
    getImagePaths().then(function (paths) {
      if (!paths.length) {
        return;
      }
      var layer = document.createElement('div');
      layer.className = LAYER_CLASS;
      var fragment = document.createDocumentFragment();
      var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      var height = getDocHeight();
      selectImages(paths, MAX_SPRITES).forEach(function (path) {
        var img = document.createElement('img');
        img.className = 'junk-sprite';
        img.alt = '';
        img.setAttribute('aria-hidden', 'true');
        img.loading = 'lazy';
        img.decoding = 'async';
        img.src = encodeURI(path);
        img.onerror = function () {
          if (img.parentNode) {
            img.parentNode.removeChild(img);
          }
        };
        positionSprite(img, width, height);
        fragment.appendChild(img);
      });
      layer.appendChild(fragment);
      document.body.appendChild(layer);
      applyPositions(layer);

      var resizeTimeout;
      window.addEventListener('resize', function () {
        if (resizeTimeout) {
          window.clearTimeout(resizeTimeout);
        }
        resizeTimeout = window.setTimeout(function () {
          applyPositions(layer);
        }, 150);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createLayer);
  } else {
    createLayer();
  }
})();
