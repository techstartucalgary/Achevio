export const SET_URL = 'SET_URL';
export const SET_USERNAME = 'SET_USERNAME';
export const SET_THEME = 'SET_THEME';
export const SET_USERID = 'SET_USERID';


enum Theme {
    Light = 'light',
    Dark = 'dark',
}

export const setUrl = (url: string) => dispatch => {
    dispatch({
        type: SET_URL,
        payload: url,
    });
    }
export const setUsername = (username: string) => dispatch => {
    dispatch({
        type: SET_USERNAME,
        payload: username,
    });
    }
export const setTheme = (theme: Theme) => dispatch => {
    dispatch({
        type: SET_THEME,
        payload: theme,
    });
    }
export const setUserId = (userId: string) => dispatch => {
    dispatch({
        type: SET_USERID,
        payload: userId,
    });
    }