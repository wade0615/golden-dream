import { combineReducers } from 'redux';
import loadingReducer from './slice/loadingSlice';
import globalReducer from './slice/globalOptionsSlice';

const rootReducer = combineReducers({
  loading: loadingReducer,
  options: globalReducer
});

export default rootReducer;
