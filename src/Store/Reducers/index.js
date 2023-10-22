import { combineReducers } from 'redux';
import { reducer as ReduxFormReducer } from 'redux-form';

import DataReducer from './Data/DataManageOptions';
import ThemeOptions from './Theme/ThemeOptions';

const rootReducer = combineReducers({
    DataReducer: DataReducer,
    ThemeOptions: ThemeOptions,
    Form: ReduxFormReducer,
})

export default rootReducer;