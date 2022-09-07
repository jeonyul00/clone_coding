import React from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

// react-native-keyboard-aware-scrollview에 빨간줄이 뜨는 이유 : 옛날 라이브러리라서 type을 지원 안함
// npm i @types/react-native-keyboard-aware-scrollview 해보고 안되면 안되는거임 그냥 쓰셈, 아님 직접 타입을 만들던가 : 나는 만들었다 types 폴더에 .d.ts 확장자

// 가상 키보드 올라왔을 때 백그라운드 누르면 키보드 내려가도록한다
const DismissKeyboardView: React.FC<{style?: StyleProp<ViewStyle>}> = ({
  children,
  ...props
}) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAwareScrollView {...props} style={props.style}>
      {children}
    </KeyboardAwareScrollView>
  </TouchableWithoutFeedback>
);

export default DismissKeyboardView;
