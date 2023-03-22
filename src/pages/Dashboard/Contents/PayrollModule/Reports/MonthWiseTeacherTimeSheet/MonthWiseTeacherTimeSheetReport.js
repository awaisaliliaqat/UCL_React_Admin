import React, { Component, Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import { withStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import MonthWiseTeacherTimeSheetReportFilter from './Chunks/MonthWiseTeacherTimeSheetReportFilter';
import TablePanel from '../../../../../../components/ControlledTable/RerenderTable/TablePanel';
import LoginMenu from '../../../../../../components/LoginMenu/LoginMenu';
import CustomizedSnackbar from "../../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { format } from 'date-fns';
import BottomBar from "../../../../../../components/BottomBar/BottomBar";
import { Checkbox } from "@material-ui/core";


class MonthWiseTeacherTimeSheetReport extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,

            attendanceData: [],
            statusId:0,
            status:"",
            reason:"",
            flagId:0,
            selectedData: {},
            lastDateOfMonth : new Date(new Date().getFullYear(),
            new Date().getMonth(), this.daysInMonth(new Date().getMonth()+1,
            new Date().getFullYear())).getDate(),
            fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
            toDate: new Date(),


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

        }
    }

    componentDidMount() {
        this.getData();
        this.getLastDate();
        alert("LAST DATE"+this.state.lastDateOfMonth);
        alert("LAST DATE"+this.state.fromDate);
    }

    daysInMonth (month, year) {
        return new Date(year, month, 0).getDate();
    }

    getLastDate =() => {
        var date = new Date();
        
                          
        var lastDay = new Date(date.getFullYear(),
                date.getMonth(), this.daysInMonth(date.getMonth()+1,
                date.getFullYear()));
                console.log("lastDay"+lastDay);
                 this.setState({
                    lastDateOfMonth:lastDay
                 }); 
                 
    }

    onHandleChange = e => {
        const { name, value } = e.target;
        switch (name) {
            case "sectionTypeId":
                this.setState({
                    sectionId: 0,
                    sectionData: [],
                    attendanceData: []
                })
                this.getSectionData(value);
                break;
            default:
                break;
        }
        this.setState({
            [name]: value
        })
    }


    getData = async () => {
        this.setState({
            isLoading: true,
            attendanceData:[]
        })
      //  const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C35CommonAcademicsAttendanceTeachersLogView?fromDate=${format(this.state.fromDate, "dd-MM-yyyy")}&toDate=${format(this.state.toDate, "dd-MM-yyyy")}`;
      const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C302CommonAcademicsAttendanceTeachersLogView?fromDate=${format(this.state.fromDate, "dd-MM-yyyy")}`;
     
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
                           
                        });
                        if(json.DATA.length>0){
                            this.setState({
                                status:json.DATA[0].status || 0,
                                statusId:json.DATA[0].statusId || 0,
                                reason:json.DATA[0].reason  || "", 
                               
                            });
                          
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


    onClearFilters = () => {

        this.setState({
            fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            toDate: new Date(),
        })
    }

    onHandleChange = e => {
        const { name, value } = e.target;
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

    handleOpenSnackbar = (msg, severity) => {
        this.setState({
            isOpenSnackbar: true,
            snackbarMessage: msg,
            snackbarSeverity: severity
        });
    };
   

    
    clickOnApprove =()=> {

        let IDs = document.getElementsByName("timeTableId");
        let isAllowed=false;
        if(IDs.length>0 ){ 
            for(let i=0;i<IDs.length;i++){
                 if(IDs[i].checked){
                    isAllowed=true;
                    break;
                 };
             }
        }
        if(isAllowed){
            this.setState({
                flagId:1
            });
            this.onFormSubmit();
        }
        
      };

      clickOnSubmitChange =()=>  {
        let IDs = document.getElementsByName("timeTableId");
        let isAllowed=false;
        if(IDs.length>0 ){ 
            for(let i=0;i<IDs.length;i++){
                 if(IDs[i].checked){
                    isAllowed=true;
                    break;
                 };
             }
        }
        if(isAllowed){
            this.setState({
                flagId:2
            });
            this.onFormSubmit();
        }
        

      };
    
      onFormSubmit = async () => {

        console.log(this.state.flagId);
        let myForm = document.getElementById("myForm");
        const data = new FormData(myForm);
        data.append("actionId",this.state.flagId);
        this.setState({ isLoading: true });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C302MonthWiseTeacherTimeSheet`;
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
                  if (this.state.recordId != 0) {
                    window.location.reload();
                  }
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

    
    render() {
        const columns = [
            { name: "Section", dataIndex: "sectionLabel", sortIndex: "sectionLabel", sortable: true, customStyleHeader: { width: '17%' } },
            { name: "Section Type", dataIndex: "sectionTypeLabel", sortIndex: "sectionTypeLabel", sortable: true, customStyleHeader: { width: '17%' } },
            { name: "Course Id", dataIndex: "courseId", sortable: false, customStyleHeader: { width: '12%' } },
            { name: "Course Label", dataIndex: "courseLabel", sortable: false, customStyleHeader: { width: '17%' } },
            { name: "Class Schedule", dataIndex: "startTimestamp", sortIndex: "startTimestampSimple", sortable: true, customStyleHeader: { width: '15%' } },
           
            {
                name: "Status", renderer: rowData => {
                    return (
                        <Fragment>
                            <span style={{
                                fontWeight: 600,
                                color: `${rowData.isPresent === 0 ? '#d26161' : 'rgb(28 126 96)'}`
                            }}> {rowData.isPresent === 0 ? 'Absent' : 'Present'} </span>

                        </Fragment>
                    )
                }, sortIndex: "isPresent", sortable: true, customStyleHeader: { width: '14%' }
            },
            {
                name: "Action", renderer: rowData => {
                    return (
                        <Fragment>
                     
                                <Checkbox
                                    //checked={rowData.marked==1?true:false}
                                   //onChange={(e)=>this.handleCheckBoxChange(e.target)}
                                    value={rowData.id}
                                    defaultChecked={rowData.marked==1?true:false}
                                    id={"checkBox_"+rowData.id}
                                    name={"timeTableId"}
                                    //name={"featureId"}
                                    color="primary"
                                />
                        
                                
                           
                        </Fragment>
                    )
                }, sortIndex: "isPresent", sortable: true, customStyleHeader: { width: '14%' }
            },
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
                            Month Wise Teacher Time Sheet Report
                     </Typography>
                    </div>
                    <Divider style={{
                        backgroundColor: 'rgb(58, 127, 187)',
                        opacity: '0.3',
                    }} />
                    <MonthWiseTeacherTimeSheetReportFilter isLoading={this.state.isLoading} onHandleChange={this.onHandleChange}   handleDateChange={this.handleDateChange} onClearFilters={this.onClearFilters} values={this.state} getDataByStatus={() => this.getData()} onHandleChange={e => this.onHandleChange(e)} />
                    <div style={{
                        marginTop: 15,
                        marginBottom: 15,
                        color: '#174A84',
                        font: 'Bold 16px Lato',
                        letterSpacing: '1.8px'
                    }}>
                    </div>
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
                <BottomBar
                    
                    left_button_text="Add Class"
                    bottomLeftButtonAction={()=>{window.location = "#/dashboard/F229Form/0"}}
                    right_button_text="Send For Approval"
                    bottomRightButtonAction={this.clickOnApprove}
                    disableRightButton={(this.state.fromDate===this.state.lastDateOfMonth) || this.state.statusId!=1 ? false : true }
                    loading={this.state.isLoading}
                    isDrawerOpen={this.props.isDrawerOpen}
                />
               
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
export default MonthWiseTeacherTimeSheetReport;