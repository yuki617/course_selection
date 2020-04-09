import React, { Component } from 'react';
import { Redirect} from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import App from './App'
import { Link } from 'react-router-dom';

class Login extends Component {
constructor(props){
  super(props);
  this.state={
    username:'',
    password:'',
    fireRedirect: false,
    status:false,
    newstate:1
  }
 }

 submitForm = (e) => {
  e.preventDefault()
      fetch(
        `http://127.0.0.1:5000/login?username=${this.state.username}&password=${this.state.password}`
      )
      .then(dataWrappedByPromise => dataWrappedByPromise.json())
.then(data => {
    // you can access your data here
   if (data == true){
       console.log("success")
       this.setState({flag: 1}); 
       this.setState({ newstate: 2})
   } else {
    console.log("fail")
    this.setState({ newstate: 3 })
    
   }
})

     

}


/*handleClick(event){
 if(0){
 console.log("Login successfull");
  } else if(response.data.code == 204){

    console.log("Username password do not match");
    alert("username password do not match")
    }
    else{
    console.log("Username does not exists");
    alert("Username does not exist");
    }
    // })
    // .catch(function (error) {
    // console.log(error);
    // });
    }*/
    handleClick(event) {
      event.preventDefault();

      this.setState({ submitted: true });
      const { username, password } = this.state;
      fetch(
        `http://127.0.0.1:5000/login?username=${this.state.username}&password=${this.state.password}`
      )
        .then(response => {
          return console.log(response.json())
               if (response.data.status === "created") {
                this.props.handleSuccessfulAuth(response.data);
               }
             })
            .catch(error => {
               console.log("registration error", error);
            });
     // if (username && password) {
     //     this.props.login(username, password);
     // }
  }
  
sendData(e){
        console.log(e)
        let username = e.arget.value;
        this.props.Callback(username);      
    }


render() {
    const { from } = '/'
    const { fireRedirect } = this.state.fireRedirect
    console.log(this.state.username)
    return (
      <div>
        <MuiThemeProvider>
          <div>
          <AppBar
             title="Login"
           />
           <TextField
             hintText="Enter your Username"
             floatingLabelText="Username"
             onChange = {(event,newValue) => this.setState({username:newValue})}
            />
           <br/>
             <TextField
               type="password"
               hintText="Enter your Password"
               floatingLabelText="Password"
               onChange = {(event,newValue) => this.setState({password:newValue})}
               />
             <br/>
             <div>
        <form onSubmit={this.submitForm}>
        <button type="primary"
            onChange={(e) => this.sendData(e)} 
            htmlType="submit"
            className="login-form-button" style={style}>Submit</button>
            <Link to="/register" className="btn btn-link">Register</Link>
        </form>
        
        {(this.state.newstate == 2) && (
            <Redirect  to={{pathname:'/table',state : {
                username : this.state.username}}
            }/>
          )}
        {(this.state.newstate == 3) && (
            <p>Your login credentials could not be verified, please try again.</p>
          )}
          
        
        </div>
         </div>
         </MuiThemeProvider>
      </div>
    );
  }
}
const style = {
 margin: 15,
};
export default Login;


