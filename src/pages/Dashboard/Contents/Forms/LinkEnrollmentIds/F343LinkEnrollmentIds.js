import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import { TextField, Grid, Divider, Typography, Chip } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import BottomBar from "../../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { DatePicker, KeyboardTimePicker } from "@material-ui/pickers";

import {
  numberExp,
  numberWithDecimalExp,
} from "../../../../../utils/regularExpression";
import PropTypes from "prop-types";
import { IsEmpty } from "../../../../../utils/helper";

const styles = () => ({
  root: {
    paddingBottom: 50,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

class F343LinkEnrollmentIds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: this.props.match.params.recordId,
      isLoading: false,
      isReload: false,
      showPass: false,

      employeeData: [],
      employeeDataLoading: false,
      employeeObject: {},
      employeeObjectError: "",

      enrolledData: [],
      enrolledDataLoading: false,
      enrolledId: "",
      enrolledIdError: "",

      // employeeData: [],
      // employeeDataLoading: false,
      // employeeObject: {},
      // employeeObjectError: "",

      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
    };
  }

  componentDidMount() {
    this.getEmployeesData();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.match.params.recordId != nextProps.match.params.recordId) {
      if (nextProps.match.params.recordId != 0) {
        this.loadData(nextProps.match.params.recordId);
        this.setState({
          recordId: nextProps.match.params.recordId,
        });
      } else {
        window.location.reload();
      }
    }
  }

  handleSnackbar = (open, msg, severity) => {
    this.setState({
      isOpenSnackbar: open,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;

    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  isFormValid = () => {
    let isValid = true;
    let { employeeObjectError } = this.state;

    if (IsEmpty(this.state.employeeObject)) {
      employeeObjectError = "Please select employee.";
      isValid = false;
    } else {
      employeeObjectError = "";
    }

    this.setState({
      employeeObjectError,
    });
    return isValid;
  };

  clickOnFormSubmit = () => {
    if (this.isFormValid()) {
      document.getElementById("btn-submit").click();
    }
  };

  clearAllData = () => {
    this.setState({
      employeeDataLoading: false,
      employeeObject: {},
      employeeObjectError: "",
      enrolledDataLoading: false,
      enrolledId: "",
      enrolledIdError: "",
    });
  };

  onFormSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("enrollmentId", this.state.enrolledId);
    data.append("userId", this.state.employeeObject.userId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C343LinkEnrollmentSave`;
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
            this.handleSnackbar(true, "Saved", "success");
            if (this.state.recordId == 0) {
              this.getEmployeesData();
              this.clearAllData();
            } else {
              this.getEmployeesData();
              this.clearAllData();
              // setTimeout(() => {
              //   window.location.replace("#/dashboard/R316EmployeesPayrollView");
              // }, 1000);
            }
          } else {
            this.handleSnackbar(
              true,
              json.USER_MESSAGE + "\n" + json.SYSTEM_MESSAGE,
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
            this.handleSnackbar(
              true,
              "Failed to Save ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  getEmployeesData = async () => {
    this.setState({ employeeDataLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C343LinkEnrollmentIdsView`;
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
            console.log(json.DATA, "date is coming");
            this.setState({
              employeeData: json.DATA[0].notEnrolledUser || [],
              enrolledData: json.DATA[0].notEnrolledIds || [],
            });
          } else {
            this.handleSnackbar(
              true,
              json.USER_MESSAGE + "\n" + json.SYSTEM_MESSAGE,
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
            this.handleSnackbar(
              true,
              "Failed to Get Data ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ employeeDataLoading: false });
  };

  viewReport = () => {
    window.location = "#/dashboard/F343LinkEnrollmentIdsView";
  };

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <LoginMenu
          reload={this.state.isReload}
          open={this.state.isLoginMenu}
          handleClose={() => this.setState({ isLoginMenu: false })}
        />
        <form
          noValidate
          autoComplete="off"
          id="myForm"
          onSubmit={this.onFormSubmit}
        >
          <TextField type="hidden" name="id" value={this.state.recordId} />
          <Grid container component="main" className={classes.root}>
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                borderBottom: "1px solid #d2d2d2",
                width: "98%",
                marginBottom: 25,
                fontSize: 20,
              }}
              variant="h5"
            >
              Link Enrollment Id's
            </Typography>
            <Divider
              style={{
                backgroundColor: "rgb(58, 127, 187)",
                opacity: "0.3",
              }}
            />
            <Grid
              container
              spacing={2}
              style={{
                marginLeft: 5,
                marginRight: 15,
              }}
            >
              <Grid item xs={6}>
                <Autocomplete
                  id="enrolledId"
                  getOptionLabel={(option) => option.toString()}
                  getOptionSelected={(option, value) => option === value}
                  fullWidth
                  aria-autocomplete="none"
                  options={this.state.enrolledData}
                  loading={this.state.enrolledDataLoading}
                  value={this.state.enrolledId}
                  onChange={(e, value) =>
                    this.onHandleChange({
                      target: { name: "enrolledId", value },
                    })
                  }
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        key={option}
                        label={option.toString()} // Display the number as a string in the chip
                        color="primary"
                        variant="outlined"
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => {
                    const inputProps = params.inputProps;
                    return (
                      <TextField
                        variant="outlined"
                        error={!!this.state.enrolledIdError}
                        helperText={this.state.enrolledIdError}
                        inputProps={inputProps}
                        label="Id's *"
                        {...params}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  id="employeeObject"
                  getOptionLabel={(option) =>
                    typeof option.userName == "string" ? option.userName : ""
                  }
                  getOptionSelected={(option, value) =>
                    option.userId === value.userId
                  }
                  fullWidth
                  aria-autocomplete="none"
                  options={this.state.employeeData}
                  loading={this.state.employeeDataLoading}
                  value={this.state.employeeObject}
                  onChange={(e, value) =>
                    this.onHandleChange({
                      target: { name: "employeeObject", value },
                    })
                  }
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        key={option}
                        label={option.userName}
                        color="primary"
                        variant="outlined"
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => {
                    const inputProps = params.inputProps;
                    return (
                      <TextField
                        variant="outlined"
                        error={!!this.state.employeeObjectError}
                        helperText={this.state.employeeObjectError}
                        inputProps={inputProps}
                        label="Employee *"
                        {...params}
                      />
                    );
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <input type="submit" style={{ display: "none" }} id="btn-submit" />
        </form>
        <BottomBar
          left_button_text="View"
          left_button_hide={false}
          bottomLeftButtonAction={() => this.viewReport()}
          right_button_text="Save"
          bottomRightButtonAction={() => this.clickOnFormSubmit()}
          disableRightButton={
            !this.state.enrolledId ||
            Object.keys(this.state.employeeObject).length === 0
          }
          loading={this.state.isLoading}
          isDrawerOpen={this.props.isDrawerOpen}
        />
        <CustomizedSnackbar
          isOpen={this.state.isOpenSnackbar}
          message={this.state.snackbarMessage}
          severity={this.state.snackbarSeverity}
          handleCloseSnackbar={() => this.handleSnackbar(false, "", "")}
        />
      </Fragment>
    );
  }
}

F343LinkEnrollmentIds.propTypes = {
  isDrawerOpen: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  match: PropTypes.object,
};

F343LinkEnrollmentIds.defaultProps = {
  isDrawerOpen: true,
  match: {
    params: {
      recordId: 0,
    },
  },
};

export default withStyles(styles)(F343LinkEnrollmentIds);
