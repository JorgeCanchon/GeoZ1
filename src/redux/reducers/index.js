import { combineReducers } from 'redux';
import crudReducers from './crudReducer';
const allReducers = combineReducers({
    crud: crudReducers
});
export default allReducers;