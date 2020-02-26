import { Machine } from 'xstate';

const modalMachine = Machine({
  id: 'ModalMachine',
  initial: 'confirmation',
  context: {
    todoId: ''
  },
  states: {
    confirmation: {
      on: {
        CONFIRM_DELETE: 'confirmDelete',
        CANCEL_DELETE: 'cancelDelete'
      }
    },
    confirmDelete: {
      type: 'final',
      data(context) {
        return {
          deleteTodo: true,
          id: context.todoId
        };
      }
    },
    cancelDelete: {
      type: 'final',
      data() {
        return {
          deleteTodo: false
        };
      }
    }
  }
});

export default modalMachine;
