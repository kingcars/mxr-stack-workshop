# mxr-stack-workshop

## Installation

After cloning the reponsitory, open a command window in the project's base folder. Run `npm install` then `npm start`.

Note: Recommended to have Node `10.13.0` or higher.

## Introduction
Welcome to the MXR stack workshop! We have spent the last several months developing and refining a tech stack which we believe will help us avoid the inevitable nature of many code bases, in which they become cumbersome and unmaintainable over time. We've done so by implementing various libraries, patterns and practices which encourage strict separation of concern and developer sympathy. This workshop will step you through the basic principles and impactful features of this tech stack.

## The Basics
The MXR tech stack utilizes three key components: [Mobx State Tree](https://mobx-state-tree.js.org/intro/philosophy), [xState](https://xstate.js.org/docs/about/concepts.html) and [React](https://reactjs.org/docs/getting-started.html). Mobx State Tree is the state management library; it enables us to utilize type-safe, defined data models throughout our application. xState is a library used for defining and executing finite state machines, which act as fully declarative action drivers throughout the application. Finally, React is used for the view layer, but all views are stateless and include no application/business logic.

## Our Philosophy
With the MXR stack, we hope to push the prioritization of developer sympathy and separation of concern during the development process. Using the components mentioned above, here are some of the core tenants of our philosophy:

#### Data Handling

The plague of data ambiguity is no longer a concern, thanks to the type-safe, defined data models of Mobx State Tree. The ability to define and compose data models also means that models can be shared across the application, meaning that a single model can be used as a source of truth across multiple areas of the application; any time that model changes, it only needs to change in one place. Under the MXR stack, stores are purely repositories for data. They do not handle API calls or data flow logic.

#### Actions/UI Flow

One of the biggest pain points of jumping into any front end application is figuring out what the UI actually does. This often requires tedious sifting through dozens of component files, stores and utility functions where things often become intertwined in complex and confusing ways. Using xState's finite state machines as our only actions driver, this is no longer a problem. Understanding the flow of the UI is simply a case of reading through the FSM configuration for a given page. This makes the UI flow much easier to reason about due to the declarative nature of the FSM configurations and the fact that UI flows live in a clearly defined place.
