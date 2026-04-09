# Foreign Currency Time Deposit Return Calculator

## Tool Name

- 中文：外幣定存報酬試算器
- 英文：Foreign Currency Time Deposit Return Calculator

---

## Tool Purpose

幫助使用者評估外幣定存的真實報酬，避免只看到較高利率，卻忽略匯率變動帶來的影響。

工具需要幫助使用者快速判斷：

- 最終換回台幣後是否真的有賺
- 匯率是否已經吃掉利息
- 在什麼賣出匯率下會開始虧損

---

## Inputs

1. 投入金額（台幣）
   - type: `number`
   - example: `1000000`

2. 買入匯率（TWD / 外幣）
   - type: `number`
   - example: `30`
   - meaning: 換匯當下匯率

3. 定存利率（%）
   - type: `number`
   - example: `5`
   - meaning: 年利率

4. 存放期間（年）
   - type: `number`
   - example: `1`

5. 預期賣出匯率（TWD / 外幣）
   - type: `number`
   - example: `28` / `31`
   - meaning: 到期換回台幣的匯率

---

## Formula

### 基本假設

- 第一版採單利
- 不納入銀行手續費、換匯點差、稅負等成本
- 只計算定存利息與匯率變化對最終台幣金額的影響

### Calculation

- 原始外幣本金 = 投入金額（台幣） / 買入匯率
- 到期外幣本金 = 原始外幣本金 × (1 + 年利率 × 年數)
- 最終金額（台幣） = 到期外幣本金 × 預期賣出匯率
- 總報酬率 = (最終金額 / 原始投入台幣) - 1
- 外幣利息 = 到期外幣本金 - 原始外幣本金
- 利息貢獻 = (外幣利息 × 買入匯率) / 原始投入台幣
- 匯率影響 = 總報酬率 - 利息貢獻
- 保本匯率 = 原始投入台幣 / 到期外幣本金

---

## Results

### 主結果

- 最終金額（台幣）
- 總報酬率（%）

### 收益拆解

- 利息貢獻（+X%）
- 匯率影響（±X%）

### 關鍵指標

- 保本匯率（Break-even Rate）
- 當賣出匯率低於保本匯率時，整體開始虧損

---

## Status Signal

### Green

- condition: `總報酬率 > 2%`
- label: `安全`
- message: `匯率變動仍在可承受範圍，整體為正報酬`

### Yellow

- condition: `-2% <= 總報酬率 <= 2%`
- label: `臨界`
- message: `匯率已接近吃掉利息，報酬不穩定`

### Red

- condition: `總報酬率 < -2%`
- label: `風險`
- message: `匯率跌幅已超過利息收益，整體可能虧損`

---

## Explanation Copy

說明區必須明寫：

`本工具目前未納入銀行手續費、換匯點差、稅負等成本，結果適合用於快速評估，不代表實際入帳金額。`

---

## Category

- Investment Tools
