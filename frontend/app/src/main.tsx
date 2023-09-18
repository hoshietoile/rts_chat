import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Routes } from '@generouted/react-router';
import RoomProvider from './components/providers/Room.provider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RoomProvider>
      <Routes />
    </RoomProvider>
  </React.StrictMode>
);
