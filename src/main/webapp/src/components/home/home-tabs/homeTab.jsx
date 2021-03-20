import React from 'react';
import $ from 'jquery';
import { Button, Avatar, CardActions, Card, CardHeader, IconButton, CardContent, Typography, Snackbar, Collapse, TextareaAutosize,List,ListItem } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
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
      padding: '7px',
    }
  },
  commentIcon : {
    marginLeft: "20%",
    '& button:hover': {
      backgroundColor: "rgb(75 126 255 / 22%)",
      color: "blue"
    },
    '& .MuiIconButton-root':{
      padding: '7px',
    }
  },
  shareIcon : {
    marginLeft: "20%",
    '& button:hover': {
      backgroundColor: "rgb(21 255 0 / 29%)",
      color: "green"
    },
    '& .MuiIconButton-root':{
      padding: '7px',
    }
  },
  userPostsGroup: {
    // '& .MuiCardActions-spacing > :not(:first-child)' : {
    //   marginleft: "20%"
    // },
    paddingLeft: 0,
    '& span': {
      fontSize: ".8rem"
    }
  },
  postImagePreview: {
    '& .MuiSvgIcon-root':{
      fontSize:"2.5rem",
      color:"#fff"
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
      postCommentId: 0,
      previewPostImage: ""
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
    let formData = new FormData();
    formData.append("userId", this.state.userId);
    formData.append("image", this.fileUpload.files[0]);
    formData.append("content", this.state.postContent);
    
    $.ajax({
      type: "POST",
      url: "createPost",
      data: formData,
      processData: false,
      contentType: false,
      success : function(response){
        if(response.result === "success"){
          that.postForm.reset();
          autosize(that.textarea);
          that.getPosts();
          that.setState({snackBarMessage: "Posted successfully!", snackBarSuccess: true, postContent: ""})
          that.cancelImageUpload();
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

  handlePreviewPostImage(e){
    e.preventDefault();
    let file = e.target.files[0];
    let reader = new FileReader();
    if (e.target.files.length === 0) {
      return;
    }

    reader.onloadend = (e) => {
      this.setState({
        previewPostImage: [reader.result]
      });
    }

    reader.readAsDataURL(file);
  }

  cancelImageUpload(){
    this.fileUpload.value = null;
    this.setState({previewPostImage: null});
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
              <div className="post-img-preview position-relative" 
              style={{display: this.state.previewPostImage ? "block" : "none"}}>
                <IconButton 
                  className={classes.postImagePreview}
                  style={{
                    position:"absolute",
                    right:"0",
                    padding:"20px"}}
                    onClick={this.cancelImageUpload.bind(this)}>
                  <HighlightOffIcon/>
                </IconButton>
                <img className="my-2" src={this.state.previewPostImage} alt="" style={{width:"100%",borderRadius:"5%"}}/>
              </div>
              
              <div className="d-flex justify-content-between">
                <div className={classes.postButtonGroup}>
                  <input id="uploadPostImage" type="file" 
                    onChange={this.handlePreviewPostImage.bind(this)} 
                    ref={(fileUpload) => {
                      this.fileUpload = fileUpload;
                    }} 
                    style={{display:"none"}} 
                  />
                  <IconButton onClick={() => this.fileUpload.click()}>
                    {muiIcon("imageIcon")}
                  </IconButton>
                  <IconButton>{muiIcon("gifIcon")}</IconButton>
                  <IconButton>{muiIcon("pollIcon")}</IconButton>
                  <IconButton>{muiIcon("emojiIcon")}</IconButton>
                  <IconButton>{muiIcon("scheduleIcon")}</IconButton>
                </div>
                <div>
                  <button className="sidebar-post-btn badge-pill py-2 px-4 float-right" style={{fontSize:"1rem !important"}}
                  disabled={this.state.postContent || this.state.previewPostImage ? false : true}>Post</button>
                </div>
              </div>
              
            </div>
            
          </form>
          
        </div>

        {this.state.posts.map( posts => {
          return <div key={posts.key} className="border-bottom bg-white">
            <div className="d-flex w-100">
              <div className="d-flex justify-content-center pt-3 pl-3 pr-2">
                <Avatar color="primary" aria-label="recipe">{posts.firstName.substring(0,1)}</Avatar>
              </div>
              <div className="w-100 pt-3 ml-2">
                <CardHeader
                  className="p-0"
                  disableTypography
                  action={
                    <IconButton className="p-0 mr-3" aria-label="settings">
                      {muiIcon('moreVertical')}
                    </IconButton>
                  }
                  title={<div><b>{posts.firstName} {posts.lastName}</b><span className="ml-1 ash-text">@name_here <b>·</b> {posts.createdAt}</span></div>}
                />
                <CardContent className="p-0 pr-5 mt-1">
                  <Typography className="mb-2" variant="body2" color="inherit" component="p">
                    {posts.content}
                  </Typography>
                  {posts.imagePath != null && 
                    <div>
                      <img src={"../../../../public/media/POSTS/" + posts.userId + "/" + posts.imagePath} style={{width:"100%",borderRadius:"5%"}}/>  
                    </div>}
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
              </div>
            </div>
            <Collapse className="border-top" in={posts.id == this.state.postCommentId}>
              <div className="comment-box">
                <Avatar/>
                <TextareaAutosize placeholder="Write comment..." />
                <button className="comments-button p-2 rounded">Comment</button>
              </div>
              <div className="comment-section">
                <List>
                  <ListItem>
                    <CardHeader className="py-0 px-2 w-100"
                      avatar={
                        <Avatar color="primary" aria-label="recipe">
                        </Avatar>
                      }
                      action={
                        <IconButton aria-label="settings">
                          {muiIcon('moreVertical')}
                        </IconButton>
                      }
                      title={<div><b>{posts.firstName} {posts.lastName}</b><span className="ml-2 text-mute">Yo wtf is this shit.</span></div>}
                    />
                  </ListItem>
                  <ListItem>
                    <CardHeader className="py-0 px-2 w-100"
                      avatar={
                        <Avatar color="primary" aria-label="recipe">
                        </Avatar>
                      }
                      action={
                        <IconButton aria-label="settings">
                          {muiIcon('moreVertical')}
                        </IconButton>
                      }
                      title={<div><b>Jayson De Los Reyes</b><span className="ml-2 text-mute">Multiple people like posts is working nice</span></div>}
                    />
                  </ListItem>
                </List>
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