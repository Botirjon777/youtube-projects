/* =========================================================
   Jank Lab — transform vs left
   Same motion, two mechanisms. Block the main thread and
   watch `left` choke while `transform` keeps gliding.
   ========================================================= */

const $ = (id) => document.getElementById(id);

/* ---------- match the transform distance to the track ---------- */
function sizeTransform() {
  const track = document.querySelector(".track");
  const box = document.querySelector(".box-transform");
  if (!track || !box) return;
  const dx = track.clientWidth - box.offsetWidth;
  box.style.setProperty("--dx", dx + "px");
}
sizeTransform();
window.addEventListener("resize", sizeTransform);

/* ---------- live FPS meter (main-thread) ---------- */
const fpsEl = $("fps");
const fpsBar = $("fpsBar");
let last = performance.now();
let frames = 0;
let acc = 0;

function loop(now) {
  frames++;
  acc += now - last;
  last = now;
  if (acc >= 250) {              // update 4x/sec
    const fps = Math.round((frames * 1000) / acc);
    fpsEl.textContent = fps;
    fpsBar.style.transform = `scaleX(${Math.min(fps, 60) / 60})`;
    frames = 0;
    acc = 0;
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/* ---------- the villain: block the main thread ---------- */
const blockBtn = $("blockBtn");
const note = $("note");
let blocker = null;

function burnMainThread(ms) {
  const end = performance.now() + ms;
  while (performance.now() < end) { /* deliberately spin */ }
}

blockBtn.addEventListener("click", () => {
  if (blocker) return stopBlocking();
  blockBtn.classList.add("active");
  blockBtn.textContent = "🔥 Blocking… (click to stop)";
  note.textContent = "See it? The red box stutters; the green box doesn't care.";
  // long tasks ~180ms with small gaps → visible jank, page still responds enough to stop
  blocker = setInterval(() => burnMainThread(180), 220);
});

function stopBlocking() {
  clearInterval(blocker);
  blocker = null;
  blockBtn.classList.remove("active");
  blockBtn.textContent = "🔥 Block the main thread";
  note.textContent = "Main thread free again — both look smooth now.";
}

/* ---------- pause / resume the race ---------- */
$("stopBtn").addEventListener("click", () => {
  document.body.classList.toggle("paused");
  $("stopBtn").textContent = document.body.classList.contains("paused") ? "Play" : "Stop";
});
