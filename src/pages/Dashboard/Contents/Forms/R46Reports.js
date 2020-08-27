import React, { Component, Fragment } from "react";
import { withStyles } from '@material-ui/core/styles';
import {Typography, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Divider, CircularProgress, Grid} from "@material-ui/core";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";

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
      teachersMenuItems: [],
      teacherId: "",
      teacherIdError: "",
      timetableData: [],
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

  getTeachers = async () => {
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C46CommonTeacherView`;
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
            this.setState({teachersMenuItems: json.DATA || []});
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("getTeachers", json);
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

  getData = async (teacherId) => {
    this.setState({isLoading: true});
    let data = new FormData();
    data.append("teacherId", teacherId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C46CommonTeacherTimeTableView`;
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
            this.setState({timetableData: json.DATA || []});
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

  
  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    let regex = "";
    switch (name) {
        case "teacherId":
            this.getData(value);
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
    if (!this.state.teacherId) {
        this.setState({teacherIdError:"Please select course."});
        document.getElementById("teacherId").focus();
        isValid = false;
    } else {
        this.setState({teacherIdError:""});
    }
    return isValid;
  }

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.getTeachers();
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
              Teacher Timetable
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
            <Grid item xs={12} md={4}>
              <TextField
                id="teacherId"
                name="teacherId"
                variant="outlined"
                label="Teacher"
                onChange={this.onHandleChange}
                value={this.state.teacherId}
                error={!!this.state.teacherIdError}
                helperText={this.state.teacherIdError ? this.state.teacherIdError : " "}
                required
                fullWidth
                select
              >
                {this.state.teachersMenuItems && !this.state.isLoading ? 
                  this.state.teachersMenuItems.map((dt, i) => (
                    <MenuItem
                      key={"teachersMenuItems"+dt.id}
                      value={dt.id}
                    >
                      {dt.displayName}
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
                  {this.state.timetableData.length > 0 ?
                    this.state.timetableData.map((row) => (
                      <StyledTableRow key={row}>
                        <StyledTableCell component="th" scope="row">{row.time.split("-").map((dt, i)=><Fragment>{i != 0 ? <Fragment><br/></Fragment> : ""}{dt}</Fragment>)}</StyledTableCell>
                        <StyledTableCell align="center">{row.Monday.split(",").map((dt, i)=><Fragment>{i != 0 ? <Fragment><br/><br/></Fragment> : ""}{dt}</Fragment>)}</StyledTableCell>
                        <StyledTableCell align="center">{row.Tuesday.split(",").map((dt, i)=><Fragment>{i != 0 ? <Fragment><br/><br/></Fragment> : ""}{dt}</Fragment>)}</StyledTableCell>
                        <StyledTableCell align="center">{row.Wednesday.split(",").map((dt, i)=><Fragment>{i != 0 ? <Fragment><br/><br/></Fragment> : ""}{dt}</Fragment>)}</StyledTableCell>
                        <StyledTableCell align="center">{row.Thursday.split(",").map((dt, i)=><Fragment>{i != 0 ? <Fragment><br/><br/></Fragment> : ""}{dt}</Fragment>)}</StyledTableCell>
                        <StyledTableCell align="center">{row.Friday.split(",").map((dt, i)=><Fragment>{i != 0 ? <Fragment><br/><br/></Fragment> : ""}{dt}</Fragment>)}</StyledTableCell>
                        <StyledTableCell align="center">{row.Saturday.split(",").map((dt, i)=><Fragment>{i != 0 ? <Fragment><br/><br/></Fragment> : ""}{dt}</Fragment>)}</StyledTableCell>
                        <StyledTableCell align="center">{row.Sunday.split(",").map((dt, i)=><Fragment>{i != 0 ? <Fragment><br/><br/></Fragment> : ""}{dt}</Fragment>)}</StyledTableCell>
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
export default withStyles(styles)(R46Reports);
