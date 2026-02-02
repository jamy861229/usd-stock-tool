const calcModeSelect = document.getElementById("calcMode");
const priceMode = document.getElementById("priceMode");
const percentMode = document.getElementById("percentMode");
const resultEl = document.getElementById("result");
const statusIcon = document.getElementById("statusIcon");
const calcBtn = document.getElementById("calcBtn");

calcModeSelect.addEventListener("change", switchMode);
calcBtn.addEventListener("click", runCalc);

function switchMode() {
    const mode = calcModeSelect.value;

    priceMode.style.display = mode === "price" ? "block" : "none";
    percentMode.style.display = mode === "percent" ? "block" : "none";

    resetResult();
}

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
