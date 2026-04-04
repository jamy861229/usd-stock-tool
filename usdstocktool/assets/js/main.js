const priceMode = document.getElementById("priceMode");
const percentMode = document.getElementById("percentMode");
const demoBtn = document.getElementById("demoBtn");
const modeButtons = document.querySelectorAll(".mode-toggle button");
const numericInputs = document.querySelectorAll("input[type='number']");

const debounce = (fn, delay = 250) => {
    let timer = null;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
};

function setMode(mode) {
    priceMode.classList.toggle("hidden", mode !== "price");
    percentMode.classList.toggle("hidden", mode !== "percent");

    modeButtons.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.mode === mode);
    });

    resetResult();
    runCalc();
}

function bindModeEvents() {
    modeButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            setMode(btn.dataset.mode);
        });
    });
}

function bindInputEvents() {
    const debouncedCalc = debounce(runCalc, 250);

    numericInputs.forEach((input) => {
        input.addEventListener("input", debouncedCalc);
    });
}

function fillDemoData() {
    document.getElementById("buyRate").value = 30.5;
    document.getElementById("sellRate").value = 29.8;
    document.getElementById("stockBuyPercent").value = 100;
    document.getElementById("stockPercent").value = 8;

    setMode("percent");
}

function toggleGuide() {
    const content = document.getElementById("guideContent");
    const icon = document.getElementById("guideIcon");
    const isHidden = content.classList.toggle("hidden");

    icon.innerText = isHidden ? "▲" : "▼";
}

function initPage() {
    bindModeEvents();
    bindInputEvents();

    demoBtn?.addEventListener("click", fillDemoData);

    resetResult();
    fillDemoData();
}

document.addEventListener("DOMContentLoaded", initPage);
