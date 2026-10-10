// KoreKit Mystery Box
// Self-contained ESL classroom game. Sound effects are synthesized with Web Audio API.

const state = {
  teams: [],
  currentTeam: 0,
  opened: new Set(),
  turn: 1,
  sound: true,
  pendingBox: null,
  questions: {},
  rewards: []
};

const questions = {
  3: [
    ["What is your name?", "My name is ______."],
    ["How old are you?", "I am ______ years old."],
    ["How are you today?", "I am happy / good / great."],
    ["What color do you like?", "I like ______."],
    ["What animal do you like?", "I like ______."],
    ["How many pencils do you have?", "I have ______ pencils."],
    ["What is this?", "It is a ______."],
    ["What food do you like?", "I like ______."],
    ["Can you swim?", "Yes, I can. / No, I can't."],
    ["What day is it today?", "It is ______."],
    ["What is your favorite game?", "My favorite game is ______."],
    ["What is your favorite fruit?", "My favorite fruit is ______."]
  ],
  4: [
    ["What time is it?", "It is ______ o'clock."],
    ["What do you do after school?", "I ______ after school."],
    ["What is your favorite subject?", "My favorite subject is ______."],
    ["How is the weather today?", "It is sunny / cloudy / rainy."],
    ["What are you wearing?", "I am wearing ______."],
    ["What is your favorite sport?", "My favorite sport is ______."],
    ["Where is the pencil?", "It is on / under / next to ______."],
    ["What are you good at?", "I am good at ______."],
    ["What do you want?", "I want ______."],
    ["Do you like pizza?", "Yes, I do. / No, I don't."],
    ["Who is your best friend?", "My best friend's name is ______."],
    ["What can you do?", "I can ______."]
  ],
  5: [
    ["What did you do yesterday?", "I ______ yesterday."],
    ["What do you want to be?", "I want to be a ______."],
    ["How often do you exercise?", "I ______ every day / often / sometimes."],
    ["What is your favorite season?", "My favorite season is ______."],
    ["What are you going to do this weekend?", "I am going to ______."],
    ["Which do you prefer, summer or winter?", "I prefer ______."],
    ["What did you eat for breakfast?", "I ate ______."],
    ["Where do you want to go?", "I want to go to ______."],
    ["What is your favorite movie?", "My favorite movie is ______."],
    ["How do you get to school?", "I go by ______."],
    ["What makes you happy?", "______ makes me happy."],
    ["What is one thing you are good at?", "I am good at ______."]
  ],
  6: [
    ["What did you do last weekend?", "I ______ last weekend."],
    ["What are you going to do during vacation?", "I am going to ______."],
    ["What is your dream job?", "My dream job is ______."],
    ["If you could travel anywhere, where would you go?", "I would go to ______."],
    ["What is the most interesting place you have visited?", "The most interesting place is ______."],
    ["What is your favorite way to relax?", "I like to ______."],
    ["What should students do to stay healthy?", "Students should ______."],
    ["What would you buy if you had 100 dollars?", "I would buy ______."],
    ["What is something you want to learn?", "I want to learn ______."],
    ["What is your favorite memory from school?", "My favorite memory is ______."],
    ["Which is better: studying alone or with friends? Why?", "I think ______ because ______."],
    ["What would you do if you had a free day?", "I would ______."]
  ]
};

const rewardPool = [
  { icon:"💰", title:"+10 POINTS!", detail:"Your team gets 10 points.", points:10, sound:"coin" },
  { icon:"💎", title:"+20 POINTS!", detail:"A big mystery-box reward!", points:20, sound:"big" },
  { icon:"⭐", title:"+30 POINTS!", detail:"Amazing! Your team hits the jackpot!", points:30, sound:"big" },
  { icon:"🎉", title:"DOUBLE!", detail:"Your team gets 20 points.", points:20, sound:"big" },
  { icon:"🪙", title:"+5 POINTS", detail:"A small bonus for your team.", points:5, sound:"coin" },
  { icon:"💥", title:"−10 POINTS", detail:"Oh no! Your team loses 10 points.", points:-10, sound:"lose" },
  { icon:"😱", title:"−5 POINTS", detail:"A little mystery-box trouble.", points:-5, sound:"lose" },
  { icon:"🛡️", title:"SAFE!", detail:"Nothing happens. Your team keeps its score.", points:0, sound:"safe" },
  { icon:"🎁", title:"+15 POINTS", detail:"A surprise bonus!", points:15, sound:"coin" },
  { icon:"🍀", title:"LUCKY!", detail:"Your team gets 10 points.", points:10, sound:"big" },
  { icon:"🔄", title:"SWITCH!", detail:"Switch scores with another team.", special:"swap", sound:"special" },
  { icon:"🦹", title:"STEAL 10!", detail:"Take 10 points from another team.", special:"steal", sound:"special" },
  { icon:"⏭️", title:"SKIP!", detail:"No points this turn — but you avoid a penalty.", points:0, sound:"safe" },
  { icon:"🎯", title:"BONUS +25!", detail:"Your team gets 25 points.", points:25, sound:"big" },
  { icon:"👑", title:"KING'S BONUS!", detail:"Your team gets 15 points.", points:15, sound:"big" }
];

let audioCtx = null;

function ensureAudio() {
  if (!state.sound) return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function tone(freq, duration, type="sine", volume=.06, delay=0) {
  const ctx = ensureAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + delay + .015);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration + .02);
}

function soundBox() {
  tone(180, .12, "sine", .05);
  tone(280, .12, "sine", .04, .08);
  tone(420, .16, "triangle", .045, .16);
}
function soundQuestion() {
  tone(440, .08, "sine", .04);
  tone(660, .12, "sine", .045, .09);
}
function soundCoin() {
  tone(660, .08, "triangle", .055);
  tone(990, .14, "triangle", .05, .09);
}
function soundBig() {
  [523, 659, 784, 1047].forEach((f,i)=>tone(f,.16,"triangle",.06,i*.09));
}
function soundLose() {
  tone(440, .15, "sawtooth", .045);
  tone(330, .17, "sawtooth", .04, .12);
  tone(220, .22, "sawtooth", .035, .24);
}
function soundSafe() {
  tone(392, .10, "sine", .04);
  tone(494, .16, "sine", .04, .10);
}
function soundSpecial() {
  tone(330, .09, "square", .035);
  tone(440, .09, "square", .035, .08);
  tone(660, .15, "square", .035, .16);
}
function soundVictory() {
  [523,659,784,1047,1319].forEach((f,i)=>tone(f,.22,"triangle",.055,i*.1));
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - .5);
}

function setupQuestions() {
  state.questions = {};
  Object.keys(questions).forEach(g => state.questions[g] = shuffle(questions[g]));
}

function setupTeams() {
  const count = Number(document.getElementById("teamCount").value);
  state.teams = Array.from({length: count}, (_,i) => ({
    name: `Team ${i+1}`,
    score: 0
  }));
  state.currentTeam = 0;
}

function setupRewards() {
  state.rewards = shuffle(rewardPool).slice(0, 20);
}

function renderTeams() {
  const el = document.getElementById("teams");
  el.innerHTML = "";
  state.teams.forEach((team,i) => {
    const card = document.createElement("div");
    card.className = "team" + (i === state.currentTeam ? " active" : "");
    card.innerHTML = `
      <div class="team-top">
        <div class="team-name">${team.name}</div>
        <div class="team-score">${team.score}</div>
      </div>
      <div class="team-hint">${i === state.currentTeam ? "CURRENT TEAM — choose a box" : "Click to make this team active"}</div>
    `;
    card.addEventListener("click", () => {
      state.currentTeam = i;
      renderTeams();
      soundSafe();
    });
    el.appendChild(card);
  });
}

function renderBoxes() {
  const grid = document.getElementById("boxGrid");
  grid.innerHTML = "";
  for (let i=0; i<20; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mystery-box" + (state.opened.has(i) ? " opened" : "");
    btn.disabled = state.opened.has(i);
    btn.innerHTML = `
      <div class="box-bow">🎀</div>
      <div class="box-number">${i+1}</div>
    `;
    btn.addEventListener("click", () => openQuestion(i));
    grid.appendChild(btn);
  }
  document.getElementById("boxesLeft").textContent = 20 - state.opened.size;
  document.getElementById("turnNumber").textContent = state.turn;
}

function getQuestion() {
  const grade = document.getElementById("gradeSelect").value;
  if (!state.questions[grade] || state.questions[grade].length === 0) {
    state.questions[grade] = shuffle(questions[grade]);
  }
  return state.questions[grade].pop();
}

function openQuestion(boxIndex) {
  if (state.opened.has(boxIndex)) return;
  state.pendingBox = boxIndex;
  soundBox();
  const [question, answer] = getQuestion();
  showModal(`
    <div class="modal-kicker">Team ${state.currentTeam+1} • Mystery Box ${boxIndex+1}</div>
    <div class="question">${question}</div>
    <div id="answerBox" class="answer-box hidden"><strong>Suggested answer:</strong><br>${answer}</div>
    <button id="showAnswerBtn" class="reveal-btn" type="button">Show Suggested Answer</button>
    <br>
    <button id="revealRewardBtn" class="next-btn" type="button">🎁 Reveal Mystery Reward</button>
  `);
  soundQuestion();

  document.getElementById("showAnswerBtn").addEventListener("click", (e) => {
    document.getElementById("answerBox").classList.remove("hidden");
    e.currentTarget.textContent = "Answer Shown ✓";
    e.currentTarget.disabled = true;
    e.currentTarget.style.opacity = ".65";
    soundSafe();
  });
  document.getElementById("revealRewardBtn").addEventListener("click", revealReward);
}

function revealReward() {
  const index = state.pendingBox;
  const reward = state.rewards[index];
  state.opened.add(index);

  if (reward.special === "swap") {
    doSwap();
  } else if (reward.special === "steal") {
    doSteal();
  } else {
    state.teams[state.currentTeam].score += reward.points;
  }

  playRewardSound(reward.sound);

  showModal(`
    <div class="reward">
      <div class="modal-kicker">Mystery Box ${index+1} Revealed!</div>
      <div class="reward-icon">${reward.icon}</div>
      <div class="reward-title">${reward.title}</div>
      <div class="reward-detail">${reward.detail}</div>
      <button id="continueBtn" class="next-btn" type="button">Continue →</button>
    </div>
  `);

  document.getElementById("continueBtn").addEventListener("click", () => {
    state.turn++;
    state.currentTeam = (state.currentTeam + 1) % state.teams.length;
    closeModal();
    renderAll();

    if (state.opened.size === 20) {
      setTimeout(() => {
        soundVictory();
        showModal(`
          <div class="reward">
            <div class="reward-icon">🏆</div>
            <div class="modal-kicker">Round Complete!</div>
            <div class="reward-title">Great Job!</div>
            <div class="reward-detail">Check the scoreboard to see the final scores.</div>
            <button id="finishBtn" class="next-btn" type="button">Close</button>
          </div>
        `);
        document.getElementById("finishBtn").addEventListener("click", closeModal);
      }, 250);
    }
  });
}

function doSwap() {
  if (state.teams.length < 2) {
    state.teams[state.currentTeam].score += 5;
    return;
  }
  let other = (state.currentTeam + 1) % state.teams.length;
  const temp = state.teams[state.currentTeam].score;
  state.teams[state.currentTeam].score = state.teams[other].score;
  state.teams[other].score = temp;
}

function doSteal() {
  if (state.teams.length < 2) {
    state.teams[state.currentTeam].score += 5;
    return;
  }
  const other = (state.currentTeam + 1) % state.teams.length;
  const stolen = Math.min(10, Math.max(0, state.teams[other].score));
  state.teams[other].score -= stolen;
  state.teams[state.currentTeam].score += stolen;
}

function playRewardSound(type) {
  if (type === "coin") soundCoin();
  else if (type === "big") soundBig();
  else if (type === "lose") soundLose();
  else if (type === "special") soundSpecial();
  else soundSafe();
}

function showModal(html) {
  const modal = document.getElementById("modal");
  document.getElementById("modalContent").innerHTML = html;
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  state.pendingBox = null;
}

function newGame() {
  setupQuestions();
  setupTeams();
  setupRewards();
  state.opened.clear();
  state.turn = 1;
  state.pendingBox = null;
  closeModal();
  renderAll();
}

function renderAll() {
  renderTeams();
  renderBoxes();
}

document.getElementById("resetBtn").addEventListener("click", newGame);
document.getElementById("newRoundBtn").addEventListener("click", newGame);
document.getElementById("closeModal").addEventListener("click", closeModal);
document.querySelector(".modal-backdrop").addEventListener("click", closeModal);

document.getElementById("soundBtn").addEventListener("click", () => {
  state.sound = !state.sound;
  document.getElementById("soundBtn").textContent = state.sound ? "🔊 Sound On" : "🔇 Sound Off";
  if (state.sound) soundSafe();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});

newGame();
