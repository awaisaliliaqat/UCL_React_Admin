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
import { format } from "date-fns";

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


function CourseRow(props) {

  const {rowIndex, rowData,  onDelete,   moduleMenuItems=[],   courseMenuItems=[],  ...rest} = props;

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
    //handleCourse(rowData.preCourses);
  });

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return (
      <StyledTableRow key={rowData}>
        <StyledTableCell component="th" scope="row" align="center">
          {rowData.student}
          <TextField type="hidden" name="studentId" value={rowData.studentId}/>
        </StyledTableCell>
        <StyledTableCell align="center">
          {format(rowData.dateOfBirth,'MM/dd/yyyy')}
          <TextField type="hidden" name="dateOfBirth" value={rowData.preMarks} />
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

class F75FormPopupComponent extends Component {
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
      preModuleMenuItems: [],
      preModuleId: "",
      preModuleIdError: "",
      preCourseMenuItems: [],
      preCourses: {},
      tableData: [],
      sessionAchievementsData: []
    };
  }

  handleClickOpen = () => {
    this.setState({ popupBoxOpen: true });
  };

  handleClose = () => {
    this.setState({
      preModuleId: "",
      preCourses: {},
      preMarks: "",
      tableData: [],
    });
    this.props.f75FormPopupClose();
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

    let tableData = this.state.tableData;
    let preModuleId = this.state.preModuleId;
    let preCourses = this.state.preCourses;
    let preMarks = this.state.preMarks;

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
    };

    tableData.push(courseRowDataObject);

    this.setState({
      tableData: tableData,
      preModuleId: "",
      preCourses: {},
      preMarks: "",
    });

  };

  handeDeleteCourseRow = (index) => {
    let tableData = this.state.tableData;
    tableData.splice(index, 1);
    this.setState({ tableData: tableData });
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
            tableData: this.props.data.studentDetail || [],
            preModuleMenuItems: this.props.preModuleMenuItems || [],
            academicSessionId: this.props.data.academicSessionId || "",
            academicSessionMenuItems: this.props.academicSessionMenuItems || []
          });
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
              {data.accountId}
            </Typography>
          </DialogTitle>
          <DialogContent style={{marginTop:-30}}>
            {/* <DialogContentText> */}
              <Grid
                container
                direction="row"
                justifyContent="space-evenly"
                alignItems="center"
                spacing={2}
              >
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
                <Grid item xs={12} md={3}>
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
                <Grid item xs={12} md={4}>
                  <Autocomplete
                    //multiple
                    fullWidth
                    id="preCourses"
                    options={this.state.preCourseMenuItems}
                    value={this.state.preCourses}
                    onChange={(event, value) => this.handleSetPreCourses(value)}
                    getOptionLabel={(option) => typeof option.Label === 'string' ? option.Label : ""}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Courses"
                        placeholder="Search and Select"
                        error={!!this.state.preCoursesError}
                        helperText={this.state.preCoursesError ? (this.state.preCoursesError) : ""}
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
                <TableContainer component={Paper}>
                  <Table className={classes.table} size="small" aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center" style={{borderLeft: '1px solid rgb(29, 95, 152)'}}>Student</StyledTableCell>
                        {/* <StyledTableCell align="center">Courses</StyledTableCell> */}
                        <StyledTableCell align="center">Date Of Birth</StyledTableCell>
                        <StyledTableCell align="center" style={{borderRight: '1px solid rgb(29, 95, 152)', minWidth:100}}>Action</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.tableData.length > 0 ?
                          this.state.tableData.map((dt, i) => (
                            <CourseRow
                              key={"students"+i}
                              rowIndex={i}
                              rowData={dt}
                              onDelete={(i) => this.handeDeleteCourseRow(i)}
                              //moduleMenuItems={this.state.preModuleMenuItems}
                              //courseMenuItems={this.preCourses}
                            />
                          ))
                        :
                        this.state.isLoading ?
                          <StyledTableRow key={1}>
                            <StyledTableCell component="th" scope="row" colSpan={4}><center><CircularProgress/></center></StyledTableCell>
                          </StyledTableRow>
                          :
                          <StyledTableRow key={1}>
                            <StyledTableCell component="th" scope="row" colSpan={4}><center><b>No Data</b></center></StyledTableCell>
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
export default withStyles(styles)(F75FormPopupComponent);
