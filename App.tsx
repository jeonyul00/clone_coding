import * as React from 'react';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {Text, TouchableOpacity, View} from 'react-native';
import {useCallback} from 'react';

type RootStackParamList = {
  Home: undefined;
  Details: undefined;
};
type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
type DetailsScreenProps = NativeStackScreenProps<ParamListBase, 'Details'>;

// navigation에 type 지정할떄 이미 위에서 지정함, 이건 공부해야돼 -> 공식 문서를 보자
function HomeScreen({navigation}: HomeScreenProps) {
  const onClick = useCallback(() => {
    navigation.navigate('Details');
  }, [navigation]);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TouchableOpacity onPress={onClick}>
        <Text>Home Screen</Text>
      </TouchableOpacity>
    </View>
  );
}

function DetailsScreen({navigation}: DetailsScreenProps) {
  const onClick = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TouchableOpacity onPress={onClick}>
        <Text>Details Screen</Text>
      </TouchableOpacity>
    </View>
  );
}

// stack은 계속 쌓인다
const Stack = createNativeStackNavigator();

function App() {
  return (
    // 네비게이션을 쓸 때 전체를 <NavigationContainer>로 감싼다 : 이래야 작동이 된다
    <NavigationContainer>
      {/* Navigator가 페이지를 그룹으로 묶는다 */}
      <Stack.Navigator initialRouteName="Home">
        {/* Screen 컴포넌트가 component에게 props로 네비게이션과 라우터를 전달해줌 */}
        {/*   ㄴ 이 말은 페이지에서 useNavi를 선언하기보다는 props로 전달하는것이 코드가 효율적임 */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'home'}}
        />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
