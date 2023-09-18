import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { RoomContext } from '../components/providers/Room.provider';
import Toggle from '../components/Toggle';
import Input from '../components/Input';
import Button from '../components/Button';

const DARK_COOKIE_KEY = 'isDark';
const DARK_CLASS_NAME = 'dark';

const App = () => {
  const { createSingleRoom } = useContext(RoomContext);

  const [isDark, setIsDark] = useState(false);
  const [cookies, setCookie] = useCookies([DARK_COOKIE_KEY]);

  const [nameInput, setNameInput] = useState('');

  const onChangeNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setNameInput(v);
  };

  const onCreateRoom = useCallback(async () => {
    createSingleRoom(nameInput);
    setNameInput('');
  }, [nameInput, createSingleRoom]);

  const onToggleTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    const html: HTMLElement = document.querySelector('html')!;
    if (e.target.checked) {
      html.classList.add(DARK_CLASS_NAME);
      setIsDark(true);
      setCookie(DARK_COOKIE_KEY, true);
    } else {
      html.classList.remove(DARK_CLASS_NAME);
      setIsDark(false);
      setCookie(DARK_COOKIE_KEY, false);
    }
  };

  useEffect(() => {
    if (cookies.isDark) {
      const html: HTMLElement = document.querySelector('html')!;
      html.classList.add(DARK_CLASS_NAME);
      setIsDark(true);
    }
  }, [cookies]);

  return (
    <section className="text-black dark:text-white bg-slate-100 dark:bg-teal-950">
      <header className="p-2 flex border-b border-1 bg-slate-300 dark:bg-teal-950">
        <div className="font-bold">Rts Chat</div>
        <div className="flex-1 px-2 space-x-2">
          <Input onChange={onChangeNameInput} value={nameInput} />
          <Button onClick={onCreateRoom}>CreateRoom</Button>
        </div>
        <div>
          <Toggle defaultChecked={!isDark} onChange={onToggleTheme} />
        </div>
      </header>
      <main className="h-full">
        <Outlet />
      </main>
    </section>
  );
};

export default App;
