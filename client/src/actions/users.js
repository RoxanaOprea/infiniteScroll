
//import fetch from 'cross-fetch';

export function usersHasErrored(bool) {
  return {
      type: 'USERS_HAS_ERRORED',
      hasErrored: bool
  };
}

export function usersIsLoading(bool) {
  return {
      type: 'USERS_IS_LOADING',
      isLoading: bool
  };
}

export function usersFetchDataSuccess(users) {
    console.log('Reducer for fecth data ')
  return {
      type: 'USERS_FETCH_DATA_SUCCESS',
      users
  };
}

export function usersFetchData(limit, offset) {
    console.log("=====> Here ==== usersFetchData",limit, offset);//20 undefined
  return dispatch => {
      const url = `/users?limit=${limit}&offset=${offset}`;
      dispatch(usersIsLoading(true));

      fetch(url, { headers: { "Content-Type": "application/json" } })
          .then((response) => {
              if (!response.ok) {
                  throw Error(response.statusText);
              }

              dispatch(usersIsLoading(false));

              return response;
          })
          .then((response) => response.json())
          .then((users) => dispatch(usersFetchDataSuccess(users)))
          .catch(() => dispatch(usersHasErrored(true)));
  };
}
