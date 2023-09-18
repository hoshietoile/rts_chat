import React, { useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import client from '../../api/axios';

const LoginPage = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
  });

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prev) => ({ ...prev, name: e.target.value }));
  };

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prev) => ({ ...prev, email: e.target.value }));
  };

  const onClickSend = () => {
    client.post('/api/users', {
      user,
    });
    setUser({ name: '', email: '' });
  };

  return (
    <div>
      <div>
        <div>
          <label>Name:</label>
          <Input onChange={onChangeName} value={user.name} />
        </div>
        <div>
          <label>Email:</label>
          <Input onChange={onChangeEmail} value={user.email} />
        </div>

        <Button onClick={onClickSend}>Createuser</Button>
      </div>
    </div>
  );
};

export default LoginPage;
