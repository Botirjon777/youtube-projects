# 💌 Will You Go On A Date With Me?

> Pillar: **Love / feel-good** · Publish: **2026-07-04**

A playful 3-step date invite. She **can't click "No"** — it runs away every time and the "Yes" button keeps growing. Once she says yes, she picks the **food**, **day**, and **time**, and a **live countdown** to the moment begins.

## ▶️ Run it
Open `index.html` in a browser. No setup.

## ✨ The flow
1. **The question** — "Yes 💖" / "No". The No button dodges every cursor, tap, and even keyboard focus; the Yes button grows with each dodge.
2. **Plan it** — pick a food chip, choose a day + time. Confirm unlocks only when everything's chosen.
3. **It's a date!** — a summary line + a `days / hours / mins / secs` countdown ticking down to the chosen moment. Hits zero → "see you now! 💖"

## 🎬 Video outline
1. Hook: "I made a date invite she literally *can't* say no to"
2. Build the Yes/No, then make No run away (`position: fixed` + random x/y)
3. Block every escape route: `mouseenter`, `touchstart`, `focus`, `click`
4. Grow the Yes button on each dodge (`transform: scale`)
5. Step 2 form: food chips + `<input type="date">` + `<input type="time">`
6. Step 3: parse `day + time` → live `setInterval` countdown
7. Reveal: send her the link 💞

## 🗣️ Talking points
- Why `position: fixed` lets the button escape any container
- Catching **focus** too, so Tab + Enter can't beat it
- Building a tiny step-based flow with plain `classList` toggles (no framework)
- Date math: `new Date(\`${day}T${time}\`)` and padding with `padStart`
