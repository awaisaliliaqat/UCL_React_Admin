import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Logo from "../../../../assets/Images/logo.png";
import CloseIcon from "@material-ui/icons/Close";
import { IconButton, Typography, CircularProgress, Grid } from "@material-ui/core";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
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

const styles = (theme) => ({
  mainDiv: {
    margin: "10px 10px 0px 10px",
    "@media print": {
      minWidth: "7.5in",
      maxWidth: "11in",
    },
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
    backgroundColor: "rgb(47, 87, 165)", //theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: 500,
    border: "1px solid white",
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
      tableData: [],
      academicSessionLabel: "____-____",
      programmeGroupLabel: "",
      studentLabel: "",
      uptoDate: "__/__/____"
    };
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
    this.setState({ isLoading: true });
    let data = new FormData();
    data.append("academicsSessionId", sessionId);
    data.append("programmeId", programmeId);
    data.append("termId", sessionTermId);
    data.append("studentId", studentId);
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
            let attendanceRecordCol = ["Del", "Att", "%Att", "Credits"];
            tableHeaderData = tableHeaderData.concat(attendanceRecordCol);
            let assignmentGraders = ["1", "2", "3", "4", "5", "6", "7", "8", "Credits"];
            tableHeaderData = tableHeaderData.concat(assignmentGraders);
            let seminarGrades = ["1", "2", "Credits"];
            tableHeaderData = tableHeaderData.concat(seminarGrades);
            let subjectiveEvalGradesCol = ["1", "2","3", "4", "Credits"];
            tableHeaderData = tableHeaderData.concat(subjectiveEvalGradesCol);
            let examMarksCol = ["1", "2", "Credits"];
            tableHeaderData = tableHeaderData.concat(examMarksCol);
            let creditsCol = ["Poss", "Ach", "%Age"];
            tableHeaderData = tableHeaderData.concat(creditsCol);
            this.setState({tableHeaderData: tableHeaderData});
           
            let tableData = [];
            let data = json.DATA || [];
            let dataLength = data.length;
            if(dataLength){
              this.setState({
                studentLabel: data[0].studentLabel,
                programmeGroupLabel: data[0].programmeGroupLabel,
                academicSessionLabel: data[0].academicsSessionLabel,
                uptoDate: this.getDateInString()
              });
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
                  seminarEvaluation.map((data, index) =>
                    data.grade ? tableDataRow.push(data.grade) : tableDataRow.push(data.totalCredits) // col-15 => col-17
                  );
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

  componentDidMount() {
    const { id = "0&0&0&0" } = this.props.match.params;
    let ids = id.split("&");
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
        <div className={classes.mainDiv}>
          <div style={{display: "inlineBlock"}}>
            <div 
              style={{
                display: "inline-block"
              }}
            >
              <span className={classes.title}>University College Lahore</span>
              <br />
            <span className={classes.subTitle}>{this.state.programmeGroupLabel}</span>
              <br/>
              <br/>
            <span className={classes.subTitle}>{this.state.studentLabel}</span>
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
                  marginRight: 56
                }}
              >
                Progress Report<br/>Academic Year<br/>{this.state.academicSessionLabel}<br/>Upto<br/>{this.state.uptoDate}
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
                    <StyledTableCell align="center" colSpan="9">Assignment Graders</StyledTableCell>
                    <StyledTableCell align="center" colSpan="3">Seminar Grades</StyledTableCell>
                    <StyledTableCell align="center" colSpan="5">Subjective Eval Grades</StyledTableCell>
                    <StyledTableCell align="center" colSpan="3">Exam Marks</StyledTableCell>
                    <StyledTableCell align="center" colSpan="3">Credits</StyledTableCell>
                    <StyledTableCell rowSpan="2" align="center" style={{ borderRight: "1px solid rgb(47, 87, 165)", width:60 }}>Internal<br/>Transcript<br/>Grade</StyledTableCell>
                  </TableRow>
                  <TableRow>
                    {/* <StyledTableCell style={{ borderLeft: "1px solid rgb(47, 87, 165)" }}>&nbsp;</StyledTableCell> */}
                    { this.state.tableHeaderData && 
                      this.state.tableHeaderData.map((data, index)=> 
                        <StyledTableCell key={data+index} align="center" >{data}</StyledTableCell>
                      )
                    }
                    {/* <StyledTableCell align="center" style={{ borderRight: "1px solid rgb(47, 87, 165)" }}>&nbsp;</StyledTableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <Fragment>
                    <TableRow>
                      <StyledTableCell colSpan="29" style={{ backgroundColor: "#e1e3e8" }}>&nbsp;</StyledTableCell>
                    </TableRow>
                    {this.state.tableData.length > 0 ? (
                      <Fragment>
                      {this.state.tableData.map((row, index) => (
                        <StyledTableRow key={"row"+index}>
                        {row.map((cellData, callIndex) => (
                            <StyledTableCell key={"["+index+"]["+callIndex+"]"} align="center">{cellData}</StyledTableCell>
                        ))}
                        </StyledTableRow>
                      ))}
                      <TableRow>
                        <StyledTableCell colSpan="25" align="right" style={{borderRight:"none", borderBottom:"none", fontWeight:600}}>Accumulated Credit:&emsp;</StyledTableCell>
                        <StyledTableCell align="center" style={{borderRight:"none", borderLeft:"none", borderBottom:"none", fontWeight:600}}>_ _</StyledTableCell>
                        <StyledTableCell align="center" style={{borderRight:"none", borderLeft:"none", borderBottom:"none", fontWeight:600}}>_ _</StyledTableCell>
                        <StyledTableCell align="center" style={{borderRight:"none", borderLeft:"none", borderBottom:"none", fontWeight:600}}>_ _</StyledTableCell>
                        <StyledTableCell style={{borderLeft:"none", borderBottom:"none", fontWeight:600}}></StyledTableCell>
                      </TableRow>
                      <TableRow>
                        <StyledTableCell colSpan="25" align="right" style={{borderRight:"none", borderTop:"none", fontWeight:600}}>Result Classification:&emsp;</StyledTableCell>
                        <StyledTableCell colSpan="4" style={{borderLeft:"none", borderTop:"none", fontWeight:600}}>&emsp;_ _ _</StyledTableCell>
                      </TableRow>
                      </Fragment>
                    ):(
                    <TableRow>
                      <StyledTableCell colSpan="29">&nbsp;</StyledTableCell>
                    </TableRow>
                    )}
                   </Fragment>
                </TableBody>
              </Table>
            </TableContainer>
            <br/><br/><br/><br/><br/><br/><br/><br/>
            <div>
              <div style={{width:550}}> <hr style={{backgroundColor:"#A9A9A9", height:5}} /></div>
              <span style={{fontSize:24, fontWeight:"600"}}>For an explanation of the report see overleaf</span>
              <br/>
              <span><small>Date of printing&emsp;&emsp;&emsp;{this.getDateInString()}</small></span>
            </div>
          </div>
          <div className={classes.bottomSpace}></div>
        </div>
      </Fragment>
    );
  }
}

DisplayAdmissionApplications.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DisplayAdmissionApplications);
