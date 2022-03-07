import React, { useContext, useState } from 'react';
import { Navigate } from "react-router-dom";
import randomstring from 'randomstring';

import styles from './ChooseUsername.module.css';

import { UserContext } from '../context/UserContext';
import { HomeContext } from '../context/HomeContext';

export default function ChooseUsername() {
  const { user: _user, room: _room, player: _player } = useContext(UserContext);
  const setComponent = useContext(HomeContext)[1];
  const [user, setUser] = _user;
  const [player, setPlayer] = _player;
  const [room, setRoom] = _room;
  const [error, setError] = useState('');
  const [redirect, setRedirect] = useState(false);

  const handleChange = (e) => {
    setUser(e.target.value);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      setError('Username is required');
    } else if (user.length < 3) {
      setError('Username is too short');
    } else if (user.length > 10) {
      setError('Username is too long');
    } else if (/\W/.test(user)) {
      setError('Username contains invalid characters');
    } else {
      if (!room && !player) {
        setRoom(`${user}${randomstring.generate(5)}`);
        setPlayer('X');
      }
      setRedirect(true);
    }
  };

  if (redirect) {
    setComponent('ChooseOpponent');
    return <Navigate to="/play" replace={true} />;

  }

  return (
    <div className={styles.container}>
      <h2>Choose Username</h2>
      <p>Enter a username to use in the game</p>
      <form onSubmit={handleSubmit}>
        <div className={styles.form_group}>
          <input
            type='text'
            value={user}
            onChange={handleChange}
            placeholder='Username'
            style={{ border: error ? '2px solid #f44' : 'none' }}
          />
          <small>{error}</small>
        </div>
        <button className={styles.button} type='submit'>
          <i className='fa fa-check-circle-o' aria-hidden='true'></i> Done
        </button>
      </form>
    </div>
  );
}
