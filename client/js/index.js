import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { ReduxRouter } from 'redux-router';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

import configureStore from './store';
import configureRoutes from './routes';
import ReducerRegistry from './libs/ReducerRegistry';

const coreReducers = require('./reducers/core');
const reducerRegistry = new ReducerRegistry(coreReducers);

// Configure hot module replacement for core reducers
if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
        module.hot.accept('./reducers/core', () => {
            const nextCoreReducers = require('./reducers/core');
            reducerRegistry.register(nextCoreReducers);
        });
    }
}
const routes = configureRoutes(reducerRegistry);
const store = configureStore(reducerRegistry);

render(<div>
    <Provider store={store}>
        <ReduxRouter routes={routes}/>
    </Provider>
    <DebugPanel top right bottom>
        <DevTools store={store} monitor={LogMonitor} />
    </DebugPanel>
</div>, document.querySelector('#app'));
