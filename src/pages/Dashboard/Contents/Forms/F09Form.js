import React, { Component, Fragment, useState, useEffect } from "react";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import { numberFreeExp } from "../../../../utils/regularExpression";
import {TextField, Grid, MenuItem, CircularProgress, Divider, Typography,
  Chip, Select, IconButton, Tooltip, Checkbox, Fab, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import BottomBar from "../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 500,
    border: '1px solid '+theme.palette.common.white
  },
  body: {
    fontSize: 14,
    border: '1px solid '+theme.palette.primary.main,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const styles = () => ({
  root: {
    padding: 20,
    minWidth: 350,
    overFlowX: "auto",
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
  table: {
    minWidth: 750,
  }
});

function CourseRow(props) {
  const {
    rowIndex,
    rowData,
    onDelete,
    programmeCoursesArray,
    choiceGroupIdMenuItems,
    ...rest
  } = props;

  console.log("props", props);

  let cLabel = "";
  let cCredit = "";
  let cProgrammeCoursesArray = [];

  for (let i = 0; i < programmeCoursesArray.length; i++) {
    if (programmeCoursesArray[i].ID == rowData.courseId) {
      cLabel = programmeCoursesArray[i].courseLabel;
      cCredit = programmeCoursesArray[i].courseCreditLabel;
      cProgrammeCoursesArray = programmeCoursesArray[i].coursePrerequisitesList;
      break;
    }
  }

  const getChoiceGroupLabel = (id) => {
    let res = choiceGroupIdMenuItems.find( (x) => x.ID == id);
    if(res){
      return res.Label;
    }
    return "";
  }

  useEffect(() => {});

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return (
      <StyledTableRow key={rowData}>
        <StyledTableCell component="th" scope="row" align="center">
            {rowIndex + 1}:
        </StyledTableCell>
        <StyledTableCell align="center">
          {cLabel}
          <TextField type="hidden" name="programmeCourseId" value={rowData.courseId}/>
        </StyledTableCell>
        <StyledTableCell align="center">
          {cCredit}
        </StyledTableCell>
        <StyledTableCell align="center">
          {cProgrammeCoursesArray.map((option, index) => (<span key={option+index}>{index != 0 ? <br /> : ""} {option.Label}</span>))}
        </StyledTableCell>
        <StyledTableCell align="center">
          {getChoiceGroupLabel(rowData.choiceGroupId)}
          <TextField type="hidden" name="choiceGroupId" value={rowData.choiceGroupId ? rowData.choiceGroupId : 0}/>
        </StyledTableCell>
        <StyledTableCell align="center">
          <Tooltip title="Delete">
            <Fab 
              color="secondary"
              aria-label="Delete"
              size="small"
              style={{
                height:36,
                width:36,
                margin:4
              }}
              onClick={() => onDelete(rowIndex)}
            >
              <DeleteIcon fontSize="small" />
            </Fab>
          </Tooltip>
        </StyledTableCell>
      </StyledTableRow>
  );
}

class F09Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: this.props.match.params.recordId,
      isLoading: false,
      isReload: false,
      label: "",
      labelError: "",
      shortLabel: "",
      shortLabelError: "",
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      academicSessionIdMenuItems: [],
      academicSessionId: "",
      academicSessionIdError: "",
      programmeGroupIdMenuItems: [],
      programmeGroupId: "",
      programmeGroupIdError: "",
      preCourseId: "",
      preCourseIdField: "",
      preCourseIdError: "",
      preCourseLabel: "",
      preChoiceGroupId: "",
      preChoiceGroupIdError: "",
      preChoiceGroupIdMenuItems: [],
      programmeCoursesArray: [],
      programmeCoursesListArray: [],
      programmeCoursesArraySelected: null,
      programmeCoursesError: "",
      courseRowDataArray: [],
      prerequisiteCourseArray: [],
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

  loadAcademicSession = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C09CommonAcademicSessionsView`;
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
            this.setState({ academicSessionIdMenuItems: json.DATA });
            console.log(json.DATA);
            for (
              var i = 0;
              i < this.state.academicSessionIdMenuItems.length;
              i++
            ) {
              if (this.state.academicSessionIdMenuItems[i].isActive == "1") {
                var tempid = this.state.academicSessionIdMenuItems[i].ID;
                this.loadProgrammeGroups(tempid);
                this.state.academicSessionId = tempid;
              }
            }
          } else {
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,
              "error"
            );
          }
          console.log("loadAcademicSession", json);
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

  loadProgrammeGroups = async (AcademicSessionId) => {
    this.setState({ isLoading: true });
    let data = new FormData();
    data.append("academicsSessionId", AcademicSessionId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C09CommonAcademicsSessionsOfferedProgrammesGroupView`;
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
            this.setState({ programmeGroupIdMenuItems: json.DATA });
          } else {
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,
              "error"
            );
          }
          console.log("loadProgrammeGroups", json);
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

  loadProgrammeCourses = async (programmeGroupId) => {
    let data = new FormData();
    data.append("programmeGroupId", programmeGroupId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C09CommonProgrammeCoursesView`;
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
            this.setState({ programmeCoursesArray: json.DATA || []});
            let prerequisiteCourseArray = [];
            for (let i = 0; i < json.DATA.length; i++) {
              let obj = {
                ID: json.DATA[i].ID,
                Label: json.DATA[i].courseLabel,
              };
              prerequisiteCourseArray.push(obj);
            }
            this.setState({
              programmeCoursesListArray: prerequisiteCourseArray,
            });
            console.log("programmeCoursesListArray", prerequisiteCourseArray);
          } else {
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,
              "error"
            );
          }
          console.log("loadProgrammeCourses", json);
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

  loadChoiceGroup = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C09CommonCourseSelectionGroupChoicesView`;
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
            this.setState({ preChoiceGroupIdMenuItems: json.DATA });
          } else {
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,
              "error"
            );
          }
          console.log("loadChoiceGroup", json);
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

  loadData = async (index) => {
    const data = new FormData();
    data.append("id", index);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C09CommonCourseSelectionGroupView`;
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
            if (json.DATA.length) {
              this.loadProgrammeCourses(json.DATA[0].programmeGroupId);
              this.setState({
                academicSessionId: json.DATA[0].academicSessionId,
                label: json.DATA[0].label,
                shortLabel: json.DATA[0].shortLabel,
                programmeGroupId: json.DATA[0].programmeGroupId,
                courseRowDataArray: json.DATA[0].programmeCourseSelectedArray,
              });
            } else {
              window.location = "#/dashboard/F09Form/0";
            }
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

  isAcademicSessionValid = () => {
    let isValid = true;
    if (!this.state.academicSessionId) {
      this.setState({
        academicSessionIdError: "Please select Academic Session.",
      });
      document.getElementById("academicSessionId").focus();
      isValid = false;
    } else {
      this.setState({ academicSessionIdError: "" });
    }
    return isValid;
  };

  isProgrammeValid = () => {
    let isValid = true;
    if (!this.state.programmeGroupId) {
      this.setState({ programmeGroupIdError: "Please select Programme." });
      document.getElementById("programmeGroupId").focus();
      isValid = false;
    } else {
      this.setState({ programmeGroupIdError: "" });
    }
    return isValid;
  };

  islabelValid = () => {
    let isValid = true;
    if (!this.state.label) {
      this.setState({ labelError: "Please enter Course Selection Group." });
      document.getElementById("label").focus();
      isValid = false;
    } else {
      this.setState({ labelError: "" });
    }
    return isValid;
  };

  isshortLabelValid = () => {
    let isValid = true;
    if (!this.state.shortLabel) {
      this.setState({ shortLabelError: "Please enter Short Name." });
      document.getElementById("shortLabel").focus();
      isValid = false;
    } else {
      this.setState({ shortLabelError: "" });
    }
    return isValid;
  };

  isProgrammeCourseValid = () => {
    let isValid = true;
    if (!this.state.preCourseIdField) {
      this.setState({ preCourseIdError: "Please select Course." });
      document.getElementById("preCourseId").focus();
      isValid = false;
    } else {
      this.setState({ preCourseIdError: "" });
    }
    return isValid;
  };

  isChoiceGroupValid = () => {
    let isValid = true;
    if (!this.state.preChoiceGroupId) {
      this.setState({ preChoiceGroupIdError: "Please select choice group." });
      document.getElementById("preChoiceGroupId").focus();
      isValid = false;
    } else {
      this.setState({ preChoiceGroupIdError: "" });
    }
    return isValid;
  };

  isCoursesListValid = () => {
    let programmeCourseId = document.getElementsByName("programmeCourseId");
    let isValid = true;
    if (programmeCourseId.length == 0) {
      this.handleOpenSnackbar("Please add one course in list.", "error");
      document.getElementById("preCourseId").focus();
      isValid = false;
    }
    return isValid;
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    let regex = "";
    switch (name) {
      case "programmeGroupId":
        this.loadProgrammeCourses(value);
        this.setState({
          preCourseId: "",
          preCourseLabel: "",
          courseRowDataArray: [],
        });
        break;
      case "academicSessionId":
        this.loadProgrammeGroups(value);

        break;
      default:
        break;
    }

    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  onPreCourseChange = (v) => {
    this.setState({
      preCourseLabel: v.Label,
      preCourseIdError: "",
    });

    if ((v = "")) {
      this.setState({ preCourseId: "" });
    }
  };

  onPreCourseIdChange = (v) => {
    this.setState({
      preCourseId: v,
      preCourseIdError: "",
      preCourseIdField: v.ID,
    });
  };

  handeAddCourseRow = () => {
    if (
      !this.isProgrammeCourseValid()
      //|| !this.isChoiceGroupValid()
    ) {
      return;
    }

    let courseRowDataArray = this.state.courseRowDataArray;
    let preCourseId = this.state.preCourseIdField;
    let preChoiceGroupId = this.state.preChoiceGroupId;

    let programmeCourseId = document.getElementsByName("programmeCourseId");
    for (let i = 0; i < programmeCourseId.length; i++) {
      if (programmeCourseId[i].value == preCourseId) {
        this.handleOpenSnackbar("Course already added.", "error");
        return;
      }
    }

    let courseRowDataObject = {
      courseId: preCourseId,
      choiceGroupId: preChoiceGroupId,
    };
    courseRowDataArray.push(courseRowDataObject);
    this.setState({
      courseRowDataArray: courseRowDataArray,
      preCourseLabel: "",
      preCourseId: "",
      preCourseIdField: "",
      preChoiceGroupId: "",
    });
    console.log("courseRowDataObject", courseRowDataObject);
  };

  handeDeleteCourseRow = (index) => {
    let courseRowDataArray = this.state.courseRowDataArray;
    courseRowDataArray.splice(index, 1);
    this.setState({ courseRowDataArray: courseRowDataArray });
    if (courseRowDataArray) {
      this.setState({ isAcademicSessionAndProgrammeChangeable: true });
    }
  };

  clickOnFormSubmit = () => {
    this.onFormSubmit();
  };

  onFormSubmit = async (e) => {
    if (
      !this.isAcademicSessionValid() ||
      !this.isProgrammeValid() ||
      !this.islabelValid() ||
      !this.isshortLabelValid() ||
      !this.isCoursesListValid()
    ) {
      return;
    }
    let myForm = document.getElementById("myForm");
    const data = new FormData(myForm);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C09CommonCourseSelectionGroupSave`;
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
            setTimeout(() => {
              if (this.state.recordId != 0) {
                window.location = "#/dashboard/F09Reports";
              } else {
                window.location.reload();
              }
            }, 2000);
          } else {
            this.handleOpenSnackbar(
              json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,
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
    window.location = "#/dashboard/F09Reports";
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.loadAcademicSession();
    //this.loadProgrammeGroups();
    this.loadChoiceGroup();
    if (this.state.recordId != 0) {
      this.loadData(this.state.recordId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.recordId != nextProps.match.params.recordId) {
      if (nextProps.match.params.recordId != 0) {
        this.props.setDrawerOpen(false);
        this.loadData(nextProps.match.params.recordId);
      } else {
        window.location.reload();
      }
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <LoginMenu
          reload={this.state.isReload}
          open={this.state.isLoginMenu}
          handleClose={() => this.setState({ isLoginMenu: false })}
        />
        <form id="myForm" onSubmit={this.isFormValid}>
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
              Define Course Selection Group
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
                marginRight: 10,
              }}
            >
              <Grid item xs={12} md={6}>
                <TextField
                  id="academicSessionId"
                  name="academicSessionId"
                  variant="outlined"
                  label="Academic Session"
                  onChange={this.onHandleChange}
                  value={this.state.academicSessionId}
                  error={!!this.state.academicSessionIdError}
                  helperText={this.state.academicSessionIdError}
                  required
                  fullWidth
                  select
                >
                  {this.state.academicSessionIdMenuItems.map((dt, i) => (
                    <MenuItem
                      key={"academicSessionIdMenuItems" + dt.ID}
                      value={dt.ID}
                    >
                      {dt.Label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="programmeGroupId"
                  name="programmeGroupId"
                  variant="outlined"
                  label="Programme Group"
                  onChange={this.onHandleChange}
                  value={this.state.programmeGroupId}
                  error={!!this.state.programmeGroupIdError}
                  helperText={this.state.programmeGroupIdError}
                  disabled={!this.state.academicSessionId}
                  required
                  fullWidth
                  select
                >
                  {this.state.programmeGroupIdMenuItems ? (
                    this.state.programmeGroupIdMenuItems.map((dt, i) => (
                      <MenuItem
                        key={"programmeGroupIdMenuItems" + dt.Id}
                        value={dt.Id}
                      >
                        {dt.Label}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>
                      <CircularProgress size={24} />
                    </MenuItem>
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="label"
                  name="label"
                  label="Course Selection Group"
                  required
                  fullWidth
                  variant="outlined"
                  onKeyDown={this.StopEnter}
                  onChange={this.onHandleChange}
                  value={this.state.label}
                  error={!!this.state.labelError}
                  helperText={this.state.labelError}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="shortLabel"
                  name="shortLabel"
                  label="Short Name"
                  required
                  fullWidth
                  variant="outlined"
                  onKeyDown={this.StopEnter}
                  onChange={this.onHandleChange}
                  value={this.state.shortLabel}
                  error={!!this.state.shortLabelError}
                  helperText={this.state.shortLabelError}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider
                  style={{
                    backgroundColor: "rgb(58, 127, 187)",
                    opacity: "0.3",
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  freeSolo
                  id="preCourseId"
                  disableClearable
                  disabled={!this.state.programmeGroupId}
                  options={this.state.programmeCoursesListArray}
                  getOptionLabel={(option) => typeof option.Label === 'string' ? option.Label : ""}
                  value={this.state.preCourseId}
                  onChange={(event, newValue) => {
                    this.onPreCourseIdChange(newValue);
                  }}
                  inputValue={this.preCourseLabel}
                  onInputChange={(event, newInputValue) => {
                    this.onPreCourseChange(newInputValue);
                  }}
                  style={{ marginTop: "-1em", marginBottom: "-1em" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Course"
                      placeholder="Search and Select"
                      margin="normal"
                      variant="outlined"
                      required
                      InputProps={{ ...params.InputProps, type: "search" }}
                      error={!!this.state.preCourseIdError}
                      helperText={
                        this.state.preCourseIdError
                          ? this.state.preCourseIdError
                          : ""
                      }
                    />
                  )}
                />
                <TextField
                  type="hidden"
                  id="preCourseIdHidden"
                  value={this.state.preCourseIdField}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  id="preChoiceGroupId"
                  name="preChoiceGroupId"
                  variant="outlined"
                  label="Choice Group"
                  onChange={this.onHandleChange}
                  value={this.state.preChoiceGroupId}
                  error={!!this.state.preChoiceGroupIdError}
                  helperText={this.state.preChoiceGroupIdError}
                  required
                  fullWidth
                  select
                >
                  {this.state.preChoiceGroupIdMenuItems ? (
                    this.state.preChoiceGroupIdMenuItems.map((dt, i) => (
                      <MenuItem key={"PCGID" + dt.ID} value={dt.ID}>
                        {dt.Label}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>
                      <CircularProgress size={24} />
                    </MenuItem>
                  )}
                </TextField>
              </Grid>
              <Grid item xs={1} style={{ textAlign: "center" }}>
                <IconButton
                  color="primary"
                  aria-label="Add"
                  component="span"
                  onClick={this.handeAddCourseRow}
                >
                  <Tooltip title="Add New">
                    <Fab color="primary" aria-label="add" size="small">
                      <AddIcon />
                    </Fab>
                  </Tooltip>
                </IconButton>
              </Grid>
              <Grid item xs={12}>
                <Divider
                  style={{
                    backgroundColor: "rgb(58, 127, 187)",
                    opacity: "0.3",
                  }}
                />
              </Grid>
              {/* <Grid
                  container
                  direction="row"
                  justify="space-evenly"
                  alignItems="center"
                >
                  <Grid item xs={1} md={1}>
                    <Typography color="primary" variant="title">
                      SR#
                    </Typography>
                  </Grid>
                  <Grid item xs={3} md={3}>
                    <Typography color="primary" variant="title">
                      Course
                    </Typography>
                  </Grid>
                  <Grid item xs={2} md={2}>
                    <Typography color="primary" variant="title">
                      Credit
                    </Typography>
                  </Grid>
                  <Grid item xs={3} md={3}>
                    <Typography color="primary" variant="title">
                      Prerequisite Courses
                    </Typography>
                  </Grid>
                  <Grid item xs={2} md={2}>
                    <Typography color="primary" variant="title">
                      Choice Group
                    </Typography>
                  </Grid>
                  <Grid item xs={1} md={1} style={{ textAlign: "center" }}>
                    <Typography color="primary" variant="title">
                      Action
                    </Typography>
                  </Grid>
              </Grid> */}
              <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center" style={{borderLeft: '1px solid rgb(29, 95, 152)'}}>SR#</StyledTableCell>
                      <StyledTableCell align="center">Course</StyledTableCell>
                      <StyledTableCell align="center">Credit</StyledTableCell>
                      <StyledTableCell align="center">Prerequisite Courses</StyledTableCell>
                      <StyledTableCell align="center"> Choice Group</StyledTableCell>
                      <StyledTableCell align="center" style={{borderRight:'1px solid rgb(29, 95, 152)', minWidth:100}}>Action</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {this.state.courseRowDataArray.length > 0 ? (
                    this.state.courseRowDataArray.map((dt, i) => (
                      <CourseRow
                        key={"CRDA"+dt+i}
                        rowIndex={i}
                        rowData={dt}
                        onDelete={(i) => this.handeDeleteCourseRow(i)}
                        programmeCoursesArray={this.state.programmeCoursesArray}
                        choiceGroupIdMenuItems={this.state.preChoiceGroupIdMenuItems}
                      />
                    ))
                  ) : 
                  this.state.isLoading ? 
                    <StyledTableRow key={1}>
                      <StyledTableCell component="th" scope="row" colSpan={6}><center><CircularProgress/></center></StyledTableCell>
                    </StyledTableRow>
                    :
                    <StyledTableRow key={1}>
                      <StyledTableCell component="th" scope="row" colSpan={6}><center><b>No Data</b></center></StyledTableCell>
                    </StyledTableRow>
                  }
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <br />
            <br />
          </Grid>
        </form>
        <BottomBar
          left_button_text="View"
          left_button_hide={false}
          bottomLeftButtonAction={this.viewReport}
          right_button_text="Save"
          bottomRightButtonAction={this.clickOnFormSubmit}
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
export default withStyles(styles)(F09Form);
