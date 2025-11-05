import React, { useState } from 'react';

/**
 * Single todo item with complete toggle, inline edit, and delete
 * PUBLIC_INTERFACE
 */
export default function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  /** This is a public function: TodoItem component */
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);

  const handleSave = () => {
    const next = draft.trim();
    if (next && next !== todo.text) {
      onUpdate(todo.id, { text: next });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setDraft(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <li className="todo-item" data-completed={todo.completed ? 'true' : 'false'}>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
        <span className="checkmark" />
      </label>

      {isEditing ? (
        <input
          className="item-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          autoFocus
          aria-label="Edit todo text"
        />
      ) : (
        <span
          className="item-text"
          onDoubleClick={() => setIsEditing(true)}
          title="Double-click to edit"
        >
          {todo.text}
        </span>
      )}

      <div className="item-actions">
        {!isEditing && (
          <button
            className="btn-ghost"
            onClick={() => setIsEditing(true)}
            aria-label="Edit todo"
            title="Edit"
          >
            ✏️
          </button>
        )}
        <button
          className="btn-ghost danger"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete todo"
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </li>
  );
}
