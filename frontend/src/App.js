// Packages imports
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
// Local imports
import MainNavigation from './shared/components/Navigation/MainNavigation';
import Users from './user/containers/Users';
import NewPlace from './places/containers/NewPlace';

// Root component
const App = () => {
  return (
    // On URL change, router package will go from top to bottom and render those routes
    <Router>
      <MainNavigation />
      <main>
        <Switch>
          <Route path='/places/new' exact>
            <NewPlace />
          </Route>
          <Route path='/' exact>
            <Users />
          </Route>
          <Redirect to='/' />
        </Switch>
      </main>
    </Router>
  );
};

export default App;
