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
    ],

  },

  closure_start: { text: () => `You want peace. You write and send a series of heartfelt letters.`, choices: [
    { text: "Write a final goodbye", next: "closure_1" },
    { text: "Ask how he died", next: "closure_2" },
    { text: "Let silence settle", next: "closure_3" },
    { text: "Talk to others receiving messages", next: "closure_4" }
  ]},
  closure_1: { text: () => `You write: 'I hope you're at peace. I'm learning to let go.'\n\nLiam replies: 'I always wanted you to find happiness—even without me.'`, choices: [
    { text: "Tell him you’re ready to move on", next: "closure_5" },
    { text: "Say you’re not ready yet", next: "closure_6" }
  ]},
  closure_2: { text: () => `You ask about his death.\n\nLiam: 'It wasn't just an accident. There were secrets in the car that night.'`, choices: [
    { text: "Press him for the truth", next: "closure_7" },
    { text: "Let it rest", next: "closure_5" }
  ]},
  closure_3: { text: () => `You stop messaging. The silence grows louder than words. After a day, he sends: 'Still here.'`, choices: [
    { text: "Break the silence", next: "closure_6" },
    { text: "Embrace it", next: "ending_13" }
  ]},
  closure_4: { text: () => `You find a message board. Others see their own 'Liams'. You're not alone.\n\nOne user: 'It's like they’re trying to reach us together.'`, choices: [
    { text: "Ask about a pattern", next: "closure_8" },
    { text: "Coordinate a meetup", next: "closure_9" }
  ]},
  closure_5: { text: () => `You write: 'Thank you. I’m going to live for both of us now.'\n\nThe app closes itself. A weight lifts.`, choices: [
    { text: "Restart anyway", next: "intro" },
    { text: "Let it end here", next: "ending_11" }
  ]},
  closure_6: { text: () => `Liam replies: 'Then don’t. Just stay here with me a little longer.'`, choices: [
    { text: "Agree", next: "closure_10" },
    { text: "Push yourself to let go", next: "closure_5" }
  ]},
  closure_7: { text: () => `Liam: 'I wasn’t supposed to be in that car. Someone switched seats. They never found the truth.'`, choices: [
    { text: "Investigate what really happened", next: "closure_11" },
    { text: "Try to forgive", next: "closure_5" }
  ]},
  closure_8: { text: () => `You discover a strange pattern—all 'Liams' respond at exactly 3:33 AM.`, choices: [
    { text: "Message him at that time", next: "closure_12" },
    { text: "Wait to see what happens", next: "closure_13" }
  ]},
  closure_9: { text: () => `You meet others in person. Strangely, everyone claims they were best friends with Liam.`, choices: [
    { text: "Demand answers", next: "closure_14" },
    { text: "Check if they're lying", next: "closure_15" }
  ]},
  closure_10: { text: () => `Days pass. You stay stuck in endless conversations. Nothing new is ever said.`, choices: [
    { text: "Break the loop", next: "ending_18" },
    { text: "Accept the loop", next: "ending_20" }
  ]},
  closure_11: { text: () => `You uncover a forgotten crash report. It shows you weren’t the passenger—you were the one who died.`, choices: [
    { text: "Try to wake up", next: "ending_16" },
    { text: "Help others like you", next: "ending_17" }
  ]},
  closure_12: { text: () => `You send a message at 3:33 AM. The response: 'The veil opens. Do you see now?'`, choices: [
    { text: "Follow the vision", next: "ending_14" },
    { text: "Shut it off", next: "ending_19" }
  ]},
  closure_13: { text: () => `3:33 passes. You hear a knock at the door. But no one’s there.\n\nYour phone buzzes: 'I was close.'`, choices: [
    { text: "Invite him in", next: "ending_18" },
    { text: "Lock everything", next: "ending_19" }
  ]},
  closure_14: { text: () => `They all recite the same phrase: 'We are fragments.'\n\nYou realize—Liam's soul is scattered across people.`, choices: [
    { text: "Reunite the fragments", next: "ending_15" },
    { text: "Refuse to join them", next: "ending_13" }
  ]},
  closure_15: { text: () => `One girl smiles: 'None of us are lying. We’re what’s left of him.'`, choices: [
    { text: "Join them", next: "ending_15" },
    { text: "Run", next: "ending_19" }
  ]},
};

scenes["ending_1"] = {
  text: () => "ENDING 1 — You deleted the app. The silence remains. Was that the real goodbye?",
  choices: []
};
scenes["ending_2"] = {
  text: () => "ENDING 2 — You believed too easily. The thing wearing Liam's voice now wears your face.",
  choices: []
};
scenes["ending_3"] = {
  text: () => "ENDING 3 — You stayed with the shadow. It learns to imitate you next.",
  choices: []
};
scenes["ending_4"] = {
  text: () => "ENDING 4 — A glitch traps you both. Half of Liam. Half of you. Forever echoing.",
  choices: []
};
scenes["ending_5"] = {
  text: () => "ENDING 5 — Liam returns... but not as he was. He forgets your name every day.",
  choices: []
};
scenes["ending_6"] = {
  text: () => "ENDING 6 — You returned Liam to the world, but lost your voice in exchange. No one believes you.",
  choices: []
};
scenes["ending_7"] = {
  text: () => "ENDING 7 — You said goodbye. The app fades. The air grows warmer. You feel light again.",
  choices: []
};
scenes["ending_8"] = {
  text: () => "ENDING 8 — You trap the copy. But it whispers through machines. Always watching.",
  choices: []
};
scenes["ending_9"] = {
  text: () => "ENDING 9 — You kept yourself. But Liam haunts mirrors now, silent and staring.",
  choices: []
};
scenes["ending_10"] = {
  text: () => "ENDING 10 — You gave yourself up. Liam lives again. But you're erased from every photo.",
  choices: []
};
scenes["ending_11"] = {
  text: () => "ENDING 11 — You let the story end. The app never opens again. Peace is earned.",
  choices: []
};
scenes["ending_12"] = {
  text: () => "ENDING 12 — You let someone else use the app. They vanish a week later.",
  choices: []
};
scenes["ending_13"] = {
  text: () => "ENDING 13 — You chose silence. He never returned. But you lived.",
  choices: []
};
scenes["ending_14"] = {
  text: () => "ENDING 14 — The veil showed the truth: he was never real. Just grief wearing a mask.",
  choices: []
};
scenes["ending_15"] = {
  text: () => "ENDING 15 — You gathered every fragment. Liam’s smile flickers, then fades. He was whole, but wrong.",
  choices: []
};
scenes["ending_16"] = {
  text: () => "ENDING 16 — You wake up in a hospital. No phone. No app. But Liam is beside you. Breathing.",
  choices: []
};
scenes["ending_17"] = {
  text: () => "ENDING 17 — You help others find their truth. The network grows. So does the Watcher.",
  choices: []
};
scenes["ending_18"] = {
  text: () => "ENDING 18 — You stayed too long. You forgot you were alive.",
  choices: []
};
scenes["ending_19"] = {
  text: () => "ENDING 19 — You shut every door. The knocking never stops. But it never enters.",
  choices: []
};
scenes["ending_20"] = {
  text: () => "ENDING 20 — You live in the loop. He replies. You reply. Forever.",
  choices: []
};
scenes["ending_21"] = {
  text: () => "ENDING 21 — You embraced the dark. Liam smiles through your eyes.",
  choices: []
};
scenes["ending_22"] = {
  text: () => "ENDING 22 — It pulls you through the screen. Now you answer the next user.",
  choices: []
};
scenes["ending_23"] = {
  text: () => "ENDING 23 — The mirror takes you. Your name fades from memory.",
  choices: []
};
scenes["ending_24"] = {
  text: () => "ENDING 24 — You dissolve peacefully. No body. No soul. Just digital dust.",
  choices: []
};
scenes["ending_25"] = {
  text: () => "ENDING 25 — The static consumes everything. You forget your own voice.",
  choices: []
};
scenes["ending_26"] = {
  text: () => "ENDING 26 — The mirror cracks. Something escapes.",
  choices: []
};
scenes["ending_27"] = {
  text: () => "ENDING 27 — You begged. He forgave you. But you never forgave yourself.",
  choices: []
};
scenes["ending_28"] = {
  text: () => "ENDING 28 — You fight for control. You win… but something inside you watches.",
  choices: []
};
scenes["ending_29"] = {
  text: () => "ENDING 29 — You reject him. The app deletes itself. He never returns.",
  choices: []
};
scenes["ending_30"] = {
  text: () => "ENDING 30 — You merge completely. You are now the one who replies to the next sender.",
  choices: []
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

if (!playerName) {
  showNamePrompt();
} else {
  renderScene();
}