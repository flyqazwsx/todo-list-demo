---
name: todo-list
status: completed
created: 2026-09-26T14:26:24Z
updated: 2026-09-26T16:16:58Z
progress: 100%
prd: .claude/prds/todo-list.md
github: https://github.com/flyqazwsx/todo-list-demo/issues/1
---

# Epic: todo-list

## Overview

以純前端 vanilla HTML/CSS/JavaScript 實作單頁待辦事項工具，資料層封裝成獨立模組讀寫 localStorage。不引入任何前端框架或建置工具，保持最小技術堆疊，符合 PRD 中「快速產出可用工具」的目標。

## Architecture Decisions

- **不使用前端框架**（不用 React/Vue）：功能範圍小、單人使用，vanilla JS 足以應付，且降低練習專案的環境複雜度。
- **資料層獨立封裝**（`storage.js`）：所有 localStorage 讀寫集中在單一模組，未來若要換成後端 API 只需替換此模組，其餘程式碼不受影響。
- **單一頁面、無路由**：所有功能在同一頁面完成，不需要前端路由。
- **狀態管理採簡單記憶體陣列 + 重新渲染**：待辦事項清單存在記憶體中的陣列，每次異動後整批重繪清單並同步寫回 localStorage，不做局部 DOM diff 最佳化（資料量小，非必要）。

## Technical Approach

### Frontend Components

- `index.html`：頁面骨架，包含新增表單、篩選/排序控制列、待辦清單容器。
- `style.css`：版面、清單樣式、完成/逾期/即將到期的視覺狀態樣式。
- `app.js`：應用邏輯 — 渲染清單、綁定表單與按鈕事件、篩選/排序邏輯、到期狀態判斷。
- `storage.js`：封裝 `localStorage` 的讀（load）、寫（save）、待辦事項的 CRUD 操作函式。

### Backend Services

無。本 Epic 範圍內不建置後端或 API（依 PRD Out of Scope）。

### Infrastructure

無需伺服器部署。開發時以任意靜態檔案伺服器（如編輯器內建 Live Server）在本機預覽即可；不需要 CI/CD 或雲端資源。

## Implementation Strategy

1. 先建立資料層（storage.js）與最基本的 CRUD 渲染，讓「新增 → 顯示 → 重新整理仍在」這條路徑先跑通。
2. 疊加完成狀態切換與編輯/刪除。
3. 疊加分類/標籤與優先順序排序。
4. 疊加到期提醒視覺化邏輯（逾期／即將到期樣式）。
5. 最後做手動跨瀏覽器驗收與外觀微調。

**風險控制**：因整個專案只有 3 個核心檔案（`index.html`／`style.css`／`app.js`），多數任務會修改同一組檔案，實際上可平行開發的空間有限，優先以循序方式實作，避免合併衝突。

## Task Breakdown Preview

- [ ] **Task 1 — 專案骨架與資料層**：建立 `index.html`／`style.css`／`app.js`／`storage.js` 基本結構；`storage.js` 提供 load/save 與 CRUD 函式，含空清單初始化。
- [ ] **Task 2 — 新增與清單渲染**：新增待辦事項表單（標題／分類標籤／優先順序／截止日期），送出後寫入 storage 並重繪清單。
- [ ] **Task 3 — 完成狀態切換**：點擊可切換完成/未完成，已完成項目有明顯視覺區隔（如刪除線、移到底部）。
- [ ] **Task 4 — 編輯與刪除**：可編輯既有待辦事項所有欄位；刪除前二次確認，刪除後同步更新 storage 與畫面。
- [ ] **Task 5 — 分類/標籤篩選**：依分類/標籤篩選清單，含「顯示全部」選項。
- [ ] **Task 6 — 優先順序排序**：清單可依優先順序（高→中→低）排序，排序方式可切換。
- [ ] **Task 7 — 到期提醒視覺化**：計算逾期／即將到期（24 小時內）狀態，套用對應醒目樣式；無截止日期項目不受影響。
- [ ] **Task 8 — 手動驗收與跨瀏覽器檢查**：依 PRD 所有驗收標準逐項手動測試（Chrome／Edge／Firefox），修正發現的問題。

## Dependencies

無外部系統、套件或團隊依賴。僅依賴使用者的瀏覽器執行環境（支援 localStorage 與現代 JavaScript 的桌面瀏覽器）。

## Success Criteria (Technical)

- 所有 CRUD 操作正確寫入並從 localStorage 讀回，重新整理頁面後資料不遺失。
- 篩選（分類/標籤）與排序（優先順序）功能行為符合 PRD 驗收標準。
- 逾期／即將到期的視覺標示邊界判斷正確（含剛好跨過 24 小時門檻的情境）。
- 於 Chrome、Edge、Firefox 最新版手動驗證功能與外觀一致。
- 全程不依賴後端服務、資料庫或登入機制即可完整運作。

## Estimated Effort

小型單人練習專案，預估 1–2 天可完成 MVP（8 個任務循序或小幅平行執行）。

## Tasks Created

- [x] #2 - 專案骨架與資料層 (parallel: true)
- [x] #3 - 新增與清單渲染 (parallel: false)
- [x] #4 - 完成狀態切換 (parallel: false)
- [x] #5 - 編輯與刪除 (parallel: false)
- [x] #6 - 分類/標籤篩選 (parallel: false)
- [x] #7 - 優先順序排序 (parallel: false)
- [x] #8 - 到期提醒視覺化 (parallel: false)
- [x] #9 - 手動驗收與跨瀏覽器檢查 (parallel: false)

Total tasks: 8
Parallel tasks: 1
Sequential tasks: 7
Estimated total effort: 15 hours
