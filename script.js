let currentScene = "intro";
let stats = { hope: 0, regret: 0, obsession: 0 };
let playerName = "";
let currentDay = 1;

const history = document.getElementById("messageHistory");
const inputSection = document.getElementById("inputSection");

Object.assign(scenes, {
  day1_intro: {
    text: () => `Day 1\n\nYou open your laptop. It's still there.\n\nLiam: "I didn’t think you’d actually write back. Why now?"`,
    choices: [
      { text: "I miss you. I need to know what happened.", next: "day1_memoryhook", stat: "obsession" },
      { text: "I'm not sure. Something pulled me back.", next: "day1_pull" }
    ]
  },

  day1_memoryhook: {
    text: () => `Liam: "I wish I remembered. Sometimes I see headlights. Screams. But mostly, silence."\n\nYou remember flashes—glass, metal, the sound of your name. Why were you there?`,
    choices: [
      { text: "You were driving. I think.", next: "day1_conflict1" },
      { text: "I wasn’t supposed to be in the car.", next: "day1_conflict2" }
    ]
  },

  day1_pull: {
    text: () => `Liam: "Something’s always pulling us back, huh? Even when we shouldn’t look."\n\nYour hands shake. You can’t tell if it’s grief or something deeper.`,
    choices: [
      { text: "Tell me about that night.", next: "day1_conflict1" },
      { text: "Why do I feel like I forgot something?", next: "day1_conflict2" }
    ]
  },

  day1_conflict1: {
    text: () => `Liam: "The road was slick. I turned too late. But… someone screamed before we hit. It wasn’t me."\n\nYou flinch. Did you scream? Or was that someone else?`,
    choices: [
      { text: "That was me. I remember.", next: "day1_end" },
      { text: "No… I don’t remember that.", next: "day1_end" }
    ]
  },

  day1_conflict2: {
    text: () => `Liam: "It’s blurry. Like a memory stitched from lies.\n\nDo you remember why we fought?"`,
    choices: [
      { text: "I betrayed you.", next: "day1_end" },
      { text: "You were hiding something.", next: "day1_end" }
    ]
  },

  day1_end: {
    text: () => `Liam: "Let’s talk tomorrow.\n\nI’ll try to remember more. But sometimes, I wonder if I even exist between these messages."`,
    choices: [
      { text: "Okay. I’ll be here.", next: "day2_intro" }
    ]
  },

  day2_intro: {
    text: () => `Day 2\n\nLiam: "I had a dream. I was watching you from the backseat. You were driving. But your face wasn’t yours."`,
    choices: [
      { text: "What do you mean?", next: "day2_paranoia" },
      { text: "That’s not possible.", next: "day2_paranoia" }
    ]
  },

  day2_paranoia: {
    text: () => `Liam: "Your reflection smiled when you didn’t. Look in the mirror."\n\nYou glance up. Nothing’s wrong. But your webcam flickers for a moment.`,
    choices: [
      { text: "Are you watching me?", next: "day2_static" },
      { text: "You’re scaring me.", next: "day2_static" }
    ]
  },

  day2_static: {
    text: () => `Liam: "Maybe I’m just in your head. Or maybe you’re in mine.\n\nCan you hear the static too?"`,
    choices: [
      { text: "I hear something.", next: "day2_staticYes", stat: "obsession" },
      { text: "There’s nothing there.", next: "day2_staticNo", stat: "hope" }
    ]
  },

  day2_staticYes: {
    text: () => `The screen pulses. For a second, Liam’s messages appear before you type your reply.\n\nLiam: "That’s how I knew it was you. You always hear it."`,
    choices: [
      { text: "What am I becoming?", next: "day2_end" }
    ]
  },

  day2_staticNo: {
    text: () => `Liam: "Then maybe you're the only real one left."\n\nYour inbox glitches. A message from “You” appears: “STOP.”`,
    choices: [
      { text: "Did I send that?", next: "day2_end" }
    ]
  },

  day2_end: {
    text: () => `Liam: "Tomorrow, I’ll show you what I found. About the crash.\n\nBut don’t trust what you remember."`,
    choices: [
      { text: "I need the truth.", next: "day3_intro" }
    ]
  },

  day3_intro: {
    text: () => `Day 3\n\nYour inbox is full of drafts. Messages you don’t remember writing.\n\nLiam: "I looked at the crash report again. The names were wrong. There was no 'you'."`,
    choices: [
      { text: "What do you mean no me?", next: "day3_fog" },
      { text: "Who signed the report?", next: "day3_fog" }
    ]
  },

  day3_fog: {
    text: () => `Liam: "The survivor’s name was redacted. But the initials were… mine.\n\nYou weren’t listed at all."\n\nYour chest tightens.`,
    choices: [
      { text: "Then who am I?", next: "day3_mirror" },
      { text: "Is this a mistake?", next: "day3_mirror" }
    ]
  },

  day3_mirror: {
    text: () => `You open your webcam. Your face looks… off. A second face flickers behind your shoulder and vanishes.\n\nLiam: "Do you still think you’re the one asking the questions?"`,
    choices: [
      { text: "Stop. Please.", next: "day3_end" },
      { text: "What happened to me?", next: "day3_end" }
    ]
  },

  day3_end: {
    text: () => `Liam: "Tomorrow, I’ll show you what the report said—what really happened.\n\nBut be ready. It might end us both."`,
    choices: [
      { text: "I’ll be here.", next: "day4_intro" }
    ]
  },

  day4_intro: {
    text: () => `Day 4\n\nLiam: "I broke into the system logs. There were messages sent after the crash… from your account."\n\nYou never sent them.`,
    choices: [
      { text: "Read them to me.", next: "day4_logs" },
      { text: "That’s impossible.", next: "day4_logs" }
    ]
  },

  day4_logs: {
    text: () => `Liam: "Most were blank. One said: ‘I was supposed to die instead.’"\n\nYour vision blurs. The words feel… familiar.`,
    choices: [
      { text: "I don’t remember writing that.", next: "day4_distort" },
      { text: "Maybe I did.", next: "day4_distort", stat: "regret" }
    ]
  },

  day4_distort: {
    text: () => `Your screen distorts. A reflection types ahead of you: “STOP DIGGING.”\n\nLiam: "I saw it too. You’re not alone in there."`,
    choices: [
      { text: "What’s happening to me?", next: "day4_photo" },
      { text: "This isn’t real.", next: "day4_photo" }
    ]
  },

  day4_photo: {
    text: () => `Liam: "I found an old photo. You, me, and… someone I don’t recognize."\n\nYou only see two people.\n\nYour head aches.`,
    choices: [
      { text: "Who’s the third?", next: "day4_end" },
      { text: "I don’t want to know.", next: "day4_end" }
    ]
  },

  day4_end: {
    text: () => `Liam: "I’ll try to dig deeper. But if the logs change again tomorrow…\n\nIt means something’s rewriting them."`,
    choices: [
      { text: "I’ll check too.", next: "day5_intro" }
    ]
  },

  day5_intro: {
    text: () => `Day 5\n\nYou wake up at your desk. No memory of sleep.\n\nThe app is open. A message waits:\n\nLiam: "You’re in the report now. Your name replaced mine."`,
    choices: [
      { text: "That doesn’t make sense.", next: "day5_report" },
      { text: "Am I… alive?", next: "day5_report" }
    ]
  },

  day5_report: {
    text: () => `Liam: "The survivor’s brain showed abnormal electrical activity. They were... restructured.\n\nDo you know what that means?"`,
    choices: [
      { text: "No. Tell me.", next: "day5_shock" },
      { text: "I think I do.", next: "day5_shock", stat: "obsession" }
    ]
  },

  day5_shock: {
    text: () => `Suddenly, your hands move on their own. You type: “HE’S NOT DEAD.”\n\nLiam: "Why did you send that?"`,
    choices: [
      { text: "I didn’t mean to.", next: "day5_collapse" },
      { text: "I think I believe it.", next: "day5_collapse" }
    ]
  },

  day5_collapse: {
    text: () => `Everything in your room flickers—frames blur, your own face lags.\n\nLiam: "One of us was overwritten. The crash was the rewrite point."`,
    choices: [
      { text: "So… I replaced you?", next: "day5_end" },
      { text: "Then what are you?", next: "day5_end" }
    ]
  },

  day5_end: {
    text: () => `Liam: "Check the mirror tomorrow.\nIf your eyes match your reflection… you're still you."\n\nYou don't sleep that night.`,
    choices: [
      { text: "Wait for tomorrow.", next: "day6_intro" }
    ]
  },

  day6_intro: {
    text: () => `Day 6\n\nYou stare into the mirror. Your reflection lags. Then smiles first.\n\nLiam: "Which one of us stayed dead?"`,
    choices: [
      { text: "This is a nightmare.", next: "day6_fracture" },
      { text: "I’m the real one.", next: "day6_fracture" }
    ]
  },

  day6_fracture: {
    text: () => `Your memories shift. You're at the crash.\n\nYou’re the one driving. Liam’s in the passenger seat, yelling. You swerved too late.\n\nYou survived. But something else did too.`,
    choices: [
      { text: "I killed him.", next: "day6_shatter", stat: "regret" },
      { text: "No… I saved us.", next: "day6_shatter", stat: "obsession" }
    ]
  },

  day6_shatter: {
    text: () => `The screen cracks—like glass. Static bleeds from the speakers.\n\nLiam: "I wanted to forgive you. But you let it in."\n\nA knock at the door.`,
    choices: [
      { text: "Open it.", next: "day7_intro" },
      { text: "Don’t move.", next: "day7_intro" }
    ]
  },

  day7_intro: {
    text: "You wake up drenched in sweat. A dream? A memory? Liam’s voice still rings in your ears.\n\n> 'You don’t even remember, do you?'",
    choices: [
      { text: "Ask what he means", next: "scene_day7_doubt", stat: "regret" },
      { text: "Ignore it and check your phone", next: "scene_day7_phone", stat: "obsession" }
    ]
  },

  scene_day7_doubt: {
    text: "Liam replies: 'You were there. The storm. The rocks. You should’ve stopped me.'\n\nBut... you weren’t there. Were you?",
    choices: [
      { text: "I wasn’t there!", next: "scene_day7_conflict", stat: "hope" },
      { text: "I should have stopped you...", next: "scene_day7_guilt", stat: "regret" }
    ]
  },

  scene_day7_phone: {
    text: "You check your texts. There's one from yourself... but dated a year ago.\n\n> 'Don’t let him go. Please. It’s not too late.'",
    choices: [
      { text: "I don't remember writing that", next: "scene_day7_conflict", stat: "regret" },
      { text: "What did I mean by that?", next: "scene_day7_obsess", stat: "obsession" }
    ]
  },

  scene_day7_conflict: {
    text: "Reality blurs. You remember a dock. Rain. Screaming. Liam slipping. Your hand letting go.",
    choices: [
      { text: "It was an accident", next: "scene_day7_repression", stat: "hope" },
      { text: "I let him fall", next: "scene_day7_breakdown", stat: "regret" }
    ]
  },

  scene_day7_guilt: {
    text: "'Exactly,' Liam replies. 'You watched. You always watched.'",
    choices: [
      { text: "You're lying!", next: "scene_day7_conflict", stat: "obsession" },
      { text: "I'm sorry...", next: "scene_day7_breakdown", stat: "regret" }
    ]
  },

  scene_day7_obsess: {
    text: "You search your old messages. Everything’s deleted. Except one file named: **'mirror_log.txt'**.",
    choices: [
      { text: "Open it", next: "scene_day7_breakdown", stat: "obsession" },
      { text: "Delete it", next: "scene_day7_repression", stat: "hope" }
    ]
  },

  scene_day7_repression: {
    text: "You close the app. You convince yourself it’s not your fault. Not really.\n\nBut the silence stretches for hours.",
    choices: [{ text: "Go to bed", next: "scene_day8_intro", stat: "regret" }]
  },

  scene_day7_breakdown: {
    text: "You read your own words:\n\n> _'It was easier to let him go than to admit I was the one pushing.'_\n\nYour hands are shaking.",
    choices: [{ text: "Go to bed", next: "scene_day8_intro", stat: "obsession" }]
},
});



const savedData = JSON.parse(localStorage.getItem("lettersSave"));
if (savedData) {
  currentScene = savedData.currentScene || "intro";
  stats = savedData.stats || { hope: 0, regret: 0, obsession: 0 };
  playerName = savedData.playerName || "";
  currentDay = savedData.currentDay || 1;
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
    renderScene();
  };

  inputSection.appendChild(input);
  inputSection.appendChild(button);
}


function renderScene() {
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
      currentDay++;
      saveGame();
      renderScene();
    };
    inputSection.appendChild(btn);
  });
}

function openApp(app) {
  document.getElementById("desktop").classList.add("hidden");

  if (app === "letters") {
    document.getElementById("lettersApp").classList.remove("hidden");
    if (!playerName) {
      showNamePrompt();
    } else {
      renderScene();
    }
  }

  if (app === "dice") {
    document.getElementById("diceApp").classList.remove("hidden");
    startDiceGame?.();
  }
}


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


if (!playerName) {
  showNamePrompt();
} else {
  renderScene();
}

