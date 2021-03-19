import React from 'react';
import $ from 'jquery';
import { List, ListItem, ListItemAvatar, Avatar, Typography, Snackbar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';


const style = theme => ({
  listItem: {
    padding: "20px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #dee2e6",
    '& .MuiListItem-root': {
      alignItems: "flex-start"
    }
  }
})


class NotificationsTab extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      userId: this.props.userId,
      friendRequestsList:[],
      haveRequests: false,
      snackBarSuccess: false,
      snackBarMessage:""

    }
  }

  componentDidMount(){
    this.getFriendRequests();
  }

  getFriendRequests(){
    const that = this;
    $.ajax({
      url: "getFriendRequests",
      data: {
        userId: this.state.userId
      },
      success: function(response){
 
        let haveRequests = false;

        if(response.requestsCount > 0){
          haveRequests = true;
        }

        that.setState({friendRequestsList: response.requests, haveRequests: haveRequests})
        
      }
    })
  }

  handleAcceptRequest(requesterId){
    const that = this;
    $.ajax({
      url: "acceptFriendRequest",
      data: {
        requesterId: requesterId,
        friendId: this.state.userId
      },
      success: function(response){
        if(response.result === "success"){
          that.setState({snackBarSuccess: true, snackBarMessage:"Friend Request Accepted!"})
          that.getFriendRequests();
          that.props.resetNotifBadge(that.state.userId);
        }
      }
    })
  }


  handleRejectRequest(friendshipId){
    const that = this;
    $.ajax({
      url: "deleteFriendship",
      data: {
        id: friendshipId
      },
      success: function(response){
        if(response.result === "success"){
          that.getFriendRequests();
          that.props.resetNotifBadge(that.state.userId);
          that.setState({snackBarSuccess: true, snackBarMessage:"Unfriended succesfully."});
        }
      }
    })
  }

  render(){
    const { classes } = this.props;
    return(
      <div>
      {this.state.haveRequests ?
        <div> 
        <div className="bg-white font-weight-bold border-bottom py-1 pl-3">
            <span className="ml-2">Friend Requests</span>
        </div>
        <List className="p-0">
          {this.state.friendRequestsList.map(item =>{
              return <ListItem className={classes.listItem} key={item.key}>
                <ListItemAvatar>
                  <Avatar></Avatar>
                </ListItemAvatar>
                <div className="d-flex justify-content-between w-100">
                  <div>
                    <Typography variant="subtitle2" color="inherit" style={{fontWeight:"bolder"}}>
                      {item.requester.firstName} {item.requester.lastName}
                    </Typography>
                    <Typography variant="subtitle2" style={{color:"#7d7d7d"}}>
                      {item.requester.email}
                    </Typography>
                  </div>
                  <div>
                    <button className="badge-pill outline-button p-2" 
                      onClick={()=>{this.handleAcceptRequest(item.requester.id)}}>Accept</button>
                    <button className="badge-pill outline-button p-2 ml-2" 
                      onClick={()=>{this.handleRejectRequest(item.friendshipId)}}>Reject</button>
                  </div>
                </div>
              </ListItem>
            })}
        </List></div> : <div className="p-4">Your notifications are clear.</div>}

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

export default withStyles(style) (NotificationsTab);