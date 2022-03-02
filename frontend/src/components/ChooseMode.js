import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import styles from './ChooseMode.module.css';

import { HomeContext } from '../context/HomeContext';
import { GameContext } from '../context/GameContext';

export default function ChooseMode() {
  const setComponent = useContext(HomeContext)[1];
  const { multiplayer: _mulitplayer } = useContext(GameContext);

  const setMultiplayer = _mulitplayer[1];
  return (
    <div className={styles.container}>
      <h2>Choose Mode</h2>
      <div>
        <Link to='/play'>
          <button className={styles.button}>
            <i className='fa fa-user' aria-hidden='true'></i> Single Player
          </button>
        </Link>
        <button
          className={styles.button}
          onClick={() => {
            setComponent('ChooseOpponent');
            setMultiplayer(true);
          }}
        >
          <i className='fa fa-users' aria-hidden='true'></i> Multiplayer
        </button>
      </div>
    </div>
  );
}
