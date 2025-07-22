import React, { Component, Fragment } from "react";
import { Button, CircularProgress, Divider, Grid, IconButton, Tooltip } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import FilterIcon from "mdi-material-ui/FilterOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import EditDeleteTableComponent from "../../../../../components/EditDeleteTableRecord/EditDeleteTableComponent";
import F360ReportsTableComponent from "./Chunks/F360ReportsTableComponent";
import { DatePicker } from "@material-ui/pickers";
import { withStyles } from "@material-ui/styles";
import { endOfYear, format, startOfYear } from "date-fns";

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

class F360Reports extends Component {
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
		const data = new FormData();
		data.append("fromDate", format(this.state.fromDate, "dd-MM-yyyy"));
		data.append("toDate", format(this.state.toDate, "dd-MM-yyyy"));
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C360CommonEmployeesPayrollRequests/View`;
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
					for (let i = 0; i < data.length; i++) {
						const id = data[i].id;
						data[i].action = (
							<EditDeleteTableComponent
								hideEditAction
								recordId={id}
								deleteRecord={this.DeleteData}
								editRecord={() =>
									window.location.replace(
										`#/dashboard/F315Form/${id}`
									)
								}
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

	DeleteData = async (event) => {
		event.preventDefault();
		const data = new FormData(event.target);
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C316CommonUsersEmployeesPayrollDelete`;
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
					this.handleOpenSnackbar("Deleted", "success");
					this.getData();
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

	componentDidMount() {
		const {isDrawerOpen, setDrawerOpen} = this.props;
		if(isDrawerOpen){
			setDrawerOpen(false);
		}
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
			{ name: "status", title: "Status"},
			{ name: "statusByLabel", title: "Status By"},
			{ name: "statusOn", title: "Status On",
				getCellValue : (rowData) => {
					return (rowData.statusOn ? format(new Date(rowData.statusOn), "dd-MM-yyyy hh:mm a") : "");
				}
			},
			// { name: "action", title: "Action" },
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
							<Tooltip title="Back">
								<IconButton
									onClick={() =>
										window.location.replace("#/dashboard/F360Form")
									}
								>
									<ArrowBackIcon fontSize="small" color="primary" />
								</IconButton>
							</Tooltip>
							Employees Payroll Requests
						</Typography>
						<div style={{ float: "right" }}>
							<Tooltip title="Table Filter">
								<IconButton
									style={{ marginLeft: "-10px" }}
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
					<Grid item xs={6} md={2}>
						<DatePicker
							autoOk
							id="fromDate"
							name="fromDate"
							label="From Date"
							invalidDateMessage = ""
							placeholder = ""
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
					<Grid item xs={6} md={2}>
						<DatePicker
							autoOk
							id="toDate"
							name="toDate"
							label="To Date"
							invalidDateMessage=""
							placeholder=""
							variant="inline"
							inputVariant="outlined"
							format="dd-MM-yyyy"
							fullWidth
							required
							value={this.state.toDate}
							onChange={(date) =>
								this.onHandleChange({
									target: { name: "toDate", value: date },
								})
							}
						/>
					</Grid>
					<Grid item xs={12} md={1}>
						<Button
							variant="contained"
							color="primary"
							size="large"
							fullWidth
							style={{
								height: 54
							}}
							onClick={this.getData}
							disabled={this.state.isLoading}
						>
							{this.state.isLoading ? <CircularProgress size={24} /> : "Search"}
						</Button>
					</Grid>
					<F360ReportsTableComponent
						rows={this.state.employeePayrollsData}
						columns={columns}
						showFilter={this.state.showTableFilter}
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

export default withStyles(styles)(F360Reports);
