import React from 'react';
import $ from 'jquery';
import { withStyles } from '@material-ui/core/styles';
import { Popover, Button, Avatar, CardActions, CardHeader, IconButton, CardContent, Typography, Collapse, TextareaAutosize, List, ListItem, Dialog, DialogActions, DialogContent, DialogTitle  } from '@material-ui/core';
import { muiIcon } from '../../js/icons';

const style = theme => ({
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
    paddingLeft: 0,
    '& span': {
      fontSize: ".8rem"
    }
  }
})

class Posts extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      userId: this.props.userId,
      posts: [],
    }
  }

  componentDidMount(){
    this.getPosts();
  }

  componentWillReceiveProps(props){
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

  restrictPost(restriction, post){
    switch(restriction){
      case 'likes':
        return post.isLiked;
      case 'userPosts':
        return this.state.userId === post.userId
      case 'all':
        return true
      default:
        return false
    }
  }

  render(){
    const { classes } = this.props;
    return(
      <div>
        {this.state.posts.map( posts => {
          if(this.restrictPost(this.props.restrictPost, posts)){
          return<div className="bg-white border-bottom" key={posts.key}>
              <div className="d-flex w-100">
                <div className="d-flex justify-content-center pt-3 pl-3 pr-2">
                  <Avatar 
                    src={"../../../public/media/PROFILE/" + posts.userId + "/" + 
                      posts.profileImagepath} color="primary" aria-label="recipe">{posts.firstName.substring(0,1)}</Avatar>
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
                    title={<div><b>{posts.firstName} {posts.lastName}</b><span className="ml-1 ash-text">@{posts.displayName} <b>·</b> {posts.createdAt}</span> {posts.sharedPost !== undefined && <span className="font-italic ml-2">shared a post</span>}</div>}
                  />

                  <CardContent className="p-0 pr-5 mt-1">
                    <Typography className="mb-2" variant="body2" color="inherit" component="p">
                      {posts.content}
                    </Typography>
                    {posts.imagePath !== null && 
                      <div>
                        <img className="w-100 rounded" src={"../../../../public/media/POSTS/" + posts.userId + "/" + posts.imagePath} alt=""/>  
                      </div>}

                    {posts.sharedPost !== undefined &&
                      <div className="d-flex w-100 border pb-3">
                        <div className="d-flex justify-content-center pt-3 pl-3 pr-2">
                          <Avatar 
                      src={"../../../public/media/PROFILE/" + posts.sharedPost.userId + "/" + 
                        posts.sharedPost.profileImagePath} color="primary" aria-label="recipe">{posts.firstName.substring(0,1)}</Avatar>
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
                            {posts.sharedPost.imagePath !== null && 
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
                          <Avatar
                            src={"../../../public/media/PROFILE/" + posts.userId + "/" +
                              posts.profileImagepath} color="primary" aria-label="recipe">{posts.firstName.substring(0, 1)}</Avatar>
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
                              {posts.imagePath !== null && 
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
            } return null;
          })}

          {this.state.userId === this.state.postUser &&
            <Popover
              anchorEl={this.state.postMenuAnchorEl}
              open={Boolean(this.state.postMenuAnchorEl)}
              onClose={()=>{this.setState({postMenuAnchorEl: null, postToDelete: null})}}
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
                onClick={this.handleDeletePost.bind(this)}
              >
                Delete
              </Button>
            </Popover>
          }
      </div>
    )
  }
}

export default withStyles(style) (Posts);