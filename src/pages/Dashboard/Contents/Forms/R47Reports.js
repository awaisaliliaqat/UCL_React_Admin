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
      programGroupsMenuItems: [],
      programGroupId: "",
      programGroupIdError: "",
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

  getprogramGroups = async () => {
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C47CommonSessionOfferedProgrammeGroupsView`;
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

  getData = async (programGroupId) => {
    this.setState({isLoading: true});
    let data = new FormData();
    data.append("programmeGroupId", programGroupId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C47CommonProgrammesGroupTimeTableView`;
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

  handleSetProgrammeGroup = (value) => {
    if(value) { 
        this.getData(value.ID); 
    }
    else { 
      this.setState({timetableData:[]}); 
    }
    this.setState({
      programGroupId: value, 
      programGroupIdError: ""
    });
  };
  
  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    let regex = "";
    switch (name) {
        case "programGroupId":
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
              Program Group Timetable
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
            <Autocomplete
                fullWidth
                id="programGroupId"
                options={this.state.programGroupsMenuItems}
                value={this.state.programGroupId}
                onChange={(event, value) => this.handleSetProgrammeGroup(value)}
                getOptionLabel={(option) => typeof option.Label === 'string' ? option.Label : ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Program Group"
                    placeholder="Search and Select"
                    error={!!this.state.programGroupIdError}
                    helperText={this.state.programGroupIdError ? this.state.programGroupIdError : "" }
                  />
                )}
              />
              {/* 
              <TextField
                id="programGroupId"
                name="programGroupId"
                variant="outlined"
                label="Program Group"
                onChange={this.onHandleChange}
                value={this.state.programGroupId}
                error={!!this.state.programGroupIdError}
                helperText={this.state.programGroupIdError ? this.state.programGroupIdError : " "}
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
                    justify="center">
                      <CircularProgress />
                    </Grid>
                }
              </TextField> 
              */}
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
                    this.state.timetableData.map((row, index) => (
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
export default withStyles(styles)(R46Reports);
