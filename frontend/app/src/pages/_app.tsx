import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ToggleAtom from '../components/atoms/Toggle.atom';

const App = () => {
  const [isDark, setIsDark] = useState(false);

  const onToggleTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('## e', e.target.checked);
    const html: HTMLElement = document.querySelector('html')!;
    if (e.target.checked) {
      html.classList.add('dark');
      setIsDark(true);
    } else {
      html.classList.remove('dark');
      setIsDark(false);
    }
  };

  return (
    <section className="text-black dark:text-white bg-slate-100 dark:bg-teal-950">
      <header className="p-2 flex border-b border-1">
        <div className="font-bold">Rts Chat</div>
        <div className="flex-1" />
        <div>
          <ToggleAtom defaultChecked={isDark} onChange={onToggleTheme} />
        </div>
      </header>
      <main className="p-2 h-full">
        <Outlet />
      </main>
    </section>
  );
};

export default App;
