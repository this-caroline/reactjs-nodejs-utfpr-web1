import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Appointments from "./pages/Appointments";
import Insurances from "./pages/Insurances";
import Patients from "./pages/Patients";
import Help from "./pages/Help";
import Login from "./pages/Login";
import ConfirmedSchedule from "./pages/ConfirmedSchedule";

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute exact path="/" component={Home} isPrivate />
        <ProtectedRoute
          exact
          path="/appointments"
          component={Appointments}
          isPrivate
        />
        <ProtectedRoute
          exact
          path="/confirmed-schedule"
          component={ConfirmedSchedule}
          isPrivate
        />
        <ProtectedRoute
          exact
          path="/insurances"
          component={Insurances}
          isPrivate
        />
        <ProtectedRoute exact path="/patients" component={Patients} isPrivate />
        <ProtectedRoute exact path="/help" component={Help} isPrivate />
        <ProtectedRoute exact path="/login" component={Login} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
