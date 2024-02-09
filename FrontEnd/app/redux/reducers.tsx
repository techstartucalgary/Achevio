import { SET_URL, SET_USERNAME, SET_THEME, SET_USERID } from "./actions";
const initialState = {
    url: "http://10.14.155.119:8000",
    username: "",
    theme: "dark",
    userId: "",
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
        default:
            return state;
    }
}
export default userReducer;