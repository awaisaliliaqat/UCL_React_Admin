import React, { Component, Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import OfferLetterFilter from './Chunks/OfferLetterFilter';
import TablePanel from '../../../../../components/ControlledTable/RerenderTable/TablePanel';
import LoginMenu from '../../../../../components/LoginMenu/LoginMenu';
import OfferLetterMenu from './Chunks/OfferLetterMenu';

class OfferLetter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [],
            filesError: "",
            isLoading: false,
            admissionData: [],
            offerLetterData: [],
            addmissionForm: {},
            selectedData: {},
            applicationId: "",
            isLoginMenu: false,
            isReload: false,
            isOpenOfferLetterMenu: false,
            academicSessionMenuItems: [],
            academicSessionId: 64,
            academicSessionIdError: ""

        }
    }

    componentDidMount() {
        this.getData();
        this.loadAcademicSessions();

    }
    handleOpenSnackbar = (msg, severity) => {
        this.setState({
          isOpenSnackbar: true,
          snackbarMessage: msg,
          snackbarSeverity: severity,
        });
      };

    getDataById = async id => {
        this.setState({
            isLoading: true
        })
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C05AdmissionsProspectApplicationForOfferLetterView?applicationId=${id}`;
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
                            this.setState({
                                selectedData: json.DATA[0] || {}
                            })
                        }
                    } else {
                        alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
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
        this.setState({
            isLoading: false
        })


    }
    loadAcademicSessions = async () => {
        this.setState({ isLoading: true });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C05CommonAcademicSessionsView`;
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

    getData = async () => {
        this.setState({
            isLoading: true
        })
        const applicationId = this.state.applicationId ? this.state.applicationId : 0;
        const academicSessionId = this.state.academicSessionId ? this.state.academicSessionId : 0;
        const reload = applicationId === 0;
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C05AdmissionsProspectApplicationForOfferLetterView?applicationId=${applicationId}&academicSessionId=${academicSessionId}`;
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
                        })
                    } else {
                        alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
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
                        alert('Failed to fetch, Please try again later.');
                        console.log(error);
                    }
                });
        this.setState({
            isLoading: false
        })


    }


    onUploadFile = async (e, id) => {
        e.preventDefault();
        this.setState({
            uploadLoading: true
        })
        const formData = new FormData(e.target);
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C05AdmissionsProspectApplicationOfferLetterUpload`;
        await fetch(url, {
            method: "Post",
            body: formData,
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
                        alert("file uploaded.");
                        this.setState({
                            files: [],
                            filesError: ""
                        })
                        this.getDataById(id);
                    } else {
                        alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
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
        this.setState({
            uploadLoading: false,
        })


    }

    onClearFilters = () => {

        this.setState({
            applicationId: ""
        })
    }

    handleFileChange = event => {
        const { files = [] } = event.target;
        if (files.length > 0) {
            if (files[0].type === "application/pdf") {
                this.setState({
                    files,
                    filesError: ""
                })
            } else {
                this.setState({
                    filesError: "Please select only pdf file."
                })
            }
        }

    }

    handleOnBtnClick = () => {
        if (this.state.files.length > 0) {
            this.setState({
                filesError: ""
            })
            return true;
        } else {
            this.setState({
                filesError: "Please select a file."
            })
            return false
        }
    }

    onDeleteClick = async (e, data = {}) => {
        e.preventDefault();
        this.setState({
            isLoading: true
        })
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C05AdmissionsProspectApplicationOfferLetterDelete?offerLetterId=${data.offerLetterId}`;
        await fetch(url, {
            method: "Post",
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
                        alert("File Deleted.");
                        this.getDataById(data.id);
                    } else {
                        alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
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
        this.setState({
            isLoading: false,
        })

    }

    onSendClick = async (e, id) => {
        e.preventDefault();
        this.setState({
            sendLoading: true
        })
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C05AdmissionsProspectApplicationOfferLetterSendEmail?applicationId=${id}`;
        await fetch(url, {
            method: "Post",
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
                        alert("Offer Letter sent");
                        this.setState({
                            files: [],
                            filesError: "",
                            isOpenOfferLetterMenu: false
                        })
                        this.getData();
                    } else {
                        alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
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
        this.setState({
            sendLoading: false,
        })

    }

    onHandleChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
    }

    DownloadFile = (e, data) => {
        e.preventDefault();
        const fileName = data.offerLetterFileName || "";
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

    handleClose = () => {
        this.setState({ isOpenOfferLetterMenu: false });
        this.getData();
    }

    render() {
        const columns = [
            { name: "Id", dataIndex: "id", sortable: false, customStyleHeader: { width: '8%', textAlign: 'center' } },
            {
                name: "Name", renderer: rowData => {
                    return (
                        <Fragment>{`${rowData.firstName} ${rowData.lastName}`}</Fragment>
                    )
                }, sortable: false, customStyleHeader: { width: '10%' }
            },
            { name: "Gender", dataIndex: "genderLabel", sortIndex: "genderLabel", sortable: true, customStyleHeader: { width: '10%' } },
            { name: "Degree Programme", dataIndex: "degreeLabel", sortIndex: "degreeLabel", sortable: true, customStyleHeader: { width: '17%', textAlign: 'center' }, align: 'center' },
            { name: "Mobile No", dataIndex: "mobileNo", sortable: false, customStyleHeader: { width: '13%' } },
            { name: "Email", dataIndex: "email", sortable: false, customStyleHeader: { width: '20%' } },
            { name: "Reg Fee Payment Status", dataIndex: "paymentStatusLabel", sortable: false, customStyleHeader: { width: '17%' } },
            { name: "Status", dataIndex: "statusLabel", sortable: false, customStyleHeader: { width: '15%' } },
            {
                name: "Action", renderer: rowData => {
                    return (
                        <Button key={rowData.id} style={{
                            fontSize: 11,
                            textTransform: 'capitalize'
                        }} variant="outlined" onClick={() => this.setState({ selectedData: rowData, isOpenOfferLetterMenu: true })} >
                            {rowData.statusId === 6 ? 'View' : rowData.isOfferLetterUploaded === 1 ? 'Send' : 'Upload'}
                        </Button>
                    )
                }, sortable: false, customStyleHeader: { width: '15%' }
            },
        ]

        return (
            <Fragment>
                <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })} />
                <OfferLetterMenu onDownloadClick={(e, data) => this.DownloadFile(e, data)} onDeleteClick={(e, data) => this.onDeleteClick(e, data)} values={this.state} onSendClick={(e, id) => this.onSendClick(e, id)} handleOnBtnClick={() => this.handleOnBtnClick()} onUploadFile={(e, id) => this.onUploadFile(e, id)} handleFileChange={e => this.handleFileChange(e)} open={this.state.isOpenOfferLetterMenu} handleClose={() => this.handleClose()} />
                <div style={{
                    padding: 20
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <Typography style={{ color: '#1d5f98', fontWeight: 600, textTransform: 'capitalize' }} variant="h5">
                            Offer Letter Dashboard
            </Typography>
                    </div>
                    <Divider style={{
                        backgroundColor: 'rgb(58, 127, 187)',
                        opacity: '0.3',
                    }} />
                    <OfferLetterFilter isLoading={this.state.isLoading} onClearFilters={this.onClearFilters} values={this.state} getDataByStatus={() => this.getData()} onHandleChange={e => this.onHandleChange(e)} />
                    <div style={{
                        marginTop: 15,
                        marginBottom: 15,
                        color: '#174A84',
                        font: 'Bold 16px Lato',
                        letterSpacing: '1.8px'
                    }}>
                    </div>
                    <TablePanel isShowIndexColumn data={this.state.admissionData} isLoading={this.state.isLoading} sortingEnabled columns={columns} />

                </div>
            </Fragment>
        );
    }
}
export default OfferLetter;