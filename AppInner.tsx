import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';

import {useSelector} from 'react-redux';
import useSocket from './src/hoooks/useSoket';
import Delivery from './src/pages/Delivery';
import Orders from './src/pages/Orders';
import Settings from './src/pages/Settings';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
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
  // tab과 stack 중첩 사용하는 법

  // const [isLoggedIn, setLoggedIn] = useState(false);
  // 전역으로 관리하기 위해서 useSelector
  // state가 뭐냐면 전체 상태(rootreducer) -> 여기서 유저를 꺼내서 그 안의 이메일
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);

  // 웹소켓
  const [socket, disconnect] = useSocket();

  // 웹소켓
  useEffect(() => {
    const helloCallback = (data: any) => {
      console.log(data);
    };
    if (socket && isLoggedIn) {
      console.log(socket);
      // login이라는 키로 hello를 받을거다
      socket.emit('login', 'hello');
      // hello 라는 키로 helloCallback을 받는거다
      socket.on('hello', helloCallback);
    }
    // 이건 클린 함수인가
    return () => {
      if (socket) {
        // off  : on 중단 : 연결 끊기
        socket.off('hello', helloCallback);
      }
    };
  }, [isLoggedIn, socket]);

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
        // 각 tab 안에 여러 화면을 넣어둠
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
