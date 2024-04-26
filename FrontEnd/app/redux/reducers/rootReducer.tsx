// import your reducers
import userReducer from "./userReducer";
import CommunitiesReducer from "./CommunitiesReducer";
import { combineReducers } from "redux";
import { UserState } from "./userReducer";
import { CommunitiesState } from "./CommunitiesReducer";
import accountInfo from "./accountInfo";

export interface RootState {
    user: UserState;
    communities: CommunitiesState;
}
const rootReducer = combineReducers({
    user: userReducer,
    communities: CommunitiesReducer,
    account: accountInfo
});

export default rootReducer;
