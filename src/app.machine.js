import { Machine, interpret } from 'xstate';
import store from './app.store';
import api from './app.api';

const appMachine = Machine({
  id: 'AppMachine',
  initial: 'waiting',
  states: {
    waiting: {
      on: {
        LOAD: 'loadTodos'
      }
    },
    loadTodos: {
      onEntry: 'logLoadTodos',
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
      onEntry: 'logLoaded'
    }
  }
}, {
  actions: {
    logLoadTodos() {
      store.setCurrentState('loadTodos');
    },
    logLoaded() {
      store.setCurrentState('loaded');
    },
    setTodos(_, event) {
      store.setTodos(event.data);
    }
  }
});

const appMachineService = interpret(appMachine);
appMachineService.start();

export default appMachineService;
