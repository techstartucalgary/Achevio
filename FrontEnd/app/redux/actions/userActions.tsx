export const SET_URL = "SET_URL";
export const SET_USERNAME = "SET_USERNAME";
export const SET_THEME = "SET_THEME";
export const SET_USERID = "SET_USERID";
export const SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN";
export const SET_ME = "SET_ME";

enum Theme {
  Light = "light",
  Dark = "dark",
}

export const setMe = (me: string) => (dispatch) => {
  dispatch({
    type: SET_ME,
    payload: me,
  });
}
export const setAccessToken = (accessToken: string) => (dispatch) => {
  dispatch({
    type: SET_ACCESS_TOKEN,
    payload: accessToken,
  });
};
export const setUrl = (url: string) => (dispatch) => {
  dispatch({
    type: SET_URL,
    payload: url,
  });
};
export const setUsername = (username: string) => (dispatch) => {
  dispatch({
    type: SET_USERNAME,
    payload: username,
  });
};
export const setTheme = (theme: Theme) => (dispatch) => {
  dispatch({
    type: SET_THEME,
    payload: theme,
  });
};
export const setUserId = (userId: string) => (dispatch) => {
  dispatch({
    type: SET_USERID,
    payload: userId,
  });
};
