import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import {useSelector} from 'react-redux';
import Delivery from './src/pages/Delivery';
import Orders from './src/pages/Orders';
import Settings from './src/pages/Settings';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import {RootState} from './src/store/reducer';

function AppInner() {
  // tab과 stack 중첩 사용하는 법
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  // const [isLoggedIn, setLoggedIn] = useState(false);
  // 전역으로 관리하기 위해서 useSelector
  // state가 뭐냐면 전체 상태(rootreducer) -> 여기서 유저를 꺼내서 그 안의 이메일
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);

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
