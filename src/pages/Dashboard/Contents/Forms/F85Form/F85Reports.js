import React, { Component, Fragment } from "react";
import { Divider, Grid, IconButton, Tooltip, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import FilterIcon from "mdi-material-ui/FilterOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import EditDeleteTableComponent from "../../../../../components/EditDeleteTableRecord/EditDeleteTableComponent";
import F85ReportsTableComponent from "./Chunks/F85ReportsTableComponent";
import { format } from "date-fns";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { CircularProgress } from "@material-ui/core";

const styles = () => ({
	root: {
		paddingBottom: 50,
		paddingLeft: 20,
		paddingRight: 20,
	},
	divider: {
		backgroundColor: "rgb(58, 127, 187)",
		opacity: "0.3",
		width: "100%"
	}
});

class F85Reports extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			showTableFilter: false,
			admissionData: [],
			isLoginMenu: false,
			isReload: false,
			isOpenSnackbar: false,
			snackbarMessage: "",
			snackbarSeverity: "",
			expandedGroupsData: [],
			downloadingFileId : null,
			abortController : null
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

	getData = async () => {
		this.setState({
			isLoading: true,
		});
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C85CommonUsersDocuments/View`;
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
						let expandedGroupsData = [];
						for (let i = 0; i < json.DATA.length; i++) {
							const id = json.DATA[i].id;
							expandedGroupsData.push(json.DATA[i].userLabel);
							json.DATA[i].action = (
								<EditDeleteTableComponent
									recordId={id}
									deleteRecord={this.DeleteData}
									editRecord={() =>
										window.location.replace(
											`#/dashboard/define-employees/${id}`
										)
									}
								/>
							);
						}
						this.setState({
							admissionData: json.DATA || [],
							expandedGroupsData
						});
					} else {
						this.handleOpenSnackbar(
							json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
							"error"
						);
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
						this.handleOpenSnackbar(
							"Failed to fetch, Please try again later.",
							"error"
						);
						console.log(error);
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
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C23CommonUsersDeleteV2`;
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
						this.handleOpenSnackbar("Deleted", "success");
						this.getData();
					} else {
						this.handleOpenSnackbar(
							json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
							"error"
						);
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
						this.handleOpenSnackbar(
							"Failed to fetch, Please try again later.",
							"error"
						);
						console.log(error);
					}
				}
			);
	};

	downloadFile = (userId, fileName, rowId) => {
		// Abort previous download if it exists
		if (this.state.abortController) {
			this.state.abortController.abort();
		}
		// Use a short timeout to allow state reset before starting new download
 	 	setTimeout(() => {
			// Create a new AbortController for this download
			const controller = new AbortController();
			const signal = controller.signal;
			this.setState({
				downloadingFileId: rowId,
				abortController: controller,
			});
			const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonUsersDocumentsFileView?userId=${encodeURIComponent(userId)}&fileName=${encodeURIComponent(fileName)}`;
			fetch(url, {
				method: "GET",
				headers: {
					Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
				},
				signal: signal,
			})
			.then((res) => {
				if (res.ok) {
					return res.blob();
				} else if (res.status === 401) {
					this.setState({
						isLoginMenu: true,
						isReload: false,
					});
					throw new Error("Unauthorized");
				} else if (res.status === 404) {
					this.handleOpenSnackbar("File not found.", "error");
					throw new Error("File not found");
				} else {
					this.handleOpenSnackbar("Operation failed. Please try again later.", "error");
					throw new Error(`Download failed with status ${res.status}`);
				}
			})
			.then((blob) => {
				if (!blob) return; // Skip if aborted or errored
				const downloadUrl = window.URL.createObjectURL(blob);
				const tempLink = document.createElement("a");
				tempLink.href = downloadUrl;
				tempLink.setAttribute("download", fileName);
				document.body.appendChild(tempLink);
				tempLink.click();
				document.body.removeChild(tempLink);
				window.URL.revokeObjectURL(downloadUrl);
			})
			.catch((error) => {
				if (error.name === "AbortError") {
					this.handleOpenSnackbar("Download cancelled.", "warning");
				} else {
					console.error("Download error:", error);
				}
			})
			.finally(() => {
				this.setState({
					downloadingFileId: null,
					abortController: null,
				});
			});
		}, 100); // 100ms delay to allow state clearing
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
		const { isDrawerOpen = false, setDrawerOpen = () => { } } = this.props;
		if (isDrawerOpen) {
			setDrawerOpen(false);
		}
		this.getData();
	}

	render() {

		const { classes } = this.props;

		const columns = [
			// { name: "action", title: "Action" },
			{ name: "id", title: "ID" },
			{ name: "userId", title: "User ID" },
			{ name: "userLabel", title: "User Name" },
			{ name: "label", title: "Label" },
			// { name: "documentName", title: "Document Name" },
			// { name: "fileName", title: "File Name" },
			{ name: "description", title: "Description" },
			{ name: "uploadedByLabel", title: "Uploaded By" },
			{ name: "uploadedOn", title: "Uploaded On",
				getCellValue: (row) => row.uploadedOn ? format(row.uploadedOn, "dd-MM-yyyy hh:mm a") : ""
			},
			{ name: "downloadLink", title: "Download",
				getCellValue : (row) => (
					<Fragment>
					{this.state.downloadingFileId === row.id ? (
						<CircularProgress size={24} color="primary" />
					) : (
						<IconButton
							color="primary"
							onClick={() => this.downloadFile(row.userId, row.documentName, row.id)}
							aria-label="download"
						>
						<CloudDownloadIcon />
						</IconButton>
					)}
					</Fragment>
				)
			}
		];

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
					alignContent="center"
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
										window.location.replace("#/dashboard/F85Form")
									}
								>
									<ArrowBackIcon fontSize="small" color="primary" />
								</IconButton>
							</Tooltip>
							Document Center Reports
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
					<F85ReportsTableComponent
						rows={this.state.admissionData}
						columns={columns}
						expandedGroupsData={this.state.expandedGroupsData}
						showFilter={this.state.showTableFilter}
						isLoading={this.state.isLoading}
					/>
				</Grid>
				<CustomizedSnackbar
					isOpen={this.state.isOpenSnackbar}
					isLoading={this.state.isLoading}
					message={this.state.snackbarMessage}
					severity={this.state.snackbarSeverity}
					handleCloseSnackbar={() => this.handleCloseSnackbar()}
				/>
			</Fragment>
		);
	}
}
export default withStyles(styles)(F85Reports);
