const storyText = document.getElementById("storyText")
const choicesDiv = document.getElementById("choices");

let currentScene = "intro";
let stats = {
    hope: 0,
    regret: 0,
    obsession: 0,
}

const scenes = {
    intro: {
     text: "Dear _____,\nI never thought you'd write back. Why now?",
    choices: [
      { text: "I miss you. I need answers.", next: "needAnswers", stat: "obsession" },
      { text: "I just want closure.", next: "closure", stat: "regret" }
    ]
  },
}


function renderScene() {
    const scene = scenes[currentScene];
    storyText.textContent = scene.text;

    choicesDiv.innerHTML = "";
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

renderScene();