import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { reduxReactRouter } from 'redux-router';
import { devTools } from 'redux-devtools';
import createHistory from 'history/lib/createBrowserHistory';
import configureReducers from '../reducers';


export default function configureStore(reducerRegistry) {
    const rootReducer = configureReducers(reducerRegistry.getReducers());
    const store = compose(
        applyMiddleware(thunkMiddleware),
        reduxReactRouter({ createHistory }),
        devTools()
    )(createStore)(rootReducer);

    reducerRegistry.setChangeListener((reducers) => {
        store.replaceReducer(configureReducers(reducers));
    });

    return store;
}
