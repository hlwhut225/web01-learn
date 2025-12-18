const phoneConfigs = {
    'CN': {
        prefix: '+86',
        format: (nums) => `1${nums.slice(0, 2)} ${nums.slice(2, 6)} ${nums.slice(6)}`,
        length: 10, // 1 + 10 = 11 digits total (1st digit is fixed 1)
        lang: 'zh-CN',
        voiceName: 'Microsoft Huihui' // Preference hint
    },
    'US': {
        prefix: '+1',
        format: (nums) => `(${nums.slice(0, 3)}) ${nums.slice(3, 6)}-${nums.slice(6)}`,
        length: 10,
        lang: 'en-US',
        voiceName: 'Google US English'
    },
    'UK': {
        prefix: '+44',
        format: (nums) => `07${nums.slice(0, 3)} ${nums.slice(3)}`,
        length: 9, // Starts with 07, then 9 more digits usually for mobile
        lang: 'en-GB',
        voiceName: 'Google UK English'
    },
    'JP': {
        prefix: '+81',
        format: (nums) => `0${nums.slice(0, 2)}-${nums.slice(2, 6)}-${nums.slice(6)}`,
        length: 10, // 0xx-xxxx-xxxx
        lang: 'ja-JP',
        voiceName: 'Google 日本語'
    },
    'DE': {
        prefix: '+49',
        format: (nums) => `015${nums.slice(0, 1)} ${nums.slice(1)}`,
        length: 8, // Mobile often 015x...
        lang: 'de-DE',
        voiceName: 'Google Deutsch'
    }
};

const displayEl = document.getElementById('phone-display');
const generateBtn = document.getElementById('generate-btn');
const speakBtn = document.getElementById('speak-btn');
const countrySelect = document.getElementById('country-select');

let currentNumberForSpeech = '';
let currentLang = '';

function generateRandomDigits(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
}

function generatePhoneNumber() {
    const country = countrySelect.value;
    const config = phoneConfigs[country];

    // Generate random digits
    const rawNums = generateRandomDigits(config.length);

    // Format visual display
    const formattedNum = config.format(rawNums);

    // Update UI
    displayEl.textContent = formattedNum;
    displayEl.classList.remove('placeholder');

    // Prepare for speech (read it digit by digit or naturally depending on preference)
    // For clarity, reading digit by digit is often better for phone numbers, 
    // but default synthesis is usually okay.
    currentNumberForSpeech = formattedNum;
    currentLang = config.lang;

    speakBtn.disabled = false;

    // Auto-shake effect for fun
    displayEl.animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(-5px)' },
        { transform: 'translateX(5px)' },
        { transform: 'translateX(0)' }
    ], { duration: 300 });
}

function speakNumber() {
    if (!currentNumberForSpeech) return;

    // Cancel any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(currentNumberForSpeech);
    utterance.lang = currentLang;
    utterance.rate = 0.8; // Slightly slower for clarity

    // Try to pick a matching voice
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang === currentLang) ||
        voices.find(v => v.lang.startsWith(currentLang.split('-')[0]));

    if (matchingVoice) {
        utterance.voice = matchingVoice;
    }

    window.speechSynthesis.speak(utterance);

    // Visual feedback
    speakBtn.style.transform = 'scale(1.2)';
    setTimeout(() => speakBtn.style.transform = 'scale(1)', 200);
}

// Event Listeners
generateBtn.addEventListener('click', generatePhoneNumber);
speakBtn.addEventListener('click', speakNumber);

// Initialize voices (sometimes needed for Chrome)
window.speechSynthesis.onvoiceschanged = () => {
    console.log("Voices loaded");
};
