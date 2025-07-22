import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";
import { Button, TextField } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import LoginMenu from '../../../../../components/LoginMenu/LoginMenu';
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { withStyles } from "@material-ui/styles";
import Autocomplete from '@material-ui/lab/Autocomplete';

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

const styles = () => ({
    item: {
        display: 'flex',
        flexDirection: 'column',
        marginRight: 10,
    },
    resize: {
        padding: 10
    },
    label: {
        textAlign: 'left',
        font: 'bold 14px Lato',
        letterSpacing: 0,
        color: '#174A84',
        opacity: 1,
        marginTop: 5,
        marginBottom: 5,
        inlineSize: 'max-content'
    },
});


class GradedDiscussionSummary extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,

            topicId: "",
            topicObject: {},
            topicIdError: "",
            topicData: [],

            isLoginMenu: false,
            isReload: false,

            isOpenSnackbar: false,
            snackbarMessage: "",
            snackbarSeverity: "",

        }
    }

    componentDidMount() {
        this.getTopicData();
    }

    getTopicData = async () => {
        this.setState({ isLoading: true });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C45CommonAcademicsGradedDiscussionsBoardView`;
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
                    if (json.CODE == 1) {
                        this.setState({ topicData: json.DATA || [] });
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
                            "Failed to load topic data, Please try again later.",
                            "error"
                        );
                    }
                }
            );
        this.setState({ isLoading: false });
    };

    downloadPdfData = async () => {
        if (!this.state.topicId) {
            this.setState({
                topicIdError: "Please select topic"
            })
            return;
        } else {
            this.setState({
                topicIdError: ""
            })
        }
        this.setState({
            isLoading: true

        })
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C45CommonAcademicsGradedDiscussionsBoardPdfDownload?topicId=${this.state.topicId}`;
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
                return {};
            })
            .then(
                json => {
                    if (json) {
                        var csvURL = window.URL.createObjectURL(json);
                        var tempLink = document.createElement("a");
                        tempLink.setAttribute("download", `GBDSummary.pdf`);
                        tempLink.href = csvURL;
                        tempLink.click();
                        console.log(json);
                    } else {
                        this.handleOpenSnackbar("Failed to generate summary", "error");
                    }
                },
                error => {
                    if (error.status === 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: false
                        })
                    } else {
                        this.handleOpenSnackbar("Failed to generate summary", "error");
                        console.log(error);
                    }
                });
        this.setState({
            isLoading: false
        })
    }

    onHandleChange = e => {
        const { name, value } = e.target;
        const errName = `${name}Error`;
        this.setState({
            [name]: value,
            [errName]: ""
        })
    }

    handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            isOpenSnackbar: false
        });
    };

    handleOpenSnackbar = (msg, severity) => {
        this.setState({
            isOpenSnackbar: true,
            snackbarMessage: msg,
            snackbarSeverity: severity
        });
    };

    onAutoCompleteChange = (e, value) => {
        let object = isEmpty(value) ? {} : value;
        this.setState({
            topicObject: object,
            topicId: object.id || "",
            topicIdError: ""
        })
    }

    render() {
        const { isLoading } = this.state;
        const { classes } = this.props;

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
                            Graded Discussion Summary
            </Typography>
                    </div>
                    <Divider style={{
                        backgroundColor: 'rgb(58, 127, 187)',
                        opacity: '0.3',
                    }} />

                    <div style={{ display: 'flex', marginTop: 20 }}>

                        <div className={classes.item} style={{
                            width: '25%'
                        }}>
                            <span className={classes.label}>Title *</span>
                            <Autocomplete
                                id="teacherId"
                                getOptionLabel={(option) => option.label}
                                fullWidth
                                value={this.state.topicObject}
                                onChange={this.onAutoCompleteChange}
                                size="small"
                                options={this.state.topicData}
                                renderInput={(params) => <TextField error={this.state.topicIdError} variant="outlined" placeholder="Titles" {...params}
                                />}
                            />
                        </div>

                        <div style={{
                            marginTop: 15,
                            marginBottom: 15,
                            color: '#174A84',
                            font: 'Bold 16px Lato',
                            letterSpacing: '1.8px'
                        }}>
                        </div>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={isLoading}
                            onClick={() => this.downloadPdfData()}
                            style={{
                                textTransform: 'capitalize',
                                width: 300,
                                height: 40,
                                marginTop: 25
                            }}
                        > {isLoading ? <CircularProgress style={{ color: 'white' }} size={24} /> : "Download GDB Summary Report"}</Button>
                    </div>
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

GradedDiscussionSummary.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(GradedDiscussionSummary);