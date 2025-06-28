let currentScene = "intro";
let stats = { hope: 0, regret: 0, obsession: 0 };
let playerName = "";

const history = document.getElementById("messageHistory");
const inputSection = document.getElementById("inputSection");

const savedData = JSON.parse(localStorage.getItem("lettersSave"));
if (savedData) {
  currentScene = savedData.currentScene;
  stats = savedData.stats;
  playerName = savedData.playerName;
}

function openApp(app) {
  document.getElementById("desktop").classList.add("hidden");
  document.getElementById("lettersApp").classList.remove("hidden");

  if (!playerName) {
    showNamePrompt();
  } else {
    renderScene();
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
    playerName
  }));
}

const scenes = {
  intro: {
    text: () => `Dear ${playerName},\nI never thought you'd write back. Why now?`,
    choices: [
      { text: "I miss you. I need answers.", next: "needAnswers", stat: "obsession" },
      { text: "I just want closure.", next: "closure", stat: "regret" }
    ]
  },
  needAnswers: {
    text: () => "Answers? To what happened? You never used to ask questions like that.",
    choices: [
      { text: "People change. I need to know the truth.", next: "truthReveal", stat: "hope" }
    ]
  },
  closure: {
    text: () => "Closure doesn't come from a letter, you know that.",
    choices: [
      { text: "Maybe not. But this is all I have left.", next: "truthReveal", stat: "hope" }
    ]
  },
  truthReveal: {
    text: () => "Then brace yourself. Not everything you remember is real...",
    choices: []
  }
};

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
    renderScene();
  };
  inputSection.appendChild(input);
  inputSection.appendChild(button);
}

function renderScene() {
  const scene = scenes[currentScene];
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
      history.innerHTML = "";
      renderScene();
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
      renderScene();
    };
    inputSection.appendChild(btn);
  });
}
if (!playerName) {
    askName();
} else {
renderScene();
}

function saveGame() {
    localStorage.setItem("lettersSave", JSON.stringify({
        currentScene,
        stats,
        playerName
    }));
}