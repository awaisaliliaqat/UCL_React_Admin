import React, { Component, Fragment, useState } from "react";
import { withStyles, createStyles } from '@material-ui/core/styles';
import {Typography, Divider, CircularProgress, Grid,  Avatar, Tooltip, IconButton, 
  FormControl, InputLabel, OutlinedInput, InputAdornment, Card, CardHeader, CardMedia,
  CardContent, CardActions, Collapse } from "@material-ui/core";
import ImageIcon from '@material-ui/icons/Image';
import SpeakerNotesOutlinedIcon from '@material-ui/icons/SpeakerNotesOutlined';
import Button from '@material-ui/core/Button';
import SendOutlinedIcon from '@material-ui/icons/SendOutlined';
import Skeleton from '@material-ui/lab/Skeleton';
import clsx from 'clsx';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

const styles = (theme) => createStyles({
  root: {
    //maxWidth: sizing.width ="100%",
    width:"100%"
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    //backgroundColor: red[500],
    backgroundColor: theme.palette.primary.main,
  },
  skeletonMedia: {
    height: 190,
  },
  commentRoot: {
    //width: '100%',
    padding:"10px 10px",
    //maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper,
  },
  commentInline: {
    display: 'inline',
  },
});

const SubReplyComponent = props => {

  const { classes, subMessageData=[], onFormSubmit, handleOpenSnackbar} = props;

  let messageRepliesArray = subMessageData.messageRepliesArray || [];

  console.log("subRepliesRows", subMessageData);

  const [open, setOpen] = useState(false);
  const [replayMsg, setReplayMsg] = useState("");
  const [replayMsgError, setReplayMsgError] = useState("");

  const handleSetReplayMsg=(e)=>{
    let value = e.target.value;
    setReplayMsg(value);
    setReplayMsgError("");
  }

  const onSubmit=()=>{
    if(replayMsg){
      onFormSubmit(subMessageData.id, replayMsg);
    }else{
      setReplayMsgError("Please type some messsage");
      handleOpenSnackbar(<span>Please type some messsage</span>,"error");
    }
  }

  return (
    <Fragment>
        <Button 
          size="small" 
          color="primary"
          variant="contained"
          onClick={()=>{setOpen(!open)}}
          style={{fontSize:10, padding:0, marginTop:10, fontWeight:500}}
        >
          Reply
        </Button>
        <br/>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <br/>
          <Divider component="li"/>
          <CardActions disableSpacing>
            <Avatar 
              aria-label="recipe" 
              className={classes.avatar}
              style={{
                width:30,
                height:30,
                fontSize:"0.9em"
              }} 
            >
              R
            </Avatar>
            &nbsp;
            &nbsp;
            <FormControl 
              fullWidth 
              className={clsx(classes.margin, classes.textField)} 
              variant="outlined"
              size="small"
              error={replayMsgError}
            >
              <InputLabel htmlFor="outlined-reply">Reply</InputLabel>
              <OutlinedInput
                id="outlined-reply"
                name="replayMsg"
                multiline
                value={replayMsg}
                onChange={(e)=>handleSetReplayMsg(e)}
                endAdornment={
                  <InputAdornment position="end">
                    <Button 
                      color="primary"
                      style={{
                        marginRight:-14,
                        paddingTop: 8,
                        paddingBottom: 8,
                      }}
                      //onClick={()=>onFormSubmit(subMessageData.id, replayMsg)}
                      onClick={()=>onSubmit()}
                    >
                      <SendOutlinedIcon />
                    </Button>
                  </InputAdornment>
                }
                labelWidth={40}
              />
            </FormControl>
            </CardActions>
            <Divider component="li"/>
        </Collapse>
        <br/>
        {messageRepliesArray.map((row)=>
          <Fragment key={row.id+row.replyOn}>
            <ListItem 
              alignItems="flex-start"
              style={{
                backgroundColor:"#f1f1f1",
                borderRadius:5,
                border: "1px solid darkgray",
                padding:"0px 8px 0px 8px",
                marginBottom:5
              }}
            >
              <ListItemAvatar style={{minWidth:40}}>
                <Avatar
                  alt={row.replyBy} 
                  src="/static/images/avatar/1.jpg" 
                  className={classes.avatar}
                  style={{
                    width:30,
                    height:30,
                    fontSize:"0.9em"
                  }} 
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography 
                    component="span"
                    color="primary"
                    style={{
                      fontWeight:600,
                      fontSize:"0.9em"
                    }}
                  >
                    {row.replyBy}
                  </Typography>
                }
                  secondary={
                    <Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.commentInline}
                        color="textPrimary"
                      >
                        {row.message}
                      </Typography>
                      <br/>
                      <span style={{float:"right",fontSize:"0.8em"}}>{row.replyOn}</span>
                      {/* <SubReplyComponent 
                        classes={classes}
                        subRepliesRows={row.messageRepliesArray}
                      /> */}
                    </Fragment>
                  }
                />
              </ListItem>
            </Fragment>
            )}
    </Fragment>
  );
}

class F60FormCardComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      showTableFilter: false,
      showSearchBar: false,
      isDownloadPdf: false,
      applicationStatusId: 1,
      isLoginMenu: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      expanded:true,
      messageData:[],
      topicId:0,
      messageId:0,
      replayMsg:"",
      replayMsgError:""
    };
  }

  getData = async (topicId) => {
    this.setState({isLoading: true});
    let data = new FormData();
    data.append("forumId", topicId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C60CommonAcademicsForumMessagesView`;
    await fetch(url, {
      method: "POST",
      body:data,
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then(
        (json) => {
          if (json.CODE === 1) {
            this.setState({
              messageData: json.DATA[0] || {},
              messageId:json.DATA[0].id
            });
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.props.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("getData", json);
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            //alert('Failed to fetch, Please try again later.');
            this.props.handleOpenSnackbar("Failed to fetch, Please try again later.","error");
            console.log(error);
          }
        }
      );
    this.setState({isLoading: false});
  };

  onSubmit(messageId, messageText){
    if(this.state.replayMsg){
      this.onFormSubmit(messageId, messageText);
    }else{
      this.setState({replayMsgError:"Please type some messsage"});
      this.props.handleOpenSnackbar(<span>Please type some messsage</span>,"error");
    }
  }

  onFormSubmit = async (messageId, messageText) => {
    // if (
    //   !this.isTopicValid() ||
    //   !this.isDescriptionValid() 
    // ) { return; }
    //let myForm = document.getElementById("myForm");
    const data = new FormData();
    data.append("forumId", this.state.topicId);
    data.append("messageId", messageId);
    data.append("message", messageText);
    data.append("replyByFlag", 1);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C60CommonAcademicsForumMessagesSave`;
    await fetch(url, {
      method: "POST",
      body: data,
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then(
        (json) => {
          if (json.CODE === 1) {
            this.props.handleOpenSnackbar(json.USER_MESSAGE, "success");
            this.setState({
              replayMsg:"",
              replayMsgError:""
            });
            this.getData(this.state.topicId);
          } else {
            this.props.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log(json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            console.log(error);
            this.props.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  handleExpandClick = () => {
    this.setState({expanded:!this.state.expanded});
  }

  onHandleChange = (e) => {
    const { name, value } = e.target;
    console.log("value", value)
    const errName = `${name}Error`;
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  componentDidMount() {
    this.setState({topicId:this.props.topicId});
    this.getData(this.props.topicId);
    //setTimeout(()=>{ this.setState({isLoading:false}) },1000);
  }

  render() {
    const { classes } = this.props;
    const { messageData={} } = this.state;
    // console.log("forumId", this.props.forumId);
    return (
      <Fragment>
        {this.state.isLoading?
        <Fragment>
          <Card>
            <CardHeader
              avatar={
                <Skeleton 
                  animation="wave" 
                  variant="circle" 
                  width={40} 
                  height={40} 
                />
              }
              title={
                <Skeleton 
                  animation="wave" 
                  height={10} 
                  width="80%" 
                  style={{ marginBottom: 6 }} 
                /> 
              }
              subheader={
                <Skeleton 
                  animation="wave" 
                  height={10} 
                  width="40%" 
                />}
            />
            <Skeleton 
              animation="wave" 
              variant="rect" 
              className={classes.skeletonMedia} 
            />
            <CardContent>
                <Fragment>
                  <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                  <Skeleton animation="wave" height={10} width="80%" />
                </Fragment>
            </CardContent>
          </Card>
        </Fragment>
        :
        <Fragment>
        <Card className={classes.root}>
          <CardHeader
            avatar={
              <Avatar
                aria-label="recipe" 
                className={classes.avatar}
                style={{borderRadius:"5px"}}
              >
                <SpeakerNotesOutlinedIcon />
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={
              <Typography 
                component="span"
                color="primary"
                style={{
                  fontWeight:600,
                  fontSize:16
                }}
              >
                {messageData.topic}
              </Typography>
            }
            subheader={messageData.createdOn}
          />
          {/* 
          <CardMedia
            className={classes.media}
            image="/static/images/cards/paella.jpg"
            title="Paella dish"
          /> 
          */}
          <CardContent>
            <Typography 
              variant="body1" 
              //color="textSecondary" 
              component="p">
              {messageData.message}
            </Typography>
          </CardContent>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
            }}
          />
          <CardActions disableSpacing>
            {/* 
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton> 
            */}
            <Avatar 
              aria-label="recipe" 
              className={classes.avatar}
            >
              R
            </Avatar>
            &nbsp;
            &nbsp;
            <FormControl fullWidth className={clsx(classes.margin, classes.textField)} variant="outlined">
              <InputLabel htmlFor="outlined-reply">Reply</InputLabel>
              <OutlinedInput
                id="outlined-reply"
                name="replayMsg"
                multiline
                value={this.state.replayMsg}
                onChange={(e)=>this.onHandleChange(e)}
                endAdornment={
                  <InputAdornment position="end">
                    <Button 
                      //variant="contained" 
                      color="primary"
                      style={{
                        marginRight:-14,
                        paddingTop: 15,
                        paddingBottom: 15,
                      }}
                      onClick={()=>this.onSubmit(messageData.id, this.state.replayMsg)}
                    >
                     {this.state.isLoading ? <CircularProgress /> : <SendOutlinedIcon /> }
                    </Button>
                  </InputAdornment>
                }
                labelWidth={40}
                error={this.state.replayMsgError}
              />
            </FormControl>
            &nbsp;
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: this.state.expanded,
              })}
              onClick={this.handleExpandClick}
              aria-expanded={this.state.expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon color="primary"/>
            </IconButton>
          </CardActions>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
            }}
          />
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <List className={classes.commentRoot}>
              {messageData.messageRepliesArray.map((row)=>
                <Fragment key={row.id+row.replyOn}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        alt={row.replyBy} 
                        src="/static/images/avatar/1.jpg" 
                        className={classes.avatar}
                        style={{
                          width:35,
                          height:35,
                          fontSize:"1.1em"
                        }} 
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography 
                          component="span"
                          color="primary"
                          style={{
                            fontWeight:600,
                            fontSize:"0.9em"
                          }}
                        >
                          {row.replyBy}
                        </Typography>
                      }
                      secondary={
                        <Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.commentInline}
                            color="textPrimary"
                          >
                            {row.message}
                          </Typography>
                          <br/>
                          <span style={{float:"right",fontSize:"0.85em"}}>{row.replyOn}</span>
                          <SubReplyComponent 
                            classes={classes}
                            subMessageData={row}
                            onFormSubmit={this.onFormSubmit}
                            handleOpenSnackbar={this.props.handleOpenSnackbar}
                            isLoading={this.state.isLoading}
                          />
                        </Fragment>
                      }
                    />
                  </ListItem>
                  <Divider
                    variant="inset" 
                    component="li"
                    style={{
                      backgroundColor: "rgb(58, 127, 187)",
                      opacity: "0.3",
                    }}
                  />
                </Fragment>
              )}
            </List>
          </Collapse>
        </Card>
        </Fragment>
      }
      </Fragment>
    );
  }
}
export default withStyles(styles)(F60FormCardComponent);
