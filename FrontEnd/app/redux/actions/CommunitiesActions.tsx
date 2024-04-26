export const SET_COMMUNITIES = "SET_COMMUNITIES";

export const SET_MY_COMMUNITIES = "SET_MY_COMMUNITIES";

export const SET_POSTS = "SET_POSTS";

export const setMyCommunities = (myCommunities) => (dispatch) => {
  dispatch({
    type: SET_MY_COMMUNITIES,
    payload: myCommunities,
  });
};

export const setCommunities = (allCommunities) => (dispatch) => {
  dispatch({
    type: SET_COMMUNITIES,
    payload: allCommunities,
  });
};


export const setPosts = (CommunityPosts) => (dispatch) => {
  dispatch({
    type: SET_POSTS,
    payload: CommunityPosts,
  });
};
