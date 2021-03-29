import React from 'react';
import $ from 'jquery';
import { Popover, Button, Avatar, CardActions, CardHeader, IconButton, CardContent, Typography, Snackbar, Collapse, TextareaAutosize, List, ListItem, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle  } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import MuiAlert from '@material-ui/lab/Alert';
import { muiIcon } from '../../../js/icons';
import { withStyles } from '@material-ui/core/styles';
import autosize from "autosize";
import Picker from 'emoji-picker-react';
import { SignalCellularNullOutlined } from '@material-ui/icons';

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
      previewPostImage: "",
      postMenuAnchorEl: "",
      postToDelete: null,
      postUser: null,
      emojisAnchorEl:null,
      commentInput: "",
      deleteCommentAnchorEl: null,
      commentToDelete: null,
      postToShare: null,
      sharePostInput:""
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
    if(this.state.postCommentId === id){
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

  handleDeletePost(){
    const that = this;

    $.ajax({
      url: "deletePost",
      data: {
        postId: this.state.postToDelete,
      },
      success: function(response){
        that.getPosts();
        that.setState({postToDelete: null, postMenuAnchorEl: null })
      }
    })

  }

  handleDeleteComment(){
    const that = this;

    $.ajax({
      url: "deleteComment",
      data: {
        commentId: this.state.commentToDelete,
      },
      success: function(response){
        that.getPosts();
        that.setState({commentToDelete: null, deleteCommentAnchorEl: null })
      }
    })
  }

  handleAddEmoji(e, emoji){
    let content = this.state.postContent + emoji.emoji;
    this.setState({postContent: content})
    this.textarea.value += emoji.emoji;
  }

  handleAddComment(postId){
    const that = this;

    $.ajax({
      url: "addComment",
      data: {
        postId: postId,
        userId: this.state.userId,
        content: this.state.commentInput
      },
      success: function(){
        that.getPosts();
        document.getElementById("addCommentInput" + postId).value = "";
      }
    })

  }

  handleSharePost(postId){
    const that = this;

    $.ajax({
      url: "sharePost",
      data: {
        postToShareId: postId,
        userId: this.state.userId,
        content: this.state.sharePostInput
      },
      success: function(){
        that.getPosts();
        that.setState({sharePostInput: "", postToshare: null})
      }
    })
  }

  render(){
    const { classes } = this.props;
    return(
      <div style={{backgroundColor:"#dee2e6",height:"100%"}}>
        <div className="post-box border-bottom p-2 pl-3 mb-3 bg-white">
          <form id="postForm" className="d-flex" ref={(el) => this.postForm = el} onSubmit={this.handleSubmitPost.bind(this)} >
            <Avatar style={{width:"50px",height:"50px"}}></Avatar>
            <div className="w-100">
              <textarea 
                maxlength={255} 
                ref={c=>this.textarea=c} 
                onChange={this.handleWritePost.bind(this)} 
                className={("post-input mt-2 px-3 ") + (this.state.postContent && "border-bottom")} 
                placeholder="Share your thoughts.">
              </textarea>
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
                <img className="my-2 w-100 rounded" src={this.state.previewPostImage} alt=""/>
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
                  <IconButton 
                    onClick={(e)=>{this.setState({emojisAnchorEl: e.target})}}
                  >{muiIcon("emojiIcon")}</IconButton>
                  <Popover 
                    anchorEl={this.state.emojisAnchorEl}
                    open={Boolean(this.state.emojisAnchorEl)}
                    onClose={()=>{this.setState({emojisAnchorEl: null})}}
                    anchorOrigin={{
                      vertical: 'center',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                  >
                     <Picker 
                      onEmojiClick={this.handleAddEmoji.bind(this)} 
                      native
                      disableSkinTonePicker />
                  </Popover>

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
          return<div className="bg-white border-bottom" key={posts.key}>
              <div className="d-flex w-100">
                <div className="d-flex justify-content-center pt-3 pl-3 pr-2">
                  <Avatar color="primary" aria-label="recipe">{posts.firstName.substring(0,1)}</Avatar>
                </div>
                <div className="w-100 pt-3 ml-2">
                  <CardHeader
                    className="p-0"
                    disableTypography
                    action={
                      <IconButton 
                        className="p-0 mr-3" 
                        aria-label="settings"
                        onClick={(e)=>{
                          this.setState({postMenuAnchorEl: e.target, postToDelete: posts.id, postUser: posts.userId})
                          }}>
                        {muiIcon('moreVertical')}
                      </IconButton>
                    }
                    title={<div><b>{posts.firstName} {posts.lastName}</b><span className="ml-1 ash-text">@{posts.displayName} <b>·</b> {posts.createdAt}</span> {posts.sharedPost != undefined && <span className="font-italic ml-2">shared a post</span>}</div>}
                  />

                  <CardContent className="p-0 pr-5 mt-1">
                    <Typography className="mb-2" variant="body2" color="inherit" component="p">
                      {posts.content}
                    </Typography>
                    {posts.imagePath != null && 
                      <div>
                        <img className="w-100 rounded" src={"../../../../public/media/POSTS/" + posts.userId + "/" + posts.imagePath} alt=""/>  
                      </div>}

                    {posts.sharedPost != undefined &&
                      <div className="d-flex w-100 border pb-3">
                        <div className="d-flex justify-content-center pt-3 pl-3 pr-2">
                          <Avatar color="primary" aria-label="recipe">{posts.sharedPost.firstName.substring(0,1)}</Avatar>
                        </div>
                        <div className="w-100 pt-3 ml-2">
                          <CardHeader
                            className="p-0"
                            disableTypography
                            title={<div><b>{posts.sharedPost.firstName} {posts.sharedPost.lastName}</b><span className="ml-1 ash-text">@{posts.sharedPost.displayName} <b>·</b> {posts.sharedPost.createdAt}</span></div>}
                          />
                          <CardContent className="p-0 pr-5 mt-1">
                            <Typography className="mb-2" variant="body2" color="inherit" component="p">
                              {posts.sharedPost.content}
                            </Typography>
                            {posts.sharedPost.imagePath != null && 
                              <div>
                                <img className="w-100 rounded" src={"../../../../public/media/POSTS/" + posts.sharedPost.userId + "/" + posts.sharedPost.imagePath} alt=""/>  
                              </div>}
                          </CardContent>
                        </div>
                      </div>
                    }
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
                      <span>{posts.commentCount || 0}</span>
                    </div>
                    <div className={classes.shareIcon}>
                      <IconButton onClick={()=>{this.setState({postToShare: posts.id})}}>
                        {muiIcon('shareIcon')}
                      </IconButton>
                      <span>{posts.shareCount || 0}</span>
                    </div>


                    <Dialog 
                      open={this.state.postToShare === posts.id}
                      onClose={()=>{this.setState({postToShare: null})}}
                      maxWidth="md"
                      >
                      <DialogTitle>Share Post</DialogTitle>
                      <DialogContent>
                      <div className="comment-box">
                        <TextareaAutosize 
                          placeholder="Share your thoughts"
                           onChange={(e) => {this.setState({sharePostInput: e.target.value})}}/>
                      </div>
        
                        <div className="d-flex w-100">
                          <div className="d-flex justify-content-center pt-3 pl-3 pr-2">
                            <Avatar color="primary" aria-label="recipe">{posts.firstName.substring(0,1)}</Avatar>
                          </div>
                          <div className="w-100 pt-3 ml-2">
                            <CardHeader
                              className="p-0"
                              disableTypography
                              title={<div><b>{posts.firstName} {posts.lastName}</b><span className="ml-1 ash-text">@{posts.displayName} <b>·</b> {posts.createdAt}</span></div>}
                            />
                            <CardContent className="p-0 pr-5 mt-1">
                              <Typography className="mb-2" variant="body2" color="inherit" component="p">
                                {posts.content}
                              </Typography>
                              {posts.imagePath != null && 
                                <div>
                                  <img className="w-100 rounded" src={"../../../../public/media/POSTS/" + posts.userId + "/" + posts.imagePath} alt=""/>  
                                </div>}
                            </CardContent>
                          </div>
                        </div>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={()=>{this.handleSharePost(posts.id)}}>Share</Button>
                      </DialogActions>
                    </Dialog>


                  </CardActions>
                </div>
              </div>
              <Collapse className="border-top" in={posts.id === this.state.postCommentId}>
                <div className="comment-box">
                  <Avatar/>
                  <TextareaAutosize 
                    id={"addCommentInput" + posts.id}
                    placeholder="Write comment..."
                    onChange={(e) => {this.setState({commentInput: e.target.value})}}
                    />
                  <button 
                    className="comments-button p-2 rounded"
                    onClick={() =>{this.handleAddComment(posts.id)}}
                    >Comment
                  </button>
                </div>
                <div className="comment-section">
                  <List>
                    {posts.commentCount > 0 && posts.comments.map(comment => {
                      return <ListItem>
                      <CardHeader className="py-0 px-2 w-100"
                        avatar={
                          <Avatar color="primary" aria-label="recipe">
                          </Avatar>
                        }
                        action={
                          <IconButton 
                          
                          onClick={(e)=>{
                            this.setState({deleteCommentAnchorEl: e.target, commentToDelete: comment.id, postUser: posts.userId})
                          }}>
                            {muiIcon('moreVertical')}
                          </IconButton>
                        }
                        title={<div><b>{comment.firstName} {comment.lastName}</b><span className="ml-2 text-mute">{comment.content}</span></div>}
                      />
                    </ListItem>
                    })}
                  </List>
                </div>
              </Collapse>
            </div>
          })}
          {this.state.userId === this.state.postUser &&
            <Menu
              anchorEl={this.state.postMenuAnchorEl}
              open={Boolean(this.state.postMenuAnchorEl)}
              onClose={()=>{this.setState({postMenuAnchorEl: null, postToDelete: null})}}
            >
              <MenuItem>
                <Button
                  size="small"
                  color="secondary"
                  startIcon={muiIcon("deleteIcon")}
                  onClick={this.handleDeletePost.bind(this)}
                >
                  Delete
                </Button>
              </MenuItem>
            </Menu>
          }

          {this.state.userId === this.state.postUser && 
            <Popover 
              anchorEl={this.state.deleteCommentAnchorEl}
              open={Boolean(this.state.deleteCommentAnchorEl)}
              onClose={()=>{this.setState({deleteCommentAnchorEl: null})}}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
                <Button
                  size="small"
                  color="secondary"
                  startIcon={muiIcon("deleteIcon")}
                  onClick={this.handleDeleteComment.bind(this)}
                >
                  Delete
                </Button>
            </Popover>
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

export default withStyles(style) (HomeTab);