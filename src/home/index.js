import React, { useEffect } from 'react';
import { Observer } from 'mobx-react';
import TodoComponent from '../todos/todo.component';
import DeleteTodoModal from '../todos/todo.modal';
import Loader from './home.loader';
import machine from './home.machine';
import store from './home.store';

import './home.css';

export default function () {
  useEffect(function () {
    machine.send('LOAD');
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h2 className="header-title">Welcome to the MXR Stack Workshop</h2>
        <button
          type="button"
          className="add-button"
          onClick={function () {
            machine.send('ADD_TODO');
          }}
        >
          Add Todo
        </button>
      </div>
      <Observer>
        {function () {
          if (store.currentState === 'loadTodos')  {
            return (<Loader />);
          }

          return (
            <ul className="todos">
              {store.todos.map(function (todo) {
                return (
                  <li key={todo.id}>
                    <TodoComponent
                      todo={todo}
                      onChange={function (e) {
                        machine.send('EDIT_TODO', { id: todo.id, name: e.target.value });
                      }}
                      onDeleteClick={function () {
                        machine.send('DELETE_TODO', { id: todo.id });
                      }}
                    />
                  </li>
                );
              })}
            </ul>
          );
        }}
      </Observer>
      <Observer>
        {function () {
          return (
            <DeleteTodoModal
              visible={store.currentState === 'showDeleteModal'}
              machine={machine}
            />
          );
        }}
      </Observer>
    </div>
  );
}
