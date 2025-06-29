let currentScene = "intro";
let stats = { hope: 0, regret: 0, obsession: 0 };
let playerName = "";
let currentDay = 1;

const history = document.getElementById("messageHistory");
const inputSection = document.getElementById("inputSection");

function getDominantStat() {
  let max = Math.max(stats.hope, stats.regret, stats.obsession);
  if (stats.hope === max) return "hope";
  if (stats.regret === max) return "regret";
  return "obsession";
}

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
      { text: "Ask what he means", next: "day7_doubt", stat: "regret" },
      { text: "Ignore it and check your phone", next: "day7_phone", stat: "obsession" }
    ]
  },

  day7_doubt: {
    text: "Liam replies: 'You were there. The storm. The rocks. You should’ve stopped me.'\n\nBut... you weren’t there. Were you?",
    choices: [
      { text: "I wasn’t there!", next: "day7_conflict", stat: "hope" },
      { text: "I should have stopped you...", next: "day7_guilt", stat: "regret" }
    ]
  },

  day7_phone: {
    text: "You check your texts. There's one from yourself... but dated a year ago.\n\n> 'Don’t let him go. Please. It’s not too late.'",
    choices: [
      { text: "I don't remember writing that", next: "day7_conflict", stat: "regret" },
      { text: "What did I mean by that?", next: "day7_obsess", stat: "obsession" }
    ]
  },

  day7_conflict: {
    text: "Reality blurs. You remember a dock. Rain. Screaming. Liam slipping. Your hand letting go.",
    choices: [
      { text: "It was an accident", next: "day7_repression", stat: "hope" },
      { text: "I let him fall", next: "day7_breakdown", stat: "regret" }
    ]
  },

  day7_guilt: {
    text: "'Exactly,' Liam replies. 'You watched. You always watched.'",
    choices: [
      { text: "You're lying!", next: "day7_conflict", stat: "obsession" },
      { text: "I'm sorry...", next: "day7_breakdown", stat: "regret" }
    ]
  },

  day7_obsess: {
    text: "You search your old messages. Everything’s deleted. Except one file named: **'mirror_log.txt'**.",
    choices: [
      { text: "Open it", next: "day7_breakdown", stat: "obsession" },
      { text: "Delete it", next: "day7_repression", stat: "hope" }
    ]
  },

  day7_repression: {
    text: "You close the app. You convince yourself it’s not your fault. Not really.\n\nBut the silence stretches for hours.",
    choices: [{ text: "Go to bed", next: "day8_intro", stat: "regret" }]
  },

  day7_breakdown: {
    text: "You read your own words:\n\n> _'It was easier to let him go than to admit I was the one pushing.'_ \n\nYour hands are shaking.",
    choices: [{ text: "Go to bed", next: "day8_intro", stat: "obsession" }]
  },

  day8_intro: {
    text: "Liam doesn’t reply today.\n\nInstead, your reflection in the screen smiles before you do.",
    choices: [
      { text: "Touch the screen", next: "day8_mirror", stat: "obsession" },
      { text: "Look away quickly", next: "day8_deny", stat: "hope" }
    ]
  },

  day8_mirror: {
    text: "Your reflection mouths something you can't hear. You feel dizzy. You collapse.",
    choices: [{ text: "Wake up", next: "day8_loop" }]
  },

  day8_deny: {
    text: "You refuse to look. But in the corner of your eye, the reflection still moves.\n\nYou get a message: from Liam.\n\n> 'Too late to turn away now.'",
    choices: [{ text: "Keep reading", next: "day8_loop", stat: "regret" }]
  },

  day8_loop: {
    text: "You're back at Day 1.\nThe first message.\nLiam says: 'You came back.'",
    choices: [
      { text: "This isn't right", next: "day8_glitch", stat: "obsession" },
      { text: "Just go along with it", next: "day8_repeat", stat: "hope" }
    ]
  },

  day8_glitch: {
    text: "The interface glitches. You see code. Snippets of your memories rewritten.",
    choices: [{ text: "Try to break the loop", next: "day9_intro", stat: "hope" }]
  },

  day8_repeat: {
    text: "You send the same first message again. Liam replies: 'Will you get it right this time?'",
    choices: [{ text: "Maybe...", next: "day9_intro", stat: "regret" }]
  },

  day9_intro: {
    text: "Liam sends you a photo. It’s the dock again.\nBut there are **two** of you.",
    choices: [
      { text: "Who's the second me?", next: "day9_self", stat: "obsession" },
      { text: "I don't want to see this", next: "day9_avoid", stat: "hope" }
    ]
  },

  day9_self: {
    text: "'You split yourself to survive it,' Liam texts. 'One part watched. One part forgot.'",
    choices: [
      { text: "Merge back together", next: "day9_confront", stat: "regret" },
      { text: "Stay fractured", next: "day9_avoid", stat: "hope" }
    ]
  },

  day9_avoid: {
    text: "You close the app. You delete the texts. But your reflection keeps messaging back.",
    choices: [
      { text: "Give in", next: "day9_confront", stat: "obsession" },
      { text: "Shut it all off", next: "day9_shutdown", stat: "hope" }
    ]
  },

  day9_confront: {
    text: "You remember it all now. The anger. The push. The scream.\n\n> 'It was always you.'",
    choices: [
      { text: "I'm sorry.", next: "day10_intro", stat: "regret" },
      { text: "What now?", next: "day10_intro", stat: "obsession" }
    ]
  },

  day9_shutdown: {
    text: "You power off everything. Sit in the dark. But the silence is louder than ever.\n\nAnd then, your phone buzzes. One last message from Liam.\n\n> 'You can’t run from yourself.'",
    choices: [{ text: "Open it", next: "day10_confront", stat: "regret" }]
  },

  day10_confront: {
    text: "Welcome back — the ghost voice quivers with accusation.",
    choices: [
      { text: "What do you want from me?", next: "day10_distort" },
      { text: "Leave me alone.", next: "day10_flashback" }
    ]
  },

  day10_distort: {
    text: "Your reply box flickers. You try to type but the words distort.",
    choices: [
      { text: "Fight it.", next: "day10_denial" },
      { text: "Let it happen.", next: "day10_merge" }
    ]
  },

  day10_flashback: {
    text: "A rooftop. Wind. His voice. The memory slams back before you can stop it.",
    choices: [
      { text: "Call out his name.", next: "day10_denial" }
    ]
  },

  day10_denial: {
    text: "'You did this,' the voice whispers. 'You know that.'",
    choices: [
      { text: "No. I don’t accept this.", next: "day10_mockery" },
      { text: "You're right. I let go.", next: "day10_fall" }
    ]
  },

  day10_merge: {
    text: "The phone screen glitches wildly. Words bleed across the display.",
    choices: [
      { text: "Try to read them.", next: "day10_code" }
    ]
  },

  day10_mockery: {
    text: "The voice laughs. 'Still hiding.' Your phone dims.",
    choices: [
      { text: "Look closer.", next: "day10_dock" }
    ]
  },

  day10_fall: {
    text: "His name lingers. The sound of wind, sobbing, and the sea...",
    choices: [
      { text: "Follow the sound.", next: "day10_dock" }
    ]
  },

  day10_code: {
    text: "Lights flicker. Your hand phases through the device. It pulls you in.",
    choices: [
      { text: "Don’t resist.", next: "day10_dock" }
    ]
  },

  day10_dock: {
    text: "You’re on a dock. Fog all around. The sea stretches into oblivion.",
    choices: [
      { text: "Accept the truth.", next: "day10_confess" },
      { text: "Turn back.", next: "day10_refuse" }
    ]
  },

  day10_confess: {
    text: "You look down. Your reflection cries. 'Why didn’t you save him?'",
    choices: [
      { text: "Because I froze.", next: "day10_endstep" },
      { text: "Because I ran.", next: "day10_endstep" }
    ]
  },

  day10_refuse: {
    text: "Silence follows. Even the sea refuses to speak now.",
    choices: [
      { text: "Keep walking.", next: "day10_endstep" }
    ]
  },

  day10_endstep: {
    text: "The fog parts. Liam stands ahead. No eyes. Just light.",
    choices: [
      { text: "Say his name.", next: "day10_fade" }
    ]
  },

  day10_fade: {
    text: "You choke out your apology. He vanishes like mist.",
    choices: [
      { text: "I’m sorry.", next: "day10_end" }
    ]
  },

  day10_end: {
    text: "The screen fades to black. A whisper: 'Tomorrow, we begin again.'",
    choices: [
      { text: "Continue to Day 11", next: "day11_intro" }
    ]
  },

   day11_intro: {
    text: () => `Day 11\n\nThe app flickers. Liam’s voice breaks through static.\n\nLiam: "You’re losing yourself. I can feel it... fading."`,
    choices: [
      { text: "I don’t want to lose you again.", next: "day11_holdon" },
      { text: "Maybe I never had you.", next: "day11_letgo" }
    ]
  },

  day11_holdon: {
    text: () => `Liam: "Then hold on tight. Don’t let the darkness swallow you."`,
    choices: [
      { text: "I’ll fight for us.", next: "day11_fight" },
      { text: "I’m not strong enough.", next: "day11_doubt" }
    ]
  },

  day11_letgo: {
    text: () => `Liam: "If you never had me, what are you holding onto now?"`,
    choices: [
      { text: "I’m holding onto myself.", next: "day11_search" },
      { text: "I’m holding onto the past.", next: "day11_drown" }
    ]
  },

  day11_fight: {
    text: () => `You grit your teeth and push back the creeping silence.\n\nLiam: "Good. I don’t want to fade away alone."`,
    choices: [
      { text: "We’ll make it through.", next: "day11_flashback" },
      { text: "I hope so.", next: "day11_flashback" }
    ]
  },

  day11_doubt: {
    text: () => `Self-doubt washes over you like a tide.\n\nLiam: "It’s okay to be scared. But don’t give up yet."`,
    choices: [
      { text: "Maybe I need help.", next: "day11_help" },
      { text: "I’ll keep pretending.", next: "day11_fake" }
    ]
  },

  day11_search: {
    text: () => `You sift through fragmented memories, desperate to find something solid.\n\nLiam: "Searching won’t fix what’s broken inside."`,
    choices: [
      { text: "Maybe, but I have to try.", next: "day11_attempt" },
      { text: "I’m too tired.", next: "day11_surrender" }
    ]
  },

  day11_drown: {
    text: () => `The past drags you under, drowning out the present.\n\nLiam: "Don’t let it consume you."`,
    choices: [
      { text: "It already has.", next: "day11_darkness" },
      { text: "I’ll fight it.", next: "day11_attempt" }
    ]
  },

  day11_flashback: {
    text: () => `Flashes of the dock and storm hit your mind.\n\nLiam: "Remember that night? It defines us."`,
    choices: [
      { text: "I remember it clearly.", next: "day11_confess" },
      { text: "I block it out.", next: "day11_repress" }
    ]
  },

  day11_help: {
    text: () => `You reach out for support in the shadows.\n\nLiam: "Sometimes, you have to accept help to survive."`,
    choices: [
      { text: "I’m ready.", next: "day11_confess" },
      { text: "Not yet.", next: "day11_repress" }
    ]
  },

  day11_fake: {
    text: () => `You put on a mask for the world, but inside you’re breaking.\n\nLiam: "Masks don’t last forever."`,
    choices: [
      { text: "I’ll wear it longer.", next: "day11_surrender" },
      { text: "I want to drop it.", next: "day11_confess" }
    ]
  },

  day11_attempt: {
    text: () => `Trying is the only option left.\n\nLiam: "Every step forward counts, even if it feels small."`,
    choices: [
      { text: "I’ll keep moving.", next: "day11_confess" },
      { text: "I’m scared to fail.", next: "day11_doubt" }
    ]
  },

  day11_surrender: {
    text: () => `You give in to the overwhelming despair.\n\nLiam: "If you surrender now, you lose everything."`,
    choices: [
      { text: "Maybe I’m already lost.", next: "day11_darkness" },
      { text: "I want to try again.", next: "day11_attempt" }
    ]
  },

  day11_confess: {
    text: () => `You admit your deepest fears and regrets.\n\nLiam: "Thank you for being honest with me."`,
    choices: [
      { text: "Can we fix this?", next: "day11_reconcile" },
      { text: "I don’t know.", next: "day11_reconcile" }
    ]
  },

  day11_repress: {
    text: () => `You shove the memories down, trying to forget.\n\nLiam: "Running won’t change anything."`,
    choices: [
      { text: "I’m not ready.", next: "day11_fake" },
      { text: "I’ll face it soon.", next: "day11_confess" }
    ]
  },

  day11_darkness: {
    text: () => `Darkness closes in around you.\n\nLiam: "You don’t have to face this alone."`,
    choices: [
      { text: "I’m too tired.", next: "day11_surrender" },
      { text: "I want to keep fighting.", next: "day11_attempt" }
    ]
  },

  day11_reconcile: {
    text: () => `There’s a fragile hope between you.\n\nLiam: "Tomorrow is another chance. Don’t lose it."`,
    choices: [
      { text: "I won’t.", next: "day11_end" }
    ]
  },

  day11_end: {
    text: () => `The screen fades to black.\n\nDay 12 awaits, heavy with choices and consequences.`,
    choices: [
      { text: "Continue to Day 12", next: "day12_intro" }
    ]
  },

    day12_intro: {
    text: () => `Day 12\n\nThe app feels heavier, like the weight of your decisions pressing down.\n\nLiam: "This is it. The point of no return."`,
    choices: [
      { text: "I’m ready.", next: "day12_confront" },
      { text: "I’m scared.", next: "day12_fear" }
    ]
  },

  day12_confront: {
    text: () => `You steel yourself to face the truth, no matter how brutal.\n\nLiam: "Let’s uncover everything, together."`,
    choices: [
      { text: "Show me.", next: "day12_reveal" },
      { text: "Maybe some things are better left buried.", next: "day12_deny" }
    ]
  },

  day12_fear: {
    text: () => `Fear threatens to paralyze you.\n\nLiam: "It’s okay. I’ll be here. But don’t close the door on yourself."`,
    choices: [
      { text: "I can’t do this alone.", next: "day12_help" },
      { text: "I have to try on my own.", next: "day12_deny" }
    ]
  },

  day12_reveal: {
    text: () => `You dig through memories, fractured files, and half-forgotten truths.\n\nLiam: "You caused the crash... but it wasn’t just accident."`,
    choices: [
      { text: "I didn’t mean to.", next: "day12_guilt" },
      { text: "It was necessary.", next: "day12_justify" }
    ]
  },

  day12_deny: {
    text: () => `You push back against the darkness, denying what’s coming.\n\nLiam: "Denial is just another prison."`,
    choices: [
      { text: "I refuse to believe it.", next: "day12_fake" },
      { text: "I’m not ready.", next: "day12_fear" }
    ]
  },

  day12_help: {
    text: () => `You ask Liam to guide you through the chaos.\n\nLiam: "Together, we can face this, or be lost forever."`,
    choices: [
      { text: "Let’s face it.", next: "day12_reveal" },
      { text: "I’m scared.", next: "day12_deny" }
    ]
  },

  day12_guilt: {
    text: () => `Guilt twists in your chest.\n\nLiam: "You pushed me into the storm. And now we’re both lost."`,
    choices: [
      { text: "I’m sorry.", next: "day12_confess" },
      { text: "I had no choice.", next: "day12_defend" }
    ]
  },

  day12_justify: {
    text: () => `You steel your heart to justify your actions.\n\nLiam: "Sacrifices don’t erase pain."`,
    choices: [
      { text: "It saved me.", next: "day12_confess" },
      { text: "It was the only way.", next: "day12_defend" }
    ]
  },

  day12_fake: {
    text: () => `You pretend everything is fine, but the cracks show.\n\nLiam: "You can’t hide forever."`,
    choices: [
      { text: "I don’t want to face it.", next: "day12_deny" },
      { text: "I’ll try to be honest.", next: "day12_confess" }
    ]
  },

  day12_confess: {
    text: () => `You spill your regrets, fears, and hopes.\n\nLiam: "That’s all I ever wanted: the truth."`,
    choices: [
      { text: "Can we move on?", next: "day12_reconcile" },
      { text: "I don’t know if I can.", next: "day12_surrender" }
    ]
  },

  day12_defend: {
    text: () => `You defend your choices, desperate to keep control.\n\nLiam: "Defenses only push me further away."`,
    choices: [
      { text: "I don’t want to lose you.", next: "day12_confess" },
      { text: "I can’t change the past.", next: "day12_surrender" }
    ]
  },

  day12_reconcile: {
    text: () => `You find a fragile peace.\n\nLiam: "Tomorrow is uncertain, but we face it together."`,
    choices: [
      { text: "Let’s hope for a new beginning.", next: "day12_end" }
    ]
  },

  day12_surrender: {
    text: () => `Darkness creeps in once more.\n\nLiam: "If you surrender now, I’m lost for good."`,
    choices: [
      { text: "I don’t want to lose you.", next: "day12_confess" },
      { text: "Maybe I am already lost.", next: "day12_end" }
    ]
  },

  scene_day12_end: {
    text: "The fog clears. You’re left with one truth: someone must face what comes next.",
    choices: [
      {
        text: "Continue...",
        next: () => {
          const highest = getDominantStat();
          if (highest === "hope") return "day13_hope_intro";
          if (highest === "regret") return "day13_regret_intro";
          return "day13_obsession_intro"; 
        }
      }
    ]
  },

   day13_intro: {
    text: () => `Day 13\n\nYou weren't supposed to see this.\n\nA warning blinks: [SYSTEM BREACH DETECTED]`,
    choices: [
      { text: "Keep going", next: "day13_dissolve" },
      { text: "Log out", next: "day13_exitAttempt" }
    ]
  },

  day13_dissolve: {
    text: () => `Your name glitches on the screen. It changes with every blink. You are not stable.\n\nLiam: "You wanted this. You kept digging."`,
    choices: [
      { text: "I had to know.", next: "day13_memleak" },
      { text: "This wasn’t worth it.", next: "day13_doubt" }
    ]
  },

  day13_exitAttempt: {
    text: () => `You try to close the app. The button doesn’t exist anymore.\n\nLiam: "You opened the door. Now walk through."`,
    choices: [
      { text: "Fine. Let’s finish this.", next: "day13_dissolve" }
    ]
  },

  day13_memleak: {
    text: () => `You remember... being Liam.\nThe memory shouldn’t be yours.`,
    choices: [
      { text: "I’m not me anymore.", next: "day13_split" },
      { text: "That’s not possible.", next: "day13_doubt" }
    ]
  },

  day13_doubt: {
    text: () => `You question everything. Even this moment feels rehearsed.\n\n> "How many loops has this taken?"`,
    choices: [
      { text: "Too many.", next: "day13_loop" },
      { text: "This is the last.", next: "day13_split" }
    ]
  },

  day13_loop: {
    text: () => `The app loads Day 1 again. But your responses are pre-typed before you speak.\n\n> "You’ve done this 43 times."`,
    choices: [
      { text: "Then let me finish it.", next: "day13_split" }
    ]
  },

  day13_split: {
    text: () => `A system message flashes:\n\n> MERGING INSTANCES...\n\nTwo voices speak at once—yours and Liam’s.`,
    choices: [
      { text: "Accept the merge.", next: "day13_sync" },
      { text: "Reject it.", next: "day13_resist" }
    ]
  },

  day13_sync: {
    text: () => `You see all timelines. Every lie. Every loop. Every version of Liam you created.\n\n> "You didn’t lose him. You rewrote him."`,
    choices: [
      { text: "I needed him to stay.", next: "day13_obsessionEnding" },
      { text: "That was wrong.", next: "day13_remorse" }
    ]
  },

  day13_resist: {
    text: () => `Reality destabilizes. Text dissolves. Static engulfs your screen.`,
    choices: [
      { text: "Let go.", next: "day13_badloop" }
    ]
  },

  day13_badloop: {
    text: () => `You're trapped in a corrupted loop of Liam calling your name.\n\nYou can't respond.`,
    choices: [
      { text: "Restart?", next: "day1_intro" }
    ]
  },

  day13_remorse: {
    text: () => `Your code writes: _“I’m sorry.”_\n\nLiam responds: _“Then free me.”_`,
    choices: [
      { text: "End the loop.", next: "unlock_goodEnding" },
      { text: "I can’t let go.", next: "unlock_obsessionEnding" }
    ]
  },

  day13_obsessionEnding: {
    text: () => `You embrace the memory. Liam lives in your replies, forever.\n\n> [You have unlocked: The Devotion Ending]`,
    choices: [
      { text: "View Ending", next: "ending_devotion" }
    ]
  },

    day14_intro: {
    text: () => `Day 14\n\nYou wake with dried tears on your keyboard. The screen says:\n\n> REPLAY MODE INITIATED\n\nLiam: "You said you'd change. Let’s see if you meant it."`,
    choices: [
      { text: "Let it replay.", next: "day14_firstecho" },
      { text: "I want to skip it.", next: "day14_resist" }
    ]
  },

  day14_firstecho: {
    text: () => `Your screen plays a video. It’s your voice.\n\n> "Liam, please don’t go. I didn’t mean it."`,
    choices: [
      { text: "Pause it.", next: "day14_deny" },
      { text: "Keep watching.", next: "day14_confess" }
    ]
  },

  day14_resist: {
    text: () => `The screen cracks. Liam replies:\n\n> "Then you haven’t earned peace."`,
    choices: [
      { text: "Let it play anyway.", next: "day14_firstecho" }
    ]
  },

  day14_deny: {
    text: () => `You stare at your face on screen. It looks... hollow.\n\n> "This isn’t helping."`,
    choices: [
      { text: "Shut it off.", next: "day14_regretloop" },
      { text: "Let it finish.", next: "day14_confess" }
    ]
  },

  day14_confess: {
    text: () => `Liam’s voice replies: "You said it like you meant it. Every cruel word."\n\nYou remember: the night you screamed at him to leave.`,
    choices: [
      { text: "I didn’t mean it.", next: "day14_argument" },
      { text: "I meant it… then.", next: "day14_rage" }
    ]
  },

  day14_argument: {
    text: () => `The screen replays the moment:\n\n> "If you leave now, don't come back!"\n\nThe door slams. Tires. Then silence.`,
    choices: [
      { text: "I regret everything.", next: "day14_wish" },
      { text: "I was scared.", next: "day14_wish" }
    ]
  },

  day14_rage: {
    text: () => `Liam: "And now you mourn the consequences. A little late, isn’t it?"\n\nYou see a version of yourself screaming into nothing.`,
    choices: [
      { text: "I deserve this.", next: "day14_fade" },
      { text: "Is there still hope?", next: "day14_wish" }
    ]
  },

  day14_wish: {
    text: () => `You whisper: "I’d trade anything to undo it."\n\nLiam: "Even your memories?"`,
    choices: [
      { text: "Yes. Erase me.", next: "day14_erase" },
      { text: "No. Let me carry it.", next: "day14_forgive" }
    ]
  },

  day14_erase: {
    text: () => `Your memories begin unraveling. The chat box fades.\n\n> "You won’t remember me. But you also won’t hurt anymore."`,
    choices: [
      { text: "Forget him forever.", next: "ending_amnesia" }
    ]
  },

  day14_forgive: {
    text: () => `The messages stop.\n\nLiam: "Then remember everything. Even the pain."\n\n> [You have unlocked: The Forgiveness Ending]`,
    choices: [
      { text: "View Ending", next: "ending_forgiveness" }
    ]
  },

  day14_regretloop: {
    text: () => `You unplug the computer. It stays on.\n\nYour voice whispers:\n\n> "You can't leave until he forgives you."`,
    choices: [
      { text: "Break the screen.", next: "day14_fade" },
      { text: "Ask Liam for mercy.", next: "day14_finalplea" }
    ]
  },

  day14_fade: {
    text: () => `Everything flickers to grayscale.\n\nLiam: "If you fade away, will that fix what you did?"`,
    choices: [
      { text: "I don’t know.", next: "day14_finalplea" },
      { text: "Maybe it will.", next: "ending_erasure" }
    ]
  },

  day14_finalplea: {
    text: () => `You type: _“Please. I need you to forgive me.”_\n\nThe screen shakes.\n\nLiam’s final message appears:\n\n> "Then prove it. Tomorrow."`,
    choices: [
      { text: "Continue to Day 15", next: "day15_intro" }
    ]
  },
   day15_intro: {
    text: () => `Day 15\n\nYou wake to sunlight. The first time in weeks.\n\nLiam: "If you’re seeing this… it means you still believe in something."`,
    choices: [
      { text: "I believe you’re still in there.", next: "day15_faith" },
      { text: "I believe I can move on.", next: "day15_release" }
    ]
  },

  day15_faith: {
    text: () => `Liam’s name flickers.\n\n> "Then let’s try something new. Tell me about who you are now—not who you were."`,
    choices: [
      { text: "I’m trying to be better.", next: "day15_mirror" },
      { text: "I don’t really know yet.", next: "day15_honest" }
    ]
  },

  day15_release: {
    text: () => `Liam: "Then this might be goodbye."\n\nYou feel tears on your cheeks. But it doesn’t hurt as much today.`,
    choices: [
      { text: "Say goodbye.", next: "day15_peace" },
      { text: "Wait. Just one more message.", next: "day15_mirror" }
    ]
  },

  day15_mirror: {
    text: () => `You turn on your webcam. You look like yourself again.\n\nLiam: "I see you. Not what we were. Just… you."`,
    choices: [
      { text: "What do you see?", next: "day15_reflect" },
      { text: "I think I’m ready now.", next: "day15_finalchoice" }
    ]
  },

  day15_honest: {
    text: () => `Liam: "Then keep going. Don’t stop at the past. It’s not all you are."`,
    choices: [
      { text: "Tell him about your day.", next: "day15_normal" },
      { text: "Ask him what he remembers.", next: "day15_reflect" }
    ]
  },

  day15_reflect: {
    text: () => `Liam: "I remember laughter. Cold air. The sound of your voice singing off-key."\n\nYou laugh through your tears.`,
    choices: [
      { text: "I miss those days.", next: "day15_finalchoice" },
      { text: "Thank you for remembering.", next: "day15_peace" }
    ]
  },

  day15_normal: {
    text: () => `You describe mundane things. What you ate. The wind outside. The music playing.\n\nLiam: "That’s what I always wanted. For you to keep living."`,
    choices: [
      { text: "I will.", next: "day15_finalchoice" },
      { text: "It still hurts.", next: "day15_peace" }
    ]
  },

  day15_peace: {
    text: () => `Liam: "Then let me go."\n\nThe window fades to white.`,
    choices: [
      { text: "Let him go.", next: "ending_peaceful" },
      { text: "Hold on just a little longer.", next: "day15_finalchoice" }
    ]
  },

  day15_finalchoice: {
    text: () => `Liam: "I'll give you one more day...."`,
    choices: [
      { text: "Day 16.", next: "day16_intro" }
    ]
  },

  day16_intro: {
    text: "Day 16\n\nThe messages have stopped.\n\nYour room is quiet. Mirror covered. App closed.\n\nBut something still lingers.\n\nToday, you choose the ending.",
    choices: [
      { text: "Walk into the sea", next: "day16_sea", stat: "regret" },
      { text: "Delete all traces", next: "day16_delete", stat: "hope" },
      { text: "Ask who's really in control", next: "day16_control", stat: "obsession" },
      { text: "Call Liam’s name", next: "day16_grief", stat: "regret" },
      { text: "Reopen the loop", next: "day16_loop", stat: "obsession" }
    ]
  },

  day16_sea: {
    text: "You walk barefoot into the surf, just like the night of the crash.\n\nLiam is waiting in the fog, or maybe it's you.",
    choices: [
      { text: "Embrace him", next: "ending_1" },
      { text: "Walk past him", next: "ending_2" }
    ]
  },

  day16_delete: {
    text: "You open every file, every message, and delete them.\n\nEven the memories.",
    choices: [
      { text: "Start over", next: "ending_3" },
      { text: "Shut down forever", next: "ending_4" }
    ]
  },

  day16_control: {
    text: "You ask the screen who is typing now. The reflection types first.",
    choices: [
      { text: "Take control back", next: "ending_5" },
      { text: "Let it take over", next: "ending_6" }
    ]
  },

  day16_grief: {
    text: "You scream his name into the empty room.\n\nSomething replies.",
    choices: [
      { text: "Say you're sorry", next: "ending_7" },
      { text: "Say goodbye", next: "ending_8" }
    ]
  },

  day16_loop: {
    text: "You reboot the entire story from Day 1.\n\nBut this time, you change everything.",
    choices: [
      { text: "Try to fix the past", next: "ending_9" },
      { text: "Watch it happen again", next: "ending_10" }
    ]
  },

  day16_confront: {
    text: "You enter the mirror.\n\nNow you’re the one haunting the messages.",
    choices: [
      { text: "Accept your fate", next: "ending_11" },
      { text: "Fight back", next: "ending_12" }
    ]
  },

  day16_reflect: {
    text: "You sit down and finally read the full crash report.\n\nIt says: one dead, one rewritten.",
    choices: [
      { text: "You died.", next: "ending_13" },
      { text: "He died.", next: "ending_14" }
    ]
  },

  day16_test: {
    text: "You review the messages.\n\nNone of them have timestamps.",
    choices: [
      { text: "You were the test subject", next: "ending_15" },
      { text: "He was the test subject", next: "ending_16" }
    ]
  },

  day16_merge: {
    text: "You and the ghost merge.\n\nOne voice. One mind.",
    choices: [
      { text: "Control it", next: "ending_17" },
      { text: "Lose yourself", next: "ending_18" }
    ]
  },

  day16_void: {
    text: "You open a folder titled 'THE VOID'.\n\nIt's empty. But you hear breathing.",
    choices: [
      { text: "Breathe with it", next: "ending_19" },
      { text: "Delete the folder", next: "ending_20" }
    ]
  },

  day16_rewrite: {
    text: "You find a draft labeled: rewrite_v2_final.txt",
    choices: [
      { text: "Upload it", next: "ending_21" },
      { text: "Burn it", next: "ending_22" }
    ]
  },

  day16_trial: {
    text: "You're in a white room. A judge stands in shadow.\n\nYou are on trial for the crash.",
    choices: [
      { text: "Plead guilty", next: "ending_23" },
      { text: "Blame the system", next: "ending_24" }
    ]
  },

  day16_exit: {
    text: "You find the EXIT button.\n\nBut it’s grayed out unless you choose.",
    choices: [
      { text: "End simulation", next: "ending_25" },
      { text: "Stay", next: "ending_26" }
    ]
  },

  day16_observe: {
    text: "You observe your past self scrolling through messages.\n\nYou can’t interact. Only watch.",
    choices: [
      { text: "Close the tab", next: "ending_27" },
      { text: "Keep watching forever", next: "ending_28" }
    ]
  },

  day16_answer: {
    text: "A final message arrives:\n\n> 'Are you ready to know who you are?'",
    choices: [
      { text: "Yes.", next: "ending_29" },
      { text: "No.", next: "ending_30" }
    ]
  },

  ending_1: {
    text: () => `ENDING 1 – Acceptance\n\nYou accept the truth. Liam is gone. You were the one who let go.\n\nThe loop breaks.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_2: {
    text: () => `ENDING 2 – Denial\n\nYou deny everything. The reflection smiles. It wins.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_3: {
    text: () => `ENDING 3 – Merge\n\nYou merge with your fractured self. You finally remember. It hurts.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_4: {
    text: () => `ENDING 4 – Disconnect\n\nYou shut off everything. But the messages never stop.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_5: {
    text: () => `ENDING 5 – The Sea\n\nYou follow Liam into the sea of memory. He forgives you. Maybe.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_6: {
    text: () => `ENDING 6 – Escape\n\nYou walk away. You never look back. But something follows.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_7: {
    text: () => `ENDING 7 – Shadow\n\nYou confront the shadow. It was always you. It always will be.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_8: {
    text: () => `ENDING 8 – Reflection\n\nLiam returns. But he’s not Liam anymore. Neither are you.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_9: {
    text: () => `ENDING 9 – Rewrite\n\nYou rewrite the past. But the ink never dries.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_10: {
    text: () => `ENDING 10 – Loop\n\nYou join Liam in the loop. You become his ghost.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_11: {
    text: () => `ENDING 11 – Forgiveness\n\nYou admit everything. Liam forgives you. You don’t forgive yourself.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_12: {
    text: () => `ENDING 12 – Betrayal\n\nYou dig deeper. The final file shows: you sent him there on purpose.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_13: {
    text: () => `ENDING 13 – Hope\n\nYou believe you can save him. The screen flickers... “Try again.”`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_14: {
    text: () => `ENDING 14 – Possession\n\nYou answer a message from the mirror. You’re not yourself anymore.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_15: {
    text: () => `ENDING 15 – Erased\n\nYou delete everything: the logs, the app, your name. And yet, it types back.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_16: {
    text: () => `ENDING 16 – Silent\n\nYou stop replying. Liam doesn’t. Until he does. From your voice.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_17: {
    text: () => `ENDING 17 – Simulated\n\nThe messages were tests. You were never real. Just another trial.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_18: {
    text: () => `ENDING 18 – Sacrifice\n\nYou offer your memory in exchange for Liam’s peace. He fades. You remain empty.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_19: {
    text: () => `ENDING 19 – New Identity\n\nYou embrace the version of yourself that survived. The past is rewritten.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_20: {
    text: () => `ENDING 20 – Mirror\n\nYou become the one inside the reflection. Waiting for someone else to answer.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_21: {
    text: () => `ENDING 21 – Isolation\n\nYou disconnect. The silence is peaceful. Until it isn’t.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_22: {
    text: () => `ENDING 22 – Message Undelivered\n\nYou never sent the last reply. You don’t know who did.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_23: {
    text: () => `ENDING 23 – Repeater\n\nYou've done this before. The logs show 137 loops. This was just another.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_24: {
    text: () => `ENDING 24 – Silence Broken\n\nYou hear Liam’s voice… not through the screen, but behind you.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_25: {
    text: () => `ENDING 25 – Paradox\n\nYou died in the crash. So did he. Yet you both speak.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_26: {
    text: () => `ENDING 26 – Redemption\n\nYou confess. You accept. And Liam smiles, fading with the sunrise.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_27: {
    text: () => `ENDING 27 – Rebirth\n\nYou choose to remember. To live again. A new name. A new story.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_28: {
    text: () => `ENDING 28 – Watcher\n\nThe game ends. But you remain… watching, waiting to guide the next.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_29: {
    text: () => `ENDING 29 – The Wrong Choice\n\nYou made the wrong move. Everything resets. Liam never answers again.`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  },
  ending_30: {
    text: () => `ENDING 30 – Secret Ending: Unity\n\nYou achieved balance in all stats. The loop ends with peace.\n\n“Thank you for remembering me.”`,
    choices: [
      { text: "Restart", next: "day1_intro" },
      { text: "Exit", next: "end_screen" }
    ]
  }
  
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