import { SET_URL, SET_USERNAME, SET_THEME, SET_USERID, SET_ACCESS_TOKEN, SET_ME, SET_DONE_TUTORIAL,SET_JOINED_COM  } from "../actions/userActions";
const initialState = {
    url: "http://192.168.120.31:8002",
    username: "",
    theme: "dark",  
    userId: "",
    accessToken: "",
    me: {
        done_tutorial: false,
        joined_com: false, // Default state
    }
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
        case SET_DONE_TUTORIAL:
            return {
                ...state,
                me: {
                ...state.me,
                done_tutorial: action.payload as boolean
                }
            };
            case SET_JOINED_COM:
                return {
                    ...state,
                    me: {
                        ...state.me,
                        joined_com: action.payload as boolean
                    }
                };
        default:
            return state;
    }
}
export default userReducer;