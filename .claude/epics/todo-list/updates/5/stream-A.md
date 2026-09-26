---
issue: 5
stream: 編輯與刪除（全部工作）
started: 2026-09-26T15:33:34Z
status: completed
---
## Scope
每筆待辦事項加上編輯（重用表單，填入既有值覆蓋儲存）與刪除（二次確認）功能。

## Progress
- Starting implementation
- 完成：`index.html` 表單新增 `#todo-form-submit`（送出按鈕加上 id）與 `#todo-form-cancel`（取消編輯按鈕，預設 hidden）
- 完成：`app.js` 每筆清單項目加上「編輯」「刪除」按鈕（`createTodoItemEl` 內新增 `.todo-item-actions`）
- 完成：`app.js` 加入編輯模式狀態管理（`editingId`、`enterEditMode`、`exitEditMode`、`handleCancelEdit`）：點擊「編輯」會把標題／分類／優先順序／截止日期填入既有表單，送出按鈕文字改為「更新」，並顯示「取消編輯」按鈕
- 完成：`handleFormSubmit` 依 `editingId` 是否存在分流呼叫 `storage.updateTodo(id, changes)` 或 `storage.addTodo(todo)`；標題必填驗證在編輯模式下同樣生效；送出成功後清空表單、離開編輯模式、重繪清單
- 完成：`app.js` 加入 `handleDeleteClick`：以原生 `confirm('確定要刪除這筆待辦事項嗎？')` 二次確認，確認後呼叫 `storage.deleteTodo(id)` 並重繪清單（若刪除的項目正在編輯中，一併離開編輯模式）；取消則不做任何動作
- 完成：`style.css` 新增 `.todo-item-actions`／`.todo-item-edit`／`.todo-item-delete`／`.todo-form-cancel` 樣式
- 驗證：`node --check app.js` 通過；另寫暫時性 Node 測試腳本（含 mock localStorage）驗證 `storage.updateTodo`／`storage.deleteTodo` 的更新、刪除、找不到 id、資料寫回等 20 項斷言，全數通過（腳本置於系統暫存目錄，未納入專案）
- 所有驗收標準均已滿足
