const SUPPLEMENTAL_PREMIUM_RATE = 0.0211;
const TRANSACTION_TAX_RATE = 0.003;

function calcTradeFeeAmount(twdAmount, tradeFeeRate) {
    if (twdAmount <= 0 || tradeFeeRate < 0) return 0;
    return twdAmount * tradeFeeRate;
}

function calcEtfExpenseAmount(twdAmount, expenseRate) {
    if (twdAmount <= 0 || expenseRate < 0) return 0;
    return twdAmount * expenseRate;
}

function calcSellTradeFeeAmount(twdAmount, tradeFeeRate, includeSellCost) {
    if (!includeSellCost || twdAmount <= 0 || tradeFeeRate < 0) return 0;
    return twdAmount * tradeFeeRate;
}

function calcTransactionTaxAmount(twdAmount, includeSellCost) {
    if (!includeSellCost || twdAmount <= 0) return 0;
    return twdAmount * TRANSACTION_TAX_RATE;
}

function calcTotalTransactionCostAmount(buyTradeFeeAmount, sellTradeFeeAmount, transactionTaxAmount) {
    return buyTradeFeeAmount + sellTradeFeeAmount + transactionTaxAmount;
}

function calcBaseCostRate(totalTransactionCostAmount, etfExpenseAmount, twdAmount) {
    if (twdAmount <= 0) return 0;
    return (totalTransactionCostAmount + etfExpenseAmount) / twdAmount;
}

function calcBreakEvenReturnRate(baseCostRate, useSupplementalPremium) {
    if (baseCostRate <= 0) return 0;
    if (!useSupplementalPremium) return baseCostRate;
    return baseCostRate / (1 - SUPPLEMENTAL_PREMIUM_RATE);
}

function calcRequiredReturnAmount(twdAmount, breakEvenReturnRate) {
    if (twdAmount <= 0 || breakEvenReturnRate <= 0) return 0;
    return twdAmount * breakEvenReturnRate;
}

function calcSupplementalPremiumImpact(requiredReturnAmount, useSupplementalPremium) {
    if (!useSupplementalPremium || requiredReturnAmount <= 0) return 0;
    return requiredReturnAmount * SUPPLEMENTAL_PREMIUM_RATE;
}

function calcUnitPriceRise(unitPrice, breakEvenReturnRate) {
    if (unitPrice <= 0 || breakEvenReturnRate <= 0) return null;
    return unitPrice * breakEvenReturnRate;
}

function judgeResult(breakEvenReturnRate) {
    if (breakEvenReturnRate <= 0.02) return "green";
    if (breakEvenReturnRate <= 0.05) return "yellow";
    return "red";
}
