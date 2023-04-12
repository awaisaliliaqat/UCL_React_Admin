import React, { Component, Fragment, createRef} from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Logo from "../../../../assets/Images/logo.png";
import UniversityLogo from "../../../../assets/Images/logo_ucl_one.png";
import CloseIcon from "@material-ui/icons/Close";
import { IconButton, Typography, CircularProgress, Grid,TextField } from "@material-ui/core";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import BottomBar from "../../../../components/BottomBar/BottomBar";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import { color } from "highcharts";
import { format } from 'date-fns';

import { DatePicker } from "@material-ui/pickers";
import Pdf from "react-to-pdf";
import PDFButton from "./ProgressReportHelperPDF/generatePdf"

const ref = React.createRef();
// const Button = React.forwardRef((props, ref) => {
//   return (
//     <React.Fragment>
//       <Pdf targetRef={ref} filename="code-example.pdf">
//         {({ toPdf }) => <button onClick={toPdf}>Generate Pdf</button>}
//       </Pdf>
//     </React.Fragment>
//   );
// });


export const LandscapeOrientation = () => (
  <style type="text/css">
    {"@media print{@page {size: landscape},@body{-webkit-print-color-adjust: exact}}"}
  </style>
);
const styles = (theme) => ({
  mainDiv: {
    margin: "50px 10px 0px 10px",
    // "@media print": {
    //   minWidth: "7.5in",
    //   maxWidth: "11in",
    // },
  },
  closeButton: {
    top: theme.spacing(1),
    right: theme.spacing(2),
    zIndex: 1,
    border: "1px solid #ff4040",
    borderRadius: 5,
    position: "fixed",
    padding: 3,
    "@media print": {
      display: "none",
    },
  },
  bottomSpace: {
    marginBottom: 40,
    "@media print": {
      display: "none",
    },
  },
  bottomBar: {
    //marginBottom: 40,
    "@media print": {
      visibility: "hidden"
    },
  },
  overlay: {
    display: "flex",
    justifyContent: "start",
    flexDirection: "column",
    alignItems: "center",
    position: "fixed",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: 2,
    marginTop: -10
  },
  overlayContent: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    color: "white",
    fontSize: 48,
    margin: "auto"
  },
  title: {
    fontSize: 36,
    fontWeight: "bolder",
    fontFamily: "sans-serif",
    color: "#2f57a5",
    letterSpacing: 1,
    marginLeft:10
  },
  subTitle: {
    fontSize: 22,
    fontWeight: 600,
    color: "#2f57a5",
  },
  subTitle2: {
    fontSize: 16,
    fontWeight: 600,
    color: "#2f57a5"
  },
  flexColumn: {
    display: "flex",
    flexDirection: "column",
  },
  table: {
    minWidth: 700
  },
  
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "rgb(189 214 228)",//"rgb(47, 87, 165)", //theme.palette.common.black,
    color: theme.palette.common.black,
    fontWeight: 800,
    border: "1px solid rgb(47, 87, 165)",
    fontSize: 13,
    padding: 5
  },
  body: {
    fontSize: 13,
    border: "1px solid rgb(29, 95, 152)",
    padding: "5px 0px"
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);
const pdfRef = createRef(); 
class DisplayAdmissionApplications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documentData: [],
      data: {},
      isLoading: false,
      isLoginMenu: false,
      isReload: false,
      fromDateLabel: "",
      toDateLabel: "",
      tableHeaderData: [],
      tableAssignmentHeaderColumn: "",
      tableSeminarHeaderColumn: "",
      tableSubjectiveHeaderColumn: "",
      tableExamHeaderColumn: "",
      tableBottomFirstColumn: "",
      tableData: [],
      academicSessionLabel: "____-____",
      programmeLabel: "",
      studentLabel: "",
      uptoDate: "__/__/____",
      totalPOS: "_ _",
      totalAchieved: "_ _",
      totalPercentage: "_ _",
      resultClassification: "_ _ _",
      endDate:"",
      studentId: "",
      textAreaValue: "",
      academicSessionId:0,
      programmeId:0,
      sessionTermId:0,
      studentId:0,
      sessionTermLabel:"",
      anouncementDate: new Date(),
      anouncementDateError: "",
      alevelYear:"",
     
     
      
    };
  }

  handleDateChange = (name, date) => {
    const errorName = `${name}Error`;
    this.setState({
      [name]: date,
      [errorName]: ""
    });
  };
  handleChange=(event) => {
    this.setState({ textAreaValue: event.target.value });
  }
  getDateInString = () => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    today = dd + "/" + mm + "/" + yyyy;
    return today;
  };

  handleGenerateAndApprove = (typeId) => {
    let academicSessionId = this.state.academicSessionId;
    let programmeId = this.state.programmeId;
    let sessionTermId = this.state.sessionTermId;
    let studentId = this.state.studentId;
    let comments=this.state.textAreaValue;
    let dateToShow=this.state.anouncementDate;
    if(comments==""){
      this.handleOpenSnackbar(<span>"Please Add Comments."</span>,"error");
      return false;
    }
    if(dateToShow==null && typeId==1){
      this.handleOpenSnackbar(<span>"Please Select Date."</span>,"error");
      return false;
    }
    
    this.approveData(academicSessionId,programmeId,sessionTermId,studentId,comments,dateToShow,typeId);
    
  };

  handleOpenSnackbar = (msg, severity) => {
    this.setState({
      isOpenSnackbar: true,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };

  handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ isOpenSnackbar: false });
  };

  getData = async (sessionId=0, programmeId=0, sessionTermId=0, studentId=0) => {
    this.setState({ isLoading: true ,studentId:studentId});
    let data = new FormData();
    data.append("academicsSessionId", sessionId);
    data.append("programmeId", programmeId);
    data.append("termId", sessionTermId);
    data.append("studentId", studentId);
    //data.append("type", 1);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C210CommonStudentProgressReportView`;
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
            
            let tableHeaderData = [];

            let assignmentGraders = null;
            let seminarGrades= null;
            let subjectiveEvalGradesCol=null;
            let examMarksCol=null;

            let tableData = [];
            let data = json.DATA || [];
            let dataLength = data.length;
            if(dataLength){
              this.setState({
                studentLabel: data[0].studentLabel,
                programmeLabel: data[0].programmeLabel,
                academicSessionLabel: data[0].academicsSessionLabel,
                sessionTermLabel: data[0].sessionTermLabel,
                uptoDate: data[0].uptoDate,
                totalPOS: data[0].totalPOS,
                totalAchieved: data[0].totalAchieved,
                totalPercentage: data[0].totalPercentage,
                resultClassification:  data[0].resultClassification,
                alevelYear:data[0].year,
                textAreaValue:data[0].comments
              });

              /*
              Total Number Of Assignment Header Columns
              */

              let totalAssignmentLength = data[0].totalAssignmentColumns+1 || [];
             
              if(totalAssignmentLength){
                assignmentGraders=[totalAssignmentLength];
                for(let i=0; i<totalAssignmentLength; i++){
                  let columnIndex=i+1;
                  if(columnIndex==totalAssignmentLength){

                    assignmentGraders[i]="Credits";

                  }else{

                    assignmentGraders[i]=columnIndex+"";

                  }
                  
                }

                this.setState({tableAssignmentHeaderColumn: totalAssignmentLength});
               
              }


               /*
              Total Number Of Seminar Header Columns
              */

              let totalSeminarLength = 0;
             if(data[0].totalSeminarColumns>0){
              console.log("HELOOOOO")
                totalSeminarLength=data[0].totalSeminarColumns+1 || [];
                if(totalSeminarLength){
                  seminarGrades=[totalSeminarLength];
                  for(let i=0; i<totalSeminarLength; i++){
                    let columnIndex=i+1;
                    if(columnIndex==totalSeminarLength){

                      seminarGrades[i]="Credits";

                    }else{

                      seminarGrades[i]=columnIndex+"";

                    }
                    
                  }

                  this.setState({tableSeminarHeaderColumn: totalSeminarLength});
                
                }
             }

                /*
              Total Number Of Subjective Header Columns
              */

              let totalSubjectiveLength = data[0].totalSubjectiveColumns+1 || [];
             
              if(totalSubjectiveLength){
                subjectiveEvalGradesCol=[totalSubjectiveLength];
                for(let i=0; i<totalSubjectiveLength; i++){
                  let columnIndex=i+1;
                  if(columnIndex==totalSubjectiveLength){

                    subjectiveEvalGradesCol[i]="Credits";

                  }else{

                    subjectiveEvalGradesCol[i]=columnIndex+"";

                  }
                  
                }

                this.setState({tableSubjectiveHeaderColumn: totalSubjectiveLength});
               
              }

            /*
              Total Number Of Exams Header Columns
              */

              let totalExamsLength = data[0].totalExamColumns+1 || [];
             
              if(totalExamsLength){
                examMarksCol=[totalExamsLength];
                for(let i=0; i<totalExamsLength; i++){
                  let columnIndex=i+1;
                  if(columnIndex==totalExamsLength){

                    examMarksCol[i]="Credits";

                  }else{

                    examMarksCol[i]=columnIndex+"";

                  }
                  
                }

                this.setState({tableExamHeaderColumn: totalExamsLength});
               
              }

              this.setState({tableBottomFirstColumn:(totalSubjectiveLength+totalExamsLength+totalSeminarLength+totalAssignmentLength+9)-4});
              

              let coursesData = data[0].studentCoursesData || [];
              let coursesDataLength = coursesData.length;
              if(coursesDataLength){
                for(let i=0; i<coursesDataLength; i++){
                  let tableDataRow = [];
                  tableDataRow.push(coursesData[i].courseLabel);  // col-1
                  let attendance = coursesData[i].attendance[0];
                  tableDataRow.push(attendance.deliveredLectures);  // col-2
                  tableDataRow.push(attendance.attendenedlectures);  // col-3
                  tableDataRow.push(attendance.attandancePercentage);  // col-4
                  tableDataRow.push(attendance.attandanceCredit);  // col-5
                  let assignment = coursesData[i].assignment;
                  assignment.map((data, index) =>
                    data.grade ? tableDataRow.push(data.grade) : tableDataRow.push(data.credit) // col-6 => col-14
                  );
                  
                   let seminarEvaluation = coursesData[i].seminarEvaluation;
                  
                  if(this.state.tableSeminarHeaderColumn>0){
                    seminarEvaluation.map((data, index) =>
                    data.grade ? tableDataRow.push(data.grade) : tableDataRow.push(data.totalCredits) // col-15 => col-17
                  );
                  }
                  let subjectiveEvaluation = coursesData[i].subjectiveEvaluation;
                  subjectiveEvaluation.map((data, index) =>
                    data.grade ? tableDataRow.push(data.grade) : tableDataRow.push(data.totalCredits) // col-18 => col-22
                  );
                  let examsEvaluation = coursesData[i].examsEvaluation;
                  examsEvaluation.map((data, index) =>
                    data.marks ? tableDataRow.push(data.marks) : tableDataRow.push(data.totalCredits) // col-23 => col-25
                  );
                  let credits = coursesData[i].credits[0];
                  tableDataRow.push(credits.poss); // col-26
                  tableDataRow.push(credits.achieved); // col-27
                  tableDataRow.push(credits.totalCredits); // col-28
                  let transcriptGrade = coursesData[i].internalGrade[0].grade;
                  tableDataRow.push(transcriptGrade); // col-29
                  tableData[i] = tableDataRow; 
                }
              }
              this.setState({tableData: tableData});
            }   
            
           
            let attendanceRecordCol = ["Del", "Att", "%Att", "Credits"];
            tableHeaderData = tableHeaderData.concat(attendanceRecordCol);
           // let assignmentGraders = ["1", "2", "3", "4", "5", "6", "7", "8", "Credits"];
            tableHeaderData = tableHeaderData.concat(assignmentGraders);
            //let seminarGrades = ["1", "2", "Credits"];
            if(seminarGrades!=null){
              tableHeaderData = tableHeaderData.concat(seminarGrades);
            }
          //  let subjectiveEvalGradesCol = ["1", "2","3", "4", "Credits"];
            tableHeaderData = tableHeaderData.concat(subjectiveEvalGradesCol);
            //let examMarksCol = ["1", "2", "Credits"];
            tableHeaderData = tableHeaderData.concat(examMarksCol);
            let creditsCol = ["Poss", "Ach", "%"];
            tableHeaderData = tableHeaderData.concat(creditsCol);
            this.setState({tableHeaderData: tableHeaderData});

          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>,"error");
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
    this.setState({ isLoading: false });
  };


  approveData = async (sessionId=0, programmeId=0, sessionTermId=0, studentId=0,comments="",dateToShow,isApproved) => {
    this.setState({ isLoading: true ,studentId:studentId});
    let data = new FormData();
    data.append("academicsSessionId", sessionId);
    data.append("programmeId", programmeId);
    data.append("termId", sessionTermId);
    data.append("studentId", studentId);
    data.append("comments", comments);
    data.append("isApproved", isApproved);

    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C301CommonStudentGradeBookReportView?dateToShow=${format(dateToShow, "dd-MM-yyyy")}`;
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
            this.handleOpenSnackbar(<span>"Approved"</span>,"success");
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>,"error");
          }
          console.log("approveData", json);
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
    this.setState({ isLoading: false });
  };

  componentDidMount() {
    const { id = "0&0&0&0" } = this.props.match.params;
    let ids = id.split("&");
    this.setState({academicSessionId:ids[0],programmeId:ids[1],sessionTermId:ids[2],studentId:ids[3]});
    this.setState({endDate:this.getDateInString()});
    // this.props.setDrawerOpen(false);
    
    this.getData(ids[0], ids[1], ids[2], ids[3]);
  }

  render() {
    const { classes } = this.props;
    const { tableData } = this.state;
    const { sessionLabel = "" } = tableData;
    return (
      <Fragment>
        {this.state.isLoading && (
          <div className={classes.overlay}>
            <div className={classes.overlayContent}>
              <CircularProgress
                style={{ marginBottom: 10, color: "white" }}
                size={36}
              />
              <span>Loading...</span>
            </div>
          </div>
        )}
        <IconButton
          onClick={() => window.close()}
          aria-label="close"
          className={classes.closeButton}
        >
          <CloseIcon color="secondary" />
        </IconButton>


        {/* <PDFButton
        fileName="grade_book.pdf"
        targetRef={pdfRef}
      >
        Save to PDF!
      </PDFButton>
         */}
       
        <div className={classes.mainDiv}  >
        <div style={{display: "inlineBlock"}}>
          <div 
            style={{
              display: "inline-block"
            }}
          >
           <Grid  
                container 
                direction="row"
                justify="center"
                alignItems="center">

                {this.state.programmeLabel=="GCE A Level" ?
                  <Fragment>
                      <Grid><img src={UniversityLogo} alt="Logo" height={50} /> </Grid> 
                      <Grid><span className={classes.title}>University College Lahore</span></Grid>
                  </Fragment>
                  :
                  <Fragment>
                      <Grid><img src={Logo} alt="Logo" height={50} /> </Grid> 
                      <Grid><span className={classes.title}>Universal College Lahore</span></Grid>
                  </Fragment>
                 }

           </Grid>
          
            <br />
          <span className={classes.subTitle}>{this.state.programmeLabel}</span>
            <br/>
            <br/>
          <span className={classes.subTitle}>{this.state.studentLabel}</span>
          {this.state.programmeLabel=="GCE A Level" ?
            <>
            <br/>
            <br/>
            <span className={classes.subTitle}>{this.state.alevelYear}</span>
            </>
            :
            <Fragment>
              
            </Fragment>
          }
          
            <br/>
          </div>
          <div style={{display: "inline"}}>
              <span
                style={{
                  fontSize: "1em",
                  fontWeight:700,
                  textAlign: "center",
                  color: "#2f57a5",
                  width: 160,
                  padding: 5,
                  border: "solid 2px #2f57a5",
                  display: "block",
                  float:"right",
                  
                }}
              >
             Progress Report<br/>Academic Year<br/>{this.state.academicSessionLabel}<br/>{this.state.sessionTermLabel=="1st Term"?"First Term":"Second Term"}<br/>Up to<br/>{this.state.uptoDate}
             
              </span>
          </div>
        </div>
        <div className={classes.flexColumn}>
          <br/>
          <TableContainer 
            component={Paper} 
            style={{ 
              overflowX: "inherit" 
            }}
          >
            <Table
              size="small"
              className={classes.table}
              aria-label="customized table"
              size="small"
            >
              <TableHead>
              <TableRow>
                  <StyledTableCell align="center" rowSpan="2" style={{borderLeft: "1px solid rgb(47, 87, 165)" }}>Subject</StyledTableCell>
                    <StyledTableCell align="center" colSpan="4">Attendance Record</StyledTableCell>
                    <StyledTableCell align="center" colSpan={this.state.tableAssignmentHeaderColumn}>Assessment Grades</StyledTableCell>
                    {this.state.tableSeminarHeaderColumn>0 && 
                      <StyledTableCell align="center" colSpan={this.state.tableSeminarHeaderColumn}>Seminar Grades</StyledTableCell>
                    }
                    <StyledTableCell align="center" colSpan={this.state.tableSubjectiveHeaderColumn}>Subjective Eval Grades</StyledTableCell>
                    <StyledTableCell align="center" colSpan={this.state.tableExamHeaderColumn}>Examinations</StyledTableCell>
                    <StyledTableCell align="center" colSpan="3">Credits</StyledTableCell>
                    <StyledTableCell rowSpan="2" align="center" style={{ borderRight: "1px solid rgb(47, 87, 165)", width:60 }}>Overall <br/>Grade</StyledTableCell>
                    {/* <StyledTableCell align="center" rowSpan="2" style={{borderLeft: "1px solid rgb(47, 87, 165)" }}>Subject</StyledTableCell>
                    <StyledTableCell align="center" colSpan="4">Attendance Record</StyledTableCell>
                    <StyledTableCell align="center" colSpan={this.state.tableAssignmentHeaderColumn}>Assignment Grades</StyledTableCell>
                    <StyledTableCell align="center" colSpan="3">Seminar Grades</StyledTableCell>
                    <StyledTableCell align="center" colSpan="5">Subjective Eval Grades</StyledTableCell>
                    <StyledTableCell align="center" colSpan="3">Exam Marks</StyledTableCell>
                    <StyledTableCell align="center" colSpan="3">Credits</StyledTableCell>
                    <StyledTableCell rowSpan="2" align="center" style={{ borderRight: "1px solid rgb(47, 87, 165)", width:60 }}>Internal<br/>Transcript<br/>Grade</StyledTableCell> */}
                  </TableRow>
                  <TableRow>
                    {/* <StyledTableCell style={{ borderLeft: "1px solid rgb(47, 87, 165)" }}>&nbsp;</StyledTableCell> */}
                    { this.state.tableHeaderData && 
                      this.state.tableHeaderData.map((data, index)=> 
                        <StyledTableCell key={data+index} style={data=='Credits'?{width:40}:{width:"unset"}} align="center" >{data}</StyledTableCell>
                      )
                    }
                    {/* <StyledTableCell align="center" style={{ borderRight: "1px solid rgb(47, 87, 165)" }}>&nbsp;</StyledTableCell> */}
                  </TableRow>
              </TableHead>
              <TableBody>
                  <Fragment>
                    <TableRow>
                      <StyledTableCell colSpan={this.state.tableAssignmentHeaderColumn+this.state.tableSeminarHeaderColumn+this.state.tableSubjectiveHeaderColumn+this.state.tableExamHeaderColumn+9} style={{ backgroundColor: "#e1e3e8" }}>&nbsp;</StyledTableCell>
                    </TableRow>
                    {this.state.tableData.length > 0 ? (
                      <Fragment>
                        {console.log(this.state.tableData)}
                      {this.state.tableData.map((row, index) => (
                        <StyledTableRow key={"row"+index}>
                        {row.map((cellData, callIndex) => (
                            <>
                             
                              <StyledTableCell key={"["+index+"]["+callIndex+"]"} style={callIndex==0?{paddingLeft:"1%"}:{paddingLeft:"0%"}} align={callIndex==0?"left":"center"}>{cellData}</StyledTableCell>
                             </>
                       ))}
                        </StyledTableRow>
                      ))}
                      <TableRow>
                        <StyledTableCell colSpan={this.state.tableBottomFirstColumn} align="right" style={{borderRight:"none", borderBottom:"none", fontWeight:600}}>Accumulated Credits:&emsp;</StyledTableCell>
                        <StyledTableCell align="center" style={{borderRight:"none", borderLeft:"none", borderBottom:"none", fontWeight:600}}>{this.state.totalPOS}</StyledTableCell>
                        <StyledTableCell align="center" style={{borderRight:"none", borderLeft:"none", borderBottom:"none", fontWeight:600}}>{this.state.totalAchieved}</StyledTableCell>
                        <StyledTableCell align="center" style={{borderRight:"none", borderLeft:"none", borderBottom:"none", fontWeight:600}}>{this.state.totalPercentage}</StyledTableCell>
                        <StyledTableCell style={{borderLeft:"none", borderBottom:"none", fontWeight:600}}></StyledTableCell>
                      </TableRow>
                      <TableRow>
                        <StyledTableCell colSpan={this.state.tableBottomFirstColumn} align="right" style={{borderRight:"none", borderTop:"none", fontWeight:600}}>Result Classification:&emsp;</StyledTableCell>
                        <StyledTableCell colSpan="4" align="center" style={{borderLeft:"none", borderTop:"none", fontWeight:600}}>&emsp;{this.state.resultClassification}</StyledTableCell>
                      </TableRow>
                      </Fragment>
                    ):(
                    <TableRow>
                      <StyledTableCell colSpan={this.state.tableAssignmentHeaderColumn+this.state.tableSeminarHeaderColumn+this.state.tableSubjectiveHeaderColumn+this.state.tableExamHeaderColumn+9}>&nbsp;</StyledTableCell>
                    </TableRow>
                    )}
                   </Fragment>
                </TableBody>
            </Table>
          </TableContainer>
          
          <br/>
         
          <>
            <Grid container direction="row"
              justify="left"
              alignItems="left">
              <Grid item xs={10}>
                <TextField
                  id="comments"
                  name="comments"
                  label="Comments"
                  multiline
                  rows="4"
                  variant="outlined"
                  style={{width:"95%"}}
                  required
                  placeholder={"Comments"}
                  value={this.state.textAreaValue}
                  onChange={this.handleChange}
                />
              
              </Grid>
              <Grid item xs={2}>
              
              
              <DatePicker
                autoOk
                name="anouncementDate"
                id="anouncementDate"
                label="Date to Show Student"
                invalidDateMessage=""
                disablePast
                placeholder=""
                variant="inline"
                inputVariant="outlined"
                format="dd-MM-yyyy"
                required
                value={this.state.anouncementDate}
                onChange={date => this.handleDateChange("anouncementDate",date)}
                error={!!this.state.anouncementDateError}
                helperText={this.state.anouncementDateError ? this.state.anouncementDateError : " "}
              />
            
            
            </Grid>
            {/* <Grid item xs={3}>
            <span style={{fontSize:12, fontWeight:"600"}}>This document is digitally signed by Program Coordinatory on {this.getDateInString()}</span>
              
            </Grid> */}
            <br/>

            <br/>
            <br/>
            <br/>

           <div style={{display: "block", float:"right",width: "18%",marginLeft:"82%",marginTop:"2%"}}>
                 <span
                      style={{
                        fontSize:11, fontWeight:"600",
                        width:200,
                        textAlign: "left",
                        float:"left",
                        
                      }}
                    >
                        <b> Issuing Authority: </b>
                      
                  
                  </span>
                  <br/>
                  <span
                    style={{
                      fontSize:11, fontWeight:"600",
                      width:180,
                      textAlign: "left",
                      float:"right",
                      
                    }}
                  >
                      <b>Programme Coordinator</b>
                      <br/>
                      <b>This is a system generated report</b>
                      <br/>
                      <b>No signature required</b>
                      
                
                  </span>
           </div> 
              {/* <Grid
                  container
                  direction="column"
                  justifyContent="flex-end"
                  alignItems="flex-end"
                   xs={12}
                   alignContent="right"
                >

                    <Grid item xs={3}>
                     
                    </Grid>
                    
                    <Grid item xs={6}>
                    
                    
                    
                  <br/>
                  
                </Grid>
                  <br/>
                  
                </Grid> */}

            </Grid>
            <br/>
            {/* <Grid
                  container
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="flex-end"
                   xs={3}
                >

                    
                    

            </Grid>
             */}
            
            </>
                   
                 

      
          

        
         <CustomizedSnackbar
          isOpen={this.state.isOpenSnackbar}
          message={this.state.snackbarMessage}
          severity={this.state.snackbarSeverity}
          handleCloseSnackbar={() => this.handleCloseSnackbar()}
        />
        </div>
        <div className={classes.bottomBar}>
        <BottomBar
          
            left_button_text="Save"
            left_button_hide={false}
            bottomLeftButtonAction={() =>this.handleGenerateAndApprove(0)}
            right_button_text="Approve"
            bottomRightButtonAction={ () =>this.handleGenerateAndApprove(1)}
            loading={this.state.isLoading}
            isDrawerOpen={false}
          //  disableRightButton={this.state.studentId}
        />
        </div>
       </div>
  


      
      </Fragment>
    );
  }
}

DisplayAdmissionApplications.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DisplayAdmissionApplications);
