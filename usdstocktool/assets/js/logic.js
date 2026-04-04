function calcFxLossRate(buyRate, sellRate) {
    if (buyRate <= 0 || sellRate <= 0) return 0;
    return (buyRate - sellRate) / buyRate;
}

function calcBreakEvenStockRate(buyRate, sellRate) {
    if (buyRate <= 0 || sellRate <= 0) return 0;
    return buyRate / sellRate - 1;
}

function addSafetyMargin(rate, margin = 0.02) {
    return rate + margin;
}

function calcStockGainRate(buyPrice, sellPrice) {
    if (buyPrice <= 0 || sellPrice <= 0) return 0;
    return (sellPrice - buyPrice) / buyPrice;
}

function judgeResult(expectedStockRate, breakEven, safeBreakEven) {
    if (expectedStockRate < breakEven) return "red";
    if (expectedStockRate < safeBreakEven) return "yellow";
    return "green";
}

function isValidNumber(value) {
    return typeof value === "number" && !isNaN(value) && value > 0;
}
