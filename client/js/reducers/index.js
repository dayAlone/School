import {combineReducers} from 'redux';
export default function configureReducers(reducers) {
    return combineReducers({
        ...reducers
    });
}
