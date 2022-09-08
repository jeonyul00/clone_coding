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
    // 항상 state와 action을 가지고 있다
    // state : 현재는 initalState인데 이걸 어떻게 바꿀지
    // 데이터가 여러개인 경우 객체로 묶어서, 하나일 경우 그냥 던져주면 된다
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
