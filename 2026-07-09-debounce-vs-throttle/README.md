# 🧠 Debounce vs Throttle — visualized

> Pillar: **Explainer** · Publish: **2026-07-09**

The single most-Googled JS interview topic, made obvious in 10 seconds. One stream of mouse/keyboard events feeds **three** handlers — RAW, THROTTLE, DEBOUNCE — and you *see* the difference: RAW fires hundreds of times, THROTTLE beats steadily, DEBOUNCE fires once when you stop.

## ▶️ Run it
Open `index.html`. Move your mouse over the pad (or type in the box). Drag the **wait** slider to feel it.

## 💡 The lesson (the viral hook)
- **RAW** → every event. The performance killer.
- **THROTTLE** → at most once per interval. A steady heartbeat. *Scroll, resize, mousemove.*
- **DEBOUNCE** → once, after the events go quiet. *Search-as-you-type, autosave, validation.*

## 🎬 Video outline (Short)
1. Hook (0–3s): "Debounce vs throttle in one image" — wiggle mouse, RAW counter explodes.
2. (3–8s): "Throttle = heartbeat" — point to the evenly-spaced dots.
3. (8–14s): "Debounce = waits for you to stop" — move, stop, one green dot flashes. **Wow moment.**
4. (14–22s): Show the 4-line implementations side by side.
5. CTA: "Debounce search, throttle scroll. Save this."

## 🗣️ Talking points
- The whole implementation is two tiny closures (in [script.js](script.js)): `setTimeout`+`clearTimeout` for debounce, a `last` timestamp for throttle.
- Why the same event stream drives all three (fair comparison).
- Real-world: debounced search avoids one API call per keystroke; throttled scroll avoids layout thrash.

## 🔬 How the demo works
- `pointermove` / `input` → `handleEvent()` calls all three handlers.
- Each fire appends a `.pulse` dot that animates across the timeline, then removes itself.
- Changing the slider rebuilds the throttle/debounce closures with the new timing.
