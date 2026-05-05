const getNumber = (id) => {
    const el = document.getElementById(id);
    if (!el) return NaN;
    const raw = el.value.trim();
    if (!raw) return NaN;
    return Number(raw);
};

const getOptionalNumber = (id) => {
    const el = document.getElementById(id);
    if (!el) return null;
    const raw = el.value.trim();
    if (!raw) return null;
    return Number(raw);
};

const currencyFormatter = new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0
});

function percentFormatter(value) {
    if (Object.is(value, -0) || value === 0) return "0.00%";
    return `${value > 0 ? "+" : ""}${(value * 100).toFixed(2)}%`;
}

function signedCurrencyFormatter(value) {
    if (Object.is(value, -0) || value === 0) return currencyFormatter.format(0);
    const amount = currencyFormatter.format(Math.abs(value));
    return `${value > 0 ? "+" : "-"}${amount}`;
}

function impactLine(amount, rate) {
    return `${signedCurrencyFormatter(amount)} / ${percentFormatter(rate)}`;
}

const statusMap = {
    green: {
        text: "成本門檻低，較容易先賺回成本",
        toneClass: "status-green",
        badge: "低成本",
        badgeClass: "badge-green"
    },
    yellow: {
        text: "成本有感，需要確認報酬空間是否足夠",
        toneClass: "status-yellow",
        badge: "中等",
        badgeClass: "badge-yellow"
    },
    red: {
        text: "成本偏高，小幅報酬可能先被成本吃掉",
        toneClass: "status-red",
        badge: "偏高",
        badgeClass: "badge-red"
    }
};

function isPositiveNumber(value) {
    return typeof value === "number" && !Number.isNaN(value) && value > 0;
}

function isNonNegativeNumber(value) {
    return typeof value === "number" && !Number.isNaN(value) && value >= 0;
}

function buildInterpretation({ breakEvenReturnRate, useSupplementalPremium, includeSellCost }) {
    const formattedRate = percentFormatter(breakEvenReturnRate);
    const scopeText = includeSellCost
        ? "此為完整交易門檻，包含進出成本"
        : "此為初步門檻，未包含完整交易成本";

    if (breakEvenReturnRate <= 0.02) {
        return `${scopeText}，成本門檻約 ${formattedRate}`;
    }

    if (breakEvenReturnRate <= 0.05) {
        return `${scopeText}，需要先賺回約 ${formattedRate}，成本已經需要納入決策`;
    }

    if (useSupplementalPremium) {
        return `${scopeText}，成本門檻達 ${formattedRate}，補充保費會讓需要的毛報酬率再提高`;
    }

    return `${scopeText}，成本門檻達 ${formattedRate}，可能會吃掉小幅報酬`;
}

function runCalc() {
    const twdAmount = getNumber("twdAmount");
    const tradeFeeRatePercent = getNumber("tradeFeeRate");
    const expenseRatePercent = getNumber("expenseRate");
    const unitPrice = getOptionalNumber("unitPrice");
    const includeSellCost = document.getElementById("includeSellCost").checked;
    const useSupplementalPremium = document.getElementById("useSupplementalPremium").checked;

    if (!isPositiveNumber(twdAmount)) {
        renderEmpty("請輸入有效的投入金額");
        return;
    }

    if (![tradeFeeRatePercent, expenseRatePercent].every(isNonNegativeNumber)) {
        renderEmpty("手續費率與 ETF 費用率需為 0 或正數");
        return;
    }

    if (unitPrice !== null && !isPositiveNumber(unitPrice)) {
        renderEmpty("價格需為大於 0 的數字");
        return;
    }

    const tradeFeeRate = tradeFeeRatePercent / 100;
    const expenseRate = expenseRatePercent / 100;
    const buyTradeFeeAmount = calcTradeFeeAmount(twdAmount, tradeFeeRate);
    const sellTradeFeeAmount = calcSellTradeFeeAmount(twdAmount, tradeFeeRate, includeSellCost);
    const transactionTaxAmount = calcTransactionTaxAmount(twdAmount, includeSellCost);
    const totalTransactionCostAmount = calcTotalTransactionCostAmount(
        buyTradeFeeAmount,
        sellTradeFeeAmount,
        transactionTaxAmount
    );
    const expenseAmount = calcEtfExpenseAmount(twdAmount, expenseRate);
    const baseCostRate = calcBaseCostRate(totalTransactionCostAmount, expenseAmount, twdAmount);
    const breakEvenReturnRate = calcBreakEvenReturnRate(baseCostRate, useSupplementalPremium);
    const requiredReturnAmount = calcRequiredReturnAmount(twdAmount, breakEvenReturnRate);
    const premiumImpact = calcSupplementalPremiumImpact(requiredReturnAmount, useSupplementalPremium);
    const unitPriceRise = unitPrice === null ? null : calcUnitPriceRise(unitPrice, breakEvenReturnRate);
    const status = judgeResult(breakEvenReturnRate);

    renderResult({
        twdAmount,
        tradeFeeRate,
        expenseRate,
        buyTradeFeeAmount,
        sellTradeFeeAmount,
        transactionTaxAmount,
        totalTransactionCostAmount,
        expenseAmount,
        baseCostRate,
        breakEvenReturnRate,
        requiredReturnAmount,
        premiumImpact,
        unitPriceRise,
        includeSellCost,
        useSupplementalPremium,
        status
    });
}

function renderResult(data) {
    const {
        twdAmount,
        tradeFeeRate,
        expenseRate,
        buyTradeFeeAmount,
        sellTradeFeeAmount,
        transactionTaxAmount,
        expenseAmount,
        baseCostRate,
        breakEvenReturnRate,
        requiredReturnAmount,
        premiumImpact,
        unitPriceRise,
        includeSellCost,
        useSupplementalPremium,
        status
    } = data;
    const cfg = statusMap[status];

    document.getElementById("resultSummary").innerText = `需要先賺回 ${currencyFormatter.format(requiredReturnAmount)}`;

    const main = document.getElementById("resultMain");
    main.innerText = percentFormatter(breakEvenReturnRate);
    main.className = `result-main ${cfg.toneClass}`;

    const statusEl = document.getElementById("resultStatus");
    statusEl.innerText = cfg.text;
    statusEl.className = `result-status ${cfg.toneClass}`;

    const badge = document.getElementById("resultBadge");
    badge.innerText = cfg.badge;
    badge.className = `result-badge ${cfg.badgeClass}`;

    document.getElementById("resultNote").innerText = buildInterpretation({
        breakEvenReturnRate,
        useSupplementalPremium,
        includeSellCost
    });
    document.getElementById("breakEvenRate").innerText = percentFormatter(breakEvenReturnRate);
    document.getElementById("requiredReturnAmount").innerText = currencyFormatter.format(requiredReturnAmount);
    document.getElementById("unitPriceRise").innerText = unitPriceRise === null
        ? "未輸入價格"
        : currencyFormatter.format(unitPriceRise);
    document.getElementById("costMode").innerText = includeSellCost
        ? "已包含完整交易成本（含交易稅）"
        : "目前僅估算買入成本";
    document.getElementById("buyFeeImpact").innerText = impactLine(-buyTradeFeeAmount, -tradeFeeRate);
    document.getElementById("sellCostImpact").innerText = includeSellCost
        ? impactLine(-(sellTradeFeeAmount + transactionTaxAmount), -(tradeFeeRate + TRANSACTION_TAX_RATE))
        : "未包含";
    document.getElementById("expenseImpact").innerText = impactLine(-expenseAmount, -expenseRate);
    document.getElementById("premiumImpact").innerText = useSupplementalPremium
        ? impactLine(-premiumImpact, -premiumImpact / twdAmount)
        : "未扣除";
    document.getElementById("baseCostRate").innerText = percentFormatter(baseCostRate);
}

function renderEmpty(message) {
    document.getElementById("resultSummary").innerText = "需要先賺回 --";
    document.getElementById("resultMain").innerText = "--";
    document.getElementById("resultMain").className = "result-main";

    document.getElementById("resultStatus").innerText = message;
    document.getElementById("resultStatus").className = "result-status";

    document.getElementById("resultBadge").innerText = "";
    document.getElementById("resultBadge").className = "result-badge hidden";

    document.getElementById("resultNote").innerText = "輸入條件後，這裡會說明成本門檻是否偏高";
    document.getElementById("breakEvenRate").innerText = "";
    document.getElementById("requiredReturnAmount").innerText = "";
    document.getElementById("unitPriceRise").innerText = "";
    document.getElementById("costMode").innerText = "";
    document.getElementById("buyFeeImpact").innerText = "";
    document.getElementById("sellCostImpact").innerText = "";
    document.getElementById("expenseImpact").innerText = "";
    document.getElementById("premiumImpact").innerText = "";
    document.getElementById("baseCostRate").innerText = "";
}

function resetResult() {
    renderEmpty("請輸入數值");
}
