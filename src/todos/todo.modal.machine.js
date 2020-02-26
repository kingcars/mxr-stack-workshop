import { Machine } from 'xstate';
import store from '../home/home.store';

const modalMachine = Machine({
  id: 'ModalMachine',
  initial: 'confirmation',
  states: {
    confirmation: {
      on: {
        CONFIRM_DELETE: 'confirmDelete',
        CANCEL_DELETE: 'cancelDelete'
      }
    },
    confirmDelete: {
      type: 'final',
      onEntry: 'deleteTodo'
    },
    cancelDelete: {
      type: 'final'
    }
  }
}, {
  actions: {
    deleteTodo() {
      store.deleteTodo();
      store.resetDeleteTodoId();
    }
  }
});

export default modalMachine;
