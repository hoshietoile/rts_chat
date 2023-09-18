import {
  MutableRefObject,
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import RoomChannel, { ChatPayload } from '../../api/channels/roomChannel';
import { Room, RoomListResponse, getRoomList } from '../../api/rest/rooms';
import { useCookies } from 'react-cookie';

type User = {
  userId: string;
  userName: string;
};

type Props = {
  children: ReactNode;
};

type RoomContext = {
  user: User | null;
  room: Room | null;
  rooms: Room[];
  chats: ChatPayload[];
  inputingUser: User[];
  createSingleChat: (content: string) => void;
  createSingleRoom: (name: string) => void;
  createDisplayUser: (userName: string) => void;
  forgetUserName: () => void;
  onChangeRoom: (roomId: string | null) => void;
  onKeystrokeContinue: () => void;
  onKeystrokeEnd: () => void;
};

export const RoomContext = createContext<RoomContext>({} as RoomContext);

const USER_COOKIE_KEY = 'user';

const RoomProvider = ({ children }: Props) => {
  // FIXME: 疑似的なログイン(idをCookie保存)
  const [cookies, setCookie, removeCookie] = useCookies();
  const roomChannelRef: MutableRefObject<RoomChannel | null> =
    useRef<RoomChannel>(null);

  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [chats, setChats] = useState([]);
  const [inputingUser, setInputingUser] = useState<User[]>([]);

  const user = useMemo<User | null>(() => {
    return cookies[USER_COOKIE_KEY] || null;
  }, [cookies]);

  const onChangeRoom = (roomId: string | null) => {
    if (roomChannelRef.current) {
      roomChannelRef.current.disconnect?.();
    }

    const nextRoom = rooms.find((room: Room) => room.id === roomId) || null;
    setCurrentRoom(nextRoom);
    roomChannelRef.current = new RoomChannel(roomId, user?.userId);
    roomChannelRef.current.join(() => {});

    roomChannelRef.current.getChatList((response) => {
      setChats(response.list);
    });

    roomChannelRef.current.on('new_msg', (payload) => {
      setChats(payload.list);
    });

    roomChannelRef.current.on('on_new_room', (payload) => {
      setRooms((prev: Room[]) => {
        return [...prev, payload.data];
      });
    });

    roomChannelRef.current.on('on_user_inputing', (payload) => {
      setInputingUser((prev: User[]) => {
        const isMyself = payload.user_id === user?.userId;
        const isExists = prev.find(
          (user: User) => user.userId === payload.user_id
        );
        if (isExists || isMyself) {
          return prev;
        }
        return [
          ...prev,
          {
            userId: payload.user_id,
            userName: payload.user_name,
          },
        ];
      });
    });

    roomChannelRef.current.on('on_user_inputend', (payload) => {
      setInputingUser((prev: User[]) => {
        return prev.filter((user: User) => user.userId !== payload.user_id);
      });
    });
  };

  const createSingleChat = (content: string) => {
    if (user) {
      roomChannelRef.current?.broadCastNewMessage({ content, ...user });
    }
  };

  const createSingleRoom = (name: string) => {
    roomChannelRef.current?.broadCastNewRoom(name);
  };

  const createDisplayUser = (userName: string) => {
    roomChannelRef.current?.createDisplayUser(userName, (res) => {
      const user: User = {
        userId: res.id,
        userName: userName,
      };
      setCookie(USER_COOKIE_KEY, user);
    });
  };

  const onKeystrokeContinue = useCallback(() => {
    const { userId, userName } = user || {};
    roomChannelRef.current?.broadCastUserInputContinue(
      userId as string,
      userName as string
    );
  }, [user]);

  const onKeystrokeEnd = useCallback(() => {
    const { userId } = user || {};
    roomChannelRef.current?.broadCastUserInputEnd(userId as string);
  }, [user]);

  const forgetUserName = () => {
    removeCookie(USER_COOKIE_KEY);
  };

  useEffect(() => {
    onChangeRoom(null);

    (async () => {
      const response: RoomListResponse = await getRoomList();
      setRooms(response.data);
    })();
  }, []);

  return (
    <RoomContext.Provider
      value={{
        user,
        room: currentRoom,
        rooms,
        chats,
        inputingUser,
        createSingleChat,
        createSingleRoom,
        createDisplayUser,
        forgetUserName,
        onChangeRoom,
        onKeystrokeContinue,
        onKeystrokeEnd,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
