import { types, resolveIdentifier, destroy } from 'mobx-state-tree';
import TodoModel from '../todos/todo.store';

const HomeStore = types
  .model('HomeStore', {
    currentState: types.optional(types.string, ''),
    todos: types.array(TodoModel)
  })
  .actions(function (self) {
    return {
      setCurrentState(state) {
        self.currentState = state;
      },
      setTodos(todos) {
        self.todos = todos;
      },
      addTodo() {
        self.todos.push({});
      },
      updateTodo(id, name) {
        const todo = resolveIdentifier(TodoModel, self.todos, id);
        if (todo) todo.setName(name);
      },
      deleteTodo(id) {
        const todo = resolveIdentifier(TodoModel, self.todos, id);
        if (todo) destroy(todo);
      }
    };
  });

export default HomeStore.create({});
