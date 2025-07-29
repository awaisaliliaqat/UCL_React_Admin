import React, { Component, Fragment } from "react";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import StudentProfileFilter from "./Chunks/StudentProfileFilter";
import TablePanel from "../../../../../components/ControlledTable/RerenderTable/TablePanel";
import Button from "@material-ui/core/Button";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import { Box } from "@material-ui/core";
import FileRepositoryPopup from "./Chunks/FileRepositoryPopup";

class EditStudentInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      admissionData: [],
      studentId: "",
      studentName: "",
      isLoginMenu: false,
      isReload: false,
      eventDate: null,
      totalStudents: [],
      academicSessionMenuItems: [],
      academicSessionId: "",
      academicSessionIdError: "",
      programmeGroupsMenuItems: [],
      programmeGroupId: "",
      programmeGroupIdError: "",
      programmeIdMenuItems: [],
      programmeId: "",
      programmeIdError: "",
      isFileRepositoryOpen : false,
      selectedStudentData: {}
    };
  }

  handleOpenFileRepository = (data) => {
    this.setState({
      selectedStudentData: data,
      isFileRepositoryOpen: true
    });
  }

  handleCloseFileRepository = () => {
    this.setState({
      isFileRepositoryOpen: false,
      selectedStudentData: {},
    });
  }

  componentDidMount() {
    this.onLoadAllData();
  }

  onLoadAllData = async () => {
    const query = new URLSearchParams(this.props.location.search);
    const studentId = query.get("studentId") || "";
    const academicSessionId = query.get("academicSessionId") || "";
    //this.getData();
    await this.loadAcademicSessions(academicSessionId);
    this.getProgrammeGroups();
    this.loadProgrammes(0);

    if (studentId != "") {
      this.setState(
        {
          studentId,
        },
        () => this.getData()
      );
    }
  };

  onClearFilters = () => {
    this.setState({
      studentId: "",
      programmeId: "",
      programmeGroupId: "",
      academicSessionId: "",
    });
  };
  handleOpenSnackbar = (msg, severity) => {
    this.setState({
      isOpenSnackbar: true,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };
  onHandleChangeAS = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
    console.log(">>>>>", value);
    this.state.academicSessionId = value;
    this.state.programmeGroupId = "";
    this.state.programmeId = "";
  };
  onHandleChangePG = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
    this.state.programmeGroupId = value;
    this.state.programmeId = "";
    this.loadProgrammes(this.state.programmeGroupId);
  };
  onHandleChangeProgramme = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
    this.state.programmeId = value;
  };

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
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then(
        (json) => {
          if (json.CODE === 1) {
            let array = json.DATA || [];
            let res2 = array.find((obj) => obj.ID == sessionId);
            if (sessionId && res2) {
              this.setState({ academicSessionId: sessionId });
            } else {
              let res = array.find((obj) => obj.isActive === 1);
              if (res) {
                this.setState({ academicSessionId: res.ID });
              }
            }
            this.setState({ academicSessionMenuItems: array });
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
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar(
              "Failed to fetch ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  getProgrammeGroups = async () => {
    const url = `${process.env.REACT_APP_API_DOMAIN}/${
      process.env.REACT_APP_SUB_API_NAME
    }/academics/C48CommonProgrammeGroupsView?academicSessionId=${
      this.state.academicSessionId || 0
    }`;
    await fetch(url, {
      method: "GET",
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
          console.log("getProgrammeGroups", json);
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            this.handleOpenSnackbar(
              "Failed to load Students Data ! Please try Again later.",
              "error"
            );
            console.log(error);
          }
        }
      );
  };

  loadProgrammes = async (programGroup) => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${
      process.env.REACT_APP_SUB_API_NAME
    }/academics/C48CommonProgrammesView?programmeGroupId=${
      this.state.programmeGroupId || 0 || programGroup
    }`;
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
          console.log("loadProgrammes", json);
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar(
              "Failed to fetch ! Please try Again later.",
              "error"
            );
          }
        }
      );
    this.setState({ isLoading: false });
  };

  getData = async () => {
    this.setState({
      isLoading: true,
    });
    // const reload = this.state.studentId === "";
    const url = `${process.env.REACT_APP_API_DOMAIN}/${
      process.env.REACT_APP_SUB_API_NAME
    }/academics/C48CommonStudentsView?studentId=${
      this.state.studentId || 0
    }&studentName=${this.state.studentName || ""}&programmeGroupId=${
      this.state.programmeGroupId || 0
    }&academicSessionId=${this.state.academicSessionId || 0}&programmeId=${
      this.state.programmeId || 0
    }`;
    await fetch(url, {
      method: "GET",
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
            this.setState({ admissionData: json.DATA || [] });
            let totalStudents = this.state.admissionData.length;
            this.setState({ totalStudents: totalStudents });
          } else {
            alert(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE);
          }
          console.log(json);
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              // isReload: reload,
            });
          } else {
            alert("Failed to fetch, Please try again later.");
            console.log(error);
          }
        }
      );
    this.setState({
      isLoading: false,
    });
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  render() {
    const columnsSubmitted = [
      {
        name: "Nucleus Id",
        dataIndex: "studentId",
        sortable: false,
        customStyleHeader: { width: "13%", textAlign: "center" },
      },
      {
        name: "Name",
        renderer: (rowData) => {
          return (
            <Fragment>{`${rowData.firstName} ${
              rowData.middleName !== null &&
              rowData.middleName !== "" &&
              rowData.middleName !== false
                ? rowData.middleName
                : ""
            } ${rowData.lastName}`}</Fragment>
          );
        },
        sortable: false,
        customStyleHeader: { width: "15%" },
      },
      {
        name: "Gender",
        dataIndex: "genderLabel",
        sortIndex: "genderLabel",
        sortable: true,
        customStyleHeader: { width: "13%" },
      },
      {
        name: "Degree Programme",
        dataIndex: "degreeLabel",
        sortIndex: "degreeLabel",
        sortable: true,
        customStyleHeader: { width: "20%", textAlign: "center" },
        align: "center",
      },
      {
        name: "Mobile No",
        dataIndex: "mobileNo",
        sortable: false,
        customStyleHeader: { width: "15%" },
      },
      {
        name: "Email",
        dataIndex: "email",
        sortable: false,
        customStyleHeader: { width: "20%" },
      },
      { name: "Action", renderer: (rowData) => {
          console.log(rowData);
          return (
            <Box display="flex" justifyContent="space-between">
              <Button
                style={{ fontSize: 12, textTransform: "capitalize", }}
                variant="outlined"
                onClick={() =>
                  window.open( `#/view-student-profile/${rowData.studentId}`, "_blank" )
                }
              >
                View Profile
              </Button>
              <Button
                style={{ fontSize: 12, textTransform: "capitalize", }}
                variant="outlined"
                onClick={() =>
                  this.handleOpenFileRepository(rowData)
                }
              >
                File Repository
              </Button>
            </Box>
          );
        },
        sortable: false,
        customStyleHeader: { width: "21%" },
      },
    ];

    return (
      <Fragment>
        <LoginMenu
          // reload={this.state.isReload}
          open={this.state.isLoginMenu}
          handleClose={() => this.setState({ isLoginMenu: false })}
        />
        <div style={{ padding: 20, }} >
          <div style={{ display: "flex", justifyContent: "space-between", }} >
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
              variant="h5"
            >
              Student Profile
            </Typography>
            {this.state.totalStudents > 1 ? (
              <Typography
                style={{
                  color: "#1d5f98",
                  fontWeight: 600,
                  textTransform: "capitalize",
                  textAlign: "right",
                }}
                variant="h6"
              >
                Total Students: {this.state.totalStudents}
              </Typography>
            ) : (
              ""
            )}
          </div>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
            }}
          />
          <StudentProfileFilter
            isLoading={this.state.isLoading}
            onClearFilters={this.onClearFilters}
            values={this.state}
            getDataByStatus={() => this.getData()}
            onHandleChange={(e) => this.onHandleChange(e)}
            onHandleChangeAS={(e) => this.onHandleChangeAS(e)}
            onHandleChangePG={(e) => this.onHandleChangePG(e)}
            onHandleChangeProgramme={(e) => this.onHandleChangeProgramme(e)}
          />
          <div
            style={{
              marginTop: 15,
              marginBottom: 15,
              color: "#174A84",
              font: "Bold 16px Lato",
              letterSpacing: "1.8px",
            }}
          ></div>
          <FileRepositoryPopup 
            open={this.state.isFileRepositoryOpen} 
            handleClickOpen={this.handleOpenFileRepository}
            handleClose={this.handleCloseFileRepository}
            row={this.state.selectedStudentData}
          />
          <TablePanel
            isShowIndexColumn
            data={this.state.admissionData}
            isLoading={this.state.isLoading}
            sortingEnabled
            columns={columnsSubmitted}
          />
        </div>
      </Fragment>
    );
  }
}
export default EditStudentInformation;
