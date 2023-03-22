import React, { Component, Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import AssignAccountIdFiltter from './Chunks/AssignAccountIdFiltter';
import TablePanel from '../../../../../components/ControlledTable/RerenderTable/TablePanel';
import LoginMenu from '../../../../../components/LoginMenu/LoginMenu';
import AssignAcccountIdMenu from './Chunks/AssignAcccountIdMenu';

class OfferLetter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            admissionData: [],
            selectedData: {},
            applicationId: "",
            applicationStatusId: 1,
            accountId: "",
            accountIdError: "",
            isLoginMenu: false,
            isReload: false,
            isOpenAssignMenu: false,
            saveLoading: false,
            academicSessionMenuItems: [],
            academicSessionId: 0,
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
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C10CommonAcademicSessionsView`;
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
        const reload = this.state.applicationStatusId === 1;
        const academicSessionId = this.state.academicSessionId ? this.state.academicSessionId : 0;
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C10CommonStudentsView?statusId=${this.state.applicationStatusId}&applicationId=${this.state.applicationId}&academicSessionId=${academicSessionId}`;
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

    onClearFilters = () => {

        this.setState({
            applicationId: ""
        })
    }

    onSaveClick = async (e, id) => {
        e.preventDefault();
        this.setState({
            saveLoading: true
        })
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C10CommonStudentsAccountsIdSave?id=${id}&accountsId=${this.state.accountId}`;
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
                        alert("Id assigned");
                        this.setState({
                            isOpenAssignMenu: false
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
                        alert('Failed to Save, Please try again later.');
                        console.log(error);
                    }
                });
        this.setState({
            saveLoading: false,
        })

    }

    onHandleChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
    }

    handleClose = () => {
        this.setState({ isOpenAssignMenu: false });
        this.getData();
    }

    render() {
        const columns = [
            { name: "Application Id", dataIndex: "applicationId", sortable: false, customStyleHeader: { width: '15%' } },
            { name: "Nucleus Id", dataIndex: "studentId", sortable: false, customStyleHeader: { width: '14%' } },

            {
                name: "Name", renderer: rowData => {
                    return (
                        <Fragment>{`${rowData.firstName} ${rowData.lastName}`}</Fragment>
                    )
                }, sortable: false, customStyleHeader: { width: '10%' }
            },
            { name: "Gender", dataIndex: "genderLabel", sortIndex: "genderLabel", sortable: true, customStyleHeader: { width: '10%' } },
            { name: "Degree Programme", dataIndex: "degreeLabel", sortIndex: "degreeLabel", sortable: true, customStyleHeader: { width: '20%', textAlign: 'center' }, align: 'center' },
            { name: "Mobile No", dataIndex: "mobileNo", sortable: false, customStyleHeader: { width: '14%' } },
            { name: "Email", dataIndex: "email", sortable: false, customStyleHeader: { width: '20%' } },
            { name: "Account Id", dataIndex: "accountsId", sortable: false, customStyleHeader: { width: '14%' } },
            {
                name: "Action", renderer: rowData => {
                    return (
                        <Button key={rowData.id} style={{
                            fontSize: 11,
                            textTransform: 'capitalize'
                        }} variant="outlined" onClick={() => this.setState({ selectedData: rowData, isOpenAssignMenu: true, accountId: rowData.accountsId })} >
                            Assign Id
                        </Button>
                    )
                }, sortable: false, customStyleHeader: { width: '15%' }
            },
        ]

        return (
            <Fragment>
                <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })} />
                <AssignAcccountIdMenu values={this.state} onSaveClick={(e, id) => this.onSaveClick(e, id)} onHandleChange={e => this.onHandleChange(e)} open={this.state.isOpenAssignMenu} handleClose={() => this.handleClose()} />
                <div style={{
                    padding: 20
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <Typography style={{ color: '#1d5f98', fontWeight: 600, textTransform: 'capitalize' }} variant="h5">
                            Assign Accounts Id
            </Typography>
                    </div>
                    <Divider style={{
                        backgroundColor: 'rgb(58, 127, 187)',
                        opacity: '0.3',
                    }} />
                    <AssignAccountIdFiltter isLoading={this.state.isLoading} onClearFilters={this.onClearFilters} values={this.state} getDataByStatus={() => this.getData()} onHandleChange={e => this.onHandleChange(e)} />
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