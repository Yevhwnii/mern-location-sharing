// Packages imports
import React, { useState, useCallback, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
// Local imports
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import Users from "./user/containers/Users";
import Auth from "./user/containers/Auth";
import NewPlace from "./places/containers/NewPlace";
import UserPlaces from "./places/containers/UserPlaces";
import UpdatePlace from "./places/containers/UpdatePlace";
import { AuthContext } from "./shared/context/auth-context";

let logoutTimer;

// Root component
const App = () => {
  const [token, setToken] = useState(false);
  const [tokenExpDate, setTokenExpDate] = useState();
  const [userId, setUserId] = useState(false);
  const login = useCallback((uid, token, expDate) => {
    setToken(token);
    setUserId(uid);
    // current time + 1h
    const tokenExpirationDate =
      expDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpDate(tokenExpirationDate);
    localStorage.setItem(
      "token",
      JSON.stringify({
        userId: uid,
        token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );

    setUserId(uid);
  }, []);
  const logout = useCallback(() => {
    setToken(null);
    setTokenExpDate(null);
    localStorage.removeItem("token");
    setUserId(null);
  }, []);

  // Expiration date check if user didn`t logout manually and stays on page for more than 1hr
  useEffect(() => {
    if (token && tokenExpDate) {
      const remainingTime = tokenExpDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpDate]);

  // Auto login
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("token"));
    if (
      storedData &&
      storedData.token &&
      storedData.userId &&
      // If expiration date is still in the future
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }
  return (
    // On URL change, router package will go from top to bottom and render those routes
    // On value prop change every component which listen to context will be rerendered
    <AuthContext.Provider
      value={{ isLoggedIn: !!token, token, userId, login, logout }}>
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
