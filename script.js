let currentScene = "intro";
let stats = { hope: 0, regret: 0, obsession: 0 };
let playerName = "";
let currentDay = 1;
let transitioning = false;
let dayOverlayShown = false;

const history = document.getElementById("messageHistory");
const inputSection = document.getElementById("inputSection");
const dayOverlay = document.getElementById("dayOverlay");
const dayText = document.getElementById("dayText");

// --- SCENES GO HERE ---
const scenes = {
  intro: {
    text: "Welcome to the story. Your first message here...",
    choices: [{ text: "Begin", next: "scene_1", stat: "hope" }]
  },
  scene_1: {
    text: "This is scene 1 text. What will you do?",
    choices: [{ text: "Next day", next: "scene_2", stat: "regret" }]
  },
  scene_2: {
    text: "This is scene 2 text. Keep going.",
    choices: [{ text: "Continue", next: "scene_3", stat: "obsession" }]
  },
  scene_3: {
    text: "You've made it to day 3. The mystery deepens...",
    choices: []
  }
};

// --- LOAD SAVE ---
const savedData = JSON.parse(localStorage.getItem("lettersSave"));
if (savedData) {
  currentScene = savedData.currentScene || "intro";
  stats = savedData.stats || { hope: 0, regret: 0, obsession: 0 };
  playerName = savedData.playerName || "";
  currentDay = savedData.currentDay || 1;
}

// --- EVENT: Overlay Continue Button ---
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("continueBtn");
  if (btn) {
    btn.addEventListener("click", () => {
      dayOverlay.style.display = "none";  // hide overlay directly
      dayOverlayShown = false;
      transitioning = false;
      renderScene();
    });
  } else {
    console.error("⚠️ continueBtn not found in DOM");
  }

  if (!playerName) {
    showNamePrompt();
  } else if (currentDay === 1) {
    renderScene();
  } else {
    showDayOverlay();
  }
});

// --- APP OPEN ---
function openApp(app) {
  document.getElementById("desktop").classList.add("hidden");

  if (app === "letters") {
    document.getElementById("lettersApp").classList.remove("hidden");
    if (!playerName) {
      showNamePrompt();
    } else if (currentDay === 1) {
      renderScene();
    } else {
      showDayOverlay();
    }
  }

  if (app === "dice") {
    document.getElementById("diceApp").classList.remove("hidden");
    startDiceGame?.();
  }
}

// --- APP CLOSE ---
function closeApp(app) {
  if (app === "letters") {
    document.getElementById("lettersApp").classList.add("hidden");
    history.innerHTML = "";
  }
  if (app === "dice") {
    document.getElementById("diceApp").classList.add("hidden");
  }
  document.getElementById("desktop").classList.remove("hidden");
}

// --- SAVE GAME ---
function saveGame() {
  localStorage.setItem("lettersSave", JSON.stringify({
    currentScene,
    stats,
    playerName,
    currentDay
  }));
}

// --- NAME PROMPT ---
function showNamePrompt() {
  history.innerHTML = "";
  inputSection.innerHTML = "";

  const input = document.createElement("input");
  input.placeholder = "What's your name?";

  const button = document.createElement("button");
  button.textContent = "Begin";
  button.onclick = () => {
    const val = input.value.trim();
    if (!val) return alert("Enter a name!");
    playerName = val;
    saveGame();
    showDayOverlay();
  };

  inputSection.appendChild(input);
  inputSection.appendChild(button);
}

// --- SHOW DAY OVERLAY ---

function showDayOverlay() {
  dayText.innerText = `Day ${currentDay}`;
  dayOverlay.classList.remove("hidden");  // Show overlay
  dayOverlayShown = true;
  transitioning = true;
}

// Add event listener after DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("continueBtn");
  btn.addEventListener("click", () => {
    dayOverlay.classList.add("hidden");   // Hide overlay by adding .hidden class
    dayOverlayShown = false;
    transitioning = false;
    renderScene();
  });
// --- SCENE RENDER ---
function renderScene() {
  if (transitioning) return;

  console.log("renderScene called", currentScene, currentDay);

  if (currentDay > 1 && !dayOverlayShown) {
    showDayOverlay();
    return;
  }

  dayOverlayShown = false;
  history.innerHTML = "";

  const scene = scenes[currentScene];
  if (!scene) {
    history.innerHTML = "<p>Scene not found!</p>";
    inputSection.innerHTML = "";
    return;
  }

  const ghostMessage = document.createElement("div");
  ghostMessage.className = "dm-message ghost typing";
  ghostMessage.textContent = "";
  history.appendChild(ghostMessage);
  inputSection.innerHTML = "";

  const fullText = typeof scene.text === "function" ? scene.text() : scene.text;

  let i = 0;
  const speed = 25;
  function typeWriter() {
    if (i < fullText.length) {
      ghostMessage.textContent += fullText.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    } else {
      ghostMessage.classList.remove("typing");
      showChoices(scene.choices);
    }
  }
  typeWriter();

  saveGame();
}

// --- SHOW CHOICES ---
function showChoices(choices) {
  inputSection.innerHTML = "";

  if (!choices || choices.length === 0) {
    const btn = document.createElement("button");
    btn.textContent = "Restart";
    btn.onclick = () => {
      currentScene = "intro";
      stats = { hope: 0, regret: 0, obsession: 0 };
      currentDay = 1;
      history.innerHTML = "";
      showDayOverlay();
    };
    inputSection.appendChild(btn);
    return;
  }

  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    btn.onclick = () => {
      const playerMsg = document.createElement("div");
      playerMsg.className = "dm-message player";
      playerMsg.textContent = choice.text;
      history.appendChild(playerMsg);
      history.scrollTop = history.scrollHeight;

      if (choice.stat) stats[choice.stat]++;
      currentScene = choice.next;
      currentDay++;
      saveGame();
      showDayOverlay();
    };
    inputSection.appendChild(btn);
  });
}

// --- START GAME ---
if (!playerName) {
  showNamePrompt();
} else {
  if (currentDay === 1) {
    renderScene();
  } else {
    showDayOverlay();
  }
}