const phoneConfigs = {
    'CN': {
        prefix: '+86', // 中国区号
        format: (nums) => `1${nums.slice(0, 2)} ${nums.slice(2, 6)} ${nums.slice(6)}`, // 格式化函数：1xx xxxx xxxx
        length: 10, // 需要生成的随机数字长度 (第一位固定主要由 format 处理，这里指后续随机生成的位数，总长11位)
        lang: 'zh-CN', // 语言代码
        voiceName: 'Microsoft Huihui' // 首选语音包名称 (如果有的话)
    },
    'US': {
        prefix: '+1', // 美国区号
        format: (nums) => `(${nums.slice(0, 3)}) ${nums.slice(3, 6)}-${nums.slice(6)}`, // 格式化：(xxx) xxx-xxxx
        length: 10, // 10位数字
        lang: 'en-US', // 语言代码
        voiceName: 'Google US English' // 首选语音包名称
    },
    'UK': {
        prefix: '+44', // 英国区号
        format: (nums) => `07${nums.slice(0, 3)} ${nums.slice(3)}`, // 格式化：07xxx xxxxxx (通常手机号以07开头)
        length: 9, // 生成9位数字 (加上固定的 07 共 11 位)
        lang: 'en-GB', // 语言代码
        voiceName: 'Google UK English' // 首选语音包名称
    },
    'JP': {
        prefix: '+81', // 日本区号
        format: (nums) => `0${nums.slice(0, 2)}-${nums.slice(2, 6)}-${nums.slice(6)}`, // 格式化：0xx-xxxx-xxxx
        length: 10, // 0 开头，后面 10 位
        lang: 'ja-JP', // 语言代码
        voiceName: 'Google 日本語' // 首选语音包名称
    },
    'DE': {
        prefix: '+49', // 德国区号
        format: (nums) => `015${nums.slice(0, 1)} ${nums.slice(1)}`, // 格式化：015x xxxxxxx (手机号常以015开头)
        length: 8, // 随机生成8位
        lang: 'de-DE', // 语言代码
        voiceName: 'Google Deutsch' // 首选语音包名称
    },
    'AU': {
        prefix: '+61', // 澳大利亚区号
        format: (nums) => `04${nums.slice(0, 2)} ${nums.slice(2, 5)} ${nums.slice(5)}`, // 格式化：04xx xxx xxx
        length: 8, // 手机号：04 开头 + 8位数字
        lang: 'en-AU', // 语言代码
        voiceName: 'Google Australian English' // 首选语音包名称
    }
};

const displayEl = document.getElementById('phone-display'); // 显示号码的元素
const generateBtn = document.getElementById('generate-btn'); // 生成按钮
const speakBtn = document.getElementById('speak-btn'); // 朗读按钮
const countrySelect = document.getElementById('country-select'); // 国家选择框

let currentNumberForSpeech = ''; // 存储当前生成的号码用于朗读
let currentLang = ''; // 存储当前号码对应的语言代码

function generateRandomDigits(length) { // 生成指定长度的随机数字字符串
    let result = '';
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10); // 拼接 0-9 之间的随机整数
    }
    return result;
}

function generatePhoneNumber() { // 生成电话号码的主函数
    const country = countrySelect.value; // 获取当前选择的国家代码
    const config = phoneConfigs[country]; // 从配置对象中获取对应国家的配置

    // 生成随机数字部分
    const rawNums = generateRandomDigits(config.length);

    // 格式化显示的号码
    const formattedNum = config.format(rawNums);

    // 更新界面显示
    displayEl.textContent = formattedNum;
    displayEl.classList.remove('placeholder'); // 移除占位符样式

    // 准备语音朗读数据
    // 注意：通常为了清晰起见，逐个数字朗读可能更好，但默认的文本合成通常也可以接受。
    currentNumberForSpeech = formattedNum;
    currentLang = config.lang;

    speakBtn.disabled = false; // 启用朗读按钮

    // 添加自动抖动动画效果，增加趣味性
    displayEl.animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(-5px)' },
        { transform: 'translateX(5px)' },
        { transform: 'translateX(0)' }
    ], { duration: 300 });
}

function speakNumber() { // 朗读号码函数
    if (!currentNumberForSpeech) return; // 如果没有号码则不执行

    // 取消当前正在播放的任何语音
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(currentNumberForSpeech); // 创建语音合成实例
    utterance.lang = currentLang; // 设置语言
    utterance.rate = 0.8; // 设置语速稍慢，以便清晰听到

    // 尝试选择匹配的语音包
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang === currentLang) ||
        voices.find(v => v.lang.startsWith(currentLang.split('-')[0])); // 如果找不到完全匹配的，尝试匹配语言前缀

    if (matchingVoice) {
        utterance.voice = matchingVoice; // 应用选中的语音包
    }

    window.speechSynthesis.speak(utterance); // 开始朗读

    // 提供视觉反馈 (按钮放大效果)
    speakBtn.style.transform = 'scale(1.2)';
    setTimeout(() => speakBtn.style.transform = 'scale(1)', 200); // 200ms 后恢复原状
}

// 添加事件监听器
generateBtn.addEventListener('click', generatePhoneNumber); // 点击生成按钮时调用生成函数
speakBtn.addEventListener('click', speakNumber); // 点击朗读按钮时调用朗读函数

// 初始化语音列表 (Chrome 浏览器有时需要此事件触发才能获取语音列表)
window.speechSynthesis.onvoiceschanged = () => {
    console.log("Voices loaded (语音列表已加载)");
};
