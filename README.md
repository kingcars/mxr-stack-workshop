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

The `loadTodos` state is for running an API call, which will require using a concept called `invoke`. In `xState`, it is possible for a machine to `invoke` various things - API calls (Promises), callbacks, observables and even other xState machines. In this case, we'll be invoking a `Promise`, taken directly from the `api` import we added previously. When invoking a `Promise`, we can define state transitions based on whether the `Promise` succeeded (resolved) or failed (rejected). This can be done by using the `onDone` and `onError` properties of the `invoke` configuration. Since this is a mock API call, we'll only be defining an `onDone` transition today.

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
