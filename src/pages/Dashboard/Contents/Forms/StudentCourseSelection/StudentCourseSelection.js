import React, { Component, Fragment } from "react";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import StudentCourseSelectionFilter from "./Chunks/StudentCourseSelectionFilter";
import TablePanel from "../../../../../components/ControlledTable/RerenderTable/TablePanel";
import IconButton from "@material-ui/core/IconButton";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import StudentCourseSelectionAction from "./Chunks/StudentCourseSelectionAction";
import ExcelIcon from "../../../../../assets/Images/excel.png";
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';



class StudentCourseSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      admissionData: [],
      coursesData: [],
      previousCoursesData: [],
      selectedCoursesDataV2: [],
      selectedCoursesData: [],
      
      achivementsData: [],
      moduleData: [],
      moduleDropDownData: [],
      moduleId:"",
      isOpenActionMenu: false,
      readOnly: false,
      selectedData: {},
      isLoginMenu: false,
      isReload: false,
      viewLoading: false,
      sessionId: "",
      sessionData: [],
      programmeId: "",
      programmeData: [],
      regStatusId: 1,
      studentId: "",
      studentIddToSend: "",
      studentName: "",
      isDownloadExcel: false,
      totalStudents: []
    };
  }

  componentDidMount() {
    this.onLoadAllData();
  }

  onLoadAllData = async () => {
    const query = new URLSearchParams(this.props.location.search);
    const studentId = query.get("studentId") || "";
    const academicSessionId = query.get("academicSessionId") || "";
    const programmeGroupId = query.get("programmeGroupId") || "";
    const isEdit = query.get("isEdit") || 0;
    await this.getSessionData(academicSessionId, programmeGroupId);

    if (studentId != "") {
      this.setState(
        {
          studentId,
          regStatusId: 0,
        },
        () => this.getData(false, "", 1, isEdit)
      );
    }
  }

  getSessionData = async (sessionId, programmeGroupId) => {
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C22CommonAcademicsSessionsView`;
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
        async (json) => {
          if (json.CODE === 1) {
            
            let array = json.DATA || [];
            this.setState({
              sessionData: array,
            });

            
            let res2 = array.find((obj) => obj.ID == sessionId);
            if (sessionId && res2) {
              this.setState({
                sessionId: res2.ID,
                programmeId: "",
                admissionData: [],
              });
              await this.getProgrammeData(res2.ID, programmeGroupId);
            } else {
              let res = array.find((obj) => obj.isActive === 1);
              if (res) {
                this.setState({
                  sessionId: res.ID,
                  programmeId: "",
                  admissionData: [],
                });
                this.getProgrammeData(res.ID);
              }
            }
          } else {
            alert(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE);
          }
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            alert("Failed to fetch, Please try again later.");
            console.log(error);
          }
        }
      );
  };

 

  getCouresData = async (moduleId) => {
    this.setState({
      viewLoading: true,
    });
    this.setState({
      selectedCoursesDataV2: [],
    });
    if(moduleId!=0){
      const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C22CommonAcademicsSessionsOfferedCoursesView?sessionId=${this.state.sessionId}&programmeGroupId=${this.state.programmeId}&studentId=${this.state.studentIddToSend}&moduleId=${moduleId}&programmeId=${this.state.selectedData.programmeId}`;
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
              // let coursesData = json.DATA || [];
              
              // let selectedData=this.state.selectedData;
              this.setState({
                coursesData: json.DATA || [],
                isOpenActionMenu: true,
                //comented By Farhan ON SUNDAY
                
              });
            } else {
              alert(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE);
            }
          },
          (error) => {
            if (error.status === 401) {
              this.setState({
                isLoginMenu: true,
                isReload: true,
              });
            } else {
              alert("Failed to fetch, Please try again later.");
              console.log(error);
            }
          }
        );
      this.setState({
        viewLoading: false,
      });
    }
    
  };

  getRegisteredCoursesData = async (rowData) => {
    this.setState({
      viewLoading: true,
    });
   
      const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C22CommonAcademicsSessionsOfferedCoursesRegisteredView?sessionId=${this.state.sessionId}&programmeGroupId=${this.state.programmeId}&studentId=${rowData.id}&programmeId=${rowData.programmeId}`;
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
              let coursesData = json.DATA || [];
              let selectedCoursesData=[];
             
              console.log(selectedCoursesData);
            //  let selectedCoursesData = [];
              for (let i = 0; i < coursesData.length; i++) {
                if (coursesData[i].isRegistered) {
                   selectedCoursesData.push(coursesData[i]);
                  //selectedCoursesData.push(coursesData[i]);
                  // console.log("selectedCoursesData.indexOf(coursesData[i]) ==>> ",selectedCoursesData.indexOf(coursesData[i]));
                  // if(selectedCoursesData.indexOf(coursesData[i]) == -1 ){
                   
                  // }else{
                  //   console.log("THIS DOESNT EXISTS");
                  // }
                  
                }
              }
              let selectedData=this.state.selectedData;
              this.setState({
                // coursesData: json.DATA || [],
                isOpenActionMenu: true,
                //comented By Farhan ON SUNDAY
                //selectedData: selectedData,
                selectedCoursesData: selectedCoursesData
              });
            } else {
              alert(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE);
            }
          },
          (error) => {
            if (error.status === 401) {
              this.setState({
                isLoginMenu: true,
                isReload: true,
              });
            } else {
              alert("Failed to fetch, Please try again later.");
              console.log(error);
            }
          }
        );
      this.setState({
        viewLoading: false,
      });
   
    
  };

  getPreviousCouresData = async (rowData) => {
    this.setState({
      viewLoading: true,
    });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C22CommonAcademicsSessionsPreviousOfferedCoursesView?sessionId=${this.state.sessionId}&programmeGroupId=${this.state.programmeId}&studentId=${rowData.id}`;
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
            let previousCoursesData = json.DATA || [];
            
            this.setState({
               previousCoursesData: json.DATA || [],
              isOpenActionMenu: true,
              // selectedData: rowData,
              // selectedCoursesData: selectedCoursesData
            });
          } else {
            alert(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE);
          }
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            alert("Failed to fetch, Please try again later.");
            console.log(error);
          }
        }
      );
    this.setState({
      viewLoading: false,
    });
  };

  getModulesData = async (rowData) => {
    this.setState({ viewLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C22CommonProgrammeModulesView?academicsSessionId=${this.state.sessionId}&programmeId=${rowData.programmeId}&studentId=${rowData.id}`;
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
            for (var i = 0; i < json.DATA.length; i++) {
              let achivedCoursesArray = json.DATA[i].isAchievedCoursesArray.split(",");
              let coursesArray = json.DATA[i].courses.split(",");
              let courses = coursesArray.map((data, index) => (
                <Fragment key={"pmc" + data + index}>
                  {achivedCoursesArray.indexOf(data) !== -1 ?
                    <span
                      style={{
                        color: "#4caf50"
                      }}
                    >
                      {data}
                    </span>
                    :
                    data
                  }
                  <br />
                </Fragment>
              ));
              json.DATA[i].courses = <div>{courses}</div>;
            }
            this.setState({
              moduleData: json.DATA || [],
            });
          } else {
            alert(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE);
          }
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            alert("Failed to fetch, Please try again later.");
            console.log(error);
          }
        }
      );
    this.setState({
      viewLoading: false,
    });
  };

  getModulesDropDownData = async (rowData) => {
    this.setState({ viewLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C22CommonProgrammeModulesDropDownView?academicsSessionId=${this.state.sessionId}&programmeId=${rowData.programmeId}`;
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
              moduleDropDownData: json.DATA || [],
            });
          } else {
            alert(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE);
          }
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            alert("Failed to fetch, Please try again later.");
            console.log(error);
          }
        }
      );
    this.setState({
      viewLoading: false,
    });
  };

  getStudentAchivementsData = async (rowData) => {
    this.setState({
      viewLoading: true,
    });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C22CommonAcademicsCoursesStudentsAchievementsView?academicsSessionId=${this.state.sessionId}&programmeGroupId=${this.state.programmeId}&studentId=${rowData.id}`;
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
              achivementsData: json.DATA || [],
            });
          } else {
            alert(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE);
          }
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            alert("Failed to fetch, Please try again later.");
            console.log(error);
          }
        }
      );
    this.setState({
      viewLoading: false,
    });
  };

  getProgrammeData = async (id, programmeGroupId) => {

    let myProgrammeId = programmeGroupId || "";

    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C22CommonAcademicsSessionsOfferedProgrammesView?sessionId=${id}`;
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
              programmeData: json.DATA || [],
              programmeId: myProgrammeId
            });
          } else {
            alert(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE);
          }
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            alert("Failed to fetch, Please try again later.");
            console.log(error);
          }
        }
      );
  };

  onClearFilters = () => {
    this.setState({
      regStatusId: 1,
      studentId: "",
      studentName: "",
    });
  };

  getData = async (isChangeCall = false, value = "", isCentricCall=0, isEdit=0) => {
    this.setState({
      isLoading: true,
    });
    const programmeId = isChangeCall ? value : this.state.programmeId;
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C22CommonStudentsView?sessionId=${this.state.sessionId}&statusId=${this.state.regStatusId}&programmeGroupId=${programmeId}&studentId=${this.state.studentId}&studentName=${this.state.studentName}`;
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
            const data = json.DATA || [];
            let dataLength = data.length;
            this.setState({
              admissionData: data,
              totalStudents: dataLength
            });
            if(isCentricCall == 1 && dataLength > 0){
              const rowData = data[0] || {};
              if(isEdit == 1){
                this.setState({
                  studentIddToSend:rowData.id,
                  selectedData:rowData
                });
                this.getCouresData(0);
                this.getRegisteredCoursesData(rowData);
                this.getPreviousCouresData(rowData);
                this.getModulesData(rowData);
                this.getModulesDropDownData(rowData);
                this.getStudentAchivementsData(rowData);
              } else {
              this.setState({
                studentIddToSend:rowData.id,
                selectedData:rowData
              });
              this.onReadOnly();
              this.getCouresData(0);
              this.getRegisteredCoursesData(rowData);
              this.getPreviousCouresData(rowData)
              this.getModulesData(rowData);
              this.getModulesDropDownData(rowData);
              this.getStudentAchivementsData(rowData);
            }
          }

          } else {
            alert(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE);
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
            alert("Failed to fetch, Please try again later.");
            console.log(error);
          }
        }
      );
    this.setState({
      isLoading: false,
    });
  };

  downloadExcelData = async () => {

    if (this.state.isDownloadExcel === false) {
      this.setState({
        isDownloadExcel: true
      })

      const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C22CommonStudentsCourseSelectionBySessionIdExcelDownload?sessionId=${this.state.sessionId}`;
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
            if (json) {
              var csvURL = window.URL.createObjectURL(json);
              var tempLink = document.createElement("a");
              tempLink.setAttribute("download", `Applications.xlsx`);
              tempLink.href = csvURL;
              tempLink.click();
              console.log(json);
            }
          },
          error => {
            if (error.status === 401) {
              this.setState({
                isLoginMenu: true,
                isReload: false
              })
            } else {
              alert('Failed to fetch, Please try again later.');
              console.log(error);
            }
          });
      this.setState({
        isDownloadExcel: false
      })
    }
  }

  onSaveClick = () => {
    document.getElementById("courseSubmit").click();
  };

  onFormSubmit = async (e) => {
    e.preventDefault();
    this.setState({
      isLoading: true,
    });
    const formData = new FormData(e.target);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C22CommonAcademicsCoursesStudentsSave`;
    await fetch(url, {
      method: "POST",
      body: formData,
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
            alert("Saved");
            this.getData();
            this.setState({
              readOnly: false,
              isOpenActionMenu: false,
              selectedCoursesDataV2:[]
            });
          } else {
            alert(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE);
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
            alert("Failed to Save, Please try again later.");
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
    switch (name) {
      case "sessionId":
        this.setState({
          programmeId: "",
          admissionData: [],
        });
        this.getProgrammeData(value);
        break;
      case "programmeId":
        this.getData(true, value);
        break;
      default:
        break;
    }
    this.setState({
      [name]: value,
    });
  };

  onReadOnly = () => {
    this.setState({ readOnly: true });
  }

  handleCheckboxChange = (e, value = {}, type = 0) => {
    const { checked } = e.target;
    const { id } = value;
    const { selectedCoursesData } = this.state;
    const index = selectedCoursesData.findIndex((item) => item.id === id);
    if (index >= 0) {
      if (type === 0) {
        selectedCoursesData[index].isRegistered = checked ? 1 : 0;
        selectedCoursesData[index].isRepeat = 0;
      } else {
        selectedCoursesData[index].isRepeat = checked ? 1 : 0;
      }
    }
    this.setState({
      selectedCoursesData,
    });
  };

  onCheckClear = () => {
    const { selectedCoursesData } = this.state;
    for (let i = 0; i < selectedCoursesData.length; i++) {
      selectedCoursesData[i].isRegistered = 0;
      selectedCoursesData[i].isRepeat = 0;
    }
    this.setState({
      selectedCoursesData,
    });
  };


  handleChangeModuleDropDown = (e) => {
      console.log("handleChangeModuleDropDown",e.target);

        this.setState({ moduleId: e.target.value,selectedCoursesDataV2:[] });
       
         let moduleId=e.target.value;
        //  for(let i=0;i<this.state.moduleDropDownData.length;i++){
        //   console.log("MODULEEE",this.state.moduleDropDownData[i]);
        //  }
        this.getCouresData(moduleId);

  }

  handleSetCourses = (value = []) => {
    
    for (let i = 0; i < value.length; i++) {
      value[i].isRegistered = 1;
    }
    
     let Dv1 =this.state.selectedCoursesData;
     let Dv2 =value;
     
    
     for(let x=0; x<Dv2.length;x++){
       
        let res=Dv1.find((obj) => obj.id==Dv2[x].id);
        if(!res){
         
          const index = this.state.moduleDropDownData.findIndex((item) => item.id === this.state.moduleId);
          Dv2[x].moduleNumber=this.state.moduleDropDownData[index].moduleNumber;
          Dv1.push(Dv2[x]);
        }

     }
    this.setState({ selectedCoursesDataV2: value, selectedCoursesData: Dv1});


    
  
    console.log("value",value);
    console.log("value2", this.state.selectedCoursesData);
    
  }

  render() {
    const columns = [
      {
        name: "Nucleus Id",
        dataIndex: "studentId",
        sortable: false,
        customStyleHeader: { width: "12%" },
      },
      {
        name: "Student Name",
        dataIndex: "displayName",
        sortIndex: "displayName",
        sortable: true,
        customStyleHeader: { width: "17%" },
      },
      {
        name: "Programme",
        dataIndex: "degreeLabel",
        sortIndex: "degreeLabel",
        sortable: true,
        customStyleHeader: { width: "18%" },
      },
      {
        name: "Registration Status",
        dataIndex: "isRegisteredLabel",
        sortIndex: "paymentStatusLabel",
        sortable: true,
        customStyleHeader: { width: "19%" },
      },
      {
        name: "No. of Reg Courses",
        renderer: (rowData) => {
          return <Fragment>{rowData.registeredCourses || ""}</Fragment>;
        },
        sortIndex: "registeredCourses",
        sortable: true,
        customStyleHeader: { width: "19%" },
      },
      {
        name: "Action",
        renderer: (rowData) => {
          return (
            <Fragment>
              <IconButton
                aria-label="View"
                disabled={this.state.viewLoading}
                onClick={() => {
                
                  this.setState({
                    studentIddToSend:rowData.id,
                    selectedData:rowData
                  });
                  this.onReadOnly();
                  this.getCouresData(0);
                  this.getRegisteredCoursesData(rowData);
                  this.getPreviousCouresData(rowData)
                  this.getModulesData(rowData);
                  this.getModulesDropDownData(rowData);
                  this.getStudentAchivementsData(rowData);
                }}
              >
                <VisibilityOutlinedIcon />
              </IconButton>
              {/* 
              <Button
                disabled={this.state.viewLoading}
                style={{
                  fontSize: 12,
                  cursor: `${this.state.viewLoading ? "wait" : "pointer"}`,
                  display:"inline-block",
                  textTransform: "capitalize",
                }}
                variant="outlined"
                onClick={() => {
                  this.onReadOnly();
                  this.getCouresData(rowData);
                  this.getModulesData(rowData);
                  this.getStudentAchivementsData(rowData);
                }}
              >
                View
              </Button> 
              */}
              <IconButton
                aria-label="View"
                disabled={this.state.viewLoading}
                onClick={() => {
                  
                  this.setState({
                    studentIddToSend:rowData.id,
                    selectedData:rowData
                  });
                  this.getCouresData(0);
                  this.getRegisteredCoursesData(rowData);
                  this.getPreviousCouresData(rowData);
                  this.getModulesData(rowData);
                  this.getModulesDropDownData(rowData);
                  this.getStudentAchivementsData(rowData);
                  
                }}
              >
                <EditOutlinedIcon />
              </IconButton>
              {/* 
              <Button
                disabled={this.state.viewLoading}
                style={{
                  fontSize: 12,
                  cursor: `${this.state.viewLoading ? "wait" : "pointer"}`,
                  textTransform: "capitalize",
                }}
                variant="outlined"
                onClick={() => {
                  this.getCouresData(rowData);
                  this.getModulesData(rowData);
                  this.getStudentAchivementsData(rowData);
                }}
              >
                Edit
              </Button> 
              */}
            </Fragment>
          );
        },
        sortable: false,
        customStyleHeader: { width: "15%" },
      },
    ];

    return (
      <Fragment>
        <LoginMenu
          reload={this.state.isReload}
          open={this.state.isLoginMenu}
          handleClose={() => this.setState({ isLoginMenu: false })}
        />

        <StudentCourseSelectionAction
          onSave={() => this.onSaveClick()}
          open={this.state.isOpenActionMenu}
          handleClose={() => this.setState({ isOpenActionMenu: false, readOnly: false })}
          selectedData={this.state.selectedData}
          previousCoursesData={this.state.previousCoursesData}
          coursesData={this.state.coursesData}
          moduleData={this.state.moduleData}
          moduleId={this.state.moduleId}
          moduleDropDownData={this.state.moduleDropDownData}
          achivementsData={this.state.achivementsData}
          onClear={() => this.onCheckClear()}
          handleCheckboxChange={(e, value, type) =>
            this.handleCheckboxChange(e, value, type)
          }
          selectedCoursesData={this.state.selectedCoursesData}
          handleSetCourses={(value) => this.handleSetCourses(value)}
          readOnly={this.state.readOnly}
          handleChangeModuleDropDown={ (value) => this.handleChangeModuleDropDown(value)}
          selectedCoursesDataV2={this.state.selectedCoursesDataV2}
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
              Student Course Selection
            </Typography>
            <img alt="" src={ExcelIcon} onClick={() => this.downloadExcelData()} style={{
                      height: 30, width: 32,
                      cursor: `${this.state.isDownloadExcel ? 'wait' : 'pointer'}`,
                    }}
            />
            
          </div>
          <div>
          {this.state.totalStudents>1? 
              <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                textTransform: "capitalize",
                textAlign: "left",
                display: "inline"
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
          <StudentCourseSelectionFilter
            isLoading={this.state.isLoading}
            onClearFilters={this.onClearFilters}
            values={this.state}
            getDataByStatus={(status) => this.getData(status)}
            onHandleChange={(e) => this.onHandleChange(e)}
          />
          <div
            style={{
              marginTop: 15,
            }}
          >
            <TablePanel
              isShowIndexColumn
              data={this.state.admissionData}
              isLoading={this.state.isLoading}
              sortingEnabled
              columns={columns}
            />
          </div>
        </div>
        <form noValidate id="selectionForm" onSubmit={this.onFormSubmit}>
          <input name="sessionId" value={this.state.sessionId} type="hidden" />
          <input
            name="programmeGroupId"
            defaultValue={this.state.programmeId}
            type="hidden"
          />
          <input
            name="studentId"
            defaultValue={this.state.selectedData.id}
            type="hidden"
          />
          {//this.state.coursesData.map((item, i) => {
            this.state.selectedCoursesData.map((item, i) => {
              if (item.isRegistered === 1) {
                return (
                  <Fragment key={"coursesData" + i + item}>
                    <input name="courseId" value={item.id} type="hidden" />
                    <input name="isRepeat" value={item.isRepeat || 0} type="hidden" />
                    <input name="moduleNumber" value={item.moduleNumber || 0} type="hidden" />
                  </Fragment>
                );
              }
            })}
          <input type="submit" style={{ display: "none" }} id="courseSubmit" />
        </form>
      </Fragment>
    );
  }
}
export default StudentCourseSelection;
