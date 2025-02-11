import React, { Component } from "react";
import { Button, Divider, Grid } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import ReportingEmployeesGateAttendanceViewTableComponent from "./ReportingEmployeesGateAttendanceViewTableComponent";
import { withStyles } from "@material-ui/core/styles";
import { format } from 'date-fns';

const styles = (theme) => ({
	container: {
		padding: theme.spacing(2),
	},
	divider: {
		backgroundColor: "rgb(58, 127, 187)",
		opacity: "0.3",
		width: "100%",
	}
});

class ReportingEmployeesGateAttendance extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			employeePayrollsData: [],
			isLoginMenu: false,
			isReload: true,
			isOpenSnackbar: false,
			snackbarMessage: "",
			snackbarSeverity: "",
			fromDate: new Date(),
			toDate: new Date()
		};
	}

	handleSnackbar = (open, msg, severity) => {
		this.setState({
			isOpenSnackbar: open,
			snackbarMessage: msg,
			snackbarSeverity: severity,
		});
	};

	getData = async () => {
		this.setState({ isLoading: true });
		let formData = new FormData();
		formData.append("fromDate", `${format(this.state.fromDate, "dd/MM/yyyy")}`);
		formData.append("toDate", `${format(this.state.toDate, "dd/MM/yyyy")}`);
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonEmployeeDashboard/ReportingEmployeesGateAttendanceView`;
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

						this.setState({
							employeePayrollsData: data,
						});
					} else {
						this.handleSnackbar(true, json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,"error");
					}
					console.log(json);
				},
				(error) => {
					if (error.status === 401) {
						this.setState({
							isLoginMenu: true,
							isReload: true,
						});
					} else {
						this.handleSnackbar(true,"Failed to fetch, Please try again later.","error");
						console.log(error);
					}
				}
			);
			this.setState({ isLoading: false, });
	};

	onHandleChange = (event) => {
		const { name, value } = event.target;
		this.setState({
			[name]: value
		});
	};

	componentDidMount() {
		this.getData();
	}

	handleOpenSnackbar = (msg, severity) => {
		this.setState({
			isOpenSnackbar: true,
			snackbarMessage: msg,
			snackbarSeverity: severity,
		});
	};

	shouldDisableDate = (date) => {
		const { fromDate } = this.state;
		if (fromDate) {
			// Create new Date objects to avoid mutation
			const startOfFromDate = new Date(fromDate);
			startOfFromDate.setHours(0, 0, 0, 0);
			const compareDate = new Date(date);
			compareDate.setHours(0, 0, 0, 0);
			return compareDate < startOfFromDate;
		}
		return false;
	};

	render() {

		const { classes, showTableFilter } = this.props;

		const columns = [
			{ name: "userId", title: "Employee Id", flex: 1 },
			{ name: "userName", title: "Employee Name", flex: 1 },
			{ name: "attendanceDate", title: "Attendance Date", flex: 1 },
			{
				name: "checkIn",
				title: "Check-in Time",
				flex: 1,
				getCellValue: (rowData) => {
					return (
						<>
							{rowData.checkInCheckOut.length !== 0 ? (
								rowData.checkInCheckOut.map((item, index) => (
									<div key={index} style={{ borderBottom: index === rowData.checkInCheckOut.length - 1 ? "none" : "1px solid #DADBDD", minHeight: "30px", }} > {item.checkIn} </div>
								))
							) : (
								<div style={{ minHeight: "30px" }}></div>
							)}
						</>
					);
				},
			},
			{
				name: "checkOut",
				title: "Check-out Time",
				flex: 1,
				getCellValue: (rowData) => {
					return (
						<>
							{rowData.checkInCheckOut.length !== 0 ? (
								rowData.checkInCheckOut.map((item, index) => (
									<div key={index} style={{ borderBottom: index === rowData.checkInCheckOut.length - 1 ? "none" : "1px solid #DADBDD", minHeight: "30px", }} > {item.checkOut} </div>
								))
							) : (
								<div style={{ minHeight: "30px" }}></div>
							)}
						</>
					);
				},
			},
		];

		return (
			<Grid 
				container 
				spacing={2}
				justifyContent="center" 
				alignItems="center" 
				className={classes.container}
			>
				<Grid item xs={12} md={5}>
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
						onChange={(date) => this.onHandleChange({target: { name: "fromDate", value: date }}) }
					/>
				</Grid>
				<Grid item xs={12} md={6}>
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
						disabled={!this.state.fromDate}
						value={this.state.toDate}
						onChange={(date) => this.onHandleChange({target: { name: "toDate", value: date }}) }
						shouldDisableDate={this.shouldDisableDate}
						minDate={this.state.fromDate}
					/>
				</Grid>
				<Grid item xs={12} md={1}>
					<Button 
						variant="outlined" 
						color="primary" 
						size="large" 
						onClick={this.getData} 
						fullWidth 
						style={{padding:"14px 0px"}}
						disabled={!!this.state.isLoading}
					>
						Search
					</Button>
				</Grid>
				<Divider className={classes.divider} />
				<Grid item xs={12}>
					<ReportingEmployeesGateAttendanceViewTableComponent
						rows={this.state.employeePayrollsData}
						columns={columns}
						showFilter={showTableFilter}
						isLoading={this.state.isLoading}
					/>
				</Grid>
			</Grid>
		);
	}
}

export default withStyles(styles)(ReportingEmployeesGateAttendance);
