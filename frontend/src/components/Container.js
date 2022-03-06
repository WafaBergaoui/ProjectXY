import React from 'react';
import Header from './Header';

import styles from './Container.module.css';

export default function Container({ children }) {
  return (
    <div className={styles.container}>
      <Header />
      {children}
    </div>
  );
}
