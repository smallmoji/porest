import React from 'react';
import $ from 'jquery';
import { Link, IconButton, List, ListItem, ListItemAvatar, Avatar, Snackbar, Typography } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { muiIcon } from '../../../js/icons';
import { withStyles } from '@material-ui/core/styles';

const style = theme => ({
  backButton: {
    '& .MuiIconButton-root': {
      padding: "5px"
    },
    '& .MuiSvgIcon-root': {
      fontSize: "1.7rem",
      color: "#0bbd47"
    }
  },
  listItem: {
    backgroundColor: "#fff",
    borderBottom: "1px solid #dee2e6",
    '& .MuiListItem-root': {
      alignItems: "flex-start"
    }
  }
})

class FriendsTab extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      userId : this.props.userId,
      suggestedTab: this.props.isSuggested,
      haveFriends: false,
      haveSentRequest: false,
      friendRequestList: {},
      suggestedUsers: [],
      snackBarSuccess: false,
      snackBarMessage: ""
    }
  }

  componentDidMount(){
    this.getSuggestedUsers();
  }

  getSuggestedUsers(){
    const that = this;
    $.ajax({
      url: "getOtherUsers",
      data: {
        userId: this.state.userId
      },
      success: function(response){
        if(response.result === "success"){
          let haveFriends = false;
          let haveSentRequest  = false;
          for(let item of response.otherUsers){
            if(item.friendship === "friends"){
              haveFriends = true;
            }

            if(item.friendship === "sent request"){
              haveSentRequest = true;
            }
          }
          that.setState({suggestedUsers: response.otherUsers, haveFriends: haveFriends, haveSentRequest: haveSentRequest})
        }
      }
    })
  }

  handleSendFriendRequest(friendId){
    const that = this;
    $.ajax({
      url: "sendFriendRequest",
      data:{
        requesterId: this.state.userId,
        friendId: friendId
      },
      success: function(response){
        if(response.result === "success"){
          that.getSuggestedUsers();
          that.setState({snackBarSuccess: true, snackBarMessage:"Friend Request sent."})
          that.props.resetSuggested();
        }
      }
    })
  }

  handleUnfriend(friendshipId){
    const that = this;
    $.ajax({
      url: "deleteFriendship",
      data: {
        id: friendshipId
      },
      success: function(response){
        if(response.result === "success"){
          that.getSuggestedUsers();
          that.props.resetSuggested();
          that.setState({snackBarSuccess: true, snackBarMessage:"Unfriended succesfully."})
        }
      }
    })
  }

  render(){
    const { classes } = this.props;

    if(this.state.suggestedTab){
      return(
        <div className="bg-white">
          <div className="font-weight-bold border-bottom p-1">
            <IconButton className={classes.backButton} onClick={() => {this.setState({suggestedTab: false})}}>
              {muiIcon("arrowBackIcon")}
            </IconButton>
            
            <span className="ml-2">People you may know</span>
          </div>
          <List className="p-0">
            {this.state.suggestedUsers.map(item =>{
              if(item.friendship === "not friends"){
                return <ListItem className={classes.listItem} key={item.key}>
                  <ListItemAvatar>
                     <Avatar src={"../../../../public/media/PROFILE/" + item.user.id + "/" + 
                      item.profileImagePath}>{item.user.firstName.substring(0,1)}</Avatar>
                  </ListItemAvatar>
                  <div className="d-flex justify-content-between w-100">
                    <div>
                      <Typography variant="subtitle2" color="inherit" style={{fontWeight:"bolder"}}>
                        {item.user.firstName} {item.user.lastName}
                      </Typography>
                      <Typography variant="subtitle2" style={{color:"#7d7d7d"}}>
                        @{item.displayName}
                      </Typography>
                      <Typography variant="subtitle2" color="inherit">
                        {item.about ? item.about : "This person didn't bother to write something about themself."}
                      </Typography>
                    </div>
                    <div>
                      <button className="badge-pill outline-button p-2" onClick={() => {this.handleSendFriendRequest(item.user.id)}}>Add Friend</button>
                    </div>
                  </div>
                </ListItem>
                }

                return null;
            })}
          </List>

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
    return(
      <div>
        {this.state.haveFriends ? 
          <div>
            <List className="p-0">
              {this.state.suggestedUsers.map(item =>{
                if(item.friendship === "friends"){
                  return <ListItem className={classes.listItem} key={item.key}>
                    <ListItemAvatar>
                      <Avatar src={"../../../../public/media/PROFILE/" + item.user.id + "/" + 
                      item.profileImagePath}>{item.user.firstName.substring(0,1)}</Avatar>
                    </ListItemAvatar>
                    <div className="d-flex justify-content-between w-100">
                      <div>
                        <Typography variant="subtitle2" color="inherit" style={{fontWeight:"bolder"}}>
                          {item.user.firstName} {item.user.lastName}
                        </Typography>
                        <Typography variant="subtitle2" style={{color:"#7d7d7d"}}>
                          @{item.displayName}
                        </Typography>
                      </div>
                      <div>
                        <button className="badge-pill outline-button p-2" onClick={() => {this.handleUnfriend(item.friendshipId)}}>Unfriend</button>
                      </div>
                    </div>
                  </ListItem>
                  }

                  return null;
              })}
            </List>

            <div className="p-4">
              Check out some <Link onClick={() => {this.setState({suggestedTab: true})}} style={{cursor:"pointer"}}>people</Link> and find friends!
            </div>
          </div>
        : 
          <div className="p-4">
            Feels lonely in here. Check out some <Link onClick={() => {this.setState({suggestedTab: true})}} style={{cursor:"pointer"}}>people</Link> and find friends!
          </div>}

          {this.state.haveSentRequest && 
            <div>
              <div className="font-weight-bold border-bottom border-top p-1 mt-3">
                <span className="ml-2">Pending Friend Requests</span>
              </div>
              <List className="p-0">
                {this.state.suggestedUsers.map(item =>{
                  if(item.friendship === "sent request"){
                    return <ListItem className={classes.listItem} key={item.key}>
                      <ListItemAvatar>
                        <Avatar 
                          src={"../../../../public/media/PROFILE/" 
                          + item.user.id + "/" + item.profileImagePath}>{item.user.firstName.substring(0,1)}</Avatar>
                      </ListItemAvatar>
                      <div className="d-flex justify-content-between w-100">
                        <div>
                          <Typography variant="subtitle2" color="inherit" style={{fontWeight:"bolder"}}>
                            {item.user.firstName} {item.user.lastName}
                          </Typography>
                          <Typography variant="subtitle2" style={{color:"#7d7d7d"}}>
                           @{item.displayName}
                          </Typography>
                        </div>
                        <div>
                          <button className="badge-pill outline-button p-2" onClick={() => {this.handleUnfriend(item.friendshipId)}}>Cancel</button>
                        </div>
                      </div>
                    </ListItem>
                    }
                    return null;
                })}
              </List>
            </div>
          }

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

export default withStyles(style) (FriendsTab);