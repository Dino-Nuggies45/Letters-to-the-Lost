let currentScene = "intro";
let stats = { hope: 0, regret: 0, obsession: 0 };
let playerName = "";
let currentDay = 1;
let transitioning = false;
let dayOverlayShown = false;

const history = document.getElementById("messageHistory");
const inputSection = document.getElementById("inputSection");
const dayOverlay = document.createElement("div");
dayOverlay.id = "dayOverlay";
dayOverlay.className = "overlay hidden";
document.body.appendChild(dayOverlay);

const savedData = JSON.parse(localStorage.getItem("lettersSave"));
if (savedData) {
  currentScene = savedData.currentScene;
  stats = savedData.stats;
  playerName = savedData.playerName;
  currentDay = savedData.currentDay || 1;
}

function showDayScreen() {
  transitioning = true;
  dayOverlay.textContent = `Day ${currentDay}`;
  dayOverlay.classList.remove("hidden");
  const btn = document.createElement("button");
  btn.textContent = "Continue";
  btn.onclick = () => {
    transitioning = false;
    dayOverlay.classList.add("hidden");
    renderScene();
  };
  dayOverlay.appendChild(btn);
}

function openApp(app) {
  document.getElementById("desktop").classList.add("hidden");
  document.getElementById("lettersApp").classList.remove("hidden");

  if (!playerName) {
    showNamePrompt();
  } else {
    showDayScreen();
  }
}

function closeApp(app) {
  document.getElementById("lettersApp").classList.add("hidden");
  document.getElementById("desktop").classList.remove("hidden");
  history.innerHTML = "";
}

function saveGame() {
  localStorage.setItem("lettersSave", JSON.stringify({
    currentScene,
    stats,
    playerName,
    currentDay
  }));
}

function showNamePrompt() {
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
    showDayScreen();
  };
  inputSection.appendChild(input);
  inputSection.appendChild(button);
}

function showDayOverlay() {
  const overlay = document.getElementById("dayOverlay");
  document.getElementById("dayText").innerText = `Day ${currentDay}`;
  overlay.classList.remove("hidden");
  dayOverlayShown = true;
}

function continueToNextDay() {
  document.getElementById("dayOverlay").classList.add("hidden");
  renderScene();
}

function renderScene() {
  const scene = scenes[currentScene];
  if (currentDay > 1 && !dayOverlayShown) {
    showDayOverlay();
    return;
  }

  dayOverlayShown = false; 

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
      showDayScreen();
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
      showDayScreen();
    };
    inputSection.appendChild(btn);
  });
}

if (!playerName) {
  showNamePrompt();
} else {
  showDayScreen();
}
