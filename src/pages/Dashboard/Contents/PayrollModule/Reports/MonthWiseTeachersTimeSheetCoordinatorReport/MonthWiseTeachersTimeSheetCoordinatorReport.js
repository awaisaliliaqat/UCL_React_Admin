import React, { Component, Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";
import TimeSheetFilter from './Chunks/TimeSheetFilter';
import TablePanel from '../../../../../../components/ControlledTable/RerenderTable/TablePanel';
import LoginMenu from '../../../../../../components/LoginMenu/LoginMenu';
import CustomizedSnackbar from "../../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import FilterIcon from "mdi-material-ui/FilterOutline";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { format } from 'date-fns';
import { Checkbox } from "@material-ui/core";
import { Button, TextField,MenuItem,Grid } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DialogTitle from '@material-ui/core/DialogTitle';

function isEmpty(obj) {
    if (obj == null) return true;

    if (obj.length > 0) return false;
    if (obj.length === 0) return true;

    if (typeof obj !== "object") return true;

    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }


    return true;
}

class MonthWiseTeachersTimeSheetCoordinatorReport extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            recordId:0,
            attendanceData: [],
           // reason:"",
            statusId:0,
            status:"",
            reason:"",
            selectedData: {},

            fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            toDate: new Date(),
           
            fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
            toDate: new Date(),

            teacherId: "",
            teacherObject: {},
            teacherObjectError: "",
            teacherData: [],

            showTableFilter: false,

            isLoginMenu: false,
            isReload: false,

            isOpenSnackbar: false,
            snackbarMessage: "",
            snackbarSeverity: "",
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
              coursesMenuItems: [],
              courseId: "",
              courseIdError: "",
              
              sectionsMenuItems: [],
              sectionId: "",
              sectionIdError:"",
              isOpenActionMenu:false

        }
    }


    onUpdateStatus = async (statusID) => {
      
        // console.log(this.state.flagId);
        let myForm = document.getElementById("myFormUpdate");
        const data = new FormData(myForm);
        data.append("actionId",statusID);
        data.append("recordId",this.state.recordId);
        data.append("reason",this.state.reason);
        this.setState({ isLoading: true });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C303MonthWiseTeacherTimeSheetCoordinatorUpdate`;
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
                setTimeout(() => {
                    window.location.reload();
                //   if (this.state.recordId != 0) {
                //     window.location = "#/dashboard/month-wise-teacher-time-sheet-report";
                //   } else {
                  
                //   }
                }, 2000);
              } else {
                this.handleOpenSnackbar(json.SYSTEM_MESSAGE+"\n"+json.USER_MESSAGE,"error");
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

    componentDidMount() {
        this.getTeachersData();
      
    }

    getTeachersData = async () => {
        this.setState({ isLoading: true })
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C303CommonUsersView`;
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclAdminToken")
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
                json => {
                    if (json.CODE === 1) {
                        this.setState({
                            teacherData: json.DATA || []
                        });
                    } else {
                        this.handleOpenSnackbar(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE, "error");
                    }
                    console.log(json);
                },
                error => {
                    if (error.status == 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: true
                        })
                    } else {
                        console.log(error);
                        this.handleOpenSnackbar("Failed to Load Data ! Please try Again later.", "error");
                    }
                });
        this.setState({ isLoading: false })
    }


   

    getDataByTeacherIdAndDate = async (teacherId,fromDate) => {
        this.setState({
            isLoading: true
        })
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C303CommonAcademicsAttendanceTeachersLogView?fromDate=${format(fromDate, "dd-MM-yyyy")}&teacherId=${teacherId}`;
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclAdminToken")
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
                json => {
                    if (json.CODE === 1) {

                        this.setState({
                            attendanceData: json.DATA || [],
                            status:"",
                            reason:"",
                           
                        })
                        if(json.DATA.length>0){
                            this.setState({
                                statusId:json.DATA[0].statusId,
                                status:json.DATA[0].status || 0,
                               
                                reason:json.DATA[0].reason  || "", 
                                recordId:json.DATA[0].recordId
                            })
                        }
                    } else {
                        this.handleOpenSnackbar(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE, "error");
                    }
                    console.log(json);
                },
                error => {
                    if (error.status === 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: true
                        })
                    } else {
                        this.handleOpenSnackbar("Failed to Load Data, Please try again later", "error");
                        console.log(error);
                    }
                });
        this.setState({
            isLoading: false
        })


    }

    onAutoCompleteChange = (e, value) => {
        let object = isEmpty(value) ? {} : value;
        this.setState({
            teacherObject: object,
            teacherId: object.id || "",
            teacherObjectError: ""
        })
        if (object.id) {
            // this.getData(object.id);
        }
    }


    onClearFilters = () => {

        this.setState({
            fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            toDate: new Date(),
            attendanceData: [],
            teacherId: "",
            teacherObject: {},
            teacherObjectError: ""
        })
    }

    onHandleChange = e => {
        const { name, value } = e.target;
        // switch (name) {
        //     case "sectionTypeId":
        //         this.setState({
        //             sectionId: 0,
        //             sectionData: [],
        //             attendanceData: []
        //         })
        //         this.getSectionData(value);
        //         break;
        //     default:
        //         break;
        // }
        this.setState({
            [name]: value
        })
    }


    handleDateChange = (date, name) => {
        this.setState({
            [name]: date
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
    
    onHandleClose = () => {
        alert("Yooo");
        this.setState({

            isOpenActionMenu: false
     
        })
    }

    openDailog=()=>{
        this.setState({
            isOpenActionMenu: true
        
        })
    }

    handleOpenSnackbar = (msg, severity) => {
        this.setState({
            isOpenSnackbar: true,
            snackbarMessage: msg,
            snackbarSeverity: severity
        });
    };

    handleToggleTableFilter = () => {
        this.setState({ showTableFilter: !this.state.showTableFilter });
    }

    render() {
        const columns = [
            { name: "Section", dataIndex: "sectionLabel", sortIndex: "sectionLabel", sortable: true, customStyleHeader: { width: '17%' } },
            { name: "Section Type", dataIndex: "sectionTypeLabel", sortIndex: "sectionTypeLabel", sortable: true, customStyleHeader: { width: '17%' } },
            { name: "Course Id", dataIndex: "courseId", sortable: false, customStyleHeader: { width: '12%' } },
            { name: "Course Label", dataIndex: "courseLabel", sortable: false, customStyleHeader: { width: '17%' } },
            { name: "Class Schedule", dataIndex: "startTimestamp", sortIndex: "startTimestampSimple", sortable: true, customStyleHeader: { width: '15%' } },
           
        ]

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
                            Month Wise Teacher's Timesheet Admin Report
                         </Typography>
                        <div style={{ float: "right" }}>
                            <Tooltip title="Table Filter">
                                <IconButton
                                    style={{ marginLeft: "-10px" }}
                                    onClick={() => this.handleToggleTableFilter()}
                                >
                                    <FilterIcon fontSize="default" color="primary" />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                    <Divider style={{
                        backgroundColor: 'rgb(58, 127, 187)',
                        opacity: '0.3',
                    }} />
                    <TimeSheetFilter onAutoCompleteChange={(e, value) => this.onAutoCompleteChange(e, value)} isLoading={this.state.isLoading} handleDateChange={this.handleDateChange} onClearFilters={this.onClearFilters} values={this.state} getDataByStatus={(sectionId) => this.getData(sectionId)} getDataByTeacherIdAndDate= {(teacherId,fromDate) => this.getDataByTeacherIdAndDate(this.state.teacherId,this.state.fromDate)}  onHandleChange={e => this.onHandleChange(e)} />
                    <div style={{
                        marginTop: 15,
                        marginBottom: 15,
                        color: '#174A84',
                        font: 'Bold 16px Lato',
                        letterSpacing: '1.8px'
                    }}>
                    </div>
                   {this.state.attendanceData.length>0? 
                   
                    <div style={{display:"flex", float:"right",marginRight: 50,}}>
                        <div>
                             <Button
                                variant="contained"
                                //color="success"
                                style={this.state.statusId!=1?{background:'green',color:'white'}:{background:'#598359',color:'white'}}
                           
                                // className={classes.button}
                                
                                disabled={this.state.isLoading || (this.state.statusId==1)}
                                onClick={() => this.onUpdateStatus(1)}
                            >
                                {""}
                                {this.state.isLoading ? (
                                <CircularProgress style={{ color: "white" }} size={24} />
                                ) : (
                                "Approve"
                                )}
                            </Button>
                        </div>
                        <div style={{marginLeft:10}}>
                            <Button
                                variant="contained"
                                style={this.state.statusId!=1?{background:'red',color:'white'}:{background:'#ff00006b',color:'white'}}
                                // className={classes.button}
                                disabled={this.state.isLoading || (this.state.statusId==1)}
                                onClick={() => this.openDailog()}
                            >
                                {""}
                                {this.state.isLoading ? (
                                <CircularProgress style={{ color: "white" }} size={24} />
                                ) : (
                                "Reject"
                                )}
                             </Button>
                        </div>
                    </div>
                    :""
                    }

                    <form id="myForm" onSubmit={this.isFormValid}>
                    {this.state.statusId!=0?
                            <Typography style={{ color: '#1d5f98',fontSize:16 , fontWeight: 300, textTransform: 'capitalize' }} variant="h6">
                            Status : {this.state.status}
                            </Typography>:""
                        }               
                         {this.state.status=="Rejected" ? <Typography style={{ color: '#1d5f98',fontSize:14 , fontWeight: 100, textTransform: 'capitalize' }} variant="h6">
                            
                           
                           Reason : {this.state.reason}
                         </Typography>:""}
                        <input name="monthYearDate" type="hidden" value={ format(this.state.fromDate, "dd-MM-yyyy")}/>
                        <TablePanel isShowIndexColumn data={this.state.attendanceData} isLoading={this.state.isLoading} sortingEnabled columns={columns} />

                    </form>
                </div>
                <div>
                  <form id="myFormUpdate" >
                     {/* <input name="recordId" type="hidden" value={this.state.recordId }/> */}
                    <Dialog  backdropClick disableEscapeKeyDown  fullWidth={false}
                        maxWidth={'sm'} open={this.state.isOpenActionMenu}   aria-labelledby="form-dialog-title">
                        <DialogTitle id="simple-dialog-title">
                            <span style={{
                                fontSize: 16,
                                color: '#1558a2',
                                fontWeight: 700
                            }}>Please Add Reason of Rejection</span>
                            <Divider />
                        </DialogTitle>
                        <DialogContent style={{
                            width: 500,
                            marginBottom: 10
                        }}>
                            <Grid
                                container
                                direction="row"
                                alignItems="center"
                                spacing={2}
                            >
                                
                                <Grid item xs={12} >
                                    <TextField
                                        id="reasonOfRejection"
                                        name="reason"
                                        variant="outlined"
                                        fullWidth
                                        label="Reason"
                                        value={this.state.reason}
                                        onChange={this.onHandleChange}
                                       // value={isEmpty(values.scheduleRoomObject) ? "" : values.scheduleRoomObject.studentCapacity}
                                        readOnly
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <Divider />
                        <DialogActions style={{ justifyContent: 'center', padding: 20 }}>
                            <Button disabled={this.state.isLoading} variant="contained"
                                onClick={() => this.onUpdateStatus(2)}
                                style={{
                                    width: 90
                                }} color="primary">
                                {this.state.isLoading ? <CircularProgress style={{ color: 'white' }} size={24} /> : "Save"}
                            </Button>
                            <Button  
                                 
                                disabled={this.state.isLoading} style={{
                                    width: 90
                                }} variant="outlined" onClick={this.onHandleClose}
                             color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                    </form>
                </div>
                <CustomizedSnackbar
                    isOpen={this.state.isOpenSnackbar}
                    message={this.state.snackbarMessage}
                    severity={this.state.snackbarSeverity}
                    handleCloseSnackbar={() => this.handleCloseSnackbar()}
                />
            </Fragment>
        );
    }
}
export default MonthWiseTeachersTimeSheetCoordinatorReport;