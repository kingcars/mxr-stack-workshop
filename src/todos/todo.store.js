import { types } from 'mobx-state-tree';
import xid from 'xid';

function generateId() {
  return xid.generateId();
}

const Todo = types
  .model('Todo', {
    id: types.optional(types.identifier, generateId),
    name: types.optional(types.string, 'New Todo')
  })
  .actions(function (self) {
    return {
      setName(name) {
        self.name = name;
      }
    };
  });

export default Todo;
