---
issue: 8
stream: 到期提醒視覺化（全部工作）
started: 2026-09-26T15:46:41Z
status: completed
---
## Scope
新增 getDueStatus 純函式計算逾期/即將到期/正常狀態，渲染時套用對應樣式。

## Progress
- Starting implementation
- 在 `app.js` 新增純函式 `getDueStatus(todo)`：已完成或無 `dueDate` 一律回傳
  `'normal'`；否則以 `new Date(todo.dueDate).getTime() - new Date().getTime()`
  計算毫秒差 `diff`，`diff <= 0` 為 `'overdue'`（已逾期）、
  `0 < diff <= 24*60*60*1000` 為 `'dueSoon'`（即將到期，含 24 小時整的邊界）、
  其餘為 `'normal'`。不修改傳入的 `todo`，不寫回 storage。
- 在 `createTodoItemEl` 中呼叫 `getDueStatus(todo)`，依回傳值透過
  `DUE_STATUS_CLASS` 對照表加上 `todo-due-overdue` / `todo-due-soon` class（
  `normal` 不加額外 class），與既有 `completed` class 並存不衝突。
- 在 `style.css` 新增 `.todo-due-overdue`（紅色系：加粗紅色邊框、淡紅背景、
  截止日期文字加紅加粗）與 `.todo-due-soon`（橘黃色系：加粗橘色邊框、淡黃背景、
  截止日期文字加橘加粗）樣式，與 Issue #4 的 `.completed`（淡化＋刪除線）視覺
  上可明確區分、不衝突。
- 撰寫暫時 Node 測試腳本（`vm` 載入修改後的 app.js 副本，在 IIFE 結尾把
  `getDueStatus` 掛到測試用全域物件上）驗證 15 項情境：已完成（不論日期，含
  明顯逾期）→ normal、無截止日期（null／undefined／空字串）→ normal、明顯逾期
  （100 小時前、1 分鐘前）→ overdue、明顯正常（48 小時後、25 小時後）→ normal、
  24 小時門檻邊界（23.99 小時後 → dueSoon、24.01 小時後 → normal、恰好 24 小時
  後 → dueSoon，含邊界）、剛好卡在「現在」附近（1 秒後 → dueSoon、1 秒前 →
  overdue）、以及純函式不修改傳入物件——全數通過後已刪除該暫時腳本。
- `node --check app.js` 通過，語法正確。
- Commits: `f5c3ee0`（app.js 新增 getDueStatus 並整合進 createTodoItemEl）、
  `e9715d4`（style.css 新增逾期/即將到期樣式）。
- 驗收標準全數滿足：未完成且已逾期套用紅色醒目樣式、未完成且 24 小時內到期套用
  橘黃醒目樣式、已完成項目不套用（即使截止日期已過）、無截止日期不參與此邏輯、
  24 小時門檻邊界判斷正確無誤判。
