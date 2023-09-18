import React, { useCallback, useContext, useState } from 'react';
import { RoomContext } from '../components/providers/Room.provider';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import RoomList from '../components/RoomList';
import ChatList from '../components/ChatList';
import Input from '../components/Input';
import Button from '../components/Button';

const LobbyPage = () => {
  const {
    user,
    room,
    rooms,
    chats,
    roomMember,
    onChangeRoom,
    createDisplayUser,
    createSingleChat,
  } = useContext(RoomContext);

  const [userName, setUserName] = useState('');
  const onChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserName(value);
  };

  const onSetDisplayName = useCallback(() => {
    createDisplayUser(userName);
  }, [userName, createDisplayUser]);

  const onClickBack = () => {
    onChangeRoom(null);
  };

  return (
    <div className={`flex h-[calc(100vh_-_48px)]`}>
      {user ? (
        <div className="flex w-full">
          <RoomList rooms={rooms} onClickRow={onChangeRoom} />
          <main className="flex-1">
            <div className="p-2 border-b flex">
              <button onClick={onClickBack}>
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              <span>{room?.name || 'Lobby'}</span>
              <span className="flex-1" />
              <span>{roomMember.map((m) => m.userName).join(',')}</span>
            </div>
            <ChatList onSend={createSingleChat} chats={chats} />
          </main>
        </div>
      ) : (
        <div className="flex justify-center w-full">
          <div className="border border-1 rounded m-auto px-6 py-4 ">
            <div className="space-y-2 flex flex-col">
              <p>Display Name</p>
              <Input value={userName} onChange={onChangeUserName} />
              <Button onClick={onSetDisplayName}>SetDisplayName</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LobbyPage;
