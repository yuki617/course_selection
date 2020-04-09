import React, { Component} from 'react';
import { Route, Switch } from 'react-router-dom';
 
import Table from './table';
import Login from './Login';
import Register from './Register';


 
export default class App extends Component {

  parentCallback(login) {
    this.setState({username: login})
  } 

  render() {
    return (
        <div className="tabs">
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/table" component={Table} />
            {/* <Route path="/" render={() => <Login Callback = {this.parentCallback}/>} /> 
            <Route path="/table" render={() => <Table username = {this.state.username} />}/> */}
          </Switch>
        </div>
    );
  }
}
