# 🟢 DEFCON-CORE Terminal

> A retro Cold War defense-station CRT terminal. Disarm the missile silos, solve three common-sense puzzles, and compile the final emergency override code.

![Theme](https://img.shields.io/badge/theme-retro%20CRT-00ff66?style=flat-square)
![Stack](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JS-00cc52?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

---

## ✨ Features

- 🖥️ Centered CRT monitor chassis with bezel buttons and an inner phosphor screen
- 📺 Green glowing text (`#00ff66`), CSS scanline overlay, subtle flicker animation
- ⌨️ Blinking cursor and a scrolling terminal history with `DEFCON:~$` prompt
- 🧩 Three linear, common-sense puzzles (riddle, sequence, navigation)
- 📊 Live score counter — **+100** per correct answer, **−25** per wrong attempt (min 0)
- 🎨 Color-coded feedback: bright green for success, flashing red for failure
- 🏆 Final victory sequence: amber/blue screen, ASCII banner `LAUNCH_CANCELLED_OMEGA_99`, final score & mission badge
- 🥚 Hidden Easter egg: type `wargames` or `nuke`
- 🔊 Audio hooks mapped to `beep.mp3`, `correct.mp3`, `error.mp3`, `victory.mp3` (graceful fallback if missing)

---

## 🕹️ How to Play

1. Open `index.html` in any modern browser (no build step, no server required).
2. Type `read` to view the current puzzle.
3. Submit your answer with `input <answer>` (or type the bare answer directly).
4. Repeat until all three subsystems are disarmed.
5. Enter the final override code to cancel the launch.

### Commands

| Command | Description |
|---|---|
| `help` | List all available commands |
| `status` | Show DEFCON level, locked silos, and score |
| `read` | Display the active puzzle clue |
| `input <answer>` | Submit an answer for the active puzzle |
| `clear` | Wipe screen history (keeps progress) |
| `override <code>` | Submit the final override code |
| `fragments` | Show collected code fragments |

### Puzzles

| # | Prompt | Answer |
|---|---|---|
| 1 | "I speak without a mouth and hear without ears…" | `echo` |
| 2 | Complete `[ 2, 4, 8, 16, ? ]` | `32` |
| 3 | Opposite direction of `WEST` | `east` |

Each correct answer unlocks a fragment: `TITAN` · `SILO4` · `ABORT`.  
Final command: `override TITAN-SILO4-ABORT`

---

## 🔊 Audio Setup (Optional)

Drop your own sound files into the project folder using these exact names:

- `beep.mp3` — keystroke / command submit
- `correct.mp3` — puzzle solved
- `error.mp3` — wrong answer
- `victory.mp3` — final code reveal

The app runs fine without them — playback fails silently with no console errors.

---

## 🛠️ Tech Stack

- **HTML5** — structure & audio elements
- **CSS3** — CRT styling, scanlines, flicker, animations
- **Vanilla JavaScript** — game logic, command parser, scoring

No frameworks, no Tailwind/Bootstrap, no external CDNs, no build tools.

---

## 📁 Project Structure

```
browsermissilepuzzle/
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## 🚀 Run Locally

Just open `index.html` in your browser. That's it.

---

## 📝 License

MIT — feel free to fork, remix, and deploy.
