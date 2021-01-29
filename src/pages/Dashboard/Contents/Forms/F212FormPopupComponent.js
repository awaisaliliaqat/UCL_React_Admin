import React, { Component, Fragment, useState, useEffect } from "react";
import { withStyles, useTheme } from "@material-ui/styles";
import { numberFreeExp, numberExp } from "../../../../utils/regularExpression";
import {TextField, Grid, MenuItem, CircularProgress, Divider, Typography, Button,
  IconButton, Tooltip, Fab, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, useMediaQuery, Chip, Checkbox,Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Collapse} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
  table: {
    minWidth: 750,
  },
  expand: {
    transform: 'rotate(-90deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {duration: theme.transitions.duration.shortest})
  },
  expandOpen: {
    transform: 'rotate(0deg)',
  }
});

function AcademicSessionStudentAchievements(props){

  const { classes, data, isOpen } = props;

  const [state, setState] = useState({"expanded": isOpen });
  
  const handleExpandClick = () => {
    setState({expanded:!state.expanded});
  }

  return (
    <Grid item xs={12} >
      <Typography color="primary" component="div" style={{fontWeight: 600,fontSize:18, color:"#4caf50"}}>
        <IconButton
          className={clsx(classes.expand, {[classes.expandOpen]: state.expanded,})}
          onClick={handleExpandClick}
          aria-expanded={state.expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon color="primary" style={{color:"#4caf50"}}/>
        </IconButton>
        {data.sessionLabel}
        <Divider
          style={{
            backgroundColor: "#4caf50", //"rgb(58, 127, 187)",
            opacity: "0.3",
            marginLeft: 50,
            marginTop: -10
          }}
        />
      </Typography>
      <Collapse in={state.expanded} timeout="auto" unmountOnExit>
        <div style={{paddingLeft:50}}>
          <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center" style={{backgroundColor:"#4caf50"}}>Module</StyledTableCell>
                  <StyledTableCell align="center" style={{backgroundColor:"#4caf50"}}>Courses</StyledTableCell>
                  <StyledTableCell align="center" style={{backgroundColor:"#4caf50"}}>Marks</StyledTableCell>
                  <StyledTableCell align="center" style={{backgroundColor:"#4caf50"}}>Reset Marks</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                  {data.achivementDetail.length > 0 ?
                    data.achivementDetail.map((dt, i) => (
                      <StyledTableRow key={"row"+data.sessionLabel+i}>
                        <StyledTableCell component="th" scope="row" align="center" style={{borderColor:"#4caf50"}}>{dt.moduleNumber}</StyledTableCell>
                        <StyledTableCell scope="row" align="center" style={{borderColor:"#4caf50"}}>{dt.coursesObject.Label}</StyledTableCell>
                        <StyledTableCell scope="row" align="center" style={{borderColor:"#4caf50"}}>{dt.marks}</StyledTableCell>
                        <StyledTableCell scope="row" align="center" style={{borderColor:"#4caf50"}}>{dt.resetMarks}</StyledTableCell>
                      </StyledTableRow>
                    ))
                  :
                  this.state.isLoading ?
                    <StyledTableRow>
                      <StyledTableCell component="th" scope="row" colSpan={4}><center><CircularProgress/></center></StyledTableCell>
                    </StyledTableRow>
                    :
                    <StyledTableRow>
                      <StyledTableCell component="th" scope="row" colSpan={4}><center><b>No Data</b></center></StyledTableCell>
                    </StyledTableRow>
                  }
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Collapse>
    </Grid>
  );
}

function CourseRow(props) {
  const {rowIndex, rowData,  onDelete,   moduleMenuItems,   courseMenuItems,  ...rest} = props;

  const [coursesInputValue, setCoursesInputValue] = useState("");

  const handleCourse = (value) => {
    let Obj = value || {};
    let selectedPCIdsString = "";
    if(!(Object.keys(Obj).length===0)){
      selectedPCIdsString = Obj.ID;
    }
    setCoursesInputValue(selectedPCIdsString);
  };

  useEffect(() => {
    handleCourse(rowData.preCourses);
  });

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return (
      <StyledTableRow key={rowData}>
        <StyledTableCell component="th" scope="row" align="center">
          {rowData.preModuleId}
          <TextField type="hidden" name="moduleNumber" value={rowData.preModuleId}/>
        </StyledTableCell>
        <StyledTableCell align="center">
          {rowData.preCourses.Label}
          <TextField type="hidden" name="programmeCourseId" value={coursesInputValue}/>
        </StyledTableCell>
        <StyledTableCell align="center">
          {rowData.preMarks}
          <TextField type="hidden" name="marks" value={rowData.preMarks} />
        </StyledTableCell>
        <StyledTableCell align="center">
          {rowData.preResetMarks}
          <TextField type="hidden" name="resetMarks" value={rowData.preResetMarks} />
        </StyledTableCell>
        <StyledTableCell align="center">
            <Tooltip title="Delete">
              <Fab
                color="secondary"
                aria-label="Delete"
                size="small"
                style={{
                  height: 36,
                  width: 36,
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

class F212FormPopupComponent extends Component {
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
      academicSessionMenuItems: [],
      academicSessionId: "",
      academicSessionIdError: "",
      preMarks: "",
      preMarksError: "",
      preResetMarks: "",
      preResetMarksError: "",
      preModuleMenuItems: [],
      preModuleId: "",
      preModuleIdError: "",
      preCourseMenuItems: [],
      preCourses: {},
      courseRowDataArray: [],
      sessionAchievementsData: [],
      preSelectedCourseIMenutems:[],
      preSelectedCourseIMenutemsDefault:[]
    };
  }

  loadAllSessionAchievementsData = async (studentId=0) => {
    const data = new FormData();
    data.append("studentId", studentId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C212CommonAcademicsCoursesStudentsALLAchievementsView`;
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
            let sessionAchievementsData = json.DATA || [];
            this.setState({ sessionAchievementsData: sessionAchievementsData });
          } else {
            this.props.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>, "error");
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
            this.props.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  loadPreSelectedCourses = async (academicSessionId=0, studentId=0) => {
    const data = new FormData();
    data.append("studentId", studentId);
    data.append("academicsSessionId", academicSessionId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C212CommonProgrammeCoursesStudentSelectionView`;
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
            this.setState({ 
              preSelectedCourseIMenutems: data,
              preSelectedCourseIMenutemsDefault: data
             });
          } else {
            this.props.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>, "error");
          }
          console.log("loadPreSelectedCourses", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            console.log(error);
            this.props.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };
  
  loadData = async (academicSessionId=0, studentId=0) => {
    const data = new FormData();
    data.append("studentId", studentId);
    data.append("academicSessionId", academicSessionId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C212CommonAcademicsCoursesStudentsAchievementsView`;
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
                preCourses: json.DATA[i].coursesObject,
                preMarks: json.DATA[i].marks,
                preResetMarks: json.DATA[i].resetMarks,
              };
              courseRowDataArray.push(courseRowDataObject);
            }
            this.setState({ courseRowDataArray: courseRowDataArray });
          } else {
            this.props.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>, "error");
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
            this.props.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  handleClickOpen = () => {
    this.setState({ popupBoxOpen: true });
  };

  handleClose = () => {
    this.setState({
      preModuleId: "",
      preCourses: {},
      preMarks: "",
      courseRowDataArray: [],
    });
    this.props.f212FormPopupClose();
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
    if (Object.keys(this.state.preCourses).length < 1) {
      this.setState({ preCoursesError: "Please select course." });
      document.getElementById("preCourses").focus();
      isValid = false;
    } else {
      let moduleNumber = document.getElementsByName("moduleNumber");
      let programmeCourseId = document.getElementsByName("programmeCourseId");
      
      let nextLevelCheck = true; 
      for(let i=0; i<moduleNumber.length; i++) {
        if(moduleNumber[i].value==this.state.preModuleId && programmeCourseId[i].value==this.state.preCourses.ID) {
          document.getElementById("preCourses").focus();
          this.props.handleOpenSnackbar("Same entry already exist.","error");
          nextLevelCheck = false;
          isValid = false;
        }
      }

      if(moduleNumber.length > 1 && nextLevelCheck) {
        let totalCourseCredit = 0;
        for(let i=0; i<moduleNumber.length; i++) {
          if(moduleNumber[i].value==this.state.preModuleId) {
            let res = this.state.preCourseMenuItems.find( (dt) => dt.ID == programmeCourseId[i].value );
            if(res){
              totalCourseCredit+=res.courseCreditId;
            }
          }
        }
        if((totalCourseCredit+this.state.preCourses.courseCreditId) > 2){
          this.setState({preCoursesError: "One full or two half couses can be selected"});
          isValid = false;
          document.getElementById("preCourses").focus();
        }else{
          this.setState({ preCoursesError: "" });
        }
      }

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
    let preResetMarks = this.state.preResetMarks;
    // let moduleNumber = document.getElementsByName("moduleNumber");
    // for (let i = 0; i < moduleNumber.length; i++) {
    //   if (moduleNumber[i].value == preModuleId) {
    //     this.setState({ preModuleIdError: "Module should be unique." });
    //     document.getElementById("preModuleId").focus();
    //     return;
    //   }
    // }
    let courseRowDataObject = {
      preModuleId: preModuleId,
      preCourses: preCourses,
      preMarks: preMarks,
      preResetMarks: preResetMarks,
    };

    courseRowDataArray.push(courseRowDataObject);

    this.setState({
      courseRowDataArray: courseRowDataArray,
      preModuleId: "",
      preCourses: {},
      preMarks: "",
      preResetMarks: 0,
    });

    let preSelectedCourseIMenutems = [...this.state.preSelectedCourseIMenutemsDefault] || [];
    let preSelectedCourseIMenutemsLength = preSelectedCourseIMenutems.length || 0;
    let courseRowDataArrayLength = courseRowDataArray.length || 0;
    let newPreSelectedCourseIMenutems = [];

    for(let i=0; i<preSelectedCourseIMenutemsLength; i++){
      let alredaySelected = true;
      for(let j=0; j<courseRowDataArrayLength;j++){
        if(preSelectedCourseIMenutems[i].ID == courseRowDataArray[j].preCourses.ID){
          alredaySelected = false;
          break;
        }
      }
      if(alredaySelected){
        newPreSelectedCourseIMenutems.push(preSelectedCourseIMenutems[i]);
      }
    }
    this.setState({preSelectedCourseIMenutems:newPreSelectedCourseIMenutems});
  };

  handeDeleteCourseRow = (index) => {
    let courseRowDataArray = this.state.courseRowDataArray;
    courseRowDataArray.splice(index, 1);
    this.setState({ courseRowDataArray: courseRowDataArray });

    let preSelectedCourseIMenutems = [...this.state.preSelectedCourseIMenutemsDefault] || [];
    let preSelectedCourseIMenutemsLength = preSelectedCourseIMenutems.length || 0;
    let courseRowDataArrayLength = courseRowDataArray.length || 0;
    let newPreSelectedCourseIMenutems = [];

    for(let i=0; i<preSelectedCourseIMenutemsLength; i++){
      let alredaySelected = true;
      for(let j=0; j<courseRowDataArrayLength;j++){
        if(preSelectedCourseIMenutems[i].ID == courseRowDataArray[j].preCourses.ID){
          alredaySelected = false;
          break;
        }
      }
      if(alredaySelected){
        newPreSelectedCourseIMenutems.push(preSelectedCourseIMenutems[i]);
      }
    }
    this.setState({preSelectedCourseIMenutems:newPreSelectedCourseIMenutems});

  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    switch (name) {
      case "academicSessionId":
        this.setState({
          courseId: "",
          tableData:[]
        });
        this.loadData(value, this.props.data.studentId);
      break;
      default:
    }
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  handleClickOnPreSelectedCourses(obj) {
    this.handleSetPreCourses(obj);
  }

  handleSetPreCourses = (value) => {
    this.setState({
      preCourses: value,
      preCoursesError: "",
    });
  };

  componentDidMount() {
    this.setState({popupBoxOpen: this.props.isOpen}); 
  }

  componentDidUpdate(prevProps){
    // Typical usage (don't forget to compare props):
    if (this.props.isOpen !== prevProps.isOpen) {
      this.setState({popupBoxOpen: this.props.isOpen});
      if ( 
          this.props.data.studentId!=0 
          && this.props.data.studentId!="" 
          && this.props.isOpen===true
        ) { 
          this.setState({
            preCourseMenuItems: this.props.preCourseMenuItems || [],
            preModuleMenuItems: this.props.preModuleMenuItems || [],
            academicSessionId: this.props.data.academicSessionId || "",
            academicSessionMenuItems: this.props.academicSessionMenuItems || []
          });
          this.loadAllSessionAchievementsData(this.props.data.studentId);
          this.loadPreSelectedCourses(this.props.data.academicSessionId, this.props.data.studentId);
          this.loadData(this.props.data.academicSessionId, this.props.data.studentId);
      }
    }
  }

  render() {

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    const { classes, data, isLoading } = this.props;

    return (
      <Fragment>
        <Dialog
          fullScreen={true}
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
              {data.studentNucleusId+" - "+data.studentName}
            </Typography>
          </DialogTitle>
          <DialogContent style={{marginTop:-30}}>
            {/* <DialogContentText> */}
              <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="center"
                spacing={2}
              >
                {this.state.sessionAchievementsData.map( (data, index) =>
                  <AcademicSessionStudentAchievements 
                    key={"sessionAchievementsData"+index}
                    classes={classes}
                    data={data}
                    isOpen={ this.props.data.academicSessionId===data.sessionId ? true : false}
                  />
                )}
                <Grid item xs={12}>
                  
                </Grid>
                <TextField
                  type="hidden"
                  id="studentId"
                  name="studentId"
                  value={data.studentId}
                />
                <Grid item xs={12} md={2}>
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
                    helperText={this.state.academicSessionIdError ? this.state.academicSessionIdError : " "}
                    inputProps={{
                      id:"academicSessionIdSA"
                    }}
                  >
                    {this.state.academicSessionMenuItems.map((dt, i) => (
                      <MenuItem
                        key={"academicSessionMenuItems2"+dt.ID}
                        value={dt.ID}
                      >
                        {dt.Label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>  
                <Grid item xs={12} md={2}>
                  <TextField
                    id="preModuleId"
                    name="preModuleId"
                    variant="outlined"
                    label="Module"
                    onChange={this.onHandleChange}
                    value={this.state.preModuleId}
                    error={!!this.state.preModuleIdError}
                    helperText={this.state.preModuleIdError ? this.state.preModuleIdError : " "}
                    required
                    fullWidth
                    select
                  >
                    {this.state.preModuleMenuItems.map((dt, i) => (
                        <MenuItem key={"PCGID" + dt.ID} value={dt.ID}>
                          {dt.Label}
                        </MenuItem>
                      ))
                    }
                  </TextField>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Autocomplete
                    //multiple
                    fullWidth
                    id="preCourses"
                    options={this.state.preCourseMenuItems}
                    value={this.state.preCourses}
                    onChange={(event, value) => this.handleSetPreCourses(value)}
                    //disableCloseOnSelect
                    getOptionLabel={(option) => typeof option.Label === 'string' ? option.Label : ""}
                    // renderTags={(tagValue, getTagProps) =>
                    //   tagValue.map((option, index) => (
                    //     <Chip
                    //       label={option.Label}
                    //       color="primary"
                    //       variant="outlined"
                    //       {...getTagProps({ index })}
                    //     />
                    //   ))
                    // }
                    // renderOption={(option,{selected}) => (
                    //   <Fragment>
                    //     <Checkbox
                    //       icon={icon}
                    //       checkedIcon={checkedIcon}
                    //       style={{ marginRight: 8 }}
                    //       checked={selected
                    //         //this.isCourseSelected(option)
                    //       }
                    //       color="primary"
                    //     />
                    //     {option.Label}
                    //   </Fragment>
                    // )}
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
                <Grid item xs={12} md={2}>
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
                <Grid item xs={12} md={2}>
                  <TextField
                    id="preResetMarks"
                    name="preResetMarks"
                    label="Reset Marks"
                    type="number"
                    required
                    fullWidth
                    variant="outlined"
                    onChange={this.onHandleChange}
                    value={this.state.preResetMarks}
                    error={!!this.state.preResetMarksError}
                    helperText={this.state.preResetMarksError ? this.state.preResetMarksError : " "}
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
                  {this.state.preSelectedCourseIMenutems.length>0 && <Typography color="primary" component="span">Pre Selected Courses <small>(click on for selection)</small>: &nbsp;</Typography>}
                  {this.state.preSelectedCourseIMenutems.map((d, i)=>
                  <Fragment>
                    <Chip 
                      key={i} 
                      size="small" 
                      label={d.Label} 
                      color="primary"
                      style={{cursor:"pointer"}}
                      onClick={(e)=>this.handleClickOnPreSelectedCourses(d)}
                    />
                    <span>&nbsp;</span>
                  </Fragment>
                  )}
                  <Divider
                    style={{
                      backgroundColor: "rgb(58, 127, 187)",
                      opacity: "0.3",
                      marginTop:4
                    }}
                  />
                </Grid>
                <TableContainer component={Paper}>
                  <Table className={classes.table} size="small" aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center" style={{borderLeft: '1px solid rgb(29, 95, 152)'}}>Module</StyledTableCell>
                        <StyledTableCell align="center">Courses</StyledTableCell>
                        <StyledTableCell align="center">Marks</StyledTableCell>
                        <StyledTableCell align="center">Reset Marks</StyledTableCell>
                        <StyledTableCell align="center" style={{borderRight: '1px solid rgb(29, 95, 152)', minWidth:100}}>Action</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.courseRowDataArray.length > 0 ?
                          this.state.courseRowDataArray.map((dt, i) => (
                            <CourseRow
                              key={"SMC"+i}
                              rowIndex={i}
                              rowData={dt}
                              onDelete={(i) => this.handeDeleteCourseRow(i)}
                              moduleMenuItems={this.state.preModuleMenuItems}
                              courseMenuItems={this.preCourses}
                            />
                          ))
                        :
                        this.state.isLoading ?
                          <StyledTableRow key={1}>
                            <StyledTableCell component="th" scope="row" colSpan={5}><center><CircularProgress/></center></StyledTableCell>
                          </StyledTableRow>
                          :
                          <StyledTableRow key={1}>
                            <StyledTableCell component="th" scope="row" colSpan={5}><center><b>No Data</b></center></StyledTableCell>
                          </StyledTableRow>
                        }
                    </TableBody>
                  </Table>
                </TableContainer>
                <br />
                <br />
              </Grid>
          </DialogContent>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
            }}
          />
          <DialogActions>
            <Button 
              autoFocus 
              onClick={this.handleClose} 
              color="secondary"
            >
              Close
            </Button>
            <Button
              onClick={this.props.onFormSubmit()}
              color="primary"
              autoFocus
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress style={{color:'#174A84'}} size={24}/> : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}
export default withStyles(styles)(F212FormPopupComponent);
