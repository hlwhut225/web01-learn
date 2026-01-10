// Phone Number Generator Logic

const phoneConfigs = {
    'US': {
        prefix: '+1',
        format: (nums) => `(${nums.slice(0, 3)}) ${nums.slice(3, 6)}-${nums.slice(6)}`,
        length: 10, // 3 area + 3 prefix + 4 line
        example: '+1 (555) 012-3456'
    },
    'CN': {
        prefix: '+86',
        format: (nums) => `1${nums.slice(0, 2)} ${nums.slice(2, 6)} ${nums.slice(6)}`,
        length: 10, // 1 + 2 + 4 + 4 (Starts with 1, + 10 random)
        example: '+86 138 0013 8000'
    },
    'UK': {
        prefix: '+44',
        format: (nums) => `07${nums.slice(0, 3)} ${nums.slice(3)}`,
        length: 9, // 07 + 9 digits
        example: '+44 07700 900000'
    },
    'JP': {
        prefix: '+81',
        format: (nums) => `0${nums.slice(0, 2)}-${nums.slice(2, 6)}-${nums.slice(6)}`,
        length: 10, // 090/080/070 + 8 digits
        example: '+81 090-1234-5678'
    },
    'DE': {
        prefix: '+49',
        format: (nums) => `015${nums.slice(0, 1)} ${nums.slice(1)}`,
        length: 8, // 015x + 7 digits
        example: '+49 0151 1234567'
    },
    'FR': {
        prefix: '+33',
        format: (nums) => `06 ${nums.slice(0, 2)} ${nums.slice(2, 4)} ${nums.slice(4, 6)} ${nums.slice(6)}`,
        length: 8, // 06 + 8 digits
        example: '+33 06 12 34 56 78'
    },
    'AU': {
        prefix: '+61',
        format: (nums) => `04${nums.slice(0, 2)} ${nums.slice(2, 5)} ${nums.slice(5)}`,
        length: 8, // 04xx xxx xxx
        example: '+61 0412 345 678'
    },
    'CA': {
        prefix: '+1',
        format: (nums) => `(${nums.slice(0, 3)}) ${nums.slice(3, 6)}-${nums.slice(6)}`,
        length: 10, // Same as US
        example: '+1 (416) 555-0199'
    },
    'IN': {
        prefix: '+91',
        format: (nums) => `${nums.slice(0, 5)}-${nums.slice(5)}`,
        length: 10,
        example: '+91 98765-43210'
    },
    'BR': {
        prefix: '+55',
        format: (nums) => `(${nums.slice(0, 2)}) 9${nums.slice(2, 6)}-${nums.slice(6)}`,
        length: 10, // Area(2) + 9 + 8 digits = 11 total. Logic generates 10, we insert '9'
        example: '+55 (11) 91234-5678'
    }
};

function generateRandomDigits(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Update Copyright Year (Shared)
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Generator Logic
    const generatorContainer = document.querySelector('.tool-container');

    // Valid only if we are on a page with a tool container
    if (generatorContainer) {
        const countryCode = generatorContainer.getAttribute('data-country');
        const displayEl = document.getElementById('phone-display');
        const generateBtn = document.getElementById('generate-btn');

        if (countryCode && phoneConfigs[countryCode]) {
            const config = phoneConfigs[countryCode];

            // Initial Generate on Load (Optional)
            // generateAndDisplay(config, displayEl);

            generateBtn.addEventListener('click', () => {
                generateAndAppend(config);
            });
        }
    }
});

function generateAndAppend(config) {
    // Locate or create the result list container
    let listContainer = document.querySelector('.result-list');
    const toolContainer = document.querySelector('.tool-container');

    // Create container if it doesn't exist (backward compatibility or fresh create)
    if (!listContainer && toolContainer) {
        listContainer = document.createElement('div');
        listContainer.className = 'result-list';
        toolContainer.appendChild(listContainer);
    }

    if (!listContainer) return;

    const rawNums = generateRandomDigits(config.length);
    const formattedNum = `${config.prefix} ${config.format(rawNums)}`;

    const newItem = document.createElement('div');
    newItem.className = 'result-item';
    newItem.textContent = formattedNum;

    // Append to top (newest first) or bottom? User said "first 11, second 22... list".
    // Usually lists grow downwards.
    listContainer.appendChild(newItem);
}
