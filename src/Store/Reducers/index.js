import { combineReducers } from 'redux';
import { reducer as ReduxFormReducer } from 'redux-form';

import FactoryReducer from './FilterData/FactoryData';
import ThemeOptions from './Theme/ThemeOptions';

const rootReducer = combineReducers({
    Factories: FactoryReducer,
    ThemeOptions: ThemeOptions,
    Form: ReduxFormReducer,
})

export default rootReducer;