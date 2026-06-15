const canvas = document.querySelector("#embers");
const ctx = canvas.getContext("2d");
const sparks = [];
let width = 0;
let height = 0;
let pointer = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
let lastSpark = 0;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function addSpark(x, y, count = 2) {
  for (let i = 0; i < count; i += 1) {
    sparks.push({
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      vx: (Math.random() - 0.5) * 1.4,
      vy: -Math.random() * 1.8 - 0.4,
      life: 1,
      size: Math.random() * 2.4 + 0.8,
      hue: Math.random() > 0.48 ? 18 : 42,
    });
  }
}

function renderSparks() {
  ctx.clearRect(0, 0, width, height);

  for (let i = sparks.length - 1; i >= 0; i -= 1) {
    const spark = sparks[i];
    spark.x += spark.vx;
    spark.y += spark.vy;
    spark.vy -= 0.012;
    spark.life -= 0.018;

    if (spark.life <= 0) {
      sparks.splice(i, 1);
      continue;
    }

    ctx.beginPath();
    ctx.fillStyle = `hsla(${spark.hue}, 96%, 58%, ${spark.life})`;
    ctx.shadowBlur = 12;
    ctx.shadowColor = `hsla(${spark.hue}, 96%, 58%, ${spark.life})`;
    ctx.arc(spark.x, spark.y, spark.size * spark.life, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  requestAnimationFrame(renderSparks);
}

window.addEventListener("resize", resizeCanvas);

window.addEventListener("pointermove", (event) => {
  pointer = { x: event.clientX, y: event.clientY };
  const now = performance.now();
  if (now - lastSpark > 36) {
    addSpark(pointer.x, pointer.y, 2);
    lastSpark = now;
  }
});

window.addEventListener(
  "scroll",
  () => {
    document.documentElement.style.setProperty("--scroll", window.scrollY.toString());
    if (Math.random() > 0.82) {
      addSpark(width * (0.25 + Math.random() * 0.5), height * 0.86, 1);
    }
  },
  { passive: true },
);

resizeCanvas();
renderSparks();

setInterval(() => {
  addSpark(width * (0.58 + Math.random() * 0.34), height * (0.68 + Math.random() * 0.18), 1);
}, 340);
