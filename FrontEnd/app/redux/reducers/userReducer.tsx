import { SET_URL, SET_USERNAME, SET_THEME, SET_USERID, SET_ACCESS_TOKEN, SET_ME } from "../actions/userActions";
const initialState = {
    url: "http://192.168.18.31:8002",
    username: "",
    theme: "dark",  
    userId: "",
    accessToken: "",
    me:"",
};
export interface UserState {
    url: string;
    username: string;
    theme: string;
    userId: string;
    accessToken: string;
    me: string;
}
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
        case SET_ME:
            return { ...state, me: action.payload}
        default:
            return state;
    }
}
export default userReducer;