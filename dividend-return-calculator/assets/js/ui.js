const currencyFormatter = new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0
});

const percentFormatter = (value) => `${value >= 0 ? "+" : ""}${(value * 100).toFixed(2)}%`;
const sharesFormatter = new Intl.NumberFormat("zh-TW", {
    maximumFractionDigits: 1
});

const statusMap = {
    red: {
        text: "股息收入不具吸引力，可能不值得只為了配息投入",
        toneClass: "status-red",
        badge: "偏低",
        badgeClass: "badge-red"
    },
    yellow: {
        text: "報酬有限，還需要評估是否符合你的現金流目標",
        toneClass: "status-yellow",
        badge: "普通",
        badgeClass: "badge-yellow"
    },
    green: {
        text: "股息收入穩定且具吸引力，適合作為現金流來源",
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

function readOptionalNumber(id) {
    const input = document.getElementById(id);
    if (!input) return null;
    const raw = input.value.trim();
    if (!raw) return null;
    return Number(raw);
}

function isPositiveNumber(value) {
    return typeof value === "number" && !Number.isNaN(value) && value > 0;
}

function isNonNegativeNumber(value) {
    return typeof value === "number" && !Number.isNaN(value) && value >= 0;
}

function buildInterpretation({ actualReturnRate, monthlyCashflow, hitsTarget, costAmount, premiumAmount }) {
    if (actualReturnRate >= 0.04 && hitsTarget) {
        return `每月平均約 ${currencyFormatter.format(monthlyCashflow)}，已達有感收入門檻，適合拿來評估配息現金流策略`;
    }

    if (actualReturnRate >= 0.04) {
        return `整體報酬仍具吸引力，但每月平均約 ${currencyFormatter.format(monthlyCashflow)}，離你想像中的被動收入可能還有一段距離`;
    }

    if (costAmount > premiumAmount) {
        return `成本壓力比補充保費估算更明顯，每月平均僅約 ${currencyFormatter.format(monthlyCashflow)}，需要先確認這筆投入是否值得`;
    }

    return `補充保費估算與成本已明顯壓低報酬，每月平均約 ${currencyFormatter.format(monthlyCashflow)}，可能無法達到預期的被動收入效果`;
}

function runCalc() {
    const twdAmount = readRequiredNumber("twdAmount");
    const yieldRatePercent = readRequiredNumber("yieldRate");
    const stockPrice = readOptionalNumber("stockPrice");
    const feeRatePercent = readOptionalPercent("feeRate");
    const premiumRatePercent = readOptionalPercent("premiumRate");

    if (!isPositiveNumber(twdAmount) || !isPositiveNumber(yieldRatePercent)) {
        renderEmpty("請先輸入完整且有效的投入金額與殖利率");
        return;
    }

    if (stockPrice !== null && !isPositiveNumber(stockPrice)) {
        renderEmpty("若要估算股數，投資標的價格必須大於 0");
        return;
    }

    if (![feeRatePercent, premiumRatePercent].every(isNonNegativeNumber)) {
        renderEmpty("成本與補充保費估算率需為 0 或正數");
        return;
    }

    const yieldRate = yieldRatePercent / 100;
    const feeRate = feeRatePercent / 100;
    const premiumRate = premiumRatePercent / 100;
    const grossDividend = calcGrossDividend(twdAmount, yieldRate);
    const costAmount = calcCostAmount(twdAmount, feeRate);
    const premiumAmount = calcSupplementalPremiumAmount(grossDividend, premiumRate);
    const netAnnualIncome = calcNetAnnualIncome(grossDividend, costAmount, premiumAmount);
    const actualReturnRate = calcActualReturnRate(netAnnualIncome, twdAmount);
    const monthlyCashflow = calcMonthlyCashflow(netAnnualIncome);
    const estimatedShares = calcEstimatedShares(twdAmount, stockPrice);
    const status = judgeResult(actualReturnRate);
    const hitsTarget = hasMeaningfulMonthlyIncome(monthlyCashflow);

    renderResult({
        twdAmount,
        grossDividend,
        costAmount,
        netAnnualIncome,
        actualReturnRate,
        monthlyCashflow,
        premiumAmount,
        estimatedShares,
        hitsTarget,
        status
    });
}

function renderResult(data) {
    const {
        twdAmount,
        grossDividend,
        costAmount,
        netAnnualIncome,
        actualReturnRate,
        monthlyCashflow,
        premiumAmount,
        estimatedShares,
        hitsTarget,
        status
    } = data;
    const cfg = statusMap[status];
    const resultNote = buildInterpretation({
        actualReturnRate,
        monthlyCashflow,
        hitsTarget,
        costAmount,
        premiumAmount
    });

    document.getElementById("resultSummary").innerText = `年實際股息收入約 ${currencyFormatter.format(netAnnualIncome)}`;

    const main = document.getElementById("resultMain");
    main.innerText = percentFormatter(actualReturnRate);
    main.className = `result-main ${cfg.toneClass}`;

    const statusEl = document.getElementById("resultStatus");
    statusEl.innerText = cfg.text;
    statusEl.className = `result-status ${cfg.toneClass}`;

    const badge = document.getElementById("resultBadge");
    badge.innerText = cfg.badge;
    badge.className = `result-badge ${cfg.badgeClass}`;

    document.getElementById("resultNote").innerText = resultNote;
    document.getElementById("grossDividend").innerText = currencyFormatter.format(grossDividend);
    document.getElementById("premiumImpact").innerText = `-${currencyFormatter.format(premiumAmount)} / ${percentFormatter(-premiumAmount / twdAmount)}`;
    document.getElementById("costImpact").innerText = `-${currencyFormatter.format(costAmount)} / ${percentFormatter(-costAmount / twdAmount)}`;
    document.getElementById("monthlyCashflow").innerText = currencyFormatter.format(monthlyCashflow);
    document.getElementById("incomeThreshold").innerText = hitsTarget ? "已達月 1 萬" : "未達月 1 萬";
    document.getElementById("shareEstimate").innerText = estimatedShares === null
        ? "未填價格"
        : `約 ${sharesFormatter.format(estimatedShares)} 股`;
}

function renderEmpty(message) {
    document.getElementById("resultSummary").innerText = "年實際股息收入約 --";
    document.getElementById("resultMain").innerText = "--";
    document.getElementById("resultMain").className = "result-main";

    document.getElementById("resultStatus").innerText = message;
    document.getElementById("resultStatus").className = "result-status";

    document.getElementById("resultBadge").innerText = "";
    document.getElementById("resultBadge").className = "result-badge hidden";

    document.getElementById("resultNote").innerText = "每月平均現金流與收入門檻判斷會顯示在這裡";
    document.getElementById("grossDividend").innerText = "";
    document.getElementById("premiumImpact").innerText = "";
    document.getElementById("costImpact").innerText = "";
    document.getElementById("monthlyCashflow").innerText = "";
    document.getElementById("incomeThreshold").innerText = "";
    document.getElementById("shareEstimate").innerText = "";
}

function resetResult() {
    renderEmpty("請輸入數值");
}
