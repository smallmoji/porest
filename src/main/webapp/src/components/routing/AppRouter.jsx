import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Login from '../login/login';
import PrivateRoute from './PrivateRouter';

export default class AppRouter extends React.Component{
  render(){
    return(
      <Router>
        <Switch>
          <Route path="/login" exact component={Login} />
          {/* <Route path="/signup" exact component={Signup} /> */}
          {/* <PrivateRoute exact path="/home" component={Home}/> */}
        </Switch>
      </Router>
    )
  }
}
