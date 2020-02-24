import { types } from 'mobx-state-tree';
import xid from 'xid';

const Todo = types
  .model('Todo', {
    id: types.optional(types.identifier, xid.generateId),
    name: types.optional(types.string, '')
  })

const AppStore = types
  .model('AppStore', {
    currentState: types.optional(types.string, ''),
    todos: types.array(Todo)
  })
  .actions(function (self) {
    return {
      setCurrentState(state) {
        self.currentState = state;
      },
      setTodos(todos) {
        self.todos = todos;
      }
    };
  });

export default AppStore.create({});
