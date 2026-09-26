---
issue: 4
stream: 完成狀態切換（全部工作）
started: 2026-09-26T15:28:24Z
status: completed
---
## Scope
在清單項目加入 checkbox 切換完成狀態，呼叫 storage.updateTodo 寫回，並套用完成樣式與排序。

## Progress
- Starting implementation
- 在 `createTodoItemEl` 加入 checkbox，勾選狀態對應 `todo.completed`，並綁定 change 事件呼叫 `storage.updateTodo(id, { completed })` 後透過 `refreshTodoList()` 重新整批渲染。
- 新增 `sortTodosByCompleted()`，在 `renderTodos` 渲染前先排序：未完成項目在前、已完成項目在後（同分組內維持原順序）。
- `style.css` 新增 `.todo-list-item.completed`（整體淡化 opacity 0.55）與 `.todo-item-title` 的刪除線樣式，並加上 checkbox 的基本樣式。
- 撰寫暫時 Node 測試腳本驗證：updateTodo 切換/切回 completed 並持久化、不影響其他欄位、排序邏輯正確；測試全數通過後已刪除該暫時腳本。
- `node --check app.js` 與 `node --check storage.js` 語法檢查皆通過。
- 已 commit 兩次：`13fc715`（app.js：checkbox 與排序邏輯）、`2fb0d8e`（style.css：完成樣式）。
- 全部 4 項驗收標準已滿足。
