import React from 'react';
import PropTypes from 'prop-types';

import './todo.component.css';

function Todo({ todo, onChange, onDeleteClick }) {
  return (
    <div className="todo">
      <div className="todo-name-input-col">
        <input
          type="text"
          className="todo-name-input"
          value={todo.name}
          onChange={onChange}
          placeholder="Enter a name..."
        />
      </div>
      <div className="todo-delete-col">
        <button type="button" className="todo-delete-button" onClick={onDeleteClick}>
          Delete
        </button>
      </div>
    </div>
  );
}

Todo.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }),
  onChange: PropTypes.func,
  onDeleteClick: PropTypes.func
};

Todo.defaultProps = {
  todo: {
    id: '',
    name: ''
  },
  onChange() {},
  onDeleteClick() {}
};

export default Todo;
