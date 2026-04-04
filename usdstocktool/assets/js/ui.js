const getNumber = (id) => {
    const el = document.getElementById(id);
    if (!el) return NaN;
    return Number(el.value);
};

const fmtRate = (rate) => `${(rate * 100).toFixed(2)}%`;

const statusMap = {
    red: {
        text: "可能虧損",
        toneClass: "status-red",
        badge: "高風險",
        badgeClass: "badge-red"
    },
    yellow: {
        text: "剛好打平",
        toneClass: "status-yellow",
        badge: "邊界",
        badgeClass: "badge-yellow"
    },
    green: {
        text: "相對安全",
        toneClass: "status-green",
        badge: "OK",
        badgeClass: "badge-green"
    }
};

function runCalc() {
    const buyRate = getNumber("buyRate");
    const sellRate = getNumber("sellRate");

    if (!isValidNumber(buyRate) || !isValidNumber(sellRate)) {
        renderEmpty("請輸入匯率");
        return;
    }

    const fxLossRate = calcFxLossRate(buyRate, sellRate);
    const breakEven = calcBreakEvenStockRate(buyRate, sellRate);
    const safeBreakEven = addSafetyMargin(breakEven);

    let expectedStockRate = 0;
    const isPriceMode = !document.getElementById("priceMode").classList.contains("hidden");

    if (isPriceMode) {
        const stockBuy = getNumber("stockBuy");
        const stockSell = getNumber("stockSell");

        if (!isValidNumber(stockBuy) || !isValidNumber(stockSell)) {
            renderEmpty("請輸入股價");
            return;
        }

        expectedStockRate = calcStockGainRate(stockBuy, stockSell);
    } else {
        const stockBuy = getNumber("stockBuyPercent");
        const stockPercent = getNumber("stockPercent");

        if (!isValidNumber(stockBuy) || !isValidNumber(stockPercent)) {
            renderEmpty("請輸入股價與報酬率");
            return;
        }

        expectedStockRate = stockPercent / 100;
    }

    const status = judgeResult(expectedStockRate, breakEven, safeBreakEven);

    renderResult({
        expectedStockRate,
        fxLossRate,
        breakEven,
        safeBreakEven,
        status
    });
}

function renderResult(data) {
    const { expectedStockRate, fxLossRate, breakEven, safeBreakEven, status } = data;
    const main = document.getElementById("resultMain");
    const statusEl = document.getElementById("resultStatus");
    const badge = document.getElementById("resultBadge");
    const cfg = statusMap[status];

    main.innerText = fmtRate(expectedStockRate);
    main.className = `result-main ${cfg.toneClass}`;

    statusEl.innerText = cfg.text;
    statusEl.className = `result-status ${cfg.toneClass}`;

    badge.innerText = cfg.badge;
    badge.className = `result-badge ${cfg.badgeClass}`;

    document.getElementById("fxLoss").innerText = fmtRate(fxLossRate);
    document.getElementById("breakEven").innerText = fmtRate(breakEven);
    document.getElementById("safe").innerText = fmtRate(safeBreakEven);
}

function renderEmpty(message) {
    document.getElementById("resultMain").innerText = "--";
    document.getElementById("resultMain").className = "result-main";

    document.getElementById("resultStatus").innerText = message;
    document.getElementById("resultStatus").className = "result-status";

    document.getElementById("resultBadge").innerText = "";
    document.getElementById("resultBadge").className = "result-badge hidden";

    document.getElementById("fxLoss").innerText = "";
    document.getElementById("breakEven").innerText = "";
    document.getElementById("safe").innerText = "";
}

function resetResult() {
    renderEmpty("請輸入數值");
}
