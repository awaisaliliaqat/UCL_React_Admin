import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Tooltip, TextField, Grid, Divider, MenuItem, CircularProgress, } from "@material-ui/core";

const styles = {
	dialogTitle: {
		paddingBottom: 0,
	},
	divider: {
		backgroundColor: "rgb(58, 127, 187)",
		opacity: "0.3",
	},
};

class F09FormPopupComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			popupBoxOpen: false,
			fromSessionData: [],
			programmeGroupIdMenuItems: [],
			toSessionData: [],
			fromSessionId: "",
			toSessionId: "",
			programmeGroupId: "",
		};
	}

	handleClickOpen = () => {
		this.setState({ popupBoxOpen: true });
	};

	handleClose = () => {
		this.setState({ popupBoxOpen: false });
	};

	handleOpenSnackbar = (msg, str) => {
		const { handleOpenSnackbar } = this.props;
		handleOpenSnackbar(msg, str);
	};

	getFromSessionsData = async () => {
			// this.setState({ academicSessionsDataLoading: true });
			const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C09CommonAcademicsSessionsFromView`;
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
							this.setState((prevState) => ({
								...prevState,
								fromSessionData: [json.DATA[0]],
							}));
						} else {
							this.handleOpenSnackbar(<span> {json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>, "error" );
						}
					},
					(error) => {
						if (error.status == 401) {
							this.setState({
								isLoginMenu: true,
								isReload: true,
							});
						} else {
							this.handleOpenSnackbar( "Failed to fetch ! Please try Again later.", "error" );
						}
					}
				);
			// this.setState({ academicSessionsDataLoading: false });
		};

	loadProgrammeGroups = async (fromSessionData) => {
		// this.setState({ isLoading: true });
		let data = new FormData();
		data.append("academicsSessionId", fromSessionData);
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C09CommonAcademicsSessionsOfferedProgrammesGroupView`;
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
						this.setState({ programmeGroupIdMenuItems: json.DATA });
					} else {
						this.handleOpenSnackbar(
							json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
							"error"
						);
					}
					console.log("loadProgrammeGroups", json);
				},
				(error) => {
					if (error.status == 401) {
						this.setState({
							isLoginMenu: true,
							isReload: false,
						});
					} else {
						console.log(error);
						this.handleOpenSnackbar(
							"Failed to fetch ! Please try Again later.",
							"error"
						);
					}
				}
			);
		// this.setState({ isLoading: false });
	};
	
		getToSessionsData = async () => {
			// this.setState({ academicSessionsDataLoading: true });
			const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C09CommonAcademicsSessionsToView`;
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
							console.log(json.DATA);
							this.setState((prevState) => ({
								...prevState,
								toSessionData: json.DATA,
							}));
							console.log(json);
						} else {
							this.handleOpenSnackbar(<span> {json.SYSTEM_MESSAGE} <br /> {json.USER_MESSAGE} </span>, "error" );
						}
					},
					(error) => {
						if (error.status == 401) {
							this.setState({
								isLoginMenu: true,
								isReload: true,
							});
						} else {
							this.handleOpenSnackbar("Failed to fetch ! Please try Again later.", "error" );
						}
					}
				);
			// this.setState({ academicSessionsDataLoading: false });
		};

	saveCopyToNext = async () => {
		const data = new FormData();
		data.append("previousAcademicSessionId", this.state.fromSessionId);
		data.append("newAcademicSessionId", this.state.toSessionId);
		data.append("programmeGroupId", parseInt(this.state.programmeGroupId) || 0);
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C09CommonCourseSelectionGroupCopyToNextSession`;
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
					console.log(json);
					if (json.CODE === 1) {
						this.handleOpenSnackbar("Saved", "success");
						this.handleClose();
					} else if (json.CODE === 3) {
						this.handleOpenSnackbar(json.USER_MESSAGE, "error");
						this.handleClose();
					}
				},
				(error) => {
					if (error.status == 401) {
					} else {
						this.handleOpenSnackbar( "Failed to Load Data ! Please try Again later.", "error" );
					}
				}
			);
	};

	onHandleChange = (e) => {
		const { name, value } = e.target;
		const errName = `${name}Error`;
		let regex = "";
		switch (name) {
			case "programmeGroupId":
				
				break;
			case "fromSessionId":
				this.loadProgrammeGroups(value);

				break;
			default:
				break;
		}

		this.setState({
			[name]: value,
			[errName]: "",
		});
	};

	componentDidMount(){
		this.getFromSessionsData();
		this.getToSessionsData();
	}

	render() {

		const { classes } = this.props;

		return (
			<Fragment>
				<Tooltip>
					<Button
						variant="contained"
						onClick={this.handleClickOpen}
						style={{
							background: "#1565c0",
							color: "white",
							marginBottom: "5px",
						}}
					>
						Copy To Next Session
					</Button>
				</Tooltip>
				<Dialog
					open={this.state.popupBoxOpen}
					onClose={this.handleClose}
					aria-labelledby="responsive-dialog-title"
					maxWidth={false}
				>
					<DialogTitle
						className={classes.dialogTitle}
						id="responsive-dialog-title"
						style={{
							color: "#1565c0",
						}}
					>
						Copy Course Selection Group
					</DialogTitle>
					<Divider className={classes.divider} />
					<DialogContent style={{minWidth:450}}>
						<Grid container spacing={2}>
						<Grid item xs={6}>
							<TextField
								id="fromSessionId"
								name="fromSessionId"
								label="From"
								required
								fullWidth
								variant="outlined"
								onChange={this.onHandleChange}
								value={this.state.fromSessionId}
								select
							>
								{this.state.fromSessionData.map((item) => (
									<MenuItem key={item.ID} value={item.ID}>
										{item.Label}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={6}>
							<TextField
								id="programmeGroupId"
								name="programmeGroupId"
								variant="outlined"
								label="Programme Group"
								onChange={this.onHandleChange}
								value={this.state.programmeGroupId}
								disabled={!this.state.fromSessionId}
								fullWidth
								select
							>
								{this.state.programmeGroupIdMenuItems ? (
									this.state.programmeGroupIdMenuItems.map((dt, i) => (
										<MenuItem
											key={"programmeGroupIdMenuItems" + dt.Id}
											value={dt.Id}
										>
											{dt.Label}
										</MenuItem>
									))
								) : (
									<MenuItem>
										<CircularProgress size={24} />
									</MenuItem>
								)}
							</TextField>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="toSessionId"
								name="toSessionId"
								label="To"
								required
								fullWidth
								variant="outlined"
								onChange={this.onHandleChange}
								value={this.state.toSessionId}
								select
							>
								{this.state.toSessionData.map((item) => (
									<MenuItem key={item.ID} value={item.ID}>
										{item.Label}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						</Grid>
					</DialogContent>
					<Divider className={classes.divider} />
					<DialogActions>
						<Button onClick={this.handleClose} color="secondary">
							Close
						</Button>
						<Button
							onClick={this.saveCopyToNext}
							color="primary"
							disabled={
								this.state.fromSessionId === "" || this.state.toSessionId === ""
							}
						>
							Save
						</Button>
					</DialogActions>
				</Dialog>
			</Fragment>
		);
	}
}

F09FormPopupComponent.propTypes = {
	classes: PropTypes.object.isRequired,
	data: PropTypes.array.isRequired,
};

F09FormPopupComponent.defaultProps = {
	classes: {},
};

export default withStyles(styles)(F09FormPopupComponent);
