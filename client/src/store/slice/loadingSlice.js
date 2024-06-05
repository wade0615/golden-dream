import { createSlice } from '@reduxjs/toolkit';

/* 1) 建立 slice */
// name: 建立一個 action creators 的總名稱
// initial :預設的初始值
// reducers :與資料互動的 function action
export const loadingSlice = createSlice({
  name: 'loading',
  initialState: false,
  reducers: {
    open: () => true,
    close: () => false
  }
});

/* 2) */
export const { actions, reducer } = loadingSlice;
//  匯出每個 action 的名稱
export const { open, close } = actions;
//  匯出 reducer
export default reducer;

/* 3) 到 store/reducers/rootsReducer 註冊 reducer */
