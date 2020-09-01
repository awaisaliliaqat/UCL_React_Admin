import React, { Component, Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";
import ChangeStudentStatusFilter from './Chunks/ChangeStudentStatusFilter';
import TablePanel from '../../../../../components/ControlledTable/RerenderTable/TablePanel';
import Checkbox from '@material-ui/core/Checkbox';
import LoginMenu from '../../../../../components/LoginMenu/LoginMenu';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import BottomBar from '../../../../../components/BottomBar/BottomBar';
import CustomizedSnackbar from '../../../../../components/CustomizedSnackbar/CustomizedSnackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button } from '@material-ui/core';

class ChangeStudentStatus extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            studentData: [],
            editRecord: [],
            studentId: "",
            sessionId: "",
            sessionData: [],
            isLoginMenu: false,
            isReload: false,


            isOpenSnackbar: false,
            snackbarMessage: "",
            snackbarSeverity: "",

        }
    }

    componentDidMount() {
        this.getSessionData();
        this.getData();
    }

    onClearFilters = () => {
        this.setState({
            studentId: ""
        })
    }

    handleOpenSnackbar = (msg, severity) => {
        this.setState({
            isOpenSnackbar: true,
            snackbarMessage: msg,
            snackbarSeverity: severity,
        });
    };

    handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        this.setState({
            isOpenSnackbar: false,
        });
    };

    getData = async () => {
        this.setState({
            isLoading: true
        })
        const reload = this.state.studentId === "";
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C50CommonStudentsView?studentId=${this.state.studentId}`;
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
                            studentData: json.DATA || []
                        })
                    } else {
                        this.handleOpenSnackbar(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE, "error");
                    }
                    this.setState({
                        isLoading: false
                    })
                    console.log(json);
                },
                error => {
                    if (error.status === 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: reload
                        })
                    } else {
                        this.handleOpenSnackbar("Failed to load Students Data ! Please try Again later.", "error");
                        console.log(error);
                    }
                    this.setState({
                        isLoading: false
                    })
                });



    }

    getSessionData = async () => {
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C50CommonAcademicsSessionsView`;
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
                            sessionData: json.DATA || []
                        })
                    } else {
                        this.handleOpenSnackbar(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE, "error");
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
                        this.handleOpenSnackbar("Failed to load Students Data ! Please try Again later.", "error");
                        console.log(error);
                    }
                });
    }

    onFormSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        this.setState({ isLoading: true });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C50CommonStudentsSave`;
        await fetch(url, {
            method: "POST",
            body: data,
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
                        this.handleOpenSnackbar(json.USER_MESSAGE, "success");
                        setTimeout(() => window.location.reload(), 1000)
                    } else {
                        this.handleOpenSnackbar(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE, "error");
                    }
                    console.log(json);
                },
                error => {
                    if (error.status == 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: false
                        })
                    } else {
                        console.log(error);
                        this.handleOpenSnackbar("Failed to Save ! Please try Again later.", "error");
                    }
                });
        this.setState({ isLoading: false })
    }

    clickOnFormSubmit = (type = "") => {
        if (this.state.editRecord.length > 0) {
            document.getElementById("statusValue").value = type;
            document.getElementById("onStatusSubmitButton").click();
        }
    }

    onHandleChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
    }

    onCheckClick = (e, row = {}) => {
        const { checked } = e.target;
        let { editRecord } = this.state;
        if (checked) {
            editRecord.push({ id: row.id, checked: checked });
        } else {
            const editIndex = editRecord.findIndex(item => item.id === row.id);
            editRecord.splice(editIndex, 1);
        }
        this.setState({
            editRecord
        })

    }

    render() {
        const columnsSubmitted = [
            { name: "Nucleus Id", dataIndex: "studentId", sortable: false, customStyleHeader: { width: '13%', textAlign: 'center' } },
            {
                name: "Name", renderer: rowData => {
                    return (
                        <Fragment>{`${rowData.firstName} ${rowData.lastName}`}</Fragment>
                    )
                }, sortable: false, customStyleHeader: { width: '15%' }
            },
            { name: "Gender", dataIndex: "genderLabel", sortIndex: "genderLabel", sortable: true, customStyleHeader: { width: '13%' } },
            { name: "Degree Programme", dataIndex: "degreeLabel", sortIndex: "degreeLabel", sortable: true, customStyleHeader: { width: '20%', textAlign: 'center' }, align: 'center' },
            { name: "Mobile No", dataIndex: "mobileNo", sortable: false, customStyleHeader: { width: '15%' } },
            { name: "Email", dataIndex: "email", sortable: false, customStyleHeader: { width: '20%' } },
            { name: "Session", dataIndex: "sessionLabel", sortable: false, customStyleHeader: { width: '15%' } },
            { name: "Status", dataIndex: "statusLabel", sortable: false, customStyleHeader: { width: '15%' } },
            {
                name: "Selection", renderer: rowData => {
                    return (
                        <Checkbox
                            icon={<CheckBoxOutlineBlankIcon style={{ fontSize: 30 }} />}
                            checkedIcon={<CheckBoxIcon style={{ fontSize: 30 }} />}
                            color="primary"
                            onChange={(e) => this.onCheckClick(e, rowData)}
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                    )
                }, sortable: false, customStyleHeader: { width: '15%' }
            },
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
                            Change Student Status
            </Typography>
                    </div>
                    <Divider style={{
                        backgroundColor: 'rgb(58, 127, 187)',
                        opacity: '0.3',
                    }} />
                    <ChangeStudentStatusFilter isLoading={this.state.isLoading} onClearFilters={this.onClearFilters} values={this.state} getDataByStatus={() => this.getData()} onHandleChange={e => this.onHandleChange(e)} />

                    <div style={{
                        marginTop: 15,
                        marginBottom: 15,
                        color: '#174A84',
                        font: 'Bold 16px Lato',
                        letterSpacing: '1.8px'
                    }}>
                    </div><TablePanel isShowIndexColumn data={this.state.studentData} isLoading={this.state.isLoading} sortingEnabled columns={columnsSubmitted} />

                </div>
                <form noValidate onSubmit={this.onFormSubmit}>
                    <input type="hidden" name="sessionId" value={this.state.sessionId} />
                    <input type="hidden" id="statusValue" name="status" value="" />
                    {this.state.editRecord.map(item => {
                        if (item.checked) {
                            return (
                                <Fragment key={item.id}>
                                    <input name="studentId" value={item.id} type="hidden" />
                                </Fragment>
                            )
                        }
                    })}
                    <input type="submit" id="onStatusSubmitButton" style={{ display: "none" }} />
                </form>
                <BottomBar
                    left_button_hide
                    right_button_text="Activate"
                    disableRightButton={!this.state.sessionId || this.state.editRecord.length <= 0}
                    bottomRightButtonAction={() => this.clickOnFormSubmit(1)}
                    loading={this.state.isLoading}
                    otherActions={
                        <Fragment>
                            <Button disabled={!this.state.sessionId || this.state.editRecord.length <= 0 || this.state.isLoading}
                                style={{ marginRight: 10 }} variant="contained" color="secondary" onClick={() => this.clickOnFormSubmit(0)}>
                                {this.state.isLoading ? <CircularProgress style={{
                                    color: 'white', paddingLeft: 40,
                                    paddingRight: 40
                                }} size={24} /> : 'Deactivate'}

                            </Button>
                        </Fragment>
                    }
                />
                <CustomizedSnackbar
                    isOpen={this.state.isOpenSnackbar}
                    message={this.state.snackbarMessage}
                    severity={this.state.snackbarSeverity}
                    handleCloseSnackbar={() => this.handleCloseSnackbar()}
                />
            </Fragment>
        );
    }
}
export default ChangeStudentStatus;