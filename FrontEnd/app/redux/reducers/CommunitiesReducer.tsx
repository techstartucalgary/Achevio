import { SET_MY_COMMUNITIES,SET_COMMUNITIES, SET_POSTS  } from "../actions/CommunitiesActions";

const initialState = {
    communities: [],
};
export interface CommunitiesState {
    myCommunities: any[]; // Define a more specific type if possible
    allCommunities: any[]; // Define a more specific type if possible
    CommunityPosts: any[]; // Define a more specific type if possible

}

function CommunitiesReducer(state = initialState, action) {
    switch (action.type) {
        case SET_MY_COMMUNITIES:
            return { ...state, myCommunities: action.payload}

        case SET_COMMUNITIES:
            return { ...state, allCommunities: action.payload}
            
        case SET_POSTS:
            return { ...state, CommunityPosts: action.payload}
        default:
            return state;
    }
}
export default CommunitiesReducer;