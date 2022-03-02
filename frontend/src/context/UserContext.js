import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState('');
  const [room, setRoom] = useState('');
  const [player, setPlayer] = useState('');

  return (
    <UserContext.Provider
      value={{
        user: [user, setUser],
        room: [room, setRoom],
        player: [player, setPlayer],
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
