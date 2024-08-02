import React, { Component, Fragment } from 'react';
import { useHistory } from 'react-dom';
import { withStyles, ThemeProvider } from '@material-ui/styles';
import LoginMenu from '../../../../components/LoginMenu/LoginMenu';
import { numberFreeExp } from '../../../../utils/regularExpression';
import { TextField, Grid, Button, CircularProgress, Snackbar, Divider, Typography  } from '@material-ui/core';
import BottomBar from "../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Time } from 'highcharts';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { red } from '@material-ui/core/colors';

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
      border: '1px solid rgb(29, 95, 152)'
      
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

class R217FeedbackReports extends Component {

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
            categoryLabelOne: "",
            detail: [],
            detailId: "",
            detailError: "",
            dataTable: [],
            dataQuestionLabel: [],
            dataTotal: [],
            categoryLabel: "",
            academicSessionId: "",
            programmeGroupId: "",
            termId: "",
            academicSessionLabel: "",
            programmeGroupLabel: "",
            termLabel: "",
            teacherLabel: "",
            Data: [],
            dataSumTable: []
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

    // loadDataTable = async(sessionId = 0, programmeGroupId = 0, termId = 0, teacherId = 0) => {
    //     const data = new FormData();
    //     data.append("academicSessionId", sessionId);
    //     data.append("programmeGroupId", programmeGroupId);
    //     data.append("termId", termId);
    //     data.append("teacherId", teacherId);
    //     this.setState({isLoading: true});
    //     const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C115CommonStudentsFeedbackTeacherView2`;
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
    //                     let dataTable = json.DATA || [];
    //                     this.setState({dataTable:dataTable});
    //                     let categoryLabel = json.DATA[0].categoryLabel || "";
    //                     this.setState({categoryLabel:categoryLabel});
    //                     console.log(dataTable);
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
    loadQuestionLabel = async(index) => {
        const data = new FormData();
        data.append("id",index);
        this.setState({isLoading: true});
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C217CommonStudentsFeedbackQuestionsView`;
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
                        let dataQuestionLabel = json.DATA|| "";
                        this.setState({dataQuestionLabel:dataQuestionLabel});
                        console.log(dataQuestionLabel);
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
                        this.handleOpenSnackbar("Failed to Save! Please Fill All The Answers.","error");
                    }
                });
        this.setState({isLoading: false})
    }

    islabelValid = () => {
        let isValid = true;
        if (!this.state.label) {
            this.setState({labelError:"Please enter School Name."});
            document.getElementById("label").focus();
            isValid = false;
        } else {
            this.setState({labelError:""});
        }
        return isValid;
    }

    isshortLabelValid = () => {
        let isValid = true;        
        if (!this.state.shortLabel) {
            this.setState({shortLabelError:"Please enter Short Name."});
            document.getElementById("shortLabel").focus();
            isValid = false;
        } else {
            this.setState({shortLabelError:""});
        }
        return isValid;
    }

    onHandleChange = e => {
        
        const { name, value } = e.target;
        const errName = `${name}Error`;
        
        let regex = "";
        switch (name) {
            case "label":
            case "shortLabel":
                regex = new RegExp(numberFreeExp);
                if (value && !regex.test(value)) {
                    return;
                }
                break;
        default:
            break;
        }

        this.setState({
            [name]: value,
            [errName]: ""
        })
    }

    clickOnFormSubmit=()=>{
        this.onFormSubmit();
    }
    

     onFormSubmit = async(e) => {
        //e.preventDefault();
        if(
            !this.islabelValid() || 
            !this.isshortLabelValid()
        ){ return; }
        let myForm = document.getElementById('myForm');
        const data = new FormData(myForm);
        this.setState({isLoading: true});
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C06CommonSchoolsSave`;
        await fetch(url, {
            method: "POST", 
            body: data, 
            headers: new Headers({
                Authorization: "Bearer "+localStorage.getItem("uclAdminToken")
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
                        //alert(json.USER_MESSAGE);
                        this.handleOpenSnackbar(json.USER_MESSAGE,"success");
                        setTimeout(()=>{
                            if(this.state.recordId!=0){
                                window.location="#/dashboard/F06Reports";
                            }else{
                                window.location.reload();
                            }
                        }, 2000);
                    } else {
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
                        //alert("Failed to Save ! Please try Again later.");
                        this.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
                    }
                });
        this.setState({isLoading: false})
    }

    
    viewReport = () => {
        window.location = "#/dashboard/R217Reports";
    }
    getSumData = async (sessionId = 0, programmeGroupId = 0, termId = 0, teacherId = 0) => {
        this.setState({ isLoading: true });
        let data = new FormData();
        data.append("academicSessionId", sessionId);
        data.append("programmeGroupId", programmeGroupId);
        data.append("termId", termId);
        // data.append("teacherId", teacherId);
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C217CommonStudentsFeedbackTeacherQuestionsSumView`;
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
                let dataSumTable = json.DATA || [];
                this.setState({dataSumTable:dataSumTable});
                let categoryLabel = json.DATA[0].categoryLabel || "";
                this.setState({categoryLabel:categoryLabel});
                console.log("Sum Data."+dataSumTable);
              } else {
                //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
                this.handleOpenSnackbar(
                  <span>
                    {json.SYSTEM_MESSAGE}
                    <br />
                    {json.USER_MESSAGE}
                  </span>,
                  "error"
                );
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
                this.handleOpenSnackbar(
                  "Failed to fetch, Please try again later.",
                  "error"
                );
                console.log(error);
              }
            }
          );
        this.setState({ isLoading: false });
      };

    getData = async (sessionId = 0, programmeGroupId = 0, termId = 0, teacherId = 0) => {
        this.setState({ isLoading: true });
        let data = new FormData();
        data.append("academicSessionId", sessionId);
        data.append("programmeGroupId", programmeGroupId);
        data.append("termId", termId);
        // data.append("teacherId", teacherId);
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C217CommonStudentsFeedbackTeacherView`;
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
                let dataTable = json.DATA || [];
                this.setState({dataTable:dataTable});
                let categoryLabel = json.DATA[0]?.categoryLabel || "";
                this.setState({categoryLabel:categoryLabel});
                console.log(dataTable);
              } else {
                //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
                this.handleOpenSnackbar(
                  <span>
                    {json.SYSTEM_MESSAGE}
                    <br />
                    {json.USER_MESSAGE}
                  </span>,
                  "error"
                );
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
                this.handleOpenSnackbar(
                  "Failed to fetch, Please try again later.",
                  "error"
                );
                console.log(error);
              }
            }
          );
        this.setState({ isLoading: false });
      };
      handleGenerate = (data) => {
        // console.log(data);
        window.open(
          `#/R216Reports/${
            data.teacherId +
            "&" +
            data.teacherLabel +
            "&" +
            data.courseId +
            "&" +
            data.courseLabel +
            "&" +
            this.state.termids +
            "&" +
            this.state.termlabel +
            "&" +
            this.state.academicSessionids +
            "&" +
            this.state.academicSessionlabel
          }`,
          "_blank"
        );
        
      };


    componentDidMount() {
        // this.props.setDrawerOpen(false);
        // this.loadDataTable();
        // this.getSumData(ids[0], ids[2], ids[4], ids[6]);
        this.loadQuestionLabel();
        // this.loadTotal();
        const { id = "0&0&0&0" } = this.props.match.params;
        let ids = id.split("&");
        console.log(ids[0] + " - " + ids[2] + " - " + ids[4] + " - " + ids[6]);
        this.getData(ids[0], ids[2], ids[4], ids[6]);
        this.getSumData(ids[0], ids[2], ids[4], ids[6]);
        this.setState({
            programmeGroupids: ids[2],
            academicSessionids: ids[0],
            // teacherids: ids[6],
            termids: ids[4],
            programmeGrouplabel: ids[3],
            academicSessionlabel: ids[1],
            // teacherlabel: ids[7],
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
                                fontSize: 22,
                                textAlign: "center",
                                marginBottom: 25
                            }} 
                            variant="h5"
                        >
                            Teacher Feedback In Comparison To Programme Average
                        </Typography>
                        <Grid 
                            container
                        >
                            <Grid xs={6}
                                >
                                    
                                    <Typography style={{ marginTop: 30}}>
                                    <h4 
                                     style={{
                                        display: "inline",
                                        color: '#1d5f98',

                                     }}
                                     >Programme Group: </h4>
                                     <p style={{marginLeft: 5, display: "inline", color: '#1d5f98'}}>
                                         {this.state.programmeGrouplabel}
                                    </p>
                                     </Typography>
                                
                                </Grid>
                                <Grid xs={3}
                                >
                                    <Typography align="center" style={{ marginTop: 30}}>
                                         <h4 
                                     style={{
                                        display: "inline",
                                        color: '#1d5f98',

                                     }}
                                     >Term: </h4>
                                     <p style={{marginLeft: 5, display: "inline", color: '#1d5f98'}}>{this.state.termlabel}</p>
                                    
                                     </Typography>

                                </Grid>
                                <Grid xs={3}
                                >
                                    <Typography align="center" style={{ marginTop: 30}}>
                                         <h4 
                                     style={{
                                        display: "inline",
                                        color: '#1d5f98',

                                     }}
                                     >Session: </h4>
                                     <p style={{marginLeft: 5, display: "inline", color: '#1d5f98'}}>{this.state.academicSessionlabel}</p>
                                     </Typography>

                                </Grid>
                                {/* <Grid xs={5}>
                                    <Grid container>
                                <TableContainer component={Paper} style={{
                                    border: '1px solid rgb(29, 95, 152)',
                                    marginBottom: 10
                                    }} >
                                    <table aria-label="customized table">
                                            
                                                <tr style={{ "display": "block", height: "220px", "overflow-y": "hidden", "padding-left": ""}}>
                                                {this.state.dataQuestionLabel.map((row, index) => (
                                                    <th style={{"maxWidth": "41px", "padding-top": "30px", "padding-left": "9px"}}>
                                                        <div style={{"white-space": "nowrap", transform: "rotate(90deg)", color: 'rgb(29, 95, 152)', position: "-moz-initial"}}>
                                                            {row.label=="Take another course from the same faculty"? (<span>Take another course from<br/>the same faculty.</span>) :row.label}
                                                        </div>
                                                    </th>
                                                ))}
                                                </tr>
                                    </table>
                            </TableContainer>
                            <TableContainer component={Paper} style={{
                                    border: '1px solid rgb(29, 95, 152)',
                                    marginBottom: 10
                                    }} >
                                    <table aria-label="customized table">
                                            
                                                <tr style={{ "display": "block", height: "50px", "overflow-y": "hidden", "padding-left": ""}}>
                                                {this.state.dataQuestionLabel.map((row, index) => (
                                                    <th style={{"maxWidth": "41px", "padding-top": "10px", "padding-left": "9px", width: "260px"}}>
                                                        <div style={{color: 'rgb(29, 95, 152)', position: "-moz-initial"}}>
                                                            10
                                                        </div>
                                                    </th>
                                                ))}
                                                </tr>
                                    </table>
                            </TableContainer>
                            </Grid>
                                </Grid> */}
                            </Grid>
                         <Grid item xs={12}>
                         <TableContainer component={Paper} style={{marginBottom: 30, marginTop: 15}}>
                                    <Table size="small" aria-label="customized table">
                                                <TableHead >  
                                                <TableRow style={{height: "207px"}}>
                                                <StyledTableCell align="center" style={{ "padding-top": "153px"}}>Detailed View</StyledTableCell>
                                                <StyledTableCell align="center" style={{ "padding-top": "153px"}}>Teacher ID</StyledTableCell>
                                                <StyledTableCell align="center" style={{ "padding-top": "153px"}}>Teacher Name</StyledTableCell>
                                                <StyledTableCell align="center" style={{ "padding-top": "153px"}}>Subject</StyledTableCell>
                                                {this.state.dataQuestionLabel.map((row, index) => (
                                                <StyledTableCell align="center" style={{"maxWidth": "30px", "padding-bottom": "115px"}}><div style={{"white-space": "nowrap", transform: "rotate(90deg)" }}>{row.label=="Take another course from the same faculty"? (<span>Take another course from<br/>the same faculty.</span>) :row.label}</div></StyledTableCell>
                                                ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                            {this.state.dataSumTable.map((row, index) => (
                                            <TableRow style={{height: "70px"}}>
                                                    <StyledTableCell align="center" colSpan="4" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)", "font-weight": "bold" }}></StyledTableCell>
                                                    <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)", "font-weight": "bold" }}>{row.Quest1}</StyledTableCell>
                                                    <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)", "font-weight": "bold"}}>{row.Quest2}</StyledTableCell>
                                                    <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)", "font-weight": "bold"}}>{row.Quest3}</StyledTableCell>
                                                    <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)", "font-weight": "bold"}}>{row.Quest4}</StyledTableCell>
                                                    <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)", "font-weight": "bold"}}>{row.Quest5}</StyledTableCell>
                                                    <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)", "font-weight": "bold"}}>{row.Quest6}</StyledTableCell>
                                                    <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)", "font-weight": "bold"}}>{row.Quest7}</StyledTableCell>
                                                    <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)", "font-weight": "bold"}}>{row.Quest8}</StyledTableCell>
                                                    <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)", "font-weight": "bold"}}>{row.Quest9}</StyledTableCell>
                                                    <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)", "font-weight": "bold"}}>{row.Quest10}</StyledTableCell>
                                                    <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)", "font-weight": "bold"}}>{row.OverAllAverage}</StyledTableCell>
                                                    <StyledTableCell align="center" style={{backgroundColor:"lightgray", color:"rgb(29, 95, 152)", "font-weight": "bold"}}></StyledTableCell>
                                            </TableRow>
                                            ))}
                                                {this.state.dataTable.map((row, index) => (
                                                <StyledTableRow key={row.QuestionLabel1}>
                                                <StyledTableCell>
                                                    <Button 
                                                    startIcon={<VisibilityIcon />}
                                                    color="primary"
                                                    size="small"
                                                    onClick={()=>this.handleGenerate(row)}
                                                    fullWidth
                                                    ></Button></StyledTableCell>
                                                <StyledTableCell align="center">{row.teacherId=="NaN"     ? "0" : row.teacherId}</StyledTableCell>
                                                <StyledTableCell align="center" >{row.teacherLabel=="NaN" ? "0" : row.teacherLabel}</StyledTableCell>
                                                <StyledTableCell align="center" >{row.courseLabel=="NaN"  ? "0" : row.courseLabel}</StyledTableCell>
                                                <StyledTableCell align="center" style={{width: "20px"}}>{row.avgScore1=="NaN"    ? "0" : row.avgScore1}</StyledTableCell>
                                                <StyledTableCell align="center" style={{width: "14px"}}>{row.avgScore2=="NaN"    ? "0" : row.avgScore2}</StyledTableCell>
                                                <StyledTableCell align="center" style={{width: "13px"}}>{row.avgScore3=="NaN"    ? "0" : row.avgScore3}</StyledTableCell>
                                                <StyledTableCell align="center" >{row.avgScore4=="NaN"    ? "0" : row.avgScore4}</StyledTableCell>
                                                <StyledTableCell align="center" style={{width: "13px"}}>{row.avgScore5=="NaN"    ? "0" : row.avgScore5}</StyledTableCell> 
                                                <StyledTableCell align="center" style={{width: "11px"}}>{row.avgScore6=="NaN"    ? "0" : row.avgScore6}</StyledTableCell> 
                                                <StyledTableCell align="center" style={{width: "19px"}}>{row.avgScore7=="NaN"    ? "0" : row.avgScore7}</StyledTableCell> 
                                                {/* <StyledTableCell align="center" style={{width: "8px"}}>{row.avgScore8=="NaN"    ? "0" : row.avgScore8}</StyledTableCell>  */}
                                                <StyledTableCell align="center" style={{width: "15px"}}>{row.avgScore9=="NaN"    ? "0" : row.avgScore9}</StyledTableCell>
                                                <StyledTableCell align="center" style={{width: "22px"}}>{row.avgScore10=="NaN"   ? "0" : row.avgScore10}</StyledTableCell>
                                                <StyledTableCell align="center" style={{width: "22px"}}>{row.avgScore13=="NaN"   ? "0" : row.avgScore13}</StyledTableCell>  
                                                <StyledTableCell align="center" style={{width: "22px"}}>{row.avgScore13=="NaN"   ? "0" : row.OverAllAvg}</StyledTableCell>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                                                 <StyledTableCell align="center" style={{width: "22px"}}>{row.avgScore13=="NaN"   ? "0" : row.OverAllResponse}</StyledTableCell>  
                                                </StyledTableRow>
                                                ))}
                                            </TableBody>
                                    </Table> 
                            </TableContainer>
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
export default withStyles(styles)(R217FeedbackReports);