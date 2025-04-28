import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import { 
	Divider, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Paper, 
	CircularProgress, TextField, MenuItem, FormControlLabel, Checkbox 
} from "@material-ui/core";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import BottomBar from "../../../../../components/BottomBar/BottomBar";
import { Grid } from '@material-ui/core';

const styles = () => ({
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
	scrollableTableContainer: {
		maxHeight: "400px", // Adjust the height as needed
		overflowY: "auto",
		border: "1px solid #ddd", // Optional border for clarity
	},
	stickyHeader: {
		position: "sticky",
		top: 0,
		// backgroundColor: theme.palette.background.default, // Header background color
		zIndex: 2, // Ensure header appears above body
	},
	subColumnCell: {
		textAlign: "center", // Adjust based on alignment needs
		padding: 8
	},
});

// eslint-disable-next-line no-unused-vars
const StyledTableCell = withStyles((theme) => ({
	head: {
		backgroundColor: "#306b9e",
		color: "white",
	},
	body: {
		// fontSize: ".9rem",
	},
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
	root: {
		"&:nth-of-type(even)": {
			backgroundColor: theme.palette.action.hover,
		},
	},
}))(TableRow);

class F321Form extends Component {
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
			sessionData: [],
			sessionId: "",
			yearData: [],
			yearId: "",
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
			isEditable: 1,
			isColumnsLoading: false,
			columns: [
				{ id: 1, name: "id", title: "ID", colspan: 1 },
				{ id: 2, name: "userLabel", title: "Employee", colspan: 1 },
				// { id: 3, name: "payrollMonths", title: "Number of Months", colspan: 1 },
				{ id: 4, name: "perMonthSalary", title: "Per Month Salary", colspan: 1, },
				{ id: 5, name: "leaveInCashment", title: "Leave Encashment", colspan: 2, 
					subColumns: [
						{ id: 1, label: "Days", isActive: 1, },
						{ id: 2, label: "Amount", isActive: 1, },
					],
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

	getDataForMonths = (data) => {
		const formattedArray = Object.entries(data[0]).map( ([monthName, dates]) => ({ fromDate: dates[0], toDate: dates[1], monthName, }) );
		const sortedArray = formattedArray.sort(
			(a, b) => new Date(a.fromDate) - new Date(b.fromDate)
		);
		const augustIndex = sortedArray.findIndex((item) =>
			item.monthName.includes("August")
		);
		const rearrangedArray = [ ...sortedArray.slice(augustIndex), ...sortedArray.slice(0, augustIndex), ];
		return rearrangedArray;
	};

	getAllowancesColumnData = async () => {
		this.setState({
			isLoading: true,
		});
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C321CommonEmployeesSalaryAllowancesLabelView`;
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
					let { columns } = this.state;
					let index = columns.findIndex((item) => item.id == 7);
					let updatedAllowances = [
						...data,
						{ id: 1001, isActive: 1, label: "Over Time" }
					];
					columns[index]["subColumns"] = updatedAllowances;
					columns[index]["colspan"] = updatedAllowances.length == 0 ? 1 : updatedAllowances.length;
					
					this.setState({
						columns,
						allowances: data,
					});
				} else {
					this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
				}
			},
			(error) => {
				if (error.status === 401) {
					this.setState({
						isLoginMenu: true,
						isReload: true,
					});
				} else {
					this.handleOpenSnackbar("Failed to fetch, Please try again later.","error");
					console.log(error);
				}
			}
		);
		this.setState({
			isLoading: false,
		});
	};

	getDeductionsColumnData = async () => {
		this.setState({
			isLoading: true,
		});
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C321CommonEmployeesSalaryDeductionsLabelView`;
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
						let { columns } = this.state;
						let index = columns.findIndex((item) => item.id == 8);
						let updatedDeductions = [
							 ...data ,
							{ id: 2001, isActive: 1, label: "Absent Days" },
							{ id: 2002, isActive: 1, label: "Late Days" }
						];
						columns[index]["subColumns"] = updatedDeductions;
						columns[index]["colspan"] = updatedDeductions.length == 0 ? 1 : updatedDeductions.length;
						this.setState({
							columns,
							deductions: data,
						});

					} else {
						this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error" );
					}
				},
				(error) => {
					if (error.status === 401) {
						this.setState({
							isLoginMenu: true,
							isReload: true,
						});
					} else {
						this.handleOpenSnackbar(<span>Failed to fetch, Please try again later.</span>, "error" );
						console.log(error);
					}
				}
			);
		this.setState({
			isLoading: false,
		});
	};

	getData = async () => {
		this.setState({
			isLoading: true,
		});
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C321CommonUsersEmployeesPayrollView?sessionId=${this.state.sessionId}&sessionPayrollMonthId=${this.state.monthId.id}`;
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
						const allowances = this.state.allowances.map((item) => ({ ...item, allowanceValue: 0, }));
						const deductions = this.state.deductions.map((item) => ({ ...item, deductionValue: 0, }));
						const transformedData = data.map((item) => {
							const overTimeAmount = Number.isFinite(parseFloat(item.overTimeAmount)) ? parseFloat(item.overTimeAmount) : 0;
							const absentDaysAmount = Number.isFinite(parseFloat(item.lateDaysAmount)) ? parseFloat(item.lateDaysAmount) : 0;
							const lateDaysAmount = Number.isFinite(parseFloat(item.lateDaysAmount)) ? parseFloat(item.lateDaysAmount) : 0;
							const totalGrossSalary = item.perMonthSalary + overTimeAmount;
							const totalNetSalary = totalGrossSalary - absentDaysAmount - lateDaysAmount;
							return {
								employeeId: item.userId.toString(),
								userLabel: item.userLabel,
								payrollMonths: item.payrollMonths,
								perMonthSalary: Number(item.perMonthSalary) || 0,
								homeRent: 0,
								fakeGrossSallary: Number(item.perMonthSalary) || 0,
								id: item.userId,
								//grossSalary: Number(item.perMonthSalary) || 0,
								grossSalary: Number(totalGrossSalary) || 0,
								netSalary: Number(totalNetSalary)?.toFixed(2) || 0,
								leaveInCashDays: 0,
								leaveInCashAmount: 0,
								loan: 0,
								leaveInCashment: [
									{ id: 1, label: "Days", isActive: 1, value: 0 },
									{ id: 2, label: "Amount", isActive: 1, value: 0 },
								],
								adjustedOverTime: item.adjustedOverTime,
								allowances: [
									...allowances,
									{ allowanceValue:overTimeAmount, id:1001, isActive:1, label:"Over Time" }
								],
								adjustedAbsentDays : item.adjustedAbsentDays,
								adjustedLateDays : item.adjustedLateDays,
								deductions: [
									...deductions,
									{ deductionValue:absentDaysAmount, id:2001, isActive:1, label:"Absent Days" },
									{ deductionValue:lateDaysAmount, id:2002, isActive:1, label:"Late Days" },
								],
							};
						});

						this.setState({
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

	getAcademicSessionMonths = async (value) => {
		this.setState({
			isLoading: true,
		});

		const formData = new FormData();
		formData.append("sessionId", value);
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C330CommonMonthsView`;
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
						// const dataForMonths = this.getDataForMonths(data);
						this.setState({
							yearData: data,
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
		let { type , name, value, checked } = e.target;
		if (name === "sessionId") {
			this.getAcademicSessionMonths(value);
		} else if(name==="isEditable"){
			if(checked===true){
				value = 0;
			} else {
				value = 1;
			}
		}
		this.setState({ [name]: value });
	};

	componentDidMount() {
		this.props.setDrawerOpen(false);
		this.getSessionData();
		this.loadAllData();
	}

	loadAllData = async () => {
		this.setState({
			isColumnsLoading: true,
		});
		await this.getAllowancesColumnData();
		await this.getDeductionsColumnData();
		this.setState({
			isColumnsLoading: false,
		});
	};

	handleAllowanceDeductionChange = ( type, employeeIndex, allowanceOrDeductionIndex, value ) => {
		this.setState((prevState) => {
			const updatedEmployeePayrollsData = [...prevState.employeePayrollsData];
			if (type === "allowances" || type === "deductions") {
				updatedEmployeePayrollsData[employeeIndex][type][allowanceOrDeductionIndex] = { ...updatedEmployeePayrollsData[employeeIndex][type][allowanceOrDeductionIndex], [`${type === "allowances" ? "allowanceValue" : "deductionValue"}`]: value ? parseFloat(value) : 0};
			} else {
				updatedEmployeePayrollsData[employeeIndex][type] = value ? parseFloat(value) : 0;
			}
			const totalAllowances = updatedEmployeePayrollsData[ employeeIndex ].allowances.reduce( (acc, allowance) => acc + allowance.allowanceValue, 0 );
			const totalDeductions = updatedEmployeePayrollsData[ employeeIndex ].deductions.reduce( (acc, deduction) => acc + deduction.deductionValue, 0 );
			updatedEmployeePayrollsData[employeeIndex].grossSalary = Number(updatedEmployeePayrollsData[employeeIndex].fakeGrossSallary) + Number(totalAllowances);
			updatedEmployeePayrollsData[employeeIndex].netSalary = Number(updatedEmployeePayrollsData[employeeIndex].fakeGrossSallary) + Number(totalAllowances) - Number(totalDeductions);
			return { employeePayrollsData: updatedEmployeePayrollsData };
		});
	
	};
	
	handleLeaveEncashmentChange = ( type, leaveIndex, allowanceOrDeductionIndex, value ) => {
		this.setState((prevState) => {
			const updatedEmployeePayrollsData = [...prevState.employeePayrollsData];
			const employee = updatedEmployeePayrollsData[leaveIndex];
			if (type === "leaveInCashment") {
				employee[type][allowanceOrDeductionIndex] = { ...employee[type][allowanceOrDeductionIndex], value: value ? parseFloat(parseFloat(value).toFixed(2)) : 0 };
				const days = parseFloat(employee.leaveInCashment[0].value) || 0;
				const leaveInCashAmount = (employee.perMonthSalary / 30.5) * days;
				const leaveIn = parseFloat(leaveInCashAmount.toFixed(0));
				if (allowanceOrDeductionIndex === 0) {
					const days = parseFloat(employee.leaveInCashment[0].value) || 0;
					const leaveInCashAmount = (employee.perMonthSalary / 30.5) * days;
					const leaveIn = parseFloat(leaveInCashAmount.toFixed(0));
					employee.leaveInCashment[1].value = leaveIn;
					employee.leaveInCashAmount = leaveIn;
					employee.leaveInCashDays = days;
				}
			} else {
				employee[type] = value ? parseFloat(value) : 0;
			}
			const totalAllowancesSum = employee.allowances.reduce((acc, allowance) => acc + (allowance.allowanceValue || 0), 0);
			const totalDeductionsSum = employee.deductions.reduce((acc, allowance) => acc + (allowance.deductionValue || 0), 0);
			const days = parseFloat(employee.leaveInCashment[0].value) || 0;
			const leaveInCashAmount = (employee.perMonthSalary / 30.5) * days;
			const leaveIn = parseFloat(leaveInCashAmount.toFixed(0));
			employee.grossSalary = Number((Number(employee.perMonthSalary) + leaveIn + totalAllowancesSum -	totalDeductionsSum).toFixed(0));
			employee.netSalary = Number( ( Number(employee.perMonthSalary) + leaveIn + totalAllowancesSum - totalDeductionsSum ).toFixed(0) );
			employee.fakeGrossSallary = Number( (Number(employee.perMonthSalary) + leaveIn).toFixed(0) );
			return { employeePayrollsData: updatedEmployeePayrollsData };
		});
	};

	onApproveClick = async (e) => {
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C321CommonEmployeesMonthlyPayrollVoucherSave`;
		const result = {
			year: this.state.yearId,
			sessionPayrollMonthId: this.state.monthId.id,
			fromDate: this.state.monthId.fromDate,
			toDate: this.state.monthId.toDate,
			sessionId: this.state.sessionId,
			isEditable: this.state.isEditable,
			employeePayrolls: this.state.employeePayrollsData.map((employee) => {
				// Separate allowances with id 1001
				const overTimeAmount = employee.allowances.find((allowance) => allowance.id === 1001) ?.allowanceValue || 0;
				// Separate deductions with id 2001 and 2002
				const absentDaysAmount = employee.deductions.find((deduction) => deduction.id === 2001) ?.deductionValue || 0;
				const lateDaysAmount = employee.deductions.find((deduction) => deduction.id === 2002) ?.deductionValue || 0;
				return {
					employeeId: employee.employeeId,
					homeRent: Number(employee.homeRent.toFixed(0)),
					grossSalary: Number(employee.grossSalary.toFixed(0)),
					netSalary: employee.netSalary,
					leaveInCashDays: employee.leaveInCashDays,
					leaveInCashAmount: employee.leaveInCashAmount,
					adjustedOverTime: employee.adjustedOverTime,
					overTimeAmount: overTimeAmount,
					adjustedAbsentDays: employee.adjustedAbsentDays,
					absentDaysAmount: absentDaysAmount,
					adjustedLateDays: employee.adjustedLateDays,
					lateDaysAmount: lateDaysAmount,
					deductions: employee.deductions .filter((deduction) => deduction.id !== 2001 && deduction.id !== 2002) .map((deduction) => ({ deductionId: deduction.id, deductionValue: Number(deduction.deductionValue.toFixed(2)), })),
					allowances: employee.allowances .filter((allowance) => allowance.id !== 1001 ) .map((allowance) => ({ allowanceId: allowance.id, allowanceValue: Number(allowance.allowanceValue.toFixed(2)), })),
				};
			}),
		};

		await fetch(url, {
			method: "POST",
			body: JSON.stringify(result),
			headers: new Headers({
				Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
				"Content-Type": "application/json",
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
						//this.getData();
						this.setState({
							sessionId: "",
							monthId: "",
							employeePayrollsData: [],
							isEditable: 1
						});
						this.handleOpenSnackbar("Saved", "success");
					} else {
						this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>, "error" );
					}
				},
				(error) => {
					if (error.status == 401) {
						this.setState({
							isLoginMenu: true,
							isReload: false,
						});
					} else {
						this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
					}
				}
			);
		this.setState({ isLoading: false });
	};

	viewReport = () => {
		window.location = "#/dashboard/F321Reports";
	};

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
				<div style={{ padding: 20, }} >
					<div style={{ display: "flex", justifyContent: "space-between", }} >
						<Typography
							style={{
								color: "#1d5f98",
								fontWeight: 600,
								textTransform: "capitalize",
							}}
							variant="h5"
						>
							Payroll Monthly Voucher
						</Typography>
					</div>
					<Divider
						style={{
							backgroundColor: "rgb(58, 127, 187)",
							opacity: "0.3",
							marginBottom: 20,
						}}
					/>

					<Grid 
						container 
						spacing={2} 
						direction="row"
  						justifyContent="space-around"
  						alignItems="center"
					>
						<Grid item xs={12} md={6}>
							<TextField
								id="sessionId"
								name="sessionId"
								label="Session"
								required
								variant="outlined"
								onChange={this.onHandleChange}
								value={this.state.sessionId}
								// helperText={this.state.monthIdError}
								// error={this.state.monthIdError}
								select
								fullWidth
							>
								<MenuItem value=""><em>None</em></MenuItem>
								{this.state.sessionData.map((item) => {
									return (
										<MenuItem key={item.ID} value={item.ID}>
											{item.Label}
										</MenuItem>
									);
								})}
							</TextField>
						</Grid>
						<Grid item xs={12} md={5}>
							<TextField
								id="monthId"
								name="monthId"
								label="Month"
								disabled={!this.state.sessionId}
								required
								variant="outlined"
								onChange={this.onHandleChange}
								value={this.state.monthId}
								helperText={this.state.monthIdError}
								error={!!this.state.monthIdError}
								select
								fullWidth
							>
								<MenuItem value=""><em>None</em></MenuItem>
								{this.state.yearData.map((item) => {
									return (
										<MenuItem key={item.id} value={item}>
											{item.monthName}
										</MenuItem>
									);
								})}
							</TextField>
						</Grid>
						<Grid item xs={4} md={1}>
							<Button
								variant="contained"
								color="primary"
								className={classes.button}
								disabled={this.state.isLoading || !this.state.sessionId || !this.state.monthId}
								onClick={(e) => this.getData(e)}
								fullWidth
								style={{padding:13}}
							>
								{this.state.isLoading ? (
									<CircularProgress style={{ color: "white" }} size={24} />
								) : (
									"Search"
								)}
							</Button>
						</Grid>
						<Grid item xs={12}>
							<Divider
								style={{
									backgroundColor: "rgb(58, 127, 187)",
									opacity: "0.3"
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<TableContainer
								component={Paper}
								style={{
									paddingBottom: "30px",
									marginBottom: "3%",
									maxHeight: 500
								}}
							>
								<Table className={classes.table}>
									<TableHead style={{position:"sticky", top:0, zIndex: 1}}>
										<TableRow
											style={{
												border: "1px solid white",
											}}
										>
											{this.state.columns?.map((item, columnsIndex) => {
												return (
													<StyledTableCell
														key={`columns-${columnsIndex}`}
														style={{
															border: "1px solid white",
														}}
														colSpan={item.colspan || 1}
														className={classes.headerTitle}
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
															{col.subColumns?.map((item, subColumnsIndex) => {
																return (
																	<StyledTableCell
																		className={classes.headerTitle}
																		key={`subColumns-${colIndex}-${subColumnsIndex}`}
																		style={{
																			border: "1px solid white",
																			whiteSpace: "nowrap",
																			minWidth: 56
																		}}
																	>
																		{item.label || ""}
																	</StyledTableCell>
																);
															})}
														</>
													);
												} else {
													return <StyledTableCell key={`subColumns-${colIndex}`}>{""}</StyledTableCell>;
												}
											})}
										</TableRow>
									</TableHead>
									<TableBody>
										{employeePayrollsData.map((employee, employeeIndex) => (
											<StyledTableRow key={`employeePayrollsData-${employeeIndex}`}>
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
														key={`leaveInCashment-${leaveIndex}`}
														className={classes.subColumnCell}
													>
														<TextField
															size="small"
															style={{ width: leave.label === "Days" ? "50px" : "100px" }}
															variant="outlined"
															value={leave.value}
															disabled={leave.label === "Amount"}
															onChange={(e) =>
																this.handleLeaveEncashmentChange( "leaveInCashment", employeeIndex, leaveIndex, Math.max(0, parseFloat(e.target.value) || 0) )
															}
															inputProps={{
																style:{padding: "8px"}
															}}
														/>
													</TableCell>
												))}
												{employee.allowances.length > 0 ? (
													employee.allowances.map((allowance, allowanceIndex) => (
														<TableCell
															key={`allowance-${allowanceIndex}`}
															className={classes.subColumnCell}
														>
															<TextField
																size="small"
																variant="outlined"
																fullWidth
																value={allowance.allowanceValue}
																disabled={allowance.id===1001}
																onChange={(e) =>
																	this.handleAllowanceDeductionChange( "allowances", employeeIndex, allowanceIndex, e.target.value )
																}
																inputProps={{
																	style:{padding: "8px"}
																}}
																
															/>
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
												{employee.deductions.length > 0 ? (
													employee.deductions.map((deduction, deductionIndex) => (
														<TableCell
															key={`deduction-${deductionIndex}`}
															className={classes.subColumnCell}
														>
															<TextField
																size="small"
																variant="outlined"
																fullWidth
																value={deduction.deductionValue}
																disabled={deduction.id === 2001 || deduction.id === 2002}
																onChange={(e) =>
																	this.handleAllowanceDeductionChange( "deductions", employeeIndex, deductionIndex, e.target.value )
																}
																inputProps={{
																	style:{padding: "8px"}
																}}
															/>
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
						</Grid>
					</Grid>
					<CustomizedSnackbar
						isOpen={this.state.isOpenSnackbar}
						message={this.state.snackbarMessage}
						severity={this.state.snackbarSeverity}
						handleCloseSnackbar={this.handleCloseSnackbar}
					/>
				</div>
				<div>
					<FormControlLabel 
						control={
							<Checkbox 
								key={`isEditable_${this.state.isEditable}`}
								name="isEditable"
								color="primary" 
								checked={this.state.isEditable===0}
								onChange={this.onHandleChange}
								value={this.state.isEditable}
							/>
						} 
						label="Verified" 
						style={{
							position:"fixed", 
							right:100, 
							bottom:2, 
							zIndex:1101
						}}
					/>
					<BottomBar
						// leftButtonHide
						leftButtonText="View"
						leftButtonHide={false}
						bottomLeftButtonAction={this.viewReport}
						right_button_text={this.state.isApproved ? "Saved" : "Save"}
						loading={this.state.isLoading}
						isDrawerOpen={this.props.isDrawerOpen}
						disableRightButton={!this.state.sessionId || !this.state.monthId}
						bottomRightButtonAction={() => this.onApproveClick()}
					/>
				</div>
			</Fragment>
		);
	}
}

F321Form.propTypes = {
	classes: PropTypes.object,
};

F321Form.defaultProps = {
	classes: {},
};
export default withStyles(styles)(F321Form);
