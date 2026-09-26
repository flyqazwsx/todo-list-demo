---
issue: 6
stream: 分類/標籤篩選（全部工作）
started: 2026-09-26T15:37:46Z
status: completed
---
## Scope
加入分類/標籤篩選下拉選單，選項動態去重，篩選只影響畫面顯示不動 localStorage。

## Progress
- Starting implementation
- 完成：`index.html` 在 `#todo-controls` 內加入分類/標籤篩選下拉選單 `#todo-category-filter`，內建「顯示全部」選項（value 為空字串）
- 完成：`app.js` 新增模組層級狀態 `currentCategoryFilter`（空字串代表顯示全部），只影響畫面渲染、不寫回 storage
- 完成：`app.js` 新增 `getUniqueCategories(todos)`，從目前**全部**（未過濾）待辦事項中依 `category` 欄位去重並排序，空白/未填分類不產生選項
- 完成：`app.js` 新增 `filterTodosByCategory(todos, category)`，`category` 為空字串時原樣回傳（顯示全部），否則只保留 `category` 完全相符的項目；回傳新陣列，不修改原陣列
- 完成：`app.js` 新增 `renderCategoryFilterOptions(todos)`，每次渲染前用未過濾的全部資料重建下拉選單選項，並保留使用者目前選擇（若選擇的分類已不存在於資料中，自動重設為「顯示全部」）
- 完成：`app.js` 新增 `handleCategoryFilterChange`，於 `init()` 綁定 `#todo-category-filter` 的 `change` 事件，更新 `currentCategoryFilter` 後呼叫 `refreshTodoList()`
- 完成：改寫 `refreshTodoList()` 流程為「讀取全部資料 → 重建篩選選單選項 → 依目前篩選狀態過濾 → 交給 `renderTodos`（內部仍會依完成狀態排序）渲染」，確保新增/編輯/刪除/完成切換後重繪清單時，目前的篩選狀態會持續套用（不會被重置成顯示全部）
- 完成：`style.css` 新增 `.todo-filter-field` 樣式，讓篩選欄位在 `#todo-controls` 內版面一致
- 驗證：`node --check app.js` 通過；另寫暫時性 Node 測試腳本驗證 `getUniqueCategories`／`filterTodosByCategory` 的去重、排序、篩選、空清單、不存在分類、不修改原陣列等 9 項斷言，全數通過（腳本置於系統暫存目錄，用後即刪，未納入專案）
- 所有驗收標準均已滿足
