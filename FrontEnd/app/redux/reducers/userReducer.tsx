import { SET_URL, SET_USERNAME, SET_THEME, SET_USERID, SET_ACCESS_TOKEN } from "../actions/actions";
const initialState = {
<<<<<<< HEAD:FrontEnd/app/redux/reducers.tsx
    url: "http://10.14.119.127:8002",
=======
    url: "http://10.14.89.126:8002",
>>>>>>> 8431173b7de5951ef70d2bf219f905d8342b7cbb:FrontEnd/app/redux/reducers/userReducer.tsx
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