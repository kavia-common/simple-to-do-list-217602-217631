import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import { useTodos } from './hooks/useTodos';
import { getEnv } from './utils/env';

// PUBLIC_INTERFACE
function App() {
  /**
   * This is the main application component. It sets up theme handling,
   * renders the header, input, and list, and wires up actions from useTodos.
   */
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** This is a public function: toggles theme */
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  const {
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
  } = useTodos();

  const envInfo = getEnv('REACT_APP_NODE_ENV', 'development');

  return (
    <div className="App">
      <Header>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </Header>

      <main className="container">
        <section aria-live="polite" aria-atomic="true">
          {error && (
            <div className="card" style={{ padding: 12, borderColor: 'var(--error)' }}>
              <strong style={{ color: 'var(--error)' }}>Note:</strong> {error}
            </div>
          )}
          <div className="card" style={{ padding: 16, marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, color: 'var(--secondary)' }}>
                {stats.active} active · {stats.completed} completed · {stats.total} total
                {apiAvailable ? ' · API online' : ' · Offline mode'}
              </p>
              {loading && <span style={{ color: 'var(--secondary)' }}>Syncing…</span>}
            </div>
            <TodoInput onAdd={addTodo} />
          </div>

          <TodoList
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
            onClearCompleted={clearCompleted}
            onToggleAll={toggleAll}
          />

          <p style={{ color: 'var(--secondary)', fontSize: 12, marginTop: 16 }}>
            Env: {envInfo || 'development'}
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;
