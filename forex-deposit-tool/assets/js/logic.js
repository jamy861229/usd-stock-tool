function calcForeignPrincipal(twdAmount, buyRate) {
    if (twdAmount <= 0 || buyRate <= 0) return 0;
    return twdAmount / buyRate;
}

function calcMaturityForeignPrincipal(foreignPrincipal, annualRate, years) {
    if (foreignPrincipal <= 0 || annualRate < 0 || years <= 0) return 0;
    return foreignPrincipal * (1 + annualRate * years);
}

function calcFinalTwd(maturityForeignPrincipal, sellRate) {
    if (maturityForeignPrincipal <= 0 || sellRate <= 0) return 0;
    return maturityForeignPrincipal * sellRate;
}

function calcTotalReturnRate(twdAmount, finalTwd) {
    if (twdAmount <= 0 || finalTwd <= 0) return 0;
    return finalTwd / twdAmount - 1;
}

function calcInterestContribution(twdAmount, buyRate, foreignPrincipal, maturityForeignPrincipal) {
    if (twdAmount <= 0 || buyRate <= 0) return 0;
    const interestForeign = maturityForeignPrincipal - foreignPrincipal;
    return (interestForeign * buyRate) / twdAmount;
}

function calcFxImpact(totalReturnRate, interestContributionRate) {
    return totalReturnRate - interestContributionRate;
}

function calcBreakEvenSellRate(twdAmount, maturityForeignPrincipal) {
    if (twdAmount <= 0 || maturityForeignPrincipal <= 0) return 0;
    return twdAmount / maturityForeignPrincipal;
}

function judgeResult(totalReturnRate) {
    if (totalReturnRate < -0.02) return 'red';
    if (totalReturnRate <= 0.02) return 'yellow';
    return 'green';
}

function isValidNumber(value) {
    return typeof value === 'number' && !Number.isNaN(value) && value > 0;
}
