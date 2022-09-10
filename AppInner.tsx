import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import axios, {AxiosError} from 'axios';
import React, {useEffect} from 'react';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useDispatch, useSelector} from 'react-redux';
import useSocket from './src/hoooks/useSoket';
import Delivery from './src/pages/Delivery';
import Orders from './src/pages/Orders';
import Settings from './src/pages/Settings';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import orderSlice from './src/slices/order';
import userSlice from './src/slices/user';
import {RootState} from './src/store/reducer';

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: {orderId: string};
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AppInner() {
  // const [isLoggedIn, setLoggedIn] = useState(false);
  // 전역으로 관리하기 위해서 useSelector
  // state가 뭐냐면 전체 상태(rootreducer) -> 여기서 유저를 꺼내서 그 안의 이메일
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);
  const dispatch = useDispatch();

  // 앱 실행 시 토큰 있으면 로그인하는 코드
  // useEffect는 async 함수 안됨 그래서 안에서 만들어서 씀
  useEffect(() => {
    const getTokenAndRefresh = async () => {
      try {
        const token = await EncryptedStorage.getItem('refreshToken');
        if (!token) {
          return;
        }
        const response = await axios.post(
          `${Config.API_URL}/refreshToken`,
          {},
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );

        // redux에 저장
        dispatch(
          userSlice.actions.setUser({
            name: response.data.data.name,
            email: response.data.data.email,
            accessToken: response.data.data.accessToken,
          }),
        );
      } catch (error) {
        console.error(error);
        if ((error as AxiosError).response?.data.code === 'expired') {
          Alert.alert('알림', '다시 로그인 해주세요.');
        }
      } finally {
        // todo : 스플래시 없애기
      }
    };
    getTokenAndRefresh();
  }, [dispatch]);

  // axios interceptors
  // 인터셉터 겁나 어렵다
  useEffect(() => {
    // 뜻 응답 올 때 사용한다
    axios.interceptors.response.use(
      // 성공 시
      response => response,
      // 실패 시
      // error.config : 원래했던 요청 내역
      // 여기서는 엑세스 토큰 만료되었을때 걸리겠지
      async error => {
        const {
          config,
          response: {status},
        } = error;
        if (status === 419) {
          if (error.response.data.code === 'expired') {
            // error.config : 원래했던 요청 내역
            const originalRequest = config;
            // token 재발급하는 코드
            const refreshToken = await EncryptedStorage.getItem('refreshToken');
            const {data} = await axios.post(
              `${Config.API_URL}/refreshToken`,
              {},
              {headers: {authorization: `Bearer ${refreshToken}`}},
            );
            // 재발급 받은 토큰으로 다시 요청하는 코드
            dispatch(userSlice.actions.setAccessToken(data.data.accessToken));
            originalRequest.headers.authorization = `Bearer ${data.data.accessToken}`;
            return axios(originalRequest);
          }
        }
        // 419에러가 아닌 다른 에러일 때 : 각 자의 cache로 간다
        return Promise.reject(error);
      },
    );
  }, []);

  // 웹소켓
  const [socket, disconnect] = useSocket();
  // 웹소켓
  // 데이터는 키,값 꼴로 옴
  // 'order' , {orderId:1,price : 9000, latitude:37.5, longitude:127.5 }
  // 서버가 order라는 key로 클라이언트에게 {orderId:1,price : 9000, latitude:37.5, longitude:127.5 } 값을 줌
  // 서버로 부터 데이터 받을때는 콜백 방식으로 받아야됨
  useEffect(() => {
    const callback = (data: any) => {
      console.log(data);
      dispatch(orderSlice.actions.addOrder(data));
    };

    if (socket && isLoggedIn) {
      //acceptOrder 이거 없어도 되는거 아닌가
      // 이거 안 보내면 서버가 응답을 안함 ㅅㅂ 왜지
      //  ㄴ 백엔드에서 acceptOrder로 로그인을 해야지만 order을 받을 수 있도록 로직이 짜여져있다
      socket.emit('acceptOrder', 'hello');
      socket.on('order', callback);
    }
    // cleanUp
    return () => {
      if (socket) {
        socket.off('order', callback);
      }
    };
  }, [dispatch, isLoggedIn, socket]);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log('!isLoggedIn', !isLoggedIn);
      // 로그아웃 시 연결 중단
      disconnect();
    }
  }, [isLoggedIn, disconnect]);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator>
          <Tab.Screen
            name="Orders"
            component={Orders}
            options={{title: '오더 목록'}}
          />
          {/* 중첩을 이렇게도 쓰네, 캔따개랑은 다르게 직접 페이지 안에서 분기시킨다  */}
          <Tab.Screen
            name="Delivery"
            component={Delivery}
            options={{headerShown: false}}
          />
          <Tab.Screen
            name="Settings"
            component={Settings}
            options={{title: '내 정보'}}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{title: '로그인'}}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{title: '회원가입'}}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default AppInner;
