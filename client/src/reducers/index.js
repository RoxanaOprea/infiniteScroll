
import { combineReducers } from 'redux';
import { users, usersHasErrored, usersIsLoading } from './users';

export default combineReducers({
  users,
  usersHasErrored,
  usersIsLoading
});