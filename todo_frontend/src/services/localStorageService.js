const STORAGE_KEY = 'kavia_todos_v1';

/**
 * PUBLIC_INTERFACE
 * Get todos from localStorage
 */
export function getTodos() {
  /** This is a public function. */
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

/**
 * PUBLIC_INTERFACE
 * Set todos into localStorage
 */
export function setTodos(todos) {
  /** This is a public function. */
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // ignore quota errors
  }
}
