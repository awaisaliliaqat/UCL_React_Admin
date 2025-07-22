import React, { Component, Fragment } from "react";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
// import ExcelIcon from '../../../../assets/Images/excel.png';
import TutionFeeApprovelFilter from "./Chunks/TutionFeeApprovelFilter";
import TablePanel from "../../../../../components/ControlledTable/RerenderTable/TablePanel";
import Button from "@material-ui/core/Button";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import TutionFeeApprovelMenu from "./Chunks/TutionFeeApprovelMenu";

import { format } from "date-fns";
import { color } from "highcharts";

function isEmpty(obj) {
  if (obj == null) return true;

  if (obj.length > 0) return false;
  if (obj.length === 0) return true;

  if (typeof obj !== "object") return true;

  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }

  return true;
}

class R303DueTuitionFee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      applicationStatusId: 1,
      admissionData: [],
      genderData: [],
      degreeData: [],
      documentData: [],
      studentName: "",
      referenceNo: "",
      genderId: 0,
      degreeId: 0,
      applicationId: "",
      isDownloadExcel: false,
      isLoginMenu: false,
      isReload: false,
      isSubmitLoading: false,
      isOpenApprovelMenu: false,
      eventDate: null,
      selectedData: {},
      methodData: [],
      methodId: 0,
      methodIdError: "",
      academicSessionMenuItems: [],
      academicSessionId: 0,
      academicSessionIdError: "",
      academicsDataLoading: false,

      schoolsMenuItems: [],
      schoolId: "",
      schoolIdError: "",
      programmeGroupId: "",
      programmeGroupIdError: "",
      programmeGroupsMenuItems: [],
      programmeId: "",
      programmeIdError: "",
      programmeMenuItems: [],
      programId: "",
      programIdError: "",
      coursesMenuItems: [],

      courseObject: {},
      courseObjectError: "",
      pathwayMenuItems: [],
      pathwayId: "",
      pathwayIdError: "",

      isActiveMenuItems: [
        { id: 1, label: "Active" },
        { id: 0, label: "Inactive" },
      ],
      isActive: 1,
      isActiveError: "",
    };
  }

  componentDidMount() {
    this.getMethodData();
    this.loadAcademicSessions();
    this.getSchools();
    this.loadPathway();
  }

  getGenderData = async () => {
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C02CommonGendersView`;
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
          this.setState({
            genderData: json.DATA,
          });
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            // alert("Failed to fetch, Please try again later.");
            this.handleOpenSnackbar(
              "Failed to fetch, Please try again later.",
              "error"
            );
            console.log(error);
          }
        }
      );
  };

  getMethodData = async () => {
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C303FinanceStudentsLegacyFeePaymentMethods`;
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
          this.setState({
            methodData: json.DATA || [],
          });
          console.log(json.DATA);
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            // alert("Failed to fetch, Please try again later.");
            this.handleOpenSnackbar(
              "Failed to fetch, Please try again later.",
              "error"
            );
            console.log(error);
          }
        }
      );
  };
  loadAcademicSessions = async () => {
    this.setState({ academicsDataLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C303CommonAcademicSessionsView`;
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
            // let arrayLength = array.length;
            let resData = array.filter((obj) => obj.isActive === 1);

            console.log();
            let res = array.find((obj) => obj.isActive === 1);
            if (res) {
              this.setState({ academicSessionId: res.ID }, () =>
                this.getData()
              );
            }
            this.setState({ academicSessionMenuItems: resData });
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
    this.setState({ academicsDataLoading: false });
  };

  onClearFilters = () => {
    const { academicSessionMenuItems = [] } = this.state;

    let res = academicSessionMenuItems.find((obj) => obj.isActive === 1);
    let sessionId = 0;
    if (res) {
      sessionId = res.ID;
    }

    this.setState(
      {
        academicSessionId: sessionId,
        academicSessionIdError: "",
        academicsDataLoading: false,

        schoolId: "",
        schoolIdError: "",

        programmeGroupId: "",
        programmeGroupIdError: "",
        programmeGroupsMenuItems: [],

        programmeId: "",
        programmeIdError: "",
        programmeMenuItems: [],

        programId: "",
        programIdError: "",

        coursesMenuItems: [],
        courseObject: {},
        courseObjectError: "",

        pathwayId: "",
        pathwayIdError: "",

        isActive: 1,
        isActiveError: "",
      },
      () => this.getData()
    );
  };

  handleDateChange = (date) => {
    this.setState({
      eventDate: date,
    });
  };

  downloadExcelData = async () => {
    if (this.state.isDownloadExcel === false) {
      this.setState({
        isDownloadExcel: true,
      });
      const type =
        this.state.applicationStatusId === 2 ? "Submitted" : "Pending";
      const url = `${process.env.REACT_APP_API_DOMAIN}/${
        process.env.REACT_APP_SUB_API_NAME
      }/academics/C02AdmissionsProspectApplication${type}ApplicationsExcelDownload?applicationId=${
        this.state.applicationId
      }&genderId=${this.state.genderId}&degreeId=${
        this.state.degreeId
      }&studentName=${this.state.studentName}&eventDate=${format(
        this.state.eventDate,
        "dd-MMM-yyyy"
      )}`;
      await fetch(url, {
        method: "GET",
        headers: new Headers({
          Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            return res.blob();
          }
          return false;
        })
        .then(
          (json) => {
            if (json) {
              var csvURL = window.URL.createObjectURL(json);
              var tempLink = document.createElement("a");
              tempLink.setAttribute("download", `Applications${type}.xlsx`);
              tempLink.href = csvURL;
              tempLink.click();
              console.log(json);
            }
          },
          (error) => {
            if (error.status === 401) {
              this.setState({
                isLoginMenu: true,
                isReload: false,
              });
            } else {
              // alert("Failed to fetch, Please try again later.");
              this.handleOpenSnackbar(
                "Failed to fetch, Please try again later.",
                "error"
              );
              console.log(error);
            }
          }
        );
      this.setState({
        isDownloadExcel: false,
      });
    }
  };
  handleOpenSnackbar = (msg, severity) => {
    this.setState({
      isOpenSnackbar: true,
      snackbarMessage: msg,
      snackbarSeverity: severity,
    });
  };

  getData = async () => {
    this.setState({
      isLoading: true,
    });
    const reload = true;
    let data = new FormData();
    data.append("studentId", this.state.applicationId || 0);
    data.append("academicSessionId", this.state.academicSessionId || 0);
    data.append("schoolId", this.state.schoolId || 0);
    data.append("programmeGroupId", this.state.programmeGroupId || 0);
    data.append("programmeId", this.state.programmeId || 0);
    data.append("courseId", this.state.courseObject.id || 0);
    data.append("pathwayId", this.state.pathwayId || 0);
    data.append("isActive", this.state.isActive);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C303FinanceStudentsLegacyFeeVouchersView`;
    await fetch(url, {
      method: "Post",
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
      }),
      body: data,
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
            this.setState({
              admissionData: json.DATA || [],
            });
          } else {
            // alert(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE);
            this.handleOpenSnackbar(
              `${json.SYSTEM_MESSAGE} + "\n" + ${json.USER_MESSAGE}`,
              "error"
            );
          }
          console.log(json);
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: reload,
            });
          } else {
            // alert("Failed to fetch, Please try again later.");
            this.handleOpenSnackbar(
              "Failed to fetch, Please try again later.",
              "error"
            );
            console.log(error);
          }
        }
      );
    this.setState({
      isLoading: false,
    });
  };

  onDownload = (fileName) => {
    const url = `${process.env.REACT_APP_API_DOMAIN}/${
      process.env.REACT_APP_SUB_API_NAME
    }/common/CommonViewFile?fileName=${encodeURIComponent(fileName)}`;

    fetch(url, {
      method: "GET",
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.blob();
        } else if (res.status === 401) {
          this.setState({
            isLoginMenu: true,
            isReload: false,
          });
          return {};
        } else {
          // alert("Operation Failed, Please try again later.");
          this.handleOpenSnackbar(
            "Failed to fetch, Please try again later.",
            "error"
          );
          return {};
        }
      })
      .then((result) => {
        var csvURL = window.URL.createObjectURL(result);
        var tempLink = document.createElement("a");
        tempLink.href = csvURL;
        tempLink.setAttribute("download", fileName);
        tempLink.click();
        console.log(csvURL);
        if (result.CODE === 1) {
          //Code
        } else if (result.CODE === 2) {
          // alert(
          //   "SQL Error (" +
          //     result.CODE +
          //     "): " +
          //     result.USER_MESSAGE +
          //     "\n" +
          //     result.SYSTEM_MESSAGE
          // );
          this.handleOpenSnackbar(
            "SQL Error (" +
              result.CODE +
              "): " +
              result.USER_MESSAGE +
              "\n" +
              result.SYSTEM_MESSAGE,
            "error"
          );
        } else if (result.CODE === 3) {
          // alert(
          //   "Other Error (" +
          //     result.CODE +
          //     "): " +
          //     result.USER_MESSAGE +
          //     "\n" +
          //     result.SYSTEM_MESSAGE
          // );
          this.handleOpenSnackbar(
            "SQL Error (" +
              result.CODE +
              "): " +
              result.USER_MESSAGE +
              "\n" +
              result.SYSTEM_MESSAGE,
            "error"
          );
        } else if (result.error === 1) {
          // alert(result.error_message);

          this.handleOpenSnackbar(result.error_message, "error");
        } else if (result.success === 0 && result.redirect_url !== "") {
          window.location = result.redirect_url;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onConfirmClick = async (e, id) => {
    e.preventDefault();
    this.setState({
      isSubmitLoading: true,
    });
    if (this.state.methodId) {
      const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C12FinanceStudentsLegacyFeeVouchersChangeStatus?paymentId=${id}&paymentMethodId=${this.state.methodId}`;
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
              this.setState({
                isOpenApprovelMenu: false,
                methodId: 0,
                selectedData: {},
              });
              this.getData();
            } else {
              // alert(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE);
              this.handleOpenSnackbar(
                json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
                "error"
              );
            }
            console.log(json);
          },
          (error) => {
            if (error.status === 401) {
              this.setState({
                isLoginMenu: true,
                isReload: false,
              });
            } else {
              // alert("Failed to fetch, Please try again later.");
              this.handleOpenSnackbar(
                "Failed to fetch, Please try again later.",
                "error"
              );
              console.log(error);
            }
          }
        );
    } else {
      this.setState({ methodIdError: "Please select method." });
    }
    this.setState({
      isSubmitLoading: false,
    });
  };

  getProgramGroup = async (schoolId) => {
    let data = new FormData();
    data.append("schoolId", schoolId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C303CommonProgrammeGroupsView`;
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
            this.setState({ programmeGroupsMenuItems: json.DATA || [] });
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
              "error"
            );
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
            this.handleOpenSnackbar(
              "Failed to fetch, Please try again later.",
              "error"
            );
            console.log(error);
          }
        }
      );
  };

  getProgrammes = async (programmeGroupId) => {
    let data = new FormData();
    data.append("programmeGroupId", programmeGroupId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C303CommonProgrammesView`;
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
            this.setState({ programmeMenuItems: json.DATA || [] });
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
              "error"
            );
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
            this.handleOpenSnackbar(
              "Failed to fetch, Please try again later.",
              "error"
            );
            console.log(error);
          }
        }
      );
  };

  getCourse = async (programmeGroupId) => {
    let data = new FormData();
    data.append("programmeGroupId", programmeGroupId);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C303CommonProgrammeCoursesView`;
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
            this.setState({ coursesMenuItems: json.DATA || [] });
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
              "error"
            );
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
            this.handleOpenSnackbar(
              "Failed to fetch, Please try again later.",
              "error"
            );
            console.log(error);
          }
        }
      );
  };

  loadPathway = async () => {
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C303CommonUolEnrollmentPathwayView`;
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
            this.setState({ pathwayMenuItems: json.DATA || [] });
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
              "error"
            );
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
            this.handleOpenSnackbar(
              "Failed to fetch, Please try again later.",
              "error"
            );
            console.log(error);
          }
        }
      );
  };

  onHandleChange = (e) => {
    const { name, value } = e.target;
    const errName = `${name}Error`;
    let errMsg = "";
    let { methodIdError } = this.state;
    if (name === "methodId") {
      methodIdError = "";
    }

    switch (name) {
      case "schoolId":
        this.setState({
          programmeGroupId: "",

          courseObject: {},
          coursesMenuItems: [],
          programmeMenuItems: [],
          programmeId: "",
        });
        this.getProgramGroup(value);
        break;
      case "programmeGroupId":
        this.setState({
          programmeGroupId: "",

          courseObject: {},
          coursesMenuItems: [],
          programmeMenuItems: [],
          programmeId: "",
        });
        this.getProgrammes(value);
        this.getCourse(value);
        break;
      default:
        break;
    }

    this.setState({
      [name]: value,
      [errName]: errMsg,
      methodIdError,
    });
  };

  getSchools = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C303CommonSchoolsView`;
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
            this.setState({ schoolsMenuItems: json.DATA || [] });
          } else {
            //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
            this.handleOpenSnackbar(
              <span>
                {json.SYSTEM_MESSAGE}
                <br />
                {json.USER_MESSAGE}
              </span>,
              "error"
            );
          }
          console.log("getCourses", json);
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            //alert('Failed to fetch, Please try again later.');
            this.handleOpenSnackbar(
              "Failed to fetch, Please try again later.",
              "error"
            );
            console.log(error);
          }
        }
      );
    this.setState({ isLoading: false });
  };

  render() {
    const columns = [
      {
        name: "Nucleus Id",
        dataIndex: "studentId",
        sortable: false,
        customStyleHeader: { width: "10%", textAlign: "center" },
      },
      {
        name: "Name",
        renderer: (rowData) => {
          return (
            <Fragment>{`${rowData.firstName} ${rowData.middleName} ${rowData.lastName}`}</Fragment>
          );
        },
        sortable: false,
        customStyleHeader: { width: "12%" },
      },
      {
        name: "Session On",
        dataIndex: "sessionLabel",
        sortIndex: "sessionLabel",
        sortable: true,
        customStyleHeader: { width: "15%" },
      },
      {
        name: "Degree Programme",
        dataIndex: "degreeLabel",
        sortIndex: "degreeLabel",
        sortable: true,
        customStyleHeader: { width: "20%", textAlign: "center" },
      },
      {
        name: "Mobile No",
        dataIndex: "mobileNo",
        sortable: false,
        customStyleHeader: { width: "13%" },
      },
      {
        name: "Pathway",
        dataIndex: "pathwayLabel",
        sortable: false,
        customStyleHeader: { width: "15%" },
      },
      {
        name: "Bill No",
        dataIndex: "billNo",
        sortable: false,
        customStyleHeader: { width: "10%" },
      },
      {
        name: "Bill Amount",
        dataIndex: "billAmount",
        sortable: false,
        customStyleHeader: { width: "13%" },
      },
      {
        name: "Due Date",
        dataIndex: "dueDate",
        sortIndex: "dueDate",
        sortable: true,
        customStyleHeader: { width: "16%" },
      },
      {
        name: "Over Due Days",
        renderer: (rowData) => {
          return (
            <Fragment>
              <div style={{ color: "Red" }}>{rowData.overDueDays}</div>
            </Fragment>
          );
        },
        dataIndex: "overDueDays",
        sortIndex: "overDueDays",
        sortable: true,
        customStyleHeader: { width: "16%" },
      },
      {
        name: "Status",
        renderer: (rowData) => {
          return (
            <Fragment>
              <div style={{ color: "Red" }}>Over Due</div>
            </Fragment>
          );
        },
        dataIndex: "statusLabel",
        sortIndex: "statusLabel",
        sortable: true,
        customStyleHeader: { width: "11%", color: "Red" },
      },
    ];

    return (
      <Fragment>
        <LoginMenu
          reload={this.state.isReload}
          open={this.state.isLoginMenu}
          handleClose={() => this.setState({ isLoginMenu: false })}
        />
        <TutionFeeApprovelMenu
          onDownload={(name) => this.onDownload(name)}
          methodIdError={this.state.methodIdError}
          submitLoading={this.state.isSubmitLoading}
          onHandleChange={(e) => this.onHandleChange(e)}
          methodId={this.state.methodId}
          methodData={this.state.methodData}
          data={this.state.selectedData}
          open={this.state.isOpenApprovelMenu}
          handleClose={() => this.setState({ isOpenApprovelMenu: false })}
          onConfirmClick={(e, id) => this.onConfirmClick(e, id)}
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
              Tuition Fee Report
            </Typography>
            {/* 
												<img alt="" src={ExcelIcon} onClick={() => this.downloadExcelData()} style={{
                            height: 30, width: 32,
                            cursor: `${this.state.isDownloadExcel ? 'wait' : 'pointer'}`,
                        }}/> 
												*/}
          </div>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
            }}
          />
          <TutionFeeApprovelFilter
            isLoading={this.state.isLoading}
            handleDateChange={this.handleDateChange}
            onClearFilters={this.onClearFilters}
            values={this.state}
            getDataByStatus={() => this.getData()}
            onHandleChange={(e) => this.onHandleChange(e)}
          />

          <TablePanel
            isShowIndexColumn
            data={this.state.admissionData}
            isLoading={this.state.isLoading}
            sortingEnabled
            columns={columns}
          />
        </div>
      </Fragment>
    );
  }
}
export default R303DueTuitionFee;
