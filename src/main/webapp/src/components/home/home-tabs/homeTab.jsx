import React from 'react';
import $ from 'jquery';
import { Popover, Button, Avatar, IconButton, Snackbar } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import MuiAlert from '@material-ui/lab/Alert';
import { muiIcon } from '../../../js/icons';
import { withStyles } from '@material-ui/core/styles';
import autosize from "autosize";
import Picker from 'emoji-picker-react';
import Posts from '../../common/Posts';

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
      previewPostImage: "",
      postUser: null,
      emojisAnchorEl:null,
      refreshPosts: false
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
          that.setState({snackBarMessage: "Posted successfully!", snackBarSuccess: true, postContent: "", refreshPosts: !that.state.refreshPosts})
          that.cancelImageUpload();
        }
      }
    })
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

  handleAddEmoji(e, emoji){
    let content = this.state.postContent + emoji.emoji;
    this.setState({postContent: content})
    this.textarea.value += emoji.emoji;
  }

  render(){
    const { classes } = this.props;
    return(
      <div style={{backgroundColor:"#dee2e6",height:"100%"}}>
        <div className="post-box border-bottom p-2 pl-3 mb-3 bg-white">
          <form id="postForm" className="d-flex" ref={(el) => this.postForm = el} onSubmit={this.handleSubmitPost.bind(this)} >
            <Avatar src={this.props.profilePath} style={{width:"50px",height:"50px"}}></Avatar>
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

        <Posts userId={this.state.userId} restrictPost="all" refresh={this.state.refreshPosts} />

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