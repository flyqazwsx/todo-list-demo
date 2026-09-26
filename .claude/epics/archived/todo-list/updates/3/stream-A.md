---
issue: 3
stream: 表單與清單渲染（全部工作）
started: 2026-09-26T15:24:25Z
status: completed
---
## Scope
在 index.html 補上新增待辦事項表單，app.js 實作送出邏輯與清單整批重繪渲染，串接 storage.js 的 addTodo/getTodos。

## Progress
- Starting implementation
- 在 index.html 的 #todo-form 補上標題（必填）、分類/標籤、優先順序（高/中/低下拉）、截止日期（可留空）欄位與送出按鈕，並加入表單錯誤提示元素 #todo-form-error（commit b3c80b7）
- 在 app.js 實作表單送出處理：preventDefault、標題 trim 後為空時顯示錯誤訊息並中止送出、驗證通過後呼叫 storage.addTodo 寫入並 reset 表單（commit da4b201）
- 在 app.js 實作清單整批重繪渲染（renderTodos/createTodoItemEl）：清空 #todo-list 後依 storage.getTodos() 重新產生 DOM，每筆項目顯示標題、分類/標籤、優先順序中文標籤、截止日期；新增成功後立即呼叫 refreshTodoList() 重繪；DOMContentLoaded 時自動渲染一次（commit da4b201）
- 在 style.css 補上表單欄位（.form-field 系列）與清單項目（.todo-item-main/.todo-item-meta）的基本樣式（commit 0e2b468）
- 以暫存 Node 測試腳本（mock localStorage）驗證 storage.js 的 addTodo/getTodos 互動邏輯與標題驗證邏輯，全數通過後刪除該腳本
- node --check app.js 語法確認通過
- 手動比對 3.md 全部驗收標準，已全數滿足
