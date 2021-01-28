import React, { Component, Fragment } from 'react';
import { withStyles, ThemeProvider } from '@material-ui/styles';
import LoginMenu from '../../../../components/LoginMenu/LoginMenu';
import { numberFreeExp } from '../../../../utils/regularExpression';
import { TextField, Grid, Button, CircularProgress, Snackbar, Divider, Typography  } from '@material-ui/core';
import BottomBar from "../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import R217FeedbackReports from "./R217FeedbackReports";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Time } from 'highcharts';
import { RowDetailState } from '@devexpress/dx-react-grid';

const styles = () => ({
    root: {
        padding: 20,
    },
    formControl: {
        minWidth: '100%',
    },
    sectionTitle: {
        fontSize: 19,
        color: '#174a84',
    },
    checkboxDividerLabel: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 20,
        fontSize: 16,
        fontWeight: 600
    },
    rootProgress: {
        width: '100%',
        textAlign: 'center',
    },
});
const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: "rgb(29, 95, 152)",
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

const currDate = new Date().toLocaleDateString();
const currTime = new Date().toLocaleTimeString();

class R216Reports extends Component {

    constructor(props) { 
        super(props);
        this.state = {
            recordId: this.props.match.params.recordId,
            isLoading: false,
            isReload: false,
            label:"",
            labelError:"",
            shortLabel:"",
            shortLabelError:"",
            isOpenSnackbar:false,
            snackbarMessage:"",
            snackbarSeverity:"",
            tableTitle: "",
            categoryLabel: "",
            totalScoreLabel: "",
            detail: [],
            detailId: "",
            detailError: "",
            dataTable: [],
            dataComment: [],
            dataTotal: [],
            academicSessionLabel: "",
            programmeGroupLabel: "",
            termLabel: "",
            teacherLabel: ""
            
        }
    }

    handleOpenSnackbar = (msg, severity) => {
        this.setState({
            isOpenSnackbar:true,
            snackbarMessage:msg,
            snackbarSeverity:severity
        });
    };

    handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            isOpenSnackbar:false
        });
    };

    // loadData = async(index) => {
    //     const data = new FormData();
    //     data.append("id",index);
    //     this.setState({isLoading: true});
    //     const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C06CommonSchoolsView`;
    //     await fetch(url, {
    //         method: "POST",
    //         body: data, 
    //         headers: new Headers({
    //             Authorization: "Bearer "+localStorage.getItem("uclAdminToken")
    //         })
    //     })
    //         .then(res => {
    //             if (!res.ok) {
    //                 throw res;
    //             }
    //             return res.json();
    //         })
    //         .then(
    //             json => {
    //                 if (json.CODE === 1) {
    //                     if(json.DATA.length){
    //                         this.setState({
    //                             label:json.DATA[0].label,
    //                             shortLabel:json.DATA[0].shortLabel
    //                         });
    //                     }else{
    //                         window.location = "#/dashboard/F06Form/0";
    //                     }
    //                 } else {
    //                     //alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE);
    //                     this.handleOpenSnackbar(json.SYSTEM_MESSAGE+'\n'+json.USER_MESSAGE,"error");
    //                 }
    //                 console.log(json);
    //             },
    //             error => {
    //                 if (error.status == 401) {
    //                     this.setState({
    //                         isLoginMenu: true,
    //                         isReload: false
    //                     })
    //                 } else {
    //                     console.log(error);
    //                    // alert("Failed to Save ! Please try Again later.");
    //                     this.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
    //                 }
    //             });
    //     this.setState({isLoading: false})
    // }
    loadReport = async(teacherId=0, teacherLabel=0, courseId=0, courseLabel=0, termId=0, termLabel=0, academicSessionId=0, academicSessionLabel=0) => {
        const data = new FormData();
        data.append("teacherId",teacherId);
        data.append("teacherLabel",teacherLabel);
        data.append("courseId",courseId);
        data.append("courseLabel",courseLabel);
        data.append("termId",termId);
        data.append("termLabel",termLabel);
        data.append("academicSessionId",academicSessionId);
        data.append("academicSessionLabel",academicSessionLabel);


        this.setState({isLoading: true});
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C216CommonStudentsFeedbackTeacherView`;
        await fetch(url, {
            method: "POST",
            body: data,
            headers: new Headers({
                Authorization: "Bearer "+ localStorage.getItem("uclAdminToken")
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
                        let dataTable = json.DATA || [];
                        this.setState({dataTable:dataTable});
                        console.log(dataTable);
                    } else {
                        //alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE);
                        this.handleOpenSnackbar(json.SYSTEM_MESSAGE+'\n'+json.USER_MESSAGE,"error");
                    }
                    console.log(json);
                },
                error => {
                    if (error.status == 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: false
                        })
                    } else {
                        console.log(error);
                       // alert("Failed to Save ! Please try Again later.");
                        this.handleOpenSnackbar("Failed to Save! Please Fill All The Answers.","error");
                    }
                });
        this.setState({isLoading: false})
    }

    loadComment = async(teacherId=0, courseId=0, termId=0) => {
        const data = new FormData();
        data.append("teacherId",teacherId);
        data.append("courseId",courseId);
        data.append("termId",termId);
        this.setState({isLoading: true});
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C216CommonStudentsFeedbackCommentsTeacherView`;
        await fetch(url, {
            method: "POST",
            body: data,
            headers: new Headers({
                Authorization: "Bearer "+ localStorage.getItem("uclAdminToken")
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
                        let dataComment = json.DATA|| "";
                        this.setState({dataComment:dataComment});
                        console.log(dataComment);
                        // console.log(Detail);
                    } else {
                        //alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE);
                        this.handleOpenSnackbar(json.SYSTEM_MESSAGE+'\n'+json.USER_MESSAGE,"error");
                    }
                    console.log(json);
                },
                error => {
                    if (error.status == 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: false
                        })
                    } else {
                        console.log(error);
                       // alert("Failed to Save ! Please try Again later.");
                        this.handleOpenSnackbar("Failed to fetch data.","error");
                    }
                });
        this.setState({isLoading: false})
    }

    // loadTotal = async(index) => {
    //     const data = new FormData();
    //     data.append("id",index);
    //     this.setState({isLoading: true});
    //     const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C216CommonStudentsFeedbackTeacherView`;
    //     await fetch(url, {
    //         method: "POST",
    //         body: data,
    //         headers: new Headers({
    //             Authorization: "Bearer "+ localStorage.getItem("uclAdminToken")
    //         })
    //     })
    //         .then(res => {
    //             if (!res.ok) {
    //                 throw res;
    //             }
    //             return res.json();
    //         })
    //         .then(
    //             json => {
    //                 if (json.CODE === 1) {
    //                     let dataTotal = json.DATA|| "";
    //                     this.setState({dataTotal:dataTotal});
    //                     console.log(dataTotal);
    //                 } else {
    //                     //alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE);
    //                     this.handleOpenSnackbar(json.SYSTEM_MESSAGE+'\n'+json.USER_MESSAGE,"error");
    //                 }
    //                 console.log(json);
    //             },
    //             error => {
    //                 if (error.status == 401) {
    //                     this.setState({
    //                         isLoginMenu: true,
    //                         isReload: false
    //                     })
    //                 } else {
    //                     console.log(error);
    //                    // alert("Failed to Save ! Please try Again later.");
    //                     this.handleOpenSnackbar("Failed to Save! Please Fill All The Answers.","error");
    //                 }
    //             });
    //     this.setState({isLoading: false})
    // }

    // islabelValid = () => {
    //     let isValid = true;
    //     if (!this.state.label) {
    //         this.setState({labelError:"Please enter School Name."});
    //         document.getElementById("label").focus();
    //         isValid = false;
    //     } else {
    //         this.setState({labelError:""});
    //     }
    //     return isValid;
    // }

    // isshortLabelValid = () => {
    //     let isValid = true;        
    //     if (!this.state.shortLabel) {
    //         this.setState({shortLabelError:"Please enter Short Name."});
    //         document.getElementById("shortLabel").focus();
    //         isValid = false;
    //     } else {
    //         this.setState({shortLabelError:""});
    //     }
    //     return isValid;
    // }

    // onHandleChange = e => {
        
    //     const { name, value } = e.target;
    //     const errName = `${name}Error`;
        
    //     let regex = "";
    //     switch (name) {
    //         case "label":
    //         case "shortLabel":
    //             regex = new RegExp(numberFreeExp);
    //             if (value && !regex.test(value)) {
    //                 return;
    //             }
    //             break;
    //     default:
    //         break;
    //     }

    //     this.setState({
    //         [name]: value,
    //         [errName]: ""
    //     })
    // }

    // clickOnFormSubmit=()=>{
    //     this.onFormSubmit();
    // }

    //  onFormSubmit = async(e) => {
    //     //e.preventDefault();
    //     if(
    //         !this.islabelValid() || 
    //         !this.isshortLabelValid()
    //     ){ return; }
    //     let myForm = document.getElementById('myForm');
    //     const data = new FormData(myForm);
    //     this.setState({isLoading: true});
    //     const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C06CommonSchoolsSave`;
    //     await fetch(url, {
    //         method: "POST", 
    //         body: data, 
    //         headers: new Headers({
    //             Authorization: "Bearer "+localStorage.getItem("uclAdminToken")
    //         })
    //     })
    //         .then(res => {
    //             if (!res.ok) {
    //                 throw res;
    //             }
    //             return res.json();
    //         })
    //         .then(
    //             json => {
    //                 if (json.CODE === 1) {
    //                     //alert(json.USER_MESSAGE);
    //                     this.handleOpenSnackbar(json.USER_MESSAGE,"success");
    //                     setTimeout(()=>{
    //                         if(this.state.recordId!=0){
    //                             window.location="#/dashboard/F06Reports";
    //                         }else{
    //                             window.location.reload();
    //                         }
    //                     }, 2000);
    //                 } else {
    //                     //alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE)
    //                     this.handleOpenSnackbar(json.SYSTEM_MESSAGE+'\n'+json.USER_MESSAGE,"error");
    //                 }
    //                 console.log(json);
    //             },
    //             error => {
    //                 if (error.status == 401) {
    //                     this.setState({
    //                         isLoginMenu: true,
    //                         isReload: false
    //                     })
    //                 } else {
    //                     console.log(error);
    //                     //alert("Failed to Save ! Please try Again later.");
    //                     this.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
    //                 }
    //             });
    //     this.setState({isLoading: false})
    // }

    
    // viewReport = () => {
    //     window.location = "#/dashboard/R216Reports";
    // }
    // getData = async (sessionId = 0, programmeGroupId = 0, termId = 0, teacherId = 0) => {
    //     this.setState({ isLoading: true });
    //     let data = new FormData();
    //     data.append("academicSessionId", sessionId);
    //     data.append("programmeGroupId", programmeGroupId);
    //     data.append("termId", termId);
    //     data.append("teacherId", teacherId);
    //     const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C217CommonStudentsFeedbackTeacherView`;
    //     await fetch(url, {
    //       method: "POST",
    //       body: data,
    //       headers: new Headers({
    //         Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
    //       }),
    //     })
    //       .then((res) => {
    //         if (!res.ok) {
    //           throw res;
    //         }
    //         return res.json();
    //       })
    //       .then(
    //         (json) => {
    //           if (json.CODE === 1) {
    //             let dataTable = json.DATA || [];
    //             this.setState({dataTable:dataTable});
    //             let categoryLabel = json.DATA[0].categoryLabel || "";
    //             this.setState({categoryLabel:categoryLabel});
    //             console.log(dataTable);
    //           } else {
    //             //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
    //             this.handleOpenSnackbar(
    //               <span>
    //                 {json.SYSTEM_MESSAGE}
    //                 <br />
    //                 {json.USER_MESSAGE}
    //               </span>,
    //               "error"
    //             );
    //           }
    //           console.log("getData", json);
    //         },
    //         (error) => {
    //           if (error.status === 401) {
    //             this.setState({
    //               isLoginMenu: true,
    //               isReload: true,
    //             });
    //           } else {
    //             //alert('Failed to fetch, Please try again later.');
    //             this.handleOpenSnackbar(
    //               "Failed to fetch, Please try again later.",
    //               "error"
    //             );
    //             console.log(error);
    //           }
    //         }
    //       );
    //     this.setState({ isLoading: false });
    //   };
    

    componentDidMount() {
        // this.props.setDrawerOpen(false);
        this.loadReport();
        this.loadComment();
        // this.loadTotal();

        const { id = "0&0&0&0" } = this.props.match.params;
        let ids = id.split("&");
        // console.log(ids[0] + " - " + ids[2] + " - " + ids[4] + " - " + ids[6]);
        this.loadReport(ids[0], ids[1], ids[2], ids[3], ids[4], ids[5], ids[6], ids[7]);
        this.loadComment(ids[0], ids[2], ids[4]);
        this.setState({
            courseId: ids[2],
            teacherId: ids[0],
            academicSessionids: ids[6],
            termids: ids[4],
            courseLabel: ids[3],
            teacherLabel: ids[1],
            academicSessionlabel: ids[7],
            termlabel: ids[5]

          });
        
        
    }

    componentWillReceiveProps(nextProps){
        if(this.props.match.params.recordId!=nextProps.match.params.recordId){
            if(nextProps.match.params.recordId!=0){
                this.props.setDrawerOpen(false);
                this.loadData(nextProps.match.params.recordId);
            }else{
                window.location.reload();
            }
        }
    }

    render() {

        const { classes } = this.props;

        return (
            <Fragment>
                <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })} />
                <form id="myForm" onSubmit={this.isFormValid}>
                    <TextField type="hidden" name="recordId" value={this.state.recordId}/>
                    <Grid container component="main" className={classes.root}>
                        <Typography 
                            style={{
                                color: '#1d5f98', 
                                fontWeight: 600,
                                width: '98%', 
                                marginBottom: 25, 
                                fontSize: 22,
                                textAlign: "center"
                            }} 
                            variant="h5"
                        >
                            Student Feedback Summary  ({this.state.academicSessionlabel})
                        </Typography>
                        <Typography 
                            style={{
                                color: '#1d5f98', 
                                fontWeight: 600,
                                width: '98%', 
                                marginBottom: 25, 
                                fontSize: 20
                            }} 
                            variant="h5"
                        >
                            <h5 style={{display: "inline", fontSize: 18}}>Course Name:</h5> 
                            <p style={{display: "inline", fontSize: 15, marginLeft: 5}}>{this.state.courseLabel}</p>
                            <Typography 
                            
                            style={{
                                color: '#1d5f98', 
                                fontWeight: 600,
                                width: '98%', 
                                marginBottom: 25, 
                                fontSize: 20,
                                borderBottom: '1px solid #d2d2d2'
                            }}
                            
                        >
                           <h5 style={{display: "inline", fontSize: 18}}>Teacher Name:</h5>
                           <p style={{display: "inline", fontSize: 15, marginLeft: 5}}>{this.state.teacherLabel}
                           <span style={{float: "right"}}>{currTime+" "+currDate}</span>
                           </p>
                           
                        </Typography>
                        </Typography>
                        
                        <Grid 
                            container 
                            spacing={2} 
                            style={{ 
                                marginLeft: 5, 
                                marginRight: 10 
                            }}
                        >
                               {!this.state.isLoading ? <Grid item xs={12}>
                           
                       
                           <TableContainer component={Paper}>
         <Table size="small" aria-label="customized table">
           <TableHead>
             <TableRow >
               <StyledTableCell>&nbsp;</StyledTableCell>    
               <StyledTableCell align="center">(5)</StyledTableCell>
               <StyledTableCell align="center">(4)</StyledTableCell>
               <StyledTableCell align="center">(3)</StyledTableCell>
               <StyledTableCell align="center">(2)</StyledTableCell>
               <StyledTableCell align="center">(1)</StyledTableCell>
               <StyledTableCell align="center">Total</StyledTableCell>
               <StyledTableCell align="center">Avg. Score</StyledTableCell>
             </TableRow>
           </TableHead>
           <TableBody>
           {this.state.dataTable.map((row, index) => (
                <Fragment>
                <StyledTableRow key={row.categoryLabel}>
                    {row.categoryLabel=="STUDENT'S CONTRIBUTION" ? 
                    <Fragment>
                    <StyledTableCell style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)"}}>{row.categoryLabel}</StyledTableCell>
                    <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)"}}>100%</StyledTableCell>
                    <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)"}}>80%</StyledTableCell>
                    <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)"}}>60%</StyledTableCell>
                    <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)"}}>40%</StyledTableCell>
                    <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)"}}>20%</StyledTableCell>
                    <StyledTableCell align="center" colSpan="2" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)"}}>Total Students</StyledTableCell>
                    </Fragment>
                    :row.categoryLabel=="TOTAL SCORE" ? 
                    <input type="hidden"></input>
                    :row.categoryLabel=="PERCENTAGE (%)" ? 
                    <input type="hidden"></input>
                    :<StyledTableCell colSpan="8" component="th" scope="row" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)"}}> {row.categoryLabel}</StyledTableCell>
                }
                </StyledTableRow>
                {row.Detail.map( (row2, index2) =>
                    <StyledTableRow key={"Sub"+row2.questionLabel+index2}>
                        {

                            row2.questionLabel=="def" && row.categoryLabel=="PERCENTAGE (%)"?
                            <Fragment>
                            <StyledTableCell style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)"}}><b>{row.categoryLabel}</b></StyledTableCell>
                            <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)"}}>{row2.percentage_4=="NaN"?"0":row2.percentage_4}</StyledTableCell>
                            <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)"}}>{row2.percentage_3=="NaN"?"0":row2.percentage_3}</StyledTableCell>
                            <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)"}}>{row2.percentage_2=="NaN"?"0":row2.percentage_2}</StyledTableCell>
                            <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)"}}>{row2.percentage_1=="NaN"?"0":row2.percentage_1}</StyledTableCell>
                            <StyledTableCell align="center"  style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)"}}>{row2.percentage_0=="NaN"?"0":row2.percentage_0}</StyledTableCell>
                            <StyledTableCell align="center"  style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)"}}>{row2.percentage_5=="NaN"?"0":row2.percentage_5}</StyledTableCell>
                            <StyledTableCell align="center"  style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)"}}>{row2.overAllAvg=="NaN"?"0":row2.overAllAvg}</StyledTableCell>
                            </Fragment>
                        :
                            row2.questionLabel=="abc" && row.categoryLabel=="TOTAL SCORE"?
                            <Fragment>
                            <StyledTableCell style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)"}}><b>{row.categoryLabel=="NaN"?"0":row.categoryLabel}</b></StyledTableCell>
                            <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)"}}>{row2.totalScore_4=="NaN"?"0":row2.totalScore_4}</StyledTableCell>
                            <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)"}}>{row2.totalScore_3=="NaN"?"0":row2.totalScore_3}</StyledTableCell>
                            <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)"}}>{row2.totalScore_2=="NaN"?"0":row2.totalScore_2}</StyledTableCell>
                            <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)"}}>{row2.totalScore_1=="NaN"?"0":row2.totalScore_1}</StyledTableCell>
                            <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)"}}>{row2.totalScore_0=="NaN"?"0":row2.totalScore_0}</StyledTableCell>
                            <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)"}}>{row2.totalScore_5=="NaN"?"0":row2.totalScore_5}</StyledTableCell>
                            <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)"}}>Overall Avg</StyledTableCell>
                            </Fragment>
                            
                        :
                            row2.questionLabel!="Student's attendance in the course" && row2.questionLabel!="Take another course from the same faculty"?
                            <Fragment>
                            <StyledTableCell>{row2.questionLabel}</StyledTableCell>
                            <StyledTableCell align="center">{row2.answer_5=="NaN"?"0":row2.answer_5}</StyledTableCell>
                            <StyledTableCell align="center">{row2.answer_4=="NaN"?"0":row2.answer_4}</StyledTableCell>
                            <StyledTableCell align="center">{row2.answer_3=="NaN"?"0":row2.answer_3}</StyledTableCell>
                            <StyledTableCell align="center">{row2.answer_2=="NaN"?"0":row2.answer_2}</StyledTableCell>
                            <StyledTableCell align="center">{row2.answer_1=="NaN"?"0":row2.answer_1}</StyledTableCell>
                            <StyledTableCell align="center">{row2.total=="NaN"?"0":row2.total}</StyledTableCell>
                            <StyledTableCell align="center">{row2.avgScore=="NaN"?"0":row2.avgScore}</StyledTableCell>
                            </Fragment>
                        :
                            row2.questionLabel=="Take another course from the same faculty" ?
                            <Fragment>
                            <StyledTableCell>{row2.questionLabel}</StyledTableCell>
                            <StyledTableCell align="center">{row2.sumTotalYesAnwers=="NaN"?"0":row2.sumTotalYesAnwers}</StyledTableCell>
                            <StyledTableCell align="center" >{row2.sumTotalNoAnwers=="NaN"?"0":row2.sumTotalNoAnwers}</StyledTableCell>
                            <StyledTableCell align="center" colSpan="5" ></StyledTableCell>
                            </Fragment>
                        : 
                            <Fragment>
                            <StyledTableCell>{row2.questionLabel}</StyledTableCell>
                            <StyledTableCell align="center">{row2.hundredPercent=="NaN"?"0":row2.hundredPercent}</StyledTableCell>
                            <StyledTableCell align="center">{row2.eightyPercent=="NaN"?"0":row2.eightyPercent}</StyledTableCell>
                            <StyledTableCell align="center">{row2.sixtyPercent=="NaN"?"0":row2.sixtyPercent}</StyledTableCell>
                            <StyledTableCell align="center">{row2.fortyPercent=="NaN"?"0":row2.fortyPercent}</StyledTableCell>
                            <StyledTableCell align="center">{row2.tweentyPercent=="NaN"?"0":row2.tweentyPercent}</StyledTableCell>
                            <StyledTableCell align="center" colSpan="2">{row2.totalStudents=="NaN"?"0":row2.totalStudents}</StyledTableCell>
                            </Fragment>
                        }
                </StyledTableRow>

                )}
                
                </Fragment>
                
                
          ))}
           </TableBody>
         </Table>
       </TableContainer>
       </Grid>
       :
                            <Grid 
                            container 
                            justify="center">
                            <CircularProgress />
                            </Grid>
                            }
                           <Grid item xs={12}>
                           <TableContainer component={Paper} style={{marginBottom: 30}}>
                           <Table size="small" aria-label="customized table">
                           <TableHead>
                           <TableRow >
                           <StyledTableCell style={{width: 1}}>SR No.</StyledTableCell>
                           <StyledTableCell>Student Comments</StyledTableCell>
                           </TableRow>
                           </TableHead>
                           <TableBody>
                               {this.state.dataComment.map( (row, index) =>
                                   <TableRow >
                                   <StyledTableCell>{index+1}</StyledTableCell>
                                   <StyledTableCell>{row.comment}</StyledTableCell>
                                   </TableRow>
                                  
                               )}
                               </TableBody> 
                           
                           </Table>
                           </TableContainer>
                           
                           </Grid>
                        </Grid>
                    </Grid>
                </form>
                {/* <BottomBar
                    left_button_text="View"
                    left_button_hide={true}
                    bottomLeftButtonAction={this.viewReport}
                    right_button_text="Save"
                    hideRightButton={true}
                    bottomRightButtonAction={this.clickOnFormSubmit}
                    loading={this.state.isLoading}
                    isDrawerOpen={ this.props.isDrawerOpen}
                /> */}
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
export default withStyles(styles)(R216Reports);