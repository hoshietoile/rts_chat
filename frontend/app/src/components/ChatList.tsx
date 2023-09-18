import React, {
  type RefObject,
  useCallback,
  useRef,
  useState,
  useContext,
} from 'react';
import Button from './Button';
import Input from './Input';
import ChatPanel from './ChatPanel';
import type { ChatPayload } from '../api/channels/roomChannel';
import { RoomContext } from './providers/Room.provider';

type Props = {
  chats: ChatPayload[];
  onSend: (payload: string) => void;
};

const ChatList = ({ chats, onSend }: Props) => {
  const { inputingUser, onKeystrokeContinue, onKeystrokeEnd } =
    useContext(RoomContext);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeoutRef = useRef<any>(null);
  const chatRef: RefObject<HTMLLIElement> = useRef(null);
  const [input, setInput] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = e?.target?.value;
    setInput(value);
  };

  const send = useCallback(() => {
    onSend(input);
    setInput('');
  }, [input, onSend]);

  const onClick = useCallback(() => {
    send();
  }, [send]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      clearTimeout(timeoutRef.current);
      onKeystrokeContinue();
      timeoutRef.current = setTimeout(() => {
        onKeystrokeEnd();
      }, 1000);
      if (e.key === 'Enter') {
        send();
      }
    },
    [send, onKeystrokeContinue, onKeystrokeEnd]
  );

  return (
    <ul className="flex-row-reverse max-h-full overflow-y-scroll hidden-scrollbar">
      {chats.map((chat: ChatPayload) => {
        return (
          <ChatPanel
            key={chat.created_at}
            userName={chat.user_name}
            email={'email@example.com'}
            content={chat.content}
            createdAt={chat.created_at}
          />
        );
      })}
      <li
        className={`p-2 fixed bottom-0 right-0 left-[250px] border-t bg-slate-100 dark:bg-teal-950`}
      >
        <div className="flex-col space-x-2">
          <div className="flex space-x-2">
            <Input
              className="flex-1"
              onChange={onChange}
              onKeyDown={onKeyDown}
              value={input}
            />
            <Button onClick={onClick}>Send</Button>
          </div>

          <div>
            {inputingUser.length > 0 ? (
              <span>
                {inputingUser.map((user) => user.userName).join(', ') +
                  'inputs...'}
              </span>
            ) : (
              'Please Input something'
            )}
          </div>
        </div>
      </li>
      <li ref={chatRef} className="pb-28"></li>
    </ul>
  );
};

export default ChatList;
