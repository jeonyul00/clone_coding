import {configureStore} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import rootReducer from './reducer';

// configureStore를 통해 스토어를 만든다
const store = configureStore({
  reducer: rootReducer,

  // middleware : 플리퍼 쓰려고 미들웨어 씀
  // 난 안쓸꺼니까 주석
  // middleware: getDefaultMiddleware => {
  //   if (__DEV__) {
  //     const createDebugger = require('redux-flipper').default;
  //     return getDefaultMiddleware().concat(createDebugger());
  //   }
  //   return getDefaultMiddleware();
  // },
});

export default store;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
