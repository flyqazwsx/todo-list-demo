---
issue: 6
title: 分類/標籤篩選
analyzed: 2026-09-26T15:37:46Z
estimated_hours: 2
parallelization_factor: 1.0
---

# Parallel Work Analysis: Issue #6

## Overview

在 `#todo-controls` 加入分類/標籤篩選下拉選單，選項動態從目前資料去重取得，篩選只影響畫面顯示、不動 localStorage。單一串流處理。

## Parallel Streams

### Stream A: 分類/標籤篩選（全部工作）
**Scope**: 在 `index.html` 的 `#todo-controls` 加入篩選下拉選單（含「顯示全部」選項）。`app.js` 中維護目前篩選狀態，渲染清單前先用篩選條件 filter 記憶體陣列（不修改 storage.js／localStorage），下拉選單選項在每次渲染時依目前資料去重動態產生。
**Files**: `app.js`, `index.html`（可能需要 `style.css` 微調）
**Can Start**: immediately（依賴的 Issue #2、#3 已關閉）
**Estimated Hours**: 2
**Dependencies**: Issue #2、#3（已完成）

## Coordination Points

### Shared Files
`app.js`／`index.html`／`style.css` 與 #7、#8 conflicts_with，需待本任務完成後才可啟動下一個。

### Sequential Requirements
完成後解鎖佇列中的 #7、#8（仍需依序）。

## Conflict Risk Assessment

低。目前僅此任務在進行中。

## Parallelization Strategy

單一 agent 循序完成，不拆分平行串流。

## Expected Timeline
- With parallel execution: 2h wall time
- Without: 2h
- Efficiency gain: 0%
