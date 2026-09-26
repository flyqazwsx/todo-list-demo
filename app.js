/**
 * app.js
 * 應用邏輯入口。
 *
 * Issue #3：實作新增待辦事項表單（標題／分類標籤／優先順序／截止日期），
 * 送出後透過 storage.js 寫入資料，並將目前所有待辦事項渲染成清單。
 * 清單渲染採「整批重繪」策略：每次資料異動後清空 #todo-list 容器，
 * 依目前 storage 中的資料重新產生所有項目的 DOM。
 */

(function () {
  'use strict';

  var PRIORITY_LABELS = {
    high: '高',
    medium: '中',
    low: '低'
  };

  /**
   * 目前正在編輯中的待辦事項 id；null 表示表單處於「新增模式」。
   * @type {string|null}
   */
  var editingId = null;

  /**
   * 將優先順序內部值轉換成顯示用中文標籤。
   * @param {string} priority
   * @returns {string}
   */
  function getPriorityLabel(priority) {
    return PRIORITY_LABELS[priority] || priority || '未設定';
  }

  /**
   * 依完成狀態排序待辦事項：未完成排在前面，已完成排在後面。
   * 不修改原陣列，回傳新陣列；同一分組內維持原本相對順序（穩定排序）。
   * @param {Array<Object>} todos
   * @returns {Array<Object>}
   */
  function sortTodosByCompleted(todos) {
    var list = Array.isArray(todos) ? todos.slice() : [];
    var incomplete = list.filter(function (t) {
      return !t.completed;
    });
    var completed = list.filter(function (t) {
      return !!t.completed;
    });
    return incomplete.concat(completed);
  }

  /**
   * 切換單一待辦事項的完成狀態：寫回 storage 後重新渲染整份清單。
   * @param {string} id
   * @param {boolean} completed
   */
  function handleToggleCompleted(id, completed) {
    window.storage.updateTodo(id, { completed: completed });
    refreshTodoList();
  }

  /**
   * 點擊「刪除」按鈕：跳出 confirm() 二次確認，確認後刪除並重繪清單；
   * 若使用者正在編輯此筆項目，同時離開編輯模式。
   * @param {Object} todo
   */
  function handleDeleteClick(todo) {
    var confirmed = window.confirm('確定要刪除這筆待辦事項嗎？');
    if (!confirmed) {
      return;
    }

    window.storage.deleteTodo(todo.id);

    if (editingId === todo.id) {
      exitEditMode();
    }

    refreshTodoList();
  }

  /**
   * 點擊「編輯」按鈕：將該筆待辦事項的既有值填入表單，並讓表單進入編輯模式。
   * @param {Object} todo
   */
  function handleEditClick(todo) {
    enterEditMode(todo);
  }

  /**
   * 建立單一待辦事項的清單項目 DOM。
   * @param {Object} todo
   * @returns {HTMLLIElement}
   */
  function createTodoItemEl(todo) {
    var itemEl = document.createElement('li');
    itemEl.className = 'todo-list-item' + (todo.completed ? ' completed' : '');
    itemEl.dataset.id = todo.id;

    var checkboxEl = document.createElement('input');
    checkboxEl.type = 'checkbox';
    checkboxEl.className = 'todo-item-checkbox';
    checkboxEl.checked = !!todo.completed;
    checkboxEl.setAttribute('aria-label', '標記「' + (todo.title || '(未命名)') + '」為' + (todo.completed ? '未完成' : '完成'));
    checkboxEl.addEventListener('change', function () {
      handleToggleCompleted(todo.id, checkboxEl.checked);
    });
    itemEl.appendChild(checkboxEl);

    var mainEl = document.createElement('div');
    mainEl.className = 'todo-item-main';

    var titleEl = document.createElement('span');
    titleEl.className = 'todo-item-title';
    titleEl.textContent = todo.title || '(未命名)';
    mainEl.appendChild(titleEl);

    var metaEl = document.createElement('div');
    metaEl.className = 'todo-item-meta';

    var categoryEl = document.createElement('span');
    categoryEl.className = 'todo-item-category';
    categoryEl.textContent = todo.category ? '分類：' + todo.category : '分類：未分類';
    metaEl.appendChild(categoryEl);

    var priorityEl = document.createElement('span');
    priorityEl.className = 'todo-item-priority todo-item-priority-' + (todo.priority || 'medium');
    priorityEl.textContent = '優先順序：' + getPriorityLabel(todo.priority);
    metaEl.appendChild(priorityEl);

    var dueDateEl = document.createElement('span');
    dueDateEl.className = 'todo-item-due-date';
    dueDateEl.textContent = '截止日期：' + (todo.dueDate || '無');
    metaEl.appendChild(dueDateEl);

    mainEl.appendChild(metaEl);
    itemEl.appendChild(mainEl);

    var actionsEl = document.createElement('div');
    actionsEl.className = 'todo-item-actions';

    var editButtonEl = document.createElement('button');
    editButtonEl.type = 'button';
    editButtonEl.className = 'todo-item-edit';
    editButtonEl.textContent = '編輯';
    editButtonEl.setAttribute('aria-label', '編輯「' + (todo.title || '(未命名)') + '」');
    editButtonEl.addEventListener('click', function () {
      handleEditClick(todo);
    });
    actionsEl.appendChild(editButtonEl);

    var deleteButtonEl = document.createElement('button');
    deleteButtonEl.type = 'button';
    deleteButtonEl.className = 'todo-item-delete';
    deleteButtonEl.textContent = '刪除';
    deleteButtonEl.setAttribute('aria-label', '刪除「' + (todo.title || '(未命名)') + '」');
    deleteButtonEl.addEventListener('click', function () {
      handleDeleteClick(todo);
    });
    actionsEl.appendChild(deleteButtonEl);

    itemEl.appendChild(actionsEl);

    return itemEl;
  }

  /**
   * 整批重繪清單：清空 #todo-list 容器，依傳入的 todos 陣列重新產生 DOM。
   * @param {Array<Object>} todos
   */
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

    var sortedTodos = sortTodosByCompleted(todos);
    sortedTodos.forEach(function (todo) {
      listEl.appendChild(createTodoItemEl(todo));
    });
  }

  /**
   * 重新從 storage 讀取資料並重繪清單。
   */
  function refreshTodoList() {
    var todos = window.storage.getTodos();
    renderTodos(todos);
  }

  /**
   * 顯示表單錯誤訊息。
   * @param {string} message
   */
  function showFormError(message) {
    var errorEl = document.getElementById('todo-form-error');
    if (!errorEl) {
      return;
    }
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  /**
   * 隱藏表單錯誤訊息。
   */
  function hideFormError() {
    var errorEl = document.getElementById('todo-form-error');
    if (!errorEl) {
      return;
    }
    errorEl.textContent = '';
    errorEl.hidden = true;
  }

  /**
   * 讓表單進入「編輯模式」：把既有待辦事項的值填入表單欄位，
   * 記錄目前正在編輯的 id，並把送出按鈕文字改成「更新」、顯示「取消編輯」按鈕。
   * @param {Object} todo
   */
  function enterEditMode(todo) {
    var form = document.getElementById('todo-form');
    if (!form) {
      return;
    }

    var titleInput = form.elements['title'];
    var categoryInput = form.elements['category'];
    var priorityInput = form.elements['priority'];
    var dueDateInput = form.elements['dueDate'];

    if (titleInput) {
      titleInput.value = todo.title || '';
    }
    if (categoryInput) {
      categoryInput.value = todo.category || '';
    }
    if (priorityInput) {
      priorityInput.value = todo.priority || 'medium';
    }
    if (dueDateInput) {
      dueDateInput.value = todo.dueDate || '';
    }

    hideFormError();
    editingId = todo.id;

    var submitButtonEl = document.getElementById('todo-form-submit');
    if (submitButtonEl) {
      submitButtonEl.textContent = '更新';
    }

    var cancelButtonEl = document.getElementById('todo-form-cancel');
    if (cancelButtonEl) {
      cancelButtonEl.hidden = false;
    }

    if (titleInput) {
      titleInput.focus();
    }
  }

  /**
   * 讓表單離開「編輯模式」回到新增模式：清空表單、清除編輯狀態、
   * 把送出按鈕文字改回「新增待辦事項」、隱藏「取消編輯」按鈕。
   */
  function exitEditMode() {
    var form = document.getElementById('todo-form');
    if (form) {
      form.reset();
    }

    hideFormError();
    editingId = null;

    var submitButtonEl = document.getElementById('todo-form-submit');
    if (submitButtonEl) {
      submitButtonEl.textContent = '新增待辦事項';
    }

    var cancelButtonEl = document.getElementById('todo-form-cancel');
    if (cancelButtonEl) {
      cancelButtonEl.hidden = true;
    }
  }

  /**
   * 點擊「取消編輯」按鈕：放棄目前編輯，回到新增模式，不做任何資料異動。
   */
  function handleCancelEdit() {
    exitEditMode();
  }

  /**
   * 處理表單送出：驗證標題必填，通過後依目前模式呼叫 addTodo 或 updateTodo，
   * 寫入資料、清空表單、離開編輯模式並重繪清單。
   * @param {Event} event
   */
  function handleFormSubmit(event) {
    event.preventDefault();

    var form = event.target;
    var titleInput = form.elements['title'];
    var categoryInput = form.elements['category'];
    var priorityInput = form.elements['priority'];
    var dueDateInput = form.elements['dueDate'];

    var title = (titleInput && titleInput.value || '').trim();

    if (!title) {
      showFormError('標題為必填欄位，請輸入標題。');
      if (titleInput) {
        titleInput.focus();
      }
      return;
    }

    hideFormError();

    var todoData = {
      title: title,
      category: (categoryInput && categoryInput.value || '').trim(),
      priority: (priorityInput && priorityInput.value) || 'medium',
      dueDate: (dueDateInput && dueDateInput.value) || null
    };

    if (editingId) {
      window.storage.updateTodo(editingId, todoData);
    } else {
      todoData.completed = false;
      window.storage.addTodo(todoData);
    }

    exitEditMode();
    refreshTodoList();
  }

  function init() {
    if (typeof window.storage === 'undefined') {
      console.error('app.js: 找不到 storage.js 提供的 storage 物件，請確認 <script> 載入順序。');
      return;
    }

    var formEl = document.getElementById('todo-form');
    if (formEl) {
      formEl.addEventListener('submit', handleFormSubmit);
    }

    var cancelButtonEl = document.getElementById('todo-form-cancel');
    if (cancelButtonEl) {
      cancelButtonEl.addEventListener('click', handleCancelEdit);
    }

    refreshTodoList();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
