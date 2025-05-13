import React, { Component, Fragment } from "react";
import { Divider, IconButton, Tooltip, CircularProgress, Grid, Typography, withStyles } from "@material-ui/core";
import { format } from "date-fns";
import F359ReportsTableComponent from "./F359ReportsTableComponent";
import FilterIcon from "mdi-material-ui/FilterOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import DeleteIcon from "@material-ui/icons/Delete";

const styles = (theem) => ({
    root: {
        padding: `${theem.spacing(2)}px ${theem.spacing(4)}px`,
    }
});

class F359Reports extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			showTableFilter: false,
			showSearchBar: false,
			isDownloadExcel: false,
			applicationStatusId: 1,
			admissionData: null,
			genderData: [],
			degreeData: [],
			studentName: "",
			genderId: 0,
			degreeId: 0,
			applicationId: "",
			isLoginMenu: false,
			isReload: false,
			eventDate: null,
			isOpenSnackbar: false,
			snackbarMessage: "",
			snackbarSeverity: "",
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
		this.setState({
			isOpenSnackbar: false,
		});
	};

	onClearFilters = () => {
		this.setState({
			studentName: "",
			genderId: 0,
			degreeId: 0,
			applicationId: "",
			eventDate: null,
		});
	};

	handleDateChange = (date) => {
		this.setState({
			eventDate: date,
		});
	};

	getData = async () => {
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C359CommonEmployeesDesignations/EmployeesDesignationsView`;
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
					this.setState({ admissionData: DATA || [] });
					for (var i=0; i< DATA.length; i++) {
						const id = DATA[i].id;
						DATA[i].srNo = (1+i);
						DATA[i].action = (
							<Tooltip title="Delete">
								<IconButton
									onClick={(e)=>this.deleteData(id)}
								>
									<DeleteIcon fontSize="small" color="error" />
								</IconButton>
							</Tooltip>
						);
					}
				} else {
					this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>, "error" );
				}
			},
			(error) => {
				if (error.status === 401) {
					this.setState({
						isLoginMenu: true,
						isReload: true,
					});
				} else {
					this.handleOpenSnackbar("Failed to fetch, Please try again later.", "error");
					console.log(error);
				}
			}
		);
		this.setState({ isLoading: false });
	};

	deleteData = async (id) => {
		alert(id);
		const data = new FormData();
		data.append("id", Number(id));
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C359CommonEmployeesDesignations/EmployeeDesignationDelete`;
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
				const { CODE, DATA, USER_MESSAGE, SYSTEM_MESSAGE } = json;
				if (CODE === 1) {
					this.handleOpenSnackbar(USER_MESSAGE, "success");
					this.getData();
				} else {
					this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>, "error" );
				}
				console.log(json);
			},
			(error) => {
				if (error.status === 401) {
					this.setState({
						isLoginMenu: true,
						isReload: false,
					});
				} else {
					//alert('Failed to fetch, Please try again later.');
					this.handleOpenSnackbar( "Failed to fetch, Please try again later.", "error" );
					console.log(error);
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

	handleToggleSearchBar = () => {
		this.setState({ showSearchBar: !this.state.showSearchBar });
	};

	componentDidMount() {
		this.getData(this.state.applicationStatusId);
	}

	render() {

		const { classes } = this.props;

		return (
			<Fragment>
				<LoginMenu
					reload={this.state.isReload}
					open={this.state.isLoginMenu}
					handleClose={() => this.setState({ isLoginMenu: false })}
				/>
				<Grid 
					container 
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
						>
							<Tooltip title="Back">
								<IconButton onClick={() => window.history.back()}>
									<ArrowBackIcon fontSize="small" color="primary" />
								</IconButton>
							</Tooltip>
							Employees Designations Report
							<div style={{ float: "right" }}>
								<Tooltip title="Table Filter">
									<IconButton
										style={{ marginLeft: "-10px" }}
										onClick={this.handleToggleTableFilter}
									>
										<FilterIcon fontSize="medium" color="primary" />
									</IconButton>
								</Tooltip>
							</div>
						</Typography>
						<Divider
							style={{
								backgroundColor: "rgb(58, 127, 187)",
								opacity: "0.3",
								width: "100%"
							}}
						/>
					</Grid>
					{this.state.admissionData ? (
						<F359ReportsTableComponent
							isLoading={this.state.isLoading}
							rows={this.state.admissionData}
							showFilter={this.state.showTableFilter}
						/>
					) : (
						<Grid container justifyContent="center" alignItems="center">
							<CircularProgress />
						</Grid>
					)}
					<CustomizedSnackbar
						isOpen={this.state.isOpenSnackbar}
						message={this.state.snackbarMessage}
						severity={this.state.snackbarSeverity}
						handleCloseSnackbar={() => this.handleCloseSnackbar()}
					/>
				</Grid>
			</Fragment>
		);
	}
}
export default withStyles(styles)(F359Reports);
