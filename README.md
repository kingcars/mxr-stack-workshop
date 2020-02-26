# mxr-stack-workshop

## Introduction
Welcome to the MXR stack workshop! We have spent the last several months developing and refining a tech stack which we believe will help us avoid the inevitable nature of many code bases, in which they become cumbersome and unmaintainable over time. We've done so by implementing various libraries, patterns and practices which encourage strict separation of concern and developer sympathy. This workshop will step you through the basic principles and impactful features of this tech stack.

## Installation

After cloning the reponsitory, open a command window in the project's base folder. Run `npm install` then `npm start`.

Note: Recommended to have Node `10.13.0` or higher.

## Instructions

Here we have a basic version of a `Todos` application. The basic pieces for a functional application are already provided, but we need to tie everything together by creating machine states, adding state transitions and updating/creating mobx-state-tree models. By the end, we should be able to:

- Load Todos from a mock API call
- Add Todos
- Edit Todos
- Delete Todos through a confirmation modal

#### Step 1 - Defining the UI Flow using xState

The first thing we want to do is lay out the core UI flow. To do this, we'll be adding code to `src/home/home.machine.js`. First, let's think about the steps we want the application to go through:

- App starts in a waiting state
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

The first thing we want to do from here is tell the machine what its initial state will be. In this case, we want the machine to start in a waiting state:

```javascript
const homeMachine = Machine({
  id: 'HomeMachine',
  initial: 'waiting'
});
```

From here, we can define the `waiting` state:

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

The `loadTodos` state is for running an API call, which will require using a concept called [invoke](https://xstate.js.org/docs/guides/communication.html#the-invoke-property). In `xState`, it is possible for a machine to `invoke` various things - API calls (Promises), callbacks, observables and even other xState machines. In this case, we'll be invoking a `Promise`, taken directly from the `api` import we added previously. When invoking a `Promise`, we can define state transitions based on whether the `Promise` succeeded (resolved) or failed (rejected). This can be done by using the `onDone` and `onError` properties of the `invoke` configuration. Since this is a mock API call, we'll only be defining an `onDone` transition today.

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

You may be wondering where these actions actually get pulled from. The answer is easy: We define them within the `xState` configuration! `Machine` takes two arguments: the first being the machine configuration and the second being a mapping of `actions`, `services` and `guards`. In this workshop, we'll only be covering `actions`. For now, since we don't have the store created yet, we'll simply have these actions run some `console.log`s so we can see everything working.

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

Now that we have the machine laid out, let's get it ready to test. First, we'll be using `xState`'s [interpreter](https://xstate.js.org/docs/guides/interpretation.html#interpreting-machines) to start the machine, track transitions and send events to the machine. This code will be at the bottom of `home.machine.js`.

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

And finally, we'll fire off the `LOAD` event using the available `useEffect` hook:

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

If everything is working properly, clicking the `Add Todo` button should show `addTodo` in console and trying to type into one of the textboxes should result in `edit todo` along with an id and a name in console. You may also see `transition! loaded` pop up in console when testing these actions, which is expected. When an event transition does not contain a `target`, it is considered an [internal transition](https://xstate.js.org/docs/guides/actions.html#actions-on-self-transitions).

#### Step 2 - Creating Mobx-State-Tree Models

#### Step 3 - Loading Todos

#### Step 4 - Adding Todos

#### Step 5 - Editing Todos

#### Step 6 - Deleting Todos

#### Step 7 - Polish & Nice-to-Haves

## The Basics
The MXR tech stack utilizes three key components: [Mobx State Tree](https://mobx-state-tree.js.org/intro/philosophy), [xState](https://xstate.js.org/docs/about/concepts.html) and [React](https://reactjs.org/docs/getting-started.html). Mobx State Tree is the state management library; it enables us to utilize type-safe, defined data models throughout our application. xState is a library used for defining and executing finite state machines, which act as fully declarative action drivers throughout the application. Finally, React is used for the view layer, but all views are stateless and include no application/business logic.

## Our Philosophy
With the MXR stack, we hope to push the prioritization of developer sympathy and separation of concern during the development process. Using the components mentioned above, here are some of the core tenants of our philosophy:

#### Data Handling

The plague of data ambiguity is no longer a concern, thanks to the type-safe, defined data models of Mobx State Tree. The ability to define and compose data models also means that models can be shared across the application, meaning that a single model can be used as a source of truth across multiple areas of the application; any time that model changes, it only needs to change in one place. Under the MXR stack, stores are purely repositories for data. They do not handle API calls or data flow logic.

#### Actions/UI Flow

One of the biggest pain points of jumping into any front end application is figuring out what the UI actually does. This often requires tedious sifting through dozens of component files, stores and utility functions where things often become intertwined in complex and confusing ways. Using xState's finite state machines as our only actions driver, this is no longer a problem. Understanding the flow of the UI is simply a case of reading through the FSM configuration for a given page. This makes the UI flow much easier to reason about due to the declarative nature of the FSM configurations and the fact that UI flows live in a clearly defined place.
