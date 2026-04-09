const calcBtn = document.getElementById('calcBtn');
const demoBtn = document.getElementById('demoBtn');
const numericInputs = document.querySelectorAll("input[type='number']");

const debounce = (fn, delay = 250) => {
    let timer = null;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
};

function bindInputEvents() {
    const debouncedCalc = debounce(runCalc, 250);

    numericInputs.forEach((input) => {
        input.addEventListener('input', debouncedCalc);
    });
}

function fillDemoData() {
    document.getElementById('twdAmount').value = 1000000;
    document.getElementById('buyRate').value = 30;
    document.getElementById('interestRate').value = 5;
    document.getElementById('years').value = 1;
    document.getElementById('sellRate').value = 31;

    runCalc();
}

function toggleGuide() {
    const content = document.getElementById('guideContent');
    const icon = document.getElementById('guideIcon');
    const isHidden = content.classList.toggle('hidden');

    icon.innerText = isHidden ? '▲' : '▼';
}

function initPage() {
    calcBtn?.addEventListener('click', runCalc);
    demoBtn?.addEventListener('click', fillDemoData);

    bindInputEvents();
    resetResult();
    fillDemoData();
}

document.addEventListener('DOMContentLoaded', initPage);
