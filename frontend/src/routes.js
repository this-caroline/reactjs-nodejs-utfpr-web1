import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';

// import ProtectedRoute from './components/RoutesPermissions/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        {/* <ProtectedRoute path="/login" exact component={Login} /> */}
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
