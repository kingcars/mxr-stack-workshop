import { Machine } from 'xstate';
import store from '../home/home.store';

const modalMachine = Machine({
  id: 'ModalMachine',
  initial: 'confirmation',
  states: {
    confirmation: {
      on: {
        CONFIRM_DELETE: {
          target: 'closeModal',
          actions: 'deleteTodo'
        },
        CANCEL_DELETE: 'closeModal'
      }
    },
    closeModal: {
      type: 'final'
    }
  }
}, {
  actions: {
    deleteTodo() {
      store.deleteTodo();
    }
  }
});

export default modalMachine;
