const getNumber = (id) => {
    const el = document.getElementById(id);
    if (!el) return NaN;
    return Number(el.value);
};

const currencyFormatter = new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    maximumFractionDigits: 0
});

const percentFormatter = (value) => `${value >= 0 ? '+' : ''}${(value * 100).toFixed(2)}%`;
const rateFormatter = (value) => value > 0 ? value.toFixed(3) : '--';

const statusMap = {
    red: {
        text: '匯率跌幅已超過利息收益，整體可能虧損',
        toneClass: 'status-red',
        badge: '風險',
        badgeClass: 'badge-red'
    },
    yellow: {
        text: '匯率已接近吃掉利息，報酬不穩定',
        toneClass: 'status-yellow',
        badge: '臨界',
        badgeClass: 'badge-yellow'
    },
    green: {
        text: '匯率變動仍在可承受範圍，整體為正報酬',
        toneClass: 'status-green',
        badge: '安全',
        badgeClass: 'badge-green'
    }
};

function runCalc() {
    const twdAmount = getNumber('twdAmount');
    const buyRate = getNumber('buyRate');
    const interestRatePercent = getNumber('interestRate');
    const years = getNumber('years');
    const sellRate = getNumber('sellRate');

    if (![twdAmount, buyRate, interestRatePercent, years, sellRate].every(isValidNumber)) {
        renderEmpty('請輸入完整且有效的條件');
        return;
    }

    const annualRate = interestRatePercent / 100;
    const foreignPrincipal = calcForeignPrincipal(twdAmount, buyRate);
    const maturityForeignPrincipal = calcMaturityForeignPrincipal(foreignPrincipal, annualRate, years);
    const finalTwd = calcFinalTwd(maturityForeignPrincipal, sellRate);
    const totalReturnRate = calcTotalReturnRate(twdAmount, finalTwd);
    const interestContributionRate = calcInterestContribution(twdAmount, buyRate, foreignPrincipal, maturityForeignPrincipal);
    const fxImpactRate = calcFxImpact(totalReturnRate, interestContributionRate);
    const breakEvenSellRate = calcBreakEvenSellRate(twdAmount, maturityForeignPrincipal);
    const status = judgeResult(totalReturnRate);

    renderResult({
        finalTwd,
        totalReturnRate,
        interestContributionRate,
        fxImpactRate,
        breakEvenSellRate,
        status
    });
}

function renderResult(data) {
    const {
        finalTwd,
        totalReturnRate,
        interestContributionRate,
        fxImpactRate,
        breakEvenSellRate,
        status
    } = data;

    const main = document.getElementById('resultMain');
    const summary = document.getElementById('resultSummary');
    const statusEl = document.getElementById('resultStatus');
    const badge = document.getElementById('resultBadge');
    const cfg = statusMap[status];

    summary.innerText = `到期可換回 ${currencyFormatter.format(finalTwd)}`;
    main.innerText = percentFormatter(totalReturnRate);
    main.className = `result-main ${cfg.toneClass}`;

    statusEl.innerText = cfg.text;
    statusEl.className = `result-status ${cfg.toneClass}`;

    badge.innerText = cfg.badge;
    badge.className = `result-badge ${cfg.badgeClass}`;

    document.getElementById('finalAmount').innerText = currencyFormatter.format(finalTwd);
    document.getElementById('interestContribution').innerText = percentFormatter(interestContributionRate);
    document.getElementById('fxImpact').innerText = percentFormatter(fxImpactRate);
    document.getElementById('breakEvenRate').innerText = rateFormatter(breakEvenSellRate);
}

function renderEmpty(message) {
    document.getElementById('resultSummary').innerText = '到期可換回 --';
    document.getElementById('resultMain').innerText = '--';
    document.getElementById('resultMain').className = 'result-main';

    document.getElementById('resultStatus').innerText = message;
    document.getElementById('resultStatus').className = 'result-status';

    document.getElementById('resultBadge').innerText = '';
    document.getElementById('resultBadge').className = 'result-badge hidden';

    document.getElementById('finalAmount').innerText = '';
    document.getElementById('interestContribution').innerText = '';
    document.getElementById('fxImpact').innerText = '';
    document.getElementById('breakEvenRate').innerText = '';
}

function resetResult() {
    renderEmpty('請輸入數值');
}
