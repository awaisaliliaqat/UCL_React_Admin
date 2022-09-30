import React, { Component, Fragment } from "react";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import R224ReportFilter from "./R224ReportFilter";
import TablePanel from "../../../../../components/ControlledTable/RerenderTable/TablePanel";
import Button from "@material-ui/core/Button";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";

class R224Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      admissionData: [],
      studentId: "",
      isLoginMenu: false,
      isReload: false,
      eventDate: null,
      totalStudents:[],
      academicSessionMenuItems: [],
      academicSessionId: "",
      academicSessionIdError: "",
      degreeClassificationMenuItems: [],
      degreeClassificationId: "",
      degreeClassificationError: "",
      programmeGroupsMenuItems:[],
      programmeGroupId:"",
      programmeGroupIdError: "",
      programmeIdMenuItems: [],
      programmeId: "",
      programmeIdError: "",
    };
  }

  componentDidMount() {
    //this.getData();
    this.loadAcademicSessions();
    this.getProgrammeGroups();
    this.loadProgrammes(0);
    this.loadDegreeClassification();
  }

  onClearFilters = () => {
    this.setState({
      studentId: "",
      programmeId: "",
      programmeGroupId:"",
      academicSessionId: "",
      degreeClassificationId : "",
      admissionData: [],
    });
  };
  handleOpenSnackbar = (msg, severity) => {
    this.setState({
        isOpenSnackbar: true,
        snackbarMessage: msg,
        snackbarSeverity: severity
    });
};
onHandleChangeAS = e => {
  const { name, value } = e.target;
  this.setState({
      [name]: value
    })
    
  this.state.academicSessionId=value;
  this.state.programmeGroupId= "";
  this.state.programmeId= "";
  this.state.degreeClassificationId= "";
}
onHandleChangePG = e => {
  const { name, value } = e.target;
  this.setState({
      [name]: value
  })
  this.state.programmeGroupId = value;
  this.state.programmeId= "";
  this.state.degreeClassificationId= "";
  this.loadProgrammes(this.state.programmeGroupId)
}
onHandleChangeProgramme = e => {
  const { name, value } = e.target;
  this.setState({
      [name]: value,
  })

  this.state.programmeId = value;
 this.state.degreeClassificationId= "";
}


onHandleChangeDegreeClassification = e => {
  const { name, value } = e.target;
  this.setState({
      [name]: value,
  })
  this.state.degreeClassificationId = value;

}

  loadAcademicSessions = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C224CommonAcademicSessionsView`;
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

  loadDegreeClassification = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C224CommonUolEnrollmentYearEndAchievementView`;
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
              this.setState({degreeClassificationId:res.id});
            }
            this.setState({ degreeClassificationMenuItems: array });
            
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
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
            this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };

  getProgrammeGroups = async () => {
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C224CommonProgrammeGroupsView?academicSessionId=${this.state.academicSessionId||0}`;
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
            this.setState({programmeGroupsMenuItems: json.DATA || []});
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
          console.log("getProgrammeGroups",json);
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            this.handleOpenSnackbar("Failed to load Students Data ! Please try Again later.","error");
            console.log(error);
          }
        }
      );
  };

  loadProgrammes = async (programGroup) => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C224CommonProgrammesView?programmeGroupId=${this.state.programmeGroupId|| 0 ||programGroup}`;
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
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
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
            this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
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
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C224CommonStudentsView?programmeGroupId=${this.state.programmeGroupId||0}&academicSessionId=${this.state.academicSessionId||0}&programmeId=${this.state.programmeId||0}&degreeClassificationId=${this.state.degreeClassificationId||0}`;
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
            this.setState({totalStudents: totalStudents});
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
        customStyleHeader: { width: "10%", textAlign: "center" },
      },
      {
        name: "Name",
        renderer: (rowData) => {
          return (
            <Fragment>{`${rowData.firstName} ${rowData.lastName}`}</Fragment>
          );
        },
        sortable: false,
        customStyleHeader: { width: "15%" },
      },
      // {
      //   name: "Gender",
      //   dataIndex: "genderLabel",
      //   sortIndex: "genderLabel",
      //   sortable: true,
      //   customStyleHeader: { width: "13%" },
      // },
      {
        name: "Degree Programme",
        dataIndex: "degreeLabel",
        sortIndex: "degreeLabel",
        sortable: true,
        customStyleHeader: { width: "15%", textAlign: "center" },
        align: "center",
      },
      {
        name: "Mobile No",
        dataIndex: "mobileNo",
        sortable: false,
        customStyleHeader: { width: "10%" },
      },
      {
        name: "Email",
        dataIndex: "email",
        sortable: false,
        customStyleHeader: { width: "10%" },
      },
      {
        name: "Address",
        dataIndex: "address",
        sortable: false,
        customStyleHeader: { width: "20%" },
      },
     
    ];

    return (
      <Fragment>
        <LoginMenu
          // reload={this.state.isReload}
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
              Graduated Students List
            </Typography>
            {this.state.totalStudents>1? 
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                textTransform: "capitalize",
                textAlign: "right"
              }}
              variant="h6"
            >
              Total Students: {this.state.totalStudents}
            </Typography>
            :
            ""
            }
          </div>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
            }}
          />
          <R224ReportFilter
            isLoading={this.state.isLoading}
            onClearFilters={this.onClearFilters}
            values={this.state}
            getDataByStatus={() => this.getData()}
            onHandleChange={(e) => this.onHandleChange(e)}
            onHandleChangeAS={(e) => this.onHandleChangeAS(e)}
            onHandleChangePG={(e) => this.onHandleChangePG(e)}
            onHandleChangeProgramme={(e) => this.onHandleChangeProgramme(e)}
            onHandleChangeDegreeClassification={(e) => this.onHandleChangeDegreeClassification(e)}
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
export default R224Report;
