import { SET_URL, SET_USERNAME, SET_THEME, SET_USERID, SET_ACCESS_TOKEN } from "./actions";
const initialState = {
    url: "http://10.14.119.127:8002",
    username: "",
    theme: "dark",  
    userId: "",
    accessToken: "",
};
function userReducer(state = initialState, action) {
    switch (action.type) {
        case SET_URL:
            return { ...state, url: action.payload}
        case SET_USERNAME:
            return { ...state, username: action.payload}
        case SET_THEME:
            return { ...state, theme: action.payload}
        case SET_USERID:
            return { ...state, userId: action.payload}
        case SET_ACCESS_TOKEN:
            return { ...state, accessToken: action.payload}
        default:
            return state;
    }
}
export default userReducer;