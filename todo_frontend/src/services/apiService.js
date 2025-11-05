import { getEnv } from '../utils/env';

/**
 * Resolve API base URL with multiple fallbacks
 */
function resolveBaseUrl() {
  // Priority: REACT_APP_API_BASE > REACT_APP_BACKEND_URL > REACT_APP_WS_URL (converted) > null
  const apiBase = getEnv('REACT_APP_API_BASE');
  const backend = getEnv('REACT_APP_BACKEND_URL');
  const wsUrl = getEnv('REACT_APP_WS_URL');
  if (apiBase) return apiBase.replace(/\/+$/, '');
  if (backend) return backend.replace(/\/+$/, '');
  if (wsUrl) {
    try {
      const u = new URL(wsUrl);
      u.protocol = u.protocol.startsWith('wss') ? 'https:' : 'http:';
      return u.origin;
    } catch {
      return null;
    }
  }
  return null;
}

const BASE_URL = resolveBaseUrl();

/**
 * Perform fetch with base URL when available
 */
async function request(path, options = {}) {
  if (!BASE_URL) throw new Error('API base not configured');
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

/**
 * PUBLIC_INTERFACE
 * Health check to detect API availability
 */
export async function health() {
  /** This is a public function. */
  if (!BASE_URL) return false;
  try {
    const res = await fetch(`${BASE_URL}/health`, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * PUBLIC_INTERFACE
 * Create a new todo in the backend
 */
export async function createTodo(todo) {
  /** This is a public function. */
  return request('/todos', { method: 'POST', body: JSON.stringify(todo) });
}

/**
 * PUBLIC_INTERFACE
 * Update an existing todo by id
 */
export async function updateTodo(id, changes) {
  /** This is a public function. */
  return request(`/todos/${id}`, { method: 'PATCH', body: JSON.stringify(changes) });
}

/**
 * PUBLIC_INTERFACE
 * Delete todo by id
 */
export async function deleteTodo(id) {
  /** This is a public function. */
  return request(`/todos/${id}`, { method: 'DELETE' });
}

/**
 * PUBLIC_INTERFACE
 * Bulk delete by ids
 */
export async function bulkDelete(ids) {
  /** This is a public function. */
  return request(`/todos/bulk-delete`, { method: 'POST', body: JSON.stringify({ ids }) });
}

/**
 * PUBLIC_INTERFACE
 * Bulk update completed states
 */
export async function bulkUpdate(items) {
  /** This is a public function. */
  return request(`/todos/bulk-update`, { method: 'POST', body: JSON.stringify({ items }) });
}
