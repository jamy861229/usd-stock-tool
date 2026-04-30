# ETF Dividend Return Calculator

## Tool Name

- 中文：ETF 配息報酬試算器
- 英文：ETF Dividend Return Calculator

---

## Tool Purpose

幫助使用者在配息不固定的情況下，透過情境假設快速判斷：

> 幫我算這樣會不會划算

重點：

- 每月實際可領多少現金流
- 扣除費用後是否仍具吸引力
- 是否只是高配息但低報酬

---

## Inputs

1. 投入金額（台幣）
   - type: `number`
   - example: `1000000`

2. 預期年配息率（%）
   - type: `number`
   - example: `5`
   - meaning: 使用者假設的全年平均配息率

選填：

3. ETF 費用率（%）
   - type: `number`
   - example: `0.3`
   - meaning: 每年管理費（expense ratio），屬於內扣成本，降低整體報酬率，不額外從配息收取

4. 手續費（%）
   - type: `number`
   - default: `0.1425`
   - meaning: 一次性交易成本

5. 補充保費（開關）
   - default: off
   - rate: `2.11%`
   - meaning: 從配息中扣除

6. 預期淨值變化（%）
   - type: `number`
   - example: `-1` / `2`
   - meaning: 模擬價格上升或下跌

---

## Formula

- 年配息 = 投入金額 × 配息率
- 補充保費（若開）= 年配息 × 2.11%
- ETF 費用影響 = 投入金額 × 費用率
- 手續費 = 投入金額 × 手續費%
- 淨值變化影響 = 投入金額 × 淨值變化%
- 實際年收入 = 年配息 - 補充保費
- 總報酬 = 實際年收入 + 淨值變化影響 - 手續費 - ETF 費用影響
- 實際報酬率 = 總報酬 / 投入金額

---

## Results

### 主結果

- 每月平均現金流
- 年實際配息收入
- 實際報酬率

### 收益拆解

- 配息（+X%）
- ETF 費用影響（-X%）
- 補充保費（-X%）
- 淨值變化（±X%）
- 手續費（-X%）

### 關鍵指標

- 是否達到有感收入

---

## Status Signal

### Green

- condition: `報酬率 >= 4%`
- label: `可行`
- message: `配息與報酬具吸引力`

### Yellow

- condition: `2% <= 報酬率 < 4%`
- label: `普通`
- message: `需評估配息穩定性`

### Red

- condition: `報酬率 < 2%`
- label: `偏低`
- message: `可能為高配息但低報酬`

---

## Result Interpretation

必須產出一句結論，例如：

- 此 ETF 在該配息情境下具現金流價值
- 配息看似高，但費用已壓低報酬
- 整體報酬偏低，可能不適合長期持有

---

## Explanation Copy

ETF 配息不固定，本工具使用使用者假設的年配息率進行情境模擬，
未納入完整稅制與市場波動，僅用於快速評估

本工具以年配息率進行估算，等價於以每股配息與股價推算之結果，
用於簡化計算與快速判斷

---

## Category

- Investment Tools
