import React from 'react';
import ReactDom from 'react-dom';
import { connect, Provider } from 'react-redux';
import { compose, createStore } from 'redux';
import { reelmRunner } from 'reelm';

import counterReducer from './components/counter.reducer';
import Counter from './components/counter.view';

const CounterConnected = connect(state => ({ value: state }))(Counter);

const store = createStore(
    counterReducer,
    compose(
        reelmRunner(),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    ));

ReactDom.render(
    <Provider store={store}>
        <CounterConnected />
    </Provider>,
    document.getElementById('content'));
