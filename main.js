// ===== 卡片收合功能 =====
function toggleCard(headerElement) {
    const cardElement = headerElement.closest('.card');
    if (cardElement) {
        cardElement.classList.toggle('collapsed');
        // 保存收合狀態到 localStorage
        const isCollapsed = cardElement.classList.contains('collapsed');
        const cardIndex = Array.from(document.querySelectorAll('.card')).indexOf(cardElement);
        localStorage.setItem(`card-${cardIndex}-collapsed`, isCollapsed);
    }
}

// 在頁面載入時恢復收合狀態
function restoreCardStates() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        const wasCollapsed = localStorage.getItem(`card-${index}-collapsed`) === 'true';
        if (wasCollapsed) {
            card.classList.add('collapsed');
        }
    });
}

// 當頁面載入完成時恢復收合狀態
document.addEventListener('DOMContentLoaded', restoreCardStates);

const getNumber = (id) => {
    const el = document.getElementById(id);
    if (!el) return NaN;
    const value = Number(el.value);
    return value;
};

const fmtRate = (rate) => `${(rate * 100).toFixed(2)}%`;

function runCalc() {
    const mode = document.getElementById("calcMode").value;
    const resultEl = document.getElementById("result");

    const buyRate = getNumber("buyRate");
    const sellRate = getNumber("sellRate");

    if (!isValidNumber(buyRate) || !isValidNumber(sellRate)) {
        resultEl.innerText = "請輸入有效的匯率";
        applyStatusColor();
        return;
    }

    const fxLossRate = calcFxLossRate(buyRate, sellRate);
    const breakEven = calcBreakEvenStockRate(buyRate, sellRate);
    const safeBreakEven = addSafetyMargin(breakEven);

    let expectedStockRate = 0;
    const lines = [];

    lines.push(`匯差損失率: ${fmtRate(fxLossRate)}`);
    lines.push(`股票保本報酬率: ${fmtRate(breakEven)}`);
    lines.push(`股票安全報酬率: ${fmtRate(safeBreakEven)}`);

    if (mode === "price") {
        const stockBuy = getNumber("stockBuy");
        const stockSell = getNumber("stockSell");

        if (!isValidNumber(stockBuy) || !isValidNumber(stockSell)) {
            resultEl.innerText = "請輸入有效的股價";
            applyStatusColor();
            return;
        }

        expectedStockRate = calcStockGainRate(stockBuy, stockSell);
        lines.push(`預期股票報酬率: ${fmtRate(expectedStockRate)}`);
    } else {
        const stockBuy = getNumber("stockBuyPercent");
        const stockPercent = getNumber("stockPercent");

        if (!isValidNumber(stockBuy) || !isValidNumber(stockPercent)) {
            resultEl.innerText = "請輸入有效的股價與報酬率";
            applyStatusColor();
            return;
        }

        expectedStockRate = stockPercent / 100;
        const estimatedSell = stockBuy * (1 + expectedStockRate);
        lines.push(`預期股票報酬率: ${fmtRate(expectedStockRate)}`);
        lines.push(`估算賣出價: ${estimatedSell.toFixed(2)}`);
    }

    const status = judgeResult(expectedStockRate, breakEven, safeBreakEven);
    applyStatusColor(status);

    resultEl.innerText = lines.join("\n");
}
