import React, { useEffect } from 'react';
import { Observer } from 'mobx-react';
import TodoComponent from '../todos/todo.component';
import DeleteTodoModal from '../todos/todo.modal';
import machine from './home.machine';
import store from './home.store';

import './home.css';

export default function () {
  useEffect(function () {
    machine.send('LOAD');
  }, []);

  return (
    <div>
      <h2 className="header">Welcome to the MXR Stack Workshop</h2>
      <Observer>
        {function () {
          return (
            <div>
              <div>
                {store.currentState}
                <button
                  type="button"
                  onClick={function () {
                    machine.send('ADD_TODO');
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          );
        }}
      </Observer>
      <Observer>
        {function () {
          return (
            <div>
              {store.todos.map(function (todo) {
                return (
                  <TodoComponent
                    key={todo.id}
                    todo={todo}
                    onChange={function (e) {
                      machine.send('EDIT_TODO', { id: todo.id, name: e.target.value });
                    }}
                    onDeleteClick={function () {
                      machine.send('DELETE_TODO', { id: todo.id });
                    }}
                  />
                );
              })}
            </div>
          );
        }}
      </Observer>
      <Observer>
        {function () {
          return (
            <DeleteTodoModal visible={store.currentState === 'showDeleteModal'} machine={machine} />
          );
        }}
      </Observer>
    </div>
  );
}
