import { types, resolveIdentifier, destroy } from 'mobx-state-tree';
import TodoModel from '../todos/todo.store';

const Home = types
  .model('Home', {
    currentState: types.optional(types.string, ''),
    deleteTodoId: types.reference(TodoModel),
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
      setDeleteTodoId(id) {
        self.deleteTodoId = id;
      },
      deleteTodo() {
        if (self.deleteTodoId) destroy(self.deleteTodoId);
      }
    };
  });

export default Home.create({
  deleteTodoId: ''
});
