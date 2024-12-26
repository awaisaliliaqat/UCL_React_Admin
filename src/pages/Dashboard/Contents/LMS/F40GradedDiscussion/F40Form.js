import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import { numberExp } from "../../../../../utils/regularExpression";
import { TextField, Grid } from "@material-ui/core";
import BottomBar from "../../../../../components/BottomBar/BottomBar";
import MenuItem from "@material-ui/core/MenuItem";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { DatePicker } from "@material-ui/pickers";

const styles = () => ({
  root: {
    paddingBottom: 40,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 0,
  },
  title: {
    color: "#1d5f98",
    fontWeight: 600,
    borderBottom: "1px solid rgb(58, 127, 187, 0.3)",
    width: "98%",
    marginBottom: 25,
    fontSize: 20,
  },
});

class F40Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: this.props.match.params.recordId,

      isLoading: false,
      uploadLoading: false,
      secondState: {
        firstName: "",
        lastName: "",
      },

      isReload: false,
      isLoginMenu: false,

      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",

      label: "",
      labelError: "",
      totalMarks: "",
      totalMarksError: "",
      instructions: "",
      instructionsError: "",
      startDate: null,
      startDateError: "",
      dueDate: null,
      dueDateError: "",
      sectionId: "",
      sectionIdError: "",
      sectionIdMenuItems: [],

      courseId: "",
      courseIdError: "",
      courseIdMenuItems: [],

      topic: "",
      topicError: "",

      prevStartDate: new Date(),
    };
  }

  handleOpenSnackbar = (msg, severity) => {
    this.setState({
      isOpenSnackbar: true,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };

  handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      isOpenSnackbar: false,
    });
  };

  getCoursesData = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C40CommonAcademicsProgrammeCouresView`;
    await fetch(url, {
      method: "GET",
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
            this.setState({ courseIdMenuItems: json.DATA || [] });
          } else {
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
              "error"
            );
          }
          console.log(json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar(
              "Failed to fetch, Please try again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  getSectionsData = async (courseId) => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C40CommonAcademicsSectionsTeachersView?courseId=${courseId}`;
    await fetch(url, {
      method: "GET",
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
            this.setState({ sectionIdMenuItems: json.DATA || [] });
          } else {
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
              "error"
            );
          }
          console.log(json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar(
              "Failed to fetch, Please try again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  loadData = async (index) => {
    const data = new FormData();
    data.append("id", index);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C40CommonAcademicsGradedDiscussionsBoardView`;
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
            if (json.DATA.length > 0) {
              const sDate =
                json.DATA[0].startDateWithoutConversion || new Date();
              const dDate = json.DATA[0].dueDateWithoutConversion || new Date();
              const startDate = new Date(sDate);
              const dueDate = new Date(dDate);
              this.getSectionsData(json.DATA[0].courseId);
              this.setState({
                sectionId: json.DATA[0].sectionId,
                courseId: json.DATA[0].courseId,
                label: json.DATA[0].label,
                startDate,
                prevStartDate: startDate,
                dueDate,
                totalMarks: json.DATA[0].totalMarks,
                topic: json.DATA[0].topic,
                instructions: json.DATA[0].instructions,
              });
            } else {
              window.location = "#/dashboard/F40Form/0";
            }
          } else {
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
              "error"
            );
          }
          console.log(json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
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

  isFormValid = () => {
    let isValid = true;
    let {
      labelError,
      sectionIdError,
      courseIdError,
      topicError,
      startDateError,
      dueDateError,
      instructionsError,
      totalMarksError,
    } = this.state;

    if (!this.state.totalMarks) {
      totalMarksError = "Please enter Total Marks";
      isValid = false;
    } else {
      totalMarksError = "";
    }

    if (!this.state.instructions) {
      instructionsError = "Please add some instructions";
      isValid = false;
    } else {
      instructionsError = "";
    }

    if (!this.state.topic) {
      topicError = "Please enter the topic";
      isValid = false;
    } else {
      topicError = "";
    }

    if (!this.state.dueDate) {
      dueDateError = "Please select the Due Date";
      isValid = false;
    } else {
      if (this.state.startDate) {
        if (
          new Date(this.state.dueDate).getTime() <
          new Date(this.state.startDate).getTime()
        ) {
          dueDateError = "Due Date can't less than Start Date";
          isValid = false;
        } else {
          dueDateError = "";
        }
      } else {
        dueDateError = "";
      }
    }

    if (!this.state.startDate) {
      startDateError = "Please select the Start Date";
      isValid = false;
    } else {
      startDateError = "";
    }

    if (!this.state.label) {
      labelError = "Please enter title";
      isValid = false;
    } else {
      labelError = "";
    }

    if (!this.state.sectionId) {
      sectionIdError = "Please select the section";
      isValid = false;
    } else {
      sectionIdError = "";
    }

    if (!this.state.courseId) {
      courseIdError = "Please select the course";
      isValid = false;
    } else {
      courseIdError = "";
    }

    this.setState({
      labelError,
      sectionIdError,
      startDateError,
      dueDateError,
      instructionsError,
      totalMarksError,
      courseIdError,
      topicError,
    });

    return isValid;
  };

  resetForm = () => {
    this.setState({
      recordId: 0,
      label: "",
      labelError: "",
      totalMarks: "",
      totalMarksError: "",
      instructions: "",
      instructionsError: "",
      startDate: null,
      startDateError: "",
      dueDate: null,
      dueDateError: "",
      sectionId: "",
      sectionIdError: "",
      sectionIdMenuItems: [],
      courseId: "",
      courseIdError: "",
      topic: "",
      topicError: "",
    });
  };

  clickOnFormSubmit = () => {
    if (this.isFormValid()) {
      document.getElementById("gradedDiscussionSubmit").click();
    }
  };

  onFormSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C40CommonAcademicsGradedDiscussionsBoardSave`;
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
            this.handleOpenSnackbar(json.USER_MESSAGE, "success");
            if (this.state.recordId == 0) {
              this.resetForm();
            }
          } else {
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
              "error"
            );
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
            this.handleOpenSnackbar(
              "Failed to Save ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  viewReport = () => {
    window.location = "#/dashboard/F40Reports";
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    if (this.state.recordId != 0) {
      this.loadData(this.state.recordId);
    }
    this.getCoursesData();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.match.params.recordId != nextProps.match.params.recordId) {
      if (nextProps.match.params.recordId != 0) {
        this.props.setDrawerOpen(false);
        this.loadData(nextProps.match.params.recordId);
        this.setState({
          recordId: nextProps.match.params.recordId,
        });
      } else {
        window.location.reload();
      }
    }
  }

  handleDateChange = (name, date) => {
    const errorName = `${name}Error`;
    this.setState({
      [name]: date,
      [errorName]: "",
    });
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    let regex = "";
    switch (name) {
      case "totalMarks":
        regex = new RegExp(numberExp);
        if (value && !regex.test(value)) {
          return;
        }
        break;
      case "courseId":
        this.getSectionsData(value);
        break;
      default:
        break;
    }
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  render() {
    const { classes } = this.props;
    const startMinDate =
      new Date().getTime() > new Date(this.state.prevStartDate).getTime()
        ? new Date(this.state.prevStartDate)
        : new Date();
    return (
      <Fragment>
        <LoginMenu
          reload={this.state.isReload}
          open={this.state.isLoginMenu}
          handleClose={() => this.setState({ isLoginMenu: false })}
        />
        <form id="myForm" onSubmit={this.onFormSubmit}>
          <TextField
            type="hidden"
            name="recordId"
            value={this.state.recordId}
          />
          <Grid container component="main" className={classes.root}>
            <Typography className={classes.title} variant="h5">
              Graded Discussion Board
            </Typography>
            <Grid
              container
              spacing={2}
              style={{
                marginLeft: 5,
                marginRight: 10,
              }}
            >
              <Grid item xs={12} sm={6}>
                <TextField
                  id="courseId"
                  name="courseId"
                  variant="outlined"
                  label="Courses"
                  onChange={this.onHandleChange}
                  value={this.state.courseId}
                  error={this.state.courseIdError}
                  required
                  fullWidth
                  select
                >
                  {this.state.courseIdMenuItems.map((dt) => (
                    <MenuItem key={dt.id} value={dt.id}>
                      {dt.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="sectionId"
                  name="sectionId"
                  variant="outlined"
                  label="Section"
                  onChange={this.onHandleChange}
                  value={this.state.sectionId}
                  error={this.state.sectionIdError}
                  required
                  fullWidth
                  select
                >
                  {this.state.sectionIdMenuItems.map((dt) => (
                    <MenuItem key={dt.id} value={dt.id}>
                      {dt.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="label"
                  name="label"
                  label="Title"
                  required
                  fullWidth
                  variant="outlined"
                  onChange={this.onHandleChange}
                  value={this.state.label}
                  error={this.state.labelError}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  autoOk
                  name="startDate"
                  id="startDate"
                  label="Start Date"
                  invalidDateMessage=""
                  minDate={startMinDate}
                  placeholder=""
                  variant="inline"
                  inputVariant="outlined"
                  format="dd-MM-yyyy"
                  fullWidth
                  required
                  value={this.state.startDate}
                  onChange={(date) => this.handleDateChange("startDate", date)}
                  error={this.state.startDateError}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  autoOk
                  name="dueDate"
                  id="dueDate"
                  label="Due Date"
                  invalidDateMessage=""
                  placeholder=""
                  variant="inline"
                  inputVariant="outlined"
                  format="dd-MM-yyyy"
                  fullWidth
                  required
                  minDate={new Date(this.state.startDate)}
                  disabled={!this.state.startDate}
                  title={
                    !this.state.startDate
                      ? "Please select the start date first"
                      : ""
                  }
                  value={this.state.dueDate}
                  onChange={(date) => this.handleDateChange("dueDate", date)}
                  error={this.state.dueDateError}
                  helperText={this.state.dueDate ? this.state.dueDateError : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="totalMarks"
                  name="totalMarks"
                  label="Total Marks"
                  type="number"
                  required
                  fullWidth
                  variant="outlined"
                  onChange={this.onHandleChange}
                  value={this.state.totalMarks}
                  error={this.state.totalMarksError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="topic"
                  name="topic"
                  label="Topic"
                  required
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={3}
                  onChange={this.onHandleChange}
                  value={this.state.topic}
                  error={this.state.topicError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="instructions"
                  name="instructions"
                  label="instructions"
                  required
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={5}
                  onChange={this.onHandleChange}
                  value={this.state.instructions}
                  error={this.state.instructionsError}
                />
              </Grid>
            </Grid>
            <br />
          </Grid>
          <input
            type="submit"
            id="gradedDiscussionSubmit"
            style={{ display: "none" }}
          />
        </form>
        <BottomBar
          left_button_text="View"
          left_button_hide={false}
          bottomLeftButtonAction={() => this.viewReport()}
          right_button_text="Save"
          bottomRightButtonAction={() => this.clickOnFormSubmit()}
          loading={this.state.isLoading}
          isDrawerOpen={this.props.isDrawerOpen}
        />
        <CustomizedSnackbar
          isOpen={this.state.isOpenSnackbar}
          message={this.state.snackbarMessage}
          severity={this.state.snackbarSeverity}
          handleCloseSnackbar={() => this.handleCloseSnackbar()}
        />
      </Fragment>
    );
  }
}

F40Form.propTypes = {
  classes: PropTypes.object,
  isDrawerOpen: PropTypes.bool,
  setDrawerOpen: PropTypes.func,
  match: PropTypes.object,
};

F40Form.defaultProps = {
  classes: {},
  isDrawerOpen: true,
  setDrawerOpen: (fn) => fn,
  match: {
    params: {
      recordId: 0,
    },
  },
};

export default withStyles(styles)(F40Form);
