import React from 'react';
import $ from 'jquery';
import { Button, Avatar, CardActions, CardHeader, IconButton, CardContent, Typography, Snackbar, Collapse, TextareaAutosize } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { muiIcon } from '../../../js/icons';
import { withStyles } from '@material-ui/core/styles';
import autosize from "autosize";

const style = theme => ({
  postButtonGroup: {
    '& .MuiIconButton-root': {
      padding: "5px"
    },
    '& .MuiSvgIcon-root': {
      fontSize: "1.7rem",
      color: "#0bbd47"
    }
  },
  heartIcon : {
    '& button:hover': {
      backgroundColor: "rgb(255 97 97 / 22%)",
      color: "red"
    },
    '& .MuiIconButton-root':{
      padding: '7px'
    }
  },
  commentIcon : {
    '& button:hover': {
      backgroundColor: "rgb(75 126 255 / 22%)",
      color: "blue"
    },
    '& .MuiIconButton-root':{
      padding: '7px'
    }
  },
  shareIcon : {
    '& button:hover': {
      backgroundColor: "rgb(21 255 0 / 29%)",
      color: "green"
    },
    '& .MuiIconButton-root':{
      padding: '7px'
    }
  },
  userPostsGroup: {
    '& .MuiCardActions-spacing > :not(:first-child)' : {
      marginLeft: "20px"
    }
  }
  
})

class HomeTab extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      userId: this.props.userId,
      posts: [],
      postContent:"",
      snackBarSuccess: false,
      snackBarMessage: "",
      postCommentId: 0
    }
  }

  componentDidMount(){
    this.textarea.focus();
    autosize(this.textarea);
    this.getPosts();
  }

  getPosts(){
    const that = this;
    $.ajax({
      url: "getPosts",
      data: {
        userId: this.state.userId
      },
      success: function(response){
        if(response.result === "success"){
          that.setState({posts: response.posts})
        }
      }
    })
  }

  handleWritePost(e){
    this.setState({postContent: e.target.value})
  }

  handleSubmitPost(e){
    e.preventDefault();
    const that = this;
    $.ajax({
      url: "createPost",
      data: {
        userId: this.state.userId,
        content: this.state.postContent
      },
      success : function(response){
        if(response.result === "success"){
          that.postForm.reset();
          autosize(that.textarea);
          that.getPosts();
          that.setState({snackBarMessage: "Posted successfully!", snackBarSuccess: true, postContent: ""})
        }
      }
    })
  }

  handleLikePost(id){
    const that = this;
    $.ajax({
      url: "likePost",
      data: {
        postId: id,
        userId: this.state.userId
      },
      success: function(response){
        that.getPosts();
      }
    })
  }

  handleOpenComments(id){
    if(this.state.postCommentId == id){
      this.setState({postCommentId: ""});
    }else{
      this.setState({postCommentId: id});
    }
   
  }

  render(){
    const { classes } = this.props;

    return(
      <div style={{backgroundColor:"#dee2e6",height:"100%"}}>
        <div className="post-box border-bottom p-2 pl-3 mb-3 bg-white">
          <form id="postForm" className="d-flex" ref={(el) => this.postForm = el} onSubmit={this.handleSubmitPost.bind(this)} >
            <Avatar style={{width:"50px",height:"50px"}}></Avatar>
            <div className="w-100">
              <textarea maxlength={255} ref={c=>this.textarea=c} onChange={this.handleWritePost.bind(this)} className={("post-input mt-2 px-3 ") + (this.state.postContent && "border-bottom")} placeholder="Share your thoughts."></textarea>
              <div className="d-flex justify-content-between">
                <div className={classes.postButtonGroup}>
                  <IconButton>{muiIcon("imageIcon")}</IconButton>
                  <IconButton>{muiIcon("gifIcon")}</IconButton>
                  <IconButton>{muiIcon("pollIcon")}</IconButton>
                  <IconButton>{muiIcon("emojiIcon")}</IconButton>
                  <IconButton>{muiIcon("scheduleIcon")}</IconButton>
                </div>
                <div>
                  <button className="sidebar-post-btn badge-pill py-2 px-4 float-right" style={{fontSize:"1rem !important"}}
                  disabled={this.state.postContent ? false : true}>Post</button>
                </div>
              </div>
              
            </div>
            
          </form>
          
        </div>

        {this.state.posts.map( posts => {
          return <div key={posts.key} className="border-bottom bg-white">
            <CardHeader
              avatar={
                <Avatar aria-label="recipe">
                </Avatar>
              }
              action={
                <IconButton aria-label="settings">
                  {muiIcon('moreVertical')}
                </IconButton>
              }
              title={<div><b>{posts.firstName} {posts.lastName}</b><span className="ml-2 text-mute">{posts.email}</span></div>}
              subheader={posts.createdAt}
            />
            <CardContent>
              <Typography variant="body2" color="inherit" component="p">
                {posts.content}
              </Typography>
            </CardContent>
            <CardActions className={classes.userPostsGroup}>
              <div className={classes.heartIcon}>
                <IconButton onClick={()=>{this.handleLikePost(posts.id)}}>
                  {posts.isLiked ? muiIcon('filledHeartIcon') : muiIcon('heartIcon') }
                </IconButton>
                <span>{posts.likes}</span>
              </div>
              <div className={classes.commentIcon}>
                <IconButton onClick={()=>{this.handleOpenComments(posts.id)}}>
                  {muiIcon('commentIcon')}
                </IconButton>
                <span>560</span>
              </div>
              <div className={classes.shareIcon}>
                <IconButton>
                  {muiIcon('shareIcon')}
                </IconButton>
                <span>390</span>
              </div>
            </CardActions>

            <Collapse className="border-top" in={posts.id == this.state.postCommentId}>
              <div className="comment-box">
                <Avatar/>
                <TextareaAutosize placeholder="Write comment..." />
                <Button variant="contained" size="small" color="primary">Comment</Button>
              </div>
              
            </Collapse>
          </div>
          })}

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

export default withStyles(style) (HomeTab);