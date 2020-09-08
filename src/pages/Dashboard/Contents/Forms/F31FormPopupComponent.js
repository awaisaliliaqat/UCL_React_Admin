import React, { Component, Fragment, useState } from "react";
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/styles";
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  TextField, Grid, MenuItem, CircularProgress, Divider, Typography,
  Button, IconButton, Tooltip, Fab, Dialog, DialogActions, DialogContent,
  DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, FormControlLabel, Switch
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import DeleteIcon from "@material-ui/icons/Delete";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import { DatePicker } from "@material-ui/pickers";
import { lastDayOfQuarterWithOptions } from "date-fns/fp";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "rgb(29, 95, 152)", //theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: 500,
    border: '1px solid white'
  },
  body: {
    fontSize: 14,
    border: '1px solid rgb(29, 95, 152)'
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const styles = ({
  table: {
    minWidth: 750,
  },
});

const CourseRow = (props) => {

  const { rowIndex, rowData, onDelete, isReadOnly } = props;

  return (
    <StyledTableRow key={rowIndex}>
      <StyledTableCell component="th" scope="row">
        {rowIndex + 1}
      </StyledTableCell>
      <StyledTableCell align="center">
        {rowData.preDay}
        <TextField type="hidden" id="dayId" name="dayId" value={rowData.preDayId} />
      </StyledTableCell>
      <StyledTableCell align="center">
        {rowData.preTimeStart}
        <TextField type="hidden" id="startTime" name="startTime" value={rowData.preTimeStart} />
      </StyledTableCell>
      <StyledTableCell align="center">
        {rowData.preTimeDuration}
        <TextField type="hidden" id="duration" name="duration" value={rowData.preTimeDuration} />
      </StyledTableCell>
      <StyledTableCell align="center">
        {rowData.roomsObject.Label || ""}
        <TextField type="hidden" id="roomDBId" name="roomDBId" value={rowData.roomsObject.ID || ""} />
      </StyledTableCell>
      {isReadOnly ?
        ""
        :
        <StyledTableCell align="center">
          <Tooltip title="Delete">
            <span>
              <Fab
                color="secondary"
                aria-label="Delete"
                size="small"
                style={{
                  height: 36,
                  width: 36
                }}
                disabled={isReadOnly}
                onClick={() => onDelete(rowIndex)}
              >
                <DeleteIcon fontSize="small" />
              </Fab>
            </span>
          </Tooltip>
        </StyledTableCell>
      }
    </StyledTableRow>
  );
}

CourseRow.propTypes = {
  rowData: PropTypes.object,
  rowIndex: PropTypes.number,
  onDelete: PropTypes.func
}

CourseRow.defaultTypes = {
  rowData: {},
  rowIndex: -1,
  onDelete: fn => fn
}


function isEmpty(obj) {
  if (obj == null) return true;
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;
  if (typeof obj !== "object") return true;
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }
  return true;
}

class F31FormPopupComponent extends Component {
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
      preTimeDuration: "",
      preTimeDurationError: "",
      preDaysMenuItems: [],
      preDayId: "",
      preDay: "",
      preDayError: "",
      preTimeStartMenuItems: [],
      preTimeStart: "",
      preTimeStartError: "",
      preDate: this.getTomorrowDate(),
      preDateError: "",
      rowDataArray: [],
      roomsObject: {},
      roomsObjectError: "",
      roomsId: "",
      isReadOnly: false,
      isCopyMode: false
    };
  }

  getTomorrowDate = () => {
    let tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    return tomorrowDate;
  }

  getDateInString = (todayDate) => {
    let today = todayDate;
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (dd < 10) { dd = "0" + dd; }
    if (mm < 10) { mm = "0" + mm; }
    today = dd + "-" + mm + "-" + yyyy;
    return today;
  };

  loadData = async (sectionId, effectiveDate) => {
    let data = new FormData();
    data.append("sectionId", sectionId);
    data.append("effectiveDate", effectiveDate);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C31CommonAcademicsScheduleView`;
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
            let rowDataArray = [];
            for (let i = 0; i < json.DATA.length; i++) {
              let courseRowDataObject = {
                preDayId: json.DATA[i].dayId,
                preDay: json.DATA[i].daylabel,
                preTimeStart: json.DATA[i].startTime,
                preTimeDuration: json.DATA[i].duration,
                roomsObject: { ID: json.DATA[i].classRoomId || "", Label: json.DATA[i].classRoomLabel || "", studentCapacity: json.DATA[i].classRoomCapacity || "" }
              };
              rowDataArray.push(courseRowDataObject);
            }
            this.setState({ rowDataArray: rowDataArray });
          } else {
            this.props.handleOpenSnackbar(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE, "error");
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
            this.props.handleOpenSnackbar("Failed to Save ! Please try Again later.", "error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  handleClickOpen = () => {
    if (this.props.isReadOnly && this.props.activeDate) {
      this.loadData(this.props.sectionId, this.props.activeDate);
      //this.loadData(this.props.sectionId, this.getDateInString(new Date(this.props.activeDateInNumber)) );
      this.setState({ preDate: this.props.activeDateInNumber });
    } else {
      let sessionSelectedDate = sessionStorage.getItem('sessionSelectedDate');
      if (sessionSelectedDate) {
        this.handleChangePreDate(new Date(sessionSelectedDate));
      } else {
        this.loadData(this.props.sectionId, this.getDateInString(this.state.preDate));
      }
    }
    this.setState({ popupBoxOpen: true });
  };

  handleClose = () => {
    this.setState({
      popupBoxOpen: false,
      preDate: this.getTomorrowDate(),
      preDay: "",
      preTimeStart: "",
      preTimeDuration: "",
      rowDataArray: [],
      isCopyMode: false,
      isReadOnly: this.props.isReadOnly
    });
  };

  isPreDateValid = () => {
    let isValid = true;
    if (!this.state.preDate) {
      this.setState({ preDateError: "Please select date." });
      document.getElementById("preDate").focus();
      isValid = false;
    } else {
      this.setState({ preDateError: "" });
    }
    return isValid;
  };

  isPreDayValid = () => {
    let isValid = true;
    if (!this.state.preDayId) {
      this.setState({ preDayError: "Please select day." });
      document.getElementById("preDayId").focus();
      isValid = false;
    } else {
      this.setState({ preDayError: "" });
    }
    return isValid;
  };

  isPreTimeSlotValid = () => {
    let isValid = true;
    if (!this.state.preTimeStart) {
      this.setState({ preTimeStartError: "Please select time slot." });
      document.getElementById("preTimeStart").focus();
      isValid = false;
    } else {
      this.setState({ preTimeStartError: "" });
    }
    return isValid;
  };

  isPreTimeDurationValid = () => {
    let isValid = true;
    if (!this.state.preTimeDuration) {
      this.setState({ preTimeDurationError: "Please enter time duration." });
      document.getElementById("preTimeDuration").focus();
      isValid = false;
    } else {
      this.setState({ preTimeDurationError: "" });
    }
    return isValid;
  };

  isRoomsValid = () => {
    let isValid = true;
    if (isEmpty(this.state.roomsObject)) {
      this.setState({ roomsObjectError: "Please select rooms." });
      isValid = false;
    } else {
      this.setState({ roomsObjectError: "" });
    }
    return isValid;
  };

  handeAddCourseRow = () => {
    if (
      !this.isPreDateValid() ||
      !this.isPreDayValid() ||
      !this.isPreTimeSlotValid() ||
      !this.isPreTimeDurationValid() ||
      !this.isRoomsValid()
    ) {
      return;
    }

    let rowDataArray = this.state.rowDataArray;
    let preDayId = this.state.preDayId;
    let preDay = this.state.preDay;
    let preDaysMenuItemsTemp = this.state.preDaysMenuItems;

    for (let i = 0; i < preDaysMenuItemsTemp.length; i++) {
      if (preDaysMenuItemsTemp[i].id == preDayId) {
        preDay = preDaysMenuItemsTemp[i].label;
      }
    }
    let preTimeStart = this.state.preTimeStart;
    let preTimeDuration = this.state.preTimeDuration;

    let day = document.getElementsByName("day");
    for (let i = 0; i < day.length; i++) {
      if (day[i].value == preDayId) {
        this.setState({ preDayError: "Day should be unique." });
        document.getElementById("preDayId").focus();
        return;
      }
    }

    let rowDataObject = {
      preDayId: preDayId,
      preDay: preDay,
      preTimeStart: preTimeStart,
      preTimeDuration: preTimeDuration,
      roomsObject: this.state.roomsObject
    };

    rowDataArray.push(rowDataObject);

    this.setState({
      rowDataArray: rowDataArray,
      preDayId: "",
      preDay: "",
      preTimeStart: "",
      preTimeDuration: "",
      roomsObject: {},
      roomsId: ""
    });
  };

  handeDeleteCourseRow = (index) => {
    let rowDataArray = this.state.rowDataArray;
    rowDataArray.splice(index, 1);
    this.setState({ rowDataArray: rowDataArray });
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  onHandleChangePreDay = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  handleChangePreDate = (date) => {
    this.setState({
      preDate: date,
      preDayId: "",
      preDay: "",
      preTimeStart: "",
      preTimeDuration: "",
      rowDataArray: this.state.isCopyMode ? this.state.rowDataArray : [],
    });
    sessionStorage.setItem('sessionSelectedDate', date);
    if (!this.state.isCopyMode) {
      this.loadData(this.props.sectionId, this.getDateInString(date));
    }
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

  onAutoCompleteChange = (e, value) => {
    let object = isEmpty(value) ? {} : value;
    this.setState({
      roomsObject: object,
      roomsId: object.id || "",
      roomsObjectError: ""
    })
  }

  handleToggleIsCopyMode = () => {
    let sessionSelectedDate = sessionStorage.getItem('sessionSelectedDate');
    let tomorrowDate = this.getTomorrowDate();
    if (sessionSelectedDate) {
      tomorrowDate = new Date(sessionSelectedDate);
    }
    this.setState({
      isCopyMode: !this.state.isCopyMode,
      isReadOnly: !this.state.isReadOnly,
      preDate: tomorrowDate
    });
    if (this.state.isCopyMode) {
      this.loadData(this.props.sectionId, this.props.activeDate);
      this.setState({ preDate: this.props.activeDateInNumber });
    }
  }

  handleUpcomingSchedule(dateId, dateLabel) {
    this.setState({
      preDate: dateId,
      rowDataArray: []
    });
    this.loadData(this.props.sectionId, dateLabel);
  }

  componentDidMount() {
    this.setState({
      preTimeStartMenuItems: this.props.preTimeStartMenuItems,
      preDaysMenuItems: this.props.preDaysMenuItems,
      isReadOnly: this.props.isReadOnly
    });
    // if (this.state.recordId != 0) {
    //   this.loadData(this.state.recordId);
    // }
  }

  render() {
    const { sectionId, teacherId, classes } = this.props;
    return (
      <Fragment>
        {this.props.isReadOnly ?
          <IconButton
            color="primary"
            aria-label="View"
            component="span"
            onClick={this.handleClickOpen}
            variant="outlined"
          >
            <Tooltip title="View Active Timetable">
              <Fab color="primary" aria-label="View" size="small">
                <VisibilityOutlinedIcon />
              </Fab>
            </Tooltip>
          </IconButton>
          :
          <IconButton
            color="primary"
            aria-label="Add"
            component="span"
            onClick={this.handleClickOpen}
            variant="outlined"
          >
            <Tooltip title="Add or Edit Timetable">
              <Fab color="primary" aria-label="add" size="small">
                <AddIcon />
              </Fab>
            </Tooltip>
          </IconButton>
        }
        <Dialog
          maxWidth="md"
          open={this.state.popupBoxOpen}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <span style={{ color: "#ffffff" }}>
            ________________________________________________________________________________________________________________________________________________________
          </span>
          <DialogTitle style={{ paddingBottom: 0 }} id="responsive-dialog-title">
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
              Timetable
            </Typography>
            <Typography color="primary">
              {this.props.courseLabel +
                " - " +
                this.props.sectionTypeLabel +
                " - " +
                this.props.sectionLabel +
                " - " +
                this.props.teacherName}
            </Typography>
            <TextField
              type="hidden"
              id="teacherId"
              name="teacherId"
              defaultValue={teacherId}
            />
            <span style={{ float: "right" }}>
              <span style={{ display: "flex" }}>
                {this.props.isReadOnly &&
                  <Fragment>
                    <TextField
                      id="upcomingSchedule"
                      name="upcomingSchedule"
                      variant="outlined"
                      label="Upcoming Schedule"
                      required
                      select
                      style={{ width: 195 }}
                      disabled={this.state.isCopyMode}
                    >
                      {this.props.effectiveDatesArray.length > 0 ? (
                        this.props.effectiveDatesArray.map((dt) => (
                          <MenuItem
                            key={"effectiveDatesArray" + dt.id}
                            value={dt.id}
                            onClick={() => this.handleUpcomingSchedule(dt.id, dt.label)}
                          >
                            {dt.label}
                          </MenuItem>
                        ))
                      ) : (
                          <MenuItem>
                            <CircularProgress />
                          </MenuItem>
                        )}
                    </TextField>
                    &nbsp;
                  </Fragment>
                }
                <DatePicker
                  autoOk
                  name="effectiveDate"
                  id="effectiveDate"
                  label="Effective Date"
                  invalidDateMessage=""
                  disablePast
                  minDate={Date.parse(this.getTomorrowDate())}
                  placeholder=""
                  variant="inline"
                  inputVariant="outlined"
                  format="dd-MM-yyyy"
                  fullWidth
                  required
                  style={{ width: 115 }}
                  value={this.state.preDate}
                  onChange={this.handleChangePreDate}
                  error={!!this.state.preDateError}
                  helperText={
                    this.state.preDateError ? this.state.preDateError : " "
                  }
                  disabled={this.state.isReadOnly}
                />
              </span>
              {this.props.isReadOnly ?
                <Fragment>
                  <FormControlLabel
                    value="newSchedule"
                    control={<Switch color="primary" />}
                    label="New Schedule"
                    labelPlacement="start"
                    style={{ float: "right", marginTop: -25 }}
                    onClick={() => this.handleToggleIsCopyMode()}
                  />
                  {/* 
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="small"
                  style={{width: 115, marginTop:-40}}
                  onClick={()=>this.handleToggleIsCopyMode()}
                  disabled={this.state.isCopyMode}
                >
                  Edit
                </Button> 
                */}

                </Fragment>
                :
                ""
              }
            </span>
          </DialogTitle>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
            }}
          />
          <DialogContent>
            <Grid
              container
              direction="row"
              alignItems="center"
              spacing={2}
              style={{
                marginTop: -10,
              }}
            >
              {this.state.isReadOnly ?
                ""
                :
                <Fragment>
                  <Grid item xs={12} md={4}>
                    <TextField
                      type="hidden"
                      id="sectionId"
                      name="sectionId"
                      value={sectionId}
                    />
                    <TextField
                      id="preDayId"
                      name="preDayId"
                      variant="outlined"
                      label="Day"
                      onChange={this.onHandleChangePreDay}
                      value={this.state.preDayId}
                      error={!!this.state.preDayError}
                      helperText={
                        this.state.preDayError
                      }
                      required
                      fullWidth
                      select
                    >
                      {this.state.preDaysMenuItems ? (
                        this.state.preDaysMenuItems.map((dt) => (
                          <MenuItem
                            key={"preDaysMenuItems" + dt.id}
                            value={dt.id}
                          >
                            {dt.label}
                          </MenuItem>
                        ))
                      ) : (
                          <MenuItem>
                            <CircularProgress />
                          </MenuItem>
                        )}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      id="preTimeStart"
                      name="preTimeStart"
                      variant="outlined"
                      label="Time Slot"
                      onChange={this.onHandleChange}
                      value={this.state.preTimeStart}
                      error={!!this.state.preTimeStartError}
                      helperText={
                        this.state.preTimeStartError
                      }
                      required
                      fullWidth
                      select
                    >
                      {this.state.preTimeStartMenuItems ? (
                        this.state.preTimeStartMenuItems.map((dt, i) => (
                          <MenuItem
                            key={"preTimeStartMenuItems" + dt + i}
                            value={dt}
                          >
                            {dt}
                          </MenuItem>
                        ))
                      ) : (
                          <MenuItem>
                            <CircularProgress />
                          </MenuItem>
                        )}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      id="preTimeDuration"
                      name="preTimeDuration"
                      label={"Duration (Minutes)"}
                      type="number"
                      required
                      fullWidth
                      variant="outlined"
                      onChange={this.onHandleChange}
                      value={this.state.preTimeDuration}
                      error={!!this.state.preTimeDurationError}
                      helperText={this.state.preTimeDurationError}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Autocomplete
                      id="rooms"
                      getOptionLabel={(option) => typeof option.Label === "string" ? option.Label : ""}
                      fullWidth
                      value={this.state.roomsObject}
                      onChange={this.onAutoCompleteChange}
                      options={this.props.values.roomsData}
                      renderInput={(params) => <TextField error={!!this.state.roomsObjectError} variant="outlined" placeholder="Rooms" {...params} />}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      id="capacity"
                      value={isEmpty(this.state.roomsObject) ? "" : this.state.roomsObject.studentCapacity}
                      variant="outlined"
                      fullWidth
                      placeholder="Student Capacity"
                      readOnly
                    />
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
                </Fragment>
              }
              <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell style={{ borderLeft: '1px solid rgb(29, 95, 152)' }}>SR#</StyledTableCell>
                      <StyledTableCell align="center">Day</StyledTableCell>
                      <StyledTableCell align="center">Start Time</StyledTableCell>
                      <StyledTableCell align="center">Duration <small>(Minutes)</small></StyledTableCell>
                      <StyledTableCell align="center">Room</StyledTableCell>
                      {this.state.isReadOnly ? "" : <StyledTableCell align="center" style={{ borderRight: '1px solid rgb(29, 95, 152)' }}>Action</StyledTableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.rowDataArray.length > 0
                      ? this.state.rowDataArray.map((dt, i) => (
                        <CourseRow
                          key={"RDO" + i}
                          rowIndex={i}
                          rowData={dt}
                          onDelete={(i) => this.handeDeleteCourseRow(i)}
                          isReadOnly={this.state.isReadOnly}
                        />
                      ))
                      : this.state.isLoading ?
                        <StyledTableRow key={1}>
                          <StyledTableCell component="th" scope="row" colSpan={6}><center><CircularProgress /></center></StyledTableCell>
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
            {this.state.isReadOnly ?
              ""
              :
              <Button
                onClick={this.props.clickOnFormSubmit()}
                color="primary"
                autoFocus
                disabled={this.state.isReadOnly}
              >
                Save
              </Button>
            }
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }

}

F31FormPopupComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  handleOpenSnackbar: PropTypes.func,
  clickOnFormSubmit: PropTypes.func,
  onAutoCompleteChange: PropTypes.func,
  sectionId: PropTypes.any,
  courseLabel: PropTypes.any,
  sectionTypeLabel: PropTypes.any,
  sectionLabel: PropTypes.any,
  teacherName: PropTypes.any,
  preTimeStartMenuItems: PropTypes.any,
  preDaysMenuItems: PropTypes.any,
  values: PropTypes.object,
  isReadOnly: PropTypes.bool
}


F31FormPopupComponent.defaultTypes = {
  handleOpenSnackbar: fn => fn,
  clickOnFormSubmit: fn => fn,
  onAutoCompleteChange: fn => fn,
  values: {},
  sectionId: "",
  courseLabel: "",
  sectionTypeLabel: "",
  sectionLabel: "",
  teacherName: "",
  preTimeStartMenuItems: "",

  preDaysMenuItems: "",
  isReadOnly: true

}

export default withStyles(styles)(F31FormPopupComponent);
