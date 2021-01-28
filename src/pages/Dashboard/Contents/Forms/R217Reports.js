import React, { Component, Fragment, useState, useEffect } from "react";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import { numberFreeExp } from "../../../../utils/regularExpression";
import {TextField, Grid, MenuItem, CircularProgress, Divider, Typography,
  Chip, Select, IconButton, Tooltip, Checkbox, Fab, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Card, CardContent} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import BottomBar from "../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 500,
    border: '1px solid rgb(29, 95, 152)'
  },
  body: {
    fontSize: 14,
    border: '1px solid '+theme.palette.primary.main,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    "&:hover":{
      backgroundColor:"#D3D3D3"
      //backgroundColor:"#f6f8fa"
    }
  },
}))(TableRow);

const styles = () => ({
  root: {
    padding: 20,
    minWidth: 350,
    overFlowX: "auto",
  },
  formControl: {
    minWidth: "100%",
  },
  sectionTitle: {
    fontSize: 19,
    color: "#174a84",
  },
  checkboxDividerLabel: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 20,
    fontSize: 16,
    fontWeight: 600,
  },
  rootProgress: {
    width: "100%",
    textAlign: "center",
  },
  table: {
    //minWidth: 750,
  }
});

function TableRowWithData(props) {

  const {rowIndex, rowData={}, onChange, letterGradeMenuItems, isLoading, ...rest} = props;
  let preletterGradeId = rowData.letterGradeId || "";
  const [letterGradeId, setLetterGradeId] = useState(preletterGradeId);
  const [letterGradeIdError, setLetterGradeIdError] = useState("");
  
  const handleChangeLetterGrade = (e) => {
    const { name, value } = e.target;
    setLetterGradeId(value);
  }

  useEffect(() => {});

  return (
      <StyledTableRow key={rowData}>
        <StyledTableCell component="th" scope="row" align="center">
          {rowIndex + 1}
        </StyledTableCell>
        <StyledTableCell align="left">
          {rowData.studentLabel}
          <TextField type="hidden" name="studentId" defaultValue={rowData.studentId}/>
        </StyledTableCell>
        <StyledTableCell align="center">
            <TextField
              id={"letterGradeId"+rowIndex}
              name="letterGradeId"
              variant="outlined"
              label="Letter Grade"
              onChange={(e)=>handleChangeLetterGrade(e)}
              value={letterGradeId}
              error={!!letterGradeIdError}
              helperText={letterGradeIdError}
              disabled={isLoading}
              required
              fullWidth
              select
              size="small"
              inputProps={{
                id:"letterGradeId"+rowIndex
              }}
            >
              {letterGradeMenuItems ? (
                letterGradeMenuItems.map((dt, i) => (
                  <MenuItem
                    key={"letterGradeMenuItems"+dt.id+rowIndex}
                    value={dt.id}
                  >
                    {dt.label}
                  </MenuItem>
                ))
              ) : (
                <MenuItem>
                  <CircularProgress size={24} />
                </MenuItem>
              )}
            </TextField>
        </StyledTableCell>
      </StyledTableRow>
  );
}

class R217Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordId: this.props.match.params.recordId,
      isLoading: false,
      isLoadingData: false,
      isReload: false,
      label: "",
      labelError: "",
      shortLabel: "",
      shortLabelError: "",
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      academicSessionIdMenuItems: [],
      academicSessionId: "",
      academicSessionLabel: "",
      academicSessionIdError: "",
      sectionMenuItems: [],
      programmeGroupIdMenuItems: [],
      programmeGroupId: "",
      programmeGroupIdError: "",
      teacherId: "",
      teacherMenuItems: [],
      teacherIdError: "",
      termId: "",
      termIdError: "",
      termMenuItems: [],
      assessmentNo: "",
      totalNoOfAssessment: "",
      letterGradeMenuItems: [],
      tableData:[],
      isEditMode: false
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
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      isOpenSnackbar: false,
    });
  };
  loadReport = async(index) => {
    const data = new FormData();
    data.append("id",index);
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C115CommonStudentsFeedbackTeacherView`;
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
  getAcademicSessions = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C217CommonAcademicSessionsView`;
    
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
            this.setState({ academicSessionIdMenuItems: json.DATA });
            let array = json.DATA || [];
            let arrayLength = array.length;
            for (let i=0; i<arrayLength; i++) {
              if (array[i].isActive == "1") {
                this.setState({
                  academicSessionId:array[i].ID,
                  academicSessionLabel:array[i].Label
                });
                this.loadProgrammeGroups(array[i].ID);
                this.getTerms(array[i].ID);
              }
            }
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("getAcademicSessions", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  loadProgrammeGroups = async (academicSessionId) => {
    this.setState({ isLoading: true });
    let data = new FormData();
    data.append("academicsSessionId", academicSessionId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C217CommonAcademicsSessionsOfferedProgrammesGroupView`;
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
            this.setState({ programmeGroupIdMenuItems: json.DATA });
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadProgrammeGroups", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  getTerms = async (academicsSessionId) => {
    this.setState({ isLoading: true });
    let data = new FormData();
    data.append("academicsSessionId", academicsSessionId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C217CommonAcademicsSessionsTermsView`;
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
            this.setState({ termMenuItems: json.DATA || [] });
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("getTerms", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  getTotalNoOfAssessment = async (academicsSessionId, programmeGroupId, termId) => {
    this.setState({ isLoading: true });
    let data = new FormData();
    data.append("academicsSessionId", academicsSessionId);
    data.append("programmeGroupId", programmeGroupId);
    data.append("termId", termId);
    data.append("rubricId", 2);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C201CommonAcademicsSessionsEvaluationsTotalNoOfAssessmentView`;
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
            let data = json.DATA || [];
            let dataLength = data.length;
            if(dataLength>0){
              this.setState({ totalNoOfAssessment :  data[0].totalNoOfAssessment});
            }
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("getTotalNoOfAssessment", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  // getSections = async (academicsSessionId=0, programmeGroupId=0) => {
  //   this.setState({ isLoading: true });
  //   let data = new FormData();
  //   data.append("academicsSessionId", academicsSessionId);
  //   data.append("programmeGroupId", programmeGroupId);
  //   const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C216CommonTeacherView`;
  //   await fetch(url, {
  //     method: "POST",
  //     body: data,
  //     headers: new Headers({
  //       Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
  //     }),
  //   })
  //     .then((res) => {
  //       if (!res.ok) {
  //         throw res;
  //       }
  //       return res.json();
  //     })
  //     .then(
  //       (json) => {
  //         if (json.CODE === 1) {
  //           this.setState({ teacherMenuItems: json.DATA });
  //         } else {
  //           this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
  //         }
  //         console.log("getSections", json);
  //       },
  //       (error) => {
  //         if (error.status == 401) {
  //           this.setState({
  //             isLoginMenu: true,
  //             isReload: true,
  //           });
  //         } else {
  //           console.log(error);
  //           this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
  //         }
  //       }
  //     );
  //   this.setState({ isLoading: false });
  // };

  getMaxAssessmentNo = async (academicsSessionId, programmeGroupId, termId, teacherId) => {
    this.setState({ 
      isLoading: true,
      isLoadingData: false
    });
    this.setState({  });
    let data = new FormData();
    data.append("academicsSessionId", academicsSessionId);
    data.append("programmeGroupId", programmeGroupId);
    data.append("termId", termId);
    data.append("teacherId", teacherId);
    data.append("evaluationTypeId", 1);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C201CommonAcademicsSessionsEvaluationsMaxAssessmentNoView`;
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
            let data = json.DATA || [];
            let dataLength = data.length;
            if(dataLength>0){
              if(data[0].maxAssessmentNo < this.state.totalNoOfAssessment){
                data[0].maxAssessmentNo++;
                this.loadData(teacherId);
                this.setState({isLoadingData: true});
              }else{
                this.handleOpenSnackbar(<span>All assessments complete.</span>,"error");
              }
              this.setState({assessmentNo: data[0].maxAssessmentNo});
            }
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("getMaxAssessmentNo", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
          }
        }
      );
      if(!this.state.isLoadingData){
        this.setState({ isLoading: false });
      }
  };

  // getLetterGrades = async () => {
  //   this.setState({ isLoading: true });
  //   const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C216CommonTeacherView`;
  //   await fetch(url, {
  //     method: "POST",
  //     headers: new Headers({
  //       Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
  //     }),
  //   })
  //     .then((res) => {
  //       if (!res.ok) {
  //         throw res;
  //       }
  //       return res.json();
  //     })
  //     .then(
  //       (json) => {
  //         if (json.CODE === 1) {
  //           this.setState({ letterGradeMenuItems: json.DATA });
  //         } else {
  //           this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
  //         }
  //         console.log("getLetterGrades", json);
  //       },
  //       (error) => {
  //         if (error.status == 401) {
  //           this.setState({
  //             isLoginMenu: true,
  //             isReload: true,
  //           });
  //         } else {
  //           console.log(error);
  //           this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
  //         }
  //       }
  //     );
  //   this.setState({ isLoading: false });
  // };

  loadData = async (teacherId, id=0) => {
    const data = new FormData();
    data.append("id", id);
    data.append("academicSessionId", this.state.academicSessionId);
    data.append("programmeGroupId", this.state.programmeGroupId);
    data.append("termId", this.state.termId);
    data.append("teacherId", teacherId);
    data.append("evaluationTypeId", 1);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C201CommonSectionsStudentsView`;
    await fetch(url, {
      method: "POST",
      body: data,
      headers: new Headers({Authorization: "Bearer "+localStorage.getItem("uclAdminToken")}),
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
            if (json.DATA.length) {
              let data =  json.DATA[0] || [];
              if(data && id!=0){
                this.getTotalNoOfAssessment(data.academicSessionId, data.programmeGroupId, data.sessionTermId);
                this.setState({
                  academicSessionId: data.academicSessionId,
                  programmeGroupId : data.programmeGroupId,
                  termId: data.sessionTermId,
                  teacherId: data.teacherId,
                  assessmentNo: data.assessmentNo,
                  tableData: data.evaluationDetail || []
                });
              } else{
                this.setState({tableData: data.evaluationDetail || []});
              }
            } 
            // else {
            //   window.location = "#/dashboard/R217Reports/0";
            // }
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadData", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  isAcademicSessionValid = () => {
    let isValid = true;
    if (!this.state.academicSessionId) {
      this.setState({
        academicSessionIdError: "Please select Academic Session.",
      });
      document.getElementById("academicSessionId").focus();
      isValid = false;
    } else {
      this.setState({ academicSessionIdError: "" });
    }
    return isValid;
  };

  isProgrammeGroupValid = () => {
    let isValid = true;
    if (!this.state.programmeGroupId) {
      this.setState({ programmeGroupIdError: "Please select programme group." });
      document.getElementById("programmeGroupId").focus();
      isValid = false;
    } else {
      this.setState({ programmeGroupIdError: "" });
    }
    return isValid;
  };
  
  isTermValid = () => {
    let isValid = true;
    if (!this.state.termId) {
      this.setState({ termIdError: "Please select Term." });
      document.getElementById("termId").focus();
      isValid = false;
    } else {
      this.setState({ termIdError: "" });
    }
    return isValid;
  };
  
  isSectionValid = () => {
    let isValid = true;
    if (!this.state.teacherId) {
      this.setState({ teacherIdError: "Please select Section." });
      document.getElementById("teacherId").focus();
      isValid = false;
    } else {
      this.setState({ teacherIdError: "" });
    }
    return isValid;
  };

  isTableDataValid = () => {
    let isValid = true;
    let studentIds = document.getElementsByName("studentId");
    let letterGradeIds = document.getElementsByName("letterGradeId");
    let recordCount  = studentIds.length || 0;
    if(!recordCount){
      isValid = false;
      this.handleOpenSnackbar("No data exist.","error");
    }else{
      for(let i=0; i<recordCount; i++){
        let eleValue = letterGradeIds[i].value;
        let eleId = letterGradeIds[i].id;
        if(eleValue==null || eleValue==0 || eleValue=="0" || eleValue==""){
          isValid = false;
          document.getElementById(eleId).focus();
          this.handleOpenSnackbar("Please select grades for all students.","error");
          break;
        }
      }
    }
    return isValid;
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    let regex = "";
    switch (name) {
      case "academicSessionId":
        this.setState({
          programmeGroupIdMenuItems: [],
					programmeGroupId: "",
          termId:"",
          termMenuItems:[],
          teacherId:""
        });
        let academicSessionIdMenuItems = this.state.academicSessionIdMenuItems;
        for(let i=0; i<academicSessionIdMenuItems.length; i++){
          if(academicSessionIdMenuItems[i].ID == value){
            this.setState({academicSessionLabel: academicSessionIdMenuItems[i].Label});
          }
        }
        this.loadProgrammeGroups(value);
        this.getTerms(value);
      break;
      case "programmeGroupId":
        this.setState({
          termId: "",
          teacherMenuItems: [],
          teacherId:""
        });
        let programmeGroupIdMenuItems = this.state.programmeGroupIdMenuItems;
        for(let i=0; i<programmeGroupIdMenuItems.length; i++){
          if(programmeGroupIdMenuItems[i].Id == value){
            this.setState({programmeGroupLabel: programmeGroupIdMenuItems[i].Label});
          }
        }
        // this.getSections(this.state.academicSessionId, value);
      break;
      case "termId":
        this.setState({
          totalNoOfAssessment:"",
          assessmentNo:"",
          teacherId:"",
          tableData:[]
        });
        let termMenuItems = this.state.termMenuItems;
        for(let i=0; i<termMenuItems.length; i++){
          if(termMenuItems[i].id == value){
            this.setState({termLabel: termMenuItems[i].label});
          }
        }
        this.getTotalNoOfAssessment(this.state.academicSessionId, this.state.programmeGroupId, value);
      break;
      case "teacherId":
        this.setState({
          assessmentNo:"",
          teacherId:"",
          tableData:[]
        });
        let teacherMenuItems = this.state.teacherMenuItems;
        for(let i=0; i<teacherMenuItems.length; i++){
          if(teacherMenuItems[i].id == value){
            this.setState({teacherLabel: teacherMenuItems[i].label});
          }
        }
        this.getMaxAssessmentNo(this.state.academicSessionId, this.state.programmeGroupId, this.state.termId, value);
      break;
      default:
    }
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  clickOnFormSubmit = () => {
    this.onFormSubmit();
  };

  onFormSubmit = async () => {
    if (
      !this.isAcademicSessionValid()
      || !this.isProgrammeGroupValid()
      || !this.isTermValid()
      || !this.isSectionValid()
      // || !this.isTableDataValid()
    ) { return; }
    let myForm = document.getElementById("myForm");
    let data = new FormData(myForm);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C201CommonAcademicsSessionsEvaluationsSave`;
    await fetch(url, {
      method: "POST",
      body: data,
      headers: new Headers({Authorization:"Bearer "+localStorage.getItem("uclAdminToken")}),
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
                window.location = "#/dashboard/F201Reports";
              } else {
                window.location.reload();
              }
            }, 2000);
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
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

  viewReport = () => {
    window.location = "#/dashboard/F216Reports";
  };
  handleGenerate = () => {
    
    window.open(
      `#/R217FeedbackReports/${
        this.state.academicSessionId +
        "&" +
        this.state.academicSessionLabel +
        "&" +
        this.state.programmeGroupId +
        "&" +
        this.state.programmeGroupLabel +
        "&" +
        this.state.termId +
        "&" +
        this.state.termLabel 
        // +
        // "&" +
        // this.state.teacherId +
        // "&" +
        // this.state.teacherLabel
      }`,
      "_blank"
    );
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.getAcademicSessions();
    // this.getLetterGrades();
    if (this.state.recordId != 0) {
      this.setState({isEditMode:true});
      this.loadData(0,this.state.recordId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.recordId != nextProps.match.params.recordId) {
      if (nextProps.match.params.recordId != 0) {
        this.props.setDrawerOpen(false);
        this.setState({isEditMode:true});
        this.loadData(0,nextProps.match.params.recordId);
      } else {
        window.location.reload();
      }
    }
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
        <form id="myForm">
          <Grid container component="main" className={classes.root}>
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                borderBottom: "1px solid rgb(58, 127, 187, 0.3)",
                width: "100%",
                marginTop:-10,
                marginBottom: 24,
                fontSize: "1.5rem"
              }}
            >
              Feedback Summary
            </Typography>
            <Divider
              style={{
                backgroundColor: "rgb(58, 127, 187)",
                opacity: "0.3",
              }}
            />
            <Grid
              container
              spacing={2}
            >
              <TextField type="hidden" name="assessmentNo" value={this.state.assessmentNo}/>
              <TextField type="hidden" name="evaluationTypeId" defaultValue={1}/>
              <Grid item xs={4}>
                <TextField
                  id="academicSessionId"
                  name="academicSessionId"
                  variant="outlined"
                  label="Academic Session"
                  onChange={this.onHandleChange}
                  value={this.state.academicSessionId}
                  error={!!this.state.academicSessionIdError}
                  helperText={this.state.academicSessionIdError}
                  //disabled={this.state.isEditMode}
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
              <Grid item xs={4}>
                <TextField
                  id="programmeGroupId"
                  name="programmeGroupId"
                  variant="outlined"
                  label="Programme Group"
                  onChange={this.onHandleChange}
                  value={this.state.programmeGroupId}
                  error={!!this.state.programmeGroupIdError}
                  helperText={this.state.programmeGroupIdError}
                  disabled={!this.state.academicSessionId}
                  required
                  fullWidth
                  select
                >
                  {this.state.programmeGroupIdMenuItems ? (
                    this.state.programmeGroupIdMenuItems.map((dt, i) => (
                      <MenuItem
                        key={"programmeGroupIdMenuItems" + dt.Id}
                        value={dt.Id }
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
              <Grid item xs={4}>
                <TextField
                  id="termId"
                  name="termId"
                  variant="outlined"
                  label="Term"
                  onChange={this.onHandleChange}
                  value={this.state.termId}
                  error={!!this.state.termIdError}
                  helperText={this.state.termIdError}
                  disabled={!this.state.academicSessionId || !this.state.programmeGroupId}
                  required
                  fullWidth
                  select
                >
                  {this.state.termMenuItems ? (
                    this.state.termMenuItems.map((dt, i) => (
                      <MenuItem
                        key={"termMenuItems"+dt.id}
                        value={dt.id}
                      >
                        {dt.label}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>
                      <CircularProgress size={24} />
                    </MenuItem>
                  )}
                </TextField>
              </Grid>
              {/* <Grid item xs={3}>
                <TextField
                  id="teacherId"
                  name="teacherId"
                  variant="outlined"
                  label="Teacher"
                  onChange={this.onHandleChange}
                  value={this.state.teacherId}
                  error={!!this.state.teacherIdError}
                  helperText={this.state.teacherIdError}
                  disabled={!this.state.academicSessionId || !this.state.programmeGroupId || !this.state.termId || this.state.isEditMode}
                  required
                  fullWidth
                  select
                >
                  {this.state.teacherMenuItems ? (
                    this.state.teacherMenuItems.map((dt, i) => (
                      <MenuItem
                        key={"teacherMenuItems"+dt.id}
                        value={dt.id}
                      >
                        {dt.label}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>
                      <CircularProgress size={24} />
                    </MenuItem>
                  )}
                </TextField>
              </Grid> */}
              <Grid item xs={12}>
                <Divider
                  style={{
                    backgroundColor: "rgb(58, 127, 187)",
                    opacity: "0.3",
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </form>
        <BottomBar
          left_button_text="View"
          left_button_hide={true}
          bottomLeftButtonAction={this.viewReport}
          right_button_text="Generate"
          bottomRightButtonAction={this.handleGenerate}
          loading={this.state.isLoading}
          disableRightButton={this.state.termId==0}
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
export default withStyles(styles)(R217Reports);
