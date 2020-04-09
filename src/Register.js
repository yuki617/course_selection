


import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Register extends Component {
  constructor(props){
    super(props);
    this.state={
      username:'',
      email:'',
      password:''
    }
  }
  handleClick(event) {
    const { email, password, password_confirmation } = this.state;
    fetch(
      `http://127.0.0.1:5000/register?username=${this.state.username}&password=${this.state.password}&email=${this.state.email}`
    )
      .then(res => res.json());

    // axios
    //   .post(
    //     "http://127.0.0.1:5000/register",
    //     {
    //       user: {
    //         email: email,
    //         password: password,
    //         password_confirmation: password_confirmation
    //       }
    //     },
    //     { withCredentials: true }
    //   )
    //   .then(response => {
    //     if (response.data.status === "created") {
    //       this.props.handleSuccessfulAuth(response.data);
    //     }
    //   })
    //   .catch(error => {
    //     console.log("registration error", error);
    //   });
    event.preventDefault();
  }
  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
          <AppBar
             title="Register"
           />
           <TextField
             hintText="Enter your User Name"
             floatingLabelText="User Name"
             onChange = {(event,newValue) => this.setState({username:newValue})}
             />
           <br/>
           <TextField
             hintText="Enter your Email"
             type="email"
             floatingLabelText="Email"
             onChange = {(event,newValue) => this.setState({email:newValue})}
             />
           <br/>
           <TextField
             type = "password"
             hintText="Enter your Password"
             floatingLabelText="Password"
             onChange = {(event,newValue) => this.setState({password:newValue})}
             />
           <br/>
           <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
           <Link to="/login" className="btn btn-link">Login</Link>
          </div>
         </MuiThemeProvider>
      </div>
    );
  }
}
const style = {
  margin: 15,
};
export default Register;



