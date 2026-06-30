# ⚡ Jank Lab — `transform` vs `left`

> Pillar: **Performance** · Publish: **2026-07-07**

The classic "you've been animating wrong" demo. Two boxes do the **exact same motion** — one via `left`, one via `transform`. A button **blocks the main thread**; the `left` box stutters, the `transform` box keeps gliding. Live FPS meter shows the main thread tanking.

## ▶️ Run it
Open `index.html`. Click **🔥 Block the main thread**.

## 💡 The lesson (the viral hook)
- `left` / `top` / `width` → trigger **layout + paint** every frame, on the **main thread**.
- `transform` / `opacity` → run on the **compositor thread**, so they survive a busy main thread.
- **Animate only `transform` and `opacity`.** Promote with `will-change: transform`.

## 🎬 Video outline (Short)
1. Hook (0–2s): "You've been animating wrong" + show both boxes moving identically.
2. (2–5s): "They look the same… until the main thread gets busy."
3. (5–10s): Click **Block** → red box freezes, green box glides. **The wow moment.**
4. (10–20s): Cut to the code: `left` causes layout; `transform` is composited. Show the FPS meter dropping.
5. CTA: "Rule: only animate transform & opacity. Save this."

## 🗣️ Talking points
- Record with DevTools → Performance to show purple **Layout** bars on the `left` box only.
- Why `will-change` creates a compositor layer (and why not to overuse it).
- `opacity` belongs in the same "cheap to animate" club.

## 🔬 How the demo works
- Both boxes use CSS `@keyframes`. The villain is `setInterval` running a synchronous ~180ms busy-loop (`burnMainThread`) — that's a real long task, so the main-thread `left` animation janks while the composited `transform` animation does not.
- FPS meter = `requestAnimationFrame` delta sampling (main-thread frame rate).
