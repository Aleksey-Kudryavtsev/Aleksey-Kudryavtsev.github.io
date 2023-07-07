const morseCodes = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.',
    'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.',
    'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
    'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
    '6': '-....', '7': '--...', '8': '---..', '9': '----.'
  };

const supportedCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('').sort((c1,c2) => morseCodes[c1].length > morseCodes[c2].length ? 1 : -1).join('');

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
  
  if(Math.random()>0.5) {
    var spacePosition = Math.floor(Math.random()*(numberOfChars-1) + 1);
    let splitText = randomText.split('');
    splitText.splice(spacePosition, 0, ' ');
    randomText = splitText.join('');
  }

  document.getElementById('inputText').value = randomText;
}


function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms));
}

async function convertAndPlay() {
  

  let inputText = document.getElementById('inputText').value.toUpperCase();
  const ditDuration = 100; // milliseconds
  const dahDuration = ditDuration * 3;
  const spaceDuration = ditDuration;
  const letterSpaceDuration = ditDuration * 3;
  const wordSpaceDuration = ditDuration * 7;

  async function playBeep(duration) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.frequency.value = 500; // 300Hz
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    let fadingDuration = 30;
    await sleep(duration - fadingDuration);
    gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + fadingDuration/1000.0);
    await sleep(fadingDuration);
    oscillator.stop();
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
      else if (code[i] === '/') {
        await sleep(letterSpaceDuration);
      }
      else if(code[i] === '[') {
        await sleep(wordSpaceDuration);
      }                    
    }
  }

  let morseCode = '';
  inputText = inputText.trim().replace(/[^a-z0-9 ]/gi, '').split('').join('/').replace(/\/\s+\//g,'[');
  for (let i = 0; i < inputText.length; i++) {
    const char = inputText[i];   
    if(char in morseCodes) {
       morseCode += morseCodes[char];        
    } else {
       morseCode += char;
    }
  }
  playMorseCode(morseCode);
}