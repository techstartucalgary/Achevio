export const SET_COMMUNITIES = "SET_COMMUNITIES";

export const setCommunities = (communities) => (dispatch) => {
  dispatch({
    type: SET_COMMUNITIES,
    payload: communities,
  });
};
