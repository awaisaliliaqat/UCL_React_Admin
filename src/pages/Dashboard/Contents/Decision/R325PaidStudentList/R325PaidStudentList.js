import React, { Component, Fragment } from "react";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
// import ExcelIcon from '../../../../assets/Images/excel.png';
import TutionFeeApprovelFilter from "./Chunks/PaidStudentApprovelFilter";
import TablePanel from "../../../../../components/ControlledTable/RerenderTable/TablePanel";
import Button from "@material-ui/core/Button";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import TutionFeeApprovelMenu from "./Chunks/PaidStudentApprovelMenu";

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

class R325PaidStudentList extends Component {
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

  // getGenderData = async () => {
  //   const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C02CommonGendersView`;
  //   await fetch(url, {
  //     method: "GET",
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
  //         this.setState({
  //           genderData: json.DATA,
  //         });
  //       },
  //       (error) => {
  //         if (error.status === 401) {
  //           this.setState({
  //             isLoginMenu: true,
  //             isReload: true,
  //           });
  //         } else {
  //           // alert("Failed to fetch, Please try again later.");
  //           this.handleOpenSnackbar(
  //             "Failed to fetch, Please try again later.",
  //             "error"
  //           );
  //           console.log(error);
  //         }
  //       }
  //     );
  // };

  getMethodData = async () => {
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C325FinanceStudentsLegacyFeePaymentMethods`;
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C325CommonAcademicSessionsView`;
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
            let res = array.find((obj) => obj.isActive === 1);
            let array2 = array.filter((obj) => obj.isActive === 1);

            if (res) {
              this.setState({ academicSessionId: res.ID }, () =>
                this.getData()
              );
            }
            this.setState({ academicSessionMenuItems: array2 });
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
    data.append("courseId", 0);
    data.append("pathwayId", 0);
    data.append("isActive", 1);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C325FinanceStudentsLegacyFeeVouchersView`;
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C325CommonProgrammeGroupsView`;
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C325CommonProgrammesView`;
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C325CommonProgrammeCoursesView`;
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C325CommonUolEnrollmentPathwayView`;
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C325CommonSchoolsView`;
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
      // {
      //   name: "Pathway",
      //   dataIndex: "pathwayLabel",
      //   sortable: false,
      //   customStyleHeader: { width: "15%" },
      // },
      // {
      //   name: "Bill No",
      //   dataIndex: "billNo",
      //   sortable: false,
      //   customStyleHeader: { width: "10%" },
      // },
      // {
      //   name: "Bill Amount",
      //   dataIndex: "billAmount",
      //   sortable: false,
      //   customStyleHeader: { width: "13%" },
      // },
      // {
      //   name: "Due Date",
      //   dataIndex: "dueDate",
      //   sortIndex: "dueDate",
      //   sortable: true,
      //   customStyleHeader: { width: "16%" },
      // },
      // {
      //   name: "Over Due Days",
      //   renderer: (rowData) => {
      //     return (
      //       <Fragment>
      //         <div style={{ color: "Red" }}>{rowData.overDueDays}</div>
      //       </Fragment>
      //     );
      //   },
      //   dataIndex: "overDueDays",
      //   sortIndex: "overDueDays",
      //   sortable: true,
      //   customStyleHeader: { width: "16%" },
      // },
      {
        name: "Status",
        renderer: (rowData) => {
          console.log(rowData);

          return (
            <Fragment>
              <div style={{ color: "green" }}>
                {rowData.isConfirmed === 1 ? "Paid" : ""}
              </div>
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
              Paid Student list
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
export default R325PaidStudentList;

// import React, { Component, Fragment } from "react";
// import Divider from "@material-ui/core/Divider";
// import Typography from "@material-ui/core/Typography";
// import ExcelIcon from "../../../../../assets/Images/excel.png";
// import R325PaidStudentListFilter from "./Chunks/PaidStudentApprovelFilter";
// import TablePanel from "../../../../../components/ControlledTable/RerenderTable/TablePanel";
// import Button from "@material-ui/core/Button";
// import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
// import R325PaidStudentListMenu from "./Chunks/PaidStudentApprovelMenu";

// import { format } from "date-fns";

// function isEmpty(obj) {
//   if (obj == null) return true;

//   if (obj.length > 0) return false;
//   if (obj.length === 0) return true;

//   if (typeof obj !== "object") return true;

//   for (var key in obj) {
//     if (hasOwnProperty.call(obj, key)) return false;
//   }

//   return true;
// }

// class R325PaidStudentList extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isLoading: false,
//       applicationStatusId: 2,
//       admissionData: [],
//       genderData: [],
//       degreeData: [],
//       documentData: [],
//       statusTypeData: [],
//       studentName: "",
//       referenceNo: "",
//       genderId: 0,
//       degreeId: 0,
//       applicationId: "",
//       isDownloadExcel: false,
//       isLoginMenu: false,
//       isReload: false,
//       isSubmitLoading: false,
//       isOpenApprovelMenu: false,
//       eventDate: null,
//       selectedData: {},
//       methodData: [],
//       methodId: 0,
//       methodIdError: "",
//       academicSessionMenuItems: [],
//       academicSessionId: 0,
//       academicSessionIdError: "",
//     };
//   }

//   componentDidMount() {
//     this.loadAcademicSessions();
//     this.getGenderData();
//     this.getDegreesData();
//     this.getStatusTypeData();
//     this.getMethodData();
//     //this.getData();
//   }

//   getGenderData = async () => {
//     const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C325CommonGendersView`;
//     await fetch(url, {
//       method: "GET",
//       headers: new Headers({
//         Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
//       }),
//     })
//       .then((res) => {
//         if (!res.ok) {
//           throw res;
//         }
//         return res.json();
//       })
//       .then(
//         (json) => {
//           this.setState({
//             genderData: json.DATA,
//           });
//         },
//         (error) => {
//           if (error.status === 401) {
//             this.setState({
//               isLoginMenu: true,
//               isReload: true,
//             });
//           } else {
//             alert("Failed to fetch, Please try again later.");
//             console.log(error);
//           }
//         }
//       );
//   };
//   loadAcademicSessions = async () => {
//     this.setState({ isLoading: true });
//     const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C325CommonAcademicsSessionsView`;
//     await fetch(url, {
//       method: "POST",
//       headers: new Headers({
//         Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
//       }),
//     })
//       .then((res) => {
//         if (!res.ok) {
//           throw res;
//         }
//         return res.json();
//       })
//       .then(
//         (json) => {
//           if (json.CODE === 1) {
//             let array = json.DATA || [];
//             // let arrayLength = array.length;
//             let res = array.find((obj) => obj.isAdmissionActive === 1);
//             if (res) {
//               this.setState({ academicSessionId: res.ID });
//             }
//             this.setState({ academicSessionMenuItems: array });
//             this.getData();
//           } else {
//             this.handleOpenSnackbar(
//               <span>
//                 {json.SYSTEM_MESSAGE}
//                 <br />
//                 {json.USER_MESSAGE}
//               </span>,
//               "error"
//             );
//           }
//         },
//         (error) => {
//           if (error.status == 401) {
//             this.setState({
//               isLoginMenu: true,
//               isReload: false,
//             });
//           } else {
//             console.log(error);
//             this.handleOpenSnackbar(
//               "Failed to fetch ! Please try Again later.",
//               "error"
//             );
//           }
//         }
//       );
//     this.setState({ isLoading: false });
//   };

//   getStatusTypeData = async () => {
//     const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C325CommonAcademicsFeePayableStatusTypesView`;
//     await fetch(url, {
//       method: "GET",
//       headers: new Headers({
//         Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
//       }),
//     })
//       .then((res) => {
//         if (!res.ok) {
//           throw res;
//         }
//         return res.json();
//       })
//       .then(
//         (json) => {
//           this.setState({
//             statusTypeData: json.DATA,
//           });
//           console.log(json.DATA);
//         },
//         (error) => {
//           if (error.status === 401) {
//             this.setState({
//               isLoginMenu: true,
//               isReload: true,
//             });
//           } else {
//             alert("Failed to fetch, Please try again later.");
//             console.log(error);
//           }
//         }
//       );
//   };

//   getMethodData = async () => {
//     const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C325CommonAcademicsFeePayablePaymentMethodsView`;
//     await fetch(url, {
//       method: "GET",
//       headers: new Headers({
//         Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
//       }),
//     })
//       .then((res) => {
//         if (!res.ok) {
//           throw res;
//         }
//         return res.json();
//       })
//       .then(
//         (json) => {
//           this.setState({
//             methodData: json.DATA || [],
//           });
//           console.log(json.DATA);
//         },
//         (error) => {
//           if (error.status === 401) {
//             this.setState({
//               isLoginMenu: true,
//               isReload: true,
//             });
//           } else {
//             alert("Failed to fetch, Please try again later.");
//             console.log(error);
//           }
//         }
//       );
//   };

//   getDegreesData = async () => {
//     let data = [];
//     //const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C02CommonAcademicsDegreeProgramsView`;
//     const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C325CommonAcademicsDegreeProgramsView`;
//     await fetch(url, {
//       method: "GET",
//       headers: new Headers({
//         Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
//       }),
//     })
//       .then((res) => {
//         if (!res.ok) {
//           throw res;
//         }
//         return res.json();
//       })
//       .then(
//         (json) => {
//           const resData = json.DATA || [];
//           if (resData.length > 0) {
//             for (let i = 0; i < resData.length; i++) {
//               if (!isEmpty(resData[i])) {
//                 data.push({ id: "", label: resData[i].department });
//               }
//               for (let j = 0; j < resData[i].degrees.length; j++) {
//                 if (!isEmpty(resData[i].degrees[j])) {
//                   data.push({
//                     id: resData[i].degrees[j].id,
//                     label: resData[i].degrees[j].label,
//                   });
//                 }
//               }
//             }
//           }
//         },
//         (error) => {
//           if (error.status === 401) {
//             this.setState({
//               isLoginMenu: true,
//               isReload: true,
//             });
//           } else {
//             alert("Failed to fetch, Please try again later.");
//             console.log(error);
//           }
//         }
//       );
//     this.setState({
//       degreeData: data,
//     });
//   };

//   onClearFilters = () => {
//     this.setState({
//       studentName: "",
//       genderId: 0,
//       degreeId: 0,
//       applicationId: "",
//       referenceNo: "",
//       applicationStatusId: 1,
//       eventDate: null,
//     });
//   };

//   handleDateChange = (date) => {
//     this.setState({
//       eventDate: date,
//     });
//   };

//   onDownload = (fileName) => {
//     const url = `${process.env.REACT_APP_API_DOMAIN}/${
//       process.env.REACT_APP_SUB_API_NAME
//     }/common/CommonViewFile?fileName=${encodeURIComponent(fileName)}`;

//     fetch(url, {
//       method: "GET",
//       headers: new Headers({
//         Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
//       }),
//     })
//       .then((res) => {
//         if (res.status === 200) {
//           return res.blob();
//         } else if (res.status === 401) {
//           this.setState({
//             isLoginMenu: true,
//             isReload: false,
//           });
//           return {};
//         } else {
//           alert("Operation Failed, Please try again later.");
//           return {};
//         }
//       })
//       .then((result) => {
//         var csvURL = window.URL.createObjectURL(result);
//         var tempLink = document.createElement("a");
//         tempLink.href = csvURL;
//         tempLink.setAttribute("download", fileName);
//         tempLink.click();
//         console.log(csvURL);
//         if (result.CODE === 1) {
//           //Code
//         } else if (result.CODE === 2) {
//           alert(
//             "SQL Error (" +
//               result.CODE +
//               "): " +
//               result.USER_MESSAGE +
//               "\n" +
//               result.SYSTEM_MESSAGE
//           );
//         } else if (result.CODE === 3) {
//           alert(
//             "Other Error (" +
//               result.CODE +
//               "): " +
//               result.USER_MESSAGE +
//               "\n" +
//               result.SYSTEM_MESSAGE
//           );
//         } else if (result.error === 1) {
//           alert(result.error_message);
//         } else if (result.success === 0 && result.redirect_url !== "") {
//           window.location = result.redirect_url;
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   downloadExcelData = async () => {
//     if (this.state.isDownloadExcel === false) {
//       this.setState({
//         isDownloadExcel: true,
//       });
//       const paymentDate = this.state.eventDate
//         ? `&paymentDate=${format(this.state.eventDate, "dd-MMM-yyyy")}`
//         : "";
//       const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C03AdmissionsProspectApplicationRegistrationFeeApprovalExcelDownload?paymentStatusId=${this.state.applicationStatusId}&academicSessionId=${this.state.academicSessionId}&applicationId=${this.state.applicationId}&referenceNo=${this.state.referenceNo}&genderId=${this.state.genderId}&degreeId=${this.state.degreeId}&studentName=${this.state.studentName}${paymentDate}`;
//       await fetch(url, {
//         method: "GET",
//         headers: new Headers({
//           Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
//         }),
//       })
//         .then((res) => {
//           if (res.status === 200) {
//             return res.blob();
//           }
//           return false;
//         })
//         .then(
//           (json) => {
//             if (json) {
//               var csvURL = window.URL.createObjectURL(json);
//               var tempLink = document.createElement("a");
//               tempLink.setAttribute(
//                 "download",
//                 `RegistrationFeeApprovalStatus.xlsx`
//               );
//               tempLink.href = csvURL;
//               tempLink.click();
//               console.log(json);
//             }
//           },
//           (error) => {
//             if (error.status === 401) {
//               this.setState({
//                 isLoginMenu: true,
//                 isReload: false,
//               });
//             } else {
//               alert("Failed to fetch, Please try again later.");
//               console.log(error);
//             }
//           }
//         );
//       this.setState({
//         isDownloadExcel: false,
//       });
//     }
//   };

//   getData = async () => {
//     this.setState({
//       isLoading: true,
//     });
//     const paymentDate = this.state.eventDate
//       ? `&paymentDate=${format(this.state.eventDate, "dd-MMM-yyyy")}`
//       : "";
//     const reload =
//       this.state.applicationStatusId === 0 &&
//       this.state.academicSessionId === "" &&
//       this.state.applicationId === "" &&
//       this.state.genderId === 0 &&
//       this.state.degreeId === 0 &&
//       this.state.referenceNo === "" &&
//       this.state.studentName === "" &&
//       this.state.eventDate === null;
//     const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C325AdmissionsProspectApplicationRegistrationFeeApprovalView?paymentStatusId=${this.state.applicationStatusId}&academicSessionId=${this.state.academicSessionId}&applicationId=${this.state.applicationId}&referenceNo=${this.state.referenceNo}&genderId=${this.state.genderId}&degreeId=${this.state.degreeId}&studentName=${this.state.studentName}${paymentDate}`;
//     await fetch(url, {
//       method: "GET",
//       headers: new Headers({
//         Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
//       }),
//     })
//       .then((res) => {
//         if (!res.ok) {
//           throw res;
//         }
//         return res.json();
//       })
//       .then(
//         (json) => {
//           if (json.CODE === 1) {
//             this.setState({
//               admissionData: json.DATA || [],
//             });
//           } else {
//             alert(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE);
//           }
//           console.log(json);
//         },
//         (error) => {
//           if (error.status === 401) {
//             this.setState({
//               isLoginMenu: true,
//               isReload: reload,
//             });
//           } else {
//             alert("Failed to fetch, Please try again later.");
//             console.log(error);
//           }
//         }
//       );
//     this.setState({
//       isLoading: false,
//     });
//   };

//   onConfirmClick = async (e, id) => {
//     e.preventDefault();
//     this.setState({
//       isSubmitLoading: true,
//     });
//     if (this.state.methodId) {
//       const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C03CommonAcademicsFeePayableChangeStatus?paymentId=${id}&paymentMethodId=${this.state.methodId}`;
//       await fetch(url, {
//         method: "GET",
//         headers: new Headers({
//           Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
//         }),
//       })
//         .then((res) => {
//           if (!res.ok) {
//             throw res;
//           }
//           return res.json();
//         })
//         .then(
//           (json) => {
//             if (json.CODE === 1) {
//               this.setState({
//                 isOpenApprovelMenu: false,
//                 methodId: 0,
//                 selectedData: {},
//               });
//               this.getData();
//             } else {
//               alert(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE);
//             }
//             console.log(json);
//           },
//           (error) => {
//             if (error.status === 401) {
//               this.setState({
//                 isLoginMenu: true,
//                 isReload: false,
//               });
//             } else {
//               alert("Failed to fetch, Please try again later.");
//               console.log(error);
//             }
//           }
//         );
//     } else {
//       this.setState({ methodIdError: "Please select method." });
//     }
//     this.setState({
//       isSubmitLoading: false,
//     });
//   };

//   onHandleChange = (e) => {
//     const { name, value } = e.target;
//     let { methodIdError } = this.state;
//     if (name === "methodId") {
//       methodIdError = "";
//     }
//     this.setState({
//       [name]: value,
//       methodIdError,
//     });
//   };

//   render() {
//     const columns = [
//       {
//         name: "Id",
//         dataIndex: "id",
//         sortable: false,
//         customStyleHeader: { width: "8%", textAlign: "center" },
//       },
//       {
//         name: "Name",
//         dataIndex: "displayName",
//         sortable: false,
//         customStyleHeader: { width: "12%" },
//       },
//       {
//         name: "Gender",
//         dataIndex: "genderLabel",
//         sortIndex: "genderLabel",
//         sortable: true,
//         customStyleHeader: { width: "9%" },
//       },
//       {
//         name: "Programme",
//         dataIndex: "degreeLabel",
//         sortIndex: "degreeLabel",
//         sortable: true,
//         customStyleHeader: { width: "17%", textAlign: "center" },
//         align: "center",
//       },
//       {
//         name: "Mobile No",
//         dataIndex: "mobileNo",
//         sortable: false,
//         customStyleHeader: { width: "13%" },
//       },
//       {
//         name: "Email",
//         dataIndex: "email",
//         sortable: false,
//         customStyleHeader: { width: "15%" },
//       },
//       // {
//       //   name: "Payment Reference No",
//       //   dataIndex: "paymentReferenceNo",
//       //   sortable: false,
//       //   customStyleHeader: { width: "15%" },
//       // },
//       // {
//       //   name: "Payment Method",
//       //   dataIndex: "paymentMethodLabel",
//       //   sortIndex: "paymentMethodLabel",
//       //   sortable: true,
//       //   customStyleHeader: { width: "15%" },
//       // },
//       // {
//       //   name: "Payment Date",
//       //   dataIndex: "paymentDate",
//       //   sortIndex: "paymentDateMillis",
//       //   sortable: true,
//       //   customStyleHeader: { width: "13%" },
//       // },
//       {
//         name: "Status",
//         dataIndex: "paymentStatusLabel",
//         sortIndex: "paymentStatusLabel",
//         sortable: true,
//         customStyleHeader: { width: "12%" },
//       },
//       // {
//       //   name: "Action",
//       //   renderer: (rowData) => {
//       //     return (
//       //       <Button
//       //         key={rowData.id}
//       //         disabled={rowData.paymentMethodId === 4}
//       //         style={{
//       //           fontSize: 12,
//       //           textTransform: "capitalize",
//       //         }}
//       //         variant="outlined"
//       //         onClick={() =>
//       //           this.setState({
//       //             isOpenApprovelMenu: true,
//       //             selectedData: rowData,
//       //             methodId: rowData.paymentMethodId,
//       //           })
//       //         }
//       //       >
//       //         View
//       //       </Button>
//       //     );
//       //   },
//       //   sortable: false,
//       //   customStyleHeader: { width: "10%" },
//       // },
//     ];

//     return (
//       <Fragment>
//         <LoginMenu
//           reload={this.state.isReload}
//           open={this.state.isLoginMenu}
//           handleClose={() => this.setState({ isLoginMenu: false })}
//         />
//         <R325PaidStudentListMenu
//           onDownload={(name) => this.onDownload(name)}
//           methodIdError={this.state.methodIdError}
//           submitLoading={this.state.isSubmitLoading}
//           onHandleChange={(e) => this.onHandleChange(e)}
//           methodId={this.state.methodId}
//           methodData={this.state.methodData}
//           data={this.state.selectedData}
//           open={this.state.isOpenApprovelMenu}
//           handleClose={() => this.setState({ isOpenApprovelMenu: false })}
//           onConfirmClick={(e, id) => this.onConfirmClick(e, id)}
//         />
//         <div
//           style={{
//             padding: 20,
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//             }}
//           >
//             <Typography
//               style={{
//                 color: "#1d5f98",
//                 fontWeight: 600,
//                 textTransform: "capitalize",
//               }}
//               variant="h5"
//             >
//               Paid Student List
//             </Typography>
//             {/* <img
//               alt=""
//               src={ExcelIcon}
//               onClick={() => this.downloadExcelData()}
//               style={{
//                 height: 30,
//                 width: 32,
//                 cursor: `${this.state.isDownloadExcel ? "wait" : "pointer"}`,
//               }}
//             /> */}
//           </div>
//           <Divider
//             style={{
//               backgroundColor: "rgb(58, 127, 187)",
//               opacity: "0.3",
//             }}
//           />
//           <R325PaidStudentListFilter
//             isLoading={this.state.isLoading}
//             handleDateChange={this.handleDateChange}
//             onClearFilters={this.onClearFilters}
//             values={this.state}
//             getDataByStatus={() => this.getData()}
//             onHandleChange={(e) => this.onHandleChange(e)}
//           />

//           <TablePanel
//             isShowIndexColumn
//             data={this.state.admissionData}
//             isLoading={this.state.isLoading}
//             sortingEnabled
//             columns={columns}
//           />
//         </div>
//       </Fragment>
//     );
//   }
// }
// export default R325PaidStudentList;
