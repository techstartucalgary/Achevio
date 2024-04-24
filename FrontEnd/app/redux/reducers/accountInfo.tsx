
const initialState = {
    userName: "",
    passWord: ""
};
export interface CommunitiesState {
    userName:String,
    passWord:String
}

function accountInfo(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_USERNAME':
            return {
                ...state,
                userName: action.userName
            };
        case 'UPDATE_PASSWORD':
            return {
                ...state,
                passWord: action.passWord
            };
        default:
            return state;
    }
}
export default accountInfo;