import React, { Component, Fragment } from "react";
import { withStyles } from '@material-ui/core/styles';
import {Typography, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Divider, CircularProgress, Grid} from "@material-ui/core";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import Autocomplete from "@material-ui/lab/Autocomplete";

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

class F56Form extends Component {
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
      programGroupsMenuItems: [],
      programGroupId: "",
      programGroupIdError: "",
      coursesMenuItems: [],
      courseId: "",
      courseIdError: "",
      sectionsMenuItems: [],
      sectionId: "",
      sectionIdError: "",
      changeTypeId:"",
      roomsTableData: [],
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

  getprogramGroups = async () => {
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C56CommonProgrammeGroupView`;
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
            this.setState({programGroupsMenuItems: json.DATA || []});
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("getprogramGroups", json);
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

  getCourses = async (programmeGroupId) => {
    let data = new FormData();
    data.append("programmeGroupId",programmeGroupId);
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C56CommonSessionOfferedProgrammeCoursesView`;
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

  getSections = async (courseId) => {
    let data = new FormData();
    data.append("courseId", courseId);
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C56CommonAcademicsSections`;
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

  getData = async (sectionId, changeTypeId) => {
    this.setState({isLoading: true});
    let data = new FormData();
    data.append("sectionId", sectionId);
    data.append("changeTypeId", changeTypeId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C56ChangeRoomView`;
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
            this.setState({roomsTableData: json.DATA || []});
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

  handleSetCourses = (value) => {
    this.setState({
      sectionId:"",
      sectionsMenuItems:[],
      roomsTableData:[],
      changeTypeId:""
    });
    if(value) { 
      this.getSections(value.id);
    } 
    this.setState({
      courseId: value, 
      courseIdError: ""
    });
  };
  
  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    let regex = "";
    switch (name) {
        case "programGroupId":
            this.setState({
              coursesMenuItems:[],
              courseId:null,
              sectionsMenuItems:[],
              sectionId:"",
              changeTypeId:"",
              roomsTableData:[]
            });
            this.getCourses(value);
        break;
        case "sectionId":
            this.setState({
              roomsTableData:[],
              changeTypeId:""
            });
        break;
        case "changeTypeId":
            this.setState({
              roomsTableData:[]
            });
            this.getData(this.state.courseId.id, value);
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
    if (!this.state.programGroupId) {
        this.setState({programGroupIdError:"Please select course."});
        document.getElementById("programGroupId").focus();
        isValid = false;
    } else {
        this.setState({programGroupIdError:""});
    }
    return isValid;
  }

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.getprogramGroups();
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
              Change Room
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
                id="programGroupId"
                name="programGroupId"
                variant="outlined"
                label="Program Group"
                onChange={this.onHandleChange}
                value={this.state.programGroupId}
                error={!!this.state.programGroupIdError}
                helperText={this.state.programGroupIdError}
                required
                fullWidth
                select
              >
                {this.state.programGroupsMenuItems && !this.state.isLoading ? 
                  this.state.programGroupsMenuItems.map((dt, i) => (
                    <MenuItem
                      key={"programGroupsMenuItems"+dt.ID}
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
                onChange={(event, value) => this.handleSetCourses(value)}
                getOptionLabel={(option) => typeof option.label === 'string' ? option.label : ""}
                disabled={!this.state.programGroupId}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    required
                    label="Courses"
                    placeholder="Search and Select"
                    error={!!this.state.courseIdError}
                    helperText={this.state.courseIdError}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                id="sectionId"
                name="sectionId"
                variant="outlined"
                label="Sections"
                onChange={this.onHandleChange}
                value={this.state.sectionId}
                error={!!this.state.sectionIdError}
                helperText={this.state.sectionIdError}
                required
                fullWidth
                select
                disabled={!this.state.courseId}
              >
                {this.state.sectionsMenuItems && !this.state.isLoading ? 
                  this.state.sectionsMenuItems.map((dt, i) => (
                    <MenuItem
                      key={"sectionsMenuItems"+dt.id}
                      value={dt.id}
                    >
                      {dt.label}
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
              <TextField
                id="changeTypeId"
                name="changeTypeId"
                variant="outlined"
                label="Change Type"
                onChange={this.onHandleChange}
                value={this.state.changeTypeId}
                error={!!this.state.changeTypeIdError}
                helperText={this.state.changeTypeIdError}
                required
                fullWidth
                select
                disabled={!this.state.sectionId}
              >
                <MenuItem value={1}>One Time</MenuItem>
                <MenuItem value={2}>Permanently</MenuItem>
              </TextField> 
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
              <Table className={classes.table} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell style={{borderLeft: '1px solid rgb(29, 95, 152)'}}>&nbsp;</StyledTableCell>
                    <StyledTableCell align="center">Monday</StyledTableCell>
                    <StyledTableCell align="center">Tuesday</StyledTableCell>
                    <StyledTableCell align="center">Wednesday</StyledTableCell>
                    <StyledTableCell align="center">Thursday</StyledTableCell>
                    <StyledTableCell align="center">Friday</StyledTableCell>
                    <StyledTableCell align="center">Saturday</StyledTableCell>
                    <StyledTableCell align="center" style={{borderRight: '1px solid rgb(29, 95, 152)'}}>Sunday</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.roomsTableData.length > 0 ?
                    this.state.roomsTableData.map((row, index) => (
                      <StyledTableRow key={row+index}>
                        <StyledTableCell component="th" scope="row">{row.time.split("-").map((dt, i)=><Fragment key={"time"+dt+i}>{i != 0 ? <Fragment><br/></Fragment> : ""}<span style={{whiteSpace:"nowrap"}}>{dt}</span></Fragment>)}</StyledTableCell>
                        <StyledTableCell align="center">{row.Monday.split(",").map((dt, i)=><Fragment key={"Monday"+dt+i}>{i != 0 ? <Fragment><br/><br/></Fragment> : ""}{dt}</Fragment>)}</StyledTableCell>
                        <StyledTableCell align="center">{row.Tuesday.split(",").map((dt, i)=><Fragment key={"Tuesday"+dt+i}>{i != 0 ? <Fragment><br/><br/></Fragment> : ""}{dt}</Fragment>)}</StyledTableCell>
                        <StyledTableCell align="center">{row.Wednesday.split(",").map((dt, i)=><Fragment key={"Wednesday"+dt+i}>{i != 0 ? <Fragment><br/><br/></Fragment> : ""}{dt}</Fragment>)}</StyledTableCell>
                        <StyledTableCell align="center">{row.Thursday.split(",").map((dt, i)=><Fragment key={"Thursday"+dt+i}>{i != 0 ? <Fragment><br/><br/></Fragment> : ""}{dt}</Fragment>)}</StyledTableCell>
                        <StyledTableCell align="center">{row.Friday.split(",").map((dt, i)=><Fragment key={"Friday"+dt+i}>{i != 0 ? <Fragment><br/><br/></Fragment> : ""}{dt}</Fragment>)}</StyledTableCell>
                        <StyledTableCell align="center">{row.Saturday.split(",").map((dt, i)=><Fragment key={"Saturday"+dt+i}>{i != 0 ? <Fragment><br/><br/></Fragment> : ""}{dt}</Fragment>)}</StyledTableCell>
                        <StyledTableCell align="center">{row.Sunday.split(",").map((dt, i)=><Fragment key={"Sunday"+dt+i}>{i != 0 ? <Fragment><br/><br/></Fragment> : ""}{dt}</Fragment>)}</StyledTableCell>
                      </StyledTableRow>
                    ))
                    :
                    this.state.isLoading ?
                    <StyledTableRow key={1}>
                      <StyledTableCell component="th" scope="row" colSpan={8}><center><CircularProgress/></center></StyledTableCell>
                    </StyledTableRow>
                    :
                    <StyledTableRow key={1}>
                      <StyledTableCell component="th" scope="row" colSpan={8}><center><b>No Data</b></center></StyledTableCell>
                    </StyledTableRow>
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
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
export default withStyles(styles)(F56Form);
