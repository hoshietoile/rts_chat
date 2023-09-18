import {
  MutableRefObject,
  ReactNode,
  createContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import RoomChannel, { ChatPayload } from '../../api/channels/roomChannel';
import { Room, RoomListResponse, getRoomList } from '../../api/rest/rooms';

type Props = {
  children: ReactNode;
};

type RoomContext = {
  room: Room | null;
  rooms: Room[];
  chats: ChatPayload[];
  createSingleChat: (content: string) => void;
  createSingleRoom: (name: string) => void;
  createDisplayUser: (userName: string) => void;
  onChangeRoom: (roomId: string | null) => void;
};

export const RoomContext = createContext<RoomContext>({} as RoomContext);

const RoomProvider = ({ children }: Props) => {
  const roomChannelRef: MutableRefObject<RoomChannel | null> =
    useRef<RoomChannel>(null);

  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [chats, setChats] = useState([]);

  const onChangeRoom = (roomId: string | null) => {
    if (roomChannelRef.current) {
      roomChannelRef.current.disconnect?.();
    }

    const nextRoom = rooms.find((room: Room) => room.id === roomId) || null;
    setCurrentRoom(nextRoom);
    roomChannelRef.current = new RoomChannel(roomId);
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
  };

  const createSingleChat = (payload: string) => {
    roomChannelRef.current?.broadCastNewMessage(payload);
  };

  const createSingleRoom = (name: string) => {
    roomChannelRef.current?.broadCastNewRoom(name);
  };

  const createDisplayUser = (userName: string) => {
    roomChannelRef.current?.createDisplayUser(userName);
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
        room: currentRoom,
        rooms,
        chats,
        createSingleChat,
        createSingleRoom,
        createDisplayUser,
        onChangeRoom,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
