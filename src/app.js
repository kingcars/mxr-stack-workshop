import React, { useEffect } from 'react';
import { Observer } from 'mobx-react';
import appMachine from './app.machine';
import appStore from './app.store';

import './app.css';

export default function () {
  useEffect(function () {
    appMachine.send('LOAD');
  }, []);

  return (
    <div>
      <h2 className="header">Welcome to the MXR Stack Workshop</h2>
      <Observer>
        {function () {
          return (
            <div>{appStore.currentState}</div>
          );
        }}
      </Observer>
    </div>
  );
}
