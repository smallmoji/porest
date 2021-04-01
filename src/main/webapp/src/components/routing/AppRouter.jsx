import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Login from '../login/login';
import PrivateRoute from './PrivateRouter';
import Home from '../home/home';

export default class AppRouter extends React.Component{
  render(){
    return(
      <Router> 
        <Switch>
          <Route path="/login" exact component={Login} />
          <PrivateRoute exact path="/home" component={Home}/>
        </Switch>
      </Router>
    )
  }
}
