import React, { Component, Fragment } from 'react';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import LoginMenu from '../../../../../components/LoginMenu/LoginMenu';
import {TextField, Grid, MenuItem, CircularProgress, Divider, Typography, Chip,
    Select, IconButton, Tooltip, Checkbox, Fab, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper} from "@material-ui/core";


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

class StudentDynamicColumnsReports extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,

            attendanceData: [],
            tableData:[],
            selectedData: {},

            eventDate: new Date(),

            isLoginMenu: false,
            isReload: false,

            isOpenSnackbar: false,
            snackbarMessage: "",
            snackbarSeverity: "",

            isDownloadExcel: false,
            programmeGroupsMenuItems:[],
            programmeGroupId:"",
            programmeGroupIdError: "",
            programmeIdMenuItems: [],
            programmeId: "",
            programmeIdError: "",
            academicSessionIdMenuItems: [],
            academicSessionId: "",
            academicSessionIdError: "",

        }
    }

    componentDidMount() {
        this.loadAcademicSessions();
        this.setState({
          tableData: [
            {"label":"Session","name":"isSessionFilterOn"},
            {"label":"Nuclus ID","name":"isNuclusIDFilterOn"},
            {"label":"Student Name","name":"isStudentNameFilterOn"},
            {"label":"Programme Group","name":"isProgrammeGroupFilterOn"},
            {"label":"Programme","name":"isProgrammeFilterOn"},
            {"label":"Course","name":"isCourseFilterOn"},
            {"label":"Uol Number","name":"isUolNumberFilterOn"},
            {"label":"Year End Achivement","name":"isYearEndAchivementFilterOn"},
            {"label":"Uol Marks","name":"isUolMarksFilterOn"}
          ],
         

      })



    }

    downloadExcelData = async () => {
        if (this.state.isDownloadExcel === false) {
            this.setState({
                isDownloadExcel: true,
                isLoading: true

            })
            const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C37CommonStudentsExcelDownload?academicsSessionId=${this.state.academicSessionId}&programmeId=${this.state.programmeId}`;
            await fetch(url, {
                method: "GET",
                headers: new Headers({
                    Authorization: "Bearer " + localStorage.getItem("uclAdminToken")
                })
            })
                .then(res => {
                    if (res.status === 200) {
                        return res.blob();
                    }
                    return false;
                })
                .then(
                    json => {
                        if (json) {
                            var csvURL = window.URL.createObjectURL(json);
                            var tempLink = document.createElement("a");
                            tempLink.setAttribute("download", `Students Reports.xlsx`);
                            tempLink.href = csvURL;
                            tempLink.click();
                            console.log(json);
                        }
                    },
                    error => {
                        if (error.status === 401) {
                            this.setState({
                                isLoginMenu: true,
                                isReload: false
                            })
                        } else {
                            alert('Failed to fetch, Please try again later.');
                            console.log(error);
                        }
                    });
            this.setState({
                isDownloadExcel: false,
                isLoading: false
            })
        }
    }
    loadAcademicSessions = async () => {
        this.setState({ isLoading: true });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C37CommonAcademicSessionsView`;
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
                  this.getProgrammeGroups(res.ID);
                }
                this.setState({ academicSessionIdMenuItems: array });
                
              } else {
                this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
              }
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
    
    getProgrammeGroups = async (academicsSessionId) => {
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C37CommonProgrammeGroupsView?academicSessionId=${academicsSessionId}`;
        await fetch(url, {
          method: "GET",
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
                this.setState({programmeGroupsMenuItems: json.DATA || []});
              } else {
                this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
              }
              console.log("getProgrammeGroups",json);
            },
            (error) => {
              if (error.status === 401) {
                this.setState({
                  isLoginMenu: true,
                  isReload: true,
                });
              } else {
                this.handleOpenSnackbar("Failed to load Students Data ! Please try Again later.","error");
                console.log(error);
              }
            }
          );
      };
      loadProgrammes = async (programmeGroupId , academicsSessionId) => {
        this.setState({ isLoading: true });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C37CommonProgrammesView?programmeGroupId=${programmeGroupId}&academicsSessionId=${academicsSessionId}`;
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
                this.setState({ programmeIdMenuItems: json.DATA });
              } else {
                this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
              }
              console.log("loadProgrammes", json);
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

    onClearFilters = () => {

        this.setState({
            eventDate: new Date()
        })
    }

    onHandleChangeAS = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
        this.getProgrammeGroups(value);
    }
    onHandleChangePG = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
        this.loadProgrammes(value, this.state.academicSessionId);
    }
    onHandleChangeP = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value,
        })
        this.state.programmeId = value;
    }


    handleDateChange = (date) => {
        this.setState({
            eventDate: date
        });
    }

    handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            isOpenSnackbar: false
        });
    };

    handleOpenSnackbar = (msg, severity) => {
        this.setState({
            isOpenSnackbar: true,
            snackbarMessage: msg,
            snackbarSeverity: severity
        });
    };

    render() {
        const { isLoading } = this.state;

        return (
            <Fragment>
                <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })} />
                <div style={{
                    padding: 20
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <Typography style={{ color: '#1d5f98', fontWeight: 600, textTransform: 'capitalize' }} variant="h5">
                            Students Dynamic Columns Report
            </Typography>
                    </div>
                    <Divider style={{
                        backgroundColor: 'rgb(58, 127, 187)',
                        opacity: '0.3',
                    }} />
                    <Grid
              container
              spacing={2}
              style={{
                marginLeft: 5,
                marginRight: 10,
                marginTop: 10,
              }}
            >
              <Grid item md={4}>
                <TextField
                  id="academicSessionIds"
                  name="academicSessionId"
                  variant="outlined"
                  label="Academic Session"
                  onChange={this.onHandleChangeAS}
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
              <Grid item md={4}>
                <TextField
                  id="programmeGroupIds"
                  name="programmeGroupId"
                  variant="outlined"
                  label="Programme Group"
                  value={this.state.programmeGroupId}
                  onChange={this.onHandleChangePG}
                  error={!!this.state.programmeGroupIdError}
                  helperText={this.state.programmeGroupIdError}
                  disabled={!this.state.academicSessionId}
                  required
                  fullWidth
                  select
                >
                  {this.state.programmeGroupsMenuItems ? (
                    this.state.programmeGroupsMenuItems.map((dt, i) => (
                      <MenuItem
                        key={"programmeGroupsMenuItems" + dt.Id}
                        value={dt.Id}
                      >
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
              
              <Grid item  md={4}>
                <TextField
                  id="programmeIds"
                  name="programmeId"
                  variant="outlined"
                  label="Programme"
                  value={this.state.programmeId}
                  onChange={this.onHandleChangeP}
                  error={!!this.state.programmeIdError}
                  helperText={this.state.programmeIdError}
                  disabled={!this.state.programmeGroupId}
                  required
                  fullWidth
                  select
                >
                  {this.state.programmeIdMenuItems ? (
                    this.state.programmeIdMenuItems.map((dt, i) => (
                      <MenuItem
                        key={"programmeIdMenuItems" + dt.ID}
                        value={dt.ID}
                      >
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
              </Grid>
              <Grid
                  container
                  spacing={2}
                  style={{
                    marginLeft: 12,
                    marginRight: 10,
                    marginTop: 10,
                  }}
                >
                    <div>
                     
                    {
                          this.state.tableData.map((dt,i)=>
                           <Fragment>
                              <Typography component="span" variant="body1" color="primary">{dt.label}</Typography>
                              
                             
                              <Checkbox
                               
                                color="primary"
                                name={dt.name}
                                value={1}
                               // inputProps={{ 'aria-label': {} }}
                              />
                           </Fragment>   
                            
                          )
                      }
                         
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                        onClick={() => this.downloadExcelData()}
                        style={{
                            marginTop: 10,
                            float: "right"
                        }}
                        disabled={!this.state.programmeId}
                    > {isLoading ? <CircularProgress style={{ color: 'white' }} size={24} /> : "Download in Excel Format"}</Button>

                    </div>
                   </Grid>  
                   
                </div>
              

            </Fragment>
        );
    }
}
export default StudentDynamicColumnsReports;