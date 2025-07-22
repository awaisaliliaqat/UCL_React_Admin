import React, { Component, Fragment, useMemo, useState } from "react";
import { Box, Button, CircularProgress, Divider, Grid, IconButton, makeStyles, Tooltip } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import FilterIcon from "mdi-material-ui/FilterOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import F361FormTableComponent from "./Chunks/F361FormTableComponent";
import { withStyles } from "@material-ui/styles";
import { endOfYear, format, startOfYear } from "date-fns";
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';
import { Skeleton } from "@material-ui/lab";
import BottomBar from "../../../../../components/BottomBar/BottomBar";

const useStyles = makeStyles((theme) => ({
  greenOutlinedButton: {
    color: theme.palette.success.main,
    borderColor: theme.palette.success.main
  },
}));

const styles = (theme) => ({
	root: {
		paddingBottom: theme.spacing(8),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2)
	},
	divider: { 
		backgroundColor: "rgb(58, 127, 187)", 
		opacity: "0.3",
		width : "100%"
	},
});

const ApprovalPanal = ({id, handleApproval}) => {

	const classes = useStyles();
	
	const [isLoading, setIsLoading] = useState(0);
	const dataId = id;
	const handleClick = (isApproved, isDeclind) => {
		setIsLoading(1);
		handleApproval(dataId, isApproved, isDeclind);
	}

	return (
		<Box display="flex" flexWrap="wrap" justifyContent="center" alignItems="center" style={{"gap":"0.5em"}}>
			{!isLoading ? <>
			<Tooltip title="Approve">
				<Button
					size="small"
					variant="outlined"
					onClick={()=>handleClick(1, 0)}
					component="span"
					className={classes.greenOutlinedButton}
				
				>
					<ThumbUpAltOutlinedIcon fontSize="small" />
				</Button>
			</Tooltip>
			<Tooltip title="Decline">
				<Button
					size="small"
					color="secondary"
					variant="outlined"
					onClick={()=>handleClick(0, 1)}
					component="span"
				>
					<ThumbDownAltOutlinedIcon fontSize="small" />
				</Button>
			</Tooltip>
			</>
			:
			<Skeleton width="75%" />
		}
		</Box>
	);
};

class F361Form extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			showTableFilter: false,
			employeePayrollsData: [],
			isLoginMenu: false,
			isReload: false,
			isOpenSnackbar: false,
			snackbarMessage: "",
			snackbarSeverity: "",
			fromDate: startOfYear(new Date()),
			toDate : endOfYear(new Date())
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

	getData = async () => {
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C361CommonEmployeesPayrollRequests/PendingView`;
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
				const {CODE, DATA, USER_MESSAGE, SYSTEM_MESSAGE} = json;
				if (CODE === 1) {
					let data = DATA || [];
					for (let i = 0; i < data.length; i++) {
						const id = data[i].id;
						data[i].action = (
							<ApprovalPanal
								key={"ApprovalPanal-"+id}
								id={id}
								handleApproval={this.handleApproval}
							/>
						);
					}
					this.setState({
						employeePayrollsData: data,
					});
				} else {
					this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>, "error" );
				}
			},
			(error) => {
				const { status } = error;
				if (status === 401) {
					this.setState({
						isLoginMenu: true,
						isReload: true,
					});
				} else {
					this.handleOpenSnackbar("Failed to fetch, Please try again later.",	"error");
					console.error("getData : ", error);
				}
			}
		);
		this.setState({
			isLoading: false,
		});
	};

	handleApproval = async (id, isApproved, isDeclind) => {
		
		const data = new FormData();
		data.append("id", id);
		data.append("isApproved", isApproved);
		data.append("isDeclined", isDeclind);
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C361CommonEmployeesPayrollRequests/StatusUpdate`;
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
		.then((json) => {
				const {CODE, DATA, USER_MESSAGE, SYSTEM_MESSAGE} = json;
				if (CODE === 1) {
					const updatedData = [...this.state.employeePayrollsData].filter(obj=>obj.id!==id);
					this.setState({
						employeePayrollsData:updatedData
					});
					this.handleOpenSnackbar(USER_MESSAGE, "success");
				} else {
					this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>, "error");
				}
			},
			(error) => {
				const { status } = error;
				if (status === 401) {
					this.setState({
						isLoginMenu: true,
						isReload: false,
					});
				} else {
					this.handleOpenSnackbar("Failed to fetch, Please try again later.",	"error");
					console.log("DeleteData : ", error);
				}
			}
		);
	};

	onHandleChange = (e) => {
		const { name, value } = e.target;
		this.setState({
			[name]: value,
		});
	};

	handleToggleTableFilter = () => {
		this.setState({ showTableFilter: !this.state.showTableFilter });
	};

	viewReport = () => {
		window.location = "#/dashboard/F361Reports";
	};

	componentDidMount() {
		const {isDrawerOpen, setDrawerOpen} = this.props;
		if(isDrawerOpen){
			setDrawerOpen(false);
		}
		this.getData();
	}

	render() {

		const { classes } = this.props;

		const columns = [
			{ name: "id", title: "ID#" },
			{ name: "userLabel", title: "Employee", getCellValue: rowData => (`${rowData.userId} - ${rowData.userLabel}`) },
			{ name: "payrollMonths", title: "Number of Months" },
			{ name: "perMonthSalary", title: "Per Month Salary" },
			{ name: "perHourRate", title: "Per Hour Rate" },
			{ name: "fromDate", title: "Start On",
				getCellValue : (rowData) => {
					return (rowData.fromDate ? format(new Date(rowData.fromDate), "dd-MM-yyyy") : "");
				}
			},
			{ name: "comments", title: "Comments"},
			{ name: "createdByLabel", title: "Requested By"},
			{ name: "createdOn", title: "Requested On",
				getCellValue : (rowData) => {
					return (rowData.createdOn ? format(new Date(rowData.createdOn), "dd-MM-yyyy hh:mm a") : "");
				}
			},
			{ name: "action", title: "Action" },
		];

		return (
			<Fragment>
				<LoginMenu
					reload={this.state.isReload}
					open={this.state.isLoginMenu}
					handleClose={() => this.setState({ isLoginMenu: false })}
				/>
				<Grid
					component="main"
					container
					justifyContent="center"
					alignItems="center"
					spacing={2}
					className={classes.root}
				>
					<Grid item xs={12}>
						<Typography
							style={{
								color: "#1d5f98",
								fontWeight: 600,
								textTransform: "capitalize",
							}}
							variant="h5"
							component="span"
						>
							Employees Payroll Approval
						</Typography>
						<div style={{ float: "right" }}>
							<Tooltip title="Table Filter">
								<IconButton
									onClick={() => this.handleToggleTableFilter()}
								>
									<FilterIcon color="primary" />
								</IconButton>
							</Tooltip>
						</div>
						<Divider
							className={classes.divider}
						/>
					</Grid>
					<F361FormTableComponent
						rows={this.state.employeePayrollsData}
						columns={columns}
						showFilter={this.state.showTableFilter}
					/>
					<BottomBar
						leftButtonText="View"
						leftButtonHide={false}
						bottomLeftButtonAction={() => this.viewReport()}
						hideRightButton={true}
						right_button_text="Save"
						bottomRightButtonAction={() => alert()}
						loading={this.state.isLoading}
						isDrawerOpen={this.props.isDrawerOpen}
					/>
					<CustomizedSnackbar
						isOpen={this.state.isOpenSnackbar}
						message={this.state.snackbarMessage}
						severity={this.state.snackbarSeverity}
						handleCloseSnackbar={this.handleCloseSnackbar}
					/>
				</Grid>
			</Fragment>
		);
	}
}

export default withStyles(styles)(F361Form);
