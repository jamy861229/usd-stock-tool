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
    red: {
        text: "可能為高配息但低報酬",
        toneClass: "status-red",
        badge: "偏低",
        badgeClass: "badge-red"
    },
    yellow: {
        text: "需評估配息穩定性",
        toneClass: "status-yellow",
        badge: "普通",
        badgeClass: "badge-yellow"
    },
    green: {
        text: "配息與報酬具吸引力",
        toneClass: "status-green",
        badge: "可行",
        badgeClass: "badge-green"
    }
};

function readRequiredNumber(id) {
    const input = document.getElementById(id);
    if (!input) return NaN;
    const raw = input.value.trim();
    if (!raw) return NaN;
    return Number(raw);
}

function readOptionalPercent(id) {
    const input = document.getElementById(id);
    if (!input) return 0;
    const raw = input.value.trim();
    if (!raw) return 0;
    return Number(raw);
}

function isPositiveNumber(value) {
    return typeof value === "number" && !Number.isNaN(value) && value > 0;
}

function isValidPercent(value) {
    return typeof value === "number" && !Number.isNaN(value);
}

function buildInterpretation({ actualReturnRate, monthlyCashflow, etfExpense, supplementalPremium, navChangeImpact }) {
    if (actualReturnRate >= 0.04) {
        return `此 ETF 在該配息情境下具現金流價值，每月平均約 ${currencyFormatter.format(monthlyCashflow)}`;
    }

    if (etfExpense + supplementalPremium > 0 && actualReturnRate < 0.04) {
        return "配息看似不錯，但費用與補充保費已壓低報酬";
    }

    if (navChangeImpact < 0) {
        return "淨值下跌吃掉部分配息，整體報酬需保守看待";
    }

    return "整體報酬偏低，可能不適合只因配息而長期持有";
}

function runCalc() {
    const twdAmount = readRequiredNumber("twdAmount");
    const dividendRatePercent = readRequiredNumber("dividendRate");
    const expenseRatePercent = readOptionalPercent("expenseRate");
    const tradeFeeRatePercent = readOptionalPercent("tradeFeeRate");
    const navChangeRatePercent = readOptionalPercent("navChangeRate");
    const useSupplementalPremium = document.getElementById("useSupplementalPremium").checked;

    if (!isPositiveNumber(twdAmount) || !isPositiveNumber(dividendRatePercent)) {
        renderEmpty("請輸入有效的投入金額與配息率");
        return;
    }

    if (![expenseRatePercent, tradeFeeRatePercent, navChangeRatePercent].every(isValidPercent)) {
        renderEmpty("選填百分比請輸入有效數字");
        return;
    }

    if (expenseRatePercent < 0 || tradeFeeRatePercent < 0) {
        renderEmpty("費用率與手續費不可小於 0");
        return;
    }

    const dividendRate = dividendRatePercent / 100;
    const expenseRate = expenseRatePercent / 100;
    const tradeFeeRate = tradeFeeRatePercent / 100;
    const navChangeRate = navChangeRatePercent / 100;

    const grossDividend = calcGrossDividend(twdAmount, dividendRate);
    const supplementalPremium = calcSupplementalPremium(grossDividend, useSupplementalPremium);
    const etfExpense = calcEtfExpense(twdAmount, expenseRate);
    const tradeFee = calcTradeFee(twdAmount, tradeFeeRate);
    const navChangeImpact = calcNavChangeImpact(twdAmount, navChangeRate);
    const netAnnualIncome = calcNetAnnualIncome(grossDividend, supplementalPremium);
    const totalReturn = calcTotalReturn(netAnnualIncome, navChangeImpact, tradeFee, etfExpense);
    const actualReturnRate = calcActualReturnRate(totalReturn, twdAmount);
    const monthlyCashflow = calcMonthlyCashflow(netAnnualIncome);
    const status = judgeResult(actualReturnRate);
    const hitsTarget = hasMeaningfulMonthlyIncome(monthlyCashflow);

    renderResult({
        twdAmount,
        grossDividend,
        supplementalPremium,
        etfExpense,
        tradeFee,
        navChangeImpact,
        netAnnualIncome,
        actualReturnRate,
        monthlyCashflow,
        hitsTarget,
        status
    });
}

function renderResult(data) {
    const {
        twdAmount,
        grossDividend,
        supplementalPremium,
        etfExpense,
        tradeFee,
        navChangeImpact,
        netAnnualIncome,
        actualReturnRate,
        monthlyCashflow,
        hitsTarget,
        status
    } = data;
    const cfg = statusMap[status];
    const resultNote = buildInterpretation({
        actualReturnRate,
        monthlyCashflow,
        etfExpense,
        supplementalPremium,
        navChangeImpact
    });

    document.getElementById("resultSummary").innerText = `每月平均現金流 ${currencyFormatter.format(monthlyCashflow)}`;

    const main = document.getElementById("resultMain");
    main.innerText = currencyFormatter.format(monthlyCashflow);
    main.className = `result-main ${cfg.toneClass}`;

    const statusEl = document.getElementById("resultStatus");
    statusEl.innerText = cfg.text;
    statusEl.className = `result-status ${cfg.toneClass}`;

    const badge = document.getElementById("resultBadge");
    badge.innerText = cfg.badge;
    badge.className = `result-badge ${cfg.badgeClass}`;

    document.getElementById("resultNote").innerText = resultNote;
    document.getElementById("netAnnualIncome").innerText = currencyFormatter.format(netAnnualIncome);
    document.getElementById("actualReturnRate").innerText = percentFormatter(actualReturnRate);
    document.getElementById("grossDividend").innerText = impactLine(grossDividend, grossDividend / twdAmount);
    document.getElementById("expenseImpact").innerText = impactLine(-etfExpense, -etfExpense / twdAmount);
    document.getElementById("premiumImpact").innerText = impactLine(-supplementalPremium, -supplementalPremium / twdAmount);
    document.getElementById("navImpact").innerText = impactLine(navChangeImpact, navChangeImpact / twdAmount);
    document.getElementById("tradeFeeImpact").innerText = impactLine(-tradeFee, -tradeFee / twdAmount);
    document.getElementById("incomeSignal").innerText = hitsTarget ? "達到每月 1 萬" : "未達每月 1 萬";
}

function renderEmpty(message) {
    document.getElementById("resultSummary").innerText = "每月平均現金流 --";
    document.getElementById("resultMain").innerText = "--";
    document.getElementById("resultMain").className = "result-main";

    document.getElementById("resultStatus").innerText = message;
    document.getElementById("resultStatus").className = "result-status";

    document.getElementById("resultBadge").innerText = "";
    document.getElementById("resultBadge").className = "result-badge hidden";

    document.getElementById("resultNote").innerText = "輸入情境後，這裡會說明配息是否仍有吸引力";
    document.getElementById("netAnnualIncome").innerText = "";
    document.getElementById("actualReturnRate").innerText = "";
    document.getElementById("grossDividend").innerText = "";
    document.getElementById("expenseImpact").innerText = "";
    document.getElementById("premiumImpact").innerText = "";
    document.getElementById("navImpact").innerText = "";
    document.getElementById("tradeFeeImpact").innerText = "";
    document.getElementById("incomeSignal").innerText = "";
}

function resetResult() {
    renderEmpty("請輸入數值");
}
