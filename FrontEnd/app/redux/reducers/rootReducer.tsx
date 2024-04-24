// import your reducers
import userReducer from "./userReducer";
import CommunitiesReducer from "./CommunitiesReducer";
import { combineReducers } from "redux";
import { UserState } from "./userReducer";
import { CommunitiesState } from "./CommunitiesReducer";

export interface RootState {
    user: UserState;
    communities: CommunitiesState;
}
const rootReducer = combineReducers({
    user: userReducer,
    communities: CommunitiesReducer,
});

export default rootReducer;
