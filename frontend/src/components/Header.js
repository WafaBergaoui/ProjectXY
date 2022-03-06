import React from 'react';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <strong>
        Tic-<span>Tac</span>-Toe
      </strong>
    </header>
  );
}
