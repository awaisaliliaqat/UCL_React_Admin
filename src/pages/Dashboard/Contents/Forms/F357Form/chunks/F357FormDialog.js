import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@material-ui/core';
import { numberExp } from "../../../../../../utils/regularExpression";
import { Skeleton } from '@material-ui/lab';
import AddIcon from '@material-ui/icons/Add';
import { DatePicker } from '@material-ui/pickers';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { format, parse } from "date-fns";
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';

const useStyles = makeStyles((theme) => ({
    main: {
        padding: theme.spacing(2)
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    tableContainer : {
        height:150, 
		overflow:"auto",
        /* width */
		'&::-webkit-scrollbar' : {
            width: 5,
        },
        /* Track */
        '&::-webkit-scrollbar-track' : {
            background: "rgba(0, 0, 0, 0.05)", 
        }, 
        /* Handle */
        "&::-webkit-scrollbar-thumb" : {
            background: "rgba(0, 0, 0, 0.1)", 
        },
        /* Handle on hover */
        '&::-webkit-scrollbar-thumb:hover' : {
            background: "rgba(0, 0, 0, 0.2)",
        }
    },
    table: {
        width: '100%',
    },
    tableHeadCell: {
        fontWeight: 'bold',
        textAlign: 'left',
        backgroundColor: theme.palette.primary.main,
        color: "white"
    },
    tableRowHover: {
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({ handleOpenSnackbar, openDialog, handleOpenDialog, handleCloseDialog, rowData, handleIsExistUpdate }) {

    const classes = useStyles();

    const initialStates = {
        firstName: rowData?.firstName,
        lastName: rowData?.lastName,
        displayName: rowData?.displayName,
        joiningDate: rowData?.joiningDateLabel,
        leavingDate: rowData?.leavingDateLabel,
        email: rowData?.email,
        address: rowData?.address,
        phone : rowData?.mobileNo,
        roles: rowData?.rolesLabel,
        jobStatus: rowData?.jobStatusLabel,
        statusLabel: rowData?.statusLabel,
        commentDate : new Date(),
        comment: "",
        commentError: "",
        commentData: [],
        rate: 0,
        rateNextYear: 0,
        rateIncreasePer: 0,
        salary: 0,
        salaryNextYear: 0,
        salaryIncreasePer: 0

    };
    const [state, setState] = useState(initialStates);

    const initialLoadingStates = {
        employeePayroll : false,
        teacherSections: false
    };
    const [isLoading, setIsLoading] = useState(initialLoadingStates);
    const [teacherSectionsData, setTeacherSectionsData] = useState([]);
    const [payrollData, setPayrollData] = useState([]);

    const getTeacherSectionDetails = async() => {
        setIsLoading((prevState) => {
            return ({ ...prevState, [`teacherSections`]: true });
        });
        let data =  new FormData();
        data.append("employeeId", rowData?.id);
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C357CommonEmployeesSalaryIncrementRevisionSheet/TeacherSectionsView`;
		await fetch(url, {
			method: "POST",
			body: data,
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
				const {CODE, DATA, USER_MESSAGE, SYSTEM_MESSAGE} = json;
				if (CODE === 1) {
					let data = DATA || [];
					setTeacherSectionsData(data);
				} else {
					handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>,"error");
				}
			},
			(error) => {
				const { status } = error;
				if (status == 401) {
					
				} else {
					console.error(error);
					handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
				}
			}
		);
        setIsLoading((prevState) => {
            return ({ ...prevState, [`teacherSections`]: false });
        })
    }

    const getEmployeePayroll = async() => {
        setIsLoading((prevState) => {
            return ({ ...prevState, [`employeePayroll`]: true });
        });
        let data =  new FormData();
        data.append("employeeId", rowData?.id);
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C357CommonEmployeesSalaryIncrementRevisionSheet/EmployeePayrollView`;
		await fetch(url, {
			method: "POST",
			body: data,
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
				const {CODE, DATA, USER_MESSAGE, SYSTEM_MESSAGE} = json;
				if (CODE === 1) {
					let data = DATA || [];
                    let dataLength = data.length;
                    if(dataLength!=0){
                        let rate = data[dataLength-1].perHourRate;
                        let salary = data[dataLength-1].perMonthSalary;
                        setState((prevState) => {
                            return ({ ...prevState, rate:rate, salary:salary });
                        });
                    }
					setPayrollData(data);
				} else {
					handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>,"error");
				}
			},
			(error) => {
				const { status } = error;
				if (status == 401) {
					
				} else {
					console.error(error);
					handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
				}
			}
		);
        setIsLoading((prevState) => {
            return ({ ...prevState, [`employeePayroll`]: false });
        })
    }

    const formatNumber = (num) => {
        return Number.isInteger(num) ? num : parseFloat(num.toFixed(2));
    };

    const handleChange = (e) => {
        let {name, value} = e.target;
        let {rate, rateNextYear, rateIncreasePer, salary, salaryNextYear, salaryIncreasePer} = state;
        switch(name){
            case "firstName":
            case "lastName":
            case "displayName":
                value = value.toUpperCase();
            break;
            case "cnic":
                // let regex = new RegExp(numberExp);
                // alert(value +" "+ !regex.test(value));
                // if (!!value && !regex.test(value)) {
                //     return;
                // }
            break;
            case "comment" :
                setState((prevState) => {
                    return ({ ...prevState, commentError:false});
                });
            break;
            case "rateNextYear" :
                let rateIncreasePer = ((value - rate) / rate) * 100;
                if (isNaN(rateIncreasePer) || !isFinite(rateIncreasePer)) {
                    rateIncreasePer = 0;
                }
                setState((prevState) => {
                    return ({ ...prevState, rateIncreasePer: formatNumber(rateIncreasePer) })
                });
            break;
            case "rateIncreasePer" :
                let rateNextYear = rate * (1 + value/100);
                if (isNaN(rateNextYear) || !isFinite(rateNextYear)) {
                    rateNextYear = 0;
                }
                setState((prevState) => {
                    return ({ ...prevState, rateNextYear: formatNumber(rateNextYear) })
                });
            break;
            case "salaryNextYear" :
                let salaryIncreasePer = ((value - salary) / salary) * 100;
                if (isNaN(salaryIncreasePer) || !isFinite(salaryIncreasePer)) {
                    salaryIncreasePer = 0;
                }
                setState((prevState) => {
                    return ({ ...prevState, salaryIncreasePer: formatNumber(salaryIncreasePer) })
                });
            
            break;
            case "salaryIncreasePer" :
                let salaryNextYear = salary * (1 + value/100);
                if (isNaN(salaryNextYear) || !isFinite(salaryNextYear)) {
                    salaryNextYear = 0;
                }
                setState((prevState) => {
                    return ({ ...prevState, salaryNextYear: formatNumber(salaryNextYear) })
                });
            break;
            default:
        }
        setState((prevState) => {
            console.log(prevState);
            return ({ ...prevState, [name]: value })
        });
    }

    const handleAddComment=()=>{
        let commentDataArry = [...state.commentData];
        let commentDate =  format(state.commentDate,"dd-MM-yyyy");
        let comment = state.comment.trim();
        if(comment==""){
            setState((prevState) => {
                return ({ ...prevState, commentError:true})
            });
            return;
        }
        commentDataArry.unshift({commentDate:commentDate, comment:comment});
        setState((prevState) => {
            return ({ ...prevState, commentDate:new Date(), comment:"", commentData: commentDataArry })
        });
    }

    const handleDeleteComment=(dataIndex)=>{
        let commentDataArry = [...state.commentData];
        commentDataArry.splice(dataIndex, 1);
        setState((prevState) => {
            return ({ ...prevState, commentData: commentDataArry })
        });
    }

    useEffect(() => {
        if(openDialog===false){
            setState(initialStates);
        } else {
            getTeacherSectionDetails();
            getEmployeePayroll();
        }
    }, [openDialog]);

    return (
        <Dialog scroll="paper" fullScreen open={openDialog} onClose={handleCloseDialog} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleCloseDialog} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {rowData?.id + " - " + rowData?.displayName}
                    </Typography>
                    <Button autoFocus color="inherit" onClick={(e)=>handleIsExistUpdate(rowData)}>
                        save
                    </Button>
                </Toolbar>
            </AppBar>
            <form id="myForm" className={classes.main}>
                <Grid container spacing={2}>
                    <Grid item xs={4} sm={3}>
                        <TextField label="First Name" name="firstName" defaultValue={rowData?.firstName} value={state.firstName} variant='outlined' size='small' fullWidth onChange={handleChange} inputProps={{ readOnly: true }} />
                    </Grid>
                    <Grid item xs={4} sm={3}>
                        <TextField label="Last Name" name="lastName" defaultValue={rowData?.lastName} value={state.lastName} variant='outlined' size='small' fullWidth onChange={handleChange} inputProps={{ readOnly: true }} />
                    </Grid>
                    <Grid item xs={4} sm={3}>
                        <TextField label="Display Name" name="displayName" defaultValue={rowData?.displayName} value={state.displayName} variant='outlined' size='small' fullWidth onChange={handleChange} inputProps={{ readOnly: true }} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField label="CNIC#" name="cnic" value={state.cnic} variant='outlined' size='small' fullWidth onChange={handleChange} inputProps={{ readOnly: true }} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField label="Address" name="address" defaultValue={rowData?.address} value={state.address} variant='outlined' size='small' fullWidth onChange={handleChange} inputProps={{ readOnly: true }} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField label="Phone" name="phone" defaultValue={rowData?.mobileNo} value={state.phone} variant='outlined' size='small' fullWidth onChange={handleChange} inputProps={{ readOnly: true }} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField label="Email" name="email" defaultValue={rowData?.email} value={state.email} variant='outlined' size='small' fullWidth onChange={handleChange} inputProps={{ readOnly: true }} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField label="Joining Date" name="joiningDate" defaultValue={rowData?.joiningDateLabel} value={state.joiningDate} variant='outlined' size='small' fullWidth onChange={handleChange} inputProps={{ readOnly: true }} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField label="Leaving Date" name="leavingDate" defaultValue={rowData?.leavingDateLabel} value={state.leavingDate} variant='outlined' size='small' fullWidth onChange={handleChange} inputProps={{ readOnly: true }} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField label="Role" name="roles" defaultValue={rowData?.rolesLabel} value={state.roles} variant='outlined' size='small' fullWidth onChange={handleChange} inputProps={{ readOnly: true }} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField label="Job Status" name="jobStatus" defaultValue={rowData?.jobStatusLabel} value={state.jobStatus} variant='outlined' size='small' fullWidth onChange={handleChange} inputProps={{ readOnly: true }} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField label="User Status" name="activationStatus" defaultValue={rowData?.statusLabel} value={state.statusLabel} variant='outlined' size='small' fullWidth onChange={handleChange} inputProps={{ readOnly: true }} />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <TableContainer component={Paper} className={classes.tableContainer}>
                            <Table stickyHeader size="small" aria-label="a dense table" className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.tableHeadCell} style={{width:115, textAlign:"center"}}>Date</TableCell>
                                        <TableCell className={classes.tableHeadCell}>Comment</TableCell>
                                        <TableCell className={classes.tableHeadCell} style={{width:65, textAlign:"center"}}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow className={classes.tableRowHover}>
                                        <TableCell component="th" scope="row">
                                            <DatePicker
                                                autoOk
                                                id="commentDate"
                                                name="commentDate"
                                                label=""
                                                invalidDateMessage=""
                                                placeholder=""
                                                variant="inline"
                                                inputVariant="outlined"
                                                format="dd-MM-yyyy"
                                                size='small'
                                                fullWidth
                                                required
                                                value={state.commentDate}
                                                onChange={(date) =>
                                                    handleChange({
                                                        target: { name: "commentDate", value: date },
                                                    })
                                                }
                                                inputProps={{
                                                    style : {
                                                        paddingTop: 4,
                                                        paddingBottom: 4
                                                    }
                                                }}                                                
                                            />
                                        </TableCell>
                                        <TableCell align="left">
                                            <TextField
                                                id="comment"
                                                name="comment"
                                                label=""
                                                placeholder=""
                                                variant="outlined"
                                                size='small'
                                                fullWidth
                                                required
                                                value={state.comment}
                                                onChange={handleChange}
                                                error={!!state.commentError}
                                                inputProps={{
                                                    style : {
                                                        padding: "4px 6px"
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Add">
                                                <Button
                                                    size="small"
                                                    style={{padding:"0px 8px", minWidth:"auto"}}
                                                    onClick={() => handleAddComment()}

                                                >
                                                    <AddIcon color="primary" />
                                                </Button>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                    {state.commentData.map((obj, index)=>
                                        <TableRow className={classes.tableRowHover} key={"commentData-"+index}>
                                            <TableCell component="th" scope="row" align='center'>{obj.commentDate}</TableCell>
                                            <TableCell align="left">{obj.comment}</TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Del">
                                                    <Button
                                                        size="small"
                                                        style={{padding:"0px 8px", minWidth:"auto"}}
                                                        onClick={() => handleDeleteComment(index)}
                                                    >
                                                        <DeleteOutlinedIcon color="secondary" />
                                                    </Button>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <TableContainer component={Paper} className={classes.tableContainer}>
                            <Table stickyHeader size="small" aria-label="a dense table" className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.tableHeadCell}>Date</TableCell>
                                        <TableCell className={classes.tableHeadCell}>Employment Status</TableCell>
                                        <TableCell className={classes.tableHeadCell}>Position</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow className={classes.tableRowHover}>
                                        <TableCell component="th" scope="row">__/__/____</TableCell>
                                        <TableCell align="left">HT</TableCell>
                                        <TableCell align="left">Position 2</TableCell>
                                    </TableRow>
                                    <TableRow className={classes.tableRowHover}>
                                        <TableCell component="th" scope="row">__/__/____</TableCell>
                                        <TableCell align="left">FT</TableCell>
                                        <TableCell align="left">Position 1</TableCell>
                                    </TableRow>
                                    <TableRow className={classes.tableRowHover}>
                                        <TableCell component="th" scope="row">__/__/____</TableCell>
                                        <TableCell align="left">PT</TableCell>
                                        <TableCell align="left">Position 3</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12}>
                        <TableContainer component={Paper} className={classes.tableContainer} style={{height:"auto", maxHeight:156}}>
                            <Table stickyHeader size="small" aria-label="a dense table" className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.tableHeadCell}>Academic Year</TableCell>
                                        {/* <TableCell className={classes.tableHeadCell}>Section</TableCell> */}
                                        <TableCell className={classes.tableHeadCell}>Course</TableCell>
                                        <TableCell className={classes.tableHeadCell}>Hours</TableCell>
                                        <TableCell className={classes.tableHeadCell}>Claim Hours</TableCell>
                                        <TableCell className={classes.tableHeadCell} style={{width:65, textAlign:"center"}}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {!isLoading.teacherSections ?
                                        teacherSectionsData.length>0 ?  
                                            teacherSectionsData.map((obj, index)=>
                                                <TableRow className={classes.tableRowHover} key={"teacherSectionsData-"+index}>
                                                    <TableCell component="th" scope="row">{obj.sessionLabel}</TableCell>
                                                    {/* <TableCell component="th" scope="row">{obj.label}</TableCell> */}
                                                    <TableCell component="th" scope="row">{obj.courseLabel}</TableCell>
                                                    <TableCell align="left">{obj.durationPerSession}</TableCell>
                                                    <TableCell align="left">
                                                        <TextField
                                                            name="claimHours"
                                                            label=""
                                                            placeholder=""
                                                            variant="outlined"
                                                            size='small'
                                                            inputProps={{
                                                                style : {
                                                                    padding: "4px 6px"
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell style={{textAlign:"center"}}>
                                                        <Tooltip title="Save">
                                                            <Button
                                                                size="small"
                                                                style={{padding:"0px 8px", minWidth:"auto"}}
                                                                onClick={() => handleOpenSnackbar("Saved", "success")}
                                                            >
                                                                <SaveOutlinedIcon color="primary" />
                                                            </Button>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>    
                                            )
                                        :
                                        <TableRow className={classes.tableRowHover}>
                                            <TableCell component="th" scope="row" colSpan={4}>
                                                <Box color="primary.main" align="center">No Data</Box>
                                            </TableCell>
                                        </TableRow>
                                    :
                                    <TableRow className={classes.tableRowHover}>
                                        <TableCell component="th" scope="row" colSpan={4}>
                                            <Skeleton />
                                            <Skeleton />
                                            <Skeleton />
                                        </TableCell>
                                    </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TableContainer component={Paper}>
                            <Table size="small" aria-label="a dense table" className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.tableHeadCell}>From Date</TableCell>
                                        <TableCell className={classes.tableHeadCell}>To Date</TableCell>
                                        <TableCell className={classes.tableHeadCell} style={{textAlign:"right"}}>Salary</TableCell>
                                        <TableCell className={classes.tableHeadCell} style={{textAlign:"right"}}>Hourly Rate</TableCell>
                                        <TableCell className={classes.tableHeadCell}>No of Months</TableCell>
                                        <TableCell className={classes.tableHeadCell}>Comments</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {!isLoading.employeePayroll ?
                                        payrollData.length>0 ?  
                                            payrollData.map((obj, index)=>
                                                <TableRow className={classes.tableRowHover} key={"payrollData-"+index}>
                                                    <TableCell component="th" scope="row">{obj.fromDate}</TableCell>
                                                    <TableCell component="th" scope="row">{obj.toDate}</TableCell>
                                                    <TableCell align="right">{obj.perMonthSalary}</TableCell>
                                                    <TableCell align="right">{obj.perHourRate}</TableCell>
                                                    <TableCell align="left">{obj.payrollMonths}</TableCell>
                                                    <TableCell align="left">{obj.comments}</TableCell>
                                                </TableRow>    
                                            )
                                        :
                                        <TableRow className={classes.tableRowHover}>
                                            <TableCell component="th" scope="row" colSpan={6}>
                                                <Box color="primary.main" align="center">No Data</Box>
                                            </TableCell>
                                        </TableRow>
                                    :
                                    <TableRow className={classes.tableRowHover}>
                                        <TableCell component="th" scope="row" colSpan={6}>
                                            <Skeleton />
                                            <Skeleton />
                                            <Skeleton />
                                        </TableCell>
                                    </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField label="Rate Next Year" name="rateNextYear" value={state.rateNextYear} variant='outlined' size='small' fullWidth onChange={handleChange} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField label="Rate Increase%" name="rateIncreasePer" value={state.rateIncreasePer} variant='outlined' size='small' fullWidth onChange={handleChange} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField label="Salary Next Year" name="salaryNextYear" value={state.salaryNextYear} variant='outlined' size='small' fullWidth onChange={handleChange} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField label="Salary Increase%" name="salaryIncreasePer" value={state.salaryIncreasePer} variant='outlined' size='small' fullWidth onChange={handleChange} />
                    </Grid>
                </Grid>
            </form>
        </Dialog>
    );
}

FullScreenDialog.propTypes = {
    rowData: PropTypes.object,
    columns: PropTypes.array,
    showFilter: PropTypes.bool,
    openDialog: PropTypes.bool
};

FullScreenDialog.defaultProps = {
    rowData: {},
    columns: [],
    showFilter: true,
    openDialog: true
};
