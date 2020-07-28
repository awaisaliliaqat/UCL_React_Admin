import React, { Component, Fragment } from 'react';
import {Divider, IconButton, Tooltip, Switch} from '@material-ui/core';
import Typography from "@material-ui/core/Typography";
import F19FormFilter from './F19FormFilter';
import LoginMenu from '../../../../components/LoginMenu/LoginMenu';
import { format } from 'date-fns'; 
import F19FormTableComponent from './F19FormTableComponent';
import FilterIcon from "mdi-material-ui/FilterOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import BottomBar from "../../../../components/BottomBar/BottomBar";
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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

function Switches(props) {

    const [open, setOpen] = React.useState(false);
    const [dialogMsg, setDialogMsg] = React.useState("");
    const [switchState, setSwitchState] = React.useState(props.isChecked);
    
    const handleClickOpen = () => {
        if(switchState){
            setDialogMsg("Are you sure you want to deactivate?");
        }else{
            setDialogMsg("Are you sure you want to activate?");
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        if(switchState){
            //setSwitchState(event.target.checked);
            props.onChangeAction(props.recordId, 0, setSwitchState);
        }else{
            //setSwitchState(event.target.checked);
            props.onChangeAction(props.recordId, 1, setSwitchState);
        }
    };

    return (
        <Fragment>
            <Switch
                checked={switchState}
                //onChange={handleChange}
                onClick={handleClickOpen}
                color="primary"
                name="switch"
                inputProps={{ 'aria-label': 'primary checkbox' }}
            />
            <div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                    <Typography 
                        variant="subtitle1"
                        style={{ 
                            color: '#1d5f98', 
                            fontWeight: 600, 
                            textTransform: 'capitalize' 
                        }}
                    >        
                        Confirm !
                    </Typography>
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {dialogMsg}&emsp;
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        No
                    </Button>
                    <Button onClick={handleClose, handleChange} color="primary" variant="contained" autoFocus>
                        Yes
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </Fragment>
    );
  }

class F19Form extends Component {

    constructor(props) {
        super(props);
        this.state = {
            recordId: this.props.match.params.recordId,
            isLoading: false,
            showTableFilter:false,
            showSearchBar:false,
            isDownloadExcel: false,
            applicationStatusId: 1,
            tableData: [],
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

    getData = async status => {
        this.setState({
            isLoading: true
        })
        const reload = status === 1 && this.state.applicationId === "" && this.state.genderId === 0 && this.state.degreeId === 0 && this.state.studentName === "";
        const type = status === 1 ? "Pending" : status === 2 ? "Submitted" : "Pending";
        const eventDataQuery = this.state.eventDate ? `&eventDate=${format(this.state.eventDate, "dd-MMM-yyyy")}` : '';
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C19SessionActivationView`;
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
                        let result = {};
                        if(json.DATA){
                                                       
                            for (var i = 0; i < json.DATA.length; i++) {
                                json.DATA[i].admissionActivation = (
                                    <Switches 
                                        isChecked={json.DATA[i].isAdmissionActive?true:false}
                                        recordId={json.DATA[i].ID}
                                        onChangeAction={this.onAdmissionActivationSave}
                                    />
                                );
                                json.DATA[i].classesActivation = (
                                    <Switches 
                                        isChecked={json.DATA[i].isClassesActive?true:false}
                                        recordId={json.DATA[i].ID}
                                        onChangeAction={this.onClassesActivationSave}
                                    />
                                );
                            }

                            this.setState({
                                tableData: json.DATA || []
                            });
                        }

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
                            isReload: reload
                        })
                    } else {
                        //alert('Failed to fetch, Please try again later.');
                        this.handleOpenSnackbar("Failed to fetch, Please try again later.","error");
                        console.log(error);
                    }
                });
        this.setState({
            isLoading: false
        })
    }

    onAdmissionActivationSave = async(id, isActive, changeSwitch) => {
        const data = new FormData();
        data.append("id", id);
        data.append(" isActive", isActive);
        this.setState({isLoading: true});
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C19IsAdmissionsActiveUpdate`;
        await fetch(url, {
            method: "POST", 
            body: data, 
            headers: new Headers({
                Authorization: "Bearer "+localStorage.getItem("uclAdminToken")
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
                        changeSwitch(true);
                        if(this.state.recordId!=0){
                            window.location="#/dashboard/F19Form/0";
                        }else{
                            window.location.reload();
                        }
                    } else {
                        //alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE);
                        changeSwitch(false);
                        this.handleOpenSnackbar(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE,"error");
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
                        //alert("Failed to Save ! Please try Again later.");
                        this.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
                    }
                });
        this.setState({isLoading: false})
    }

    onClassesActivationSave = async(id, isActive, changeSwitch) => {
        const data = new FormData();
        data.append("id", id);
        data.append(" isActive", isActive);
        this.setState({isLoading: true});
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C19IsClassesActiveUpdate`;
        await fetch(url, {
            method: "POST", 
            body: data, 
            headers: new Headers({
                Authorization: "Bearer "+localStorage.getItem("uclAdminToken")
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
                        changeSwitch(true);
                        if(this.state.recordId!=0){
                            window.location="#/dashboard/F19Form/0";
                        }else{
                            window.location.reload();
                        }
                    } else {
                        //alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE);
                        changeSwitch(false);
                        this.handleOpenSnackbar(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE,"error");
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
                        //alert("Failed to Save ! Please try Again later.");
                        this.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
                    }
                });
        this.setState({isLoading: false})
    }

    handleToggleTableFilter = () => {
        this.setState({showTableFilter:!this.state.showTableFilter});
    }

    handleToggleSearchBar = () => {
        this.setState({showSearchBar:!this.state.showSearchBar});
    }

    componentDidMount() {
        this.getData(this.state.applicationStatusId);
    }

    componentWillReceiveProps(nextProps){
        if(this.props.match.params.recordId!=nextProps.match.params.recordId){
            if(nextProps.match.params.recordId!=0){
                this.getData(this.state.applicationStatusId);
            }else{
                window.location.reload();
            }
        }
    }

    render() {
        

        const columns = [
            { name: "SRNo", title: "SR#"},
            { name: "label", title: "Session\xa0Name"},
            { name: "admissionActivation", title: <span>{"Admission\xa0Activation"}<br/><Typography color="primary" variant="caption">(One at a time)</Typography></span>},
            { name: "classesActivation", title:<span>{"Classes\xa0Activation"}<br/><Typography color="primary" variant="caption">(One at a time)</Typography></span>},
            { name: "activatedOn", title:"Activation\xa0Date"},
            { name: "deactivatedOn", title:"Deactivation\xa0Date"}
        ]

        // const tableData = [
        //     { 
        //         ID:"", 
        //         sessionName: "", 
        //         admissionActivation:  <Typography color="primary">One at a time</Typography>,
        //         classesActivation: <Typography color="primary">One at a time</Typography>,
        //         activationDate:"",
        //         deactivationDate:""
        //     },
        //     { 
        //         ID:1, 
        //         sessionName: "2000-2001", 
        //         admissionActivation: <Switches isChecked={true}/>,
        //         classesActivation: <Switches isChecked={false}/>,
        //         activationDate:"01-Jan-2020",
        //         deactivationDate:"01-Jan-2020"
        //     },
        //     { 
        //         ID:2, 
        //         sessionName: "2001-2002", 
        //         admissionActivation: <Switch
        //             color="primary"
        //             name="switch" 
        //             onChange={this.onAdmissionActivationClick}
        //             inputProps={{ 'aria-label': 'primary checkbox' }} 
        //         />,
        //         classesActivation: <Switch
        //             color="primary"
        //             name="switch" 
        //             inputProps={{ 'aria-label': 'primary checkbox' }} 
        //         />,
        //         activationDate:"01-Jan-2020",
        //         deactivationDate:""
        //     },
        //     { 
        //         ID:3, 
        //         sessionName: "2002-2003", 
        //         admissionActivation: <Switch
        //             color="primary"
        //             name="switch" 
        //             inputProps={{ 'aria-label': 'primary checkbox' }} 
        //         />,
        //         classesActivation: <Switch
        //             color="primary"
        //             name="switch" 
        //             inputProps={{ 'aria-label': 'primary checkbox' }} 
        //         />,
        //         activationDate:"01-Jan-2020",
        //         deactivationDate:"01-Jan-2020"
        //     },
        //     { 
        //         ID:4, 
        //         sessionName: "2003-2004", 
        //         admissionActivation: <Switch
        //             color="primary"
        //             name="switch" 
        //             inputProps={{ 'aria-label': 'primary checkbox' }} 
        //         />,
        //         classesActivation: <Switch
        //             color="primary"
        //             name="switch" 
        //             inputProps={{ 'aria-label': 'primary checkbox' }} 
        //         />,
        //         activationDate:"",
        //         deactivationDate:""
        //     }
        // ]

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
                            {/* 
                            <Tooltip title="Back">
                                <IconButton onClick={() => window.history.back()}>
                                    <ArrowBackIcon fontSize="small" color="primary"/>
                                </IconButton>
                            </Tooltip> 
                            */}
                            Session Activation
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
                        <F19FormFilter 
                            isLoading={this.state.isLoading} 
                            handleDateChange={this.handleDateChange} 
                            onClearFilters={this.onClearFilters} 
                            values={this.state} 
                            getDataByStatus={status => this.getData(status)} 
                            onHandleChange={e => this.onHandleChange(e)} 
                        />
                        :
                        <br/>
                    }
                    <F19FormTableComponent 
                        //data={this.state.tableData} 
                        data={this.state.tableData}
                        columns={columns} 
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
export default F19Form;