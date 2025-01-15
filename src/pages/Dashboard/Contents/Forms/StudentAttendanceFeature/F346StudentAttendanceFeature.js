import React, { Component, Fragment } from "react";
import {
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  Grid,
  Button,
  Typography,
  TextField,
  MenuItem,
} from "@material-ui/core";
import { DatePicker, KeyboardTimePicker } from "@material-ui/pickers";
import { format, getDaysInMonth } from "date-fns";

import ExcelIcon from "../../../../../assets/Images/excel.png";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import F346StudentAttendanceFeatureTableComponent from "./F346StudentAttendanceFeatureTableComponent";
import FilterIcon from "mdi-material-ui/FilterOutline";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import Autocomplete from "@material-ui/lab/Autocomplete";

class F346StudentAttendanceFeature extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showTableFilter: false,
      showSearchBar: false,
      isDownloadPdf: false,
      applicationStatusId: 1,
      isLoginMenu: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      tableData: [],
      schoolsMenuItems: [],
      schoolId: "",
      schoolIdError: "",
      programmeGroupId: "",
      programmeGroupIdError: "",
      programmeGroupsMenuItems: [],
      programmeId: "",
      programmeIdError: "",
      programmeMenuItems: [],
      programId: "",
      programIdError: "",
      totalCourseStudent: "Total Students OF 0",
      totalPathwayStudent: "Total Students OF 0",
      totalGroupStudent: "Total Students OF 0",
      totalProgrammeStudent: "Total Students OF 0",
      totalSchoolStudent: "Total Students OF 0",
      coursesMenuItems: [],
      courseId: null,
      courseIdError: "",
      totalStudents: [],
      academicSessionMenuItems: [],
      academicSessionId: "",
      academicSessionIdError: "",
      pathwayMenuItems: [],
      pathwayId: "",
      pathwayIdError: "",
      yearData: [],
      fromDate: new Date(),
      dateAsProp: "",
      fromDateToSend: null,
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
    this.setState({ isOpenSnackbar: false });
  };

  getSchools = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C66CommonSchoolsView`;
    await fetch(url, {
      method: "POST",
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
            this.setState({ schoolsMenuItems: json.DATA || [] });
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
              "error"
            );
          }
          console.log("getCourses", json);
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            //alert('Failed to fetch, Please try again later.');
            this.handleOpenSnackbar(
              "Failed to fetch, Please try again later.",
              "error"
            );
            console.log(error);
          }
        }
      );
    this.setState({ isLoading: false });
  };

  onHandleChangesDate = (event) => {
    const { name, value } = event.target;
    const date = new Date(value);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;

    if (name === "fromDate") {
      this.setState({
        fromDateToSend: formattedDate,
      });
    } else {
      this.setState({
        toDateToSend: formattedDate,
      });
    }

    this.setState({
      [name]: value,
    });
  };

  getProgramGroup = async (schoolId) => {
    this.setState({ isLoading: true, programmeGroupsMenuItems: [] });
    let data = new FormData();
    data.append("schoolId", schoolId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C66CommonProgrammeGroupsView`;
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
            this.setState({ programmeGroupsMenuItems: json.DATA || [] });
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
              "error"
            );
          }
          console.log("getSections", json);
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            //alert('Failed to fetch, Please try again later.');
            this.handleOpenSnackbar(
              "Failed to fetch, Please try again later.",
              "error"
            );
            console.log(error);
          }
        }
      );
    this.setState({ isLoading: false });
  };

  loadAcademicSessions = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C66CommonAcademicSessionsViewV2`;
    await fetch(url, {
      method: "POST",
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
            let array = json.DATA || [];
            let res = array.find((obj) => obj.isActive === 1);
            if (res) {
              this.setState({ academicSessionId: res.ID });
            }
            this.setState({ academicSessionMenuItems: array });
          } else {
            this.handleOpenSnackbar(
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
              "error"
            );
          }
          console.log("loadAcademicSessions", json);
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
              "Failed to fetch ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  getProgrammes = async (sessionId, programmeGroupId) => {
    if (sessionId && programmeGroupId) {
      this.setState({ isLoading: true, programmeMenuItems: [] });
      let data = new FormData();
      data.append("programmeGroupId", programmeGroupId);
      data.append("sessionId", sessionId);
      const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C66CommonProgrammesView`;
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
              this.setState({ programmeMenuItems: json.DATA || [] });
            } else {
              //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
              this.handleOpenSnackbar(
                <span>
                  {json.SYSTEM_MESSAGE}
                  <br />
                  {json.USER_MESSAGE}
                </span>,
                "error"
              );
            }
            console.log("getCourse", json);
          },
          (error) => {
            if (error.status === 401) {
              this.setState({
                isLoginMenu: true,
                isReload: true,
              });
            } else {
              //alert('Failed to fetch, Please try again later.');
              this.handleOpenSnackbar(
                "Failed to fetch, Please try again later.",
                "error"
              );
              console.log(error);
            }
          }
        );
      this.setState({ isLoading: false });
    }
  };

  getCourse = async (sessionId, programmeGroupId) => {
    if (sessionId && programmeGroupId) {
      this.setState({ isLoading: true, coursesMenuItems: [] });
      let data = new FormData();
      data.append("programmeGroupId", programmeGroupId);
      data.append("sessionId", sessionId);
      const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C66CommonProgrammeCoursesView`;
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
              this.setState({ coursesMenuItems: json.DATA || [] });
            } else {
              //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
              this.handleOpenSnackbar(
                <span>
                  {json.SYSTEM_MESSAGE}
                  <br />
                  {json.USER_MESSAGE}
                </span>,
                "error"
              );
            }
            console.log("getCourse", json);
          },
          (error) => {
            if (error.status === 401) {
              this.setState({
                isLoginMenu: true,
                isReload: true,
              });
            } else {
              //alert('Failed to fetch, Please try again later.');
              this.handleOpenSnackbar(
                "Failed to fetch, Please try again later.",
                "error"
              );
              console.log(error);
            }
          }
        );
      this.setState({ isLoading: false });
    }
  };

  loadPathway = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C66CommonUolEnrollmentPathwayView`;
    await fetch(url, {
      method: "POST",
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
            this.setState({ pathwayMenuItems: json.DATA || [] });
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
              "error"
            );
          }
          console.log("loadPathway", json);
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            //alert('Failed to fetch, Please try again later.');
            this.handleOpenSnackbar(
              "Failed to fetch, Please try again later.",
              "error"
            );
            console.log(error);
          }
        }
      );
    this.setState({ isLoading: false });
  };

  getData = async () => {
    this.setState({ isLoading: true });
    const formattedDate = this.state.fromDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });

    const url = `${process.env.REACT_APP_API_DOMAIN}/${
      process.env.REACT_APP_SUB_API_NAME
    }/payroll/C346StudentAttendanceFeature?academicSessionId=${
      this.state.academicSessionId
    }&schoolId=${this.state.schoolId}&programmeGroupId=${
      this.state.programmeGroupId
    }&programmeId=${this.state.programmeId}&courseId=${
      this?.state?.courseId ? this.state.courseId.id : 0
    }&month=${formattedDate}`;
    console.log(url);
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
              tableData: json.DATA || [],
              dateAsProp: formattedDate,
            });
          } else {
            this.handleOpenSnackbar(
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
              "error"
            );
          }
          console.log("getData", json);
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            this.handleOpenSnackbar(
              "Failed to fetch, Please try again later.",
              "error"
            );
            console.log(error);
          }
        }
      );
    this.setState({ isLoading: false });
  };

  handleSetUserId = (value) => {
    this.setState({
      courseId: value,
      courseIdError: "",
      tableData: [],
      totalCourseStudent: "Total Students OF 0",
      totalPathwayStudent: "Total Students OF 0",
      totalGroupStudent: "Total Students OF 0",
      totalProgrammeStudent: "Total Students OF 0",
      totalSchoolStudent: "Total Students OF 0",
    });

    console.log("value", value);
    if (value != null && value != "undefined") {
      this.setState({ userIds: value.id });
      // }
    }
  };

  onClearAllData() {
    let activeSessionId = "";
    if (
      this.state.academicSessionMenuItems &&
      this.state.academicSessionMenuItems.length > 0
    ) {
      let res = this.state.academicSessionMenuItems.find(
        (obj) => obj.isActive === 1
      );
      if (res.ID != null) {
        activeSessionId = res.ID;
      }
    }

    this.setState({
      totalCourseStudent: "Total Students OF 0",
      totalPathwayStudent: "Total Students OF 0",
      totalGroupStudent: "Total Students OF 0",
      totalProgrammeStudent: "Total Students OF 0",
      totalSchoolStudent: "Total Students OF 0",
      academicSessionId: activeSessionId,
      academicSessionIdError: "",
      pathwayId: "",
      pathwayIdError: "",
      schoolId: "",
      schoolIdError: "",
      programmeGroupId: "",
      programmeGroupIdError: "",
      programmeGroupsMenuItems: [],
      courseId: null,
      courseIdError: "",
      coursesMenuItems: [],
      programmeMenuItems: [],
      programmeId: "",
      programmeIdError: "",
      tableData: [],
    });
  }

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    switch (name) {
      case "academicSessionId":
        this.setState({
          totalCourseStudent: "Total Students OF 0",
          totalPathwayStudent: "Total Students OF 0",
          totalGroupStudent: "Total Students OF 0",
          totalProgrammeStudent: "Total Students OF 0",
          totalSchoolStudent: "Total Students OF 0",
          pathwayId: "",
          pathwayIdError: "",
          schoolId: "",
          schoolIdError: "",
          programmeGroupId: "",
          programmeGroupIdError: "",
          programmeGroupsMenuItems: [],
          courseId: null,
          courseIdError: "",
          coursesMenuItems: [],
          programmeMenuItems: [],
          programmeId: "",
          programmeIdError: "",
          tableData: [],
        });

        break;
      case "schoolId":
        this.setState({
          totalCourseStudent: "Total Students OF 0",
          totalPathwayStudent: "Total Students OF 0",
          totalGroupStudent: "Total Students OF 0",
          totalProgrammeStudent: "Total Students OF 0",
          totalSchoolStudent: "Total Students OF 0",
          programmeGroupId: "",
          programmeGroupIdError: "",
          courseId: null,
          courseIdError: "",
          coursesMenuItems: [],
          programmeMenuItems: [],
          programmeId: "",
          programmeIdError: "",
          tableData: [],
        });
        this.getProgramGroup(value);
        break;
      case "programmeGroupId":
        this.setState({
          totalCourseStudent: "Total Students OF 0",
          totalPathwayStudent: "Total Students OF 0",
          totalGroupStudent: "Total Students OF 0",
          totalProgrammeStudent: "Total Students OF 0",
          totalSchoolStudent: "Total Students OF 0",
          programmeGroupIdError: "",
          courseId: null,
          courseIdError: "",
          programmeId: "",
          programmeIdError: "",
          tableData: [],
        });
        this.getProgrammes(this.state.academicSessionId, value);
        this.getCourse(this.state.academicSessionId, value);
        break;
      case "programmeId":
        this.setState({
          tableData: [],
          totalCourseStudent: "Total Students OF 0",
          totalPathwayStudent: "Total Students OF 0",
          totalGroupStudent: "Total Students OF 0",
          totalProgrammeStudent: "Total Students OF 0",
          totalSchoolStudent: "Total Students OF 0",
        });
        break;
      case "courseId":
        this.setState({
          tableData: [],
          totalCourseStudent: "Total Students OF 0",
          totalPathwayStudent: "Total Students OF 0",
          totalGroupStudent: "Total Students OF 0",
          totalProgrammeStudent: "Total Students OF 0",
          totalSchoolStudent: "Total Students OF 0",
        });
        break;
      case "pathwayId":
        this.setState({
          tableData: [],
          totalCourseStudent: "Total Students OF 0",
          totalPathwayStudent: "Total Students OF 0",
          totalGroupStudent: "Total Students OF 0",
          totalProgrammeStudent: "Total Students OF 0",
          totalSchoolStudent: "Total Students OF 0",
        });
        break;
      default:
        break;
    }
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  isSchoolValid = () => {
    let isValid = true;
    if (!this.state.schoolId) {
      this.setState({ schoolIdError: "Please select school." });
      document.getElementById("schoolId").focus();
      isValid = false;
    } else {
      this.setState({ schoolIdError: "" });
    }
    return isValid;
  };

  isSectionValid = () => {
    let isValid = true;
    if (!this.state.programmeGroupId) {
      this.setState({
        programmeGroupIdError: "Please select programme group.",
      });
      document.getElementById("programmeGroupId").focus();
      isValid = false;
    } else {
      this.setState({ programmeGroupIdError: "" });
    }
    return isValid;
  };

  isAssignmentValid = () => {
    let isValid = true;
    if (!this.state.programId) {
      this.setState({ programIdError: "Please select program." });
      document.getElementById("programId").focus();
      isValid = false;
    } else {
      this.setState({ programIdError: "" });
    }
    return isValid;
  };

  handleGetData = () => {
    if (
      !this.isSchoolValid()
      //!this.isSectionValid() ||
      //!this.isAssignmentValid()
    ) {
      return;
    }
    this.getData();
  };

  handleToggleTableFilter = () => {
    this.setState({ showTableFilter: !this.state.showTableFilter });
  };

  handleToggleSearchBar = () => {
    this.setState({ showSearchBar: !this.state.showSearchBar });
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.getSchools();
    this.loadAcademicSessions();
    this.loadPathway();
  }

  navigate = (id) => {
    console.log(id);
    window.open(
      `#/dashboard/R346StudentDetailReport/${id}T${this.state.dateAsProp}`,
      "_blank"
    );
  };

  render() {
    const columns = [
      { name: "nucluesId", title: "Nucleus ID" },
      { name: "studentName", title: "Student Name" },
      { name: "programmeLabel", title: "Programme" },
      { name: "presentDays", title: "Gate Attendance Days " },
      { name: "scheduledDays", title: "Scheduled Days " },
      { name: "attendedDays", title: "Attended Days" },
      { name: "totalDays", title: "Total Days" },
      {
        name: "Actions",
        title: "Details",
        getCellValue: (rowData) => {
          return (
            <Button
              variant="outlined"
              onClick={() => this.navigate(rowData.nucluesId)}
            >
              View
            </Button>
          );
        },
      },

      // { name: "schoolLabel", title: "School" },
      // { name: "programmeGroupLabel", title: "Program Group" },
      //{ name: "dateOfAdmission", title: "Date of Admission" },
      // { name: "statusLabel", title: "Status" }
    ];

    return (
      <Fragment>
        <LoginMenu
          reload={this.state.isReload}
          open={this.state.isLoginMenu}
          handleClose={() => this.setState({ isLoginMenu: false })}
        />
        <div
          style={{
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
              variant="h5"
            >
              {/* 
              <Tooltip title="Back">
                <IconButton onClick={() => window.history.back()}>
                  <ArrowBackIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip> 
              */}
              Student Gate Attendance Summary
              <br />
            </Typography>

            <div style={{ float: "right" }}>
              {/* 
              <Tooltip title="Search Bar">
                  <IconButton
                      onClick={this.handleToggleSearchBar}
                  >
                      <FilterIcon fontSize="default" color="primary"/>
                  </IconButton>
              </Tooltip> 
              */}

              <Tooltip title="Table Filter">
                <IconButton
                  style={{ marginLeft: "-10px" }}
                  onClick={this.handleToggleTableFilter}
                >
                  <FilterIcon fontSize="default" color="primary" />
                </IconButton>
              </Tooltip>
              {/* {this.state.programmeGroupId ? (
                <Tooltip title="Export PDFD">
                  {this.state.isDownloadPdf ? (
                    <CircularProgress
                      size={14}
                      style={{
                        cursor: `${
                          this.state.isDownloadPdf ? "wait" : "pointer"
                        }`,
                      }}
                    />
                  ) : (
                    <img
                      alt=""
                      src={ExcelIcon}
                      onClick={() => this.downloadPDFData()}
                      disabled="false"
                      style={{
                        height: 22,
                        width: 22,
                        marginBottom: -7,
                        cursor: `${
                          this.state.isDownloadPdf ? "wait" : "pointer"
                        }`,
                      }}
                    />
                  )}
                </Tooltip>
              ) : (
                ""
              )} */}
            </div>
          </div>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
            }}
          />
          <br />
          <Grid container justifyContent="left" alignItems="left" spacing={2}>
            <Grid item xs={12} md={2}>
              <TextField
                id="academicSessionId"
                name="academicSessionId"
                variant="outlined"
                label="Academic Session"
                fullWidth
                select
                onChange={this.onHandleChange}
                value={this.state.academicSessionId}
                error={!!this.state.academicSessionIdError}
                helperText={
                  this.state.academicSessionIdError
                    ? this.state.academicSessionIdError
                    : " "
                }
                disabled={this.state.isLoading}
              >
                {this.state.academicSessionMenuItems &&
                  this.state.academicSessionMenuItems.map((dt) => (
                    <MenuItem
                      key={"academicSessionMenuItems" + dt.ID}
                      value={dt.ID}
                    >
                      {dt.Label}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                id="schoolId"
                name="schoolId"
                variant="outlined"
                label="School"
                onChange={this.onHandleChange}
                value={this.state.schoolId}
                error={!!this.state.schoolIdError}
                helperText={
                  this.state.schoolIdError ? this.state.schoolIdError : " "
                }
                disabled={this.state.isLoading}
                required
                fullWidth
                select
              >
                {this.state.schoolsMenuItems &&
                  this.state.schoolsMenuItems.map((dt) => (
                    <MenuItem key={"schoolsMenuItems" + dt.id} value={dt.id}>
                      {dt.label}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                id="programmeGroupId"
                name="programmeGroupId"
                variant="outlined"
                label="Program Group"
                fullWidth
                select
                onChange={this.onHandleChange}
                value={this.state.programmeGroupId}
                error={!!this.state.programmeGroupIdError}
                helperText={
                  this.state.programmeGroupIdError
                    ? this.state.programmeGroupIdError
                    : " "
                }
                disabled={!this.state.schoolId || this.state.isLoading}
                required
              >
                {this.state.programmeGroupsMenuItems &&
                  this.state.programmeGroupsMenuItems.map((dt) => (
                    <MenuItem
                      key={"programmeGroupsMenuItems" + dt.id}
                      value={dt.id}
                    >
                      {dt.label}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                id="programmeId"
                name="programmeId"
                variant="outlined"
                label="Programme "
                fullWidth
                select
                onChange={this.onHandleChange}
                value={this.state.programmeId}
                error={!!this.state.programmeIdError}
                helperText={
                  this.state.programmeIdError
                    ? this.state.programmeIdError
                    : " "
                }
                disabled={!this.state.programmeGroupId || this.state.isLoading}
              >
                {this.state.programmeMenuItems &&
                  this.state.programmeMenuItems.map((dt) => (
                    <MenuItem key={"programmeMenuItems" + dt.ID} value={dt.ID}>
                      {dt.Label}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={3}>
              <Autocomplete
                fullWidth
                id="courseId"
                options={this.state.coursesMenuItems}
                value={this.state.courseId}
                onChange={(event, value) => this.handleSetUserId(value)}
                disabled={this.state.isEditMode || this.state.isLoading}
                loading={this.state.isLoading}
                // disableCloseOnSelect
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Course"
                    placeholder="Search and Select"
                    error={!!this.state.courseIdError}
                    helperText={this.state.courseIdError}
                  />
                )}
              />
              <TextField
                type="hidden"
                name="userId"
                value={this.state.userIds}
              />
            </Grid>
          </Grid>
          <Grid container justifyContent="left" alignItems="left" spacing={2}>
            <Grid item xs={12} md={2}>
              <DatePicker
                autoOk
                id="fromDate"
                // disabled={this.state.fromDate}
                name="fromDate"
                label="Month"
                invalidDateMessage=""
                placeholder=""
                variant="inline"
                inputVariant="outlined"
                format="MM-yyyy"
                views={["year", "month"]}
                fullWidth
                required
                value={this.state.fromDate}
                onChange={(date) =>
                  this.onHandleChangesDate({
                    target: { name: "fromDate", value: date },
                  })
                }
              />
            </Grid>

            <Grid item xs={12} md={1}>
              <Button
                variant="contained"
                color="primary"
                disabled={
                  this.state.isLoading ||
                  !this.state.programmeGroupId ||
                  !this.state.fromDate
                  // !this.state.programId
                }
                onClick={() => this.handleGetData()}
                style={{ width: "100%", height: 54, marginBottom: 24 }}
              >
                {this.state.isLoading ? (
                  <CircularProgress style={{ color: "white" }} size={36} />
                ) : (
                  "Search"
                )}
              </Button>
            </Grid>
            <Grid item xs={12} md={1}>
              <Button
                variant="contained"
                color="default"
                disabled={this.state.isLoading}
                onClick={() => this.onClearAllData()}
                style={{ width: "100%", height: 54, marginBottom: 24 }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>

          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
            }}
          />

          {this.state.tableData && !this.state.isLoading ? (
            <F346StudentAttendanceFeatureTableComponent
              data={this.state.tableData}
              columns={columns}
              showFilter={this.state.showTableFilter}
            />
          ) : (
            <Grid container justifyContent="center">
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <br />
                <CircularProgress disableShrink />
              </Grid>
            </Grid>
          )}
          <CustomizedSnackbar
            isOpen={this.state.isOpenSnackbar}
            message={this.state.snackbarMessage}
            severity={this.state.snackbarSeverity}
            handleCloseSnackbar={() => this.handleCloseSnackbar()}
          />
        </div>
      </Fragment>
    );
  }
}
export default F346StudentAttendanceFeature;
