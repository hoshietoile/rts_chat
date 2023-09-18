import React, {
  type RefObject,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import Button from './Button';
import Input from './Input';
import ChatPanelMolecule from './ChatPanel';

type Chat = {
  content: string;
  created_at: string;
};

type Props = {
  chats: Chat[];
  onSend: (payload: string) => void;
};

const Chat = ({ chats, onSend }: Props) => {
  const chatRef: RefObject<HTMLLIElement> = useRef(null);
  const [input, setInput] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = e?.target?.value;
    setInput(value);
  };

  const onClick = useCallback(() => {
    onSend(input);
    setInput('');
  }, [input, onSend]);

  useLayoutEffect(() => {
    chatRef.current?.scrollIntoView();
  }, []);

  return (
    <ul className="flex-row-reverse max-h-full overflow-y-scroll hidden-scrollbar">
      {chats.map((chat: Chat) => {
        return (
          <ChatPanelMolecule
            key={chat.created_at}
            userName={'User Name'}
            email={'email@example.com'}
            content={chat.content}
            createdAt={chat.created_at}
          />
        );
      })}
      <li className="p-2 w-full fixed bottom-0 bg-slate-100 dark:bg-teal-950">
        <div className="space-x-2">
          <Input onChange={onChange} value={input} />
          <Button onClick={onClick}>Send</Button>
        </div>
      </li>
      <li ref={chatRef}></li>
    </ul>
  );
};

export default Chat;
