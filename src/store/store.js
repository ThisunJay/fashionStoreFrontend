import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/index'
import C_User from '../controllers/User'
import {setCurrentUser} from '../actions/authActions'

const initialState = {};
const middleware = [thunk];

const store = createStore(
    rootReducer,
    initialState,
    compose(
        applyMiddleware(...middleware),
        window.__REDUX_DEVTOOLS_EXTENSION__
            ? window.__REDUX_DEVTOOLS_EXTENSION__()
            : f => f
    )
);

if(C_User.checkSignedIn() == true){
    store.dispatch(setCurrentUser( C_User.getToken() ))
}


export default store;