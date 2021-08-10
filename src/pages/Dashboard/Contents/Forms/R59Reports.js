import React, { Component, Fragment } from "react";
import { withStyles } from '@material-ui/core/styles';
import {Typography, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Divider, CircularProgress, Grid} from "@material-ui/core";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import Autocomplete from "@material-ui/lab/Autocomplete";
import BottomBar from "../../../../components/BottomBar/BottomBar";

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

class R46Reports extends Component {
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
      coursesMenuItems: [],
      courseId: "",
      courseIdError: "",
      sectionsMenuItems: [],
      sectionId: "",
      sectionIdError:"",
      academicSessionMenuItems: [],
      academicSessionId: "",
      academicSessionIdError: "",
      monthsMenuItems: [
        {id:1, label:"January"},
        {id:2, label:"February"},
        {id:3, label:"March"},
        {id:4, label:"April"},
        {id:5, label:"May"},
        {id:6, label:"June"},
        {id:7, label:"July"},
        {id:8, label:"August"},
        {id:9, label:"September"},
        {id:10, label:"October"},
        {id:11, label:"November"},
        {id:12, label:"December"}
      ],
      monthId: "",
      tableData: [],
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
    if (reason === "clickaway") {  return; }
    this.setState({ isOpenSnackbar: false });
  };

  getCourses = async (sessionId) => {
    let data = new FormData();
    data.append("sessionId", sessionId);
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C59CommonSessionOfferedProgrammeCoursesView`;
    await fetch(url, {
      body:data,
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
            this.setState({coursesMenuItems: json.DATA || []});
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("getCourses", json);
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

  loadAcademicSessions = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C66CommonAcademicSessionsView`;
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
            let arrayLength = array.length;
            let res = array.find( (obj) => obj.isActive === 1 );
            if(res){
              this.setState({academicSessionId:res.ID});
              this.getCourses(res.ID);
            }
            this.setState({ academicSessionMenuItems: array });
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
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
            this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  getSections = async (courseId) => {
    let data = new FormData();
    data.append("courseId", courseId);
    data.append("sessionId", this.state.academicSessionId);
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C59CommonAcademicsSectionsView`;
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

  getData = async (sectionId, monthId) => {
    this.setState({isLoading: true});
    let data = new FormData();
    data.append("sectionId", sectionId);
    data.append("monthId", monthId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C59CommonStudentsView`;
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
            this.setState({tableData: json.DATA || []});
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
              isReload: true,
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

  handleSetCourse = (value) => {    
    this.setState({
      courseId: value, 
      courseIdError: "",
      sectionId:"",
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
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    let regex = "";
    switch (name) {
      case "academicSessionId":
        this.setState({
          courseId:"",
          coursesMenuItems:[],
          tableData: []
        });
        this.getCourses(value);
       break;
    default:
        break;
    }
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

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

  handleGenerate = () => {
    //this.getData(this.state.sectionId.id, this.state.monthId);
    window.open(`#/R59ReportsAttendanceSheet/${this.state.sectionId.id+"&"+this.state.monthId+"&"+1}`,"_blank");
  }

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.loadAcademicSessions();
    
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
              Attendance Sheet
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
              <Grid item xs={12} md={3}>
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
                helperText={this.state.academicSessionIdError ? this.state.academicSessionIdError : ""}
                // disabled={!this.state.schoolId}
              >
                {this.state.academicSessionMenuItems && !this.state.isLoading ? 
                  this.state.academicSessionMenuItems.map((dt, i) => (
                    <MenuItem
                      key={"academicSessionMenuItems"+dt.ID}
                      value={dt.ID}
                    >
                      {dt.Label}
                    </MenuItem>
                  ))
                :
                  <Grid 
                    container 
                    justify="center"
                  >
                    <CircularProgress />
                  </Grid>
                }
              </TextField>
            </Grid> 
            <Grid item xs={12} md={3}>
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
            </Grid>
            <Grid item xs={12} md={3}>
              <Autocomplete
                fullWidth
                id="sectionId"
                disabled={!this.state.courseId}
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
            <Grid item xs={12} md={3}>
              <TextField
                id="monthId"
                name="monthId"
                variant="outlined"
                label="Month"
                onChange={this.onHandleChange}
                value={this.state.monthId}
                required
                fullWidth
                select
                disabled={!this.state.sectionId}
              >
                {this.state.monthsMenuItems && !this.state.isLoading ? 
                  this.state.monthsMenuItems.map((dt, i) => (
                    <MenuItem
                      key={"monthsMenuItems"+dt.id}
                      value={dt.id}
                    >
                      {dt.label}
                    </MenuItem>
                  ))
                :
                  <Grid 
                    container 
                    justify="center">
                      <CircularProgress />
                    </Grid>
                }
              </TextField> 
            </Grid>
          </Grid>
          <BottomBar
            left_button_text="View"
            left_button_hide={true}
            bottomLeftButtonAction={this.viewReport}
            right_button_text="Genrate"
            bottomRightButtonAction={this.handleGenerate}
            loading={this.state.isLoading}
            isDrawerOpen={this.props.isDrawerOpen}
            disableRightButton={!this.state.monthId}
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
export default withStyles(styles)(R46Reports);
