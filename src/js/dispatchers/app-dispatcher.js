import {Dispatcher} from 'flux';

const dispatcher = new Dispatcher();

export function dispatch(action){
    console.log('Called Dispatcher with action:', action);
    dispatcher.dispatch({
        source: 'FROM_DISPATCHER',
        action: action
    });
}

export function register(callback){
    console.log(callback, ' got registered with dispatcher.');
    return dispatcher.register(callback);
}