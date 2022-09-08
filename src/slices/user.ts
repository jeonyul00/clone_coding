import {createSlice} from '@reduxjs/toolkit';

// 기본값 설정
const initialState = {
  name: '',
  email: '',
  accessToken: '',
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.accessToken = action.payload.accessToken;
    },
  },
  // extraReducers : 보통 비동기 리듀서 만들때 쓰임
  // 설명 참 거지같네; 나중에 알아보자
  extraReducers: builder => {},
});

export default userSlice;
