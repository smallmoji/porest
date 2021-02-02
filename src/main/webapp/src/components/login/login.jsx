import $ from 'jquery';
import 'date-fns';
import React from 'react';
import { Paper, TextField, Grid, Button, Container, Link, Typography, Fab, Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { Redirect } from "react-router-dom";
import '../../css/login/login.css';
import '../../css/common.css';


const style = theme => ({
  loginTextfield :{
    width: "100%"
  },
  loginButton :{
    width:"100%"
  },
  loginButtonGreen :{
    backgroundColor:"#42b72a",
    '&:hover':{
      backgroundColor:"#2d9418",
    }
  },
  bannerText:{
    color:"#ffff",
    '& .MuiTypography-h1':{
        fontFamily: "'Poppins', sans-serif",
        color:"#21f367"
    },  
    [theme.breakpoints.down('sm')]: {
      '& .MuiTypography-h1':{
        fontSize: "4rem"
      },
      '& .MuiTypography-h4':{
        fontSize: "1.5rem"
      }
    }
  },
  scrollToButton: {
    position: "fixed !important",
    bottom: "20px",
    left: 0,
    right: 0,
    maxWidth: "100%",
    margin: "auto !important",
      [theme.breakpoints.up('sm')]: {
        display: "none"
    }
  }
})

class Login extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      is_scrollToVisible: true,
      is_signupDialogOpen: false,
      signupDialogProgress: false,
      loginProgressBar: false,
      signupBirthdate: null,
      signupFormErrors: {
        signupFirstname: "",
        signupLastname: "",
        signupEmail: "",
        signupPassword: "",
        signupConfirmPassword: "",
        signupDate: ""
      },
      signupFormErrorMessage: "",
      loginFormErrorMessage:"",
      snackBarSuccess: false,
      snackBarMessage: "",
      redirect:"",
      homeState: {}
    }
    document.title = "Porest | Login or Signup";
    this.loginBoxRef = React.createRef()  
  }

  componentDidMount(){
    const that = this;
    document.addEventListener("scroll", function(e) {
      that.toggleScrollToVisibility();
    });
    localStorage.clear();
  }

  toggleScrollToVisibility() {
    if (window.pageYOffset < 100) {
      this.setState({
        is_scrollToVisible: true
      });
    } else {
      this.setState({
        is_scrollToVisible: false
      });
    }
  }

  handleCloseSignupDialog(){
    let errorFields = {
      signupFirstname: "",
      signupLastname: "",
      signupEmail: "",
      signupPassword: "",
      signupConfirmPassword: "",
      signupDate: ""
    }
    this.setState({is_signupDialogOpen: false, signupBirthdate: null, signupFormErrors: errorFields, signupFormErrorMessage: "", dialogProgress:false})
  }

  handleOpenSignupDialog(){
    this.setState({is_signupDialogOpen: true})
  }

  handleChangeSignupBirthdate(date){
    this.setState({signupBirthdate: date})
  }

  handleSubmitSignup(e){
    e.preventDefault();
    const that = this;
    const formData = new FormData(document.getElementById("signupForm"));
    let isError = false;
    let errorFields = {};
    let errorState = {};

    for(let pair of formData.entries()){
      if(!pair[1]){
        errorFields[pair[0]] = "This field is required.";
        isError = true;
      }else{
        errorFields[`${pair[0]}`] = "";
      }
    }

    let currDate = new Date();
    let birthDate = new Date(formData.get("signupDate"));
    
    if(birthDate.getTime() > currDate.getTime()){
      isError = true;
      errorFields['signupDate'] = "You can't be from the future."
    }else{
      formData.set("signupDate", birthDate);
    }

    errorState['signupFormErrors'] = errorFields;

    if(isError){
      this.setState(errorState)
    }else{
      this.setState({signupDialogProgress:true})
      $.ajax({
        url:"signup",
        data: formData,
        type:"POST",
        processData: false,
        contentType:false,
        success: function(response){
          that.setState({signupDialogProgress:false})
          if(response.result === "success"){
            that.setState({snackBarSuccess: true, snackBarMessage:"Welcome to the Porest."})
            that.handleCloseSignupDialog();
          }else{
            let errorFields = {};
            let errorState = {};

            if(response.error.emailFormatError){
              errorFields['signupEmail'] = response.error.emailFormatError;
            }

            if(response.error.emailExistsError){
              errorFields['signupEmail'] = response.error.emailExistsError;
            }

            if(response.error.cofirmPassError){
              errorFields['signupConfirmPassword'] = response.error.cofirmPassError;
            }

            if(response.error.passwordLengthError){
              errorFields['signupPassword'] = response.error.passwordLengthError;
            }

            errorState['signupFormErrors'] = errorFields;

            that.setState(errorState);
          }

        },
        error: function(xhr){
          const errorMessage = xhr.responseJSON.status + " " + xhr.responseJSON.error;
          that.setState({signupFormErrorMessage: errorMessage, dialogProgress:false});
        }

      })
    }
  }

  handleSubmitLogin(e){
    e.preventDefault();
    const that = this;
    const formData = new FormData(document.getElementById("loginForm"));

    this.setState({loginProgressBar:true})
    $.ajax({
        url:"signin",
        data: formData,
        type:"POST",
        processData: false,
        contentType:false,
        success: function(response){
          if(response.result === "success"){
            localStorage.setItem('token', response.user)
            if(response.user.role === "ROLE_USER"){
              that.setState({redirect: "/home", homeState:{
                role: "user",
                id : response.user.id
              }})
            }else{
              that.setState({redirect: "/home", homeState:{
                role: "creator",
                id: 3
              }})  
            }
            
          }else{
            localStorage.setItem('token',false)
            that.setState({loginFormErrorMessage: response.error});
          }

          that.setState({loginProgressBar:false})
        },
        error: function(){
          that.setState({loginProgressBar:false})
          that.setState({loginFormErrorMessage: "Server cannot be reach."});
        }
    })
  }
  
  
  render(){
    const { classes } = this.props;
    if (this.state.redirect) {
      return <Redirect to={{
        pathname: this.state.redirect,
        state: this.state.homeState
      }} />
    }
    return(
      <div className="login-wrapper">
        <div className="login-overlay">
          <Container maxWidth="md">  
            <Grid container>
              <Grid item xs={12} sm={6} className="d-flex align-items-center" style={{minHeight:"100vh"}}>
                <div className={classes.bannerText}>
                  <Typography variant="h1">
                    Porest
                  </Typography>
                  <Typography variant="h4">
                    Plant your seed of connection and connect to the world.
                  </Typography>
                </div>

                {this.state.is_scrollToVisible && 
                <Fab color="default" className={classes.scrollToButton} 
                  onClick={()=>{this.loginBoxRef.current.scrollIntoView()}}>
                  <ExpandMoreIcon />
                </Fab> }
              </Grid>
              <Grid ref={this.loginBoxRef} item xs={12} sm={6} style={{minHeight:"100vh"}}>
                <div className="login-form flex-center">
                  <Paper className="p-4 mx-4">
                    <form id="loginForm" ref={(el) => this.loginForm = el} onSubmit={this.handleSubmitLogin.bind(this)}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} style={{display: this.state.loginFormErrorMessage ? "block" : "none"}}>
                          <div className="alert alert-danger mb-0">{this.state.loginFormErrorMessage}</div>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            className={classes.loginTextfield}
                            id="loginEmail"
                            name="email"
                            variant="outlined"
                            label="Email"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            className={classes.loginTextfield}
                            id="loginPassword"
                            name="password"
                            type="password"
                            variant="outlined"
                            label="Password"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            type="submit"
                            form="loginForm"
                            className={classes.loginButton}
                            size="large" 
                            variant="contained" color="primary">
                            Login
                          </Button>
                        </Grid>
                        <Grid item className="flex-center">
                          <Link>Forgot Password?</Link>
                        </Grid>
                        <Grid item xs={12}><div className="hr-line"></div></Grid>
                        <Grid item xs={12} className="text-center">
                          <Button
                            className={classes.loginButtonGreen}
                            size="large" 
                            variant="contained" color="secondary"
                            onClick={this.handleOpenSignupDialog.bind(this)}>
                            Join Porest
                          </Button>
                        </Grid>
                        <Grid item xs={12}>
                          <LinearProgress style={{display: this.state.loginProgressBar ? "block":"none"}} />
                        </Grid>
                      </Grid>
                    </form>
                  </Paper>
                </div>
              </Grid>
            </Grid>
          </Container>
        </div>


        {/* SIGNUP MODAL */}
        <Dialog open={this.state.is_signupDialogOpen} onClose={this.handleCloseSignupDialog.bind(this)} maxWidth="sm">
          <DialogTitle>Create New Account</DialogTitle>
          <DialogContent>
            <form id="signupForm" ref={(el) => this.signupForm = el} onSubmit={this.handleSubmitSignup.bind(this)}>
              <Grid container spacing={2}>
                <Grid item xs={12} style={{display: this.state.signupFormErrorMessage ? "block" : "none"}}>
                  <div className="alert alert-danger">{this.state.signupFormErrorMessage}</div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    error={this.state.signupFormErrors.signupFirstname}
                    helperText={this.state.signupFormErrors.signupFirstname}
                    className={classes.loginTextfield}
                    id="signupFirstname"
                    name="signupFirstname"
                    variant="outlined"
                    label="First Name"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    error={this.state.signupFormErrors.signupLastname}
                    helperText={this.state.signupFormErrors.signupLastname}
                    className={classes.loginTextfield}
                    id="signupLastname"
                    name="signupLastname"
                    variant="outlined"
                    label="Last Name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={this.state.signupFormErrors.signupEmail}                  
                    helperText={this.state.signupFormErrors.signupEmail}                  
                    className={classes.loginTextfield}
                    id="signupEmail"
                    name="signupEmail"
                    variant="outlined"
                    label="Email"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="password"
                    error={this.state.signupFormErrors.signupPassword}
                    helperText={this.state.signupFormErrors.signupPassword}
                    className={classes.loginTextfield}
                    id="signupPassword"
                    name="signupPassword"
                    variant="outlined"
                    label="Password"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="password"
                    error={this.state.signupFormErrors.signupConfirmPassword}
                    helperText={this.state.signupFormErrors.signupConfirmPassword}
                    className={classes.loginTextfield}
                    id="signupConfirmPassword"
                    name="signupConfirmPassword"
                    variant="outlined"
                    label="Confirm Password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      error={this.state.signupFormErrors.signupDate}
                      helperText={this.state.signupFormErrors.signupDate}
                      className={classes.loginTextfield}
                      id="signupDate"
                      name="signupDate"
                      disableToolbar
                      variant="inline"
                      inputVariant="outlined"
                      format="MM/dd/yyyy"
                      margin="normal"
                      label="Birthdate (MM/DD/YYYY)"
                      value={this.state.signupBirthdate}
                      onChange={this.handleChangeSignupBirthdate.bind(this)}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
              </Grid>
            </form>

             <LinearProgress className="mt-3" style={{display: this.state.signupDialogProgress ? "block":"none"}} />
          </DialogContent>
          <DialogActions>
            <Button type="submit" form="signupForm" variant="contained" color="primary">Confirm</Button>
            <Button color="secondary" onClick={this.handleCloseSignupDialog.bind(this)}>Cancel</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={this.state.snackBarSuccess}
          autoHideDuration={4000}
          onClose={()=>{this.setState({snackBarSuccess:false})}}
        >
          <MuiAlert elevation={6} variant="filled" onClose={()=>{this.setState({snackBarSuccess:false})}} severity="success">
            {this.state.snackBarMessage} 
          </MuiAlert>
        </Snackbar>
      </div>
    )
  }
}

export default withStyles(style)(Login);