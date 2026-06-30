/* =========================================================
   Interactive Hero Backgrounds
   One canvas, five mouse-reactive themes. No libraries.
   Each theme = { init(), frame(t) }. Switch with the pills.
   ========================================================= */

const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let W = 0, H = 0, DPR = 1;
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = canvas.width = Math.floor(innerWidth * DPR);
  H = canvas.height = Math.floor(innerHeight * DPR);
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  if (active) active.init();
}

/* ---------- mouse (smoothed) ---------- */
const mouse = { x: 0, y: 0, tx: 0, ty: 0, vx: 0, vy: 0, has: false };
function setMouse(px, py) {
  mouse.tx = px * DPR;
  mouse.ty = py * DPR;
  mouse.has = true;
}
addEventListener("mousemove", (e) => setMouse(e.clientX, e.clientY));
addEventListener("touchmove", (e) => {
  if (e.touches[0]) setMouse(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });

function updateMouse() {
  if (!mouse.has) { mouse.x = W / 2; mouse.y = H / 2; mouse.tx = mouse.x; mouse.ty = mouse.y; }
  const nx = mouse.x + (mouse.tx - mouse.x) * 0.12;
  const ny = mouse.y + (mouse.ty - mouse.y) * 0.12;
  mouse.vx = nx - mouse.x;
  mouse.vy = ny - mouse.y;
  mouse.x = nx; mouse.y = ny;
}

const rand = (a, b) => a + Math.random() * (b - a);

/* =========================================================
   THEME: tech — particle constellation
   ========================================================= */
const tech = {
  pts: [],
  init() {
    const n = Math.round((W * H) / (16000 * DPR));
    this.pts = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: rand(-0.3, 0.3) * DPR, vy: rand(-0.3, 0.3) * DPR,
    }));
  },
  frame() {
    ctx.clearRect(0, 0, W, H);
    const pts = this.pts;
    const link = 130 * DPR;
    // mouse gently pulls nearby points
    for (const p of pts) {
      const dx = mouse.x - p.x, dy = mouse.y - p.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < (200 * DPR) ** 2) { p.vx += dx * 0.00004; p.vy += dy * 0.00004; }
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      p.vx *= 0.99; p.vy *= 0.99;
    }
    // links
    ctx.lineWidth = DPR;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.hypot(dx, dy);
        if (d < link) {
          ctx.strokeStyle = `rgba(88,166,255,${(1 - d / link) * 0.5})`;
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
        }
      }
      // link to cursor
      const mdx = pts[i].x - mouse.x, mdy = pts[i].y - mouse.y, md = Math.hypot(mdx, mdy);
      if (md < link * 1.4) {
        ctx.strokeStyle = `rgba(120,200,255,${(1 - md / (link * 1.4)) * 0.7})`;
        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    // nodes
    ctx.fillStyle = "#9fd0ff";
    for (const p of pts) { ctx.beginPath(); ctx.arc(p.x, p.y, 1.6 * DPR, 0, 7); ctx.fill(); }
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 3.5 * DPR, 0, 7); ctx.fill();
  },
};

/* =========================================================
   THEME: anime — falling sakura petals (wind follows mouse)
   ========================================================= */
const anime = {
  petals: [],
  init() {
    const n = Math.round((W * H) / (26000 * DPR));
    this.petals = Array.from({ length: n }, () => this.make(true));
  },
  make(spread) {
    return {
      x: Math.random() * W,
      y: spread ? Math.random() * H : -20 * DPR,
      s: rand(7, 16) * DPR,
      sy: rand(0.6, 1.6) * DPR,
      sway: rand(0, Math.PI * 2),
      swaySpd: rand(0.01, 0.03),
      rot: rand(0, Math.PI * 2),
      rotSpd: rand(-0.03, 0.03),
      hue: rand(330, 350),
    };
  },
  petal(p) {
    ctx.save();
    ctx.translate(p.x, p.y); ctx.rotate(p.rot);
    ctx.fillStyle = `hsla(${p.hue},80%,80%,0.92)`;
    ctx.beginPath();
    ctx.moveTo(0, -p.s / 2);
    ctx.quadraticCurveTo(p.s / 2, -p.s / 4, p.s / 3, p.s / 2);
    ctx.quadraticCurveTo(0, p.s / 4, -p.s / 3, p.s / 2);
    ctx.quadraticCurveTo(-p.s / 2, -p.s / 4, 0, -p.s / 2);
    ctx.fill();
    ctx.restore();
  },
  frame() {
    ctx.clearRect(0, 0, W, H);
    const wind = (mouse.x / W - 0.5) * 4 * DPR + 0.3 * DPR;
    for (const p of this.petals) {
      p.sway += p.swaySpd;
      p.x += wind + Math.sin(p.sway) * 0.8 * DPR;
      p.y += p.sy;
      p.rot += p.rotSpd;
      if (p.y > H + 20 * DPR || p.x < -30 * DPR || p.x > W + 30 * DPR) Object.assign(p, this.make(false));
      this.petal(p);
    }
  },
};

/* =========================================================
   THEME: gaming — synthwave perspective grid
   ========================================================= */
const gaming = {
  off: 0,
  init() { this.off = 0; },
  frame() {
    ctx.clearRect(0, 0, W, H);
    const horizon = H * 0.46;
    const vpx = W / 2 + (mouse.x - W / 2) * 0.12;   // vanishing point drifts with mouse

    // sun
    const sunR = Math.min(W, H) * 0.16;
    const g = ctx.createLinearGradient(0, horizon - sunR, 0, horizon + sunR);
    g.addColorStop(0, "#ffd24a"); g.addColorStop(0.5, "#ff5f9e"); g.addColorStop(1, "#7a2bff");
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, W, horizon); ctx.clip();
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(vpx, horizon, sunR, 0, 7); ctx.fill();
    ctx.restore();

    // grid floor
    this.off = (this.off + 1.2 * DPR) % (40 * DPR);
    ctx.strokeStyle = "rgba(255,80,180,0.55)";
    ctx.lineWidth = 1.4 * DPR;
    // horizontal receding lines
    for (let i = 0; i < 22; i++) {
      const t = (i * 40 * DPR + this.off) / (22 * 40 * DPR);
      const y = horizon + t * t * (H - horizon);
      ctx.globalAlpha = Math.min(1, t * 1.4);
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // converging verticals
    const cols = 18;
    for (let i = -cols; i <= cols; i++) {
      const x0 = vpx + i * 14 * DPR;
      const x1 = vpx + i * ((W / cols)) ;
      ctx.beginPath(); ctx.moveTo(x0, horizon); ctx.lineTo(x1, H); ctx.stroke();
    }
  },
};

/* =========================================================
   THEME: water — ripples on move + rising bubbles
   ========================================================= */
const water = {
  ripples: [], bubbles: [],
  init() {
    this.ripples = [];
    this.bubbles = Array.from({ length: Math.round(W / (40 * DPR)) }, () => this.bubble());
  },
  bubble() {
    return { x: Math.random() * W, y: H + Math.random() * H, r: rand(2, 6) * DPR, sp: rand(0.4, 1.4) * DPR, drift: rand(-0.3, 0.3) * DPR };
  },
  frame() {
    ctx.clearRect(0, 0, W, H);
    // spawn ripples where the mouse moves fast enough
    if (Math.hypot(mouse.vx, mouse.vy) > 1.2 * DPR) {
      this.ripples.push({ x: mouse.x, y: mouse.y, r: 4 * DPR, a: 0.6 });
    }
    ctx.lineWidth = 2 * DPR;
    this.ripples = this.ripples.filter((r) => {
      r.r += 2.6 * DPR; r.a -= 0.012;
      if (r.a <= 0) return false;
      ctx.strokeStyle = `rgba(220,250,255,${r.a})`;
      ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, 7); ctx.stroke();
      return true;
    });
    // bubbles
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    for (const b of this.bubbles) {
      b.y -= b.sp; b.x += b.drift + Math.sin(b.y * 0.01) * 0.3 * DPR;
      if (b.y < -10 * DPR) Object.assign(b, this.bubble());
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 7); ctx.fill();
    }
  },
};

/* =========================================================
   THEME: cute — pastel aurora blobs + sparkles (gooey cursor)
   ========================================================= */
const cute = {
  blobs: [], sparks: [], cx: 0, cy: 0,
  init() {
    this.cx = W / 2; this.cy = H / 2;
    const palette = ["#ff9ed8", "#a99cff", "#9be7ff", "#ffd1a9", "#c4ffd1"];
    this.blobs = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H,
      r: rand(120, 260) * DPR,
      vx: rand(-0.25, 0.25) * DPR, vy: rand(-0.25, 0.25) * DPR,
      c: palette[i % palette.length],
    }));
    this.sparks = Array.from({ length: 40 }, () => this.spark());
  },
  spark() { return { x: Math.random() * W, y: Math.random() * H, r: rand(1, 2.6) * DPR, ph: rand(0, 7), sp: rand(0.02, 0.06) }; },
  frame(t) {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    for (const b of this.blobs) {
      b.x += b.vx; b.y += b.vy;
      if (b.x < -b.r) b.x = W + b.r; if (b.x > W + b.r) b.x = -b.r;
      if (b.y < -b.r) b.y = H + b.r; if (b.y > H + b.r) b.y = -b.r;
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      g.addColorStop(0, b.c + "cc"); g.addColorStop(1, b.c + "00");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 7); ctx.fill();
    }
    // gooey cursor glow
    this.cx += (mouse.x - this.cx) * 0.08; this.cy += (mouse.y - this.cy) * 0.08;
    const cg = ctx.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, 180 * DPR);
    cg.addColorStop(0, "rgba(255,255,255,0.7)"); cg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = cg;
    ctx.beginPath(); ctx.arc(this.cx, this.cy, 180 * DPR, 0, 7); ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    // sparkles twinkle
    for (const s of this.sparks) {
      const a = 0.4 + 0.6 * Math.abs(Math.sin(t * s.sp + s.ph));
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
    }
  },
};

/* =========================================================
   THEME: galaxy — starfield warp toward the cursor
   ========================================================= */
const galaxy = {
  stars: [],
  init() {
    const n = Math.round((W * H) / (9000 * DPR));
    this.stars = Array.from({ length: n }, () => this.make());
  },
  make() { return { x: rand(-W, W), y: rand(-H, H), z: rand(1, W), pz: 0 }; },
  frame() {
    ctx.fillStyle = "rgba(1,1,8,0.32)"; ctx.fillRect(0, 0, W, H); // motion-blur trails
    ctx.globalCompositeOperation = "lighter";
    const cx = mouse.x, cy = mouse.y, focal = W * 0.7;
    for (const s of this.stars) {
      s.pz = s.z;
      s.z -= 9 * DPR;
      if (s.z < 1) { Object.assign(s, this.make()); s.z = W; s.pz = W; continue; }
      const sx = cx + (s.x / s.z) * focal, sy = cy + (s.y / s.z) * focal;
      const px = cx + (s.x / s.pz) * focal, py = cy + (s.y / s.pz) * focal;
      const k = 1 - s.z / W;
      ctx.strokeStyle = `rgba(180,210,255,${k})`;
      ctx.lineWidth = Math.max(0.5, k * 2.5 * DPR);
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(sx, sy); ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
  },
};

/* =========================================================
   THEME: matrix — digital rain (cursor column glows)
   ========================================================= */
const matrix = {
  cols: [], font: 16, chars: "アァカサタナハマヤラ0123456789ABCDEF$#%&",
  init() {
    this.font = 16 * DPR;
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
    const n = Math.floor(W / this.font);
    this.cols = Array.from({ length: n }, () => ({ y: rand(-H, 0), sp: rand(4, 13) * DPR }));
  },
  frame() {
    ctx.fillStyle = "rgba(0,0,0,0.07)"; ctx.fillRect(0, 0, W, H); // trails
    ctx.font = `${this.font}px "JetBrains Mono", monospace`;
    const f = this.font, mcol = Math.floor(mouse.x / f);
    for (let i = 0; i < this.cols.length; i++) {
      const c = this.cols[i], x = i * f;
      const ch = this.chars[(Math.random() * this.chars.length) | 0];
      const near = Math.abs(i - mcol) < 3;
      ctx.fillStyle = near ? "#eafff0" : "#33ff77";
      ctx.fillText(ch, x, c.y);
      if (c.y > H && Math.random() > 0.975) c.y = 0;
      c.y += c.sp;
    }
  },
};

/* =========================================================
   THEME: fire — embers rising (cursor is a torch)
   ========================================================= */
const fire = {
  parts: [],
  init() { this.parts = []; },
  spawn(x, y, n) {
    for (let k = 0; k < n; k++) this.parts.push({
      x: x + rand(-10, 10) * DPR, y,
      vx: rand(-0.4, 0.4) * DPR, vy: rand(-2.6, -1.1) * DPR,
      life: 1, r: rand(6, 15) * DPR,
    });
  },
  frame() {
    ctx.clearRect(0, 0, W, H);
    for (let x = 0; x < W; x += 40 * DPR) this.spawn(x, H + 8 * DPR, 1); // base flames
    this.spawn(mouse.x, mouse.y, 3);                                     // torch at cursor
    ctx.globalCompositeOperation = "lighter";
    this.parts = this.parts.filter((p) => {
      p.life -= 0.018;
      if (p.life <= 0) return false;
      p.x += p.vx; p.y += p.vy; p.vy -= 0.02 * DPR; p.vx *= 0.99;
      const t = p.life;
      ctx.fillStyle = `rgba(255,${(180 * t + 40) | 0},${(60 * t * t) | 0},${t * 0.5})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1.4 - t), 0, 7); ctx.fill();
      return true;
    });
    ctx.globalCompositeOperation = "source-over";
  },
};

/* =========================================================
   THEME: plasma — lightning bolts arc to the cursor
   ========================================================= */
const plasma = {
  bolts: [], timer: 0,
  init() { this.bolts = []; this.timer = 0; },
  jagged(x1, y1, x2, y2) {
    let pts = [[x1, y1], [x2, y2]];
    for (let g = 0; g < 5; g++) {
      const np = [];
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i], b = pts[i + 1];
        const mx = (a[0] + b[0]) / 2 + rand(-1, 1) * (50 * DPR) / (g + 1);
        const my = (a[1] + b[1]) / 2 + rand(-1, 1) * (50 * DPR) / (g + 1);
        np.push(a, [mx, my]);
      }
      np.push(pts[pts.length - 1]);
      pts = np;
    }
    return pts;
  },
  frame() {
    ctx.fillStyle = "rgba(4,2,16,0.25)"; ctx.fillRect(0, 0, W, H);
    if (--this.timer <= 0) {
      const edges = [[rand(0, W), 0], [rand(0, W), H], [0, rand(0, H)], [W, rand(0, H)]];
      const e = edges[(rand(0, 4)) | 0];
      this.bolts.push({ pts: this.jagged(e[0], e[1], mouse.x, mouse.y), life: 1 });
      this.timer = rand(6, 16);
    }
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round"; ctx.shadowColor = "#6cf";
    this.bolts = this.bolts.filter((b) => {
      b.life -= 0.05;
      if (b.life <= 0) return false;
      ctx.strokeStyle = `rgba(160,205,255,${b.life})`;
      ctx.lineWidth = 2 * DPR; ctx.shadowBlur = 16 * DPR;
      ctx.beginPath();
      ctx.moveTo(b.pts[0][0], b.pts[0][1]);
      for (let i = 1; i < b.pts.length; i++) ctx.lineTo(b.pts[i][0], b.pts[i][1]);
      ctx.stroke();
      return true;
    });
    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = "source-over";
  },
};

/* =========================================================
   THEME: boids — flocking swarm that follows the cursor
   ========================================================= */
const boids = {
  b: [],
  init() {
    const n = Math.min(120, Math.round((W * H) / (45000 * DPR)));
    this.b = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: rand(-1, 1) * DPR, vy: rand(-1, 1) * DPR,
    }));
  },
  frame() {
    ctx.clearRect(0, 0, W, H);
    const b = this.b, R = 64 * DPR, maxV = 2.6 * DPR;
    for (let i = 0; i < b.length; i++) {
      const p = b[i];
      let ax = 0, ay = 0, cx = 0, cy = 0, sx = 0, sy = 0, count = 0;
      for (let j = 0; j < b.length; j++) {
        if (i === j) continue;
        const dx = b[j].x - p.x, dy = b[j].y - p.y, d = Math.hypot(dx, dy);
        if (d < R) {
          ax += b[j].vx; ay += b[j].vy; cx += b[j].x; cy += b[j].y;
          if (d < 26 * DPR && d > 0) { sx -= dx / d; sy -= dy / d; }
          count++;
        }
      }
      if (count) {
        p.vx += (ax / count) * 0.02 + (cx / count - p.x) * 0.0008 + sx * 0.07;
        p.vy += (ay / count) * 0.02 + (cy / count - p.y) * 0.0008 + sy * 0.07;
      }
      const mdx = mouse.x - p.x, mdy = mouse.y - p.y, md = Math.hypot(mdx, mdy) || 1;
      p.vx += (mdx / md) * 0.045; p.vy += (mdy / md) * 0.045;
      const sp = Math.hypot(p.vx, p.vy);
      if (sp > maxV) { p.vx = p.vx / sp * maxV; p.vy = p.vy / sp * maxV; }
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x += W; if (p.x > W) p.x -= W;
      if (p.y < 0) p.y += H; if (p.y > H) p.y -= H;
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(Math.atan2(p.vy, p.vx));
      ctx.fillStyle = "#7fe9ff";
      ctx.beginPath(); ctx.moveTo(7 * DPR, 0); ctx.lineTo(-5 * DPR, 4 * DPR); ctx.lineTo(-5 * DPR, -4 * DPR);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }
  },
};

/* =========================================================
   THEME: snow — snowfall, wind follows the cursor
   ========================================================= */
const snow = {
  flakes: [],
  init() {
    const n = Math.round((W * H) / (16000 * DPR));
    this.flakes = Array.from({ length: n }, () => this.make(true));
  },
  make(spread) {
    return {
      x: Math.random() * W, y: spread ? Math.random() * H : -10 * DPR,
      r: rand(1.5, 4.5) * DPR, sp: rand(0.5, 1.7) * DPR,
      sway: rand(0, 7), swSpd: rand(0.005, 0.02), a: rand(0.4, 1),
    };
  },
  frame() {
    ctx.clearRect(0, 0, W, H);
    const wind = (mouse.x / W - 0.5) * 3 * DPR;
    ctx.fillStyle = "#fff";
    for (const f of this.flakes) {
      f.sway += f.swSpd;
      f.x += wind + Math.sin(f.sway) * 0.5 * DPR;
      f.y += f.sp;
      if (f.y > H + 6 * DPR || f.x < -10 * DPR || f.x > W + 10 * DPR) Object.assign(f, this.make(false));
      ctx.globalAlpha = f.a;
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1;
  },
};

/* =========================================================
   THEME: vortex — particles spiral into the cursor
   ========================================================= */
const vortex = {
  parts: [], maxR: 1,
  init() {
    this.maxR = Math.max(W, H) * 0.6;
    const n = Math.round((W * H) / (7000 * DPR));
    this.parts = Array.from({ length: n }, () => this.make());
  },
  make() { return { ang: rand(0, 7), rad: rand(40 * DPR, this.maxR || 800), sp: rand(0.006, 0.02), hue: rand(190, 320) }; },
  frame() {
    ctx.fillStyle = "rgba(8,0,16,0.25)"; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    const cx = mouse.x, cy = mouse.y;
    for (const p of this.parts) {
      p.ang += p.sp * (1 + (1 - p.rad / this.maxR) * 2);
      p.rad -= 1.3 * DPR;
      if (p.rad < 6 * DPR) Object.assign(p, this.make());
      const x = cx + Math.cos(p.ang) * p.rad;
      const y = cy + Math.sin(p.ang) * p.rad * 0.62; // squash → depth
      const s = Math.max(0.5, (1 - p.rad / this.maxR) * 3 * DPR);
      ctx.fillStyle = `hsla(${p.hue},90%,66%,0.85)`;
      ctx.beginPath(); ctx.arc(x, y, s, 0, 7); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  },
};

/* =========================================================
   Switching + main loop
   ========================================================= */
const THEMES = { tech, anime, gaming, water, cute, galaxy, matrix, fire, plasma, boids, snow, vortex };
let active = tech;

const hero = document.getElementById("hero");
const titles = {
  tech:   { t: "Interactive Heroes", s: "five mouse-reactive backgrounds · pure canvas, zero libraries" },
  anime:  { t: "Sakura Dreams", s: "petals drift on a wind that follows your mouse 🌸" },
  gaming: { t: "SYNTHWAVE", s: "neon grid · move to steer the horizon 🎮" },
  water:  { t: "Make Waves", s: "every move sends ripples through the deep 🌊" },
  cute:   { t: "Soft & Sparkly", s: "pastel aurora that glows around your cursor 💗" },
  galaxy: { t: "Hyperspace", s: "stars warp out of wherever you point 🌌" },
  matrix: { t: "WAKE UP", s: "digital rain · the cursor column burns bright 💚" },
  fire:   { t: "Playing with Fire", s: "your cursor is a torch — embers rise 🔥" },
  plasma: { t: "High Voltage", s: "lightning arcs to your every move ⚡" },
  boids:  { t: "Swarm", s: "a flock that chases your cursor 🐠" },
  snow:   { t: "Let It Snow", s: "drift the snowfall with your mouse ❄️" },
  vortex: { t: "Event Horizon", s: "everything spirals into your cursor 🌀" },
};

function switchTheme(name) {
  if (!THEMES[name]) return;
  active = THEMES[name];
  document.body.dataset.theme = name;
  document.getElementById("title").textContent = titles[name].t;
  document.getElementById("sub").textContent = titles[name].s;
  document.querySelectorAll(".switcher button").forEach((b) =>
    b.classList.toggle("active", b.dataset.theme === name));
  active.init();
}

document.getElementById("switcher").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (btn) switchTheme(btn.dataset.theme);
});

let t = 0;
function loop() {
  t += 0.016;
  updateMouse();
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over"; // reset before each theme draws
  active.frame(t);
  // parallax the hero text opposite the mouse
  const px = (mouse.x / W - 0.5);
  const py = (mouse.y / H - 0.5);
  hero.style.transform = `translate(${-px * 26}px, ${-py * 18}px)`;
  requestAnimationFrame(loop);
}

addEventListener("resize", resize);
resize();
active.init();
if (!reduce) loop();
else active.frame(0); // single static frame
