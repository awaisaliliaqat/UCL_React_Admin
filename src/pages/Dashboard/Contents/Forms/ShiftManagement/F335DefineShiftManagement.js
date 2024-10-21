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
  Checkbox,
} from "@material-ui/core";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
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
import { DatePicker, KeyboardTimePicker } from "@material-ui/pickers";

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

class F335DefineShiftManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: 0,
      isLoading: false,
      isReload: false,
      showPass: false,
      request: "",

      // {id:"06:00:00",label:"06:00 AM"},
      //Time Format like Above
      selectedDate: new Date("2014-08-18T21:11:54"),

      label: "",
      startTime: new Date("2014-08-18T09:00:54"),
      endTime: new Date("2014-08-18T18:00:54"),
      startTimeToSend: new Date("2014-08-18T21:11:54"),
      endTimeToSend: new Date("2014-08-18T21:11:54"),

      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",

      selectedDays: [
        {
          id: 1,
          label: "Sunday",
        },
        {
          id: 2,
          label: "Monday",
        },
        {
          id: 3,
          label: "Tuesday",
        },
        {
          id: 4,
          label: "Wednesday",
        },
        {
          id: 5,
          label: "Thurday",
        },
        {
          id: 6,
          label: "Friday",
        },
        {
          id: 7,
          label: "Saturday",
        },
      ],
      dayId: [],
    };
  }

  // icon = (<CheckBoxOutlineBlankIcon fontSize="small" />);
  // checkedIcon = (<CheckBoxIcon fontSize="small" />);

  componentDidMount() {
    console.log(this.state.recordId, "id is coming");
    const data = this.props.match.params.id.split("T");
    console.log(data);
    this.setState({
      ...this.state,
      recordId: data[0],
    });
    this.getEmployeesData();
    // if (Number(data[0]) > 0) {
    //   this.loadData(Number(data[0]), data[1]);
    // }
  }

  handleDateChangeStartTime = (date) => {
    this.setState({ startTime: date });
  };

  handleDateChangeEndTime = (date) => {
    this.setState({ endTime: date });
  };

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   if (this.props.match.params.recordId != nextProps.match.params.recordId) {
  //     if (nextProps.match.params.recordId != 0) {
  //       this.loadData(nextProps.match.params.recordId);
  //       this.setState({
  //         recordId: nextProps.match.params.recordId,
  //       });
  //     } else {
  //       window.location.reload();
  //     }
  //   }
  // }

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

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;

    let regex = "";
    switch (name) {
      case "payrollMonths":
        regex = new RegExp(numberExp);
        if (value && !regex.test(value)) {
          return;
        }
        break;
      case "perMonthSalary":
      case "perHourRate":
        regex = new RegExp(numberWithDecimalExp);
        if (value && !regex.test(value)) {
          return;
        }
        break;
      default:
        break;
    }

    if (name === "loanAmount") {
      if (this.state.months === "") {
        this.setState({
          [name]: value,
          [errName]: "",
          installmentPerMonth: Number(Number(value) / 1).toFixed(2),
        });
      } else {
        this.setState({
          [name]: value,
          [errName]: "",
          installmentPerMonth: Number(
            Number(value) / Number(this.state.months)
          ).toFixed(2),
        });
      }
    } else if (name == "months") {
      this.setState({
        [name]: value,
        [errName]: "",
        installmentPerMonth: Number(
          Number(this.state.loanAmount) / Number(value)
        ).toFixed(2),
      });
    } else {
      this.setState({
        [name]: value,
        [errName]: "",
      });
    }
  };

  // isFormValid = () => {
  //   let isValid = true;
  //   let {
  //     employeeObjectError,
  //     payrollMonthsError,
  //     perMonthSalaryError,
  //     perHourRateError,
  //     payrollCommentsError,
  //   } = this.state;

  //   if (IsEmpty(this.state.employeeObject)) {
  //     employeeObjectError = "Please select employee.";
  //     isValid = false;
  //   } else {
  //     employeeObjectError = "";
  //   }

  //   if (!this.state.payrollMonths) {
  //     isValid = false;
  //     payrollMonthsError = "Please enter number of months.";
  //   } else {
  //     payrollMonthsError = "";
  //   }

  //   if (!this.state.perMonthSalary && !this.state.perHourRate) {
  //     isValid = false;
  //     perMonthSalaryError =
  //       "Please enter Per Month Salary or Enter in Per Hour Rate field.";
  //     perHourRateError =
  //       "Please enter Per Hour Rate  or Enter in Per Month Salary field.";
  //   } else {
  //     perMonthSalaryError = "";
  //     perHourRateError = "";
  //   }

  //   if (!this.state.payrollComments) {
  //     isValid = false;
  //     payrollCommentsError = "Please enter comments.";
  //   } else {
  //     payrollCommentsError = "";
  //   }

  //   this.setState({
  //     employeeObjectError,
  //     payrollMonthsError,
  //     perMonthSalaryError,
  //     perHourRateError,
  //     payrollCommentsError,
  //   });
  //   return isValid;
  // };

  clickOnFormSubmit = () => {
    document.getElementById("btn-submit").click();
  };

  clearAllData = () => {
    this.setState({
      label: "",
      startTime: new Date("2014-08-18T09:00:54"),
      endTime: new Date("2014-08-18T18:00:54"),
      // startTimeToSend: new Date("2014-08-18T21:11:54"),
      // endTimeToSend: new Date("2014-08-18T21:11:54"),

      label: "",
      dayId: [],
      uploadLoading: false,
    });
  };

  timeFormatHandle = (date) => {
    const dateStr = date;

    const dateObj = new Date(dateStr);

    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");

    const time = `${hours}:${minutes}:00`;
    return time;
  };

  onFormSubmit = async () => {
    const startingTime = this.timeFormatHandle(this.state.startTime);
    const endingTime = this.timeFormatHandle(this.state.endTime);

    // const data = new FormData();
    // data.append("label", this.state.label);
    // data.append("startTime", startingTime);
    // data.append("endTime", endingTime);
    // data.append("description", null);
    // console.log("state is coming", startingTime, endingTime);
    const objToSend = {
      startTime: startingTime,
      label: this.state.label,
      endTime: endingTime,
      description: "",
      days: this.state.dayId,
      active: true,
    };
    // for (let i = 0; i < this.state.files3.length; i++) {
    //   data.append("filesName", this.state.files3[i].name);
    //   data.append("files", this.state.files3[i]);
    // }

    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C335CommonEmployeeShiftScheduleSave`;
    await fetch(url, {
      method: "POST",
      body: JSON.stringify(objToSend),
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
        "Content-Type": "application/json",
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

  recommendFormSubmit = async () => {
    const data = new FormData();
    data.append("userEmployeeId", this.state.employeeObject.id);
    data.append("recordId", this.state.recordId);
    data.append("loanAmount", Number(this.state.loanAmount));
    data.append("loanDurationInMonths", Number(this.state.months));

    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C328CommonUsersEmployeesLoanUpdate`;
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

              setTimeout(() => {
                window.location.replace(
                  "#/dashboard/F328EmployeesLoanRecommendation"
                );
              }, 1000);
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

  approveFormSubmit = async () => {
    const data = new FormData();
    data.append("userEmployeeId", this.state.employeeObject.id);
    data.append("recordId", this.state.recordId);
    data.append("loanAmount", Number(this.state.loanAmount));
    data.append("loanDurationInMonths", Number(this.state.months));
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C329CommonUsersEmployeesLoanUpdate`;
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

              setTimeout(() => {
                window.location.replace(
                  "#/dashboard/F329EmployeesLoanApproval"
                );
              }, 1000);
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

  handleFileChange = (event) => {
    const { files = [] } = event.target;
    const fileElement = event.target;
    console.log("fileElement", fileElement);

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        if (
          (files[i].type === "application/pdf" ||
            files[i].type.startsWith("image/")) &&
          files[i].size / 1000 < 10000
        ) {
          if (fileElement.getAttribute("name") === "contained-button-file") {
            this.setState({ files, filesError: "" });
          } else if (
            fileElement.getAttribute("name") ===
            "contained-button-solution-file"
          ) {
            this.setState({ files2: files, files2Error: "" });
          } else if (
            fileElement.getAttribute("name") ===
            "contained-button-helping-material-file"
          ) {
            this.setState({ files3: files, files3Error: "" });
          }
        } else {
          if (fileElement.getAttribute("name") === "contained-button-file") {
            this.setState({
              filesError:
                "Please select only image or PDF files with size less than 10 MB.",
            });
          } else if (
            fileElement.getAttribute("name") ===
            "contained-button-solution-file"
          ) {
            this.setState({
              files2Error:
                "Please select only image or PDF files with size less than 10 MB.",
            });
          } else if (
            fileElement.getAttribute("name") ===
            "contained-button-helping-material-file"
          ) {
            this.setState({
              files3Error:
                "Please select only image or PDF files with size less than 10 MB.",
            });
          }
          break;
        }
      }
    }
  };

  handleDaySelection = (value) => {
    const selectedDayIds = value.map((day) => day.id);
    this.setState({ dayId: selectedDayIds });
  };

  getEmployeesData = async () => {
    this.setState({ employeeDataLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C327CommonUsersView`;
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
    window.location = "#/dashboard/R335ShiftManagementReport";
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
              Add Shift Schedule
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
              {/* <Grid item xs={12}>
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
              </Grid> */}
              <Grid item xs={4}>
                <TextField
                  id="label"
                  name="label"
                  label="Shift Name"
                  // type="number"
                  required
                  fullWidth
                  variant="outlined"
                  onChange={this.onHandleChange}
                  value={this.state.label}
                  // helperText={this.state.loanAmount}
                  // error={this.state.loanAmount}
                  inputProps={{
                    maxLength: 20,
                    min: 0,
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <KeyboardTimePicker
                  id="startTime"
                  name="startTime"
                  label="Shift From"
                  required
                  fullWidth
                  style={{
                    marginTop: "0px",
                  }}
                  variant="outlined"
                  margin="normal"
                  value={this.state.startTime}
                  onChange={this.handleDateChangeStartTime}
                  KeyboardButtonProps={{
                    "aria-label": "change time",
                  }}
                  InputProps={{
                    variant: "outlined",
                  }}
                  inputVariant="outlined"
                />
              </Grid>

              <Grid item xs={4}>
                <KeyboardTimePicker
                  id="endTime"
                  name="endTime"
                  label="Shift To"
                  required
                  fullWidth
                  style={{
                    marginTop: "0px",
                  }}
                  variant="outlined"
                  margin="normal"
                  value={this.state.endTime}
                  onChange={this.handleDateChangeEndTime}
                  KeyboardButtonProps={{
                    "aria-label": "change time",
                  }}
                  InputProps={{
                    variant: "outlined",
                  }}
                  inputVariant="outlined"
                />
              </Grid>
              <Grid item xs={4}>
                <Autocomplete
                  multiple
                  fullWidth
                  id={"daySelector"}
                  options={this.state.selectedDays}
                  value={this?.state?.dayId.map((id) =>
                    this.state.selectedDays.find((day) => day.id === id)
                  )}
                  onChange={(event, value) => this.handleDaySelection(value)}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.label}
                  getOptionSelected={(option, selectedValue) =>
                    option.id === selectedValue.id
                  }
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        label={option.label}
                        color="primary"
                        variant="outlined"
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderOption={(option, { selected }) => (
                    <Fragment>
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        style={{ marginRight: 8 }}
                        checked={selected}
                        color="primary"
                      />
                      {option.label}
                    </Fragment>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Select Days"
                      placeholder="Search and Select"
                    />
                  )}
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
          disableRightButton={
            this.state.dayId.length === 0 || !this.state.label
          }
          bottomRightButtonAction={() =>
            Number(this.state.recordId) === 0
              ? this.onFormSubmit()
              : this.state.request === "isRecommended"
              ? this.recommendFormSubmit()
              : this.state.request === "isApproved"
              ? this.approveFormSubmit()
              : this.onFormSubmit()
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

F335DefineShiftManagement.propTypes = {
  isDrawerOpen: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  match: PropTypes.object,
};

F335DefineShiftManagement.defaultProps = {
  isDrawerOpen: true,
  match: {
    params: {
      recordId: 0,
    },
  },
};

export default withRouter(withStyles(styles)(F335DefineShiftManagement));
