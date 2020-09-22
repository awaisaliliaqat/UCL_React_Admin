import React, { Component, Fragment } from "react";
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import {Typography, TextField, Divider, CircularProgress, Grid, Tooltip, 
IconButton, Hidden} from "@material-ui/core";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import Autocomplete from "@material-ui/lab/Autocomplete";
import BottomBar from "../../../../components/BottomBar/BottomBar";
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import ImageIcon from '@material-ui/icons/Image';
import LibraryAddOutlinedIcon from '@material-ui/icons/LibraryAddOutlined';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import F60FormPopupComponent from "./F60FormPopupComponent";
import F60FormTableComponent from "./F60FormTableComponent";
import F60FormCardComponent from "./F60FormCardComponent";
import PostAddIcon from '@material-ui/icons/PostAdd';
import FilterIcon from "mdi-material-ui/FilterOutline";
import Collapse from '@material-ui/core/Collapse';

const styles = ({
  table: {
    minWidth: 750,
    width: '100%',
  },
  tableContainer: {
    //maxHeight: 440,
  },
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#174A84',
    }
  },
  overrides: {
    // Style sheet name
    MuiInputLabel:{
      // Name of the rule
      outlined: {
        // Some CSS
        transform: 'translate(40px, 20px) scale(1)'
      },
    },
    MuiAutocomplete: {
      inputRoot: {
        '&&&[class*="MuiOutlinedInput-root"] $input:nth-of-type(1)': {
            paddingLeft: 35,
          },
        },
    },
    MuiSvgIcon: {
      colorPrimary: {
        color: '#174A84',
      },
    },
  },
});

class R60Form extends Component {
  constructor(props) {
    super();
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
      coursesMenuItems: [],
      courseId: "",
      courseIdError: "",
      sectionsMenuItems: [],
      sectionId: "",
      sectionIdError:"",
      monthId: "",
      tableData: [],
      popupBoxOpen:false,
      isOnReplyForm:false,
      topicId:0
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

  handlePopupOpen = () => {
    this.setState({ 
      popupBoxOpen: true
    });
  };

  handlePopupClose = () => {
    this.setState({
      popupBoxOpen: false,
    });
  }

  handleChangePage = (event, newPage) => {
    this.setState({page:newPage});
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({rowsPerPage:+event.target.value});
    this.setState({page:0});
  };

  getCourses = async () => {
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C59CommonSessionOfferedProgrammeCoursesView`;
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
            this.setState({coursesMenuItems: json.DATA || []});
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("getCourses", json);
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

  getSections = async (courseId) => {
    let data = new FormData();
    data.append("courseId", courseId);
    this.setState({isLoading: true});
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C59CommonAcademicsSectionsView`;
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
            this.setState({sectionsMenuItems: json.DATA || []});
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

  getData = async (sectionId) => {
    this.setState({isLoading: true});
    let data = new FormData();
    data.append("sectionId", 35);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C60CommonAcademicsForumsView`;
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

  handleSetCourse = (value) => {    
    this.setState({
      courseId: value, 
      courseIdError: "",
      sectionId:"",
      sectionsMenuItems:[],
      tableData:[]
    });
    if(value) {
      this.getSections(value.id);
    }
  };

  handleSetSection = (value) => {    
    this.setState({
      sectionId: value, 
      sectionError: "",
      tableData:[]
    });
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    let regex = "";
    switch (name) {
        case "monthId":
            //this.setState({tableData:[]});
        break;
    default:
        break;
    }
    this.setState({
      [name]: value,
      [errName]: "",
    });
  };

  isCourseValid = () => {
    let isValid = true;        
    if (!this.state.courseId) {
        this.setState({courseIdError:"Please select course."});
        document.getElementById("courseId").focus();
        isValid = false;
    } else {
        this.setState({courseIdError:""});
    }
    return isValid;
  }

  handleToggleTableFilter = () => {
    this.setState({ showTableFilter: !this.state.showTableFilter });
  };

  handleReplyFormShow = (topicId) => {
    this.setState({
      topicId:topicId,
      isOnReplyForm:true
    });
  }

  handleReplyFormHide = () => {
    this.setState({isOnReplyForm:false});
  }

  componentDidMount() {
    this.props.setDrawerOpen(false);
    //this.getCourses();
    this.getData();
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
          >
            <F60FormPopupComponent
              handlePopupClose={this.handlePopupClose}
              popupBoxOpen={this.state.popupBoxOpen}
              handleOpenSnackbar={this.handleOpenSnackbar}
              getData={this.getData}
            />
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
              variant="h5"
            >
              {this.state.isOnReplyForm &&
                <Tooltip title="Back">
                  <IconButton 
                    onClick={() => this.handleReplyFormHide()}
                    style={{
                      marginLeft: -15,
                      marginTop: -5,
                    }}
                  >
                    <ArrowBackIcon color="primary" />
                  </IconButton>
                </Tooltip>
              }
              Message Center
            </Typography>
            <span style={{ 
                float: "right",
                marginBottom: -6,
                marginTop: -12
            }}>
              {!this.state.isOnReplyForm &&
              <Fragment>
                <Tooltip title="Topic Filter">
                <IconButton
                  style={{ marginLeft: "-10px" }}
                  onClick={this.handleToggleTableFilter}
                >
                  <FilterIcon fontSize="default" color="primary" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add Topic">
                  <IconButton
                    onClick={this.handlePopupOpen}
                  >
                      <PostAddIcon fontSize="large" color="primary"/>
                  </IconButton>
              </Tooltip>
              </Fragment>
              }
            </span>
          </Grid>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
            }}
          />
          <br/>
          <Grid 
            container 
            justify="center"
            alignItems="center"
          >
            <Grid item xs={12}>
              <Hidden smUp={this.state.isOnReplyForm} mdDown={this.state.isOnReplyForm}>
                <Collapse in={this.state.showTableFilter} timeout="auto" unmountOnExit>
                  <MuiThemeProvider theme={theme}>
                    <Autocomplete
                      fullWidth
                      id="courseId"
                      options={this.state.coursesMenuItems}
                      value={this.state.courseId}
                      onChange={(event, value) => this.handleSetCourse(value)}
                      getOptionLabel={(option) => typeof option.label === 'string' ? option.label : ""}
                      renderInput={(params) => (
                        console.log("params", params),
                        <Fragment>
                        <SearchOutlinedIcon color="primary" style={{marginBottom:-45, paddingLeft:12}}/>
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Topics"
                          placeholder="Search and Select"
                          error={!!this.state.courseIdError}
                          helperText={this.state.courseIdError ? this.state.courseIdError : "" }
                        />
                        </Fragment>
                      )}
                      style={{marginTop:"-1em"}}
                    />
                  </MuiThemeProvider>
                  <br/>
                </Collapse>
                <F60FormTableComponent 
                  handleReplyFormShow={this.handleReplyFormShow}
                  rows={this.state.tableData}
                />
              </Hidden>
            </Grid>
            <Grid item xs={12} md={10} lg={8} xl={6}>
              <Hidden smUp={!this.state.isOnReplyForm} mdDown={!this.state.isOnReplyForm}>
                <F60FormCardComponent 
                  topicId={this.state.topicId}
                  isOnReplyForm={this.state.isOnReplyForm}
                  handleOpenSnackbar={this.handleOpenSnackbar}
                  handlePopupClose={this.handlePopupClose}
                />
              </Hidden>
            </Grid>
          </Grid>
          <br/>  
          {/* <BottomBar
            left_button_text="View"
            left_button_hide={true}
            bottomLeftButtonAction={this.viewReport}
            right_button_text="Genrate"
            bottomRightButtonAction={this.handleGenerate}
            loading={this.state.isLoading}
            isDrawerOpen={this.props.isDrawerOpen}
            disableRightButton={!this.state.monthId}
          /> */}
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
export default withStyles(styles)(R60Form);
