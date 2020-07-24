import React, { Component, Fragment, useEffect } from "react";
import { withStyles, useTheme } from "@material-ui/styles";
import {
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
  Divider,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import { DatePicker } from "@material-ui/pickers";

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
});

function CourseRow(props) {
  console.log("RowProps: ", props);

  const { rowIndex, rowData, onDelete, ...rest } = props;

  // const [coursesInputValue, setCoursesInputValue] = useState("");

  // const handleCourse = (value) => {
  //     let ObjArray = value;
  //     let selectedPCIdsString = "";
  //     for(let i=0; i<ObjArray.length; i++){
  //         if(i==0){
  //             selectedPCIdsString = ObjArray[i].ID;
  //         }else{
  //             selectedPCIdsString += "~"+ObjArray[i].ID;
  //         }
  //     }
  //     setCoursesInputValue(selectedPCIdsString);
  //     //console.log("handleCourse", selectedPCIdsString);
  // }

  // const getPreCourseSelectionGroupById = (id) => {
  //     if(courseMenuItems.length>0 && id!="" && id!=0){
  //         return courseMenuItems.find(x => x.ID == id).Label;
  //     }else{
  //         return "";
  //     }
  // }

  useEffect(() => {
    //handleCourse(rowData.preCourses);
  });

  return (
    <Fragment>
      <Grid item xs={12}></Grid>
      <Grid
        container
        direction="row"
        justify="space-evenly"
        alignItems="center"
      >
        <Typography
          color="primary"
          variant="subtitle1"
          component="div"
          style={{ float: "left" }}
        >
          <b>{rowIndex + 1}:</b>
        </Typography>
        <Grid item xs={12} md={3}>
          <TextField
            id="dayIdLabel"
            name="dayIdLabel"
            label="Day"
            required
            fullWidth
            inputProps={{
              "aria-readonly": true,
            }}
            variant="outlined"
            value={rowData.preDay}
          />
          <TextField
            type="hidden"
            id="dayId"
            name="dayId"
            value={rowData.preDayId}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            id="startTime"
            name="startTime"
            label="Time Start"
            required
            fullWidth
            inputProps={{
              "aria-readonly": true,
            }}
            variant="outlined"
            value={rowData.preTimeStart}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            id="module"
            name="duration"
            label="Duration"
            required
            fullWidth
            inputProps={{
              "aria-readonly": true,
            }}
            variant="outlined"
            value={rowData.preTimeDuration}
          />
        </Grid>
        <Grid item xs={12} md={1} style={{ textAlign: "center" }}>
          <IconButton
            aria-label="Add"
            component="span"
            onClick={() => onDelete(rowIndex)}
          >
            <Tooltip title="Delete">
              <Fab color="secondary" aria-label="Delete" size="small">
                <DeleteIcon />
              </Fab>
            </Tooltip>
          </IconButton>
        </Grid>
      </Grid>
    </Fragment>
  );
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
      preDate: new Date(),
      preDateError: "",
      rowDataArray: [],
    };
  }

  getDateInString = (todayDate) => {
    let today = todayDate;
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
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
              };
              rowDataArray.push(courseRowDataObject);
            }
            this.setState({ rowDataArray: rowDataArray });
          } else {
            this.props.handleOpenSnackbar(
              json.USER_MESSAGE + "\n" + json.SYSTEM_MESSAGE,
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
            this.props.handleOpenSnackbar(
              "Failed to Save ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  handleClickOpen = () => {
    this.loadData(
      this.props.sectionId,
      this.getDateInString(this.state.preDate)
    );
    this.setState({ popupBoxOpen: true });
  };

  handleClose = () => {
    this.setState({
      popupBoxOpen: false,
      preDate: new Date(),
      preDay: "",
      preTimeStart: "",
      preTimeDuration: "",
      rowDataArray: [],
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

  handeAddCourseRow = () => {
    if (
      !this.isPreDateValid() ||
      !this.isPreDayValid() ||
      !this.isPreTimeSlotValid() ||
      !this.isPreTimeDurationValid()
    ) {
      return;
    }

    let rowDataArray = this.state.rowDataArray;
    let preDayId = this.state.preDayId;
    let preDay = this.state.preDay;
    console.log();
    let preDaysMenuItemsTemp = this.state.preDaysMenuItems;
    for (let i = 0; i < preDaysMenuItemsTemp.length; i++) {
      if (preDaysMenuItemsTemp[i].id == preDayId) {
        preDay = preDaysMenuItemsTemp[i].label;
        console.log(preDaysMenuItemsTemp[i].label);
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
    };

    rowDataArray.push(rowDataObject);

    this.setState({
      rowDataArray: rowDataArray,
      preDayId: "",
      preDay: "",
      preTimeStart: "",
      preTimeDuration: "",
    });

    //console.log("courseRowDataObject", courseRowDataObject);
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
      preDayId: "",
      preDay: "",
      preTimeStart: "",
      preTimeDuration: "",
      rowDataArray: [],
      preDate: date,
    });
    this.loadData(this.props.sectionId, this.getDateInString(date));
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

  componentDidMount() {
    //console.log("F30PopUp: ", this.props);
    this.setState({
      preTimeStartMenuItems: this.props.preTimeStartMenuItems,
      preDaysMenuItems: this.props.preDaysMenuItems,
    });
    if (this.state.recordId != 0) {
      this.loadData(this.state.recordId);
    }
  }

  render() {
    return (
      <Fragment>
        <IconButton
          color="primary"
          aria-label="Add"
          component="span"
          onClick={this.handleClickOpen}
          variant="outlined"
        >
          <Tooltip title="Add Module Courses">
            <Fab color="primary" aria-label="add" size="small">
              <AddIcon />
            </Fab>
          </Tooltip>
        </IconButton>
        <Dialog
          //fullScreen={}
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
            <DatePicker
              autoOk
              name="effectiveDate"
              id="effectiveDate"
              label="Effective Date"
              invalidDateMessage=""
              disablePast
              placeholder=""
              variant="inline"
              inputVariant="outlined"
              format="dd-MM-yyyy"
              fullWidth
              required
              style={{ float: "right", width: 115 }}
              value={this.state.preDate}
              onChange={this.handleChangePreDate}
              error={!!this.state.preDateError}
              helperText={
                this.state.preDateError ? this.state.preDateError : " "
              }
            />
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="center"
                spacing={2}
                style={{
                  marginTop: -10,
                }}
              >
                <Grid item xs={12} md={4}>
                  <TextField
                    type="hidden"
                    id="sectionId"
                    name="sectionId"
                    value={this.props.sectionId}
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
                      this.state.preDayError ? this.state.preDayError : " "
                    }
                    required
                    fullWidth
                    select
                  >
                    {this.state.preDaysMenuItems ? (
                      this.state.preDaysMenuItems.map((dt, i) => (
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
                        ? this.state.preTimeStartError
                        : " "
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
                <Grid item xs={12} md={3}>
                  <TextField
                    id="preTimeDuration"
                    name="preTimeDuration"
                    label="Duration"
                    type="number"
                    required
                    fullWidth
                    variant="outlined"
                    onChange={this.onHandleChange}
                    value={this.state.preTimeDuration}
                    error={!!this.state.preTimeDurationError}
                    helperText={
                      this.state.preTimeDurationError
                        ? this.state.preTimeDurationError
                        : " "
                    }
                  />
                </Grid>
                <Grid item xs={1} style={{ textAlign: "center" }}>
                  <IconButton
                    color="primary"
                    aria-label="Add"
                    component="span"
                    onClick={this.handeAddCourseRow}
                    style={{ marginTop: "-1em" }}
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
                {this.state.rowDataArray.length > 0
                  ? this.state.rowDataArray.map((dt, i) => (
                      <CourseRow
                        key={"RDO" + i}
                        rowIndex={i}
                        rowData={dt}
                        onDelete={(i) => this.handeDeleteCourseRow(i)}
                      />
                    ))
                  : this.state.isLoading && (
                      <Grid
                        container
                        justify="center"
                        alignItems="center"
                        style={{ paddingTop: "2em" }}
                      >
                        <CircularProgress />
                      </Grid>
                    )}
                <br />
                <br />
              </Grid>
            </DialogContentText>
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
export default withStyles(styles)(F31FormPopupComponent);
