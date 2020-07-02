import React, { Component, Fragment } from 'react';
import {Divider, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,TextField, IconButton, Tooltip} from '@material-ui/core';
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import Typography from "@material-ui/core/Typography";
import ExcelIcon from '../../../../assets/Images/excel.png';
import F08ReportsFilter from './F08ReportsFilter';
import TablePanel from '../../../../components/ControlledTable/RerenderTable/TablePanel';
import Button from '@material-ui/core/Button';
import LoginMenu from '../../../../components/LoginMenu/LoginMenu';
import { format } from 'date-fns'; 
import F08ReportsTableComponent from './F08ReportsTableComponent';
import FilterIcon from "mdi-material-ui/FilterOutline";
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import EditDeleteTableRecord from "../../../../components/EditDeleteTableRecord/EditDeleteTableRecord";

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

function ActionButton(props) {
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
    async function DeleteData(event) {
      event.preventDefault();
      //return;
      const data = new FormData(event.target);
      const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C08CommonProgrammesDelete`;
      await fetch(url, {
        method: "POST",
        body:data,
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
                    props.getData();
                } else {
                    alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
                }
                console.log(json);
            },
            error => {
                if (error.status === 401) {
                    // this.setState({
                    //     isLoginMenu: true,
                    //     isReload: true
                    // })
                } else {
                    alert('Failed to fetch, Please try again later.');
                    console.log(error);
                }
            });
    }
    return (
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <form
            id="myform"
            onSubmit={(event) => DeleteData(event)}
            autoComplete="off"
          >
            <DialogTitle id="form-dialog-title">Delete</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please provide the reason to delete the record.
              </DialogContentText>
              <input type="hidden" value={props.record_id} name="id"></input>
              <TextField
                autoFocus
                margin="dense"
                id="log_reason"
                name="logReason"
                label="Reason"
                type="text"
                fullWidth
                required
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Confirm
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        <IconButton
          onClick={handleClickOpen}
          //aonClick={(event) => DeleteData(props)}
        >
          <DeleteIcon fontSize="small" color="error"/>
        </IconButton>
        <IconButton
          onClick={(event) => (window.location = `#/dashboard/F08Form/${props.record_id}`)}
        >
          <EditIcon fontSize="small" style={{color:"#ff9800"}}/>
        </IconButton>
      </div>
    );
  }

class F08Reports extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            showTableFilter:false,
            showSearchBar:false,
            isDownloadExcel: false,
            applicationStatusId: 1,
            admissionData: [],
            genderData: [],
            degreeData: [],
            studentName: "",
            genderId: 0,
            degreeId: 0,
            applicationId: "",
            isLoginMenu: false,
            isReload: false,
            eventDate: null,
            isOpenSnackbar:false,
            snackbarMessage:"",
            snackbarSeverity:""

        };
    }

    getGenderData = async () => {
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C02CommonGendersView`;
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclAdminToken")
            })
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
                            isReload: true
                        })
                    } else {
                        alert('Failed to fetch, Please try again later.');
                        console.log(error);
                    }
                }
            );
    };

    getDegreesData = async () => {
        let data = [];
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C02CommonAcademicsDegreeProgramsView`;
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclAdminToken")
            })
        })
            .then((res) => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
                (json) => {
                    const resData = json.DATA || [];
                    if (resData.length > 0) {
                        for (let i = 0; i < resData.length; i++) {
                            if (!isEmpty(resData[i])) {
                                data.push({ id: "", label: resData[i].department });
                            }
                            for (let j = 0; j < resData[i].degrees.length; j++) {
                                if (!isEmpty(resData[i].degrees[j])) {
                                    data.push({
                                        id: resData[i].degrees[j].id,
                                        label: resData[i].degrees[j].label,
                                    });
                                }
                            }
                        }
                    }
                },
                (error) => {
                    if (error.status === 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: true
                        })
                    } else {
                        alert('Failed to fetch, Please try again later.');
                        console.log(error);
                    }
                }
            );
        this.setState({
            degreeData: data,
        });
    };


    onClearFilters = () => {
        this.setState({
            studentName: "",
            genderId: 0,
            degreeId: 0,
            applicationId: "",
            eventDate: null
        })
    }

    handleDateChange = (date) => {
        this.setState({
            eventDate: date
        });
    };


    onHandleFormClose = () => {
        this.setState({
            isOpenForm: false
        })
    };

    getAddmissionForm = async id => {
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C02AdmissionsProspectApplicationSubmittedApplicationsStudentProfileView?applicationId=${id}`;
        this.setState({
            isLoading: true
        })
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
                        if (json.DATA) {
                            if (json.DATA.length > 0) {
                                this.setState({
                                    addmissionForm: json.DATA[0] || {},
                                    isOpenForm: true
                                });
                            } else {
                                alert('Geting Data empty, Please try again later.')
                            }
                        } else {
                            alert('Geting Data empty, Please try again later.')
                        }
                    } else {
                        alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE)
                    }
                    console.log(json);
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

        const url2 = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C02AdmissionsProspectApplicationDocumentsView?applicationId=${id}`;
        await fetch(url2, {
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
                    if (json.DATA) {
                        this.setState({
                            documentsData: json.DATA || []
                        })
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
                }
            );

        this.setState({
            isLoading: false,
        })

    }

    downloadExcelData = async () => {
        if (this.state.isDownloadExcel === false) {
            this.setState({
                isDownloadExcel: true
            })
            const type = this.state.applicationStatusId === 2 ? 'Submitted' : 'Pending';
            const eventDataQuery = this.state.eventDate ? `&eventDate=${format(this.state.eventDate, "dd-MMM-yyyy")}` : '';
            const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C02AdmissionsProspectApplication${type}ApplicationsExcelDownload?applicationId=${this.state.applicationId}&genderId=${this.state.genderId}&degreeId=${this.state.degreeId}&studentName=${this.state.studentName}${eventDataQuery}`;
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
                            tempLink.setAttribute("download", `Applications${type}.xlsx`);
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

    handleOpenSnackbar = (msg, severity) => {
        this.setState({
            isOpenSnackbar:true,
            snackbarMessage:msg,
            snackbarSeverity:severity
        });
    };

    handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            isOpenSnackbar:false
        });
    };

    getData = async status => {
        this.setState({
            isLoading: true
        })
        const reload = status === 1 && this.state.applicationId === "" && this.state.genderId === 0 && this.state.degreeId === 0 && this.state.studentName === "";
        const type = status === 1 ? "Pending" : status === 2 ? "Submitted" : "Pending";
        const eventDataQuery = this.state.eventDate ? `&eventDate=${format(this.state.eventDate, "dd-MMM-yyyy")}` : '';
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C08CommonProgrammesView`;
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
                            admissionData: json.DATA || []
                        });
                        for (var i = 0; i < json.DATA.length; i++) {
                            
                                json.DATA[i].action = (
                                    <EditDeleteTableRecord
                                      recordId={json.DATA[i].ID}
                                      DeleteData={this.DeleteData}
                                      onEditURL={`#/dashboard/F08Form/${json.DATA[i].ID}`}
                                      handleOpenSnackbar={this.handleOpenSnackbar}
                                    />
                                  );
                           
                          }
                    } else {
                        this.handleOpenSnackbar(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE,"error");
                    }
                    console.log(json);
                },
                error => {
                    if (error.status === 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: reload
                        })
                    } else {
                        this.handleOpenSnackbar("Failed to fetch, Please try again later.","error");
                        console.log(error);
                    }
                });
        this.setState({
            isLoading: false
        })


    }
    DeleteData = async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C08CommonProgrammesDelete`;
        await fetch(url, {
          method: "POST",
          body:data,
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
                      this.handleOpenSnackbar("Deleted","success");
                      this.getData();
                  } else {
                      //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
                      this.handleOpenSnackbar(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE,"error");
                  }
                  console.log(json);
              },
              error => {
                  if (error.status === 401) {
                      this.setState({
                          isLoginMenu: true,
                          isReload: true
                      })
                  } else {
                      //alert('Failed to fetch, Please try again later.');
                      this.handleOpenSnackbar("Failed to fetch, Please try again later.","error")
                      console.log(error);
                  }
              });
        }

    DownloadFile = (fileName) => {
        const data = new FormData();
        data.append("fileName", fileName);
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
                        isReload: false
                    })
                    return {}
                } else {
                    alert('Operation Failed, Please try again later.');
                    return {}
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
                    alert(
                        "SQL Error (" +
                        result.CODE +
                        "): " +
                        result.USER_MESSAGE +
                        "\n" +
                        result.SYSTEM_MESSAGE
                    );
                } else if (result.CODE === 3) {
                    alert(
                        "Other Error (" +
                        result.CODE +
                        "): " +
                        result.USER_MESSAGE +
                        "\n" +
                        result.SYSTEM_MESSAGE
                    );
                } else if (result.error === 1) {
                    alert(result.error_message);
                } else if (result.success === 0 && result.redirect_url !== "") {
                    window.location = result.redirect_url;
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    onHandleChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
    };

    handleToggleTableFilter = () => {
        this.setState({showTableFilter:!this.state.showTableFilter});
    }

    handleToggleSearchBar = () => {
        this.setState({showSearchBar:!this.state.showSearchBar});
    }

    componentDidMount() {
        this.getData(this.state.applicationStatusId);
    }

    render() {
        // const columnsSubmitted = [
        //     //{ name: "SR#", dataIndex: "serialNo", sortable: false, customStyleHeader: { width: '7%' } },
        //     { name: "Id", dataIndex: "id", sortable: false, customStyleHeader: { width: '8%', textAlign: 'center' } },
        //     {name: "Name", renderer: rowData => { return (<Fragment>{`${rowData.firstName} ${rowData.lastName}`}</Fragment>)}, sortable: false, customStyleHeader: { width: '10%' }},
        //     { name: "Gender", dataIndex: "genderLabel", sortIndex: "genderLabel", sortable: true, customStyleHeader: { width: '12%' } },
        //     { name: "Degree Programme", dataIndex: "degreeLabel", sortIndex: "degreeLabel", sortable: true, customStyleHeader: { width: '17%', textAlign: 'center' }, align: 'center' },
        //     { name: "Mobile No", dataIndex: "mobileNo", sortable: false, customStyleHeader: { width: '13%' } },
        //     { name: "Email", dataIndex: "email", sortable: false, customStyleHeader: { width: '15%' } },
        //     { name: "Submission Date", dataIndex: "submittedOn", sortIndex: "submittedOn", sortable: true, customStyleHeader: { width: '15%' } },
        //     { name: "Payment Method", dataIndex: "paymentMethod", sortIndex: "paymentMethod", sortable: true, customStyleHeader: { width: '15%' } },
        //     { name: "Status", dataIndex: "status", sortIndex: "status", sortable: true, customStyleHeader: { width: '15%' } },
        //     { name: "Profile", renderer: rowData => {return (<Button style={{fontSize: 12,textTransform: 'capitalize'}} variant="outlined" onClick={() => window.open(`#/view-application/${rowData.id}`, "_blank")} >View</Button>)}, sortable: false, customStyleHeader: { width: '15%' }},
        // ]

        const columnsPending = [
            { name: "ID", title: "ID", customStyleHeader: {fontSize:"26px"}},
            { name: "shortLabel", title: "Short Label"},
            { name: "label", title: "Label"},
            { name: "programmeGroupsLabel", title: "Link Programme Groups"},
            { name: "action", title:"Action"}

        ]

        return (
            <Fragment>
                <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })} />
                <div style={{
                    padding: 20
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <Typography style={{ color: '#1d5f98', fontWeight: 600, textTransform: 'capitalize' }} variant="h5">
                             <Tooltip title="Back">
                                <IconButton onClick={() => window.history.back()}>
                                    <ArrowBackIcon fontSize="small" color="primary"/>
                                </IconButton>
                            </Tooltip>
                           Programmes Report
                        </Typography>
                        {/* <img alt="" src={ExcelIcon} onClick={() => this.downloadExcelData()} style={{
                            height: 30, width: 32,
                            cursor: `${this.state.isDownloadExcel ? 'wait' : 'pointer'}`,
                        }}
                        /> */}
                        <div style={{float:"right"}}>
                        {/* <Hidden xsUp={true}> */}
                                {/* <Tooltip title="Search Bar">
                                    <IconButton
                                        onClick={this.handleToggleSearchBar}
                                    >
                                        <FilterIcon fontSize="default" color="primary"/>
                                    </IconButton>
                                </Tooltip> */}
                            {/* </Hidden> */}
                            <Tooltip title="Table Filter">
                                <IconButton
                                    style={{ marginLeft: "-10px" }}
                                    onClick={this.handleToggleTableFilter}
                                >
                                    <FilterIcon fontSize="default" color="primary"/>
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                    <Divider style={{
                        backgroundColor: 'rgb(58, 127, 187)',
                        opacity: '0.3',
                    }} />
                    {this.state.showSearchBar ? 
                        <F08ReportsFilter isLoading={this.state.isLoading} handleDateChange={this.handleDateChange} onClearFilters={this.onClearFilters} values={this.state} getDataByStatus={status => this.getData(status)} onHandleChange={e => this.onHandleChange(e)} />
                        :
                        <br/>
                    }
                    <F08ReportsTableComponent 
                        data={this.state.admissionData} 
                        columns={columnsPending} 
                        showFilter={this.state.showTableFilter}
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
export default F08Reports;