import React, { Component, Fragment } from "react";
import { useTheme } from "@material-ui/styles";
import {TextField, Grid, CircularProgress, Divider, Typography, Button, IconButton,
  Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, MenuItem } from "@material-ui/core";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";

function CheckPopupFullScreen (props){
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  if(props.isPopupFullScreen!=matches){
    props.setIsPopupFullScreen(matches);
  }
  return <Fragment/>;
}

class F60FormPopupComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      recordId: 0,
      isLoading: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      isPopupFullScreen: false,
      isLoginMenu: false,
      isReload: false,
      sectionId:"",
      sectionIdError:"",
      topic:"",
      tppicError:"",
      description:"",
      descriptionError:""
    };
  }

  setIsPopupFullScreen = (val) => {
    this.setState({isPopupFullScreen:val});
  }

  handlePopupClose = () => {
    this.props.handlePopupClose();
    this.setState({
      sectionId:"",
      sectionIdError:"",
      topic:"",
      topicError:"",
      description:"",
      descriptionError:""
    });
  }

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  isSectionValid = () => {
    let isValid = true;        
    if (!this.state.sectionId) {
        this.setState({sectionIdError:"Please select section."});
        document.getElementById("sectionId").focus();
        isValid = false;
    } else {
        this.setState({sectionIdError:""});
    }
    return isValid;
  }

  isTopicValid = () => {
    let isValid = true;
    if (!this.state.topic) {
      this.setState({ topicError: "Please enter topic title." });
      document.getElementById("topic").focus();
      isValid = false;
    } else {
      this.setState({ topicError: "" });
    }
    return isValid;
  };

  isTopicValid = () => {
    let isValid = true;
    if (!this.state.topic) {
      this.setState({ topicError: "Please enter topic title." });
      document.getElementById("topic").focus();
      isValid = false;
    } else {
      this.setState({ topicError: "" });
    }
    return isValid;
  };

  isDescriptionValid = () => {
    let isValid = true;
    if (!this.state.description) {
      this.setState({ descriptionError: "Please enter topic description." });
      document.getElementById("description").focus();
      isValid = false;
    } else {
      this.setState({ descriptionError: "" });
    }
    return isValid;
  };

  onFormSubmit = async (e) => {
    //e.preventDefault();
    if (
      !this.isSectionValid() ||
      !this.isTopicValid() ||
      !this.isDescriptionValid() 
    ) { return; }
    //let myForm = document.getElementById("myForm");
    //const data = new FormData(myForm);
    const data = new FormData();
    data.append("sectionId", this.state.sectionId);
    data.append("createdByFlag", 1);
    data.append("topic", this.state.topic);
    data.append("description", this.state.description);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C60CommonAcademicsForumsSave`;
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
            this.handlePopupClose();
            this.props.getData(0,0);
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

  render() {

    const {popupBoxOpen, sectionsMenuItems} = this.props;
    
    return (
      <Fragment>
        <CheckPopupFullScreen 
          isPopupFullScreen={this.state.isPopupFullScreen}
          setIsPopupFullScreen={this.setIsPopupFullScreen}
        />
        <Dialog
          fullScreen={this.state.isPopupFullScreen}
          maxWidth="md"
          open={popupBoxOpen}
          onClose={this.handlePopupClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle 
            id="responsive-dialog-title" 
            style={{
              backgroundColor:"#174A84",
              height:30
            }}
          >
            <Typography 
              component="span" 
              variant="h5"
              style={{color:"#fafdff"}}
            >
              Add Topic
            </Typography> 
            <IconButton
              aria-label="close"
              onClick={this.handlePopupClose}
              style={{
                position: "relative",
                top: "-18px",
                right: "-24px",
                float: "right",
              }}
            >
              <CloseOutlinedIcon color="secondary" />
            </IconButton>
          </DialogTitle>
          <span style={{color:"#ffffff"}}>
           __________________________________________________________________________________________________________________________
          </span> 
          <DialogContent>
            <form id="myForm" name="myForm">
              <Grid
                container
                direction="row"
                alignItems="center"
                spacing={1}
              >
                <Grid item xs={12} md={4}>
                  <TextField
                    id="sectionId"
                    name="sectionId"
                    variant="outlined"
                    label="Sections"
                    onChange={this.onHandleChange}
                    value={this.state.sectionId}
                    error={!!this.state.sectionIdError}
                    helperText={this.state.sectionIdError ? this.state.sectionIdError : " "}
                    required
                    fullWidth
                    select
                  >
                    {sectionsMenuItems && !this.state.isLoading ? (
                      sectionsMenuItems.map((dt, i) => (
                        <MenuItem key={"sectionsMenuItems" + dt.id} value={dt.id}>
                          {dt.label}
                        </MenuItem>
                      ))
                    ) : (
                      <Grid container justify="center">
                        <CircularProgress disableShrink />
                      </Grid>
                    )}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField
                    id="topic"
                    name="topic"
                    label="Title"
                    required
                    fullWidth
                    variant="outlined"
                    onChange={this.onHandleChange}
                    value={this.state.topic}
                    error={!!this.state.topicError}
                    helperText={this.state.topicError ? this.state.topicError : " "}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="description"
                    name="description"
                    label="Description"
                    required
                    fullWidth
                    multiline
                    rows={5}
                    variant="outlined"
                    onChange={this.onHandleChange}
                    value={this.state.description}
                    error={!!this.state.descriptionError}
                    helperText={this.state.descriptionError ? this.state.descriptionError : " "}
                  />
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
            }}
          />
          <DialogActions>
            <Button autoFocus onClick={this.handlePopupClose} color="secondary">
              Close
            </Button>
            <Button
              onClick={() => this.onFormSubmit()}
              color="primary"
              autoFocus
              disabled={this.state.isLoading}
            >
              {this.state.isLoading ? <CircularProgress size={24}/> :"Save"}
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}
export default F60FormPopupComponent;
