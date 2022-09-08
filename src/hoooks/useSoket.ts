import {useCallback} from 'react';
import {io, Socket} from 'socket.io-client';
import Config from 'react-native-config';

// 몇 번 가져다 써도 소켓이 한번만 사용되도록 할 것이다
// 변수 선언
let socket: Socket | undefined;
// custom hook
const useSocket = (): [Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      socket = undefined;
    }
  }, []);
  // 소켓이 없을 때만 연결이 되도록 한다
  if (!socket) {
    // 첫번째 프롭스 : 서버주소
    // 두번째 프롭스 : 옵션
    // io(서버주소,{
    // transports : ['websoket'],
    // path : '/socket-io'
    // })
    socket = io(Config.API_URL, {
      // long-polling : 서버에게 새로운 데이터가 있는지 실시간으로 확인하도록 요청하는것 : 굉장히 비 효율적이다
      // transports: ['websocket'], : 롱 폴링 기법을 빼버림
      transports: ['websocket'],
    });
  }
  // disconnect를 따로 넣은 이유는 서버와 연결을 끊을때 쓰도록
  return [socket, disconnect];
};

export default useSocket;
