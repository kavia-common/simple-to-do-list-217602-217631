import React from 'react';

/**
 * Header component showing app title and optional children (e.g., theme toggle)
 * PUBLIC_INTERFACE
 */
export default function Header({ children }) {
  /** This is a public function: Header component */
  return (
    <header className="todo-header">
      <div className="container header-inner">
        <h1 className="app-title">Simple To‑do</h1>
        <div className="header-actions">
          {children}
        </div>
      </div>
    </header>
  );
}
