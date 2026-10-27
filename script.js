
const AUDIO_FILES = {
  beep: 'beep.mp3',
  correct: 'correct.mp3',
  error: 'error.mp3',
  victory: 'victory.mp3',
};

const sounds = {};
for (const key in AUDIO_FILES) {
  const a = new Audio(AUDIO_FILES[key]);
  a.preload = 'auto';
  sounds[key] = a;
}
function playSound(name) {
  const a = sounds[name];
  if (!a || a.error) return; // graceful fallback: no audio file present
  try {
    a.currentTime = 0;
    const p = a.play();
    if (p && typeof p.catch === 'function') {
      p.catch(function () { /* audio file missing or blocked - ignore */ });
    }
  } catch (e) {
    /* ignore */
  }
}

const PUZZLES = [
  {
    id: 1,
    prompt:
      'PUZZLE 1 - WORD RIDDLE:\n' +
      '"I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?"',
    answer: 'echo',
    points: 100,
    fragment: 'TITAN',
    success: 'Subsystem 1 DISARMED. Fragment 1 unlocked: TITAN',
  },
  {
    id: 2,
    prompt:
      'PUZZLE 2 - SEQUENCE PATTERN:\n' +
      '"POWER GRID FAULT: Complete the sequence [ 2, 4, 8, 16, ? ] to reboot auxiliary power."',
    answer: '32',
    points: 100,
    fragment: 'SILO4',
    success: 'Subsystem 2 DISARMED. Fragment 2 unlocked: SILO4',
  },
  {
    id: 3,
    prompt:
      'PUZZLE 3 - COMMON SENSE NAVIGATION:\n' +
      '"RADAR CALIBRATION: Enter the opposite direction of: WEST."',
    answer: 'east',
    points: 100,
    fragment: 'ABORT',
    success: 'Subsystem 3 DISARMED. Fragment 3 unlocked: ABORT',
  },
];

const state = {
  score: 0,
  current: 0,           // index of active puzzle (0..2), 3 = all done
  fragments: [],
  disarmed: PUZZLES.map(function () { return false; }),
  victory: false,
  easterClaimed: false,
};

const historyEl = document.getElementById('history');
const cmd = document.getElementById('cmd');
const scoreEl = document.getElementById('score');
const defconEl = document.getElementById('defcon');
const silosEl = document.getElementById('silos');
const screen = document.getElementById('screen');

function appendLine(text, cls) {
  const lines = String(text).split('\n');
  for (let i = 0; i < lines.length; i++) {
    const div = document.createElement('div');
    div.className = 'line' + (cls ? ' ' + cls : '');
    div.textContent = lines[i] === '' ? '\u00A0' : lines[i];
    historyEl.appendChild(div);
  }
  historyEl.scrollTop = historyEl.scrollHeight;
}

function updateHUD() {
  const disarmedCount = state.disarmed.filter(Boolean).length;
  scoreEl.textContent = state.score;
  defconEl.textContent = Math.max(1, 3 - disarmedCount);
  silosEl.textContent = (3 - disarmedCount) + ' LOCKED';
}

function deduct(points) {
  state.score = Math.max(0, state.score - points);
  updateHUD();
}

const COMMANDS = {
  help: function () {
    appendLine('=== AVAILABLE COMMANDS ===', 'info');
    appendLine('  help            - List all available commands');
    appendLine('  status          - Show DEFCON state, silos, score');
    appendLine('  read            - Show the active puzzle clue');
    appendLine('  input <answer>  - Submit an answer for the active puzzle');
    appendLine('  clear           - Clear screen history (keeps progress)');
    appendLine('  override <code> - Submit the final override code');
    appendLine('  fragments       - Show collected fragments');
    appendLine('  Tip: you may also type a bare answer directly.');
  },
  status: function () {
    const d = state.disarmed.filter(Boolean).length;
    appendLine('=== SYSTEM STATUS ===', 'info');
    appendLine('DEFCON LEVEL: ' + Math.max(1, 3 - d));
    appendLine('SILOS LOCKED: ' + (3 - d));
    appendLine('SCORE: ' + state.score);
    appendLine('PUZZLES SOLVED: ' + d + ' / 3');
    appendLine('FRAGMENTS: ' + (state.fragments.length ? state.fragments.join(' - ') : 'none'));
    if (state.victory) appendLine('STATE: LAUNCH CANCELLED', 'ok');
  },
  read: function () {
    if (state.victory) {
      appendLine('Mission complete. No active puzzle.', 'info');
      return;
    }
    if (state.current >= PUZZLES.length) {
      appendLine('All puzzles solved. Enter override code: override TITAN-SILO4-ABORT', 'warn');
      return;
    }
    appendLine(PUZZLES[state.current].prompt, 'info');
  },
  clear: function () {
    historyEl.innerHTML = '';
  },
  fragments: function () {
    appendLine('COLLECTED FRAGMENTS: ' + (state.fragments.length ? state.fragments.join(', ') : 'none'), 'info');
  },
};

function handleOverride(code) {
  if (code.toUpperCase() === 'TITAN-SILO4-ABORT') {
    triggerVictory();
  } else {
    appendLine('INVALID OVERRIDE CODE. ACCESS DENIED.', 'err');
    playSound('error');
    deduct(25);
  }
}

function triggerVictory() {
  state.victory = true;
  playSound('victory');
  historyEl.innerHTML = '';
  screen.classList.add('victory');

  const banner =
    '╔══════════════════════════════════════════════╗\n' +
    '║                                              ║\n' +
    '║          LAUNCH_CANCELLED_OMEGA_99           ║\n' +
    '║                                              ║\n' +
    '║     ALL SILOS DISARMED - MISSION SUCCESS     ║\n' +
    '║                                              ║\n' +
    '╚══════════════════════════════════════════════╝';

  appendLine(banner, 'banner');
  appendLine('', '');
  appendLine('FINAL SCORE: ' + state.score, 'ok');
  appendLine('STATUS: MISSILE LAUNCH ABORTED', 'ok');
  appendLine('', '');
  appendLine('[ BADGE: OMEGA DEFENDER - HERO OF THE COLD WAR ]', 'ok');
  updateHUD();
}

function processCommand(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return;

  // Convenience: allow typing a bare answer / override phrase directly.
  let effective = trimmed;
  if (!state.victory && state.current < PUZZLES.length) {
    if (trimmed.toLowerCase() === String(PUZZLES[state.current].answer).toLowerCase()) {
      effective = 'input ' + trimmed;
    }
  } else if (!state.victory && state.current >= PUZZLES.length) {
    if (trimmed.toUpperCase() === 'TITAN-SILO4-ABORT') {
      effective = 'override ' + trimmed;
    }
  }

  appendLine('DEFCON:~$ ' + trimmed, 'info');
  playSound('beep');

  const parts = effective.split(/\s+/);
  const cmdName = parts[0].toLowerCase();
  const args = parts.slice(1).join(' ');


  if (Object.prototype.hasOwnProperty.call(COMMANDS, cmdName)) {
    COMMANDS[cmdName](args);
    return;
  }

  if (cmdName === 'input') {
    if (state.victory) {
      appendLine('Mission already complete.', 'info');
      return;
    }
    if (state.current >= PUZZLES.length) {
      handleOverride(args.trim());
      return;
    }
    const puzzle = PUZZLES[state.current];
    const answer = args.trim().toLowerCase();
    if (!answer) {
      appendLine('Usage: input <answer>', 'warn');
      return;
    }
    if (answer === String(puzzle.answer).toLowerCase()) {
      state.score += puzzle.points;
      state.disarmed[puzzle.id - 1] = true;
      state.fragments.push(puzzle.fragment);
      state.current++;
      updateHUD();
      appendLine(puzzle.success, 'ok');
      playSound('correct');
      if (state.current < PUZZLES.length) {
        appendLine('Next puzzle unlocked. Type `read` to view.', 'info');
      } else {
        appendLine('All subsystems disarmed. Enter override code: override TITAN-SILO4-ABORT', 'warn');
      }
    } else {
      appendLine('INCORRECT. ACCESS DENIED.', 'err');
      playSound('error');
      deduct(25);
    }
    return;
  }

  if (cmdName === 'override') {
    if (state.current < PUZZLES.length) {
      appendLine('Disarm all subsystems first.', 'warn');
      return;
    }
    if (!args.trim()) {
      appendLine('Usage: override <code>', 'warn');
      return;
    }
    handleOverride(args.trim());
    return;
  }

  appendLine('Unknown command: ' + cmdName + '. Type `help`.', 'err');
  playSound('error');
}

cmd.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    const val = cmd.value;
    cmd.value = '';
    cmd.size = 1;
    processCommand(val);
  }
});

cmd.addEventListener('input', function () {
  cmd.size = Math.max(1, cmd.value.length + 1);
});

document.querySelectorAll('.bezel-btn').forEach(function (b) {
  b.addEventListener('click', function () {
    const c = b.getAttribute('data-cmd');
    if (c) processCommand(c);
  });
});

document.addEventListener('click', function (e) {
  // keep focus on input unless clicking a button
  if (e.target && e.target.tagName !== 'BUTTON') cmd.focus();
});

window.addEventListener('load', function () {
  cmd.focus();
  updateHUD();
  appendLine('DEFCON-CORE TERMINAL ONLINE.', 'ok');
  appendLine('Type `help` for commands. Type `read` to begin.', 'info');
  playSound('beep');
});
