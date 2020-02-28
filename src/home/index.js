import React, { useEffect } from 'react';
import TodoComponent from '../todos/todo.component';

import './home.css';

const todos = [{
  id: '16n5jkgfc0d4k760',
  name: 'Take a shower'
}, {
  id: '9a2889n7f55s410v',
  name: 'Walk the dog'
}, {
  id: 'pmakvvvb1s2aapkf',
  name: 'Go to work'
}];

export default function () {
  useEffect(function () {
    // Do something when the component mounts
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h2 className="header-title">Welcome to the MXR Stack Workshop</h2>
        <button
          type="button"
          className="add-button"
          onClick={function () {
            // Add a Todo
          }}
        >
          Add Todo
        </button>
      </div>
      <ul className="todos">
        {todos.map(function (todo) {
          return (
            <li key={todo.id}>
              <TodoComponent
                todo={todo}
                onChange={function (e) {
                  // Edit a Todo
                }}
                onDeleteClick={function () {
                  // Delete a Todo
                }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
