import { Socket, Channel } from 'phoenix';
import type { AnyFunction } from '../../@types';

const SOCKET_ENDPOINT = 'ws://localhost:4000/socket';

export type RoomTopic = 'on_new_room' | 'new_msg';

export type RoomMessagePayload = {
  user_id: string;
  message: string;
};

export type ClientChatPayload = {
  content: string;
  userId: string;
  userName: string;
};

export type ChatPayload = {
  content: string;
  room_id: string | null;
  user_id: string;
  user_name: string;
  created_at: string;
};

export type ChatListPayload = {
  list: ChatPayload[];
};

class RoomChannel {
  private channel: Channel;
  public roomId?: string | null;
  public userId?: string;

  constructor(roomId?: string | null, userId?: string) {
    const socket = new Socket(SOCKET_ENDPOINT, {});

    socket.connect();
    this.channel = socket.channel(roomId ? `room:${roomId}` : 'room:lobby', {});
    this.roomId = roomId;
    this.userId = userId;
  }

  join(onOk: AnyFunction) {
    this.channel.join().receive('ok', onOk);
  }

  disconnect() {
    this.channel.leave();
  }

  on(topic: RoomTopic, callback: AnyFunction) {
    return this.channel.on(topic, callback);
  }

  getRoomList(callback: AnyFunction) {
    return this.channel.push('room_list', {}).receive('ok', callback);
  }

  getChatList(callback: AnyFunction) {
    return this.channel
      .push('list', {
        room_id: this.roomId || null,
      })
      .receive('ok', callback);
  }

  createDisplayUser(userName: string, callback: AnyFunction) {
    return this.channel
      .push('new_user', { name: userName })
      .receive('ok', callback);
  }

  broadCastNewRoom(name: string) {
    return this.channel.push('new_room', { name });
  }

  broadCastNewMessage({ content, userId, userName }: ClientChatPayload) {
    const roomId = this.roomId || null;
    this.channel.push('new_msg', {
      content: content,
      room_id: roomId,
      user_id: userId,
      user_name: userName,
      created_at: Date.now(),
    });
  }
}

export default RoomChannel;
