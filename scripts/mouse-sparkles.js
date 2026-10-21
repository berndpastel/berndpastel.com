(function () {
  'use strict';

  var colour = "#FF2FA5";
  var sparkles = 120;
  var x = 400;
  var y = 300;
  var ox = 400;
  var oy = 300;
  var swide = 800;
  var shigh = 600;
  var sleft = 0;
  var sdown = 0;
  var star = [];
  var starv = [];
  var starx = [];
  var stary = [];

  var symbols = ["*", "✦", "✧", "✺", "✹", "✶", "✵", "⋆", "+", "✸", "✿", "❀", "♡"];

  function createSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
  }

  function createSpan() {
    var span = document.createElement("span");
    span.style.position = "absolute";
    span.style.fontFamily = "inherit";
    span.style.fontWeight = "700";
    span.style.color = colour;
    span.style.textShadow = "none";
    span.style.zIndex = "2147483647";
    span.style.pointerEvents = "none";
    span.style.userSelect = "none";
    return span;
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
    starv[i] -= 1;
    if (starv[i]) {
      stary[i] += 1 + Math.random() * 3;
      var starBase = parseFloat(star[i].dataset.size || "18");
      var starScale = Math.max(0.2, starv[i] / 50);
      star[i].style.fontSize = starBase * starScale + "px";
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
      star[i].style.visibility = "hidden";
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
          var starSize = 14 + Math.random() * 16;
          star[c].dataset.size = starSize.toFixed(2);
          star[c].style.fontSize = starSize + "px";
          star[c].textContent = createSymbol();
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
    }
    window.setTimeout(sparkle, 40);
  }

  function init() {
    var i;
    for (i = 0; i < sparkles; i += 1) {
      starv[i] = 0;
      var starSpan = createSpan();
      starSpan.style.visibility = "hidden";
      document.body.appendChild((star[i] = starSpan));
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
