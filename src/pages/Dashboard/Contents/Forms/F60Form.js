import React, { Component, Fragment } from "react";
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import {Typography, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TablePagination, Paper, Divider, CircularProgress, Grid,
  List, ListItem, ListItemText, ListItemAvatar, Avatar, Tooltip, IconButton} from "@material-ui/core";
import LoginMenu from "../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import Autocomplete from "@material-ui/lab/Autocomplete";
import BottomBar from "../../../../components/BottomBar/BottomBar";
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import ImageIcon from '@material-ui/icons/Image';
import LibraryAddOutlinedIcon from '@material-ui/icons/LibraryAddOutlined';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import F60FormPopupComponent from "./F60FormPopupComponent";
import PostAddIcon from '@material-ui/icons/PostAdd';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "rgb(29, 95, 152)", //theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: 500,
    border: '1px solid rgb(29, 95, 152)',
    borderRadius:'5px 5px 0px 0px'
  },
  body: {
    fontSize: 14,
    border: '1px solid rgb(29, 95, 152)',
    "&:hover":{
      cursor:"pointer"
    }
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
      "&:hover":{
        backgroundColor:"#bdbdbd"
      }
    },
    '&:nth-of-type(even)': {
      "&:hover":{
        backgroundColor:"#bdbdbd"
      }
    },
  },
}))(TableRow);

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
  overrides: {
    // Style sheet name
    MuiInputLabel:{
      // Name of the rule
      outlined: {
        // Some CSS
        transform: 'translate(40px, 20px) scale(1)',
        '&:focus':{
          borderColor:"green"
        }
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

class R46Reports extends Component {
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
      coursesMenuItems: [],
      courseId: "",
      courseIdError: "",
      sectionsMenuItems: [],
      sectionId: "",
      sectionIdError:"",
      monthId: "",
      tableData: [],
      popupBoxOpen:false,
      page:0,
      rowsPerPage:10
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

  getData = async (sectionId, monthId) => {
    this.setState({isLoading: true});
    let data = new FormData();
    data.append("sectionId", sectionId);
    data.append("monthId", monthId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C59CommonStudentsView`;
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

  handleGenerate = () => {
    //this.getData(this.state.sectionId.id, this.state.monthId);
    window.open(`#/R59ReportsAttendanceSheet/${this.state.sectionId.id+"&"+this.state.monthId}`,"_blank");
  }

  componentDidMount() {
    this.props.setDrawerOpen(false);
    this.getCourses();
  }

  render() {

    const { classes } = this.props;

    const columns = [
      { id: 'name', label: 'Name', minWidth: 170 },
      { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
      {
        id: 'population',
        label: 'Population',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toLocaleString('en-US'),
      },
      {
        id: 'size',
        label: 'Size\u00a0(km\u00b2)',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toLocaleString('en-US'),
      },
      {
        id: 'density',
        label: 'Density',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2),
      },
    ];
    
    function createData(name, code, population, size) {
      const density = population / size;
      return { name, code, population, size, density };
    }
    
    const rows = [
      createData('India', 'IN', 1324171354, 3287263),
      createData('China', 'CN', 1403500365, 9596961),
      createData('Italy', 'IT', 60483973, 301340),
      createData('United States', 'US', 327167434, 9833520),
      createData('Canada', 'CA', 37602103, 9984670),
      createData('Australia', 'AU', 25475400, 7692024),
      createData('Germany', 'DE', 83019200, 357578),
      createData('Ireland', 'IE', 4857000, 70273),
      createData('Mexico', 'MX', 126577691, 1972550),
      createData('Japan', 'JP', 126317000, 377973),
      createData('France', 'FR', 67022000, 640679),
      createData('United Kingdom', 'GB', 67545757, 242495),
      createData('Russia', 'RU', 146793744, 17098246),
      createData('Nigeria', 'NG', 200962417, 923768),
      createData('Brazil', 'BR', 210147125, 8515767),
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
          <Grid 
            container
            justify="space-between"
          >
            <F60FormPopupComponent
              // recordId={this.state.recordId}
              // fileName={this.state.fileName}
              // downloadFile={this.downloadFile}
              handlePopupClose={this.handlePopupClose}
              popupBoxOpen={this.state.popupBoxOpen}
              // popupTitle={this.state.popupTitle}
              // totalMarks={this.state.totalMarks}
              // handleOpenSnackbar={this.handleOpenSnackbar}
              // getData={this.getData}
              // assignmentGradedData={this.state.assignmentGradedData}
            />
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
              variant="h5"
            >
              Discussion Forum
            </Typography>
            <span style={{ 
                float: "right",
                marginBottom: -6
            }}>
              <Tooltip title="Add Topic">
                  <IconButton
                    onClick={this.handlePopupOpen}
                  >
                      <PostAddIcon fontSize="large" color="primary"/>
                  </IconButton>
              </Tooltip> 
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
            <Grid item xs={12} md={12}>
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
                    //InputLabelProps={{ className: classes.outlined}}
                    variant="outlined"
                    label="Topics"
                    placeholder="Search and Select"
                    error={!!this.state.courseIdError}
                    helperText={this.state.courseIdError ? this.state.courseIdError : "" }
                  />
                  </Fragment>
                )}
              />
              </MuiThemeProvider>
              <br/>
            </Grid>
            <Paper className={classes.table}>
              <TableContainer className={classes.tableContainer}>
                <Table stickyHeader size="small" aria-label="sticky table">
                  <TableHead>
                    <StyledTableRow>
                        <StyledTableCell 
                          colSpan={6}
                        >
                          Topics
                        </StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {rows.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row) => {
                      return (
                        <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                          <StyledTableCell colspan={6}>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <ImageIcon />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText primary="Photos" secondary="Jan 9, 2014" />
                            </ListItem>
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </Paper>
          </Grid>
          <br/>
          <br/>  
          <BottomBar
            left_button_text="View"
            left_button_hide={true}
            bottomLeftButtonAction={this.viewReport}
            right_button_text="Genrate"
            bottomRightButtonAction={this.handleGenerate}
            loading={this.state.isLoading}
            isDrawerOpen={this.props.isDrawerOpen}
            disableRightButton={!this.state.monthId}
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
export default withStyles(styles)(R46Reports);
