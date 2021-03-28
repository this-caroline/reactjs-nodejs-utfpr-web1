import React from 'react';
import { Menu as MenuIcon } from 'react-feather';

import styles from './MobileMenu.module.css';

const MobileMenu = ({ displayMenuItems }) => {
  return (
    <div className={styles.Container}>
      <MenuIcon
        className={styles.Icon}
        onClick={() => displayMenuItems()}
      />
    </div>
  );
};

export default MobileMenu;
