const container = document.querySelector(".scatter");
const slots = Array.from(document.querySelectorAll(".scatter img"));

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomizePosition(img) {
  if (!container) {
    return;
  }
  const width = container.clientWidth || 900;
  const height = container.clientHeight || 720;
  const maxX = Math.max(0, width - 260);
  const maxY = Math.max(0, height - 260);
  const left = randomBetween(0, maxX);
  const top = randomBetween(0, maxY);
  const rotate = randomBetween(-8, 8);
  const scale = randomBetween(0.92, 1.06);
  img.style.left = `${left}px`;
  img.style.top = `${top}px`;
  img.style.transform = `rotate(${rotate}deg) scale(${scale})`;
}

function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

document.addEventListener("DOMContentLoaded", () => {
  if (!container || !slots.length) {
    return;
  }

  const sources = slots.map((img) => img.src);
  const current = new Set();
  const shuffled = shuffle(sources);

  slots.forEach((img, i) => {
    const src = shuffled[i % shuffled.length];
    img.src = src;
    current.add(src);
    randomizePosition(img);
  });

  setInterval(() => {
    const slot = slots[Math.floor(Math.random() * slots.length)];
    const remaining = sources.filter((src) => src !== slot.src);
    const next = remaining[Math.floor(Math.random() * remaining.length)];
    if (next) {
      slot.style.opacity = "0";
      setTimeout(() => {
        slot.src = next;
        randomizePosition(slot);
        slot.style.opacity = "1";
      }, 300);
    } else {
      randomizePosition(slot);
    }
  }, 1200);
});
