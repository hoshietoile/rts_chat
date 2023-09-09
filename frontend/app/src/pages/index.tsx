import { Socket, Channel } from 'phoenix'
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';

class RoomChannel {
  private channel: Channel;

  constructor() {
    const socket = new Socket('ws://localhost:4000/socket', {})
    socket.connect();
    this.channel = socket.channel('room:lobby', {})
  }

  join() {
    this.channel
      .join()
      .receive('ok', (response) => {
        console.log('# Joined', response)
      })
  }

  push(message: string) {
    this.channel.push('new_msg', { content: message, created_at: Date.now() })
  }

  on(topic: string, callback: (_: any[]) => any) {
    this.channel.on(topic, callback);
  }
}

const LobbyPage = () => {
  const roomChannelRef: MutableRefObject<RoomChannel | null> = useRef<RoomChannel>(null);
  const [input, setInput ] = useState('')
  const [chats, setChats] = useState([])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e?.target?.value || ''
    setInput(value);
  }

  const onClick = () => {
    roomChannelRef.current?.push(input);
    setInput('')
  }

  useEffect(() => {
    roomChannelRef.current = new RoomChannel()
    roomChannelRef.current.join();
    roomChannelRef.current.on('new_msg', (payload) => {
      console.log('# NewMsg', payload);
      setChats(payload.list)
    })
  }, [])

  return <div>
    Lobby
    <div className='p-4'>
      <input onChange={onChange} className='rounded px-4 py-2 text-gray-800 dark:text-gray-200 dark:bg-slate-600 border-none outline-0 focus:ring-2 focus:ring-[#B5D3B8]' />
      <button onClick={onClick}>Send</button>
    </div>
    <div>
      <ul>
        {chats.map((chat) => {
          return <li key={chat.created_at}>{chat.content}</li>
        })}
      </ul>
    </div>
  </div>
}

export default LobbyPage