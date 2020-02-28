import { Machine, interpret } from 'xstate';
import todoModalMachine from '../todos/todo.modal.machine';
import store from './home.store';
import api from './home.api';

const homeMachine = Machine({
  id: 'HomeMachine',
  initial: 'waiting',
  states: {
    waiting: {
      on: {
        LOAD: 'loadTodos'
      }
    },
    loadTodos: {
      invoke: {
        id: 'appApi',
        src: api,
        onDone: {
          target: 'loaded',
          actions: 'setTodos'
        }
      }
    },
    loaded: {
      on: {
        ADD_TODO: {
          actions: 'addTodo'
        },
        EDIT_TODO: {
          actions: 'editTodo'
        },
        DELETE_TODO: 'showDeleteModal'
      }
    },
    showDeleteModal: {
      onEntry: 'setDeleteTodo',
      invoke: {
        id: 'todoDeleteModal',
        src: todoModalMachine,
        autoForward: true,
        onDone: 'loaded'
      }
    }
  }
}, {
  actions: {
    setTodos(_, event) {
      store.setTodos(event.data);
    },
    addTodo() {
      store.addTodo();
    },
    editTodo(_, event) {
      store.updateTodo(event.id, event.name);
    },
    setDeleteTodo(_, event) {
      store.setDeleteTodoId(event.id);
    }
  }
});

const homeMachineService = interpret(homeMachine);
homeMachineService.start();

homeMachineService.onTransition(function (state) {
  store.setCurrentState(state.value);
});

export default homeMachineService;
