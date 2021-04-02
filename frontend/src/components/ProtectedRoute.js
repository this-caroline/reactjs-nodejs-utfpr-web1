import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { checkAuth } from '../services/requests/auth';
import { Creators as AuthActions } from '../store/ducks/auth/reducer';
import ProgressBar from './UI/ProgressBar';
import Menu from './UI/Menu';

const ProtectedRoute = (props) => {
  const { component: Component, isPrivate = false, ...rest } = props;
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);

    const token = localStorage.getItem('token');

    if (!token) return setIsLoading(false);

    (async () => {
      try {
        const { success, user } = await checkAuth();

        if (success) {
          dispatch(AuthActions.setUser({
            user,
            isAuthenticated: true,
          }));
        }
      } catch (error) {
        dispatch(AuthActions.setUser({
          user: null,
          isAuthenticated: false,
        }));
      }

      setIsLoading(false);
    })();
  }, [dispatch, isPrivate]);

  const getComponent = (routeProps) => {
    if (isPrivate) {
      if (isAuthenticated) {
        return (
          <>
            <Menu />
            <Component {...routeProps} />
          </>
        );
      }

      return <Redirect to="/login" />;
    }

    if (isAuthenticated) return <Redirect to="/" />;

    return <Component {...routeProps} />;
  };

  if (isLoading) return <ProgressBar />;

  return (
    <Route
      {...rest}
      render={(routeProps) => (getComponent(routeProps))}
    />
  );
};

export default ProtectedRoute;
