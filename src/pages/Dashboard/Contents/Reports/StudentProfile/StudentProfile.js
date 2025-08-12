import React, { Component, Fragment } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import FilterIcon from "mdi-material-ui/FilterOutline";
import BallotOutlinedIcon from "@material-ui/icons/BallotOutlined";
import ViewColumnIcon from "@material-ui/icons/ViewColumn"; // ← NEW
import StudentTableProfile from "./StudentTableProfile";
import ExcelIcon from "../../../../../assets/Images/excel.png";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import StudentProfileFilter from "./Chunks/StudentProfileFilter";
import FileRepositoryPopup from "./Chunks/FileRepositoryPopup";

const styles = (theme) => ({
  root: {
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  divider: {
    backgroundColor: "rgb(58, 127, 187)",
    opacity: "0.3",
    width: "100%",
  },
});

class StudentProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isFileDownloading: false,
      showTableFilter: false,
      admissionData: [],
      isLoginMenu: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      totalStudents: 0,
      isFileRepositoryOpen: false,
      selectedStudentData: {},

      // filters
      studentId: "",
      studentName: "",
      programmeId: "",
      programmeGroupId: "",
      academicSessionId: "",

      academicSessionMenuItems: [],
      programmeGroupsMenuItems: [],
      programmeIdMenuItems: [],
    };
    this.tableRef = React.createRef();

    // memoized values holder
    this._filterValues = null;
    this._filterValuesSnapshot = null;
  }

  // ---------- helpers to memoize the `values` object ----------
  buildFilterValues = () => ({
    studentId: this.state.studentId,
    studentName: this.state.studentName,
    programmeId: this.state.programmeId,
    programmeGroupId: this.state.programmeGroupId,
    academicSessionId: this.state.academicSessionId,
    academicSessionMenuItems: this.state.academicSessionMenuItems,
    programmeGroupsMenuItems: this.state.programmeGroupsMenuItems,
    programmeIdMenuItems: this.state.programmeIdMenuItems,
    isLoading: this.state.isLoading,
  });

  getMemoizedFilterValues = () => {
    const next = this.buildFilterValues();
    // shallow compare only the fields we pass down
    const prev = this._filterValuesSnapshot;
    let changed = false;

    if (!prev) {
      changed = true;
    } else {
      for (const k in next) {
        if (next[k] !== prev[k]) {
          changed = true;
          break;
        }
      }
    }

    if (changed) {
      this._filterValues = next;
      this._filterValuesSnapshot = next;
    }
    return this._filterValues;
  };
  // -----------------------------------------------------------

  handleOpenFileRepository = (data) => {
    this.setState({
      selectedStudentData: data,
      isFileRepositoryOpen: true,
    });
  };

  handleCloseFileRepository = () => {
    this.setState({
      isFileRepositoryOpen: false,
      selectedStudentData: {},
    });
  };

  componentDidMount() {
    this.loadAcademicSessions();
    this.getProgrammeGroups();
    this.getData();
  }

  handleOpenSnackbar = (msg, severity) => {
    this.setState({
      isOpenSnackbar: true,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };

  handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    this.setState({ isOpenSnackbar: false });
  };

  handleToggleTableFilter = () => {
    this.setState((prev) => ({ showTableFilter: !prev.showTableFilter }));
  };

  handleDownloadExcel = async () => {
    this.setState({ isFileDownloading: true });
    const api = this.tableRef.current;
    if (api && typeof api.exportToExcel === "function") {
      await api.exportToExcel();
    }
    this.setState({ isFileDownloading: false });
  };

  handleOpenColumnChooser = (e) => {
    const api = this.tableRef.current;
    if (api && typeof api.openColumnChooser === "function") {
      api.openColumnChooser(e.currentTarget);
    }
  };

  // ---------- moved inline handlers to class fields (stable identities) ----------
  onHandleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onHandleChangeAS = (e) => {
    this.setState({ academicSessionId: e.target.value }, this.getProgrammeGroups);
  };

  onHandleChangePG = (e) => {
    this.setState({ programmeGroupId: e.target.value }, this.loadProgrammes);
  };

  onHandleChangeProgramme = (e) => {
    this.setState({ programmeId: e.target.value });
  };

  onClearFilters = () => {
    this.setState(
      {
        studentId: "",
        studentName: "",
        programmeId: "",
        programmeGroupId: "",
        academicSessionId: "",
      },
      () => {
        this.getData();
        this.getProgrammeGroups();
      }
    );
  };
  // --------------------------------------------------------------------------------

  // ---------------------- APIs ----------------------
  loadAcademicSessions = async (sessionId) => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C48CommonAcademicSessionsView`;
    await fetch(url, {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
      }),
    })
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((json) => {
        if (json.CODE === 1) {
          let array = json.DATA || [];
          let active = array.find((obj) => obj.isActive === 1);
          this.setState({
            academicSessionMenuItems: array,
            academicSessionId: sessionId || (active && active.ID),
          });
        } else {
          this.handleOpenSnackbar(
            <span>
              {json.SYSTEM_MESSAGE}
              <br />
              {json.USER_MESSAGE}
            </span>,
            "error"
          );
        }
      })
      .catch((error) => {
        if (error.status === 401) {
          this.setState({ isLoginMenu: true, isReload: false });
        } else {
          this.handleOpenSnackbar("Failed to fetch! Please try Again later.", "error");
          console.error(error);
        }
      });
    this.setState({ isLoading: false });
  };

  getProgrammeGroups = async () => {
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C48CommonProgrammeGroupsView?academicSessionId=${this.state.academicSessionId || 0}`;
    await fetch(url, {
      method: "GET",
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
      }),
    })
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((json) => {
        if (json.CODE === 1) {
          this.setState({ programmeGroupsMenuItems: json.DATA || [] });
        } else {
          this.handleOpenSnackbar(
            <span>
              {json.SYSTEM_MESSAGE}
              <br />
              {json.USER_MESSAGE}
            </span>,
            "error"
          );
        }
      })
      .catch((error) => {
        if (error.status === 401) {
          this.setState({ isLoginMenu: true, isReload: true });
        } else {
          this.handleOpenSnackbar("Failed to load Programme Groups! Try again later.", "error");
        }
      });
  };

  loadProgrammes = async (programGroup) => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C48CommonProgrammesView?programmeGroupId=${this.state.programmeGroupId || programGroup || 0}`;
    await fetch(url, {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
      }),
    })
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((json) => {
        if (json.CODE === 1) {
          this.setState({ programmeIdMenuItems: json.DATA });
        } else {
          this.handleOpenSnackbar(
            <span>
              {json.SYSTEM_MESSAGE}
              <br />
              {json.USER_MESSAGE}
            </span>,
            "error"
          );
        }
      })
      .catch((error) => {
        if (error.status === 401) {
          this.setState({ isLoginMenu: true, isReload: false });
        } else {
          this.handleOpenSnackbar("Failed to fetch programmes! Try again later.", "error");
        }
      });
    this.setState({ isLoading: false });
  };

  getData = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C48CommonStudentsView?studentId=${this.state.studentId || 0}&studentName=${this.state.studentName || ""}&programmeGroupId=${this.state.programmeGroupId || 0}&academicSessionId=${this.state.academicSessionId || 0}&programmeId=${this.state.programmeId || 0}`;
    await fetch(url, {
      method: "GET",
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
      }),
    })
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((json) => {
        if (json.CODE === 1) {
          this.setState({
            admissionData: json.DATA || [],
            totalStudents: (json.DATA || []).length,
          });
        } else {
          this.handleOpenSnackbar(`${json.SYSTEM_MESSAGE}\n${json.USER_MESSAGE}`, "error");
        }
      })
      .catch((error) => {
        if (error.status === 401) {
          this.setState({ isLoginMenu: true });
        } else {
          this.handleOpenSnackbar("Failed to fetch students! Try again later.", "error");
        }
      });
    this.setState({ isLoading: false });
  };

  // ---------------------- RENDER ----------------------
  render() {
    const { classes } = this.props;

    const columns = [
       { name: "action", title: "Action",
        getCellValue: (row) => ({
          studentId: row.studentId,
          fullStudentData: row,
          viewProfileUrl: `#/view-student-profile/${row.studentId}`,
        }),
      },
      { name: "studentId", title: "Nucleus Id"},
      { name: "name", title: "Name",
        getCellValue: (row) => {
          const middleName = row.middleName ? ` ${row.middleName}` : "";
          return `${row.firstName || ""}${middleName} ${row.lastName || ""}`.trim();
        },
      },
      { name: "admissionSessionLabel", title: "Admission Session"},
      { name: "currentSessionLabel", title: "Current Session"},
      { name: "displayName", title: "Name as per CNIC/Passport"},
      { name: "dateOfBirth", title: "Date of Birth"},
      { name: "genderLabel", title: "Gender"},
      { name: "nationalityIdLabel", title: "Nationality"},
      { name: "identityNo", title: "CNIC/Passport"},
      { name: "mobileNo", title: "Mobile Number"},
      { name: "email", title: "Email"},
      { name: "bloodGroupLabel", title: "Blood Group"},
      { name: "maritalStatusLabel", title: "Marital Status"},
      { name: "medicalCondition", title: "Medical Condition", getCellValue: (row) => (row.isAnyMedicalCondition === 1 ? "Yes" : "No") },
      { name: "medicalConditionDetails", title: "Medical Condition Details"},
      { name: "emergencyContactPersonName", title: "Emergency Contact Name"},
      { name: "emergencyContactRelationshipLabel", title: "Emergency Contact Relationship"},
      { name: "emergencyContactNumber", title: "Emergency Contact Number"},
      { name: "degreeLabel", title: "Degree Programme"},
    ];

    return (
      <Fragment>
        <LoginMenu
          reload={this.state.isReload}
          open={this.state.isLoginMenu}
          handleClose={() => this.setState({ isLoginMenu: false })}
        />
        <Grid container spacing={2} className={classes.root}>
          <Grid item xs={12}>
            <Typography style={{ color: "#1d5f98", fontWeight: 600 }} variant="h5">
              Student Profile
              <Box component="span" style={{ float: "right" }}>
                {/* Columns chooser (opens checkbox list in table) */}
                <Tooltip title="Columns">
                  <IconButton onClick={this.handleOpenColumnChooser}>
                    <ViewColumnIcon color="primary" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Download Excel">
                  <IconButton onClick={this.handleDownloadExcel} disabled={this.state.isFileDownloading}>
                    {this.state.isFileDownloading ? (
                      <CircularProgress size={18} />
                    ) : (
                      <img alt="" src={ExcelIcon} style={{ height: 24 }} />
                    )}
                  </IconButton>
                </Tooltip>

                <Tooltip title="Table Filter">
                  <IconButton onClick={this.handleToggleTableFilter}>
                    <FilterIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Typography>
            <Divider className={classes.divider} />
          </Grid>

          <Grid item xs={12}>
            <StudentProfileFilter
              values={this.getMemoizedFilterValues()}
              onHandleChange={this.onHandleChange}
              onHandleChangeAS={this.onHandleChangeAS}
              onHandleChangePG={this.onHandleChangePG}
              onHandleChangeProgramme={this.onHandleChangeProgramme}
              getDataByStatus={this.getData}
              onClearFilters={this.onClearFilters}
            />
          </Grid>

          <Grid item xs={12}>
            <StudentTableProfile
              ref={this.tableRef}
              rows={this.state.admissionData}
              columns={columns}
              showFilter={this.state.showTableFilter}
              isLoading={this.state.isLoading}
              onOpenFileRepository={this.handleOpenFileRepository}
              showTopBar={false} // keep controls out of the table
            />
          </Grid>
        </Grid>

        <CustomizedSnackbar
          isOpen={this.state.isOpenSnackbar}
          isLoading={this.state.isLoading}
          message={this.state.snackbarMessage}
          severity={this.state.snackbarSeverity}
          handleCloseSnackbar={this.handleCloseSnackbar}
        />

        {this.state.isFileRepositoryOpen && (
          <FileRepositoryPopup
            open={this.state.isFileRepositoryOpen}
            row={this.state.selectedStudentData}
            handleClose={this.handleCloseFileRepository}
          />
        )}
      </Fragment>
    );
  }
}

export default withStyles(styles)(StudentProfile);
