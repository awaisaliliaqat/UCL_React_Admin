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
import { DatePicker } from "@material-ui/pickers";
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

class F348DefineTimetableActivation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: 0,
      isLoading: false,
      isReload: false,
      showPass: false,
      request: "",

      files3: [],
      files3Error: "",
      uploadLoading: false,

      employeeData: [],
      employeeDataLoading: false,
      employeeObject: {},
      employeeObjectError: "",

      employeeId: "",
      loanAmount: "",
      months: "",
      installmentPerMonth: "",

      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",

      fromDate: null,
      toDate: null,
      toDateOptions: [],

      fromDateToSend: null,
      toDateToSend: null,
    };
  }

  componentDidMount() {
    console.log(this.state.recordId, "id is coming");
    const data = this.props.match.params.id.split("T");
    console.log(data);
    this.setState({
      ...this.state,
      recordId: data[0],
    });
    this.getEmployeesData();
    if (Number(data[0]) > 0) {
      this.loadData(Number(data[0]), data[1]);
    }
  }

  filterToDateOptions = () => {
    const { fromDate } = this.state;
    if (fromDate) {
      const filteredOptions = [fromDate];
      this.setState({
        toDateOptions: filteredOptions,
      });
    }
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

  loadData = async (recordId, string) => {
    const data = new FormData();
    data.append("recordId", recordId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C328CommonUsersEmployeesLoanView`;
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
            let data = json.DATA || [];
            if (data.length > 0) {
              let myDataObject = data[0] || {};
              this.setState({
                employeeObject: {
                  id: myDataObject["userEmployeeId"],
                  label: myDataObject["userEmployeeLabel"],
                },
                request: string,
                recordId: recordId,
                loanAmount: myDataObject["loanAmount"],
                months: myDataObject["numberOfMonths"],
                installmentPerMonth:
                  myDataObject["loanAmount"] / myDataObject["numberOfMonths"],
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
              "Failed to Load Data ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

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

    if (!this.state.payrollMonths) {
      isValid = false;
      payrollMonthsError = "Please enter number of months.";
    } else {
      payrollMonthsError = "";
    }

    if (!this.state.perMonthSalary && !this.state.perHourRate) {
      isValid = false;
      perMonthSalaryError =
        "Please enter Per Month Salary or Enter in Per Hour Rate field.";
      perHourRateError =
        "Please enter Per Hour Rate  or Enter in Per Month Salary field.";
    } else {
      perMonthSalaryError = "";
      perHourRateError = "";
    }

    if (!this.state.payrollComments) {
      isValid = false;
      payrollCommentsError = "Please enter comments.";
    } else {
      payrollCommentsError = "";
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

      employeeId: "",
      loanAmount: "",
      months: "",
      installmentPerMonth: "",

      files3: [],
      files3Error: "",
      uploadLoading: false,

      fromDate: null,
      fromDateToSend: null,
      toDate: null,
      toDateToSend: null,
    });
  };

  onFormSubmit = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C348CommonAcademicsTimeTableProgramGroupStatusSave?sessionId=${this.state.employeeObject.sessionId}&programmeGroupStatusId=0&programmeGroupId=${this.state.employeeObject.Id}&statusId=0&pauseDateFrom=${this.state.fromDateToSend}&pauseDateTo=${this.state.toDateToSend}`;
    await fetch(url, {
      method: "POST",
      // body: data,
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
              this.clearAllData();
            } else {
              this.clearAllData();
            }
          } else {
            this.handleSnackbar(
              true,
              json.USER_MESSAGE + "\n" + json.SYSTEM_MESSAGE,
              "error"
            );
          }
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

  getEmployeesData = async () => {
    this.setState({ employeeDataLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C348ProgramGroupView`;
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
    window.location = "#/dashboard/R348TimeTableActivationView";
  };

  onHandleChangeDate = (event) => {
    const { name, value } = event.target;
    const date = new Date(value);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;

    if (name === "fromDate") {
      this.setState({
        fromDateToSend: formattedDate,
        toDate: null,
        toDateToSend: null,
      });
    } else {
      this.setState({
        toDateToSend: formattedDate,
      });

      // this.getDataThroughDate(formattedDate);
    }

    this.setState({
      [name]: value,
    });
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
              Timetable Pause/Unpause
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
                    typeof option.Label == "string" ? option.Label : ""
                  }
                  getOptionSelected={(option, value) => option.Id === value.Id}
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
                        label="Select Programme Group *"
                        {...params}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  autoOk
                  id="fromDate"
                  name="fromDate"
                  label="From Date"
                  invalidDateMessage=""
                  placeholder=""
                  variant="inline"
                  inputVariant="outlined"
                  format="dd-MM-yyyy"
                  fullWidth
                  required
                  value={this.state.fromDate}
                  onChange={(date) =>
                    this.onHandleChangeDate({
                      target: { name: "fromDate", value: date },
                    })
                  }
                />
              </Grid>

              <Grid item xs={6}>
                <DatePicker
                  autoOk
                  id="toDate"
                  name="toDate"
                  label="To Date"
                  invalidDateMessage=""
                  placeholder=""
                  variant="inline"
                  inputVariant="outlined"
                  format="dd-MM-yyyy"
                  fullWidth
                  required
                  disabled={!this.state.fromDate}
                  value={this.state.toDate}
                  onChange={(date) =>
                    this.onHandleChangeDate({
                      target: { name: "toDate", value: date },
                    })
                  }
                  shouldDisableDate={this.shouldDisableDate}
                  minDate={this.state.fromDate}
                />
              </Grid>

              {/* <Grid item xs={4}>
                <TextField
                  id="installmentPerMonth"
                  name="installmentPerMonth"
                  label="Installment Per Month"
                  required
                  fullWidth
                  type="number"
                  variant="outlined"
                  onChange={this.onHandleChange}
                  value={this.state.installmentPerMonth}
                  disabled
                  // helperText={this.state.installmentPerMonth}
                  // error={this.state.installmentPerMonth}
                  inputProps={{
                    maxLength: 11,
                  }}
                />
              </Grid> */}

              {this.state.recordId !== 0 ? (
                ""
              ) : (
                <Grid item xs={12}>
                  <MyDropzone
                    name="contained-button-helping-material"
                    label="Upload file"
                    files={this.state.files3}
                    onChange={(event) => this.handleFileChange(event)}
                    disabled={this.state.uploadLoading}
                    className={classes.inputFileFocused}
                    multiple={true}
                  />
                  <div
                    style={{
                      textAlign: "left",
                      marginTop: 5,
                      fontSize: "0.8rem",
                    }}
                  >
                    <span
                      style={{
                        color: "#f44336",
                      }}
                    >
                      &emsp;{this.state.files3Error}
                    </span>
                  </div>
                </Grid>
              )}
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

F348DefineTimetableActivation.propTypes = {
  isDrawerOpen: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  match: PropTypes.object,
};

F348DefineTimetableActivation.defaultProps = {
  isDrawerOpen: true,
  match: {
    params: {
      recordId: 0,
    },
  },
};

export default withRouter(withStyles(styles)(F348DefineTimetableActivation));
