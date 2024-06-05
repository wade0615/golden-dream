import { createSlice } from '@reduxjs/toolkit';

/* 1) 建立 slice */
// name: 建立一個 action creators 的總名稱
// initial :預設的初始值
// reducers :與資料互動的 function action
export const globalOptionsSlice = createSlice({
  name: 'options',
  initialState: {},
  reducers: {
    setOption(state, action) {
      state[action.payload.type] = action.payload.payload;
    }
  }
});

/* 2) */
export const { actions, reducer } = globalOptionsSlice;
//  匯出每個 action 的名稱
export const { setOption } = actions;
//  匯出 reducer
export default reducer;

/* 3) 到 store/reducers/rootsReducer 註冊 reducer */
