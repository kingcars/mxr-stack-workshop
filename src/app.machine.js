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
      console.log('loading todos!');
    },
    logLoaded() {
      store.setCurrentState('loaded');
      console.log('loaded todos!');
    },
    setTodos() {
      console.log('set todos!');
    }
  }
});

const appMachineService = interpret(appMachine);
appMachineService.start();

export default appMachineService;
