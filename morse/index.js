const morseCodes = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.',
  'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.',
  'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
  'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.'
};

const supportedCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('').sort((c1, c2) => morseCodes[c1].length > morseCodes[c2].length ? 1 : -1).join('');

let gainNode = null;
let audioContext = null;

function initOscillator() {
  if (audioContext === null) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let oscillator = audioContext.createOscillator();
    gainNode = audioContext.createGain();
    oscillator.frequency.value = 600; // 300Hz
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.gain.setValueAtTime(0.000001, audioContext.currentTime);
    oscillator.start();
  }
};

function saveCheckboxState(character) {
  const checkbox = document.getElementById(`checkbox-${character}`);
  localStorage.setItem(`checkbox-${character}`, checkbox.checked);
}

function loadCheckboxState(character) {
  const checkbox = document.getElementById(`checkbox-${character}`);
  const state = localStorage.getItem(`checkbox-${character}`);
  checkbox.checked = state === 'true';
}

(function generateCheckboxes() {
  const checkboxesContainer = document.getElementById('checkboxes');
  checkboxesContainer.innerHTML = '';

  for (let i = 0; i < supportedCharacters.length; i++) {
    const character = supportedCharacters[i];

    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `checkbox-${character}`;
    checkbox.onchange = () => saveCheckboxState(character);


    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(character + ' [' + morseCodes[character] + ']'));

    checkboxesContainer.appendChild(label);
    checkboxesContainer.appendChild(document.createElement("br"));

    loadCheckboxState(character);
  }
})();

function generateRandomText() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const selectedCharacters = Array.from(checkboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.id.split('-')[1]);

  if (selectedCharacters.length === 0) {
    alert('Please select at least one character.');
    return;
  }

  let randomText = '';
  let numberOfChars = 10;
  for (let i = 0; i < numberOfChars; i++) {
    const randomIndex = Math.floor(Math.random() * selectedCharacters.length);
    randomText += selectedCharacters[randomIndex];
  }

  if (Math.random() > 0.5) {
    var spacePosition = Math.floor(Math.random() * (numberOfChars - 1) + 1);
    let splitText = randomText.split('');
    splitText.splice(spacePosition, 0, ' ');
    randomText = splitText.join('');
  }

  document.getElementById('inputText').value = randomText;
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getInputText() {
  return document.getElementById('inputText').value.toUpperCase();
}

async function convertAndPlay() {
  let inputText = getInputText();
  const ditDuration = 100; // milliseconds
  const dahDuration = ditDuration * 3;
  const spaceDuration = ditDuration;
  const letterSpaceDuration = ditDuration * 3;
  const wordSpaceDuration = ditDuration * 7;

  async function playBeep(duration) {
    initOscillator();

    const fadingDuration = 5;

    gainNode.gain.setTargetAtTime(1, audioContext.currentTime, fadingDuration / 1000.0);
    await sleep(duration - fadingDuration);
    gainNode.gain.setTargetAtTime(0.000001, audioContext.currentTime, fadingDuration / 1000.0);
    await sleep(fadingDuration);
  }

  async function playMorseCode(code) {
    console.info(`Morese code: ${code}`);
    for (let i = 0; i < code.length; i++) {
      if (code[i] === '.') {
        await playBeep(ditDuration);
      }
      else if (code[i] === '-') {
        await playBeep(dahDuration);
      }
      else if (code[i] === '^') {
        await sleep(ditDuration);
      }
      else if (code[i] === '/') {
        await sleep(letterSpaceDuration);
      }
      else if (code[i] === '[') {
        await sleep(wordSpaceDuration);
      }
    }
  }

  let morseCode = '';
  inputText = inputText.trim().replace(/[^a-z0-9 ]/gi, '').split('').join('/').replace(/\/\s+\//g, '[');
  for (let i = 0; i < inputText.length; i++) {
    const char = inputText[i];
    if (char in morseCodes) {
      morseCode += morseCodes[char].split('').join('^');
    } else {
      morseCode += char;
    }
  }
  playMorseCode(morseCode);
}

function showHideToggle() {
  let inputElem = document.getElementById('inputText');
  inputElem.hidden = !inputElem.hidden;
}

function onKeyUpBody(e) {
  if (e.altKey && e.code === "KeyP") {
    convertAndPlay();
  }
}

function onConfirmationChange() {
  let inputText = getInputText().trim();
  let confirmationElement = document.getElementById("confirmation");
  let confirmationText = confirmationElement.value.toUpperCase().trim();
  
  if(inputText === confirmationText) {
    confirmationElement.style.backgroundColor = '#00FF00';
  } else {
    confirmationElement.style.backgroundColor = '#FFFFFF';
  }
}

document.body.addEventListener("keyup", (e) => onKeyUpBody(e));

let confirmation = document.getElementById("confirmation");
confirmation.addEventListener("input", (e) => onConfirmationChange(e));