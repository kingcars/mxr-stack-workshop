import { Machine, interpret } from 'xstate';
import todoModalMachine from '../todos/todo.modal.machine';
import store from './home.store';
import api from './home.api';

const homeMachine = Machine({
  id: 'AppMachine',
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
          actions: 'setTodos',
          target: 'loaded'
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
      invoke: {
        id: 'todoDeleteModal',
        src: todoModalMachine,
        autoForward: true,
        data(_, event) {
          return {
            todoId: event.id
          };
        },
        onDone: [{
          target: 'loaded',
          actions: 'deleteTodo',
          cond: 'deleteConfirmed'
        }, {
          target: 'loaded',
          cond: 'deleteCanceled'
        }]
      }
    }
  }
}, {
  actions: {
    setTodos(_, event) {
      store.setTodos(event.data);
    },
    addTodo(_, event) {
      store.addTodo();
    },
    editTodo(_, event) {
      store.updateTodo(event.id, event.name);
    },
    deleteTodo(_, event) {
      const { id } = event.data;
      store.deleteTodo(id);
    }
  },
  guards: {
    deleteConfirmed(_, event) {
      const { deleteTodo } = event.data;
      return deleteTodo === true;
    },
    deleteCanceled(_, event) {
      const { deleteTodo } = event.data;
      return deleteTodo === false;
    }
  }
});

const homeMachineService = interpret(homeMachine);
homeMachineService.start();

homeMachineService.onTransition(function (state) {
  store.setCurrentState(state.value);
});

export default homeMachineService;
