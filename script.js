/* =====================================
   KOREKIT MYSTERY BOX GAME
   ===================================== */


/* =====================================
   GAME SETTINGS
   ===================================== */

const TOTAL_BOXES = 20;

const TOTAL_TEAMS = 4;


/* =====================================
   MYSTERY BOX CONTENT

   Change these values to customize
   the game.
   ===================================== */

const boxContents = [

  {
    type: "points",
    value: 100,
    icon: "⭐",
    title: "+100 Points",
    text: "Your team gets 100 points!"
  },

  {
    type: "points",
    value: 200,
    icon: "⭐",
    title: "+200 Points",
    text: "Your team gets 200 points!"
  },

  {
    type: "points",
    value: 300,
    icon: "⭐",
    title: "+300 Points",
    text: "Your team gets 300 points!"
  },

  {
    type: "points",
    value: 500,
    icon: "🌟",
    title: "+500 Points",
    text: "Amazing! Your team gets 500 points!"
  },

  {
    type: "points",
    value: 100,
    icon: "⭐",
    title: "+100 Points",
    text: "Your team gets 100 points!"
  },

  {
    type: "points",
    value: 200,
    icon: "⭐",
    title: "+200 Points",
    text: "Your team gets 200 points!"
  },

  {
    type: "points",
    value: 300,
    icon: "⭐",
    title: "+300 Points",
    text: "Your team gets 300 points!"
  },

  {
    type: "points",
    value: 400,
    icon: "🌟",
    title: "+400 Points",
    text: "Your team gets 400 points!"
  },

  {
    type: "points",
    value: 100,
    icon: "⭐",
    title: "+100 Points",
    text: "Your team gets 100 points!"
  },

  {
    type: "points",
    value: 200,
    icon: "⭐",
    title: "+200 Points",
    text: "Your team gets 200 points!"
  },


  /* NEGATIVE */

  {
    type: "points",
    value: -100,
    icon: "💥",
    title: "-100 Points",
    text: "Oh no! Your team loses 100 points!"
  },

  {
    type: "points",
    value: -200,
    icon: "💥",
    title: "-200 Points",
    text: "Oh no! Your team loses 200 points!"
  },

  {
    type: "points",
    value: -300,
    icon: "💥",
    title: "-300 Points",
    text: "Your team loses 300 points!"
  },


  /* SPECIAL BOXES */

  {
    type: "double",
    icon: "⚡",
    title: "DOUBLE!",
    text: "Your team's current score is doubled!"
  },

  {
    type: "bonus",
    value: 500,
    icon: "💎",
    title: "BONUS!",
    text: "Your team gets an extra 500 points!"
  },

  {
    type: "steal",
    icon: "🦹",
    title: "STEAL!",
    text: "Steal 200 points from another team!"
  },

  {
    type: "swap",
    icon: "🔄",
    title: "SWAP!",
    text: "Swap scores with another team!"
  },

  {
    type: "lose",
    icon: "☠️",
    title: "LOSE EVERYTHING!",
    text: "Your team loses all of its points!"
  },

  {
    type: "points",
    value: 500,
    icon: "🌟",
    title: "+500 Points",
    text: "Amazing! Your team gets 500 points!"
  },

  {
    type: "points",
    value: 300,
    icon: "⭐",
    title: "+300 Points",
    text: "Your team gets 300 points!"
  }

];


/* =====================================
   GAME VARIABLES
   ===================================== */

let scores = [0, 0, 0, 0];

let currentTeam = 0;

let openedBoxes = [];

let currentBox = null;


/* =====================================
   HTML ELEMENTS
   ===================================== */

const boxGrid =
  document.getElementById("boxGrid");

const currentTeamElement =
  document.getElementById("currentTeam");

const boxesLeftElement =
  document.getElementById("boxesLeft");

const resultArea =
  document.getElementById("resultArea");

const resultIcon =
  document.getElementById("resultIcon");

const resultTitle =
  document.getElementById("resultTitle");

const resultText =
  document.getElementById("resultText");

const continueBtn =
  document.getElementById("continueBtn");

const nextTeamBtn =
  document.getElementById("nextTeamBtn");

const newGameBtn =
  document.getElementById("newGameBtn");


/* =====================================
   CREATE GAME
   ===================================== */

function createGame() {

  scores = [0, 0, 0, 0];

  currentTeam = 0;

  openedBoxes = [];

  currentBox = null;

  resultArea.classList.add("hidden");

  createBoxes();

  updateScoreboard();

}


/* =====================================
   CREATE BOXES
   ===================================== */

function createBoxes() {

  boxGrid.innerHTML = "";

  /*
    Shuffle the box contents so the
    teacher doesn't know where prizes are.
  */

  const shuffledContents =
    [...boxContents]
      .sort(() => Math.random() - 0.5);


  for (
    let i = 0;
    i < TOTAL_BOXES;
    i++
  ) {

    const box =
      document.createElement("button");

    box.className =
      "mystery-box";

    box.dataset.index = i;


    box.innerHTML = `

      <span class="box-number">
        ${i + 1}
      </span>

      <span class="box-icon">
        🎁
      </span>

      <span class="box-word">
        MYSTERY
      </span>

    `;


    box.addEventListener(
      "click",
      () => openBox(
        box,
        shuffledContents[i],
        i
      )
    );


    boxGrid.appendChild(box);

  }

}


/* =====================================
   OPEN BOX
   ===================================== */

function openBox(
  box,
  content,
  index
) {

  /*
    Prevent a box from being opened
    twice.
  */

  if (
    openedBoxes.includes(index)
  ) {
    return;
  }


  openedBoxes.push(index);

  currentBox = index;


  box.classList.add("opened");

  box.innerHTML = `

    <span class="box-icon">
      ${content.icon}
    </span>

    <span class="box-word">
      OPENED
    </span>

  `;


  /*
    Apply the result.
  */

  applyResult(content);


  /*
    Show result.
  */

  showResult(content);

}


/* =====================================
   APPLY RESULT
   ===================================== */

function applyResult(content) {

  const team =
    currentTeam;


  /* NORMAL POINTS */

  if (
    content.type === "points"
  ) {

    scores[team] += content.value;

  }


  /* BONUS */

  else if (
    content.type === "bonus"
  ) {

    scores[team] += content.value;

  }


  /* DOUBLE */

  else if (
    content.type === "double"
  ) {

    scores[team] =
      scores[team] * 2;

  }


  /* LOSE EVERYTHING */

  else if (
    content.type === "lose"
  ) {

    scores[team] = 0;

  }


  /* STEAL */

  else if (
    content.type === "steal"
  ) {

    /*
      Find the team with the highest
      score other than the current team.
    */

    let targetTeam = -1;

    let highestScore = 0;


    for (
      let i = 0;
      i < TOTAL_TEAMS;
      i++
    ) {

      if (
        i !== team &&
        scores[i] > highestScore
      ) {

        highestScore =
          scores[i];

        targetTeam = i;

      }

    }


    if (targetTeam !== -1) {

      const amount =
        Math.min(
          200,
          scores[targetTeam]
        );

      scores[targetTeam] -= amount;

      scores[team] += amount;

    }

  }


  /* SWAP */

  else if (
    content.type === "swap"
  ) {

    /*
      Swap with the team having
      the highest score.
    */

    let targetTeam = -1;

    let highestScore =
      scores[team];


    for (
      let i = 0;
      i < TOTAL_TEAMS;
      i++
    ) {

      if (
        i !== team &&
        scores[i] > highestScore
      ) {

        highestScore =
          scores[i];

        targetTeam = i;

      }

    }


    if (targetTeam !== -1) {

      const temporary =
        scores[team];

      scores[team] =
        scores[targetTeam];

      scores[targetTeam] =
        temporary;

    }

  }


  updateScoreboard();

}


/* =====================================
   SHOW RESULT
   ===================================== */

function showResult(content) {

  resultIcon.textContent =
    content.icon;

  resultTitle.textContent =
    content.title;

  resultText.textContent =
    content.text;


  resultArea.classList.remove(
    "hidden"
  );


  resultArea.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

}


/* =====================================
   UPDATE SCOREBOARD
   ===================================== */

function updateScoreboard() {

  for (
    let i = 0;
    i < TOTAL_TEAMS;
    i++
  ) {

    const scoreElement =
      document.getElementById(
        `score${i + 1}`
      );

    const cardElement =
      document.getElementById(
        `teamCard${i + 1}`
      );


    scoreElement.textContent =
      scores[i];


    cardElement.classList.toggle(
      "active-team",
      i === currentTeam
    );

  }


  currentTeamElement.textContent =
    `Team ${currentTeam + 1}`;


  const remaining =
    TOTAL_BOXES -
    openedBoxes.length;


  boxesLeftElement.textContent =
    remaining;

}


/* =====================================
   NEXT TEAM
   ===================================== */

function nextTeam() {

  currentTeam++;

  if (
    currentTeam >= TOTAL_TEAMS
  ) {

    currentTeam = 0;

  }


  resultArea.classList.add(
    "hidden"
  );


  updateScoreboard();

}


/* =====================================
   CONTINUE
   ===================================== */

continueBtn.addEventListener(
  "click",
  () => {

    resultArea.classList.add(
      "hidden"
    );

    nextTeam();

  }
);


/* =====================================
   NEXT TEAM BUTTON
   ===================================== */

nextTeamBtn.addEventListener(
  "click",
  nextTeam
);


/* =====================================
   NEW GAME
   ===================================== */

newGameBtn.addEventListener(
  "click",
  () => {

    const confirmNewGame =
      confirm(
        "Start a new game? All scores will be reset."
      );


    if (confirmNewGame) {

      createGame();

    }

  }
);


/* =====================================
   START GAME
   ===================================== */

createGame();
