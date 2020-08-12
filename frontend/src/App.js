// Packages imports
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
// Local imports
import Users from './user/containers/Users';
import NewPlace from './places/containers/NewPlace';

// Root component
const App = () => {
  return (
    // On URL change, router package will go from top to bottom and render those routes
    <Router>
      <Switch>
        <Route path='/places/new' exact>
          <NewPlace />
        </Route>
        <Route path='/' exact>
          <Users />
        </Route>
        <Redirect to='/' />
      </Switch>
    </Router>
  );
};

export default App;
