const SUPPLEMENTAL_PREMIUM_RATE = 0.0211;
const MONTHLY_INCOME_TARGET = 10000;

function calcGrossDividend(twdAmount, dividendRate) {
    if (twdAmount <= 0 || dividendRate < 0) return 0;
    return twdAmount * dividendRate;
}

function calcSupplementalPremium(grossDividend, enabled) {
    if (!enabled || grossDividend <= 0) return 0;
    return grossDividend * SUPPLEMENTAL_PREMIUM_RATE;
}

function calcEtfExpense(twdAmount, expenseRate) {
    if (twdAmount <= 0 || expenseRate < 0) return 0;
    return twdAmount * expenseRate;
}

function calcTradeFee(twdAmount, tradeFeeRate) {
    if (twdAmount <= 0 || tradeFeeRate < 0) return 0;
    return twdAmount * tradeFeeRate;
}

function calcNavChangeImpact(twdAmount, navChangeRate) {
    if (twdAmount <= 0) return 0;
    return twdAmount * navChangeRate;
}

function calcNetAnnualIncome(grossDividend, supplementalPremium) {
    return grossDividend - supplementalPremium;
}

function calcTotalReturn(netAnnualIncome, navChangeImpact, tradeFee, etfExpense) {
    return netAnnualIncome + navChangeImpact - tradeFee - etfExpense;
}

function calcActualReturnRate(totalReturn, twdAmount) {
    if (twdAmount <= 0) return 0;
    return totalReturn / twdAmount;
}

function calcMonthlyCashflow(netAnnualIncome) {
    return netAnnualIncome / 12;
}

function judgeResult(actualReturnRate) {
    if (actualReturnRate < 0.02) return "red";
    if (actualReturnRate < 0.04) return "yellow";
    return "green";
}

function hasMeaningfulMonthlyIncome(monthlyCashflow) {
    return monthlyCashflow >= MONTHLY_INCOME_TARGET;
}
