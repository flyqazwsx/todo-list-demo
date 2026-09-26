---
issue: 7
stream: 優先順序排序（全部工作）
started: 2026-09-26T15:42:05Z
status: completed
---
## Scope
加入排序方式切換（優先順序／預設時間序），與既有篩選、完成狀態排序正確組合。

## Progress
- Starting implementation
- 在 `index.html` 的 `#todo-controls` 加入排序方式 `<select id="todo-sort-mode">`（選項：`default` 預設順序（依建立時間，預設選取）／`priority` 依優先順序排序），並在 `style.css` 加上 `.todo-sort-field` 樣式（沿用既有 `.todo-filter-field` 版面）。
- 在 `app.js` 新增模組層級狀態 `currentSortMode`（預設 `'default'`）與對照表 `PRIORITY_ORDER`（high=3/medium=2/low=1）。
- 新增純函式 `sortTodosByMode(todos, mode)`：`priority` 模式依優先順序數值由大到小排序、`default` 模式依 `createdAt` 由舊到新排序，兩者皆用原始索引做穩定排序（tie-break），不修改原陣列、不寫回 storage。
- 調整 `refreshTodoList()` 渲染流程為：讀取全部資料 → 重建分類篩選選單 → `filterTodosByCategory`（Issue #6）→ `sortTodosByMode`（本任務）→ `renderTodos`（內部仍呼叫 `sortTodosByCompleted`，Issue #4，未完成在前、已完成在後，作為最外層分組）。
- 新增 `handleSortModeChange` 事件處理並在 `init()` 中綁定 `#todo-sort-mode` 的 `change` 事件，並於初始化時同步 `currentSortMode` 為控制項當前值；切換排序模式與切換分類篩選互不影響彼此的狀態。
- 撰寫暫時 Node 測試腳本（vm 載入 app.js 並注入 `module.exports`）驗證：優先順序排序正確、時間序排序正確、排序函式不會 mutate 原陣列、以及完整組合（篩選→排序模式→完成狀態分組）順序正確——已完成驗證後刪除該暫時腳本。
- `node --check app.js` 通過，語法正確。
- Commits: `8892928`（index.html／style.css 加入排序控制項）、`22fe5fa`（app.js 排序邏輯與渲染流程整合）。
- 驗收標準全數滿足：排序控制項可切換、優先順序模式高→中→低顯示、排序與 Issue #6 篩選可同時作用（先篩選後排序）、排序狀態不寫回 localStorage（純畫面顯示）。
