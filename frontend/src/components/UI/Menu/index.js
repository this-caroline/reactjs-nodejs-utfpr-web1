import React, {
  useCallback,
  useEffect,
  useState
} from 'react';

import styles from './Menu.module.css';
import MobileMenu from './MobileMenu';

const maxW = 755;

const Menu = () => {
  const [mobileMenu, setMobileMenu] = useState(window.innerWidth < maxW);
  const [displayMenu, setDisplayMenu] = useState(false);

  const handleChangeWidth = useCallback(() => {
    if (window.innerWidth > maxW && mobileMenu === true) {
      if (displayMenu) setDisplayMenu(false);
      setMobileMenu(false);
    }

    if (window.innerWidth <= maxW && mobileMenu === false) {
      setMobileMenu(true);
    }
  }, [mobileMenu, displayMenu]);

  useEffect(() => {
    window.addEventListener('resize', handleChangeWidth);

    return () => window.removeEventListener('resize', handleChangeWidth);
  }, [handleChangeWidth]);

  return (
    <>
      {displayMenu &&
        <React.Fragment>
          <div className={styles.Backdrop} onClick={() => setDisplayMenu(false)} />
          <div className={styles.HamburgerMenuContent}>Hello</div>
        </React.Fragment>
      }

      {!mobileMenu
        ? (
          <nav className={styles.MainMenu}>
            <ul>
              <li>Appointments</li>
              <li>Patients</li>
              <li>Insurances</li>
              <li>Help</li>
              <li>Logout</li>
            </ul>
          </nav>
        ) : <MobileMenu displayMenuItems={() => setDisplayMenu(true)} />
      }
    </>
  );
};

export default Menu;
