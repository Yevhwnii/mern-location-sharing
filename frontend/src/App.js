// Packages imports
import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
// Local imports
// import Users from "./user/containers/Users";
// import Auth from "./user/containers/Auth";
// import NewPlace from "./places/containers/NewPlace";
// import UserPlaces from "./places/containers/UserPlaces";
// import UpdatePlace from "./places/containers/UpdatePlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { useAuth } from "./shared/hooks/auth-hook";
import { AuthContext } from "./shared/context/auth-context";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";

// Lazy loading
const Users = React.lazy(() => import("./user/containers/Users"));
const NewPlace = React.lazy(() => import("./places/containers/NewPlace"));
const UserPlaces = React.lazy(() => import("./places/containers/UserPlaces"));
const UpdatePlace = React.lazy(() => import("./places/containers/UpdatePlace"));
const Auth = React.lazy(() => import("./user/containers/Auth"));

// Root component
const App = () => {
  const { token, login, logout, userId } = useAuth();

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
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }>
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
