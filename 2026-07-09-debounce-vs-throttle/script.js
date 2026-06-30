/* =========================================================
   Debounce vs Throttle — visualized
   One stream of events → three handlers. Watch the dots.
   ========================================================= */

const $ = (id) => document.getElementById(id);

/* ---------- the two functions, written plainly ---------- */
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

function throttle(fn, interval) {
  let last = 0;
  return (...args) => {
    const now = performance.now();
    if (now - last >= interval) {
      last = now;
      fn(...args);
    }
  };
}

/* ---------- wiring ---------- */
let wait = Number($("wait").value);

const counts = { raw: 0, th: 0, db: 0 };
const lines = { raw: $("rawLine"), th: $("thLine"), db: $("dbLine") };
const labels = { raw: $("rawCount"), th: $("thCount"), db: $("dbCount") };

function fire(kind) {
  counts[kind]++;
  labels[kind].textContent = counts[kind];
  pulse(lines[kind]);
}

function pulse(line) {
  const p = document.createElement("span");
  p.className = "pulse";
  // randomize lane life a touch so dots don't perfectly overlap
  p.style.setProperty("--life", 2.6 + Math.random() * 0.8 + "s");
  line.appendChild(p);
  p.addEventListener("animationend", () => p.remove());
}

/* the three handlers — rebuilt whenever `wait` changes */
let onRaw, onThrottle, onDebounce;
function buildHandlers() {
  onRaw = () => fire("raw");
  onThrottle = throttle(() => fire("th"), wait);
  onDebounce = debounce(() => fire("db"), wait);
}
buildHandlers();

/* one event stream feeds all three */
function handleEvent() {
  onRaw();
  onThrottle();
  onDebounce();
}

const pad = $("pad");
pad.addEventListener("pointermove", () => { pad.classList.add("active"); handleEvent(); });
pad.addEventListener("pointerleave", () => pad.classList.remove("active"));
$("search").addEventListener("input", handleEvent);
$("search").addEventListener("pointermove", (e) => e.stopPropagation());

/* ---------- controls ---------- */
$("wait").addEventListener("input", (e) => {
  wait = Number(e.target.value);
  $("waitOut").textContent = wait + "ms";
  buildHandlers(); // new interval/wait
});

$("reset").addEventListener("click", () => {
  counts.raw = counts.th = counts.db = 0;
  labels.raw.textContent = labels.th.textContent = labels.db.textContent = "0";
});
