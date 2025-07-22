import React, { Component, Fragment } from "react";
import { Divider, IconButton, Tooltip, CircularProgress, Grid, Typography, withStyles } from "@material-ui/core";
import { format } from "date-fns";
import F352ReportsTableComponent from "./F352ReportsTableComponent";
import FilterIcon from "mdi-material-ui/FilterOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import EditDeleteTableRecord from "../../../../../components/EditDeleteTableRecord/EditDeleteTableRecord";

const styles = (theem) => ({
    root: {
        padding: `${theem.spacing(2)}px ${theem.spacing(4)}px`,
    }
});

class F352Reports extends Component {
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
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C352CommonEmployeesLeavePlans/View`;
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
					this.setState({ admissionData: json.DATA || [] });
					for (var i = 0; i < json.DATA.length; i++) {
						json.DATA[i].srNo = (1+i);
						json.DATA[i].action = (
							<EditDeleteTableRecord
								recordId={json.DATA[i].id}
								DeleteData={this.DeleteData}
								onEditURL={`#/dashboard/F352Form/${json.DATA[i].id}`}
								handleOpenSnackbar={this.handleOpenSnackbar}
							/>
						);
					}
				} else {
					//alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
					this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>, "error" );
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
					//alert('Failed to fetch, Please try again later.');
					this.handleOpenSnackbar("Failed to fetch, Please try again later.", "error");
					console.log(error);
				}
			}
		);
		this.setState({ isLoading: false });
	};

	DeleteData = async (event) => {
		event.preventDefault();
		const data = new FormData(event.target);
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/payroll/C352CommonEmployeesLeavePlans/Delete`;
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
				if (json.CODE === 1) {
					this.handleOpenSnackbar(json.USER_MESSAGE, "success");
					this.getData();
				} else {
					//alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
					this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>, "error" );
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
							Employee Leave Plan Report
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
						<F352ReportsTableComponent
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
export default withStyles(styles)(F352Reports);
