const calcModeSelect = document.getElementById("calcMode");
const priceMode = document.getElementById("priceMode");
const percentMode = document.getElementById("percentMode");
const resultEl = document.getElementById("result");
const statusIcon = document.getElementById("statusIcon");
const calcBtn = document.getElementById("calcBtn");
const demoBtn = document.getElementById("demoBtn");

calcModeSelect.addEventListener("change", switchMode);
calcBtn.addEventListener("click", runCalc);
demoBtn.addEventListener("click", fillDemoData);

function switchMode() {
    const mode = calcModeSelect.value;

    priceMode.classList.toggle("hidden", mode !== "price");
    percentMode.classList.toggle("hidden", mode !== "percent");

    resetResult();
}

switchMode();

function resetResult() {
    resultEl.innerText = "";
    statusIcon.style.backgroundColor = "#ccc";
}
function applyStatusColor(status) {
    const map = {
        red: "#e74c3c",
        yellow: "#f1c40f",
        green: "#2ecc71"
    };
    statusIcon.style.backgroundColor = map[status] ?? "#ccc";
}

function fillDemoData(){
    // 範例情境（可自行調整）
    // 假設：30.5 買美元，29.8 賣美元，股票漲 8%
    document.getElementById("buyRate").value = 30.5;
    document.getElementById("sellRate").value = 29.8;

    // 切到「漲幅模式」
    calcModeSelect.value = "percent";
    switchMode();

    document.getElementById("stockBuyPercent").value = 100;
    document.getElementById("stockPercent").value = 8;

    resetResult();
}
