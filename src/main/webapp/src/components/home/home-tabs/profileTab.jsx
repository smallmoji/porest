import React from 'react';
import $ from 'jquery';
import '../../../css/profile/profile.css';
import { Grid, Tabs, Tab, Button, Avatar, Dialog, DialogActions, DialogContent, DialogTitle, TextareaAutosize } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import DateRangeIcon from '@material-ui/icons/DateRange';
import TabPanel from '../../common/TabPanel';
import Posts from '../../common/Posts';

const style = theme =>({
  profileAvatar: {
    width: "150px",
    height: "150px",
    position:"absolute",
    top:"60%",
    marginLeft:"10px",
    border: "5px solid #fff"
  },
  postsTab: {
    '& .Mui-selected' : {
      fontWeight: 'bolder!important',
    },
    '& .PrivateTabIndicator-colorSecondary-6':{
      backgroundColor: "#069c38"
    }
  }
})

class ProfileTab extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      userId: this.props.userId,
      user: {},
      userProfile:{},
      createdAt:"",
      currTabpanel: 0,
      previewProfileImage: null,
      about: "",
      displayName:"",
      displayNameError: true
    }
  }

  componentDidMount(){
    this.getUser();
  }

   getUser(){
    const that = this;
    $.ajax({
      url:"getUserById",
      data: {
        id: this.state.userId
      },
      success: function(response) {
        if(response.result === "success"){
          let dateString = response.user.createdAt;
          let date = new Date(dateString.substring(0,10));
          let dateSplit = date.toDateString().split(' ');
          let finalDate = dateSplit[1] + " " + dateSplit[3];

          that.setState({
            user: response.user, 
            userProfile: response.profile,
            createdAt: finalDate,
            displayName: response.profile.displayName,
            about: response.profile.about
          })
        }
      }
    })
  }

  handleTabChange(e, newValue){
    this.setState({currTabpanel: newValue });
  }

  handlePreviewProfileImage(e){
    e.preventDefault();
    let file = e.target.files[0];
    let reader = new FileReader();
    if (e.target.files.length === 0) {
      return;
    }

    reader.onloadend = (e) => {
      this.setState({
        previewProfileImage: [reader.result]
      });
    }
    reader.readAsDataURL(file);
  }

  handleSaveUserProfile(){
    const that = this;
    let formData = new FormData();
    
    if(this.state.displayName){
      formData.append("userId", this.state.userId)
      formData.append("displayName", this.state.displayName)
      formData.append("about", this.state.about)
      formData.append("profileImage", this.fileUpload.files[0])
      $.ajax({
        type: "POST",
        url: "updateUserProfile",
        data: formData,
        processData: false,
        contentType: false,
        success : function(response){
          if(response.result === "success"){
            that.getUser();
            that.props.resetHome(that.state.userId);
            that.setState({displayNameError: true, editProfileDialog: null})
          }
        }
      })
    }else{
      this.setState({displayNameError: false})
    }
  }

  render(){
    const { classes } = this.props;
    return(
      <div style={{height:"100%"}}>
        <div className="profile-banner position-relative">
          <div className="profile-cover">
            
          </div>
          
          <Avatar 
            src={"../../../../public/media/PROFILE/" + this.state.userId + "/" + 
            this.state.userProfile.profileImagePath}
            className={classes.profileAvatar}></Avatar>
        </div>

        <button className="sidebar-post-btn badge-pill py-2 px-4 mt-2 mr-2 float-right" onClick={()=>{this.setState({editProfileDialog: true})}}>Edit Profile</button>

        <Dialog
          open={this.state.editProfileDialog}
          onClose={()=>{this.setState({editProfileDialog: null, previewProfileImage: null, displayNameError: true})}}
          maxWidth="sm">
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item className="font-weight-bold" xs={3}>
                  Profile Picture:
                </Grid>
                <Grid item xs={9}>
                   <input 
                    className="ml-2" type="file"
                    ref={(fileUpload) => {
                      this.fileUpload = fileUpload;
                    }} 
                    onChange={this.handlePreviewProfileImage.bind(this)} 
                    />
                   <img className="my-2 w-50 rounded" src={this.state.previewProfileImage} alt=""/>
                </Grid>
                <Grid item className="font-weight-bold" xs={3}>
                  Display Name: 
                </Grid>
                <Grid item xs={9}>
                  <div className="input-group">
                    <input 
                      className={("form-control ") + (this.state.displayNameError ? " " : "is-invalid")} 
                      onChange={(e)=>{this.setState({displayName: e.target.value})}}
                      defaultValue={this.state.userProfile.displayName}
                      />
                    <div class="invalid-feedback">
                      Please choose a display name.
                    </div>
                  </div>
                 
                </Grid>
                <Grid item className="font-weight-bold" xs={3}>
                  About: 
                </Grid>
                <Grid item xs={9}>
                  <TextareaAutosize 
                    className="form-control"
                    onChange={(e)=>{this.setState({about: e.target.value})}}
                    defaultValue={this.state.about} />
                </Grid>
              </Grid>
              
            </DialogContent>
            <DialogActions>
              <Button onClick={()=>{this.setState({editProfileDialog: null, previewProfileImage: null, displayNameError: true})}}>
                Cancel
              </Button>
              <Button color="primary"
                onClick={this.handleSaveUserProfile.bind(this)} >Save</Button>
            </DialogActions>
        </Dialog>

        <div className="ml-3" style={{marginTop:"75px"}}>
          <div className="d-flex flex-column">
            <span className="font-weight-bold" style={{fontSize:"1.3rem"}}>
              {this.state.user.firstName}
            </span>
            <span style={{fontSize:"1rem", color:"#7d7d7d"}}>
              @{this.state.userProfile.displayName} 
            </span>
            <span className="mt-2 d-flex align-items-center" style={{color:"#7d7d7d"}}>
              <DateRangeIcon style={{marginRight:"5px"}}/> Joined {this.state.createdAt}
            </span>

            <span className="mt-2">
              {this.state.userProfile.about}
            </span>
          </div>
        </div>

        <div className="mt-2 ml-3">
          <Tabs
            className={classes.postsTab}
            value={this.state.currTabpanel}
            onChange={this.handleTabChange.bind(this)}
          >
            <Tab value={0} label="POSTS"></Tab>
            <Tab value={1} label="LIKES"></Tab>
          </Tabs>

          <TabPanel value={this.state.currTabpanel} index={0}>
            <Posts userId={this.state.userId} restrictPost="userPosts" />
          </TabPanel>
          <TabPanel value={this.state.currTabpanel} index={1}>
            <Posts userId={this.state.userId} restrictPost="likes" />
          </TabPanel>
        </div>
      </div>
    )
  }
}

export default withStyles(style) (ProfileTab);