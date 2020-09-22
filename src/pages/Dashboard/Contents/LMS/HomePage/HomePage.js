import React, { Fragment, Component } from "react";
import { withStyles } from "@material-ui/styles";
import { Grid, Typography, Button } from "@material-ui/core";
import Profile from "./Chunks/Profile";
import VirtulaClasses from "./Chunks/VirtulaClasses";
import MessageCenter from "./Chunks/MessageCenter";
import GradeBook from "./Chunks/GradeBook";
import Attendances from "./Chunks/Attendances";
import Quiz from "./Chunks/Quiz";
import GradedDiscussion from "./Chunks/GradedDiscussion";
import Assignements from "./Chunks/Assignements";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import AnnouncementDialog from '../../../../../components/AnnouncementDialog/AnnouncementDialog';
import AnnouncmentBackgroundIcon from '../../../../../assets/Images/megaphoneIcon.png';
import PropTypes from "prop-types";

const useStyles = {
	root: {
		flexGrow: 1,
		padding: 10,
	},
};

class HomePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			classesData: [],
			assignmentsData: [],
			gradedDiscussionData: [],
			messageCenterData:[],
			sectionsData: [],
			attendancesData: [],
			isLoading: false,
			isLoginMenu: false,
			isReload: false,
			isOpenSnackbar: false,
			snackbarMessage: "",
			snackbarSeverity: "",
			anouncementData: [],
			anouncementOpen: false,
			anouncementLabel: "",
			anouncementDate: "",
			anouncementDetails: "",
		};
	}

	componentDidMount() {
		this.getClassesData();
		this.getSectionsData();
		// this.getAssignmentsData();
		// this.getGradedDiscussionData();
		this.getAttendancesData();
		this.getAnnoucementsData();
		this.getMessageCenterData();
	}

	handleAnnouncmentDialog = () => {
		const { anouncementDate = "",
			anouncementDetails = "",
			anouncementLabel = "" } = window.localStorage.getItem("adminData") ? JSON.parse(window.localStorage.getItem("adminData")) : {};
		this.setState({
			anouncementDate,
			anouncementDetails,
			anouncementLabel,
			anouncementOpen: anouncementDetails ? true : false
		})
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

	getClassesData = async () => {
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C33CommonAcademicsTimeTableUpcomingClassesView`;
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
						this.setState({ classesData: json.DATA || [] });
					} else {
						this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>,"error");
					}
					console.log("TimeTableDataArray", json);
				},
				(error) => {
					if (error.status === 401) {
						this.setState({
							isLoginMenu: true,
							isReload: true,
						});
					} else {
						console.log(error);
						this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
					}
				}
			);
		this.setState({ isLoading: false });
	};

	getMessageCenterData = async () => {
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C60CommonAcademicsTeacherSectionsView`;
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
						this.setState({ messageCenterData: json.DATA || [] });
					} else {
						this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>,"error");
					}
					console.log("getMessageCenterData", json);
				},
				(error) => {
					if (error.status === 401) {
						this.setState({
							isLoginMenu: true,
							isReload: true,
						});
					} else {
						console.log(error);
						this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
					}
				}
			);
		this.setState({ isLoading: false });
	};

	onJoinClick = async (e, data = {}) => {
		e.preventDefault();
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C33CommonAcademicsAttendanceTeachersLogSave?classId=${data.id}&typeId=${1}`;
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
						window.open(data.meetingStartUrl, "_blank");
					} else {
						this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>,"error");
					}
				},
				(error) => {
					if (error.status === 401) {
						this.setState({
							isLoginMenu: true,
							isReload: false,
						});
					} else {
						alert("Operation Faild ! Please try again");
					}
				}
			);
		this.setState({
			isLoading: false,
		});
	};

	getAssignmentsData = async () => {
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C105CommonAcademicsAssignmentsView`;
		await fetch(url, {
			method: "GET",
			headers: new Headers({
				Authorization: "Bearer " + localStorage.getItem("lmsToken"),
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
						this.setState({ assignmentsData: json.DATA || [] });
					} else {
						this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>,"error");
					}
					console.log("getAssignmentsData", json);
				},
				(error) => {
					if (error.status === 401) {
						this.setState({
							isLoginMenu: true,
							isReload: true,
						});
					} else {
						console.log(error);
						this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
					}
				}
			);
		this.setState({ isLoading: false });
	};

	getAttendancesData = async () => {
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C00CommonAcademicsAttendanceTeachersLogView`;
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
						this.setState({ attendancesData: json.DATA || [] });
					} else {
						this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>,"error");
					}
					console.log("getAttendacesData", json);
				},
				(error) => {
					if (error.status === 401) {
						this.setState({
							isLoginMenu: true,
							isReload: true,
						});
					} else {
						console.log(error);
						this.handleOpenSnackbar("Failed to load attendances data.","error");
					}
				}
			);
		this.setState({ isLoading: false });
	};

	getGradedDiscussionData = async () => {
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME
			}/lms/C106CommonAcademicsGradedDiscussionsBoardStudentsView?type=${0}`;
		await fetch(url, {
			method: "GET",
			headers: new Headers({
				Authorization: "Bearer " + localStorage.getItem("lmsToken"),
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
						const data = json.DATA || [];
						const filterData = data.filter((item) => item.isUploaded === 0);
						if (filterData.length < 3) {
							filterData.push(...data);
						}
						this.setState({ gradedDiscussionData: filterData });
					} else {
						this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>,"error");
					}
					console.log("getGradedDiscussionData", json);
				},
				(error) => {
					if (error.status === 401) {
						this.setState({
							isLoginMenu: true,
							isReload: true,
						});
					} else {
						console.log(error);
						this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
					}
				}
			);
		this.setState({ isLoading: false });
	};

	getSectionsData = async () => {
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/lms/C00CommonAcademicsSectionsTeachersView`;
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
						this.setState({ sectionsData: json.DATA || [] });
					} else {
						this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>, "error");
					}
				},
				(error) => {
					if (error.status === 401) {
						this.setState({
							isLoginMenu: true,
							isReload: true,
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
		this.setState({ isLoading: false });
	};

	getAnnoucementsData = async () => {
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C110CommonAcademicsAnouncementsView`;
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
						this.setState({ anouncementData: json.DATA || [] });
					} else {
						this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br />{json.USER_MESSAGE}</span>, "error");
					}
				},
				(error) => {
					if (error.status === 401) {
						this.setState({
							isLoginMenu: true,
							isReload: true,
						});
					} else {
						console.log(error);
						this.handleOpenSnackbar("Failed to load annoucments data ! Please try Again later.", "error");
					}
				}
			);
		this.setState({ isLoading: false });
	};

	onSetMeetingConfig = (data = {}) => {
		const { email = "", displayName = "" } = window.localStorage.getItem(
			"lmsData"
		)
			? JSON.parse(window.localStorage.getItem("lmsData"))
			: {};
		const studentId = localStorage.getItem("lmsStudentId") || "N/A";
		const meetingConfig = {
			meetingNumber: data.meetingId,
			leaveUrl: process.env.REACT_APP_LMS_URL,
			userName: `${studentId} - ${displayName}`,
			userEmail: email,
			password: data.meetingPassword,
			role: 0,
			courseName: data.courseLabel,
			classObject: data,
		};
		localStorage.setItem("lmsMeetingConfig", JSON.stringify(meetingConfig));
		window.location.href = process.env.REACT_APP_LMS_ZOOM_URL;
	};

	downloadFile = (e, fileName) => {
		e.preventDefault();
		const data = new FormData();
		data.append("fileName", fileName);
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME
			}/common/CommonViewFile?fileName=${encodeURIComponent(fileName)}`;
		fetch(url, {
			method: "GET",
			headers: new Headers({
				Authorization: "Bearer " + localStorage.getItem("lmsToken"),
			}),
		})
			.then((res) => {
				if (res.status === 200) {
					return res.blob();
				} else if (res.status === 401) {
					this.setState({
						isLoginMenu: true,
						isReload: false,
					});
					return {};
				} else {
					alert("Operation Failed, Please try again later.");
					return {};
				}
			})
			.then((result) => {
				var csvURL = window.URL.createObjectURL(result);
				var tempLink = document.createElement("a");
				tempLink.href = csvURL;
				tempLink.setAttribute("download", fileName);
				tempLink.click();
				console.log(csvURL);
				if (result.CODE === 1) {
					//Code
				} else if (result.CODE === 2) {
					alert(
						"SQL Error (" +
						result.CODE +
						"): " +
						result.USER_MESSAGE +
						"\n" +
						result.SYSTEM_MESSAGE
					);
				} else if (result.CODE === 3) {
					alert(
						"Other Error (" +
						result.CODE +
						"): " +
						result.USER_MESSAGE +
						"\n" +
						result.SYSTEM_MESSAGE
					);
				} else if (result.error === 1) {
					alert(result.error_message);
				} else if (result.success === 0 && result.redirect_url !== "") {
					window.location = result.redirect_url;
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	onAnnouncementClose = () => {
		const myData = window.localStorage.getItem("lmsData") ? JSON.parse(window.localStorage.getItem("lmsData")) : {};
		myData.anouncementDate = "";
		myData.anouncementLabel = "";
		myData.anouncementDetails = "";
		window.localStorage.setItem("lmsData", JSON.stringify(myData));
		this.setState({
			anouncementOpen: false,
			anouncementDetails: "",
			anouncementDate: "",
			anouncementLabel: ""
		})
	}

	onAnnouncementClick = (anouncment) => {
		this.setState({
			anouncementOpen: true,
			anouncementDetails: anouncment.anouncementDetails,
			anouncementDate: anouncment.anouncementDate,
			anouncementLabel: anouncment.label
		})
	}

	render() {
		const { classes } = this.props;

		return (
			<Fragment>
				<AnnouncementDialog
					handleClose={() => this.onAnnouncementClose()}
					dividers
					open={this.state.anouncementOpen}
					title="Announcement"
					content={
						<Fragment>
							<span style={{ float: "right" }}>
								<span style={{ color: 'grey', float: 'right', fontSize: 14 }}>{this.state.anouncementDate}</span>
								<br />
								<img src={AnnouncmentBackgroundIcon} style={{ height: 80, paddingRight: 12, float: 'right', marginTop: 7 }} />
							</span>
							<span>
								<Typography color="primary" component="span" variant="h5">{this.state.anouncementLabel}</Typography>
								<br />
								<Typography variant="body1" component="span">&emsp;{this.state.anouncementDetails}</Typography>
							</span>
						</Fragment>
					}
					actions={
						<Button
							color="secondary"
							onClick={() => this.onAnnouncementClose()}
						>
							Close
						</Button>
					} />
				<LoginMenu
					reload={this.state.isReload}
					open={this.state.isLoginMenu}
					handleClose={() => this.setState({ isLoginMenu: false })}
				/>
				<CustomizedSnackbar
					isOpen={this.state.isOpenSnackbar}
					message={this.state.snackbarMessage}
					severity={this.state.snackbarSeverity}
					handleCloseSnackbar={() => this.handleCloseSnackbar()}
				/>
				<div className={classes.root}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={3} container>
							<Grid item xs={12} sm={12}>
								<Profile anouncementData={this.state.anouncementData} onAnnouncementClick={data => this.onAnnouncementClick(data)} sectionsData={this.state.sectionsData} />
							</Grid>
						</Grid>
						<Grid item xs={12} sm={9} container spacing={2}>
							<Grid item xs={4}> 
								<VirtulaClasses
									onJoinClick={(e, data) => this.onJoinClick(e, data)}
									classesData={this.state.classesData}
								/>
							</Grid>
							<Grid item xs={4}>
								<Attendances
									data={this.state.attendancesData}
									isLoading={this.state.isLoading}
								/>
							</Grid>
							<Grid item xs={4}>
								<Assignements
									data={this.state.assignmentsData}
									isLoading={this.state.isLoading}
									downloadFile={(e, fileName) => this.downloadFile(e, fileName)}
								/>
							</Grid>
							<Grid item xs={4}>
								<GradeBook />
							</Grid>
							<Grid item xs={4}>
								<MessageCenter 
									onJoinClick={(e, data) => this.onJoinClick(e, data)}
									classesData={this.state.messageCenterData}
								/>
							</Grid>
							{/* <Grid item xs={4}>
								<Quiz />
							</Grid> */}
							<Grid item xs={4}>
								<GradedDiscussion
									data={this.state.gradedDiscussionData}
									isLoading={this.state.isLoading}
								/>
							</Grid>
						</Grid>
					</Grid>
				</div>
			</Fragment>
		);
	}
}

HomePage.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(HomePage);
