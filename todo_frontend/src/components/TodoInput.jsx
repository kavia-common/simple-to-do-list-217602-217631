import React, { useState } from 'react';

/**
 * Input box for adding new todos with submit button
 * PUBLIC_INTERFACE
 */
export default function TodoInput({ onAdd }) {
  /** This is a public function: TodoInput component */
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    onAdd(value);
    setText('');
  };

  return (
    <form className="todo-input" onSubmit={handleSubmit} aria-label="Add todo form">
      <input
        type="text"
        className="input"
        placeholder="What needs to be done?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="New todo text"
      />
      <button type="submit" className="btn-primary" aria-label="Add todo">
        Add
      </button>
    </form>
  );
}
