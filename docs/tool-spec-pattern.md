# Tool Spec Pattern

## Tool Name

- 中文：
- 英文：

---

## Tool Purpose

描述這個工具解決什麼「決策問題」

必須回答：

> 幫我算這樣會不會划算

---

## Inputs

列出所有輸入欄位：

- name
- type
- example
- meaning

規則：

- 保持最少欄位
- 避免不必要輸入
- 優先使用「使用者假設值」

---

## Formula

### 基本假設

- 清楚列出假設條件
- 說明是否忽略成本 / 稅 / 手續費

### Calculation

列出計算邏輯（可用公式或步驟）

---

## Results

### 主結果（必須）

- 最重要結論（例如：是否有賺）
- 核心數字

---

### 收益拆解（建議）

- 將結果拆解（例如：利息 vs 匯差）

---

### 關鍵指標（建議）

- 幫助判斷的臨界點
- 例如：保本點 / break-even

---

## Status Signal（必須）

三段式：

- Green（正向）
- Yellow（臨界）
- Red（風險）

每個必須包含：

- condition
- label
- message

---

## Result Interpretation（強制補）

👉（你這份目前沒有明寫，但其實有做到）

每個結果必須能回答：

- 是否划算
- 風險在哪
- 是否符合預期

---

## Explanation Copy

簡短說明：

- 模型限制
- 未納入項目
- 使用情境

---

## Category

- Investment Tools / Traffic Tools / etc