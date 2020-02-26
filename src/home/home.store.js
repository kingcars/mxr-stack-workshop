import { types, resolveIdentifier, destroy } from 'mobx-state-tree';
import TodoModel from '../todos/todo.store';

const HomeStore = types
  .model('HomeStore', {
    currentState: types.optional(types.string, ''),
    deleteTodoId: types.optional(types.string, ''),
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
      setDeleteTodoId(todoId) {
        self.deleteTodoId = todoId;
      },
      resetDeleteTodoId() {
        self.deleteTodoId = '';
      },
      updateTodo(id, name) {
        const todo = resolveIdentifier(TodoModel, self.todos, id);
        if (todo) todo.setName(name);
      },
      deleteTodo() {
        const todo = resolveIdentifier(TodoModel, self.todos, self.deleteTodoId);
        if (todo) destroy(todo);
      }
    };
  })
  .views(function (self) {
    return {
      get deleteTarget() {
        if (self.deleteTodoId) {
          const todo = resolveIdentifier(TodoModel, self.todos, self.deleteTodoId);
          return todo || {};
        }

        return {};
      }
    }
  });

export default HomeStore.create({});
