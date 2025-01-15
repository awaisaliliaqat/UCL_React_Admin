import React, { Component, Fragment } from "react";
import {Divider, IconButton, Tooltip, CircularProgress, Grid, Button} from "@material-ui/core";
import {Typography, TextField, MenuItem} from "@material-ui/core";
import ExcelIcon from "../../../../assets/Images/excel.png";
import PDFIcon from "../../../../assets/Images/pdf_export_icon.png";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import { format } from "date-fns";
import R80ReportsTableComponent from "./R80ReportsTableComponent";
import FilterIcon from "mdi-material-ui/FilterOutline";
import SearchIcon from "mdi-material-ui/FileSearchOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import Autocomplete from "@material-ui/lab/Autocomplete";

const styles = (theme) => ({
  closeButton: {
      top: theme.spacing(1),
      right: theme.spacing(2),
      zIndex: 1,
      border: '1px solid #b43329',
      borderRadius: 5,
      position: 'fixed',
      padding: 3,
      '@media print': {
          display: 'none'
      }
  },
  bottomSpace: {
      marginBottom: 40,
      '@media print': {
          display: 'none'
      }
  },
  overlay: {
      display: 'flex',
      justifyContent: 'start',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'fixed',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.2)',
      zIndex: 2,
  },
      image: {
        height: 140,
        width: 130,
        border: '1px solid',
        marginLeft: 50,
        textAlign: 'center',
        marginTop: '-25px',
        backgroundSize: 'cover',
        backgroundpPosition: 'center',
        backgroundRepeat: 'no-repeat',
        'WebkitPrintColorAdjust': 'exact',
        'colorAdjust': 'exact',
    },
  overlayContent: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '200px',
      color: 'white'
  },
  headerContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: '-80px'
  },
  titleContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginLeft: 20
  },
  title: {
      fontSize: 40,
      fontWeight: 'bolder',
      fontFamily: 'sans-serif',
      color: '#2f57a5',
      letterSpacing: 1,
  },
  subTitle: {
      fontSize: 20,
      textAlign: 'center',
      marginLeft: '-40px',
      fontWeight: 600,
      color: '#2f57a5',
  },
  tagTitleContainer: {
      display: 'flex',
      marginLeft: '38%',
      justifyContent: 'space-between'
  },
  tagTitle: {
      padding: 6,
      marginBottom: 10,
      width: '100%',
      textAlign: 'center',
      fontSize: 'larger',
      backgroundColor: '#2f57a5',
      color: 'white',
      'WebkitPrintColorAdjust': 'exact',
      'colorAdjust': 'exact',
  },
  image: {
      height: 140,
      width: 130,
      border: '1px solid',
      marginLeft: 50,
      textAlign: 'center',
      marginTop: '-25px',
      backgroundSize: 'cover',
      backgroundpPosition: 'center',
      backgroundRepeat: 'no-repeat',
      'WebkitPrintColorAdjust': 'exact',
      'colorAdjust': 'exact',
  },
  flexColumn: {
      display: 'flex',
      flexDirection: 'column'
  },
  valuesContainer: {
      backgroundColor: 'rgb(47, 87, 165)',
      color: 'white',
      'WebkitPrintColorAdjust': 'exact',
      'colorAdjust': 'exact',
      padding: 6,
      marginTop: 10,
      marginBottom: 10,
  },
  tagValue: {
      border: '1px solid',
      paddingLeft: 15,
      paddingBottom: 7,
      paddingTop: 7,
      paddingRight: 15
  },
  value: {
      border: '1px solid',
      padding: 6,
      marginTop: 10,
      marginBottom: 10,
      marginLeft: 15,
      width: '28%',
      textAlign: 'Left',
      wordBreak: 'break-all',
  },
  fieldValuesContainer: {
      marginLeft: '3%',
      display: 'flex',
      alignItems: 'flex-start',
  }
});

class R80Reports extends Component {
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
      tableData: [],
     
      programmeGroupId: "",
      programmeGroupIdError: "",
      programmeGroupsMenuItems: [],
      programmeId: "",
      programmeIdError: "",
      programmeMenuItems: [],
      programId:"",
      programIdError:"",
      totalCourseStudent:"",
      totalGroupStudent:"",
      totalProgrammeStudent:"",
      totalSchoolStudent:"",
      coursesMenuItems: [],
      courseId: "",
      courseIdError: "",
      totalStudents:[],
      academicSessionMenuItems: [],
      academicSessionId: "",
      academicSessionIdError: "",
      pathwayMenuItems: [],
      pathwayId: "",
      pathwayIdError: "",
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

  

  loadProgrammeGroups = async (AcademicSessionId) => {
    this.setState({ isLoading: true });
    let data = new FormData();
    data.append("academicsSessionId", AcademicSessionId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C80CommonAcademicsSessionsOfferedProgrammesGroupView`;
   
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
            this.setState({programmeGroupsMenuItems: json.DATA || []});
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("getSections", json);
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
  loadAcademicSessions = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C80CommonAcademicSessionsView`;
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
            }
            this.setState({ academicSessionMenuItems: array });
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          this.loadProgrammeGroups(this.state.academicSessionId);
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

  getProgrammes = async (programmeGroupId) => {
    this.setState({isLoading: true});
    let data = new FormData();
    data.append("programmeGroupId", programmeGroupId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C80CommonProgrammesView`;
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
            this.setState({programmeMenuItems: json.DATA || []});
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("getCourse", json);
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

  getCourse = async (programmeGroupId) => {
    this.setState({isLoading: true});
    let data = new FormData();
    data.append("programmeGroupId", programmeGroupId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C66CommonProgrammeCoursesView`;
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
            this.setState({coursesMenuItems: json.DATA || []});
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("getCourse", json);
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

  loadPathway = async () => {
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C80CommonUolEnrollmentPathwayView`;
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
            this.setState({pathwayMenuItems: json.DATA || []});
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadPathway", json);
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

  getData = async () => {
    this.setState({isLoading: true});
    let data = new FormData();
    
    data.append("programmeId", this.state.programmeId);
    data.append("academicSessionId", this.state.academicSessionId);
    data.append("pathwayId", this.state.pathwayId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C80CommonStudentsView`;
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
            this.setState({tableData: json.DATA || []});

            for (var i = 0; i < json.DATA.length; i++) {
              // const fileurl = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonImageView?fileName=${encodeURIComponent(json.DATA[i].fileName)}`;
   
              json.DATA[i].photograph = (

                
                <div style={{height: 140,
                  width: 130,
                  border: '1px solid',
                  marginLeft: 50,
                  textAlign: 'center',
                  
                  backgroundSize: 'cover',
                  backgroundpPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  'WebkitPrintColorAdjust': 'exact',
                  'colorAdjust': 'exact',
                  backgroundImage: `url(${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonImageView?fileName=${json.DATA[i].fileName})`,

                }}>

                </div>
                // <Fragment >
                //   <img  style={{height:100}} src={fileurl}></img>
                // </Fragment>
              );
              
            }
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

  downloadPDFData = async () => {
    if( !this.isSchoolValid() ) {return;}
      if (this.state.isDownloadPdf === false) {
          this.setState({isDownloadPdf: true})
          const url = "";
          //`${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C66CommonStudentsPdfDownload?academicSessionId=${this.state.academicSessionId}&schoolId=${this.state.schoolId}&programmeGroupId=${this.state.programmeGroupId}&courseId=${this.state.courseId}&pathwayId=${this.state.pathwayId}`;
        //const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C02AdmissionsProspectApplication${type}ApplicationsExcelDownload?applicationId=${this.state.applicationId}&genderId=${this.state.genderId}&degreeId=${this.state.degreeId}&studentName=${this.state.studentName}${eventDataQuery}`;
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
                    if(json){
                      var csvURL = window.URL.createObjectURL(json);
                      var tempLink = document.createElement("a");
                      tempLink.setAttribute("download", `Students_List.xlsx`);
                      tempLink.href = csvURL;
                      tempLink.click();
                      console.log("downloadPDFData:", json);
                    }
                  },
                  error => {
                      if (error.status === 401) {
                          this.setState({
                              isLoginMenu: true,
                              isReload: false
                          })
                      } else {
                        this.handleOpenSnackbar("Failed to download, Please try again later.","error");
                        //alert('Failed to fetch, Please try again later.');
                        console.log(error);
                      }
                  });
          this.setState({
            isDownloadPdf: false
          })
      }
  }

  handleSetUserId = (value) => {
    
    this.setState({
      courseId: value,
      courseIdError: "",
      tableData:[]
    });

    console.log("value",value);
    if(value!=null && value!="undefined"){
     
      this.setState({userIds:value.id});
    // }
    }
    
   
  };


  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    let regex = "";
    switch (name) {
      case "academicSessionId":
        
        this.loadProgrammeGroups(value);
        break;
        case "programmeGroupId":
            this.setState({
              programmeGroupId: "",
              tableData: [],
              programmeMenuItems:[],
              programmeId:""
            });
            this.getProgrammes(value);
            
        break;
        case "programmeId":
            this.setState({
              tableData: [],
            });
            
        break;
        
        case "pathwayId":
          this.setState({[name]: value});
          console.log("pathway", value);
        break;
    default:
        break;
    }
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  // isSchoolValid = () => {
  //   let isValid = true;        
  //   if (!this.state.schoolId) {
  //       this.setState({schoolIdError:"Please select school."});
  //       document.getElementById("schoolId").focus();
  //       isValid = false;
  //   } else {
  //       this.setState({schoolIdError:""});
  //   }
  //   return isValid;
  // }

  isSectionValid = () => {
    let isValid = true;        
    if (!this.state.programmeGroupId) {
        this.setState({programmeGroupIdError:"Please select programme group."});
        document.getElementById("programmeGroupId").focus();
        isValid = false;
    } else {
        this.setState({programmeGroupIdError:""});
    }
    return isValid;
  }

  isAssignmentValid = () => {
    let isValid = true;        
    if (!this.state.programId) {
        this.setState({programIdError:"Please select program."});
        document.getElementById("programId").focus();
        isValid = false;
    } else {
        this.setState({programIdError:""});
    }
    return isValid;
}

  handleGetData = () => {
   
    this.getData();
  }
  
  handleToggleTableFilter = () => {
    this.setState({ showTableFilter: !this.state.showTableFilter });
  };

  handleToggleSearchBar = () => {
    this.setState({ showSearchBar: !this.state.showSearchBar });
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    //this.getSchools();
    this.loadAcademicSessions();
    this.loadPathway();
  }

  render() {
    const { classes } = this.props;

    const columns = [
      { name: "SRNo", title: "SR#" },
      { name: "nucluesId", title: "NucleusID" },
      { name: "studentName", title: "Student\xa0Name" },
      { name: "pathway", title: "Pathway" },
      { name: "photograph", title: "Photograph" },
      // { name: "schoolLabel", title: "School" },
      // { name: "programmeGroupLabel", title: "Program Group" },
      //{ name: "dateOfAdmission", title: "Date of Admission" },
      // { name: "statusLabel", title: "Status" }
    ];

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
              {/* 
              <Tooltip title="Back">
                <IconButton onClick={() => window.history.back()}>
                  <ArrowBackIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip> 
              */}
              Students List
              <br/>
            </Typography>
            
            <div style={{ float: "right" }}>
              {/* 
              <Tooltip title="Search Bar">
                  <IconButton
                      onClick={this.handleToggleSearchBar}
                  >
                      <FilterIcon fontSize="default" color="primary"/>
                  </IconButton>
              </Tooltip> 
              */}
              
              <Tooltip title="Table Filter">
                <IconButton
                  style={{ marginLeft: "-10px" }}
                  onClick={this.handleToggleTableFilter}
                >
                  <FilterIcon fontSize="default" color="primary" />
                </IconButton>
              </Tooltip>
              {this.state.programmeGroupId ?
              <Tooltip title="Export PDF" >
                {this.state.isDownloadPdf ?

                  <CircularProgress 
                    size={14}
                    style={{cursor: `${this.state.isDownloadPdf ? 'wait' : 'pointer'}`}}
                  />
                  :
                  <img 
                    alt="" 
                    src={ExcelIcon} 
                    onClick={() => this.downloadPDFData()} 
                    disabled="false"
                    style = {{
                      height: 22, 
                      width: 22,
                      marginBottom: -7,
                      cursor: `${this.state.isDownloadPdf ? 'wait' : 'pointer'}`,
                    }}
                  />
                }
              </Tooltip> 
              :""
            }
            </div>
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
            justifyContent="left"
            alignItems="left"
            spacing={2}
          >
            <Grid item xs={12} md={2}>
              <TextField
                id="academicSessionId"
                name="academicSessionId"
                variant="outlined"
                label="Academic Session"
                fullWidth
                select
                onChange={this.onHandleChange}
                value={this.state.academicSessionId}
                error={!!this.state.academicSessionIdError}
                helperText={this.state.academicSessionIdError ? this.state.academicSessionIdError : " "}
                // disabled={!this.state.schoolId}
              >
                {this.state.academicSessionMenuItems && !this.state.isLoading ? 
                  this.state.academicSessionMenuItems.map((dt, i) => (
                    <MenuItem
                      key={"academicSessionMenuItems"+dt.ID}
                      value={dt.ID}
                    >
                      {dt.Label}
                    </MenuItem>
                  ))
                :
                  <Grid 
                    container 
                    justifyContent="center"
                  >
                    <CircularProgress />
                  </Grid>
                }
              </TextField>
            </Grid>
          
            <Grid item xs={12} md={2}>
              <TextField
                id="programmeGroupId"
                name="programmeGroupId"
                variant="outlined"
                label="Program Group"
                fullWidth
                select
                onChange={this.onHandleChange}
                value={this.state.programmeGroupId}
                error={!!this.state.programmeGroupIdError}
                helperText={this.state.programmeGroupIdError ? this.state.programmeGroupIdError : " "}
                disabled={!this.state.academicSessionId}
              >
                {this.state.programmeGroupsMenuItems && !this.state.isLoading ? 
                  this.state.programmeGroupsMenuItems.map((dt, i) => (
                    <MenuItem
                      key={"programmeGroupsMenuItems"+dt.Id}
                      value={dt.Id}
                    >
                      {dt.Label}
                    </MenuItem>
                  ))
                :
                  <Grid 
                    container 
                    justifyContent="center"
                  >
                    <CircularProgress />
                  </Grid>
                }
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                id="programmeId"
                name="programmeId"
                variant="outlined"
                label="Programme "
                fullWidth
                select
                onChange={this.onHandleChange}
                value={this.state.programmeId}
                error={!!this.state.programmeIdError}
                helperText={this.state.programmeIdError ? this.state.programmeIdError : " "}
                disabled={!this.state.programmeGroupId}
              >
                {this.state.programmeMenuItems && !this.state.isLoading ? 
                  this.state.programmeMenuItems.map((dt, i) => (
                    <MenuItem
                      key={"programmeMenuItems"+dt.ID}
                      value={dt.ID}
                    >
                      {dt.Label}
                    </MenuItem>
                  ))
                :
                  <Grid 
                    container 
                    justifyContent="center"
                  >
                    <CircularProgress />
                  </Grid>
                }
              </TextField>
            </Grid>

            <Grid item xs={12} md={2}>
                <TextField
                  id="pathwayId"
                  name="pathwayId"
                  variant="outlined"
                  label="Pathway"
                  onChange={this.onHandleChange}
                  value={this.state.pathwayId}
                  disabled={!this.state.academicSessionId}
                  error={!!this.state.pathwayIdError}
                  helperText={this.state.pathwayIdError ? this.state.pathwayIdError : " "}
                  fullWidth
                  select
                >
                  {this.state.pathwayMenuItems && !this.state.isLoading ? 
                    this.state.pathwayMenuItems.map((dt, i) => (
                      <MenuItem
                        key={"pathwayMenuItems"+dt.id}
                        value={dt.id}
                      >
                        {dt.label}
                      </MenuItem>
                    ))
                  :
                    <Grid 
                      container 
                      justifyContent="center">
                        <CircularProgress />
                      </Grid>
                  }
                </TextField>
              </Grid>
              <Grid item xs={12} md={1}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={this.state.isLoading ||(!this.state.programmeGroupId)}
                  onClick={() => this.handleGetData()}
                  style={{width:"100%", height:54, marginBottom:24}}
                > 
                  {this.state.isLoading ? 
                      <CircularProgress style={{color:'white'}} size={36}/>
                      : 
                      "Search"
                  }
                </Button>
              </Grid>
              {/* <Grid item xs={12} md={3}>
                <TextField
                  id="courseId"
                  name="courseId"
                  variant="outlined"
                  label="Course"
                  onChange={this.onHandleChange}
                  value={this.state.courseId}
                  error={!!this.state.courseIdError}
                  helperText={this.state.courseIdError ? this.state.courseIdError : " "}
                  fullWidth
                  select
                >
                  {this.state.coursesMenuItems && !this.state.isLoading ? 
                    this.state.coursesMenuItems.map((dt, i) => (
                      <MenuItem
                        key={"coursesMenuItems"+dt.id}
                        value={dt.id}
                      >
                        {dt.label}
                      </MenuItem>
                    ))
                  :
                    <Grid 
                      container 
                      justifyContent="center">
                        <CircularProgress />
                      </Grid>
                  }
                </TextField>
              </Grid> */}

              
                           
             
           
           
          </Grid>
          <Grid
            container 
            justifyContent="left"
            alignItems="left"
            spacing={2}
          >
           
             
          </Grid>
          {this.state.academicSessionId? 
              <Typography
                style={{
                   color: "#1d5f98",
                   fontWeight: 600,
                   textTransform: "capitalize",
                   textAlign: "left"
                       }}
                   variant="subtitle1"
               >
                 {this.state.totalSchoolStudent}
               </Typography>
               :
               ""
          }
          {this.state.totalGroupStudent!="Total Students OF 0"? 
              <Typography
                style={{
                   color: "#1d5f98",
                   fontWeight: 600,
                   textTransform: "capitalize",
                   textAlign: "left"
                       }}
                   variant="subtitle1"
               >
                 {this.state.totalGroupStudent}
               </Typography>
               :
               ""
          }
          {this.state.totalProgrammeStudent!="Total Students OF 0"? 
              <Typography
                style={{
                   color: "#1d5f98",
                   fontWeight: 600,
                   textTransform: "capitalize",
                   textAlign: "left"
                       }}
                   variant="subtitle1"
               >
                 {this.state.totalProgrammeStudent}
               </Typography>
               :
               ""
          }
          {this.state.totalCourseStudent!="Total Students OF 0"? 
              <Typography
                style={{
                   color: "#1d5f98",
                   fontWeight: 600,
                   textTransform: "capitalize",
                   textAlign: "left"
                       }}
                   variant="subtitle1"
               >
                 {this.state.totalCourseStudent}
               </Typography>
               :
               ""
          }
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
            }}
          />
          
          {this.state.tableData && !this.state.isLoading ? (
            <R80ReportsTableComponent
              data={this.state.tableData}
              columns={columns}
              showFilter={this.state.showTableFilter}
            />
          ) : (
            <Grid 
              container 
              justifyContent="center"
            >
              <Grid item xs={12} style={{textAlign:"center"}}>
                <br/>
                <CircularProgress disableShrink />
              </Grid>
            </Grid>
          )}
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
export default R80Reports;
