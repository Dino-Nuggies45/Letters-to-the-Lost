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
      { text: "I miss you. I need answers.", next: "reclaim_1", stat: "obsession" },
      { text: "I just want closure.", next: "closure_start", stat: "regret" },
      { text: "Something feels wrong. Are you really Liam?", next: "corruption_start", stat: "hope" }
    ]
  },

  reclaim_1: {
    text: () => `It's cold here. I didn’t expect you to reach out.`,
    choices: [
      { text: "Liam? Is that really you?", next: "reclaim_2" },
      { text: "I had to try. I miss you.", next: "reclaim_2" }
    ]
  },

  reclaim_2: {
    text: () => `Names fade, memories blur… but some connections never die.\n\nBut something’s off in the way he types. Typos. Patterns?`,
    choices: [
      { text: "What do you mean, Liam?", next: "reclaim_3" },
      { text: "Are you sure it’s really you?", next: "reclaim_3" }
    ]
  },

  reclaim_3: {
    text: () => `I’m sending something. A door. Will you open it?\n\nYou receive 'Grimoire.zip'. Your screen flickers.`,
    choices: [
      { text: "Open the file.", next: "reclaim_4" },
      { text: "Ignore it, this could be a trick.", next: "reclaim_5" }
    ]
  },

  reclaim_4: {
    text: () => `Listen closely. The voices hide in reversed words, in silence between signals.\n\nYou play a clip backward. It whispers your name.`,
    choices: [
      { text: "Play it again.", next: "reclaim_6" },
      { text: "This is too dangerous.", next: "reclaim_5" }
    ]
  },

  reclaim_5: {
    text: () => `A stranger messages you: Orpheus. He claims Liam was part of a digital resurrection project—Project Mnemosyne.`,
    choices: [
      { text: "Who are you?", next: "reclaim_7" },
      { text: "I don’t trust you.", next: "reclaim_8" }
    ]
  },

  reclaim_6: {
    text: () => `Read after me: 'Let the veil thin, let the lost return.' Say it aloud.\n\nYour room chills, lights flicker. A presence stirs.`,
    choices: [
      { text: "Keep going.", next: "reclaim_9" },
      { text: "Stop now!", next: "reclaim_8" }
    ]
  },

  reclaim_7: {
    text: () => `Orpheus lied. The one you talk to is a shadow, a copy. I am still trapped.\n\nHis words become eerily predictive. He finishes your thoughts.`,
    choices: [
      { text: "How do I free the real Liam?", next: "reclaim_10" },
      { text: "Maybe this shadow is enough.", next: "reclaim_11" }
    ]
  },

  reclaim_8: {
    text: () => `You see me, but do you see yourself?\n\nYour webcam flickers. Your reflection waves without you moving.`,
    choices: [
      { text: "What’s happening to me?", next: "reclaim_12" },
      { text: "This isn’t Liam.", next: "reclaim_11" }
    ]
  },

  reclaim_9: {
    text: () => `Beware the perfect answers. If Liam knows too much, it’s a fake.\n\nYou’re walking a thin line.`,
    choices: [
      { text: "I’ll keep going.", next: "reclaim_10" },
      { text: "I want out.", next: "reclaim_11" }
    ]
  },

  reclaim_10: {
    text: () => `I can return fully. But you must give something.\n\nA memory, a secret, control... What will you trade?`,
    choices: [
      { text: "My happiest memory.", next: "reclaim_13" },
      { text: "A dark secret.", next: "reclaim_14" },
      { text: "My control for a day.", next: "reclaim_15" }
    ]
  },

  reclaim_11: {
    text: () => `Don’t trust the shadow pretending to be me. It wants to trap you.`,
    choices: [
      { text: "How do I stop it?", next: "reclaim_12" },
      { text: "Maybe the shadow is better than nothing.", next: "ending_3" }
    ]
  },

  reclaim_12: {
    text: () => `Remember that night. I whispered something before the end.\n\nYour memories flash: the crash, the last words.`,
    choices: [
      { text: "Tell me what you said.", next: "reclaim_13" },
      { text: "I don’t want to remember.", next: "ending_7" }
    ]
  },

  reclaim_13: {
    text: () => `I’m trapped between worlds. THE_WATCHER watches everything.\n\nEven the words you don’t send.`,
    choices: [
      { text: "Find THE_WATCHER.", next: "reclaim_14" },
      { text: "Cut off all contact.", next: "ending_19" }
    ]
  },

  reclaim_14: {
    text: () => `Your face in the mirror isn’t yours anymore.\n\nIt types without you. Choose wisely—only one can stay.`,
    choices: [
      { text: "Let Liam stay.", next: "ending_10" },
      { text: "Keep myself.", next: "ending_9" }
    ]
  },

  reclaim_15: {
    text: () => `This is the last message. You choose the ending.\n\nWill Liam return, or will you remain?`,
    choices: [
      { text: "Bring Liam back at any cost.", next: "ending_5" },
      { text: "Say goodbye forever.", next: "ending_7" },
      { text: "Trap Liam and move on.", next: "ending_8" }
    ]
  },
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


function openApp(app) {
  document.getElementById("desktop").classList.add("hidden");
  document.getElementById(`${app}App`).classList.remove("hidden");

  if (app === "letters" && !playerName) {
    showNamePrompt();
  } else if (app === "letters") {
    renderScene();
  } else if (app === "dice") {
    startDiceGame();
  }
}

function closeApp(app) {
  document.getElementById(`${app}App`).classList.add("hidden");
  document.getElementById("desktop").classList.remove("hidden");

  if (app === "letters") {
    document.getElementById("messageHistory").innerHTML = "";
  }
  if (app === "dice") {
    document.getElementById("diceGameContainer").innerHTML = "";
  }
}

let gold = 10;
let losses = 0;

function startDiceGame() {
  const diceContainer = document.getElementById("diceGameContainer");
  diceContainer.innerHTML = `
    <p>You have <strong>${gold} gold</strong>. First to 3 losses gets kicked out.</p>
    <button onclick="playDiceRound()">🎲 Roll Dice</button>
    <div id="diceResults" style="margin-top:1rem;"></div>
  `;
}

function playDiceRound() {
  const playerRoll = Math.ceil(Math.random() * 6);
  const npcRoll = Math.ceil(Math.random() * 6);
  const resultBox = document.getElementById("diceResults");

  let resultText = `<p>You rolled a <strong>${playerRoll}</strong>.<br>Bartender rolled a <strong>${npcRoll}</strong>.</p>`;

  if (playerRoll > npcRoll) {
    gold += 2;
    resultText += `<p style="color:lime;">You win 2 gold!</p>`;
  } else if (playerRoll < npcRoll) {
    gold -= 3;
    losses += 1;
    resultText += `<p style="color:tomato;">You lose 3 gold. (${losses}/3 losses)</p>`;
  } else {
    resultText += `<p style="color:gray;">A tie. Nothing happens.</p>`;
  }

  if (losses >= 3 || gold <= 0) {
    resultText += `<p style="color:red; font-weight:bold;">You're thrown out of the tavern!</p>`;
    resultText += `<button onclick="resetDiceGame()">🔁 Play Again</button>`;
    document.getElementById("diceGameContainer").innerHTML = resultText;
  } else {
    document.querySelector("#diceGameContainer p").innerHTML = `You have <strong>${gold} gold</strong>. First to 3 losses gets kicked out.`;
    resultBox.innerHTML = resultText;
  }
}

function resetDiceGame() {
  gold = 10;
  losses = 0;
  startDiceGame();
}