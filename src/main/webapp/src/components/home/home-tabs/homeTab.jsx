import React from 'react';
import $ from 'jquery';
import { Avatar, CardActions, CardHeader, IconButton, CardContent, Typography } from '@material-ui/core'
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
      postContent:""
    }
  }

  componentDidMount(){
    this.textarea.focus();
    autosize(this.textarea);
  }

  handleWritePost(e){
    this.setState({postContent: e.target.value})
  }

  render(){
    const { classes } = this.props;

    return(
      <div style={{backgroundColor:"#dee2e6",height:"100%"}}>
        <div className="post-box border-bottom p-2 pl-3 mb-3 bg-white">
          <form className="d-flex">
            <Avatar style={{width:"50px",height:"50px"}}></Avatar>
            <div className="w-100">
              <textarea ref={c=>this.textarea=c} onChange={this.handleWritePost.bind(this)} className={("post-input mt-2 px-3 ") + (this.state.postContent && "border-bottom")} placeholder="Share your thoughts."></textarea>
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

        <div className="border-top border-bottom bg-white">
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
            title={<div><b>Jayson De Los Reyes</b><span className="ml-2">jayson@gmail.com</span></div>}
            subheader="January 21, 2021"
          />
          <CardContent>
            <Typography variant="body2" color="inherit" component="p">
              This impressive paella is a perfect party dish and a fun meal to cook together with your
              guests. Add 1 cup of frozen peas along with the mussels, if you like.
            </Typography>
          </CardContent>
          <CardActions className={classes.userPostsGroup}>
            <div className={classes.heartIcon}>
              <IconButton>
                {muiIcon('heartIcon')}
              </IconButton>
              <span>2.5k</span>
            </div>
            <div className={classes.commentIcon}>
              <IconButton>
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
        <div className="border-bottom bg-white">
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
            title={<div><b>Joshua Villas</b><span className="ml-2">weebgod@gmail.com</span></div>}
            subheader="December 23, 2020"
          />
          <CardContent>
            <Typography variant="body2" color="inherit" component="p">
             The short story is a crafted form in its own right. Short stories make use of plot, resonance, and other dynamic components as in a novel, but typically to a lesser degree. While the short story is largely distinct from the novel or novella/short novel, authors generally draw from a common pool of literary techniques.

              Determining what exactly separates a short story from longer fictional formats is problematic. A  classic definition of a short story is that one should be able to read it in one sitting, a point most notably made in Edgar Allan Poe's essay "The Philosophy of Composition" (1846).[1] According to William Faulkner, a short story is character driven and a writer's job is to "...trot along behind him with a paper and pencil trying to keep up long enough to put down what he says and does.”[2]
            </Typography>
          </CardContent>
          <CardActions className={classes.userPostsGroup}>
            <div className={classes.heartIcon}>
              <IconButton>
                {muiIcon('heartIcon')}
              </IconButton>
              <span>1.5k</span>
            </div>
            <div className={classes.commentIcon}>
              <IconButton>
                {muiIcon('commentIcon')}
              </IconButton>
              <span>260</span>
            </div>
            <div className={classes.shareIcon}>
              <IconButton>
                {muiIcon('shareIcon')}
              </IconButton>
              <span>90</span>
            </div>
          </CardActions>
        </div>
      </div>
    )
  }
}

export default withStyles(style) (HomeTab);