import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { 
	Divider, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, 
	IconButton, Paper, TextField, MenuItem, Grid
} from "@material-ui/core";
import LoginMenu from "../../../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../../../components/CustomizedSnackbar/CustomizedSnackbar";

const styles = (theme) => ({
	main: {
		padding: theme.spacing(2)
	},
	table: {
		minWidth: 700,
	},
	headerTitle: {
		fontWeight: 600,
	},
	columnsLoader: {
		display: "flex",
		justifyContent: "center",
		padding: 15,
	},
});

// eslint-disable-next-line no-unused-vars
const StyledTableCell = withStyles((theme) => ({
	head: {
		backgroundColor: "#306b9e",
		color: "white",
	},
	body: {
		// fontSize: 14,
	},
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
	root: {
		"&:nth-of-type(even)": {
			backgroundColor: theme.palette.action.hover,
		},
	},
}))(TableRow);

class F321Reports extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			showTableFilter: false,
			employeePayrollsData: [],
			isLoginMenu: false,
			isReload: false,
			isOpenSnackbar: false,

			yearData: [],
			yearId: "",

			snackbarMessage: "",
			snackbarSeverity: "",
			sessionData: [],
			sessionId: "",

			monthId: "",
			monthIdError: "",
			monthsData: [
				{ id: 1, label: "January" },
				{ id: 2, label: "February" },
				{ id: 3, label: "March" },
				{ id: 4, label: "April" },
				{ id: 5, label: "May" },
				{ id: 6, label: "June" },
				{ id: 7, label: "July" },
				{ id: 8, label: "August" },
				{ id: 9, label: "September" },
				{ id: 10, label: "October" },
				{ id: 11, label: "November" },
				{ id: 12, label: "December" },
			],
			monthsDataLoading: false,

			allowances: [],
			deductions: [],

			isColumnsLoading: false,
			columns: [
				{ id: 1, name: "id", title: "ID", colspan: 1 },
				{ id: 2, name: "userLabel", title: "Employee", colspan: 1 },
				// { id: 3, name: "payrollMonths", title: "Number of Months", colspan: 1 },
				{ id: 4, name: "perMonthSalary", title: "Per Month Salary", colspan: 1, },
				{ id: 5, name: "leaveInCashment", title: "Leave Encashment", colspan: 2, 
					subColumns: [ 
						{ id: 1, allowanceLabel: "Days", isActive: 1, }, 
						{ id: 2, allowanceLabel: "Amount", isActive: 1, } 
					] 
				},
				{ id: 7, name: "allowances", title: "Allowances", colspan: 1, subColumns: [], },
				{ id: 6, name: "grossSalary", title: "Gross Salary", colspan: 1 },
				{ id: 8, name: "deductions", title: "Deductions", colspan: 1, subColumns: [], },
				{ id: 9, name: "netSalary", title: "Net Salary", colspan: 1 },
			],
		};
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
		this.setState({ isOpenSnackbar: false });
	};

	getYearsData = async (value) => {
		this.setState({ isLoading: true });
		const formData = new FormData();
		formData.append("sessionId", value);
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C321CommonYearsView`;
		await fetch(url, {
			method: "POST",
			body: formData,
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
						let data = json.DATA || [];
						this.setState({ yearData: data });
					} else {
						this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>, "error" );
					}
				},
				(error) => {
					if (error.status === 401) {
						this.setState({
							isLoginMenu: true,
							isReload: true,
						});
					} else {
						this.handleOpenSnackbar("Failed to fetch, Please try again later.", "error" );
						console.log(error);
					}
				}
			);
		this.setState({
			isLoading: false,
		});
	};

	getData = async (val) => {
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C321CommonEmployeesMonthlyPayrollVoucherView?sessionId=${this.state.sessionId}&sessionPayrollMonthId=${val.id}`;
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
						let data = json.DATA || [];
						console.log(data);

						const allAllowances = data.flatMap(
							(employee) => employee.allowances
						);

						const uniqueAllowancesMap = new Map();
						allAllowances.forEach((allowance) => {
							if (!uniqueAllowancesMap.has(allowance.allowanceId)) {
								uniqueAllowancesMap.set(allowance.allowanceId, allowance);
							}
						});

						const uniqueAllowancesArray = Array.from(
							uniqueAllowancesMap.values()
						);

						let updatedAllowances = [
							...uniqueAllowancesArray,
							{
								deductionId: 1001,
								isActive: 1,
								allowanceLabel: "Overtime Amount",
							},
						];

						const allDeductions = data.flatMap(
							(employee) => employee.deductions
						);

						const uniqueDeductionsMap = new Map();
						allDeductions.forEach((allowance) => {
							if (!uniqueDeductionsMap.has(allowance.deductionId)) {
								uniqueDeductionsMap.set(allowance.deductionId, allowance);
							}
						});

						const uniqueDeductionsArray = Array.from(
							uniqueDeductionsMap.values()
						);

						let updatedDeductions = [
							...uniqueDeductionsArray,
							{
								deductionId: 2001,
								isActive: 1,
								allowanceLabel: "Absent Days Amount",
							},
							{
								deductionId: 2002,
								isActive: 1,
								allowanceLabel: "Late Days Amount",
							},
						];

						let { columns } = this.state;
						let index = columns.findIndex((item) => item.id == 7);
						columns[index]["subColumns"] = updatedAllowances;
						columns[index]["colspan"] = updatedAllowances.length == 0 ? 1 : updatedAllowances.length;
						let index2 = columns.findIndex((item) => item.id == 8);
						columns[index2]["subColumns"] = updatedDeductions;
						columns[index2]["colspan"] = updatedDeductions.length == 0 ? 1 : updatedDeductions.length;
						const transformedData = data.map((item) => {
							
							return {
								employeeId: item.employeeId,
								userLabel: item.employeeLabel,
								perMonthSalary: item.perMonthSalary || 0,
								homeRent: 0,
								fakeGrossSallary: item.perMonthSalary || 0,
								id: item.userId,
								grossSalary: Number(item.grossSalary) || 0,
								netSalary: Number(item.netSalary) || 0,
								leaveInCashDays: 0,
								leaveInCashAmount: 0,
								leaveInCashment: [
									{
										id: 1,
										label: "Days",
										isActive: 1,
										value: item.leaveInCashDays,
									},
									{
										id: 2,
										label: "Amount",
										isActive: 1,
										value: item.leaveInCashAmount,
									},
								],
								allowances: [
									...item.allowances,
									{
										amount: item.overTimeAmount || 0,
										id: 1001,
										isActive: 1,
										label: "Overtime Amount",
									},
								],
								deductions: [
									...item.deductions,
									{
										amount: item.absentDaysAmount || 0,
										id: 2001,
										isActive: 1,
										label: "Absent Days Amount",
									},
									{
										amount: item.lateDaysAmount || 0,
										id: 2002,
										isActive: 1,
										label: "Late Days Amount",
									},
								],
							};
						});
						this.setState({
							columns,
							employeePayrollsData: transformedData,
						});
					} else {
						this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>, "error" );
					}
				},
				(error) => {
					if (error.status === 401) {
						this.setState({
							isLoginMenu: true,
							isReload: true,
						});
					} else {
						this.handleOpenSnackbar("Failed to fetch, Please try again later.", "error" );
						console.log(error);
					}
				}
			);
		this.setState({
			isLoading: false,
		});
	};

	getSessionData = async () => {
		this.setState({
			isLoading: true,
		});
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C321CommonAcademicsSessionsView`;
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
					let data = json.DATA || [];
					this.setState({
						sessionData: data,
					});
				} else {
					this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>, "error" );
				}
			},
			(error) => {
				if (error.status === 401) {
					this.setState({
						isLoginMenu: true,
						isReload: true,
					});
				} else {
					this.handleOpenSnackbar("Failed to fetch, Please try again later.", "error" );
					console.log(error);
				}
			}
		);
		this.setState({
			isLoading: false,
		});
	};

	onHandleChange = (e) => {
		const { name, value } = e.target;
		this.setState({
			[name]: value,
		});
		if (name === "sessionId") {
			this.getYearsData(value);
		}
		if (name === "monthId") {
			this.getData(value);
		}
	};

	componentDidMount() {
		this.getSessionData();
	}

	render() {
		const { classes } = this.props;
		const { employeePayrollsData } = this.state;
		return (
			<Fragment>
				<LoginMenu
					reload={this.state.isReload}
					open={this.state.isLoginMenu}
					handleClose={() => this.setState({ isLoginMenu: false })}
				/>
				<Grid 
					container
					justifyContent="center"
					alignItems="center"
					spacing={2}
					className={classes.main}
				>
					<Grid item xs={12} >
						<Typography
							style={{
								color: "#1d5f98",
								fontWeight: 600,
								textTransform: "capitalize",
							}}
							variant="h5"
						>
							<Tooltip title="Back">
								<IconButton onClick={() => window.history.back()}>
									<ArrowBackIcon fontSize="small" color="primary" />
								</IconButton>
							</Tooltip>
							Payroll Monthly Voucher
						</Typography>
						<Divider
							style={{
								backgroundColor: "rgb(58, 127, 187)",
								opacity: "0.3"
							}}
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							id="sessionId"
							name="sessionId"
							label="Session"
							required
							fullWidth
							variant="outlined"
							onChange={this.onHandleChange}
							value={this.state.sessionId}
							select
						>
							{this.state.sessionData.map((item) => {
								return (
									<MenuItem key={"sessionData-"+item.ID} value={item.ID}>
										{item.Label}
									</MenuItem>
								);
							})}
						</TextField>
					</Grid>
					<Grid item xs={6}>
						<TextField
							id="monthId"
							name="monthId"
							label="Month"
							disabled={!this.state.sessionId}
							required
							fullWidth
							variant="outlined"
							onChange={this.onHandleChange}
							value={this.state.monthId}
							helperText={this.state.monthIdError}
							error={!!this.state.monthIdError}
							select
						>
							{this.state.yearData.map((item) => {
								return (
									<MenuItem key={"yearData-"+item.id} value={item}>
										{item.monthName}
									</MenuItem>
								);
							})}
						</TextField>
					</Grid>
					<br/>
					<Divider
						style={{
							backgroundColor: "rgb(58, 127, 187)",
							opacity: "0.3",
							marginBottom: 20,
						}}
					/>
					<TableContainer
						component={Paper}
						style={{
							paddingBottom: "30px",
							marginBottom: "3%",
						}}
					>
						<Table className={classes.table}>
							<TableHead>
								<TableRow>
									{this.state.columns?.map((item, index) => {
										return (
											<StyledTableCell
												colSpan={item.colspan || 1}
												className={classes.headerTitle}
												key={"columns-"+index}
												style={{
													border: "1px solid white",
												}}
											>
												{item.title || "N/A"}
											</StyledTableCell>
										);
									})}
								</TableRow>
								<TableRow>
									{this.state.columns?.map((col, colIndex) => {
										if (col.subColumns && col.subColumns.length > 0) {
											return (
												<>
													{col.subColumns?.map((item, subColIndex) => {
														return (
															<StyledTableCell
																className={classes.headerTitle}
																key={"subColumns-"+subColIndex}
																style={{
																	border: "1px solid white",
																}}
															>
																{item.allowanceLabel || "N/A"}
															</StyledTableCell>
														);
													})}
												</>
											);
										} else {
											return <StyledTableCell key={"columns-"+colIndex+"-subColumns"}>{""}</StyledTableCell>;
										}
									})}
								</TableRow>
							</TableHead>
							<TableBody>
								{employeePayrollsData.map((employee, employeeIndex) => (
									<StyledTableRow key={employee.employeeId}>
										<TableCell className={classes.subColumnCell}>
											{employee.employeeId}
										</TableCell>
										<TableCell className={classes.subColumnCell}>
											{employee.userLabel}
										</TableCell>

										<TableCell className={classes.subColumnCell}>
											{employee.perMonthSalary}
										</TableCell>

										{employee.leaveInCashment.map((leave, leaveIndex) => (
											<TableCell
												key={`allowance-${leaveIndex}`}
												className={classes.subColumnCell}
											>
												{leave.value}
											</TableCell>
										))}

										{employee.allowances.length !== 0 ? (
											employee.allowances.map((allowance, allowanceIndex) => (
												<TableCell
													key={`allowance-${allowanceIndex}`}
													className={classes.subColumnCell}
												>
													{allowance.amount}
												</TableCell>
											))
										) : (
											<TableCell className={classes.subColumnCell}>
												N/A
											</TableCell>
										)}
										<TableCell className={classes.subColumnCell}>
											{employee.grossSalary}
										</TableCell>
										{employee.deductions.length !== 0 ? (
											employee.deductions.map((deduction, deductionIndex) => (
												<TableCell
													key={`deduction-${deductionIndex}`}
													className={classes.subColumnCell}
												>
													{deduction.amount}
												</TableCell>
											))
										) : (
											<TableCell className={classes.subColumnCell}>
												N/A
											</TableCell>
										)}
										<TableCell className={classes.subColumnCell}>
											{employee.netSalary}
										</TableCell>
									</StyledTableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
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

F321Reports.propTypes = {
	classes: PropTypes.object,
};

F321Reports.defaultProps = {
	classes: {},
};
export default withStyles(styles)(F321Reports);
