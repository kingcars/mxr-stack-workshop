import { types } from 'mobx-state-tree';
import xid from 'xid';

const Todo = types
  .model('Todo', {
    id: types.optional(types.identifier, xid.generateId),
    name: types.optional(types.string, '')
  })
  .actions(function (self) {
    return {
      setName(name) {
        self.name = name;
      }
    };
  });

export default Todo;
