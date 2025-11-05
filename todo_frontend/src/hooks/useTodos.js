import { useCallback, useEffect, useMemo, useState } from 'react';
import * as storage from '../services/localStorageService';
import * as api from '../services/apiService';

/**
 * PUBLIC_INTERFACE
 * Custom hook to manage todos with local-first approach. Uses localStorage as the source of truth
 * and optionally tries to sync with a backend API when available.
 */
export function useTodos() {
  /** This is a public function: useTodos hook */

  const [todos, setTodos] = useState(() => storage.getTodos());
  const [loading, setLoading] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(false);
  const [error, setError] = useState(null);

  // Detect API availability on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const ok = await api.health();
        if (mounted) setApiAvailable(ok);
      } catch {
        if (mounted) setApiAvailable(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Persist to localStorage whenever todos change
  useEffect(() => {
    storage.setTodos(todos);
  }, [todos]);

  const addTodo = useCallback(async (text) => {
    setError(null);
    const newItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      text,
      completed: false,
      createdAt: Date.now()
    };

    // Optimistic local update
    setTodos(prev => [newItem, ...prev]);

    if (!apiAvailable) return;

    try {
      setLoading(true);
      // Best-effort remote create, ignore failures (local is source of truth)
      await api.createTodo(newItem);
    } catch (e) {
      setError('Failed to sync with server. Working offline.');
    } finally {
      setLoading(false);
    }
  }, [apiAvailable]);

  const deleteTodo = useCallback(async (id) => {
    setError(null);
    setTodos(prev => prev.filter(t => t.id !== id));

    if (!apiAvailable) return;

    try {
      setLoading(true);
      await api.deleteTodo(id);
    } catch (e) {
      setError('Failed to sync deletion. Changes kept locally.');
    } finally {
      setLoading(false);
    }
  }, [apiAvailable]);

  const toggleTodo = useCallback(async (id) => {
    setError(null);
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

    if (!apiAvailable) return;

    try {
      setLoading(true);
      const t = todos.find(x => x.id === id);
      if (t) {
        await api.updateTodo(id, { completed: !t.completed });
      }
    } catch (e) {
      setError('Failed to sync toggle. Changes kept locally.');
    } finally {
      setLoading(false);
    }
  }, [apiAvailable, todos]);

  const updateTodo = useCallback(async (id, changes) => {
    setError(null);
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...changes } : t));

    if (!apiAvailable) return;

    try {
      setLoading(true);
      await api.updateTodo(id, changes);
    } catch (e) {
      setError('Failed to sync update. Changes kept locally.');
    } finally {
      setLoading(false);
    }
  }, [apiAvailable]);

  const clearCompleted = useCallback(async () => {
    setError(null);
    const completedIds = todos.filter(t => t.completed).map(t => t.id);
    setTodos(prev => prev.filter(t => !t.completed));

    if (!apiAvailable) return;

    try {
      setLoading(true);
      await api.bulkDelete(completedIds);
    } catch (e) {
      setError('Failed to sync clearing completed. Changes kept locally.');
    } finally {
      setLoading(false);
    }
  }, [apiAvailable, todos]);

  const toggleAll = useCallback(async () => {
    setError(null);
    const allCompleted = todos.every(t => t.completed);
    const next = todos.map(t => ({ ...t, completed: !allCompleted }));
    setTodos(next);

    if (!apiAvailable) return;

    try {
      setLoading(true);
      await api.bulkUpdate(next.map(t => ({ id: t.id, completed: t.completed })));
    } catch (e) {
      setError('Failed to sync toggle all. Changes kept locally.');
    } finally {
      setLoading(false);
    }
  }, [apiAvailable, todos]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const active = total - completed;
    return { total, completed, active };
  }, [todos]);

  return {
    todos,
    addTodo,
    deleteTodo,
    toggleTodo,
    updateTodo,
    clearCompleted,
    toggleAll,
    stats,
    loading,
    error,
    apiAvailable
  };
}
