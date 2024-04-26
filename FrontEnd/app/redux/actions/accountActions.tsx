export const UPDATE_USERNAME = "UPDATE_USERNAME";
export const UPDATE_PASSWORD = "UPDATE_PASSWORD";

export const updateUsername = (userName) => (dispatch) => {
  dispatch({
    type: UPDATE_USERNAME,
    userName: userName,
  });
};

export const updatePassword = (passWord) => (dispatch) => {
    dispatch({
        type: UPDATE_PASSWORD,
        passWord: passWord,
    });
    }