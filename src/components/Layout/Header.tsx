import React from 'react';
import styles from './Header.module.scss';
import logoImage from '../../assets/react.jpeg';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData).username : '';
  const role = userData ? JSON.parse(userData).role : '';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <img src={logoImage} alt="Logo" className={styles.logo} />
      {token && (
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <div className={styles.username}>{user}</div>
            <div className={styles.userRole}>{role}</div>
          </div>
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </div>
      )}
    </header>
  );
};

export default Header;