/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// 파일의 시작점
// 컴포넌트를 등록한다
// appName의 name 바꾸면 난리난다 왜냐면 ios랑 android에서 name을 통해 매칭이 되는데 아룸울 버꾸게 되면 인식을 못해서 그 쪽 가서도 바꿔줘야 하기 때문이다
// appName의 displayName은 실제 디바이스에서 보게 될 앱 이름이다, 이건 필요하면 바꿔야한다
// 이 코드의 뜻 : 앱이 있다 -> 그 앱에 App 컴포넌트를 등록한다
AppRegistry.registerComponent(appName, () => App);
