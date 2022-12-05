import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import {Typography, TextField, MenuItem, Divider, CircularProgress, Grid} from "@material-ui/core";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import Autocomplete from "@material-ui/lab/Autocomplete";
import BottomBar from "../../../../components/BottomBar/BottomBar";

const styles = {};

class R232Reports extends Component {
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
      academicSessionIdMenuItems: [],
      academicSessionId: "",
      academicSessionLabel: "",
      academicSessionIdError: "",
      sessionTermMenuItems: [],
      sessionTermId: "",
      sessionTermIdError: "",
      sectionIdMenuItems: [],
      sectionId: "",
      programmeGroupIdMenuItems: [],
      programmeGroupId: "",
      programmeGroupLabel: "",
      programmeGroupIdError: "",
      programmeGroupLabel: "",
      offeredCoursesId: "",
      offeredCoursesIdError: "",
      coursesData: [],
      sectionIdError: "",
      studentMenuItems: [],
      studentObj: "",
      studentObjError: ""
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
    this.setState({ isOpenSnackbar: false });
  };

  loadAcademicSession = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C210CommonAcademicSessionsView`;
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
            let data = json.DATA || [];
            let dataLength =  data.length || 0;
            let res = data.find( (option) => option.isActive == 1);
            if(res){
              this.setState({academicSessionLabel:data.Label});
              this.loadProgrammeGroups(res.ID);
              this.loadTerms(res.ID);
              this.setState({academicSessionId:res.ID});
            }
            this.setState({ academicSessionIdMenuItems:data});
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadAcademicSession", json);
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C232CommonAcademicsSessionsOfferedProgrammesGroupView`;
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
          console.log("loadProgrammes", json);
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

  loadTerms = async (academicsSessionId) => {
    this.setState({ isLoading: true });
    let data = new FormData();
    data.append("academicsSessionId", academicsSessionId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C210CommonAcademicsSessionsTermsView`;
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
            this.setState({sessionTermMenuItems: json.DATA || [] });
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

  loadSection = async (academicSessionId,offeredCoursesId) => {
    this.setState({ isLoading: true });
    let data = new FormData();
    data.append("academicsSessionId", academicSessionId);
    data.append("offeredCoursesId", offeredCoursesId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C232CommonAcademicsSectionsView`;
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

        
            this.setState({ sectionIdMenuItems: json.DATA });
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadSection", json);
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

  loadUsers = async (sectionId) => {
    let data = new FormData();
    data.append("academicsSessionId", this.state.academicSessionId);
    data.append("sectionId", sectionId);
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C218CommonStudentsView`;
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
            this.setState({ studentMenuItems: json.DATA });
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("loadUsers", json);
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

  handleSetUserId = (value) => {
    this.setState({
      studentObj: value,
      studentObjError: "",
    });
  }

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    switch (name) {
      case "academicSessionId":
        this.setState({
          sectionIdMenuItems: [],
          sectionId:"",
          termId:"",
          termMenuItems:[],
          programmeGroupIdMenuItems: [],
          programmeGroupId:"",
          sessionTermId:"",
          studentObj: "",
          studentMenuItems:[]
        });
        this.loadProgrammeGroups(value);
        this.loadTerms(value);
       
        break;
      case "programmeGroupId":
        this.setState({
          sectionIdMenuItems: [],
          sectionId:"",
          termId:"",
          termMenuItems:[],
          studentObj: "",
          studentMenuItems:[],
          sessionTermId:"",
          offeredCoursesId: "",
          coursesData: [],
          offeredCoursesIdError: "",
        });  
       
      this.getCoursesData(value);
      case "offeredCoursesId":
        this.setState({
          sectionIdMenuItems: [],
          sectionId:"",
          termId:"",
          termMenuItems:[],
          sessionTermId:"",
          studentObj: "",
          studentMenuItems:[],
         
        });  
       
        this.loadSection(this.state.academicSessionId,value);
      
      case "sectionId":
        this.setState({
          termId:"",
          termMenuItems:[],
          sessionTermId:"",
          studentObj: "",
          studentMenuItems:[]
        });
       
      break;
      default:
    }
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  getCoursesData = async (id, cId = "", sId = "") => {
    this.setState({ isLoading: true })
    const sessionId = sId || this.state.sessionId
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C232CommonAcademicsSessionsOfferedCoursesView?sessionId=${this.state.academicSessionId}&programmeGroupId=${id}`;
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
                        coursesData: json.DATA || [],
                        offeredCoursesId: cId
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

  handleGenerate = () => {
    let academicSessionId = this.state.academicSessionId;
    let sectionId = this.state.sectionId;
    let sessionTermId = this.state.sessionTermId;
    let studentId = this.state.studentObj.id;
    //window.open(`#/R218StudentProgressReport/${academicSessionId+"&"+sectionId+"&"+sessionTermId+"&"+studentId}`,"_blank");
    window.open(`#/R232StudentProgressReport/${academicSessionId+"&"+sectionId+"&"+sessionTermId}`,"_blank");
  };

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.loadAcademicSession();
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
        <div
          style={{
            padding: 20,
          }}
        >
          <Grid 
            container 
            justify="space-between"
            spacing={2}
          >
            <Grid item xs={12}>
              <Typography
                style={{
                  color: "#1d5f98",
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
                variant="h5"
              >
                Students Progress Report Course Wise
              </Typography>
              <Divider
                style={{
                  backgroundColor: "rgb(58, 127, 187)",
                  opacity: "0.3",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="academicSessionId"
                name="academicSessionId"
                variant="outlined"
                label="Academic Session"
                onChange={this.onHandleChange}
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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
                <TextField
                    id="offeredCoursesId"
                    name="offeredCoursesId"
                    label="Offered Courses"
                    required
                    fullWidth
                    variant="outlined"
                    disabled={!this.state.programmeGroupId}
                    onChange={this.onHandleChange}
                    value={this.state.offeredCoursesId}
                    helperText={this.state.offeredCoursesIdError}
                    error={this.state.offeredCoursesIdError}
                    select
                >
                    {this.state.coursesData.map(item => {
                        return (
                            <MenuItem key={item.id} value={item.id}>
                                {item.courseLabel}
                            </MenuItem>
                        )
                    })}
                </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="sectionId"
                name="sectionId"
                variant="outlined"
                label="Section"
                onChange={this.onHandleChange}
                value={this.state.sectionId}
                error={!!this.state.sectionIdError}
                helperText={this.state.sectionIdError}
                disabled={!this.state.offeredCoursesId}
                required
                fullWidth
                select
              >
                {this.state.sectionIdMenuItems ? (
                  this.state.sectionIdMenuItems.map((dt, i) => (
                    <MenuItem
                      key={"sectionIdMenuItems" + dt.ID}
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
            <Grid item xs={12} md={6}>
              <TextField
                id="sessionTermId"
                name="sessionTermId"
                variant="outlined"
                label="Term"
                onChange={this.onHandleChange}
                value={this.state.sessionTermId}
                error={!!this.state.sessionTermIdError}
                helperText={this.state.sessionTermIdError}
                disabled={!this.state.academicSessionId || !this.state.sectionId}
                required
                fullWidth
                select
              >
                {this.state.sessionTermMenuItems.map((dt, i) => (
                  <MenuItem
                    key={"sessionTermMenuItems"+ dt.id}
                    value={dt.id}
                  >
                    {dt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              {/* <Autocomplete
                fullWidth
                id="studentObj"
                options={this.state.studentMenuItems}
                value={this.state.studentObj}
                onChange={(event, value) =>
                  this.handleSetUserId(value)
                }
                disabled={!this.state.sectionId}
                getOptionLabel={(option) =>  typeof option.label === "string" ? option.label : ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Students"
                    placeholder="Search and Select"
                    error={!!this.state.studentObjError}
                    helperText={this.state.studentObjError}
                  />
                )}
              /> */}
            </Grid>
          </Grid>
          <BottomBar
            left_button_text="View"
            left_button_hide={true}
            bottomLeftButtonAction={this.viewReport}
            right_button_text="Genrate"
            bottomRightButtonAction={this.handleGenerate}
            loading={this.state.isLoading}
            isDrawerOpen={this.props.isDrawerOpen}
            disableRightButton={!this.state.sessionTermId}
          />
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

export default withStyles(styles)(R232Reports);