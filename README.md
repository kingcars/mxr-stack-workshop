# mxr-stack-workshop

## Introduction
Welcome to the MXR stack workshop! We have spent the last several months developing and refining a tech stack which we believe will help us avoid the inevitable nature of many code bases, in which they become cumbersome and unmaintainable over time. We've done so by implementing various libraries, patterns and practices which encourage strict separation of concern and developer sympathy. This workshop will step you through the basic principles and impactful features of this tech stack.

## Table of Contents

* [The Basics](#the-basics)
* [Our Philosophy](#our-philosophy)
  * [Data Handling](#data-handling)
  * [Actions/UI Flow](#actionsui-flow)
  * [Stateless UI Components](#stateless-ui-components)
* [Installation](#installation)
* [Instructions](#instructions)
  * [Step 1 - Defining the UI Flow using XState](#step-1---defining-the-ui-flow-using-xstate)
  * [Step 2 - Creating models with Mobx State Tree](#step-2---creating-models-with-mobx-state-tree)
  * [Step 3 - Loading Todos](#step-3---loading-todos)
  * [Step 4 - Adding Todos](#step-4---adding-todos)
  * [Step 5 - Editing Todos](#step-5---editing-todos)
  * [Step 6 - Deleting Todos](#step-6---deleting-todos)
  * [Step 7 - Polish & Nice-to-Haves](#step-7---polish--nice-to-haves)

## The Basics
The MXR tech stack utilizes three key components: [Mobx State Tree](https://mobx-state-tree.js.org/intro/philosophy), [XState](https://xstate.js.org/docs/about/concepts.html) and [React](https://reactjs.org/docs/getting-started.html). Mobx State Tree is the state management library; it enables us to utilize type-safe, defined data models throughout our application. XState is a library used for defining and executing finite state machines, which act as fully declarative action drivers throughout the application. Finally, React is used for the view layer, but all views are stateless and include no application/business logic.

## Our Philosophy

#### Data Handling

The plague of data ambiguity is no longer a concern, thanks to the type-safe, defined data models of Mobx State Tree. The ability to define and compose data models also means that models can be shared across the application, meaning that a single model can be used as a source of truth across multiple areas of the application; any time that model changes, it only needs to change in one place. Under the MXR stack, stores are purely repositories for data. They do not handle API calls or data flow logic. This makes the stores an easy one-stop shop for understanding what data is being used throughout the application and exactly how it's structured.

#### Actions/UI Flow

One of the biggest pain points of jumping into any front end application is figuring out what the UI actually does. This often requires tedious sifting through dozens of component files, stores and utility functions where things often become intertwined in complex and confusing ways. Using XState's finite state machines as our only actions driver, this is no longer a problem. Understanding the flow of the UI is simply a case of reading through the machine configuration for a given page. This makes the UI flow much easier to reason about due to the declarative nature of the machine configurations and the fact that UI flows live in a clearly defined place.

#### Stateless UI Components

UI components are often a center of complexity. They end up handling many core aspects of an application, including application logic, API calls, internal state etc. Under the MXR stack, UI components are intended to remain stateless and are only responsible for sending events and rendering UI. This keeps them free of clutter, easy to read and easy to update.

## Installation

After cloning the repository, open a command window in the project's base folder. Run `npm install` then `npm start`.

Note: Recommended to have Node `10.13.0` or higher.

## Instructions

Here we have a basic version of a `Todos` application. The basic pieces for a functional application are already provided, but we need to tie everything together by creating machine states, adding state transitions and updating/creating Mobx State Tree models. By the end, we should be able to:

- Load Todos from a mock API call
- Add Todos
- Edit Todos
- Delete Todos through a confirmation modal

#### Step 1 - Defining the UI Flow using XState

The first thing we want to do is lay out the core UI flow. To do this, we'll be adding code to `src/home/home.machine.js`. First, let's think about the steps we want the application to go through:

- App starts in an initial state
- Upon the user visiting the page, kick off an API call to load todos
- Once the API call completes, add the todos to a store
- Allow the user to add/edit/delete todos

With that figured out, let's add some necessary imports and create a finite state machine:

```javascript
import { Machine, interpret } from 'xstate';
import api from './home.api';

const homeMachine = Machine({
  id: 'HomeMachine'
});
```

The first thing we want to do from here is tell the machine what its initial state will be. Let's call this state `waiting`:

```javascript
const homeMachine = Machine({
  id: 'HomeMachine',
  initial: 'waiting'
});
```

From here, we can define the aforementioned `waiting` state:

```javascript
const homeMachine = Machine({
  id: 'HomeMachine',
  initial: 'waiting',
  states: {
    waiting: {}
  }
});
```

As discussed previously, we want the ability to kick off an API call from the waiting state. So first, we'll add a state for that and call it `loadTodos`:

```javascript
const homeMachine = Machine({
  id: 'HomeMachine',
  initial: 'waiting',
  states: {
    waiting: {},
    loadTodos: {}
  }
});
```

Once the API call has loaded, we'll want a state in which the user can perform their `add`, `edit` and `delete` actions. Let's call this state `loaded`. After this, we'll start working through the states and their necessary transitions.

```javascript
const homeMachine = Machine({
  id: 'HomeMachine',
  initial: 'waiting',
  states: {
    waiting: {},
    loadTodos: {},
    loaded: {}
  }
});
```

The first transition in this machine will be from the initial `waiting` state to the `loadTodos` state, so we need to add a transition definition. Let's tell the finite state machine to listen for a `LOAD` event in the `waiting` state in order to transition to the `loadTodos` state:

```javascript
const homeMachine = Machine({
  id: 'HomeMachine',
  initial: 'waiting',
  states: {
    waiting: {
      on: {
        LOAD: 'loadTodos'
      }
    },
    loadTodos: {},
    loaded: {}
  }
});
```

The `loadTodos` state is for running an API call, which will require using a concept called [invoke](https://xstate.js.org/docs/guides/communication.html#the-invoke-property). In `XState`, it is possible for a machine to `invoke` various things - API calls (Promises), callbacks, observables and even other XState machines. In this case, we'll be invoking a `Promise`, taken directly from the `api` import we added previously. When invoking a `Promise`, we can define state transitions based on whether the `Promise` succeeded (resolved) or failed (rejected). This can be done by using the `onDone` and `onError` properties of the `invoke` configuration. Since this is a mock API call, we'll only be defining an `onDone` transition today.

```javascript
const homeMachine = Machine({
  id: 'HomeMachine',
  initial: 'waiting',
  states: {
    waiting: {
      on: {
        LOAD: 'loadTodos'
      }
    },
    loadTodos: {
      invoke: {
        id: 'appApi',
        src: api,
        onDone: {
          target: 'loaded'
        }
      }
    },
    loaded: {}
  }
});
```

With all of the transitions now defined, we can move onto `actions`. `Actions` are simply functions that can be performed at defined points in a state machine. They can happen on an event, on the entry of a state or even on the exit of a state. The first `action` we hit in this machine will be taking the todos that are loaded from the mock API call and placing them in the store. Let's call this action `setTodos` and add it to the `onDone` event of the `invoke` in `loadTodos`:

```javascript
const homeMachine = Machine({
  id: 'HomeMachine',
  initial: 'waiting',
  states: {
    waiting: {
      on: {
        LOAD: 'loadTodos'
      }
    },
    loadTodos: {
      invoke: {
        id: 'appApi',
        src: api,
        onDone: {
          target: 'loaded',
          actions: 'setTodos'
        }
      }
    },
    loaded: {}
  }
});
```

Next, we'll want to add `add` and `edit` actions to the `loaded` state, which will enable the user to perform those actions (don't worry, `delete` comes later). Let's run those actions on the `ADD_TODO` and `EDIT_TODO` events respectively:

```javascript
const homeMachine = Machine({
  id: 'HomeMachine',
  initial: 'waiting',
  states: {
    waiting: {
      on: {
        LOAD: 'loadTodos'
      }
    },
    loadTodos: {
      invoke: {
        id: 'appApi',
        src: api,
        onDone: {
          target: 'loaded',
          actions: 'setTodos'
        }
      }
    },
    loaded: {
      on: {
        ADD_TODO: {
          actions: 'addTodo'
        },
        EDIT_TODO: {
          actions: 'editTodo'
        }
      }
    }
  }
});
```

You may be wondering where these actions actually get pulled from. The answer is easy: We define them within the `XState` configuration! `Machine` takes two arguments: the first being the machine configuration and the second being a mapping of `actions`, `services` and `guards`. In this workshop, we'll only be covering `actions`. For now, since we don't have the store created yet, we'll simply have these actions run some `console.log`s so we can see everything working.

```javascript
const homeMachine = Machine({
  id: 'HomeMachine',
  initial: 'waiting',
  states: {
    waiting: {
      on: {
        LOAD: 'loadTodos'
      }
    },
    loadTodos: {
      invoke: {
        id: 'appApi',
        src: api,
        onDone: {
          target: 'loaded',
          actions: 'setTodos'
        }
      }
    },
    loaded: {
      on: {
        ADD_TODO: {
          actions: 'addTodo'
        },
        EDIT_TODO: {
          actions: 'editTodo'
        }
      }
    }
  }
}, {
  actions: {
    setTodos(_, event) {
      console.log('setTodos', event.data);
    },
    addTodo() {
      console.log('addTodo');
    },
    editTodo(_, event) {
      console.log('edit todo', event.id, event.name);
    }
  }
});
```

You may notice that actions take two parameters. The first one is called `context`, which is a reference to the machine's own data store. We won't be using `context` in this workshop, so we're just replacing it with `_` for simplicity's sake. The second parameter is called `event` which will include any data passed from the event that has been fired. For an `onDone` event from a `Promise`, `event` will include the data that was sent to the `resolve` callback in the `Promise`, as we will see here with `event.data`.

Now that we have the machine laid out, let's get it ready to test. First, we'll be using `XState`'s [interpreter](https://xstate.js.org/docs/guides/interpretation.html#interpreting-machines) to start the machine, track transitions and send events to the machine. This code will be at the bottom of `home.machine.js`.

```javascript
const homeMachineService = interpret(homeMachine);
homeMachineService.start();

homeMachineService.onTransition(function (state) {
  console.log('transition!', state.value);
});

export default homeMachineService;
```

Since the machine is now available for `import`, we can add an import statement to `src/home/index.js`:

```javascript
import machine from './home.machine';
```

And finally, we'll fire off the `LOAD` event when the user visits the page using the available `useEffect` hook, replacing the `// Do something when the component mounts` comment with `machine.send('LOAD');`:

```javascript
useEffect(function () {
  machine.send('LOAD');
}, []);
```

If everything is working correctly, loading up the application should produce this output in console:

```javascript
transition! waiting
transition! loadTodos
setTodos >(3) [{...}, {...}, {...}]
transition! loaded
```

Now that we can see the machine working, we can fire the `ADD_TODO` and `EDIT_TODO` events from the React component in `src/home/index.js`.

Replace the `// Add a Todo` comment line with

```javascript
machine.send('ADD_TODO');
```

Replace the `// Edit a Todo` comment line with

```javascript
machine.send('EDIT_TODO', { id: todo.id, name: e.target.value });
```

For the `EDIT_TODO` event, we'll want to know the `id` of the todo we're editing along with the updated `name`, so we'll pass that information to the event here.

If everything is working properly, clicking the `Add Todo` button should show `addTodo` in console and trying to type into one of the textboxes should result in `edit todo` along with an id and a name in console. Don't worry if the values aren't changing when you type; we'll have that fixed later on. You may also see `transition! loaded` pop up in console when testing these actions, which is expected. When an event transition does not contain a `target`, it is considered an [internal transition](https://xstate.js.org/docs/guides/actions.html#actions-on-self-transitions).

#### Step 2 - Creating models with Mobx State Tree

The next major pieces of the puzzle are the data models. In this application, we'll have two data models: one for storing the base level application/page data, which will include things like the application's `currentState` along with a list of `todos`. The list of `todos` will be an array of `Todo` models; the `Todo` model will include a unique `id` along with a `name`. Since the base level model requires a `Todo` model, let's start with the `Todo` model. We'll navigate over to `src/todos/todo.store.js` and start with the necessary imports:

```javascript
import { types } from 'mobx-state-tree';
import xid from 'xid';
```

Next, we'll begin to define a `Mobx State Tree` model, which will describe the data we wish to collect for a todo:

```javascript
const Todo = types
  .model('Todo', {
    id: types.identifier,
    name: types.string
  });

export default Todo;
```

`types.identifier` indicates to `Mobx State Tree` that the corresponding field will contain a unique value for each instance of the model. As we will see later in the workshop, this allows `Mobx State Tree` to do some very powerful and useful things in order to make tedious work much easier. However, right now, we do need to clarify that these fields will not always be pre-determined, due to the fact that we will be adding new "blank" `Todos` to the list. In order to do this, we'll use `types.optional` which will allow us to not only define the underlying type (ie `string`), but also define a default value. The default value can either be a standalone value or a function that returns a value.

```javascript
function generateId() {
  return xid.generateId();
}

const Todo = types
  .model('Todo', {
    id: types.optional(types.identifier, generateId),
    name: types.optional(types.string, 'New Todo')
  });

export default Todo;
```

Now, any time we create a blank `Todo`, a unique `id` will be automatically generated and the `name` will default to `New Todo`.

The next thing to consider is that we'll want the ability for the user to change the `name` of a `Todo`. In order to allow for this, we'll need to add an `action` to the model. We'll call this one `setName`:

```javascript
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
```

That's all we need to do for the `Todo` model. Next, we'll move into the `Home` model in `src/home/home.store.js` and start by adding the necessary imports:

```javascript
import { types, resolveIdentifier } from 'mobx-state-tree';
import TodoModel from '../todos/todo.store';
```

Next, let's define the model. For now, the two things we need are a list of `Todos` and a string value for `currentState`. `currentState` will represent the name of the `state` that the `machine` currently resides in.

```javascript
const Home = types
  .model('Home', {
    currentState: types.optional(types.string, ''),
    todos: types.array(TodoModel)
  });
```

Like with the `Todo` model, we now need to consider the actions we'd like the user to take. In this case, let's start by adding actions for updating the `currentState`, setting the loaded list of todos and adding a todo

```javascript
const Home = types
  .model('Home', {
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
      }
    };
  });
```

Since `setCurrentState` is now added, let's make sure the `machine` is constantly reporting its current state to the store. To do this, we just need to go to `src/home/home.machine.js`, import the home store and change `console.log('transition!', state.value);` to call the store's `setCurrentState` function instead.

```javascript
import store from './home.store';
```

```javascript
homeMachineService.onTransition(function (state) {
  store.setCurrentState(state.value);
});
```

Next, let's tackle editing a todo. In order to do this, we'll need a way to grab a specific `todo` then call its `setName` function to update the name. While in many JavaScript solutions, this would require looping through an array in search of an object with a specific `id`, with `Mobx State Tree`, it is very simple. `Mobx State Tree` provides a function called `resolveIdentifier`. This function takes 3 parameters - the type of `model` you're searching for, a collection that contains the models in which to search, and the unique `id` for the model. Once it runs, it will return the model with the matching identifier. Remember the `types.identifier` that we configured for the `Todo` model? That is what `Mobx State Tree` uses to find a specific model with `resolveIdentifier`.

The first line in our action function will be running `resolveIdentifier`, telling it that we want to find a `TodoModel` that lives within the list of todos (`self.todos`) and whose `identifier` matches the provided `id`. On the next line, if a `todo` is found, we will update its name to the specified name. So now the model should look like this:

```javascript
const Home = types
  .model('Home', {
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
      }
    };
  });
```

The last thing we need to do is `export` an instance of this model for our application to start with. We'll do this by running `create` on our model and exporting the instance. Since we want to start with a blank slate, we'll pass in an empty object. But if there's ever the need to pre-load any data into the store, it can be passed in here.

```javascript
export default Home.create({});
```

Great! Now that the models are complete, we can start hooking them up with the rest of the application!

#### Step 3 - Loading Todos

We already have the `LOAD` event firing to the `machine` in the `useEffect` hook, and we already have a `console.log` showing that the data is making it from the mock API to the `setTodos` machine action. All we need to do now is get the `machine` talking to the `store`.

Let's open up `src/home/home.machine.js`. Here, we'll replace the `console.log` in the `setTodos` action with a call to the `setTodos` function in the `store`. The `actions` block should now look like this:

```javascript
actions: {
  setTodos(_, event) {
    store.setTodos(event.data);
  },
  addTodo() {
    console.log('addTodo');
  },
  editTodo(_, event) {
    console.log('edit todo', event.id, event.name);
  }
}
```

Next, in order to utilize this store data, we'll want to replace the hard-coded data in `src/home/index.js` with the data we're loading into the store. We'll start by `importing` the store:

```javascript
import store from './home.store';
```

Next, we'll remove the hard coded list of todos shown below.

```javascript
const todos = [{
  id: '16n5jkgfc0d4k760',
  name: 'Take a shower'
}, {
  id: '9a2889n7f55s410v',
  name: 'Walk the dog'
}, {
  id: 'pmakvvvb1s2aapkf',
  name: 'Go to work'
}];
```

Finally, we'll update the `React` component to loop through the list of todos from the store instead of the hard coded list:

```javascript
{store.todos.map(function (todo) {
  return (
    <li key={todo.id}>
      <TodoComponent
        todo={todo}
        onChange={function (e) {
          machine.send('EDIT_TODO', { id: todo.id, name: e.target.value });
        }}
        onDeleteClick={function () {
          // Delete a Todo
        }}
      />
    </li>
  );
})}
```

Ok, great, the application seems to be running...but why isn't the list of todos showing up any more? The answer is simple: We need to add an `Observer` wrapper around the parts of the UI that we want to update based on store data. `Mobx` uses a component called an `Observer` which allows us to specify particular parts of the UI that need to update based on relevant data. The beauty of this is that React components can be sectioned off so that changes to one section won't cause another section to re-render. This can help the application maintain optimal performance and reduce re-renders. For now, we'll add one such component around the todos list:

```javascript
import { Observer } from 'mobx-react';
```

Note how the `Observer` component takes a function that returns `jsx`.
```javascript
<Observer>
  {function () {
    return (
      <ul className="todos">
        {store.todos.map(function (todo) {
          return (
            <li key={todo.id}>
              <TodoComponent
                todo={todo}
                onChange={function (e) {
                  machine.send('EDIT_TODO', { id: todo.id, name: e.target.value });
                }}
                onDeleteClick={function () {
                  // Delete a Todo
                }}
              />
            </li>
          );
        })}
      </ul>
    );
  }}
</Observer>
```

With this addition, the loaded `todos` list should now be showing up in the UI!

#### Step 4 - Adding Todos

The process for adding todos will be pretty similar to the process followed above. We already have the `ADD_TODO` event firing and logging out, so all we need to do is call the `store` instead of logging. To accomplish this, go to `src/home/home.machine.js` and replace the `console.log` in `addTodo` with a call to `store.addTodo`.

```javascript
actions: {
  setTodos(_, event) {
    store.setTodos(event.data);
  },
  addTodo() {
    store.addTodo();
  },
  editTodo(_, event) {
    console.log('edit todo', event.id, event.name);
  }
}
```

Clicking the `Add` button should now add a todo to the list in the UI.

#### Step 5 - Editing Todos

Hooking up the `edit` functionality will follow the exact same process. In `src/home/home.machine.js`, we will replace the `console.log` in `editTodo` with a call to `store.updateTodo`.

```javascript
actions: {
  setTodos(_, event) {
    store.setTodos(event.data);
  },
  addTodo() {
    store.addTodo();
  },
  editTodo(_, event) {
    store.updateTodo(event.id, event.name);
  }
}
```

Typing in the text boxes for each todo should now show the changes in real time!

#### Step 6 - Deleting Todos

Deleting todos will be a little more complex because we want to have the user confirm the action via a modal before performing it. The first thing we'll want to do is define the user flow for the modal and translate that into a machine. The user flow should be rather simple: the modal starts in a state in which the user can choose to confirm or cancel the action. Upon making the selection, the todo should be deleted (if confirmed) and the modal should close. So let's go to `src/todos/todo.modal.machine.js` and write out a machine for this flow:

```javascript
import { Machine } from 'xstate';

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
      // Perform the delete
    }
  }
});

export default modalMachine;
```

Notice how the `closeModal` state has a `type` of `final`. This is a way to indicate that the machine has completed its flow. When we go to `invoke` this machine in the `home` machine, the `onDone` event will fire once the `final` state is reached in the same way it fires when a `Promise` resolves. Since we're on the subject, let's go over to `src/home/home.machine.js` and add a state for showing the modal:

First, add the required import:
```javascript
import todoModalMachine from '../todos/todo.modal.machine';
```

Next, add a state called `showDeleteModal` which `invokes` the `todoModalMachine` and returns to the `loaded` state once completed.

```javascript
states: {
  waiting: {
    on: {
      LOAD: 'loadTodos'
    }
  },
  loadTodos: {
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
    on: {
      ADD_TODO: {
        actions: 'addTodo'
      },
      EDIT_TODO: {
        actions: 'editTodo'
      }
    }
  },
  showDeleteModal: {
    invoke: {
      id: 'todoDeleteModal',
      src: todoModalMachine,
      autoForward: true,
      onDone: 'loaded'
    }
  }
}
```
Note the `autoForward: true` configuration item. That tells XState that any event that gets passed to the parent machine (in this case, `homeMachine`) gets forwarded to any active child machines (in this case, `todoModalMachine`). This will be useful since our modal UI will send the `CONFIRM_DELETE` and `CANCEL_DELETE` events through `homeMachine`, as we'll see momentarily.

From here, we'll add an event to the `loaded` state called `DELETE_TODO` which will transition the user to the `showDeleteModal` state.

```javascript
loaded: {
  on: {
    ADD_TODO: {
      actions: 'addTodo'
    },
    EDIT_TODO: {
      actions: 'editTodo'
    },
    DELETE_TODO: 'showDeleteModal'
  }
}
```

Once that's added, we'll run an action called `setDeleteTodo` when the user enters the `showDeleteModal` state. We'll be using the `onEntry` configuration option to do this.

```javascript
showDeleteModal: {
  onEntry: 'setDeleteTodo',
  invoke: {
    id: 'todoDeleteModal',
    src: todoModalMachine,
    autoForward: true,
    onDone: 'loaded'
  }
}
```

Then we'll add the `setDeleteTodo` action to the actions block. For now, it will just be empty, but we'll come back to it momentarily.

```javascript
actions: {
  setTodos(_, event) {
    store.setTodos(event.data);
  },
  addTodo() {
    store.addTodo();
  },
  editTodo(_, event) {
    store.updateTodo(event.id, event.name);
  },
  setDeleteTodo(_, event) {
    // Set the todo id to delete
  }
}
```

Now that the machines are updated, we'll need to update the `home` store so we can keep track of which `todo` the user is trying to delete. To do so, let's navigate over to `src/home/home.store.js`. From here, we'll want to add a `deleteTodoId` field and an action for updating it:

```javascript
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
      setDeleteTodoId(todoId) {
        self.deleteTodoId = todoId;
      }
    };
  });
```

In this instance, we're using what's called a `reference` type. This allows us to set the value to an `identifier` of one of our `TodoModels` from the `todos` array. At that point, any time we refer to `store.deleteTodoId`, it will give us a full reference to the corresponding `TodoModel`.

Next, we'll want an action for performing the actual deletion of a todo. For this, we'll want to update the `mobx-state-tree` import to include `destroy`. This is a built-in function which can be used to remove a model instance from a store.

```javascript
import { types, resolveIdentifier, destroy } from 'mobx-state-tree';
```

After that, we'll need an action function which will find and delete the specified todo. Here, we'll simply leverage our reference type value and directly call `destroy` on it. The resulting action should look like this:

```javascript
deleteTodo() {
  destroy(self.deleteTodoId);
}
```

Now that the store is finished, let's add the calls to its new functions in our machines. First, let's head over to `src/home/home.machine.js` and add a call to `setDeleteTodoId` in the `setDeleteTodo` action:

```javascript
actions: {
  setTodos(_, event) {
    store.setTodos(event.data);
  },
  addTodo() {
    store.addTodo();
  },
  editTodo(_, event) {
    store.updateTodo(event.id, event.name);
  },
  setDeleteTodo(_, event) {
    store.setDeleteTodoId(event.id);
  }
}
```

Next, we'll go to `src/todos/todo.modal.machine.js` and add a `store` import and a call to the store's `deleteTodo` function.

```javascript
import store from '../home/home.store';
```

```javascript
actions: {
  deleteTodo() {
    store.deleteTodo();
  }
}
```

With all of that complete, it's time to add the modal to the UI! First, we'll open up `src/home/index.js`, `import` the modal and add an `Observer` section at the bottom for rendering it:

```javascript
import DeleteTodoModal from '../todos/todo.modal';
```

```javascript
<Observer>
  {function () {
    return (
      <DeleteTodoModal />
    );
  }}
</Observer>
```

The modal takes 3 props, but we'll only be using two for now: `visible` and `machine`. `Visible` is a boolean telling the modal whether it's open or closed and `machine` is just a reference to the `homeMachine`. As mentioned earlier, the `modal` will be sending events through the `homeMachine` which will then be forwarded to the `todoModalMachine`.

The nice thing to note here is that the `visible` boolean is easily set by checking the current state of the `machine` - we only want the modal to show when the user is in the `showDeleteModal` state.

```javascript
<Observer>
  {function () {
    return (
      <DeleteTodoModal
        visible={store.currentState === 'showDeleteModal'}
        machine={machine}
      />
    );
  }}
</Observer>
```

The last thing we need to do now is fire off the events. We'll first be doing this by replacing the `// Delete a Todo` comment with an event and the corresponding todo id:

```javascript
onDeleteClick={function () {
  machine.send('DELETE_TODO', { id: todo.id });
}}
```

Next, we'll open up `src/todos/todo.modal.js` and replace the `// Cancel Delete` and `// Confirm Delete` comments with their respective events:

```javascript
<button
  className="cancel-button"
  type="button"
  onClick={function () {
    machine.send('CANCEL_DELETE');
  }}
>
  Cancel
</button>
<button
  className="confirm-button"
  type="button"
  onClick={function () {
    machine.send('CONFIRM_DELETE');
  }}
>
  Confirm
</button>
```

Now start up the application and try it out!

#### Step 7 - Polish & Nice-to-Haves

So we have all of the basic requirements completed, but the application is still rough around the edges. For example, the 1.5 second wait on the mock API call creates a strange situation where the center of the screen is blank until the call completes. Thanks to the state based nature of the MXR stack, it is easy to add rendering logic based off the machine's current state (which gets reported to the `currentState` value of the store). All we need to do here is pull in the `Loader` component add some logic in the render function of `src/home/index.js` that renders it while the application is in the `loadTodos` state:

```javascript
import Loader from './home.loader';
```

```javascript
<Observer>
  {function () {
    if (store.currentState === 'loadTodos')  {
      return (<Loader />);
    }

    return (
      <ul className="todos">
        {store.todos.map(function (todo) {
          return (
            <li key={todo.id}>
              <TodoComponent
                todo={todo}
                onChange={function (e) {
                  machine.send('EDIT_TODO', { id: todo.id, name: e.target.value });
                }}
                onDeleteClick={function () {
                  machine.send('DELETE_TODO', { id: todo.id });
                }}
              />
            </li>
          );
        })}
      </ul>
    );
  }}
</Observer>
```

Now while the todos are loading, the user should see a loading spinner appear on the screen.

More Polish & Nice-to-haves coming soon!
