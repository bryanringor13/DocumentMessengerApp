import { combineReducers } from 'redux';
import authReducer from './auth/reducer';
import errorReducer from './error/reducer';
import dashboardReducer from './dashboard/reducer';
import countTabsReducer from './tabscount/reducer';

const rootReducer = combineReducers({
    auth: authReducer,
    error: errorReducer,
    acceptance: dashboardReducer,
    tabsCount: countTabsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;