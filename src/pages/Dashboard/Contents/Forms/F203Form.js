import React, { Component, Fragment, useState, useEffect } from "react";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import { numberFreeExp } from "../../../../utils/regularExpression";
import {TextField, Grid, MenuItem, CircularProgress, Divider, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Card, CardContent} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import BottomBar from "../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 500,
    border: '1px solid '+theme.palette.common.white
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

  const {rowIndex, rowData={}, onChange, isLoading, ...rest} = props;
  let preMarks = rowData.marks || "";
  const [marks, setMarks] = useState(preMarks);
  const [marksError, setMarksError] = useState("");
  
  const handleChangeMarks = (e) => {
    const { name, value } = e.target;
    setMarks(value);
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
              id={"marks"+rowIndex}
              name="marks"
              variant="outlined"
              label="Marks"
              type="number"
              onChange={(e)=>handleChangeMarks(e)}
              value={marks}
              error={!!marksError}
              helperText={marksError}
              disabled={isLoading}
              required
              fullWidth
              size="small"
              inputProps={{
                id:"marks"+rowIndex,
              }}
            />
        </StyledTableCell>
      </StyledTableRow>
  );
}

class F203Form extends Component {
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
      academicSessionIdError: "",
      programmeGroupIdMenuItems: [],
      programmeGroupId: "",
      programmeGroupIdError: "",
      sectionMenuItems: [],
      sectionId: "",
      sectionIdError: "",
      termId: "",
      termIdError: "",
      termMenuItems: [],
      assessmentNo: "",
      totalNoOfAssessment: "",
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

  getAcademicSessions = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C203CommonAcademicSessionsView`;
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
                this.setState({academicSessionId:array[i].ID});
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

  loadProgrammeGroups = async (academicSessionId) => {
    this.setState({ isLoading: true });
    let data = new FormData();
    data.append("academicsSessionId", academicSessionId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C203CommonAcademicsSessionsOfferedProgrammesGroupView`;
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C203CommonAcademicsSessionsTermsView`;
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

  getTotalNoOfAssessment = async (academicsSessionId, programmeGroupId, termId) => {
    this.setState({ isLoading: true });
    let data = new FormData();
    data.append("academicsSessionId", academicsSessionId);
    data.append("programmeGroupId", programmeGroupId);
    data.append("termId", termId);
    data.append("rubricId", 4);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C203CommonAcademicsSessionsEvaluationsTotalNoOfAssessmentView`;
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

  getSections = async (academicsSessionId=0, programmeGroupId=0) => {
    this.setState({ isLoading: true });
    let data = new FormData();
    data.append("academicsSessionId", academicsSessionId);
    data.append("programmeGroupId", programmeGroupId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C203CommonAcademicsSectionsView`;
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
            this.setState({ sectionMenuItems: json.DATA });
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("getSections", json);
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

  getMaxAssessmentNo = async (academicsSessionId, programmeGroupId, termId, sectionId) => {
    this.setState({ 
      isLoading: true,
      isLoadingData: false
    });
    this.setState({  });
    let data = new FormData();
    data.append("academicsSessionId", academicsSessionId);
    data.append("programmeGroupId", programmeGroupId);
    data.append("termId", termId);
    data.append("sectionId", sectionId);
    data.append("examTypeId", 2);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C203CommonAcademicsSessionsEvaluationsMaxAssessmentNoView`;
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
                this.loadData(sectionId);
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

  loadData = async (sectionId, id=0) => {
    const data = new FormData();
    data.append("id", id);
    data.append("academicSessionId", this.state.academicSessionId);
    data.append("programmeGroupId", this.state.programmeGroupId);
    data.append("termId", this.state.termId);
    data.append("sectionId", sectionId);
    data.append("examTypeId", 2);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C203CommonSectionsStudentsView`;
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
            if (json.DATA.length) {
              let data =  json.DATA[0] || [];
              if(data && id!=0){
                this.getTotalNoOfAssessment(data.academicSessionId, data.programmeGroupId, data.sessionTermId);
                this.setState({
                  academicSessionId: data.academicSessionId,
                  programmeGroupId : data.programmeGroupId,
                  termId: data.sessionTermId,
                  sectionId: data.sectionId,
                  assessmentNo: data.assessmentNo,
                  tableData: data.evaluationDetail || []
                });
              } else{
                this.setState({tableData: data.evaluationDetail || []});
              }
            } else {
              window.location = "#/dashboard/F203Form/0";
            }
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadData", json);
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
    if (!this.state.sectionId) {
      this.setState({ sectionIdError: "Please select Section." });
      document.getElementById("sectionId").focus();
      isValid = false;
    } else {
      this.setState({ sectionIdError: "" });
    }
    return isValid;
  };

  isTableDataValid = () => {
    let isValid = true;
    let studentIds = document.getElementsByName("studentId");
    let marks = document.getElementsByName("marks");
    let recordCount  = studentIds.length || 0;
    if(!recordCount){
      isValid = false;
      this.handleOpenSnackbar("No data exist.","error");
    }else{
      for(let i=0; i<recordCount; i++){
        let eleValue = marks[i].value;
        let eleId = marks[i].id;
        if(eleValue==null || eleValue==""){
          isValid = false;
          document.getElementById(eleId).focus();
          this.handleOpenSnackbar("Please enter marks for all students.","error");
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
          termId:"",
          termMenuItems:[],
          assessmentNo:"",
          totalNoOfAssessment:"",
          sectionId:"",
          tableData:[]
        });
        this.loadProgrammeGroups(value);
        this.getTerms(value);
      break;
      case "programmeGroupId":
        this.setState({
          termId: "",
          totalNoOfAssessment:"",
          assessmentNo:"",
          sectionMenuItems: [],
          sectionId:"",
          tableData:[]
        });
        this.getSections(this.state.academicSessionId, value);
      break;
      case "termId":
        this.setState({
          totalNoOfAssessment:"",
          assessmentNo:"",
          sectionId:"",
          tableData:[]
        });
        this.getTotalNoOfAssessment(this.state.academicSessionId, this.state.programmeGroupId, value);
      break;
      case "sectionId":
        this.setState({
          assessmentNo:"",
          sectionId:"",
          tableData:[]
        });
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
      || !this.isTableDataValid()
    ) { return; }
    let myForm = document.getElementById("myForm");
    let data = new FormData(myForm);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C203CommonAcademicsSessionsExamsEvaluationSave`;
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
                window.location = "#/dashboard/F203Reports";
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
    window.location = "#/dashboard/F203Reports";
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.getAcademicSessions();
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
              Exams Evaluation
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
              <TextField type="hidden" name="examTypeId" defaultValue={2}/>
              <Grid item xs={12} md={2}>
                <TextField
                  id="academicSessionId"
                  name="academicSessionId"
                  variant="outlined"
                  label="Academic Session"
                  onChange={this.onHandleChange}
                  value={this.state.academicSessionId}
                  error={!!this.state.academicSessionIdError}
                  helperText={this.state.academicSessionIdError}
                  disabled={this.state.isEditMode}
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
              <Grid item xs={12} md={3}>
                <TextField
                  id="programmeGroupId"
                  name="programmeGroupId"
                  variant="outlined"
                  label="Programme Group"
                  onChange={this.onHandleChange}
                  value={this.state.programmeGroupId}
                  error={!!this.state.programmeGroupIdError}
                  helperText={this.state.programmeGroupIdError}
                  disabled={!this.state.academicSessionId || this.state.isEditMode}
                  required
                  fullWidth
                  select
                >
                  {this.state.programmeGroupIdMenuItems ? (
                    this.state.programmeGroupIdMenuItems.map((dt, i) => (
                      <MenuItem
                        key={"programmeGroupIdMenuItems" + dt.Id}
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
              <Grid item xs={12} md={2}>
                <TextField
                  id="termId"
                  name="termId"
                  variant="outlined"
                  label="Term"
                  onChange={this.onHandleChange}
                  value={this.state.termId}
                  error={!!this.state.termIdError}
                  helperText={this.state.termIdError}
                  disabled={!this.state.academicSessionId || !this.state.programmeGroupId || this.state.isEditMode}
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
              <Grid item xs={12} md={3}>
                <TextField
                  id="sectionId"
                  name="sectionId"
                  variant="outlined"
                  label="Section"
                  onChange={this.onHandleChange}
                  value={this.state.sectionId}
                  error={!!this.state.sectionIdError}
                  helperText={this.state.sectionIdError}
                  disabled={!this.state.academicSessionId || !this.state.programmeGroupId || !this.state.termId || this.state.isEditMode}
                  required
                  fullWidth
                  select
                >
                  {this.state.sectionMenuItems ? (
                    this.state.sectionMenuItems.map((dt, i) => (
                      <MenuItem
                        key={"sectionMenuItems"+dt.id}
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
              <Grid item xs={12} md={2}>
                <Card>
                  <CardContent style={{height:14}}>
                    <Typography 
                      variant="body2" 
                      color="primary"
                      style={{
                        textAlign:"center", 
                        fontWeight:"bold",
                        color: this.state.isEditMode ? "gray" : "" 
                      }}
                    >
                      No. of Assessment&nbsp;:&nbsp;&nbsp;{this.state.assessmentNo?(this.state.assessmentNo):"_ "}/{this.state.totalNoOfAssessment?this.state.totalNoOfAssessment:"_"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Divider
                  style={{
                    backgroundColor: "rgb(58, 127, 187)",
                    opacity: "0.3",
                  }}
                />
              </Grid>
              <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center" style={{borderLeft: '1px solid rgb(29, 95, 152)', width:"10%"}}>SR#</StyledTableCell>
                      <StyledTableCell align="center">Student</StyledTableCell>
                      <StyledTableCell align="center" style={{borderRight:'1px solid rgb(29, 95, 152)', minWidth:120, width:"20%"}}>Marks</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {this.state.tableData.length > 0 ? (
                    this.state.tableData.map((row, index) => (
                      <TableRowWithData
                        key={"CRDA"+row+index}
                        rowIndex={index}
                        rowData={row}
                        isLoading={this.state.isLoading}
                      />
                    ))
                  ) : 
                  this.state.isLoading ? 
                    <StyledTableRow key={1}>
                      <StyledTableCell component="th" scope="row" colSpan={3}><center><CircularProgress disableShrink/></center></StyledTableCell>
                    </StyledTableRow>
                    :
                    <StyledTableRow key={1}>
                      <StyledTableCell component="th" scope="row" colSpan={3}><center><b>No Data</b></center></StyledTableCell>
                    </StyledTableRow>
                  }
                  </TableBody>
                </Table>
              </TableContainer>
              <Grid item xs={12}>
                <br />
                <br />
              </Grid>
            </Grid>
          </Grid>
        </form>
        <BottomBar
          left_button_text="View"
          left_button_hide={false}
          bottomLeftButtonAction={this.viewReport}
          right_button_text="Save"
          bottomRightButtonAction={this.clickOnFormSubmit}
          loading={this.state.isLoading}
          disableRightButton={this.state.tableData.length<1}
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
export default withStyles(styles)(F203Form);
