---
issue: 2
stream: 骨架與資料層（全部工作）
started: 2026-09-26T15:14:58Z
status: completed
---
## Scope
建立 `index.html`／`style.css`／`app.js`／`storage.js`，並實作 `storage.js` 的 localStorage CRUD 封裝。

## Progress
- Starting implementation
- 建立 `index.html`：頁面骨架，含新增表單容器（`#todo-form`）、篩選/排序控制列容器（`#todo-controls`）、待辦清單容器（`#todo-list`），並正確以 `<link>` 連結 `style.css`、以 `<script>` 依序載入 `storage.js` 與 `app.js`
- 建立 `style.css`：基本版面樣式（容器、表單、清單項目樣式），為後續完成/逾期樣式預留空間
- 建立 `storage.js`：實作 `loadTodos()`／`saveTodos(todos)`／`getTodos()`／`addTodo(todo)`／`updateTodo(id, changes)`／`deleteTodo(id)`，key 為 `todo-list:todos`；localStorage 無資料或資料損毀時皆安全回傳空陣列，不拋出錯誤；同時支援瀏覽器（掛在 `window.storage`）與 Node.js（`module.exports`）兩種載入方式以利測試
- 建立 `app.js`：載入後呼叫 `storage.getTodos()` 並將結果印到 console、簡單渲染至 `#todo-list`，驗證與 storage.js 串接成功
- 以 Node.js 搭配自製 localStorage mock 撰寫 17 項功能測試，涵蓋初始化空陣列、新增/更新/刪除、更新或刪除不存在的 id、損毀 JSON 容錯、非陣列資料容錯，全數通過
- 以 `node --check` 驗證 `storage.js`、`app.js` 語法正確
- 已 commit：`4e4a8c6` — Issue #2: 建立專案骨架與 localStorage CRUD 資料層
- 所有驗收標準確認達成，狀態標記為 completed
