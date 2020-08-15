import React, { Component, Fragment, useState, useEffect } from "react";
import { withStyles, useTheme } from "@material-ui/styles";
import { numberFreeExp, numberExp } from "../../../../utils/regularExpression";
import {
  TextField, Grid, CircularProgress, Divider, Typography, Button, IconButton,
  Tooltip, Fab, Dialog, DialogActions, DialogContent, DialogTitle, 
  useMediaQuery } from "@material-ui/core";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";

function CheckPopupFullScreen (props){
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  if(props.isPopupFullScreen!=matches){
    props.setIsPopupFullScreen(matches);
  }
  return <Fragment/>;
}

const styles = (theme) => ({
  root: {
    // padding: 20,
    // minWidth: 350,
    // overFlowX: "auto",
    margin: 0,
    padding: theme.spacing(2),
  },
  formControl: {
    minWidth: "100%",
  },
  sectionTitle: {
    fontSize: 19,
    color: "#174a84",
  },
  checkboxDividerLabel: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 20,
    fontSize: 16,
    fontWeight: 600,
  },
  rootProgress: {
    width: "100%",
    textAlign: "center",
  },
});

class F36FormPopupComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: 0,
      isLoading: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      popupBoxOpen: false,
      isPopupFullScreen: false,
      preMarks: "",
      preMarksError: "",
      preModuleMenuItems: [],
      preModuleId: "",
      preModuleIdError: "",
      preCourseMenuItems: [],
      preCourses: [],
      courseRowDataArray: [],
    };
  }

  setIsPopupFullScreen = (val) => {
    this.setState({isPopupFullScreen:val});
  }

  loadData = async (studentId) => {
    const data = new FormData();
    data.append("studentId", studentId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C30CommonAcademicsCoursesStudentsAchievementsView`;
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
            let courseRowDataArray = [];
            for (let i = 0; i < json.DATA.length; i++) {
              let courseRowDataObject = {
                preModuleId: json.DATA[i].moduleNumber,
                preCourses: json.DATA[i].coursesArray,
                preMarks: json.DATA[i].marks,
              };
              courseRowDataArray.push(courseRowDataObject);
            }
            this.setState({ courseRowDataArray: courseRowDataArray });
          } else {
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,
              "error"
            );
          }
          console.log("loadData", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar(
              "Failed to Save ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  handleClickOpen = () => {
    //this.loadData(this.props.studentId);
    this.setState({ popupBoxOpen: true });
  };

  handleClose = () => {
    this.setState({
      popupBoxOpen: false,
      preModuleId: "",
      preCourses: [],
      preMarks: "",
      courseRowDataArray: [],
    });
  };

  isPreModuleValid = () => {
    let isValid = true;
    if (!this.state.preModuleId) {
      this.setState({ preModuleIdError: "Please select module." });
      document.getElementById("preModuleId").focus();
      isValid = false;
    } else {
      this.setState({ preModuleIdError: "" });
    }
    return isValid;
  };

  isPreCoursesValid = () => {
    let isValid = true;
    if (this.state.preCourses.length < 1) {
      this.setState({ preCoursesError: "Please select course." });
      document.getElementById("preCourses").focus();
      isValid = false;
    } else if (this.state.preCourses.length > 2) {
      this.setState({
        preCoursesError: "One full or two half couses can be selected",
      });
      document.getElementById("preCourses").focus();
      isValid = false;
    } else {
      this.setState({ preCoursesError: "" });
    }
    return isValid;
  };

  isMarksValid = () => {
    let isValid = true;
    if (!this.state.preMarks) {
      this.setState({ preMarksError: "Please enter marks." });
      document.getElementById("preMarks").focus();
      isValid = false;
    } else {
      this.setState({ preMarksError: "" });
    }
    return isValid;
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  isCourseSelected = (option) => {
    return this.state.preCourses.some(
      (selectedOption) => selectedOption.ID == option.ID
    );
  };

  handleSetPreCourses = (value) => {
    this.setState({
      preCourses: value,
      preCoursesError: "",
    });
  };

  // componentDidMount() {
  //   //console.log("F30PopUp: ", this.props);
  //   this.setState({
  //     preCourseMenuItems: this.props.preCourseMenuItems,
  //     preModuleMenuItems: this.props.preModuleMenuItems,
  //   });
  //   if (this.state.recordId != 0) {
  //     this.loadData(this.state.recordId);
  //   }
  // }

  render() {

    return (
      <Fragment>
        <CheckPopupFullScreen 
          isPopupFullScreen={this.state.isPopupFullScreen}
          setIsPopupFullScreen={this.setIsPopupFullScreen}
        />
        <Button 
          variant="outlined" 
          color="primary"
          onClick={this.handleClickOpen}
        >
          Primary
        </Button>
        {/* <IconButton
          color="primary"
          aria-label="Add"
          component="span"
          
          variant="outlined"
        >
          <Tooltip title="Add Achievements">
            <Fab color="primary" aria-label="add" size="small">
              <AddIcon />
            </Fab>
          </Tooltip>
        </IconButton> */}
        <Dialog
          fullScreen={this.state.isPopupFullScreen}
          maxWidth="md"
          open={this.state.popupBoxOpen}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <span style={{ color: "#ffffff" }}>
            ________________________________________________________________________________________________________________________________________________________
          </span>
          <DialogTitle id="responsive-dialog-title">
            <IconButton
              aria-label="close"
              onClick={this.handleClose}
              style={{
                position: "relative",
                top: "-35px",
                right: "-24px",
                float: "right",
              }}
            >
              <CloseOutlinedIcon color="secondary" />
            </IconButton>
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                borderBottom: "1px solid rgb(58, 127, 187, 0.3)",
                fontSize: 20,
              }}
            >
              {this.props.dialogTitle}
            </Typography>
          </DialogTitle>
          <DialogContent>
              <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="center"
                spacing={2}
              >
                <TextField
                  type="hidden"
                  id="studentId"
                  name="studentId"
                  value={this.props.studentId}
                />
                <Grid item xs={12} md={3}>
                  <TextField
                    id="preMarks"
                    name="preMarks"
                    label="Marks"
                    type="number"
                    required
                    fullWidth
                    variant="outlined"
                    onChange={this.onHandleChange}
                    value={this.state.preMarks}
                    error={!!this.state.preMarksError}
                    helperText={
                      this.state.preMarksError ? this.state.preMarksError : " "
                    }
                  />
                </Grid>
              </Grid>
          </DialogContent>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
            }}
          />
          <DialogActions>
            <Button autoFocus onClick={this.handleClose} color="secondary">
              Close
            </Button>
            <Button
              onClick={this.props.clickOnFormSubmit()}
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
export default withStyles(styles)(F36FormPopupComponent);
