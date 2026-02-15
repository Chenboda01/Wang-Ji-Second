const TOTAL_ROUNDS = 10;
const BASE_TIME = 22;
const MIN_TIME = 8;
const PENALTY_SECONDS = 1.2;
const BEST_SCORE_KEY = "wj-second-best-score";

const difficultyConfig = {
  easy: { timeBonus: 3.5, penaltyMultiplier: 0.65, scoreMultiplier: 0.9 },
  normal: { timeBonus: 0, penaltyMultiplier: 1, scoreMultiplier: 1 },
  hard: { timeBonus: -2.2, penaltyMultiplier: 1.35, scoreMultiplier: 1.25 }
};

const promptsByRound = [
  [
    "fast fingers win games",
    "type this phrase quickly",
    "practice builds speed"
  ],
  [
    "focus on every single letter",
    "stay calm and keep typing",
    "accuracy protects your timer"
  ],
  [
    "mistakes now cost valuable seconds",
    "speed means nothing without control",
    "watch your rhythm as rounds climb"
  ],
  [
    "the clock shrinks while the sentence grows",
    "steady focus beats frantic keyboard mashing",
    "small errors can collapse your momentum"
  ],
  [
    "precision under pressure is the heart of this game",
    "recover quickly from mistakes and protect your pace",
    "every round asks for cleaner and faster typing"
  ],
  [
    "when panic rises, breathe once and return to deliberate input",
    "expert typists preserve accuracy before chasing extra speed",
    "longer phrases reward discipline more than reckless urgency"
  ],
  [
    "round seven demands that you read ahead while your fingers finish the current word",
    "in difficult moments, prioritize consistency and do not overcorrect on each keypress",
    "your best chance is a smooth cadence that avoids repeated time penalties"
  ],
  [
    "as complexity increases, clean execution matters more than dramatic bursts of speed",
    "treat each sentence like a pattern: observe, commit, and complete without hesitation",
    "typing champions maintain control even when the timer becomes intimidatingly short"
  ],
  [
    "you are near the finish line, so balance urgency with careful attention to punctuation and spacing",
    "high-level rounds punish sloppy habits, therefore use measured rhythm and deliberate character entry",
    "stay locked in and let each accurate word carry you closer to a full ten-round victory"
  ],
  [
    "final round: execute with patience and intensity, because one careless sequence can erase your remaining seconds",
    "the hardest prompt demands tactical focus, steady breathing, and complete ownership of every character you type",
    "win this last stretch by preserving composure, maintaining precision, and finishing before the countdown disappears"
  ]
];

const roundValue = document.getElementById("round-value");
const timerValue = document.getElementById("timer-value");
const mistakesValue = document.getElementById("mistakes-value");
const scoreValue = document.getElementById("score-value");
const streakValue = document.getElementById("streak-value");
const bestValue = document.getElementById("best-value");
const statusText = document.getElementById("status-text");
const targetText = document.getElementById("target-text");
const progressFill = document.getElementById("progress-fill");
const campaignProgress = document.getElementById("campaign-progress");
const typingInput = document.getElementById("typing-input");
const difficultySelect = document.getElementById("difficulty-select");
const startButton = document.getElementById("start-button");
const nextButton = document.getElementById("next-button");
const restartButton = document.getElementById("restart-button");

const game = {
  round: 0,
  activePrompt: "",
  timeLeft: 0,
  mistakes: 0,
  score: 0,
  streak: 0,
  bestScore: 0,
  difficulty: "normal",
  lastTypedLength: 0,
  timerId: null,
  playing: false
};

function pickPrompt(roundNumber) {
  const pool = promptsByRound[roundNumber - 1];
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

function timeForRound(roundNumber) {
  const base = BASE_TIME - (roundNumber - 1) * 1.4;
  const adjusted = base + difficultyConfig[game.difficulty].timeBonus;
  return Math.max(MIN_TIME, adjusted);
}

function setStatus(message, tone) {
  statusText.textContent = message;
  statusText.classList.remove("good", "bad");
  if (tone === "good" || tone === "bad") {
    statusText.classList.add(tone);
  }
}

function updateHud() {
  roundValue.textContent = `${game.round} / ${TOTAL_ROUNDS}`;
  timerValue.textContent = `${Math.max(0, game.timeLeft).toFixed(1)}s`;
  mistakesValue.textContent = String(game.mistakes);
  scoreValue.textContent = String(game.score);
  streakValue.textContent = String(game.streak);
  bestValue.textContent = String(game.bestScore);

  const progressPercent = Math.floor((Math.max(0, game.round - 1) / TOTAL_ROUNDS) * 100);
  progressFill.style.width = `${progressPercent}%`;
  campaignProgress.setAttribute("aria-valuenow", String(progressPercent));
}

function renderPrompt() {
  const typed = typingInput.value;
  const done = game.activePrompt.slice(0, typed.length);
  const pending = game.activePrompt.slice(typed.length);
  targetText.innerHTML = `<span class="typed">${escapeHtml(done)}</span><span class="pending">${escapeHtml(pending)}</span>`;
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function applyMistakePenalty(count) {
  const penalty = PENALTY_SECONDS * difficultyConfig[game.difficulty].penaltyMultiplier;
  game.mistakes += count;
  game.streak = 0;
  game.timeLeft = Math.max(0, game.timeLeft - penalty * count);
  typingInput.classList.remove("shake");
  requestAnimationFrame(() => {
    typingInput.classList.add("shake");
  });
}

function loadBestScore() {
  const stored = window.localStorage.getItem(BEST_SCORE_KEY);
  const parsed = Number(stored);
  game.bestScore = Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
}

function persistBestScore() {
  if (game.score > game.bestScore) {
    game.bestScore = game.score;
    window.localStorage.setItem(BEST_SCORE_KEY, String(game.bestScore));
  }
}

function stopTimer() {
  if (game.timerId) {
    window.clearInterval(game.timerId);
    game.timerId = null;
  }
}

function endGame(won) {
  stopTimer();
  game.playing = false;
  typingInput.disabled = true;
  nextButton.hidden = true;
  startButton.hidden = true;
  restartButton.hidden = false;
  difficultySelect.disabled = false;

  if (won) {
    persistBestScore();
    setStatus(`You won all ${TOTAL_ROUNDS} rounds with ${game.mistakes} mistakes.`, "good");
  } else {
    persistBestScore();
    setStatus(`Time expired on round ${game.round}. Try again.`, "bad");
  }

  progressFill.style.width = `${won ? 100 : Math.floor(((game.round - 1) / TOTAL_ROUNDS) * 100)}%`;
  updateHud();
}

function completeRound() {
  stopTimer();
  typingInput.disabled = true;
  game.playing = false;

  const roundScore = Math.max(
    80,
    Math.floor((game.activePrompt.length * 9 + game.timeLeft * 20 + game.streak * 18) * difficultyConfig[game.difficulty].scoreMultiplier)
  );
  game.score += roundScore;

  if (game.round >= TOTAL_ROUNDS) {
    endGame(true);
    return;
  }

  setStatus(`Round ${game.round} cleared (+${roundScore} score). Prepare for round ${game.round + 1}.`, "good");
  nextButton.hidden = false;
  restartButton.hidden = false;
  updateHud();
}

function startRound(roundNumber) {
  game.round = roundNumber;
  game.activePrompt = pickPrompt(roundNumber);
  game.timeLeft = timeForRound(roundNumber);
  game.playing = true;

  typingInput.value = "";
  game.lastTypedLength = 0;
  typingInput.disabled = false;
  typingInput.focus();

  nextButton.hidden = true;
  restartButton.hidden = true;
  startButton.hidden = true;
  difficultySelect.disabled = true;

  setStatus(`Round ${roundNumber} started. Wrong keys cost time.`, "");
  renderPrompt();
  updateHud();

  stopTimer();
  game.timerId = window.setInterval(() => {
    game.timeLeft -= 0.1;
    if (game.timeLeft <= 0) {
      game.timeLeft = 0;
      updateHud();
      endGame(false);
      return;
    }
    updateHud();
  }, 100);
}

function startGame() {
  game.round = 0;
  game.mistakes = 0;
  game.score = 0;
  game.streak = 0;
  game.difficulty = difficultySelect.value;
  startRound(1);
}

typingInput.addEventListener("input", () => {
  if (!game.playing) {
    return;
  }

  let typed = typingInput.value;
  let errorsRemoved = 0;

  while (!game.activePrompt.startsWith(typed) && typed.length > 0) {
    typed = typed.slice(0, -1);
    errorsRemoved += 1;
  }

  if (errorsRemoved > 0) {
    typingInput.value = typed;
    applyMistakePenalty(errorsRemoved);
    const penalty = PENALTY_SECONDS * difficultyConfig[game.difficulty].penaltyMultiplier;
    setStatus(`Mistake: -${(penalty * errorsRemoved).toFixed(1)}s`, "bad");
  } else if (typed.length > game.lastTypedLength) {
    game.streak += typed.length - game.lastTypedLength;
  }

  game.lastTypedLength = typed.length;

  renderPrompt();
  updateHud();

  if (typingInput.value === game.activePrompt) {
    completeRound();
  }
});

startButton.addEventListener("click", startGame);

nextButton.addEventListener("click", () => {
  if (game.round < TOTAL_ROUNDS) {
    startRound(game.round + 1);
  }
});

restartButton.addEventListener("click", startGame);

difficultySelect.addEventListener("change", () => {
  game.difficulty = difficultySelect.value;
  setStatus(`Difficulty set to ${game.difficulty}. Press start when ready.`, "");
});

loadBestScore();
updateHud();
targetText.textContent = "Prompt text appears here once the game begins.";
