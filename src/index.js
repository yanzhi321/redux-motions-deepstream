import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/Main';

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
// Render the main component into the dom

const store = createStore(reducer)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)


