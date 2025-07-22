import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/styles';
import { TextField, Grid, Divider, Typography, MenuItem, Chip, Checkbox, CircularProgress, Button, Fab, TableContainer ,Table, TableHead, TableBody, Tooltip, TableCell, TableRow, Paper } from '@material-ui/core';
import LoginMenu from '../../../../../components/LoginMenu/LoginMenu';
import BottomBar from "../../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import { DatePicker } from '@material-ui/pickers';
import { addDays, startOfDay, differenceInDays, isAfter, format } from 'date-fns';
import Autocomplete from "@material-ui/lab/Autocomplete";
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import DeleteIcon from "@material-ui/icons/Delete";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 500,
    border: "1px solid " + theme.palette.common.white,
  },
  body: {
    fontSize: 14,
    border: "1px solid " + theme.palette.primary.main,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const styles = (theme) => ({
    root: {
        padding: `0px ${theme.spacing(2)}px`,
    },
	title: {
		color: "#1d5f98",
		fontWeight: 600,
		textTransform: "capitalize",
	},
	divider: { 
		backgroundColor: "rgb(58, 127, 187)", opacity: "0.3" 
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
    table: {
        minWidth: 750
    }
});

class F359Form extends Component {

    constructor(props) { 
        super(props);
        this.state = {
            recordId: this.props.match.params.recordId,
            isLoading:  {
                employees : false,
                designation: false,
                loading: false,
                jobStatus: false
            },
            isOpenSnackbar:false,
            snackbarMessage:"",
            snackbarSeverity:"",
            isReload: false,
            fromDate: startOfDay(new Date()),
            employeeData: [],
            employeeDataLoading: false,
            employeeObject: null,
            employeeObjectError: "",
            designationMenuItems: [],
            designationLoading: false,
            designationObject: null,
            designationObjectError: "",
            jobStatusMenuItems: [],
            jobStatusId: "",
            jobStatusIdError: "",
            tableData : []
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

    getEmployeesData = async () => {
        this.setState(prevState => ({ isLoading: { ...prevState.isLoading, employees: true } }));
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C359CommonEmployeesDesignations/CommonEmployeesView`;
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
            const { CODE, DATA, USER_MESSAGE, SYSTEM_MESSAGE } = json;
            if (CODE === 1) {
                this.setState({ employeeData: DATA || [], });
            } else {
                this.handleOpenSnackbar(<span>{USER_MESSAGE}<br/>{SYSTEM_MESSAGE}</span>, "error" );
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
                this.handleOpenSnackbar("Failed to Get Data ! Please try Again later.", "error" );
            }
        });
        this.setState(prevState => ({ isLoading: { ...prevState.isLoading, employees: false } }));
    };

    loadDesignations = async () => {
        this.setState(prevState => ({ isLoading: { ...prevState.isLoading, designation: true } }));
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C359CommonEmployeesDesignations/DesignationsTypeView`;
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
                const { CODE, DATA, USER_MESSAGE, SYSTEM_MESSAGE } = json;
                if (CODE === 1) {
                    this.setState({ designationMenuItems: DATA || [] });
                } else {
                    this.handleOpenSnackbar(<span>{USER_MESSAGE}<br/>{SYSTEM_MESSAGE}</span>, "error" );
                }
            },
            (error) => {
                const { status } = error;
                if (status == 401) {
                    this.setState({
                        isLoginMenu: true,
                        isReload: true,
                    });
                } else {
                    console.error("loadDesignations: ", error);
                    this.handleOpenSnackbar("Failed to Get Designations Data ! Please try Again later.", "error" );
                }
            }
        );
        this.setState(prevState => ({ isLoading: { ...prevState.isLoading, designation: false } }));
    };

    loadJobStatus = async () => {
        this.setState(prevState => ({ isLoading: { ...prevState.isLoading, jobStatus: true } }));
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C359CommonEmployeesDesignations/JobStatusTypesView`;
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
        .then((json) => {
                const { CODE, DATA, USER_MESSAGE, SYSTEM_MESSAGE } = json;
                if (CODE === 1) {
                    this.setState({ jobStatusMenuItems: DATA || [] });
                } else {
                    this.handleOpenSnackbar(<span>{USER_MESSAGE}<br/>{SYSTEM_MESSAGE}</span>, "error" );
                }
            },
            (error) => {
                const { status } = error;
                if (status == 401) {
                    this.setState({
                        isLoginMenu: true,
                        isReload: true,
                    });
                } else {
                    console.error("loadJobStatus: ", error);
                    this.handleOpenSnackbar("Failed to Get JobStatus Data ! Please try Again later.", "error" );
                }
            }
        );
        this.setState(prevState => ({ isLoading: { ...prevState.isLoading, jobStatus: false } }));
    };

    /* loadData = async(id) => {
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
                        window.location = "#/dashboard/F359Form/0";
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
        
    } */

    isEmployeeValid = () => {
        let isValid = true;
        if (!this.state.employeeObject || !this.state.employeeObject.id) {
            this.setState({employeeObjectError:"Please select Employee."});
            document.getElementById("employeeObject").focus();
            isValid = false;
        } else {
            this.setState({employeeObjectError: ""});
        }
        return isValid;
    }

    isDesignationValid = () => {
        let isValid = true;
        if (!this.state.designationObject || !this.state.designationObject.id) {
            this.setState({designationObjectError:"Please select Designation."});
            document.getElementById("designationObject").focus();
            isValid = false;
        } else {
            this.setState({designationObjectError: ""});
        }
        return isValid;
    }

    isJobStatusValid = () => {
        let isValid = true;
        if (!this.state.jobStatusId) {
            this.setState({jobStatusIdError:"Please select Job Status."});
            document.getElementById("jobStatusId").focus();
            isValid = false;
        } else {
            this.setState({jobStatusIdError: ""});
        }
        return isValid;
    }

    handleAddRow = () => {

        if(!this.isEmployeeValid() || !this.isDesignationValid() || !this.isJobStatusValid()){ return; }
        const { employeeObject, designationObject, jobStatusId, fromDate } =  this.state;
        const employeeLabel  =  employeeObject?.label || "";
        const designationLabel  =  designationObject?.label || "";
        const jobStatusLabl  =  (this.state.jobStatusMenuItems || []).find(obj=>obj.ID===jobStatusId).Label || "";
        let tableData = [...this.state.tableData] || [];
        let tableDataObj = {
            employeeId: employeeObject.id,
            employeeLabel: employeeLabel,
            designationId: designationObject.id, 
            designationLabel: designationLabel, 
            jobStatusId : jobStatusId,
            jobStatusLabl: jobStatusLabl,
            fromDate: format(fromDate, "dd-MM-yyyy")
        }
        tableData.unshift(tableDataObj);
        this.setState({
            tableData: tableData,
            employeeObject: null,
            designationObject: null,
            jobStatusId: ""
        });
        console.table(tableData);
    }

    handleDeleteRow = (index) => {
        const tableData = [...this.state.tableData]; // clone array to avoid direct mutation
        tableData.splice(index, 1);
        this.setState({ tableData }); // update state to trigger re-render
    };

    clickOnFormSubmit=()=>{
        this.onFormSubmit();
    }

     onFormSubmit = async() => {
        const tableData = this.state.tableData || [];
        if (!tableData.length) {
            this.handleOpenSnackbar(<span>Add employee first</span>, "warning");
            return;
        }
        let data = new FormData();
        tableData.forEach(obj => {
            data.append("employeeId", obj.employeeId);
            data.append("designationId", obj.designationId);
            data.append("jobStatusId", obj.jobStatusId);
            data.append("fromDate", obj.fromDate);
        });
        this.setState(prevState => ({ isLoading: { ...prevState.isLoading, loading: true } }));
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C359CommonEmployeesDesignations/Save`;
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
                const { CODE, USER_MESSAGE, SYSTEM_MESSAGE } = json;
                if (CODE === 1) {
                    this.handleOpenSnackbar(USER_MESSAGE,"success");
                    this.setState({
                        employeeObject: null,
                        designationObject: null,
                        jobStatusId: "",
                        tableData: []
                    });
                } else {
                    this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>,"error");
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
        this.setState(prevState => ({ isLoading: { ...prevState.isLoading, loading: false } }));
    }
    
    viewReport = () => {
        window.location = "#/dashboard/F359Reports";
    }

    onHandleChange = e => {
        const { name, value } = e.target;
        const errName = `${name}Error`;
        this.setState({
            [name]: value,
            [errName]: ""
        });
    }

    componentDidMount() {
        this.props.setDrawerOpen(false);
        this.loadDesignations();
        this.getEmployeesData();   
        this.loadJobStatus();
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
                        <Grid item xs={12}>
                            <Typography className={classes.title} variant="h5">
                                Employees Designations
                            </Typography>
                            <Divider 
                                style={{
                                    backgroundColor: 'rgb(58, 127, 187)',
                                    opacity: '0.3'
                                }} 
                            />
                            <br/>
                        </Grid>
                        <Grid 
                            container 
                            spacing={2}
                            alignItems='center'
                        >
                            <Grid item xs={12} md={3}>
                                <Autocomplete
                                    id="employeeObject"
                                    fullWidth
                                    aria-autocomplete="none"
                                    getOptionLabel={(option) => option.label || ''} // Ensure label is properly passed
                                    getOptionSelected={(option, value) => option.id === value.id}
                                    options={this.state.employeeData}
                                    loading={this.state.isLoading.employees}
                                    value={this.state.employeeObject || null} // Ensure it's an array
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
                            <Grid item xs={12} md={3}>
                                <Autocomplete
                                    id="designationObject"
                                    fullWidth
                                    aria-autocomplete="none"
                                    getOptionLabel={(option) => option.label || ''} // Ensure label is properly passed
                                    getOptionSelected={(option, value) => option.id === value.id}
                                    options={this.state.designationMenuItems}
                                    loading={this.state.isLoading.designation}
                                    value={this.state.designationObject || null} // Ensure it's an array
                                    onChange={(e, value) =>
                                        this.onHandleChange({
                                            target: { name: "designationObject", value },
                                        })
                                    }
                                    renderInput={(params) => {
                                        const inputProps = params.inputProps;
                                        return (
                                            <TextField
                                                variant="outlined"
                                                error={!!this.state.designationObjectError}
                                                helperText={this.state.designationObjectError}
                                                inputProps={inputProps}
                                                label="Designation *"
                                                {...params}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                      <React.Fragment>
                                                        {this.state.isLoading?.designation ? <CircularProgress color="inherit" size={20} /> : null}
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
                                                        name="designationId" 
                                                        type='hidden' 
                                                        value={option.id} 
                                                    />
                                                </Fragment>
                                            );
                                        })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    name="jobStatusId"
                                    label="Job Status"
                                    required
                                    fullWidth
                                    variant="outlined"
                                    select
                                    onChange={this.onHandleChange}
                                    value={this.state.jobStatusId}
                                    error={!!this.state.jobStatusIdError}
                                    helperText={this.state.jobStatusIdError}
                                    SelectProps={{
                                        id : "jobStatusId",
                                        style: {paddingRight:0},
                                        endAdornment: (
                                            <>
                                                {this.state.isLoading?.jobStatus ? (
                                                <CircularProgress color="inherit" size={20} style={{marginRight:36, height:"inherit"}}/>
                                                ) : null}
                                            </>
                                        )
                                    }}
                                    
                                >
                                    <MenuItem value="" disabled><em>None</em></MenuItem>
                                    {this.state.jobStatusMenuItems?.map((d, i) => 
                                        <MenuItem key={"jobStatusMenuItems"+d.ID} value={d.ID}>{d.Label}</MenuItem>
                                    )}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={2}>
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
                                    value={this.state.fromDate}
                                    onChange={(date) =>
                                        this.onHandleChange({
                                            target: { name: "fromDate", value: date },
                                        })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} md={1}>
                                <Button
                                    color='primary'
                                    variant='outlined'
                                    fullWidth
                                    size='large'
                                    onClick={e=>this.handleAddRow()}
                                    style={{padding:8}}
                                >
                                    <AddOutlinedIcon fontSize="large" color="primary" />
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <TableContainer component={Paper}>
                                    <Table
                                        className={classes.table}
                                        size="small"
                                        aria-label="customized table"
                                    >
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center" style={{ borderLeft: "1px solid rgb(29, 95, 152)" }}>SR#</StyledTableCell>
                                            <StyledTableCell align="center">ID</StyledTableCell>
                                            <StyledTableCell align="center">Employee</StyledTableCell>
                                            <StyledTableCell align="center">Designation</StyledTableCell>
                                            <StyledTableCell align="center">Job Status</StyledTableCell>
                                            <StyledTableCell align="center">From Date</StyledTableCell>
                                            <StyledTableCell align="center" style={{ borderRight: "1px solid rgb(29, 95, 152)", width: 50 }} >Action</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.tableData.length > 0 ? (
                                        this.state.tableData.map((dt, i) => {
                                            const { employeeId, employeeLabel, designationLabel, jobStatusLabl, fromDate } = dt;
                                            return (
                                            
                                            <StyledTableRow key={"tableData-"+i}>
                                                <StyledTableCell component="th" scope="row" align="center">{i + 1}</StyledTableCell>
                                                <StyledTableCell align="center">{employeeId}</StyledTableCell>
                                                <StyledTableCell align="center">{employeeLabel}</StyledTableCell>
                                                <StyledTableCell align="center">{designationLabel}</StyledTableCell>
                                                <StyledTableCell align="center">{jobStatusLabl}</StyledTableCell>
                                                <StyledTableCell align="center">{fromDate}</StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <Tooltip title="Delete">
                                                        <Fab
                                                            color="secondary"
                                                            aria-label="Delete"
                                                            size="small"
                                                            style={{
                                                                height: 36,
                                                                width: 36,
                                                                margin: 4,
                                                            }}
                                                            onClick={(e)=>this.handleDeleteRow(i)}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </Fab>
                                                    </Tooltip>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        )})
                                        ) : (
                                        <StyledTableRow key={1}>
                                            <StyledTableCell component="th" scope="row" colSpan={7}>
                                                <center> <b>No Data</b> </center>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                        )}
                                    </TableBody>
                                    </Table>
                                </TableContainer>
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
                    disableRightButton={!this.state.tableData.length}
                    loading={this.state.isLoading.employees || this.state.isLoading.designation || this.state.isLoading.jobStatus || this.state.isLoading.loading}
                    isDrawerOpen={ this.props.isDrawerOpen}
                />
                <CustomizedSnackbar
                    isOpen={this.state.isOpenSnackbar}
                    message={this.state.snackbarMessage}
                    severity={this.state.snackbarSeverity}
                    handleCloseSnackbar={this.handleCloseSnackbar}
                />
            </Fragment>
        );
    }
}

export default withStyles(styles)(F359Form);