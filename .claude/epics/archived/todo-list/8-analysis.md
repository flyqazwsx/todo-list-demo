---
issue: 8
title: 到期提醒視覺化
analyzed: 2026-09-26T15:46:41Z
estimated_hours: 2
parallelization_factor: 1.0
---

# Parallel Work Analysis: Issue #8

## Overview

依 `dueDate` 與 `completed` 計算每筆待辦事項的到期狀態（overdue／dueSoon／normal），渲染時套用對應樣式。純畫面呈現邏輯，不使用瀏覽器推播。單一串流處理。

## Parallel Streams

### Stream A: 到期提醒視覺化（全部工作）
**Scope**: 新增純函式 `getDueStatus(todo)`（以 `new Date()` 與 `todo.dueDate`、`todo.completed` 計算，回傳 `'overdue' | 'dueSoon' | 'normal'`），在 `createTodoItemEl` 渲染時依回傳值加上對應 CSS class；`style.css` 新增逾期（紅）／即將到期（橘黃）樣式。
**Files**: `app.js`, `style.css`
**Can Start**: immediately（依賴的 Issue #2、#3 已關閉）
**Estimated Hours**: 2
**Dependencies**: Issue #2、#3（已完成）

## Coordination Points

### Shared Files
`app.js`／`style.css` 與 #3～#7 conflicts_with（皆已完成），本任務是此檔案群組最後一個任務。

### Sequential Requirements
完成後解鎖 #9（手動驗收，依賴全部前 7 個任務）。

## Conflict Risk Assessment

低。目前僅此任務在進行中，且是此輪循序執行的最後一個功能任務。

## Parallelization Strategy

單一 agent 循序完成，不拆分平行串流。

## Expected Timeline
- With parallel execution: 2h wall time
- Without: 2h
- Efficiency gain: 0%
