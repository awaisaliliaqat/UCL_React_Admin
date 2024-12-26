import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import {
  TextField,
  Grid,
  Divider,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import BottomBar from "../../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {
  numberExp,
  numberWithDecimalExp,
} from "../../../../../utils/regularExpression";
import PropTypes from "prop-types";
import { IsEmpty } from "../../../../../utils/helper";
import { withRouter } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { DatePicker } from "@material-ui/pickers";
import { toDate } from "date-fns";

const styles = (theem) => ({
  root: {
    paddingBottom: 50,
    paddingLeft: 20,
    paddingRight: 20,
  },
  inputFileFocused: {
    textAlign: "center",
    "&:hover": {
      color: theem.palette.primary.main,
    },
  },
});

function MyDropzone(props) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept:
      // "application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/pdf, image/*",
    // multiple: props.multiple,
  });

  const files = acceptedFiles.map((file, index) => {
    const size = file.size > 0 ? (file.size / 1000).toFixed(2) : file.size;
    return (
      <Typography key={index} variant="subtitle1" color="primary">
        {file.path} - {size} Kb
        <input
          type="hidden"
          name={props.name + "-file-name"}
          value={file.path}
        ></input>
      </Typography>
    );
  });

  let msg = files || [];
  if (msg.length <= 0 || props.files.length <= 0) {
    msg = <Typography variant="subtitle1">{props.label}</Typography>;
  }

  return (
    <div
      id="contained-button-file-div"
      {...getRootProps({
        className: "dropzone " + `${props.className}`,
        onChange: (event) => props.onChange(event),
      })}
    >
      <Card style={{ backgroundColor: "#c7c7c7" }} className={props.className}>
        <CardContent
          style={{
            paddingBottom: 14,
            paddingTop: 14,
            cursor: "pointer",
          }}
        >
          <input
            name={props.name + "-file"}
            {...getInputProps()}
            disabled={props.disabled}
          />
          {msg}
        </CardContent>
      </Card>
    </div>
  );
}

class F347ShiftReassignment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: 0,
      isLoading: false,
      isReload: false,
      showPass: false,
      request: "",

      employeeData: [],
      employeeDataLoading: false,
      employeeObject: {},
      employeeObjectError: "",

      previousShiftData: "",
      shiftData: [],
      shiftDataLoading: false,
      shiftObject: {},
      shiftObjectError: "",

      employeeId: "",
      loanAmount: "",
      months: "",
      installmentPerMonth: "",

      toDate: null,

      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
    };
  }

  componentDidMount() {
    // console.log(this.state.recordId, "id is coming");
    // const data = this.props.match.params.id.split("T");
    // console.log(data);
    // this.setState({
    //   ...this.state,
    //   recordId: data[0],
    // });
    this.getEmployeesData();
    this.getShiftsData();

    // if (Number(data[0]) > 0) {
    //   this.loadData(Number(data[0]), data[1]);
    // }
  }

  handleSnackbar = (open, msg, severity) => {
    this.setState({
      isOpenSnackbar: open,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };

  // loadData = async (recordId, string) => {
  //   const data = new FormData();
  //   data.append("recordId", recordId);
  //   this.setState({ isLoading: true });
  //   const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C328CommonUsersEmployeesLoanView`;
  //   await fetch(url, {
  //     method: "POST",
  //     body: data,
  //     headers: new Headers({
  //       Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
  //     }),
  //   })
  //     .then((res) => {
  //       if (!res.ok) {
  //         throw res;
  //       }
  //       return res.json();
  //     })
  //     .then(
  //       (json) => {
  //         if (json.CODE === 1) {
  //           let data = json.DATA || [];
  //           if (data.length > 0) {
  //             let myDataObject = data[0] || {};
  //             this.setState({
  //               employeeObject: {
  //                 id: myDataObject["userEmployeeId"],
  //                 label: myDataObject["userEmployeeLabel"],
  //               },
  //               request: string,
  //               recordId: recordId,
  //               loanAmount: myDataObject["loanAmount"],
  //               months: myDataObject["numberOfMonths"],
  //               installmentPerMonth:
  //                 myDataObject["loanAmount"] / myDataObject["numberOfMonths"],
  //             });
  //           }
  //         } else {
  //           this.handleSnackbar(
  //             true,
  //             json.USER_MESSAGE + "\n" + json.SYSTEM_MESSAGE,
  //             "error"
  //           );
  //         }
  //         console.log(json);
  //       },
  //       (error) => {
  //         if (error.status == 401) {
  //           this.setState({
  //             isLoginMenu: true,
  //             isReload: true,
  //           });
  //         } else {
  //           console.log(error);
  //           this.handleSnackbar(
  //             true,
  //             "Failed to Load Data ! Please try Again later.",
  //             "error"
  //           );
  //         }
  //       }
  //     );
  //   this.setState({ isLoading: false });
  // };

  onHandleChangeDate = (event) => {
    const { name, value } = event.target;

    // const date = new Date(value);
    // const formattedDate = date.toISOString().split("T")[0];

    if (name === "fromDate") {
      if (this.state.toDate && value && this.state.toDate < value) {
        this.setState({
          fromDate: value,
          // fromDateToSend: formattedDate,
          toDate: null,
          toDateToSend: null,
        });
      } else {
        this.setState({
          fromDate: value,
          // fromDateToSend: formattedDate,
          toDate: null,
          toDateToSend: null,
        });
      }
    } else if (name === "toDate") {
      this.setState(
        {
          toDate: value,
          // toDateToSend: formattedDate,
        }
        // () => {
        //   this.getDataThroughDate(formattedDate);
        // }
      );
    }
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;

    if (name === "employeeObject") {
      this.getEmployeeShiftData(value.id);
    }

    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  isFormValid = () => {
    let isValid = true;
    let {
      employeeObjectError,
      payrollMonthsError,
      perMonthSalaryError,
      perHourRateError,
      payrollCommentsError,
    } = this.state;

    if (IsEmpty(this.state.employeeObject)) {
      employeeObjectError = "Please select employee.";
      isValid = false;
    } else {
      employeeObjectError = "";
    }

    this.setState({
      employeeObjectError,
      payrollMonthsError,
      perMonthSalaryError,
      perHourRateError,
      payrollCommentsError,
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

      previousShiftData: "",
      shiftObject: {},

      employeeId: "",
      loanAmount: "",
      months: "",
      installmentPerMonth: "",

      toDate: null,
    });
  };

  onFormSubmit = async () => {
    console.log(this.state.employeeObject, this.state.shiftObject);
    const date = new Date(this.state.toDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    const data = new FormData();
    data.append("userId", this.state.employeeObject.id);
    data.append("shiftId", this.state.shiftObject.id);
    data.append("shiftStartDate", formattedDate);

    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C347CommonEmployeeShiftSave`;
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
            this.handleSnackbar(true, json.USER_MESSAGE, "success");
            if (this.state.recordId == 0) {
              this.clearAllData();
            } else {
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

  getShiftsData = async () => {
    this.setState({ employeeDataLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C347CommonEmployeeShiftScheduleAllActiveList`;
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
            this.setState({
              shiftData: json.DATA || [],
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

  getEmployeeShiftData = async (id) => {
    this.setState({ employeeDataLoading: true });
    const formData = new FormData();
    formData.append("userId", id);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C347CommonEmployeeShiftScheduleView`;
    await fetch(url, {
      method: "POST",
      body: formData,
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
            console.log("data is coming", json.CODE);
            if (json.DATA.length !== 0) {
              const findShift = this.state.shiftData.find(
                (item) => item.id === json.DATA[0].shiftId
              );
              this.setState({
                previousShiftData: findShift?.label || "No Shift Attached",
              });
            } else {
              this.setState({
                previousShiftData: "No Shift Attached",
              });
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

  getEmployeesData = async () => {
    this.setState({ employeeDataLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C347CommonUsersView`;
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
            this.setState({
              employeeData: json.DATA || [],
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
    window.location = "#/dashboard/R347ShiftAssignmentView";
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
          // onSubmit={this.onFormSubmit}
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
              {this.state.recordId > 0 && (
                <Tooltip title="Back">
                  <IconButton
                    onClick={() =>
                      window.location.replace(
                        "#/dashboard/F328EmployeesLoanRecommendation"
                      )
                    }
                  >
                    <ArrowBackIcon fontSize="small" color="primary" />
                  </IconButton>
                </Tooltip>
              )}
              Employees Shift Assignment
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
              <Grid item xs={12}>
                <Autocomplete
                  id="employeeObject"
                  getOptionLabel={(option) =>
                    typeof option.label == "string" ? option.label : ""
                  }
                  getOptionSelected={(option, value) => option.id === value.id}
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
                        label={option.label}
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
              <Grid item xs={4}>
                <TextField
                  id="loanAmount"
                  name="loanAmount"
                  label="Activated Shift"
                  required
                  fullWidth
                  variant="outlined"
                  // onChange={this.onHandleChange}
                  value={this.state.previousShiftData}
                  disabled
                  // helperText={this.state.loanAmount}
                  // error={this.state.loanAmount}
                />
              </Grid>

              <Grid item xs={4}>
                <Autocomplete
                  id="shiftObject"
                  getOptionLabel={(option) =>
                    typeof option.label == "string" ? option.label : ""
                  }
                  getOptionSelected={(option, value) => option.id === value.id}
                  fullWidth
                  aria-autocomplete="none"
                  options={this.state.shiftData}
                  loading={this.state.shiftDataLoading}
                  value={this.state.shiftObject}
                  onChange={(e, value) =>
                    this.onHandleChange({
                      target: { name: "shiftObject", value },
                    })
                  }
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        key={option}
                        label={option.label}
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
                        error={!!this.state.shiftObjectError}
                        helperText={this.state.shiftObjectError}
                        inputProps={inputProps}
                        label="Select New Shift *"
                        {...params}
                      />
                    );
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <DatePicker
                  autoOk
                  id="toDate"
                  name="toDate"
                  label="Effective Date From"
                  invalidDateMessage=""
                  placeholder=""
                  variant="inline"
                  inputVariant="outlined"
                  format="dd-MM-yyyy"
                  fullWidth
                  required
                  // disabled={!this.state.fromDate || this.state.isLoading}
                  value={this.state.toDate}
                  onChange={(date) =>
                    this.onHandleChangeDate({
                      target: { name: "toDate", value: date },
                    })
                  }
                  // shouldDisableDate={this.shouldDisableDate}
                  // minDate={this.state.fromDate}
                  minDate={new Date()}
                />
              </Grid>
            </Grid>
          </Grid>
          <input type="submit" style={{ display: "none" }} id="btn-submit" />
        </form>
        <BottomBar
          left_button_text="View"
          left_button_hide={this.state.recordId > 0 ? true : false}
          bottomLeftButtonAction={() => this.viewReport()}
          right_button_text={
            Number(this.state.recordId) === 0
              ? "Save"
              : this.state.request === "isRecommended"
              ? "Save & Recommend"
              : this.state.request === "isApproved"
              ? "Save & Approve"
              : "Save"
          }
          bottomRightButtonAction={
            () =>
              // Number(this.state.recordId) === 0
              // ?
              this.onFormSubmit()
            // : this.state.request === "isRecommended"
            // ? this.recommendFormSubmit()
            // : this.state.request === "isApproved"
            // ? this.approveFormSubmit()
            // : this.onFormSubmit()
          }
          // disableRightButton={
          //   Object.keys(this.state.employeeObject).length !==0 ||
          //   Object.keys(this.state.shiftObject).length !==0 ||
          //   !this.state.toDate
          // }

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

F347ShiftReassignment.propTypes = {
  isDrawerOpen: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  match: PropTypes.object,
};

F347ShiftReassignment.defaultProps = {
  isDrawerOpen: true,
  match: {
    params: {
      recordId: 0,
    },
  },
};

export default withRouter(withStyles(styles)(F347ShiftReassignment));
