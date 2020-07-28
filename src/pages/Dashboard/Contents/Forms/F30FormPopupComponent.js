import React, { Component, Fragment, useState, useEffect } from "react";
import { withStyles, useTheme } from "@material-ui/styles";
import { numberFreeExp, numberExp } from "../../../../utils/regularExpression";
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
  Chip,
  Checkbox,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

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

function CourseRow(props) {
  const {
    rowIndex,
    rowData,
    onDelete,
    moduleMenuItems,
    courseMenuItems,
    ...rest
  } = props;

  const [coursesInputValue, setCoursesInputValue] = useState("");

  const handleCourse = (value) => {
    let ObjArray = value;
    let selectedPCIdsString = "";
    for (let i = 0; i < ObjArray.length; i++) {
      if (i == 0) {
        selectedPCIdsString = ObjArray[i].ID;
      } else {
        selectedPCIdsString += "~" + ObjArray[i].ID;
      }
    }
    setCoursesInputValue(selectedPCIdsString);
    //console.log("handleCourse", selectedPCIdsString);
  };

  const getPreModuleById = (id) => {
    if (
      moduleMenuItems.length > 0 &&
      id != "" &&
      id != 0 &&
      moduleMenuItems.find((x) => x.ID == id) != undefined
    ) {
      return moduleMenuItems.find((x) => x.ID == id).Label;
    } else {
      return "";
    }
  };

  useEffect(() => {
    handleCourse(rowData.preCourses);
  });

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return (
    <Grid
      container
      direction="row"
      justify="space-evenly"
      alignItems="center"
      alignContent="space-around"
    >
      {/* <Typography 
                color="primary" 
                variant="subtitle1"
                component="div"
                style={{float:"left"}}
            >
                <b>{(rowIndex+1)}:</b>
            </Typography> */}
      <Grid item xs={3} md={3}>
        {/* <TextField
          id="module"
          name="module"
          label="Module"
          required
          fullWidth
          inputProps={{
            "aria-readonly": true,
          }}
          variant="outlined"
          value={getPreModuleById(rowData.preModuleId)}
        /> */}
        {/* <Typography color="primary" variant="caption"> */}
          {getPreModuleById(rowData.preModuleId)}
        {/* </Typography> */}
        <TextField
          type="hidden"
          name="moduleNumber"
          value={rowData.preModuleId}
        />
      </Grid>
      <Grid item xs={4} md={4}>
        {rowData.preCourses.map((option, index) => (
          <span>
            {index != 0 ? <br /> : ""} {option.Label}
          </span>
        ))}

        {/* <Autocomplete
          multiple
          fullWidth
          style={{ paddingTop: "1.4em" }}
          options={rowData.preCourses}
          value={rowData.preCourses}
          disableCloseOnSelect
          getOptionLabel={(option) => " "}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip
                key={"chipTag" + option.ID}
                label={option.Label}
                color="primary"
                variant="outlined"
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Courses"
              placeholder=""
              type="hidden"
            />
          )}
        /> */}
        <TextField
          type="hidden"
          name="programmeCourseId"
          value={coursesInputValue}
        />
      </Grid>
      <Grid item xs={3} md={3}>
        {/* <Typography color="primary" variant="caption"> */}
          {rowData.preMarks}
        {/* </Typography> */}
        <TextField type="hidden" name="marks" value={rowData.preMarks} />
        {/* <TextField
          id="Marks"
          name="marks"
          label="Marks"
          fullWidth
          inputProps={{
            "aria-readonly": true,
          }}
          variant="outlined"
          value={rowData.preMarks}
        /> */}
      </Grid>
      <Grid item xs={2} md={1} style={{ textAlign: "center" }}>
        <IconButton
          aria-label="Delete"
          component="span"
          onClick={() => onDelete(rowIndex)}
        >
          <Tooltip title="Delete">
            <Fab 
              color="secondary" 
              aria-label="Delete" 
              size="small"
              style={{
                height:36,
                width:36
              }}
            >
              <DeleteIcon 
                fontSize="small"/>
            </Fab>
          </Tooltip>
        </IconButton>
      </Grid>
    </Grid>
  );
}

class F30FormPopupComponent extends Component {
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
    this.loadData(this.props.studentId);
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
        preCoursesError: "Max selected courses not more then two.",
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

  handeAddCourseRow = () => {
    if (
      !this.isPreModuleValid() ||
      !this.isPreCoursesValid() ||
      !this.isMarksValid()
    ) {
      return;
    }

    let courseRowDataArray = this.state.courseRowDataArray;
    let preModuleId = this.state.preModuleId;
    let preCourses = this.state.preCourses;
    let preMarks = this.state.preMarks;

    let moduleNumber = document.getElementsByName("moduleNumber");
    for (let i = 0; i < moduleNumber.length; i++) {
      if (moduleNumber[i].value == preModuleId) {
        this.setState({ preModuleIdError: "Module should be unique." });
        document.getElementById("preModuleId").focus();
        return;
      }
    }

    let courseRowDataObject = {
      preModuleId: preModuleId,
      preCourses: preCourses,
      preMarks: preMarks,
    };

    courseRowDataArray.push(courseRowDataObject);

    this.setState({
      courseRowDataArray: courseRowDataArray,
      preModuleId: "",
      preCourses: [],
      preMarks: "",
    });
    //console.log("courseRowDataObject", courseRowDataObject);
  };

  handeDeleteCourseRow = (index) => {
    let courseRowDataArray = this.state.courseRowDataArray;
    courseRowDataArray.splice(index, 1);
    this.setState({ courseRowDataArray: courseRowDataArray });
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

  componentDidMount() {
    //console.log("F30PopUp: ", this.props);
    this.setState({
      preCourseMenuItems: this.props.preCourseMenuItems,
      preModuleMenuItems: this.props.preModuleMenuItems,
    });
    if (this.state.recordId != 0) {
      this.loadData(this.state.recordId);
    }
  }

  render() {
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    return (
      <Fragment>
        <IconButton
          color="primary"
          aria-label="Add"
          component="span"
          onClick={this.handleClickOpen}
          variant="outlined"
        >
          <Tooltip title="Add Achievements">
            <Fab color="primary" aria-label="add" size="small">
              <AddIcon />
            </Fab>
          </Tooltip>
        </IconButton>
        <Dialog
          fullScreen={true}
          //maxWidth="md"
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
              Add Achievements
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
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
                    id="preModuleId"
                    name="preModuleId"
                    variant="outlined"
                    label="Module"
                    onChange={this.onHandleChange}
                    value={this.state.preModuleId}
                    error={!!this.state.preModuleIdError}
                    helperText={
                      this.state.preModuleIdError
                        ? this.state.preModuleIdError
                        : " "
                    }
                    required
                    fullWidth
                    select
                  >
                    {this.state.preModuleMenuItems ? (
                      this.state.preModuleMenuItems.map((dt, i) => (
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
                <Grid item xs={12} md={5}>
                  <Autocomplete
                    multiple
                    fullWidth
                    id="preCourses"
                    options={this.state.preCourseMenuItems}
                    value={this.state.preCourses}
                    onChange={(event, value) => this.handleSetPreCourses(value)}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.Label}
                    renderTags={(tagValue, getTagProps) =>
                      tagValue.map((option, index) => (
                        <Chip
                          label={option.Label}
                          color="primary"
                          variant="outlined"
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    renderOption={(option) => (
                      <Fragment>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={this.isCourseSelected(option)}
                          color="primary"
                        />
                        {option.Label}
                      </Fragment>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Courses"
                        placeholder="Search and Select"
                        error={!!this.state.preCoursesError}
                        helperText={
                          this.state.preCoursesError ? (
                            this.state.preCoursesError
                          ) : (
                            <Typography color="primary" variant="caption">
                              Max selection of courses should be two.
                            </Typography>
                          )
                        }
                      />
                    )}
                  />
                </Grid>
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
                <Grid
                  container
                  direction="row"
                  justify="space-evenly"
                  alignItems="center"
                >
                  <Grid item xs={3} md={3}>
                    <Typography color="primary" variant="title">
                      Module
                    </Typography>
                  </Grid>
                  <Grid item xs={4} md={4}>
                    <Typography color="primary" variant="title">
                      Courses
                    </Typography>
                  </Grid>
                  <Grid item xs={3} md={3}>
                    <Typography color="primary" variant="title">
                      Marks
                    </Typography>
                  </Grid>
                  <Grid item xs={2} md={1} style={{ textAlign: "center" }}>
                    <Typography color="primary" variant="title">
                      Delete
                    </Typography>
                  </Grid>
                </Grid>
                {this.state.courseRowDataArray.length > 0 &&
                  this.state.courseRowDataArray.map((dt, i) => (
                    <CourseRow
                      key={"SMC" + i}
                      rowIndex={i}
                      rowData={dt}
                      onDelete={(i) => this.handeDeleteCourseRow(i)}
                      moduleMenuItems={this.state.preModuleMenuItems}
                      courseMenuItems={this.preCourses}
                    />
                  ))}
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
export default withStyles(styles)(F30FormPopupComponent);
