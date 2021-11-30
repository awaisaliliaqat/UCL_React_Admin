import React, { Component, Fragment } from "react";
import { withStyles } from '@material-ui/core/styles';
import {Typography, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Divider, CircularProgress, Grid, Button, Checkbox,
  FormGroup, FormControlLabel, FormControl} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { DatePicker } from "@material-ui/pickers";
import BottomBar from "../../../../components/BottomBar/BottomBar";
import { FlaskEmpty } from "mdi-material-ui";

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
      "&:hover":{
        backgroundColor:"#bdbdbd"
      }
    },
    '&:nth-of-type(even)': {
      "&:hover":{
        backgroundColor:"#bdbdbd"
      }
    },
  },
}))(TableRow);

const styles = ({
  table: {
    minWidth: 750,
  },
});

class R77Reports extends Component {
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
      academicSessionIdMenuItems: [],
      academicSessionId: "",
      academicSessionLabel: "",
      academicSessionIdError: "",
      sessionTermMenuItems: [],
      sessionTermId: "",
      sessionTermIdError: "",
      coursesMenuItems: [],
      courseId: "",
      courseIdError: "",
      sectionsMenuItems: [],
      sectionId: {},
      sectionIdError:"",
      preDate: this.getTodaysDate(),
      preDateError: "",
      tableData: [],
      startTimes: [],
      startTime: "",
      startTimeError: "",
      isTeacherOnly: false,
      totalPhysicalAssignment: 0,
      totalNoOfAssesment: 0,
      gradedAssignment: 0
    };
  }

  getTodaysDate = () => {
    let todaysDate = new Date();
    //tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    return todaysDate;
  }

  handleOpenSnackbar = (msg, severity) => {
    this.setState({
      isOpenSnackbar: true,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };

  handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {  return; }
    this.setState({ isOpenSnackbar: false });
  };



  loadAcademicSession = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C210CommonAcademicSessionsView`;
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
            let data = json.DATA || [];
            let dataLength =  data.length || 0;
            let res = data.find( (option) => option.isActive == 1);
            if(res){
              this.setState({academicSessionLabel:data.Label});
              
              this.setState({academicSessionId:res.ID});
              this.loadTerms(res.ID);
            }
            this.setState({ academicSessionIdMenuItems:data});
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadAcademicSession", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  loadTerms = async (academicsSessionId) => {
    this.setState({ isLoading: true });
    let data = new FormData();
    data.append("academicsSessionId", academicsSessionId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C77CommonAcademicsSessionsTermsView`;
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
            this.setState({sessionTermMenuItems: json.DATA || [] });
            this.getSections(this.state.academicSessionId,this.state.sessionTermId);
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("getTerms", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  

  getSections = async (academicSessionId,sessionTermId) => {
   
    let data = new FormData();
    data.append("academicSessionId", academicSessionId);
    data.append("sessionTermId", sessionTermId);

    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C77CommonAcademicsSectionsView`;
    await fetch(url, {
      method: "POST",
      body:data,
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
            this.setState({sectionsMenuItems: json.DATA || []});
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("getSections", json);
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            //alert('Failed to fetch, Please try again later.');
            this.handleOpenSnackbar("Failed to fetch, Please try again later.","error");
            console.log(error);
          }
        }
      );
    this.setState({isLoading: false});
  };


  

  getData = async (sectionId,academicSessionId,sessionTermId) => {
    let data = new FormData();
    data.append("academicSessionId", academicSessionId);
    data.append("sessionTermId", sessionTermId);
    data.append("sectionId", sectionId);
    this.setState({
      isLoading: true,
      isTeacherOnly: false
    });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C77CommonAcademicsAssignmentsView`;
    await fetch(url, {
      method: "POST",
      body:data,
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
            this.setState({tableData: []});
            this.setState({tableData: json.DATA || []});
            var newLength = json.DATA.length - 1;
             this.setState({
                  totalPhysicalAssignment : json.DATA[newLength].totalPhysicalAssignments || 0,
             });
            
            if(json.DATA.length>0){
                  for(let i=0;i<json.DATA.length;i++){
                    if(json.DATA[i].totalNoOfAssesment>0){
                      this.setState({
                        totalNoOfAssesment : json.DATA[i].totalNoOfAssesment || 0
                      });
                    }
                }
             }
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
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
            //alert('Failed to fetch, Please try again later.');
            this.handleOpenSnackbar("Failed to fetch, Please try again later.","error");
            console.log(error);
          }
        }
      );
    this.setState({isLoading: false});
  };

  onFormSubmit = async (e) => {
    var assignmentIds = document.getElementsByName("assignmentId").length;
    var assessmentIds = document.getElementsByName("assessmentId").length;
    var gradedAssignment = (assignmentIds+assessmentIds);
     if(gradedAssignment>this.state.totalNoOfAssesment){
      alert("You Can't Select More Than "+this.state.totalNoOfAssesment);
      return false;
     }
    let myForm = document.getElementById("myForm");
    const data = new FormData(myForm);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C77CommonAcademicsAssignmentsSave`;
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
            this.setState({
              tableData:[],
              preDate:this.getTodaysDate(),
              sectionId:{},
              courseId:"",
              startTime:"",
              startTimes:[]
            });
            setTimeout(() => {
                //window.location.reload();
            }, 2000);
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}+<br/>+{json.USER_MESSAGE}</span>,"error");
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
            this.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

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

  handleSetCourse = (value) => {    
    this.setState({
      courseId: value, 
      courseIdError: "",
      sectionId:{},
      sectionsMenuItems:[],
      tableData:[]
    });
    if(value) {
      this.getSections(value.id);
    }
  };

  handleSetSection = (value) => {    
    this.setState({
      sectionId: value, 
      sectionError: "",
      tableData:[]
    });

    if(value!=null){
    //  this.getStartTime(value.id,this.getDateInString(this.state.preDate));
    }
  

  };
 
  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    let regex = "";
    switch (name) {
      case "academicSessionId":
        this.setState({
        
          termId:"",
          termMenuItems:[],
        });
        this.loadTerms(value);
       
        break;
   
        case "sessionTermId":
          let termMenuItems = this.state.sessionTermMenuItems;
          let res = termMenuItems.find((obj) => obj.id === value);
          if(res){
            
            this.getSections(this.state.academicSessionId,value)
          }
        break;
        default:
          break;
    }
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  handleChangeCheckbox = (e) => {
    const { name, checked } = e.target;
    this.setState({[name]: checked});
    if(checked){
      this.setState({tableData:[]});
    }
  }

  isCourseValid = () => {
    let isValid = true;        
    if (!this.state.courseId) {
        this.setState({courseIdError:"Please select course."});
        document.getElementById("courseId").focus();
        isValid = false;
    } else {
        this.setState({courseIdError:""});
    }
    return isValid;
  }

  handleChangePreDate = (date) => {
    this.setState({preDate: date});
    this.getStartTime(this.state.sectionId.id,this.getDateInString(date));
  };
 
  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.loadAcademicSession();
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
             Graded Assignments for Progress Report
            </Typography>
          </div>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
            }}
          />
          <br/>
          <Grid 
            container 
            justify="center"
            alignItems="center"
            spacing={2}
          >
            {/* <Grid item xs={4} md={3}>
              <Autocomplete
                fullWidth
                id="courseId"
                options={this.state.coursesMenuItems}
                value={this.state.courseId}
                onChange={(event, value) => this.handleSetCourse(value)}
                getOptionLabel={(option) => typeof option.label === 'string' ? option.label : ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Courses"
                    placeholder="Search and Select"
                    required
                    error={!!this.state.courseIdError}
                    helperText={this.state.courseIdError ? this.state.courseIdError : "" }
                  />
                )}
              />
            </Grid> */}
           <Grid item xs={4} md={4}>
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
            <Grid item xs={3} md={2}>
              <TextField
                id="sessionTermId"
                name="sessionTermId"
                variant="outlined"
                label="Term"
                onChange={this.onHandleChange}
                value={this.state.sessionTermId}
                error={!!this.state.sessionTermIdError}
                helperText={this.state.sessionTermIdError}
                disabled={!this.state.academicSessionId}
                required
                fullWidth
                select
              >
                {this.state.sessionTermMenuItems.map((dt, i) => (
                  <MenuItem
                    key={"sessionTermMenuItems"+ dt.id}
                    value={dt.id}
                  >
                    {dt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={4} md={4}>
              <Autocomplete
                fullWidth
                id="sectionId"
                disabled={!this.state.sessionTermId}
                options={this.state.sectionsMenuItems}
                value={this.state.sectionId}
                onChange={(event, value) => this.handleSetSection(value)}
                getOptionLabel={(option) => typeof option.label === 'string' ? option.label : ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Sections"
                    placeholder="Search and Select"
                    required
                    error={!!this.state.sectionIdError}
                    helperText={this.state.sectionIdError ? this.state.sectionIdError : "" }
                  />
                )}
              />
            </Grid>
           
            <Grid item xs={2}>
              <Button 
                variant="contained" 
                color="primary"
                disabled={!this.state.sessionTermId || !this.state.sectionId.id }
                onClick={()=>this.getData(this.state.sectionId.id,this.state.academicSessionId,this.state.sessionTermId)}
                //size="large"
                style={{
                  paddingTop:14,
                  paddingBottom:14
                }}
              >
                Search
              </Button>
            </Grid>
            <Grid item xs={12}>
            <Divider
              style={{
                backgroundColor: "rgb(58, 127, 187)",
                opacity: "0.3",
              }}
            />
            </Grid>
            {this.state.sectionId!=null?
           
            <Grid item xs={12}>
              <Grid>
                <Typography>
                  Total Physical Assignment : {this.state.totalPhysicalAssignment}
                </Typography>
                <Typography>
                  Max. No. Of Assessments For This Term : {this.state.totalNoOfAssesment}
                </Typography>
              </Grid>

              <form id="myForm">
                <TextField type="hidden" name="academicSessionId" value={this.state.academicSessionId}/>
                <TextField type="hidden" name="sectionId" value={this.state.sectionId.id}/>
                <TextField type="hidden" name="sessionTermId" value={this.state.sessionTermId}/>
               
                <TableContainer component={Paper} style={{overflowX:"inherit"}}>
                  <Table size="small" className={classes.table} aria-label="customized table">
                      <TableHead>
                        <TableRow>
                        <StyledTableCell align="center" style={{borderLeft: '1px solid rgb(47, 87, 165)', width:"10%"}}>Sequence No.</StyledTableCell>
                          <StyledTableCell align="center" style={{borderLeft: '1px solid rgb(47, 87, 165)', width:"35%"}}>Name</StyledTableCell>
                          <StyledTableCell align="center" style={{borderLeft: '1px solid rgb(47, 87, 165)', width:"10%"}}>Start date</StyledTableCell>
                          <StyledTableCell align="center" style={{borderRight: '1px solid rgb(47, 87, 165)', width:"10%"}}>Total Marks</StyledTableCell>
                          <StyledTableCell align="center" style={{borderRight: '1px solid rgb(47, 87, 165)', width:"25%" }}>Mark as&nbsp;Graded</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.tableData.length > 0 ?
                          this.state.tableData.map((dt,i)=>
                           !dt.totalNoOfAssesment?
                          <StyledTableRow key={dt+i}>
                            <StyledTableCell component="th" scope="row"><Typography component="span" variant="body1" color="primary">{dt.SRNo}</Typography></StyledTableCell>
                            <StyledTableCell component="th" scope="row"><Typography component="span" variant="body1" color="primary">{dt.label}</Typography></StyledTableCell>
                            <StyledTableCell component="th" scope="row"><Typography component="span" variant="body1" color="primary">{dt.startDateReport}</Typography></StyledTableCell>
                            <StyledTableCell component="th" scope="row"><Typography component="span" variant="body1" color="primary">{dt.totalMarks}</Typography></StyledTableCell>
                        
                            <StyledTableCell align="center">
                              {dt.TypeId==1?
                              <Checkbox
                              defaultChecked={!!dt.isGraded}
                              color="primary"
                              name="assignmentId"
                              value={dt.id}
                              inputProps={{ 'aria-label': 'assignmentId' }}
                            />
                            :
                            <Checkbox
                              defaultChecked={!!dt.isGraded}
                              color="primary"
                              name="assessmentId"
                              value={dt.assessmentId}
                              inputProps={{ 'aria-label': 'assessmentId' }}
                            />}
                            </StyledTableCell>
                          </StyledTableRow>
                          :
                          ""
                          )
                          : this.state.isLoading ?
                            <StyledTableRow key={1}>
                              <StyledTableCell component="th" scope="row" colSpan={2}><center><CircularProgress /></center></StyledTableCell>
                            </StyledTableRow>
                            :
                            <StyledTableRow key={1}>
                              <StyledTableCell component="th" scope="row" colSpan={5}><center><b>No Data</b></center></StyledTableCell>
                            </StyledTableRow>
                          }
                    </TableBody>
                  </Table>
                </TableContainer>
              </form>
            </Grid>
            :
            ""
              }
          </Grid>
          <br/>
          <br/>
          <BottomBar
            left_button_text="View"
            left_button_hide={true}
            bottomLeftButtonAction={this.viewReport}
            right_button_text="Save"
            bottomRightButtonAction={this.onFormSubmit}
            loading={this.state.isLoading}
            isDrawerOpen={this.props.isDrawerOpen}
            disableRightButton={!this.state.tableData.length && !this.state.isTeacherOnly }
          />
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
export default withStyles(styles)(R77Reports);
