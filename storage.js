/**
 * storage.js
 * 封裝 localStorage 存取的資料層模組。
 * 所有待辦事項的讀寫都集中在這裡，未來若要換成後端 API，
 * 只需替換此模組的實作，其餘程式碼（app.js）不需要跟著改動。
 *
 * 待辦事項資料結構：
 * {
 *   id: string,
 *   title: string,
 *   category: string,
 *   priority: 'high' | 'medium' | 'low',
 *   dueDate: string | null,
 *   completed: boolean,
 *   createdAt: string
 * }
 */

(function (global) {
  'use strict';

  var STORAGE_KEY = 'todo-list:todos';

  /**
   * 產生唯一 id，使用時間戳記加上隨機字串避免同毫秒內衝突。
   * @returns {string}
   */
  function generateId() {
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
  }

  /**
   * 從 localStorage 讀取所有待辦事項。
   * 若尚無資料、資料損毀或格式不是陣列，一律回傳空陣列，不拋出錯誤。
   * @returns {Array<Object>}
   */
  function loadTodos() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed;
    } catch (err) {
      console.warn('loadTodos: 讀取 localStorage 失敗，改回傳空陣列。', err);
      return [];
    }
  }

  /**
   * 將待辦事項陣列寫回 localStorage。
   * @param {Array<Object>} todos
   * @returns {boolean} 是否寫入成功
   */
  function saveTodos(todos) {
    try {
      var list = Array.isArray(todos) ? todos : [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return true;
    } catch (err) {
      console.warn('saveTodos: 寫入 localStorage 失敗。', err);
      return false;
    }
  }

  /**
   * 取得目前所有待辦事項。
   * @returns {Array<Object>}
   */
  function getTodos() {
    return loadTodos();
  }

  /**
   * 新增一筆待辦事項。
   * @param {Object} todo 至少包含 title；category/priority/dueDate/completed 可選填。
   * @returns {Object} 新增後完整的待辦事項物件（含自動產生欄位）。
   */
  function addTodo(todo) {
    var todos = loadTodos();
    var now = new Date().toISOString();

    var newTodo = {
      id: generateId(),
      title: (todo && todo.title) || '',
      category: (todo && todo.category) || '',
      priority: (todo && todo.priority) || 'medium',
      dueDate: (todo && todo.dueDate) || null,
      completed: (todo && todo.completed) || false,
      createdAt: now
    };

    todos.push(newTodo);
    saveTodos(todos);
    return newTodo;
  }

  /**
   * 更新指定 id 的待辦事項欄位。
   * @param {string} id
   * @param {Object} changes 要覆蓋的欄位
   * @returns {Object|null} 更新後的物件，找不到則回傳 null
   */
  function updateTodo(id, changes) {
    var todos = loadTodos();
    var index = todos.findIndex(function (t) {
      return t.id === id;
    });

    if (index === -1) {
      console.warn('updateTodo: 找不到 id 為 "' + id + '" 的待辦事項。');
      return null;
    }

    todos[index] = Object.assign({}, todos[index], changes || {}, { id: todos[index].id });
    saveTodos(todos);
    return todos[index];
  }

  /**
   * 刪除指定 id 的待辦事項。
   * @param {string} id
   * @returns {boolean} 是否有項目被刪除
   */
  function deleteTodo(id) {
    var todos = loadTodos();
    var nextTodos = todos.filter(function (t) {
      return t.id !== id;
    });

    var didDelete = nextTodos.length !== todos.length;
    if (didDelete) {
      saveTodos(nextTodos);
    }
    return didDelete;
  }

  var storageApi = {
    loadTodos: loadTodos,
    saveTodos: saveTodos,
    getTodos: getTodos,
    addTodo: addTodo,
    updateTodo: updateTodo,
    deleteTodo: deleteTodo
  };

  // 瀏覽器環境：掛在 window 上供 app.js 直接使用。
  global.storage = storageApi;

  // 若在 Node.js（例如測試環境）中被 require，也提供 module.exports。
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = storageApi;
  }
})(typeof window !== 'undefined' ? window : this);
