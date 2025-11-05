import React, { useMemo, useState } from 'react';
import TodoItem from './TodoItem';

/**
/** PUBLIC_INTERFACE
 * Renders list of todos with filter tabs and bulk actions
 */
export default function TodoList({ todos, onToggle, onDelete, onUpdate, onClearCompleted, onToggleAll }) {
  /** This is a public function: TodoList component */
  const [filter, setFilter] = useState('all');

  const counts = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const active = total - completed;
    return { total, completed, active };
  }, [todos]);

  const filtered = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  return (
    <section className="todo-list">
      <div className="list-controls">
        <div className="filters" role="tablist" aria-label="Todo filters">
          <button
            className={`chip ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
            role="tab"
            aria-selected={filter === 'all'}
          >
            All ({counts.total})
          </button>
          <button
            className={`chip ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
            role="tab"
            aria-selected={filter === 'active'}
          >
            Active ({counts.active})
          </button>
          <button
            className={`chip ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
            role="tab"
            aria-selected={filter === 'completed'}
          >
            Completed ({counts.completed})
          </button>
        </div>

        <div className="bulk-actions">
          <button className="btn-secondary" onClick={onToggleAll}>
            Toggle All
          </button>
          <button
            className="btn-danger"
            onClick={onClearCompleted}
            disabled={counts.completed === 0}
            title={counts.completed === 0 ? 'No completed tasks' : 'Clear completed tasks'}
          >
            Clear Completed
          </button>
        </div>
      </div>

      <ul className="items">
        {filtered.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
        {filtered.length === 0 && (
          <li className="empty">Nothing here yet. Add a task above.</li>
        )}
      </ul>
    </section>
  );
}
