import React, {
  useCallback,
  useEffect,
  useState
} from 'react';
import { useDispatch } from 'react-redux';

import styles from './Menu.module.css';
import MobileMenu from './MobileMenu';
import { Creators as AuthActions } from '../../../store/ducks/auth/reducer';
import { withRouter } from 'react-router';

const maxW = 755;
const menuItems = [
  {
    id: 1,
    title: 'Click to manage appointments',
    label: 'Appointments',
    path: '/appointments'
  },
  {
    id: 2,
    title: 'Click to manage patients',
    label: 'Patients',
    path: '/patients'
  },
  {
    id: 3,
    title: 'Click to manage insurances',
    label: 'Insurances',
    path: '/insurances'
  },
  {
    id: 4,
    title: 'Click to get help',
    label: 'Help',
    path: '/help'
  },
  {
    id: 5,
    title: 'Click to sign out',
    label: 'Logout',
    path: '/logout'
  },
];

const Nav = ({ history }) => {
  const dispatch = useDispatch();

  return (
    <nav>
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.id}
            id={`main-menu-list-item-${item.path || item.id}`}
            onClick={() => {
              if (item.path === '/logout') {
                localStorage.clear();
                dispatch(AuthActions.logout());
                return history.push('/login');
              }

              return history.push(item.path);
            }}
            title={item.title}
            style={{ cursor: 'pointer' }}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </nav>
  );
};

const Menu = ({ history }) => {
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

    menuItems.forEach((item) => {
      const menuItem = document.getElementById(
        `main-menu-list-item-${item.path || item.id}`
      );

      if (menuItem) {
        if (!mobileMenu && item.path === history.location.pathname) {
          menuItem.classList.add(styles.Active);
        } else {
          menuItem.classList.remove(styles.Active);
        }
      }
    });

    return () => window.removeEventListener('resize', handleChangeWidth);
  }, [handleChangeWidth, mobileMenu, history.location.pathname]);

  return (
    <>
      {displayMenu &&
        <React.Fragment>
          <div className={styles.Backdrop} onClick={() => setDisplayMenu(false)} />
          <div className={styles.HamburgerMenuContent}>
            <Nav history={history} />
          </div>
        </React.Fragment>
      }

      {!mobileMenu ? (
        <div className={styles.MainMenu}>
          <Nav history={history} />
        </div>
      ) : <MobileMenu displayMenuItems={() => setDisplayMenu(true)} />}
    </>
  );
};

export default withRouter(Menu);
