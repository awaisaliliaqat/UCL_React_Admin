import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Tooltip, TextField, Grid, Divider, MenuItem, } from "@material-ui/core";

const styles = {
	dialogTitle: {
		paddingBottom: 0,
	},
	divider: {
		backgroundColor: "rgb(58, 127, 187)",
		opacity: "0.3",
	},
};

class CreateSectionPopupComponent extends Component {
	constructor(props) {
		super(props);
		console.log(props, "props are coming");
		this.state = {
			popupBoxOpen: false,
			fromSessionData: [],
			toSessionData: [],
			fromSessionId: "",
			toSessionId: "",
			programmeGroupData: [],
			programmeGroupId : ""
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
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C26CommonAcademicsSessionsFromView`;
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
					this.handleOpenSnackbar( <span> {json.SYSTEM_MESSAGE} <br /> {json.USER_MESSAGE} </span>, "error" );
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
	};

	getProgrammeData = async (id) => {
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C26CommonAcademicsSessionsOfferedProgrammesView?sessionId=${id}`;
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
						this.setState({
							programmeGroupData: json.DATA || []
						});
					} else {
						this.handleOpenSnackbar( json.USER_MESSAGE + "\n" + json.SYSTEM_MESSAGE, "error" );
					}
				},
				(error) => {
					if (error.status == 401) {
						this.setState({
							isLoginMenu: true,
							isReload: true,
						});
					} else {
						console.log(error);
						this.handleOpenSnackbar( "Failed to Load Data ! Please try Again later.", "error" );
					}
				}
			);
	};

	getToSessionsData = async () => {
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C26CommonAcademicsSessionsToView`;
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
					this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE} </span>, "error" );
				}
			},
			(error) => {
				if (error.status == 401) {
					this.setState({
						isLoginMenu: true,
						isReload: true,
					});
				} else {
					this.handleOpenSnackbar(
						"Failed to fetch ! Please try Again later.",
						"error"
					);
				}
			}
		);
	};

	saveCopyToNext = async () => {
		const data = new FormData();
		data.append("fromSessionId", this.state.fromSessionId);
		data.append("toSessionId", this.state.toSessionId);
		data.append("programmeGroupId", parseInt(this.state.programmeGroupId) || 0);
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C26CommonAcademicsSectionsCopyToNextSession`;
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

		switch (name) {
			case "fromSessionId":
				this.getProgrammeData(value);
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
				<Dialog
					maxWidth="md"
					open={this.state.popupBoxOpen}
					onClose={this.handleClose}
					aria-labelledby="responsive-dialog-title"
				>
					<DialogTitle
						className={classes.dialogTitle}
						id="responsive-dialog-title"
						style={{
							color: "#1565c0",
						}}
					>
						Copy Sections
					</DialogTitle>
					<Divider className={classes.divider} />
					<DialogContent style={{minWidth: 600}}>
						<Grid container spacing={2}>
						<Grid item xs={4}>
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
						<Grid item xs={8}>
							<TextField
								id="programmeGroupId"
								name="programmeGroupId"
								label="Programme Group"
								disabled={!this.state.fromSessionId}
								required
								fullWidth
								variant="outlined"
								onChange={this.onHandleChange}
								value={this.state.programmeGroupId}
								select
							>
								{this.state.programmeGroupData.map((item) => {
									return (
										<MenuItem key={item.Id} value={item.Id}>
											{item.Label}
										</MenuItem>
									);
								})}
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

CreateSectionPopupComponent.propTypes = {
	classes: PropTypes.object.isRequired
};

CreateSectionPopupComponent.defaultProps = {
	classes : {}
};

export default withStyles(styles)(CreateSectionPopupComponent);
