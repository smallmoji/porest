import React from 'react'
import $ from 'jquery';
import { Grid, Tabs, Tab, AppBar, Toolbar, Typography, Avatar, BottomNavigation, BottomNavigationAction, Menu, MenuItem, ListItem, List, ListItemAvatar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { muiIcon } from '../../js/icons';
import TabPanel from '../common/TabPanel';
import {ReactComponent as PorestLogo} from '../../misc/logo/logo_green.svg';
import HomeTab from './home-tabs/homeTab';
import FriendsTab from './home-tabs/friendsTab';
import NotificationsTab from './home-tabs/notificationsTab';
import { Link } from 'react-router-dom';

import '../../css/home/home.css';

const style = theme => ({
  appBar: {
    background: "none",
    boxShadow: "none",
    borderBottom: "1px solid #dee2e6",
    backgroundColor:"#fff",
  },
  sidebarTab: {
    '& button:focus': {
      outline:'none'
    },
    '& .MuiTab-wrapper' : {
      alignItems:"flex-start"
    },
    '& .MuiTab-root': {
      fontSize:"1rem",
      fontWeight: "bold!important",
      padding: "0",
      borderRadius: "10rem",
      paddingRight: ".9em",
      paddingLeft: ".9em",
      width: "fit-content",
      minWidth:"0 !important",
      [theme.breakpoints.down('md')]: {
        fontSize:".9rem"
      } 
    },
    '& .MuiTab-root:hover' :{
      backgroundColor: "rgb(31 204 18 / 16%)"
    },
    '& .MuiTab-root:first-child':{
      opacity:"1!important"
     },
    '& .Mui-selected' : {
      color: '#0bbd47',
      fontWeight: 'bolder!important',
      '& .MuiSvgIcon-root': {
        color: '#0bbd47',
      }
    },
    '& .MuiSvgIcon-root': {
      color:"#000",
      width:"30px",
      height:"30px",
      marginRight:"20px"
    },
    '& .MuiTabs-indicator' : {
      display:"none"
    }
  },
  bottomNav : {
    position: "fixed",
    bottom : 0,
    width: "100%",
    [theme.breakpoints.up('sm')]: {
      display : "none"
    },
    borderTop: "1px solid #dee2e6",
    '& .Mui-selected' : {
      color: '#0bbd47',
      '& .MuiSvgIcon-root': {
        color: '#0bbd47',
      }
    }
  }
})

class Home extends React.Component{
  constructor(props){
    super(props);
    const prop = this.props.location.state;
    this.state = {
      role: prop.role,
      id: prop.id,
      currTabpanel: 0,
      mainTitle:"Home",
      user: {},
      currYear: "",
      accountMenuAnchorEl: null,
      requestsCount: 0,
      suggestedUsers: [],
      isSuggestedTab: false
    }

    document.title = "Porest | Home";
  }

  componentDidMount(){
    let currYear = new Date().getFullYear();
    this.setState({currYear: currYear })
    this.getUser();
    this.getFriendships();
    this.getSuggestedUsers();
  }

  getUser(){
    const that = this;
    $.ajax({
      url:"getUserById",
      data: {
        id: this.state.id
      },
      success: function(response) {
        if(response.result === "success"){
          that.setState({user: response.user})
        }
      }
    })
  }

  getSuggestedUsers(){
    const that = this;
    $.ajax({
      url: "getOtherUsers",
      data: {
        userId: this.state.id
      },
      success: function(response){
        console.log(response)
        if(response.result === "success"){
          that.setState({suggestedUsers: response.otherUsers})
        }
      }
    })
  }

  handleSidebarChange(e,newValue){
    let pageText = "Home";
    switch(newValue){
      case 0:
        pageText = "Home";
        break;
      case 1:
        pageText = "Profile";
        break;
      case 2:
        pageText = "Friends";
        break;
      case 3:
        pageText = "Messages";
        break;
      case 4:
        pageText = "Notifications";
        break;
      default:
        pageText = "Home";
        break;
    }
    this.setState({currTabpanel: newValue, mainTitle:pageText, isSuggestedTab: false });
  }

  handleBottomnavChange(e,newValue){
    let pageText = e.target;
    console.log(pageText);
    this.setState({currTabpanel: newValue});
  }

  logout(){
     $.ajax({
      url:"logout",
      type:"GET"
    })
    localStorage.clear();
  }

  handleOpenAccountMenu(e){
    this.setState({accountMenuAnchorEl: e.currenTarget})
  }

  getFriendships(id){
    const that = this;
    let userId = 0;

    if(id){
      userId = id;
    }else{
      userId = this.state.id;
    }

    $.ajax({
      url: "getFriendRequests",
      data: {
        userId: userId
      },
      success: function(response){
        console.log("called? " + userId);
        that.setState({requestsCount: response.requestsCount})
       
      }
    })
  }

  handleSendFriendRequest(friendId){
    const that = this;
    $.ajax({
      url: "sendFriendRequest",
      data:{
        requesterId: this.state.id,
        friendId: friendId
      },
      success: function(response){
        if(response.result === "success"){
          that.getSuggestedUsers();
        }
      }
    })
  }


  render(){
    const { classes } = this.props;
    return(
      <div className="bg-white">
        <Grid container style={{height:"100vh"}}>
          <Grid item xs={12} sm={3} md={3} className="d-none d-md-block">
            <div className="profile-bar border-right h-100 px-2 px-lg-5 pt-2">
              <Grid className="h-100 align-content-between" container spacing={1}>
                <Grid item xs={12}>
                  <Tabs
                    orientation="vertical"
                    className={classes.sidebarTab}
                    value={this.state.currTabpanel}
                    onChange={this.handleSidebarChange.bind(this)}
                  >
                    <Tab value={0} label={<div><PorestLogo style={{height:"30px", width:"30px",marginLeft:"3px"}}/></div>} />
                    <Tab value={0} label={<div className="d-flex align-items-center">{muiIcon('homeIcon')} Home</div>} />
                    <Tab value={1} label={<div className="d-flex align-items-center">{muiIcon('personIcon')} Profile</div>} />
                    <Tab value={2} label={<div className="d-flex align-items-center">{muiIcon('friendsIcon')} Friends</div>} />
                    <Tab value={3} label={<div className="d-flex align-items-center">{muiIcon('mailIcon')} Messages</div>} />
                    <Tab value={4} label={<div className="d-flex align-items-center">{muiIcon('notifIcon')} Notifications </div>} />
                  </Tabs>

                  <button className="sidebar-post-btn badge-pill mt-2 py-2 w-100">Post</button>


                </Grid>
                <Grid item xs={12}>
                  <button onClick={(e)=>{this.setState({accountMenuAnchorEl: e.target})}} className="sidebar-profile-badge">
                    
                    <div className="d-flex">
                      <Avatar className="mr-2"></Avatar>
                      <div className="text-left">
                        <Typography variant="subtitle2" color="inherit" style={{fontWeight:"bolder"}}>
                          {this.state.user.firstName}
                        </Typography>
                        <Typography variant="subtitle2" style={{color:"#7d7d7d"}}>
                          {this.state.user.email}
                        </Typography>
                      </div>
                    </div>
                    {muiIcon('moreVertical')}  
                  </button>
                  
                  <Menu
                    anchorEl={this.state.accountMenuAnchorEl}
                    keepMounted
                    open={Boolean(this.state.accountMenuAnchorEl)}
                    onClose={()=>{this.setState({accountMenuAnchorEl: null})}}
                  >
                    <MenuItem><Link to="/login" onClick={this.logout.bind(this)}>Logout</Link></MenuItem>
                  </Menu>
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={6} style={{maxHeight:"100vh",overflowY:"auto",backgroundColor:"#fff"}}>
            <AppBar className={classes.appBar} position="sticky" color="default">
              <Toolbar>
                <Typography variant="h6">
                  <b>{this.state.mainTitle}</b>
                </Typography>
              </Toolbar>
            </AppBar>

            <TabPanel value={this.state.currTabpanel} index={0}>
              <HomeTab userId={this.state.id}/>
            </TabPanel>
            <TabPanel value={this.state.currTabpanel} index={1}>
              PROFILE
            </TabPanel>
            <TabPanel value={this.state.currTabpanel} index={2}>
              <FriendsTab userId={this.state.id} isSuggested={this.state.isSuggestedTab} />
            </TabPanel>
            <TabPanel value={this.state.currTabpanel} index={3}>
              MESSAGES CONTENT
            </TabPanel>
            <TabPanel value={this.state.currTabpanel} index={4}>
              <NotificationsTab userId={this.state.id} resetNotifBadge={this.getFriendships}/>
            </TabPanel>
          </Grid>

          <Grid item xs={12} sm={3} md={3} className="d-none d-lg-block">
            <div className="connections-bar border-left h-100 pt-2 px-3 position-relative">
              <div className="search-bar border">
                {muiIcon('searchIcon')}
                <input className="ml-2" type="text" placeholder="Search Porest"/>
              </div>

              <div className="explore-people-tab">
                <div className="p-3 font-weight-bold border-bottom">Suggested People</div>
                <List>
                  {this.state.suggestedUsers.map(item =>{
                    if(item.friendship === "not friends"){
                      return <ListItem button className={classes.listItem} key={item.key}>
                        <ListItemAvatar>
                          <Avatar></Avatar>
                        </ListItemAvatar>
                        <div className="d-flex justify-content-between w-100">
                          <div>
                            <Typography variant="subtitle2" color="inherit" style={{fontWeight:"bolder"}}>
                              {item.user.firstName} {item.user.lastName}
                            </Typography>
                            <Typography variant="subtitle2" style={{color:"#7d7d7d"}}>
                              {item.user.email}
                            </Typography>
                          </div>
                        </div>
                      </ListItem>
                      }
                  })}
                </List>
                 <div className="border-top p-3"><Link onClick={()=>{
                   this.setState({currTabpanel: 2, mainTitle:"Friends", isSuggestedTab:true });
                 }}>Show More</Link></div>
              </div>

              <div className="position-absolute p-3" style={{bottom:0,fontSize:".8rem"}}>
                <Grid container spacing={1}>
                  <Grid item><Link>Terms of Service</Link></Grid>
                  <Grid item><Link>Privacy Policy</Link></Grid>
                  <Grid item><Link>Cookie Policy</Link></Grid>
                  <Grid item><Link>Ads info</Link></Grid>
                  <Grid item><Link>More info</Link></Grid>
                  <Grid item><Link>© {this.state.currYear} Porest, Inc.</Link></Grid>
                </Grid>
              </div>
            </div>

           
          </Grid>
        </Grid>


            <BottomNavigation value={this.state.currTabpanel} className={classes.bottomNav} onChange={this.handleSidebarChange.bind(this)}>
              <BottomNavigationAction label="Home" value={0} icon={muiIcon('homeIcon')} />
              <BottomNavigationAction label="Profile" value={1} icon={muiIcon('personIcon')} />
              {/* <BottomNavigationAction label="Friends" value={2} icon={muiIcon('friendsIcon')} /> */}
              <BottomNavigationAction label="Messages" value={3} icon={muiIcon('mailIcon')} />
              <BottomNavigationAction label="Notifications" value={4} icon={muiIcon('notifIcon')} />
             
            </BottomNavigation>
      </div>
    )
  }
}

export default withStyles(style)(Home);