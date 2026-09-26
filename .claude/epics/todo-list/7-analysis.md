---
issue: 7
title: 優先順序排序
analyzed: 2026-09-26T15:42:05Z
estimated_hours: 1
parallelization_factor: 1.0
---

# Parallel Work Analysis: Issue #7

## Overview

加入排序方式切換（預設時間序 / 優先順序），與既有的分類篩選（Issue #6）、完成狀態排序（Issue #4，未完成在前已完成在後）組合運作。單一串流處理。

## Parallel Streams

### Stream A: 優先順序排序（全部工作）
**Scope**: 在 `#todo-controls` 加入排序方式控制項（切換「依優先順序排序」／「預設順序（依建立時間）」）。`app.js` 中渲染流程調整為：先依分類篩選 → 依目前排序模式排序（優先順序模式：高=3/中=2/低=1 由大到小；預設模式：依 `createdAt` 由舊到新）→ 最後仍套用完成狀態排序（未完成在前、已完成在後）作為外層分組，優先順序/時間排序只決定各分組內部的順序。純畫面顯示邏輯，不寫回 localStorage。
**Files**: `app.js`, `index.html`（加排序控制項）, `style.css`（視需要）
**Can Start**: immediately（依賴的 Issue #2、#3 已關閉）
**Estimated Hours**: 1
**Dependencies**: Issue #2、#3（已完成）；需與 Issue #6 的篩選、Issue #4 的完成排序正確組合

## Coordination Points

### Shared Files
`app.js`／`index.html`／`style.css` 與 #8 conflicts_with，需待本任務完成後才可啟動 #8。

### Sequential Requirements
完成後解鎖佇列中的 #8。

## Conflict Risk Assessment

低。目前僅此任務在進行中。

## Parallelization Strategy

單一 agent 循序完成，不拆分平行串流。

## Expected Timeline
- With parallel execution: 1h wall time
- Without: 1h
- Efficiency gain: 0%
