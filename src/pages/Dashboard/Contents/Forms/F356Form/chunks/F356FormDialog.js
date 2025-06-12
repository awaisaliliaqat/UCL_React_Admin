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
import { Box, CircularProgress, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@material-ui/core';
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

export default function FullScreenDialog({ handleOpenSnackbar, openDialog, handleOpenDialog, handleCloseDialog, academicsSessionId, fromDate, toDate ,rowData, handleIsExistUpdate }) {

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
        rateThisYear: 0,
        rateNextYear: 0,
        rateIncreasePer: 0,
        monthsThisYear: 0,
        monthsNextYear: 0,
        salaryThisYear: 0,
        salaryNextYear: 0,
        salaryIncreasePer: 0,
        sheetComment: "",
        isConfirmed : 0,
        isFinalized : 0
    };
    const [state, setState] = useState(initialStates);
    const initialLoadingStates = {
        employeeComments : false,
        employeePayroll : false,
        teacherSections: false,
        employeeSheet: false,
        employeeDesignations: false
    };
    const [isLoading, setIsLoading] = useState(initialLoadingStates);
    const [employeeDesignations, setEmployeeDesignations] = useState([]);
    const [teacherSectionsData, setTeacherSectionsData] = useState([]);
    const [payrollData, setPayrollData] = useState([]);

    const getTeacherSectionDetails = async() => {
        setIsLoading((prevState) => {
            return ({ ...prevState, teacherSections: true });
        });
        let data =  new FormData();
        data.append("employeeId", rowData?.id);
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C356SalaryIncrementRevisionSheet/CoursesTeachersView`;
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
            return ({ ...prevState, teacherSections: false });
        })
    }

    const getEmployeePayroll = async() => {
        setIsLoading((prevState) => {
            return ({ ...prevState, employeePayroll: true });
        });
        let data =  new FormData();
        data.append("employeeId", rowData?.id);
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C356SalaryIncrementRevisionSheet/EmployeePayrollView`;
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
                        let rateThisYear = data[dataLength-1].perHourRate;
                        let salaryThisYear = data[dataLength-1].perMonthSalary;
                        let monthsThisYear = data[dataLength-1].payrollMonths;
                        setState((prevState) => {
                            return ({ 
                                ...prevState, 
                                rateThisYear: rateThisYear, 
                                salaryThisYear: salaryThisYear,
                                monthsThisYear: monthsThisYear,
                                monthsNextYear: monthsThisYear
                            });
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
            return ({ ...prevState, employeePayroll: false });
        })
    }

    const handleEmployeeCommentsView = async() => {
        setIsLoading((prevState) => {
            return ({ ...prevState, employeeComments: true });
        });
        let data =  new FormData();
        data.append("employeeId", rowData?.id);
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C356SalaryIncrementRevisionSheet/EmployeeCommentsView`;
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
                    let commentDataArry = [];
                    for(let i=0; i<dataLength; i++){
                        let  {id, commentDate, commentDateDisplay, comment }  = data[i];
                        commentDataArry.unshift({id: id, commentDate: commentDateDisplay, comment:comment}); 
                    }
                    setState((prevState) => {
                        return ({ ...prevState, commentDate:new Date(), comment:"", commentData: commentDataArry })
                    });
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
            return ({ ...prevState, employeeComments: false });
        });
    }

    const handleEmployeeCommentSave = async(commentDate, comment) => {
        let data =  new FormData();
        data.append("employeeId", rowData?.id);
        data.append("commentDate", commentDate);
        data.append("comment", comment);
        setIsLoading((prevState) => {
            return ({ ...prevState, employeeComments: true });
        });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C356SalaryIncrementRevisionSheet/EmployeeCommentSave`;
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
				const {CODE, USER_MESSAGE, SYSTEM_MESSAGE} = json;
				if (CODE === 1) {
					handleOpenSnackbar(<span>{USER_MESSAGE}</span>,"success");
                    handleEmployeeCommentsView();
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
            return ({ ...prevState, employeeComments: false });
        });
    }

    const handleEmployeeCommentDelete = async(commentId) => {
        let data =  new FormData();
        data.append("commentId", commentId);
        setIsLoading((prevState) => {
            return ({ ...prevState, employeeComments: true });
        });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C356SalaryIncrementRevisionSheet/EmployeeCommentDelete`;
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
				const {CODE, USER_MESSAGE, SYSTEM_MESSAGE} = json;
				if (CODE === 1) {
					handleOpenSnackbar(<span>{USER_MESSAGE}</span>,"success");
                    //handleEmployeeCommentsView();
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
            return ({ ...prevState, employeeComments: false });
        });
    }

    const handleEmployeeDesignationsView = async() => {
        setIsLoading((prevState) => {
            return ({ ...prevState, employeeDesignations: true });
        });
        let data =  new FormData();
        data.append("employeeId", rowData?.id);
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C356SalaryIncrementRevisionSheet/EmployeeDesignationsView`;
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
                    setEmployeeDesignations(data);
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
            return ({ ...prevState, employeeDesignations: false });
        });
    }

    const handleClaimHoursSave = async(academicsSessionId, courseId, index) => {
        let data =  new FormData();
        let claimHours = parseFloat(teacherSectionsData[index]?.claimHours);
        if(isNaN(claimHours) || claimHours<=0){ handleOpenSnackbar("Claim Hours not valid","error"); return; }
        data.append("academicsSessionId", academicsSessionId);
        data.append("courseId", courseId);
        data.append("teacherId", rowData?.id);
        data.append("claimHours", claimHours);
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C356SalaryIncrementRevisionSheet/CoursesTeachersSave`;
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
				const {CODE, USER_MESSAGE, SYSTEM_MESSAGE} = json;
				if (CODE === 1) {
					handleOpenSnackbar(<span>{USER_MESSAGE}</span>,"success");
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
    }

    const getSheet = async() => {
        let data =  new FormData();
        data.append("academicsSessionId", academicsSessionId);
        data.append("employeeId", rowData?.id);
        data.append("fromDate", format(fromDate,"dd-MM-yyyy"));
        data.append("toDate", format(toDate,"dd-MM-yyyy"));
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C356SalaryIncrementRevisionSheet/View`;
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
                    if(dataLength>0){
                        let {rateThisYear, salaryThisYear, monthsThisYear, monthsNextYear, rateNextYear, rateIncreasePercentage, salaryNextYear, salaryIncreasePercentage, comment, isConfirmed, isFinalized} = data[0];
                        setState((prevState) => {
                            return ({ 
                                ...prevState, 
                                monthsThisYear: monthsThisYear ? formatNumber(monthsThisYear) : prevState.monthsThisYear,
                                monthsNextYear: monthsNextYear ? formatNumber(monthsNextYear) : prevState.monthsNextYear,
                                rateThisYear: rateThisYear ? formatNumber(rateThisYear) : prevState.rateThisYear,
                                salaryThisYear: salaryThisYear ? formatNumber(salaryThisYear) : prevState.salaryThisYear,
                                rateNextYear: formatNumber(rateNextYear),
                                rateIncreasePer: formatNumber(rateIncreasePercentage),
                                salaryNextYear: formatNumber(salaryNextYear),
                                salaryIncreasePer: formatNumber(salaryIncreasePercentage),
                                sheetComment: (comment && comment.length > 0) ? comment.at(-1).comment : '',
                                isConfirmed: isConfirmed,
                                isFinalized: isFinalized
                            });
                        });
                    } else {
                        setState(prev => {
                            const updatedState = { ...prev };
                            const rateIncrease = 8;
                            if (prev.rateThisYear && !isNaN(prev.rateThisYear)) {
                                updatedState.rateIncreasePer = rateIncrease;
                                updatedState.rateNextYear = formatNumber(prev.rateThisYear * (1 + rateIncrease / 100));
                            }
                            const salaryIncrease = 8;
                            if (prev.salaryThisYear && !isNaN(prev.salaryThisYear)) {
                                updatedState.salaryIncreasePer = salaryIncrease;
                                updatedState.salaryNextYear = formatNumber(prev.salaryThisYear * (1 + salaryIncrease / 100));
                            }
                            return updatedState;
                        });
                    }
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
    }

    const handleSave = async() => {
        //handleIsExistUpdate(rowData);
        let data =  new FormData();
        data.append("id", 0);
        data.append("academicsSessionId", academicsSessionId);
        data.append("employeeId", rowData?.id);
        data.append("fromDate", format(fromDate,"dd-MM-yyyy"));
        data.append("toDate", format(toDate,"dd-MM-yyyy"));
        data.append("rateThisYear", state.rateThisYear);
        data.append("monthsThisYear", state.monthsThisYear);
        data.append("monthsNextYear", state.monthsNextYear);
        data.append("salaryThisYear", state.salaryThisYear);
        data.append("rateNextYear", state.rateNextYear);
        data.append("rateIncreasePercentage", state.rateIncreasePer);
        data.append("salaryNextYear", state.salaryNextYear);
        data.append("salaryIncreasePercentage", state.salaryIncreasePer);
        data.append("yearlyClaimNextYear", 0);
        data.append("comment", state.sheetComment);
        setIsLoading((prevState) => {
            return ({ ...prevState, employeeSheet: true });
        });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C356SalaryIncrementRevisionSheet/Save`;
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
				const {CODE, USER_MESSAGE, SYSTEM_MESSAGE} = json;
				if (CODE === 1) {
					handleOpenSnackbar(<span>{USER_MESSAGE}</span>,"success");
                    handleIsExistUpdate(rowData);
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
            return ({ ...prevState, employeeSheet: false });
        });
    }

    const formatNumber = (num) => {
        return Number.isInteger(num) ? num : parseFloat(num.toFixed(2));
    };

    const handleSetClaimHours = (e, index) => {
        const { value } = e.target;
        let regex = new RegExp("^(\\d+(\\.\\d*)?|\\.)$");
        if (value && !regex.test(value)) {
            return;
        }
        setTeacherSectionsData(prevState => {
            const updated = [...prevState];
            updated[index] = {
                ...updated[index],
                claimHours: value
            };
            return updated;
        });
    };

    const handleChange = (e) => {
        let {name, value} = e.target;
        let {rateThisYear, rateNextYear, rateIncreasePer, salaryThisYear, salaryNextYear, salaryIncreasePer} = state;
        let regex = null;
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
            case "rateThisYear" :
                regex = new RegExp("^(\\d+(\\.\\d*)?|\\.)$");
                if (value && !regex.test(value)) {
                    return;
                }
                setState((prevState) => {
                    return ({ ...prevState, rateNextYear: formatNumber(0) ,rateIncreasePer: formatNumber(0) })
                });
            break;
            case "rateNextYear" :
                regex = new RegExp("^(\\d+(\\.\\d*)?|\\.)$");
                if (value && !regex.test(value)) {
                    return;
                }
                let rateIncreasePer = ((value - rateThisYear) / rateThisYear) * 100;
                if (isNaN(rateIncreasePer) || !isFinite(rateIncreasePer)) {
                    rateIncreasePer = 0;
                }
                setState((prevState) => {
                    return ({ ...prevState, rateIncreasePer: formatNumber(rateIncreasePer) })
                });
            break;
            case "rateIncreasePer" :
                regex = new RegExp("^(\\d+(\\.\\d*)?|\\.)$");
                if (value && !regex.test(value)) {
                    return;
                }
                let rateNextYear = rateThisYear * (1 + value/100);
                if (isNaN(rateNextYear) || !isFinite(rateNextYear)) {
                    rateNextYear = 0;
                }
                setState((prevState) => {
                    return ({ ...prevState, rateNextYear: formatNumber(rateNextYear) })
                });
            break;
            case "salaryThisYear" :
                regex = new RegExp("^(\\d+(\\.\\d*)?|\\.)$");
                if (value && !regex.test(value)) {
                    return;
                }
                setState((prevState) => {
                    return ({ ...prevState, salaryNextYear: formatNumber(0), salaryIncreasePer: formatNumber(0) })
                });
            break;
            case "salaryNextYear" :
                regex = new RegExp("^(\\d+(\\.\\d*)?|\\.)$");
                if (value && !regex.test(value)) {
                    return;
                }
                let salaryIncreasePer = ((value - salaryThisYear) / salaryThisYear) * 100;
                if (isNaN(salaryIncreasePer) || !isFinite(salaryIncreasePer)) {
                    salaryIncreasePer = 0;
                }
                setState((prevState) => {
                    return ({ ...prevState, salaryIncreasePer: formatNumber(salaryIncreasePer) })
                });
            break;
            case "salaryIncreasePer" :
                regex = new RegExp("^(\\d+(\\.\\d*)?|\\.)$");
                if (value && !regex.test(value)) {
                    return;
                }
                let salaryNextYear = salaryThisYear * (1 + value/100);
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
        // commentDataArry.unshift({commentDate:commentDate, comment:comment});
        // setState((prevState) => {
        //     return ({ ...prevState, commentDate:new Date(), comment:"", commentData: commentDataArry })
        // });
        handleEmployeeCommentSave(commentDate, comment);
    }

    const handleDeleteComment=(dataIndex)=>{
        let commentDataArry = [...state.commentData];
        let commentId = commentDataArry[dataIndex].id;
        commentDataArry.splice(dataIndex, 1);
        setState((prevState) => {
            return ({ ...prevState, commentData: commentDataArry })
        });
        handleEmployeeCommentDelete(commentId);
    }

    useEffect(() => {
        if(openDialog===false){
            setState(initialStates);
            setEmployeeDesignations([]);
            setPayrollData([]);
            setTeacherSectionsData([]);
        } else {
            handleEmployeeCommentsView();
            handleEmployeeDesignationsView();
            getTeacherSectionDetails();
            getEmployeePayroll();
            getSheet();
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
                    <Button 
                        autoFocus 
                        color="inherit"
                        disabled={isLoading.employeeSheet || state.isFinalized || state.isConfirmed} 
                        onClick={(e)=>
                            handleSave()
                        }>
                        {isLoading.employeeSheet ? <CircularProgress size={24} style={{color:"lightgray"}} /> : state.isFinalized || state.isConfirmed ? "Confirmed Or Finalized" : "Save" }
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
                                                autoComplete="off"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Add">
                                                <span>
                                                <Button
                                                    size="small"
                                                    style={{padding:"0px 8px", minWidth:"auto"}}
                                                    onClick={() => handleAddComment()}
                                                    disabled={isLoading.employeeComments}
                                                >
                                                   {isLoading.employeeComments ? <CircularProgress size={18} /> : <AddIcon color="primary" /> }
                                                </Button>
                                                </span>
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
                                    {!isLoading.employeeDesignations ?
                                        employeeDesignations.length>0 ?  
                                            employeeDesignations.map((obj, index)=>
                                                <TableRow className={classes.tableRowHover} key={"employeeDesignations-"+index}>
                                                    <TableCell component="th" scope="row">{obj.fromDate ? format(new Date(obj.fromDate), "dd-MM-yyyy") : ""}</TableCell>
                                                    <TableCell component="th" scope="row">{obj.jobStatusLabel}</TableCell>
                                                    <TableCell align="left">{obj.designationLabel}</TableCell>
                                                </TableRow>    
                                            )
                                        :
                                        <TableRow className={classes.tableRowHover}>
                                            <TableCell component="th" scope="row" colSpan={3}>
                                                <Box color="primary.main" align="center">No Data</Box>
                                            </TableCell>
                                        </TableRow>
                                    :
                                    <TableRow className={classes.tableRowHover}>
                                        <TableCell component="th" scope="row" colSpan={3}>
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
                                                    <TableCell component="th" scope="row">{obj.academicsSessionLabel}</TableCell>
                                                    {/* <TableCell component="th" scope="row">{obj.label}</TableCell> */}
                                                    <TableCell component="th" scope="row">{obj.courseLabel}</TableCell>
                                                    <TableCell align="left">{obj.creditHour}</TableCell>
                                                    <TableCell align="left">
                                                        <TextField
                                                            name="claimHours"
                                                            label=""
                                                            placeholder=""
                                                            variant="outlined"
                                                            size='small'
                                                            value={obj.claimHours || ""}
                                                            onChange={e=>handleSetClaimHours(e, index)}
                                                            inputProps={{
                                                                style : {
                                                                    padding: "4px 6px"
                                                                }
                                                            }}
                                                            autoComplete="off"
                                                        />
                                                    </TableCell>
                                                    <TableCell style={{textAlign:"center"}}>
                                                        <Tooltip title="Save">
                                                            <Button
                                                                size="small"
                                                                style={{padding:"0px 8px", minWidth:"auto"}}
                                                                onClick={(e) => handleClaimHoursSave(obj.academicsSessionId, obj.courseId, index) }
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
                    <Grid item xs={3}>
                        <TextField label="Rate This Year" name="rateThisYear" value={state.rateThisYear} variant='outlined' size='small' fullWidth onChange={handleChange} />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField label="Salary This Year" name="salaryThisYear" value={state.salaryThisYear} variant='outlined' size='small' fullWidth onChange={handleChange} />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField label="Months This Year" name="monthsThisYear" value={state.monthsThisYear} variant='outlined' size='small' fullWidth onChange={handleChange} />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField label="Months Next Year" name="monthsNextYear" value={state.monthsNextYear} variant='outlined' size='small' fullWidth onChange={handleChange} />
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
                    <Grid item xs={12}>
                        <TextField label="Comment" name="sheetComment" value={state.sheetComment} variant='outlined' size='small' fullWidth onChange={handleChange} />
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
