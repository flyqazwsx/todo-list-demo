/**
 * app.js
 * 應用邏輯入口。
 *
 * 本階段（Issue #2）只需驗證與 storage.js 的串接是否正確：
 * 讀取現有待辦事項並做最簡單的渲染／印出，不實作完整的 CRUD 互動邏輯
 * （新增表單、篩選、排序等留待後續任務實作）。
 */

(function () {
  'use strict';

  function renderTodos(todos) {
    var listEl = document.getElementById('todo-list');
    if (!listEl) {
      return;
    }

    listEl.innerHTML = '';

    if (!todos || todos.length === 0) {
      var emptyEl = document.createElement('li');
      emptyEl.className = 'todo-list-empty';
      emptyEl.textContent = '目前沒有待辦事項。';
      listEl.appendChild(emptyEl);
      return;
    }

    todos.forEach(function (todo) {
      var itemEl = document.createElement('li');
      itemEl.className = 'todo-list-item';
      itemEl.textContent = todo.title || '(未命名)';
      listEl.appendChild(itemEl);
    });
  }

  function init() {
    if (typeof window.storage === 'undefined') {
      console.error('app.js: 找不到 storage.js 提供的 storage 物件，請確認 <script> 載入順序。');
      return;
    }

    var todos = window.storage.getTodos();
    console.log('app.js: 目前共有 ' + todos.length + ' 筆待辦事項', todos);

    renderTodos(todos);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
