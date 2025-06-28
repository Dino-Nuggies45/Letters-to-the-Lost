const storyText = document.getElementById("storyText")
const choicesDiv = document.getElementById("choices");

let currentScene = "intro";
let stats = {
    hope: 0,
    regret: 0,
    obsession: 0,
};
let playerName = "";

const savedData = JSON.parse(localStorage.getItem("lettersSave"));
if (savedData) {
    currentScene = savedData.currentScene;
    stats = savedData.stats;
    playerName = savedData.playerName;
}

function askName(){
    storyText.textContent = "";
    choicesDiv.innerHTML = "";

    const nameDiv = document.createElement("div");
    nameDiv.id = "namePrompt";
    nameDiv.style.display = "flex";
    nameDiv.style.flexDirection = "column";
    nameDiv.style.alignItems = "center";

    const label = document.createElement("p");
    label.textContent = "Before we begin, can you remember your name?"
    label.style.marginBottom = "1em";


    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter your name...";


    const button = document.createElement("button");
    button.textContent = "Start";
    button.onclick = () => {
        const name = input.value.trim();
        if (!name) return alert("Please enter a name.");
        playerName = name;
        saveGame();
        renderScene();
    };
    nameDiv.appendChild(label);
    nameDiv.appendChild(input)
    nameDiv.appendChild(button)
    choicesDiv.appendChild(nameDiv)
}

const scenes = {
    intro: {
     text: "Dear " + getName + ",\nI never thought you'd write back. Why now?",
    choices: [
      { text: "I miss you. I need answers.", next: "needAnswers", stat: "obsession" },
      { text: "I just want closure.", next: "closure", stat: "regret" }
    ]
  },
}


function renderScene() {
    const scene = scenes[currentScene];
    const rawText = typeof scene.text === "function" ? scene.text() : scene.text.replaceAll(getName, playerName);
    storyText.textContent = scene.text;


    storyText.classList.add("typing");
    storyText.textContent
    choicesDiv.innerHTML = "";

    let i = 0;
    const speed = 20;

    function typeWrtier() {
        if (i < rawText.length) {
            storyText.textContent += rawText.charAt(i)
            i++;
            setTimeout(typeWrtier, speed);
        } else {
            storyText.classList.remove("typing");
            renderChoices(scene);
        }
    }

    typeWrtier();
}

function renderChoices(scene) {
    if (!scene.choices || scene.choices.length === 0) {
        const restartBtn = document.createElement("button");
        restartBtn.textContent = "Restart";
        restartBtn.onclick = () => {
            currentScene = "intro";
            stats ={ hope: 0, regret: 0, obsession: 0};
            saveGame();
            renderScene();
        };
        choicesDiv.appendChild(restartBtn);
        return;
    }

    scenes.choices.forEach(choice => {
        const btn = document.getElementById("button");
        btn.textContent = choice.text;
        btn.onclick = () => {
            if (choice.stat) stats[choice.stat]++;
            currentScene = choice.next;
            renderScene();
        };
        choicesDiv.appendChild(btn);
    });
}
if (!playerName) {
    askName();
} else {
renderScene();
}