import React, { Component, Fragment, useState, useEffect } from "react";
import { useTheme } from "@material-ui/styles";
import { numberExp } from "../../../../utils/regularExpression";
import {TextField, Grid, CircularProgress, Divider, Typography, Button, IconButton,
  Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery } from "@material-ui/core";
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
      topic:"",
      topicError:"",
      description:"",
      descriptionError:""
    });
  }

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    // let regex = "";
    // switch (name) {
    //     case "obtainedMarks":
    //         regex = new RegExp(numberExp);
    //         if (value && !regex.test(value)) {
    //             return;
    //         }
    //         break;
    // default:
    //     break;
    // }
    this.setState({
      [name]: value,
      [errName]: "",
    });
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
      !this.isTopicValid() ||
      !this.isDescriptionValid() 
    ) { return; }
    let myForm = document.getElementById("myForm");
    const data = new FormData(myForm);
    data.append("sectionId", 35);
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
            this.props.getData();
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

  componentDidUpdate(prevProps){
    if (this.props.recordId !== prevProps.recordId) {
      this.setState({
        obtainedMarks:this.props.assignmentGradedData.obtainedMarks,
        remarks:this.props.assignmentGradedData.remarks,
        totalMarks:this.props.assignmentGradedData.totalMarks
      });
    }
  }

  render() {

    const {popupBoxOpen} = this.props;
    
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
              >
                {/* 
                <TextField
                  type="hidden"
                  id="id"
                  name="id"
                  defaultValue={this.props.recordId}
                /> 
                */}
                <Grid item xs={12} md={12}>
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
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}
export default F60FormPopupComponent;
