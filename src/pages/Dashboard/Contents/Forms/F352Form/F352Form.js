import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/styles';
import { TextField, Grid, Divider, Typography, MenuItem, Chip, Checkbox, CircularProgress } from '@material-ui/core';
import LoginMenu from '../../../../../components/LoginMenu/LoginMenu';
import { numberExp } from '../../../../../utils/regularExpression';
import BottomBar from "../../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { DatePicker } from '@material-ui/pickers';
import { isBefore, addDays, startOfDay, toDate, parse, differenceInDays, isAfter } from 'date-fns';
import Autocomplete from "@material-ui/lab/Autocomplete";
import { from } from 'seamless-immutable';

const styles = (theem) => ({
    root: {
        padding: theem.spacing(2),
    },
    formControl: {
        minWidth: '100%',
    },
    sectionTitle: {
        fontSize: 19,
        color: '#174a84',
    },
    checkboxDividerLabel: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 20,
        fontSize: 16,
        fontWeight: 600
    },
    rootProgress: {
        width: '100%',
        textAlign: 'center',
    },
});

class F352Form extends Component {

    constructor(props) { 
        super(props);
        this.state = {
            recordId: this.props.match.params.recordId,
            isLoading:  {
                employees : false,
                leaveTypes : false,
                userRoleType : false
            },
            isReload: false,
            leaveTypeMenuItems:[],
            leaveTypeId: "1",
            leaveTypeIdError:"",
            fromDate: new Date(),
            fromDateError: "",
            toDate: addDays(new Date(), 1),
            toDateError: "",
            noOfDays: Math.abs(differenceInDays(addDays(new Date(), 1), new Date()))+1,
            noOfDaysError: "",
            userRoleTypeMenuItems: [],
            employeeRoleTypeMenuItems: [],
            employeeRoleTypeId: "",
            employeeRoleTypeIdError: "",
            employeeData: [],
            employeeDataLoading: false,
            employeeObject: [],
            employeeObjectError: "",
            isOpenSnackbar:false,
            snackbarMessage:"",
            snackbarSeverity:""
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

    loadLeaveTypes = async() => {
        this.setState(prevState => ({ isLoading: { ...prevState.isLoading, leaveTypes:true } }));
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C352CommonEmployeesLeavePlans/CommonLeaveTypesView`;
        await fetch(url, {
            method: "POST",
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
        .then(json => {
            if (json.CODE === 1) {
                if(json.DATA.length){
                    this.setState({
                        leaveTypeMenuItems: json.DATA
                    });
                } else {
                    window.location = "#/dashboard/F352Form/0";
                }
            } else {
                //alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE);
                this.handleOpenSnackbar(json.SYSTEM_MESSAGE+'\n'+json.USER_MESSAGE,"error");
            }
            console.log("loadLeaveTypes:", json);
        },
        error => {
            if (error.status == 401) {
                this.setState({
                    isLoginMenu: true,
                    isReload: true
                })
            } else {
                console.log(error);
                // alert("Failed to Save ! Please try Again later.");
                this.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
            }
        });
        this.setState(prevState => ({ isLoading: { ...prevState.isLoading, leaveTypes: false } }));
    }

    getEmployeeRoleTypeData = async () => {
        this.setState(prevState => ({ isLoading: { ...prevState.isLoading, userRoleType: true } }));
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C352CommonEmployeesLeavePlans/CommonEmployeesRolesTypesView`;
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
        .then((json) => {
                if (json.CODE === 1) {
                    this.setState({ employeeRoleTypeMenuItems: json.DATA || [], });
                } else {
                    this.handleOpenSnackbar(<span>{json.USER_MESSAGE}<br/>{json.SYSTEM_MESSAGE}</span>, "error" );
                }
                console.log("getEmployeeRoleTypeData: ", json);
            },
            (error) => {
                if (error.status == 401) {
                    this.setState({
                        isLoginMenu: true,
                        isReload: true,
                    });
                } else {
                    console.log("getEmployeeRoleTypeData: ", error);
                    this.handleSnackbar( true, "Failed to Get Data ! Please try Again later.", "error" );
                }
            }
        );
        this.setState(prevState => ({ isLoading: { ...prevState.isLoading, userRoleType: false } }));
    };

    getEmployeeRoleData = async (employeeRoleTypeId) => {
        employeeRoleTypeId = parseInt(employeeRoleTypeId);
        if(isNaN(employeeRoleTypeId)){ employeeRoleTypeId = 0;}
        this.setState(prevState => ({
            isLoading: { 
              ...prevState.isLoading, 
              employees: true 
            }
        }));
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C352CommonEmployeesLeavePlans/CommonUserEmployeesRolesView?employeeRoleTypeId=${employeeRoleTypeId}`;
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
        .then((json) => {
                if (json.CODE === 1) {
                    let data = json.DATA || [];
                    let dataLength = data.length;
                    let employeeObject = [];
                    if(dataLength){
                        for(let i=0; i<dataLength; i++){
                            employeeObject.push({id: data[i].userId, label: data[i].userLabel});
                        }
                    }
                    this.setState({ 
                        employeeObject,
                        employeeObjectError: "",
                        userRoleTypeMenuItems: data 
                    });
                } else {
                    this.handleOpenSnackbar(<span>{json.USER_MESSAGE}<br/>{json.SYSTEM_MESSAGE}</span>, "error" );
                }
                console.log("getEmployeeRoleData: ", json);
            },
            (error) => {
                if (error.status == 401) {
                    this.setState({
                        isLoginMenu: true,
                        isReload: true,
                    });
                } else {
                    console.log("getEmployeeRoleData: ", error);
                    this.handleSnackbar( true, "Failed to Get Data ! Please try Again later.", "error" );
                }
            }
        );
        this.setState(prevState => ({ isLoading: { ...prevState.isLoading, employees: false } }));
    };

    getEmployeesData = async () => {
        this.setState(prevState => ({ isLoading: { ...prevState.isLoading, employees: true } }));
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C352CommonEmployeesLeavePlans/CommonUsersView`;
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
        .then((json) => {
                if (json.CODE === 1) {
                    this.setState({ employeeData: json.DATA || [], });
                } else {
                    this.handleSnackbar( true, json.USER_MESSAGE + "\n" + json.SYSTEM_MESSAGE, "error" );
                }
                console.log("getEmployeesData: ", json);
            },
            (error) => {
                if (error.status == 401) {
                    this.setState({
                        isLoginMenu: true,
                        isReload: true,
                    });
                } else {
                    console.log("getEmployeesData: ", error);
                    this.handleSnackbar( true, "Failed to Get Data ! Please try Again later.", "error" );
                }
            }
        );
        this.setState(prevState => ({ isLoading: { ...prevState.isLoading, employees: false } }));
    };

    loadData = async(id) => {
        let parseId = parseInt(id);
        if(isNaN(parseId)){ parseId=0;}
        const data = new FormData();
        data.append("id", parseId);
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C352CommonEmployeesLeavePlans/View`;
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
        .then( json => {
                if (json.CODE === 1) {
                    if(json.DATA.length){
                        let data = json.DATA[0];
                        this.setState({
                            leaveTypeMenuItems: [{id:data.leaveTypeId, label: data.leaveTypeLabel}],
                            leaveTypeId: data.leaveTypeId,
                            fromDate: data.startOnDate,
                            toDate: data.endOnDate,
                            noOfDays: data.noOfDays,
                            employeeData: [{id: data.userId, label: data.userLabel}],
                            employeeObject: [{id: data.userId, label: data.userLabel}]
                        });
                    }else{
                        window.location = "#/dashboard/F352Form/0";
                    }
                } else {
                    //alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE);
                    this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
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
                    // alert("Failed to Save ! Please try Again later.");
                    this.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
                }
            }
        );
        
    }

    islabelValid = () => {
        let isValid = true;
        if (!this.state.leaveTypeId) {
            this.setState({leaveTypeIdError:"Please select Leave Type."});
            document.getElementById("leaveTypeId").focus();
            isValid = false;
        } else {
            this.setState({leaveTypeIdError:""});
        }
        return isValid;
    }

    isDateValid = () => {
        let isValid = true;
        if (isAfter(startOfDay(this.state.fromDate), startOfDay(this.state.toDate))) {
            this.setState({toDateError:"The ToDate should be later than the FromDate."});
            document.getElementById("toDate").focus();
            isValid = false;
        } else {
            this.setState({toDateError: ""});
        }
        return isValid;
    }

    isEmployeeValid = () => {
        let isValid = true;
        if (!this.state.employeeObject.length) {
            this.setState({employeeObjectError:"Please select Employee."});
            document.getElementById("employeeObject").focus();
            isValid = false;
        } else {
            this.setState({employeeObjectError: ""});
        }
        return isValid;
    }

    clickOnFormSubmit=()=>{
        this.onFormSubmit();
    }

     onFormSubmit = async(e) => {
        //e.preventDefault();
        if(
            !this.islabelValid() || 
            !this.isDateValid() ||
            !this.isEmployeeValid()
        ){ return; }
        let myForm = document.getElementById('myForm');
        const data = new FormData(myForm);
        this.setState({isLoading: true});
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C352CommonEmployeesLeavePlans/Save`;
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
                        //alert(json.USER_MESSAGE);
                        this.handleOpenSnackbar(json.USER_MESSAGE,"success");
                        setTimeout(()=>{
                            if(this.state.recordId!=0){
                                window.location="#/dashboard/F352Reports";
                            }else{
                                window.location.reload();
                            }
                        }, 2000);
                    } else {
                        //alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE)
                        this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
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
    
    viewReport = () => {
        window.location = "#/dashboard/F352Reports";
    }

    onHandleChange = e => {
        const { name, value } = e.target;
        const errName = `${name}Error`;
        switch (name) {
            case "label":
                break;
            case "employeeRoleTypeId":
                if(value){
                    this.getEmployeeRoleData(value);
                } else {
                    this.setState({ employeeObject : [] });
                }
                break;
            case "fromDate":
                this.setState({noOfDays: Math.abs(differenceInDays(this.state.toDate, value))+1 });
                break;
            case "toDate":
                this.setState({noOfDays: Math.abs(differenceInDays(value ,this.state.fromDate))+1 });
            break;
            
            default:
            
        }
        this.setState({
            [name]: value,
            [errName]: ""
        });
    }

    componentDidMount() {
        this.props.setDrawerOpen(false);
        if (this.props.match.params.recordId!=0) {
            this.loadData(this.props.match.params.recordId);
        } else {
            this.loadLeaveTypes();
            this.getEmployeeRoleTypeData();
            this.getEmployeesData();
        }
        
    }

    componentDidUpdate(prevProps) {
        // Check if recordId has changed
        if (prevProps.match.params.recordId !== this.props.match.params.recordId) {
            if (this.props.match.params.recordId != "0") {
                this.props.setDrawerOpen(false);
                this.loadData(this.props.match.params.recordId);
            } else {
                window.location.reload();
            }
        }
    }

    render() {

        const { classes } = this.props;

        return (
            <Fragment>
                <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })} />
                <form id="myForm" onSubmit={this.isFormValid}>
                    <TextField type="hidden" name="recordId" value={this.state.recordId}/>
                    <Grid 
                        container 
                        component="main" 
                        className={classes.root}
                    >
                        <Typography 
                            style={{
                                color: '#1d5f98', 
                                fontWeight: 600, 
                                borderBottom: '1px solid #d2d2d2',
                                width: '100%', 
                                marginBottom: 25, 
                                fontSize: 20
                            }} 
                            variant="h5"
                        >
                            Employees Leave Plan
                        </Typography>
                        <Divider 
                            style={{
                                backgroundColor: 'rgb(58, 127, 187)',
                                opacity: '0.3'
                            }} 
                        />
                        <Grid 
                            container 
                            spacing={2}
                        >
                            <Grid item xs={12} sm={12} md={3}>
                                <TextField
                                    name="leaveTypeId"
                                    label="Leave Type"
                                    required
                                    fullWidth
                                    variant="outlined"
                                    select
                                    readOnly
                                    onChange={this.onHandleChange}
                                    value={this.state.leaveTypeId}
                                    error={!!this.state.leaveTypeIdError}
                                    helperText={this.state.leaveTypeIdError}
                                    SelectProps={{
                                        id : "leaveTypeId",
                                        readOnly: true,
                                        style: {paddingRight:0},
                                        endAdornment: (
                                            <>
                                              {this.state.isLoading?.leaveTypes ? (
                                                <CircularProgress color="inherit" size={20} style={{marginRight:36, height:"inherit"}}/>
                                              ) : null}
                                            </>
                                        )
                                    }}
                                    
                                >
                                    <MenuItem value="" disabled><em>None</em></MenuItem>
                                    {this.state.leaveTypeMenuItems?.map((d, i) => 
                                        <MenuItem key={"leaveTypeMenuItems"+d.id} value={d.id}>{d.label}</MenuItem>
                                    )}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <DatePicker
                                    autoOk
                                    id="fromDate"
                                    name="fromDate"
                                    label="From Date"
                                    invalidDateMessage=""
                                    placeholder=""
                                    variant="inline"
                                    inputVariant="outlined"
                                    format="dd-MM-yyyy"
                                    fullWidth
                                    required
                                    minDate={parse('2024-09-01', 'yyyy-MM-dd', new Date())}
                                    maxDate={parse('2025-08-31', 'yyyy-MM-dd', new Date())}
                                    value={this.state.fromDate}
                                    onChange={(date) =>
                                        this.onHandleChange({
                                            target: { name: "fromDate", value: date },
                                        })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <DatePicker
                                    autoOk
                                    id="toDate"
                                    name="toDate"
                                    label="To Date"
                                    invalidDateMessage=""
                                    error={!!this.state.toDateError}
                                    helperText={this.state.toDateError}
                                    placeholder=""
                                    variant="inline"
                                    inputVariant="outlined"
                                    format="dd-MM-yyyy"
                                    fullWidth
                                    required
                                    minDate={parse('2024-09-01', 'yyyy-MM-dd', new Date())}
                                    maxDate={parse('2025-08-31', 'yyyy-MM-dd', new Date())}
                                    value={this.state.toDate}
                                    onChange={(date) =>
                                        this.onHandleChange({
                                            target: { name: "toDate", value: date },
                                        })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <TextField
                                    id="noOfDays"
                                    name="noOfDays"
                                    label="No of Days"
                                    placeholder=""
                                    variant="outlined"
                                    fullWidth
                                    required
                                    readOnly
                                    value={this.state.noOfDays}
                                    //onChange={this.onHandleChange}
                                    error={!!this.state.noOfDaysError}
                                    helperText={this.state.noOfDaysError}
                                    Autocomplete={false}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    name="employeeRoleTypeId"
                                    label="Employee Role"
                                    fullWidth
                                    variant="outlined"
                                    select
                                    onChange={this.onHandleChange}
                                    value={this.state.employeeRoleTypeId}
                                    error={!!this.state.employeeRoleTypeIdError}
                                    helperText={this.state.employeeRoleTypeIdError}
                                    SelectProps={{
                                        id : "employeeRoleTypeId",
                                        style: {paddingRight:0},
                                        endAdornment: (
                                            <>
                                              {this.state.isLoading?.userRoleType ? (
                                                <CircularProgress color="inherit" size={20} style={{marginRight:36, height:"inherit"}}/>
                                              ) : null}
                                            </>
                                        )
                                    }}
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {this.state.employeeRoleTypeMenuItems?.map((d, i) => 
                                        <MenuItem key={"leaveTypeMenuItems"+d.id} value={d.id}>{d.label}</MenuItem>
                                    )}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <Autocomplete
                                    id="employeeObject"
                                    multiple
                                    fullWidth
                                    disableCloseOnSelect
                                    aria-autocomplete="none"
                                    getOptionLabel={(option) => option.label || ''} // Ensure label is properly passed
                                    getOptionSelected={(option, value) => option.id === value.id}
                                    options={this.state.employeeData}
                                    loading={this.state.isLoading.employees}
                                    value={this.state.employeeObject || []} // Ensure it's an array
                                    onChange={(e, value) =>
                                        this.onHandleChange({
                                            target: { name: "employeeObject", value },
                                        })
                                    }
                                    renderInput={(params) => {
                                        const inputProps = params.inputProps;
                                        return (
                                            <TextField
                                                variant="outlined"
                                                error={!!this.state.employeeObjectError}
                                                helperText={this.state.employeeObjectError}
                                                inputProps={inputProps}
                                                label="Employee *"
                                                {...params}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                      <React.Fragment>
                                                        {this.state.isLoading?.employees ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                      </React.Fragment>
                                                    ),
                                                }}
                                            />
                                        );
                                    }}
                                    renderOption={(option, value) => {
                                        // Check if the option is selected by looking at the value array
                                        // console.info(props, " : ", option);
                                        return (
                                            <div key={option.id} style={{ display: 'flex', alignItems: 'center' }}>
                                                <Checkbox color='primary' checked={value.selected} />
                                                {option.label} {/* Ensure the label is being correctly passed here */}
                                            </div>
                                        );
                                    }}
                                    renderTags={(tagValue, getTagProps) =>
                                        tagValue.map((option, index) => {
                                            //console.info(option, ":" , index, " ::", {...getTagProps({ index })} );
                                            return (
                                                <Fragment key={option.id}>
                                                    <Chip
                                                        label={option.label}
                                                        color="primary"
                                                        variant="outlined"
                                                        style={{
                                                            borderRadius: "0.3rem"
                                                        }}
                                                        {...getTagProps({ index })}
                                                    />
                                                    <TextField 
                                                        name="employeeId" 
                                                        type='hidden' 
                                                        value={option.id} 
                                                    />
                                                </Fragment>
                                            );
                                        })
                                    }
                                />
                            </Grid>
                            <Grid 
                                item 
                                xs={12} 
                                style={{ 
                                    paddingBottom: 20, 
                                    paddingTop: 20, 
                                    display: 'flex' 
                                }}
                            >
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
                <BottomBar
                    leftButtonText="View"
                    leftButtonHide={false}
                    bottomLeftButtonAction={this.viewReport}
                    right_button_text="Save"
                    bottomRightButtonAction={this.clickOnFormSubmit}
                    loading={this.state.isLoading.employees || this.state.isLoading.leaveTypes || this.state.isLoading.userRoleType}
                    isDrawerOpen={ this.props.isDrawerOpen}
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

export default withStyles(styles)(F352Form);