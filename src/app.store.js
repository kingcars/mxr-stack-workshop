import { types } from 'mobx-state-tree';

const AppStore = types
  .model('AppStore', {
    currentState: types.optional(types.string, '')
  })
  .actions(function (self) {
    return {
      setCurrentState(state) {
        self.currentState = state;
      }
    };
  });

export default AppStore.create({});
