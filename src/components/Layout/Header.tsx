import React from 'react';
import styles from './Header.module.scss';
import logoImage from '../../assets/react.jpeg';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <img src={logoImage} alt="Logo" className={styles.logo} />
    </header>
  );
};

export default Header;