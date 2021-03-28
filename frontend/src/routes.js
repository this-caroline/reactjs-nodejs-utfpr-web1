import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute exact path="/" component={Home} isPrivate />
        <ProtectedRoute exact path="/login" component={Login} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
