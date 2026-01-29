(function () {
  'use strict';

  var colour = "#ff5fb0";
  var sparkles = 120;
  var x = 400;
  var y = 300;
  var ox = 400;
  var oy = 300;
  var swide = 800;
  var shigh = 600;
  var sleft = 0;
  var sdown = 0;
  var tiny = [];
  var star = [];
  var starv = [];
  var starx = [];
  var stary = [];
  var tinyx = [];
  var tinyy = [];
  var tinyv = [];

  function createDiv(height, width) {
    var div = document.createElement("div");
    div.style.position = "absolute";
    div.style.height = height + "px";
    div.style.width = width + "px";
    div.style.overflow = "hidden";
    div.style.backgroundColor = colour;
    div.style.zIndex = "2147483647";
    div.style.pointerEvents = "none";
    return div;
  }

  function setScroll() {
    if (typeof self.pageYOffset === "number") {
      sdown = self.pageYOffset;
      sleft = self.pageXOffset;
    } else if (document.body.scrollTop || document.body.scrollLeft) {
      sdown = document.body.scrollTop;
      sleft = document.body.scrollLeft;
    } else if (document.documentElement && (document.documentElement.scrollTop || document.documentElement.scrollLeft)) {
      sleft = document.documentElement.scrollLeft;
      sdown = document.documentElement.scrollTop;
    } else {
      sdown = 0;
      sleft = 0;
    }
  }

  function setWidth() {
    if (typeof self.innerWidth === "number") {
      swide = self.innerWidth;
      shigh = self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientWidth) {
      swide = document.documentElement.clientWidth;
      shigh = document.documentElement.clientHeight;
    } else if (document.body.clientWidth) {
      swide = document.body.clientWidth;
      shigh = document.body.clientHeight;
    }
  }

  function mouse(e) {
    setScroll();
    y = e ? e.pageY : event.y + sdown;
    x = e ? e.pageX : event.x + sleft;
  }

  function updateStar(i) {
    if (--starv[i] === 25) {
      star[i].style.clip = "rect(1px, 4px, 4px, 1px)";
    }
    if (starv[i]) {
      stary[i] += 1 + Math.random() * 3;
      if (stary[i] < shigh + sdown) {
        star[i].style.top = stary[i] + "px";
        starx[i] += (i % 5 - 2) / 5;
        star[i].style.left = starx[i] + "px";
      } else {
        star[i].style.visibility = "hidden";
        starv[i] = 0;
        return;
      }
    } else {
      tinyv[i] = 50;
      tiny[i].style.top = (tinyy[i] = stary[i]) + "px";
      tiny[i].style.left = (tinyx[i] = starx[i]) + "px";
      tiny[i].style.width = "2px";
      tiny[i].style.height = "2px";
      star[i].style.visibility = "hidden";
      tiny[i].style.visibility = "visible";
    }
  }

  function updateTiny(i) {
    if (--tinyv[i] === 25) {
      tiny[i].style.width = "1px";
      tiny[i].style.height = "1px";
    }
    if (tinyv[i]) {
      tinyy[i] += 1 + Math.random() * 3;
      if (tinyy[i] < shigh + sdown) {
        tiny[i].style.top = tinyy[i] + "px";
        tinyx[i] += (i % 5 - 2) / 5;
        tiny[i].style.left = tinyx[i] + "px";
      } else {
        tiny[i].style.visibility = "hidden";
        tinyv[i] = 0;
        return;
      }
    } else {
      tiny[i].style.visibility = "hidden";
    }
  }

  function sparkle() {
    var c;
    if (x !== ox || y !== oy) {
      ox = x;
      oy = y;
      for (c = 0; c < sparkles; c += 1) {
        if (!starv[c]) {
          star[c].style.left = (starx[c] = x) + "px";
          star[c].style.top = (stary[c] = y) + "px";
          star[c].style.clip = "rect(0px, 5px, 5px, 0px)";
          star[c].style.visibility = "visible";
          starv[c] = 50;
          break;
        }
      }
    }
    for (c = 0; c < sparkles; c += 1) {
      if (starv[c]) {
        updateStar(c);
      }
      if (tinyv[c]) {
        updateTiny(c);
      }
    }
    window.setTimeout(sparkle, 40);
  }

  function init() {
    var i;
    for (i = 0; i < sparkles; i += 1) {
      var tinyDiv = createDiv(3, 3);
      tinyDiv.style.visibility = "hidden";
      document.body.appendChild((tiny[i] = tinyDiv));
      starv[i] = 0;
      tinyv[i] = 0;
      var starDiv = createDiv(5, 5);
      starDiv.style.backgroundColor = "transparent";
      starDiv.style.visibility = "hidden";
      var rlef = createDiv(1, 5);
      var rdow = createDiv(5, 1);
      starDiv.appendChild(rlef);
      starDiv.appendChild(rdow);
      rlef.style.top = "2px";
      rlef.style.left = "0px";
      rdow.style.top = "0px";
      rdow.style.left = "2px";
      document.body.appendChild((star[i] = starDiv));
    }
    setWidth();
    sparkle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  document.onmousemove = mouse;
  window.onresize = setWidth;
})();
