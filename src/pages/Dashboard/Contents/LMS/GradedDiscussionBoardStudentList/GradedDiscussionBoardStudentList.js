import React, { Component, Fragment } from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";
import GradedDiscussionBoardStudentListFilters from './Chunks/GradedDiscussionBoardStudentListFilters';
import GradedDiscussionBoardStudentListAction from './Chunks/GradedDiscussionBoardStudentListAction';
import TablePanel from '../../../../../components/ControlledTable/RerenderTable/TablePanel';
import Button from '@material-ui/core/Button';
import LoginMenu from '../../../../../components/LoginMenu/LoginMenu';
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import PropTypes from 'prop-types'

class GradedDiscussionBoardStudentList extends Component {

    constructor(props) {
        super(props);
        this.state = {

            gdaId: this.props.match.params.id,

            isLoading: false,

            admissionData: [],

            isLoginMenu: false,
            isReload: false,

            studentId: "",

            selectedData: {},
            openMenu: false,

            givenMarks: "",
            givenMarksError: "",

            isOpenSnackbar: false,
            snackbarMessage: "",
            snackbarSeverity: "",

        }
    }

    componentDidMount() {
        this.getData();
    }

    onClearFilters = () => {
        this.setState({
            studentId: ""
        })
    }

    handleClose = () => {
        this.setState({
            openMenu: false,
            selectedData: {}
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
            isLoading: true,
        });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C41CommonAcademicsGradedDiscussionsBoardStudentsView?gdaId=${this.state.gdaId}&studentId=${this.state.studentId || ""}`;
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

    onRecordClick = (data = {}) => {
        this.setState({
            selectedData: data,
            givenMarks: data.obtainedMarks || "",
            openMenu: true
        })
    }

    onHandleChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value,
            givenMarksError: ""
        })
    }

    handleDateChange = (date, name) => {
        this.setState({
            [name]: date
        });
    }

    isFormValid = () => {
        let { givenMarksError } = this.state;
        const { totalMarks } = this.state.selectedData;
        let isValid = true;
        if (!this.state.givenMarks) {
            isValid = false;
            givenMarksError = "Please enter marks";
        } else {
            if (Number(this.state.givenMarks) < 0) {
                isValid = false;
                givenMarksError = "Please enter valid marks";
            } else if (Number(totalMarks) < Number(this.state.givenMarks)) {
                isValid = false;
                givenMarksError = "Given marks can't be greater than total marks";
            } else {
                givenMarksError = "";
            }
        }
        this.setState({
            givenMarksError
        })
        return isValid;
    }

    onSaveClick = async (e, id) => {
        e.preventDefault();
        if (this.isFormValid()) {
            this.setState({
                isLoading: true,
            });
            const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C41CommonAcademicsGradedDiscussionsBoardStudentMarksSave?id=${id}&givenMarks=${this.state.givenMarks}`;
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
                            this.handleOpenSnackbar(json.USER_MESSAGE, "success");
                            this.getData();
                            setTimeout(() => {
                                this.setState({
                                    selectedData: {},
                                    openMenu: false,
                                    givenMarks: "",
                                    givenMarksError: ""
                                })
                            }, 1000);

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
        }

    }


    render() {
        const columns = [
            { name: "Nucleus Id", dataIndex: "studentId", sortable: false, customStyleHeader: { width: '10%' }, align: 'cenetr' },
            {
                name: "Student Name", dataIndex: "studentName", sortable: false, customStyleHeader: { width: '13%' }, customStyleColumn: {
                    textTransform: 'capitalize', backgroundColor: 'transparent',
                    wordBreak: 'break-all'
                }
            },
            { name: "Submitted On", dataIndex: "createdOn", sortable: false, customStyleHeader: { width: '13%' } },
            {
                name: "Obtained Marks", renderer: rowData => {
                    return (
                        <Fragment>
                            {rowData.obtainedMarks || ""}
                        </Fragment>
                    )
                }, sortable: false, customStyleHeader: { width: '13%' }
            },
            { name: "Total Marks", dataIndex: "totalMarks", sortable: false, customStyleHeader: { width: '13%' } },
            {
                name: "Status", renderer: rowData => {
                    return (
                        <Fragment>
                            {rowData.isUploaded === 1 ? 'Submitted' : 'Pending'}
                        </Fragment>
                    )
                }, sortable: false, customStyleHeader: { width: '13%' }
            },
            {
                name: "Action", renderer: rowData => {
                    return (
                        <Button style={{
                            fontSize: 12,
                            textTransform: 'capitalize'
                        }} variant="outlined" onClick={() => this.onRecordClick(rowData)} disabled={rowData.isUploaded === 0}>
                            View
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
                    <GradedDiscussionBoardStudentListFilters isLoading={this.state.isLoading}
                        handleDateChange={(date, name) => this.handleDateChange(date, name)}
                        onClearFilters={this.onClearFilters} values={this.state}
                        getDataByStatus={() => this.getData()} onHandleChange={e => this.onHandleChange(e)} />

                    <GradedDiscussionBoardStudentListAction open={this.state.openMenu} handleClose={() => this.handleClose()}
                        data={this.state.selectedData} onHandleChange={this.onHandleChange}
                        state={this.state} onSaveClick={(e, id) => this.onSaveClick(e, id)}
                    />
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

GradedDiscussionBoardStudentList.propTypes = {
    match: PropTypes.object,
}

GradedDiscussionBoardStudentList.defaultProps = {
    match: {
        params: {
            id: 0
        }
    }
}

export default GradedDiscussionBoardStudentList;