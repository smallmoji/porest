import 'date-fns';
import React from 'react';
import { Paper, TextField, Grid, Button, Container, Link, Typography, Fab, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
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
      signupBirthdate: null
    }
    document.title = "Porest | Login or Signup";
    this.loginBoxRef = React.createRef()  
  }

  componentDidMount(){
    const that = this;
    document.addEventListener("scroll", function(e) {
      that.toggleScrollToVisibility();
    });
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
    this.setState({is_signupDialogOpen: false, signupBirthdate: null})
  }

  handleOpenSignupDialog(){
    this.setState({is_signupDialogOpen: true})
  }

  handleChangeSignupBirthdate(date){
    this.setState({signupBirthdate: date})
  }

  render(){
    const { classes } = this.props;

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
                    <form>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            className={classes.loginTextfield}
                            id="loginEmail"
                            variant="outlined"
                            label="Email"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            className={classes.loginTextfield}
                            id="loginPassword"
                            type="password"
                            variant="outlined"
                            label="Password"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button
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
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    className={classes.loginTextfield}
                    id="signupFirstname"
                    variant="outlined"
                    label="First Name"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    className={classes.loginTextfield}
                    id="signupLastname"
                    variant="outlined"
                    label="Last Name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    className={classes.loginTextfield}
                    id="signupEmail"
                    variant="outlined"
                    label="Email"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    className={classes.loginTextfield}
                    id="signupPassword"
                    variant="outlined"
                    label="Password"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    className={classes.loginTextfield}
                    id="signupConfirmPassword"
                    variant="outlined"
                    label="Confirm Password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      className={classes.loginTextfield}
                      id="signupDate"
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
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={this.handleCloseSignupDialog.bind(this)}>Confirm</Button>
            <Button color="secondary" onClick={this.handleCloseSignupDialog.bind(this)}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(style)(Login);