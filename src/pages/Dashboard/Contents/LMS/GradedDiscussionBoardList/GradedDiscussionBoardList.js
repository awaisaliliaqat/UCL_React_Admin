import React, { Component, Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";
import GradedDiscussionBoardListFilters from './Chunks/GradedDiscussionBoardListFilters';
import TablePanel from '../../../../../components/ControlledTable/RerenderTable/TablePanel';
import Button from '@material-ui/core/Button';
import LoginMenu from '../../../../../components/LoginMenu/LoginMenu';
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

class GradedDiscussionBoardList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,

            admissionData: [],

            isLoginMenu: false,
            isReload: false,

            startDate: null,
            dueDate: null,
            sectionId: 0,
            sectionData: [],

            isOpenSnackbar: false,
            snackbarMessage: "",
            snackbarSeverity: "",

        }
    }

    componentDidMount() {
        this.getData();
        this.getSectionsData();
    }

    onClearFilters = () => {
        this.setState({
            startDate: null,
            dueDate: null,
            sectionId: 0
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

    getSectionsData = async () => {
        this.setState({ isLoading: true });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C42CommonAcademicsSectionsTeachersView`;
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
                        this.setState({ sectionData: json.DATA || [] });
                    } else {
                        this.handleOpenSnackbar(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE, "error");
                    }
                    console.log(json);
                },
                (error) => {
                    if (error.status == 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: true,
                        });
                    } else {
                        console.log(error);
                        this.handleOpenSnackbar(
                            "Failed to fetch, Please try again later.",
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
        const startDateQuery = this.state.startDate ? `&startDate=${format(this.state.startDate, "dd-MM-yyyy")}` : '';
        const dueDateQuery = this.state.dueDate ? `&dueDate=${format(this.state.dueDate, "dd-MM-yyyy")}` : '';
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C41CommonAcademicsGradedDiscussionsBoardView?sectionId=${this.state.sectionId}${startDateQuery}${dueDateQuery}`;
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
                            admissionData: json.DATA || [],
                        });
                    } else {
                        this.handleOpenSnackbar(json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE, "error");
                    }
                    console.log("getData", json);
                },
                (error) => {
                    if (error.status === 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: true,
                        });
                    } else {
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

    onHandleChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
    }

    handleDateChange = (date, name) => {
        this.setState({
            [name]: date
        });
    }

    render() {
        const columns = [
            { name: "Topic", dataIndex: "label", sortable: false, customStyleHeader: { width: '13%' } },
            { name: "Section", dataIndex: "sectionLabel", sortable: false, customStyleHeader: { width: '15%' } },
            { name: "Start Date", dataIndex: "startDate", sortable: false, customStyleHeader: { width: '13%' } },
            { name: "Due Date", dataIndex: "dueDate", sortable: false, customStyleHeader: { width: '13%' } },
            { name: "Total Marks", dataIndex: "totalMarks", sortable: false, customStyleHeader: { width: '13%' } },
            {
                name: "Action", renderer: rowData => {
                    console.log(rowData);
                    return (
                        <Button style={{
                            fontSize: 12,
                            textTransform: 'capitalize'
                        }} variant="outlined">
                            <Link target="_blank" to={`/dashboard/graded-discussion-board-list/${rowData.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                                View List
                             </Link>
                        </Button>
                    )
                }, sortable: false, customStyleHeader: { width: '13%' }
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
                            Graded Discussion Board
                        </Typography>
                    </div>
                    <Divider style={{
                        backgroundColor: 'rgb(58, 127, 187)',
                        opacity: '0.3',
                    }} />
                    <GradedDiscussionBoardListFilters isLoading={this.state.isLoading} handleDateChange={(date, name) => this.handleDateChange(date, name)} onClearFilters={this.onClearFilters} values={this.state} getDataByStatus={() => this.getData()} onHandleChange={e => this.onHandleChange(e)} />
                    <div style={{
                        marginTop: 15,
                        marginBottom: 15,
                        color: '#174A84',
                        font: 'Bold 16px Lato',
                        letterSpacing: '1.8px'
                    }}>
                    </div><TablePanel isShowIndexColumn data={this.state.admissionData} isLoading={this.state.isLoading} sortingEnabled columns={columns} />

                </div>

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
export default GradedDiscussionBoardList;