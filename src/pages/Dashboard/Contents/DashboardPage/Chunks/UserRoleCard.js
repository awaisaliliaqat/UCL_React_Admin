import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, Typography, Grid, Box, MenuItem, makeStyles, IconButton, MenuList, Grow, Popper, ClickAwayListener, Paper } from "@material-ui/core";
import AccessTimeIcon from '@material-ui/icons/AccessTimeTwoTone';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import NotificationsIcon from "@material-ui/icons/Notifications";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import { Skeleton } from "@material-ui/lab";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	container: {
		backgroundColor:"#ffffff8a",
		padding: theme.spacing(2),
		boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
		borderRadius: theme.spacing(1),
	},
	switchRole: {
		display: "flex",
		alignItems: "center",
		marginTop: theme.spacing(0.5),
		marginBottom: theme.spacing(2.5),
		fontWeight: "bold",
		fontSize: "1.1rem",
	},
	select: {
		marginLeft: theme.spacing(1),
		minWidth: 120,
	},
	card: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(2),
		borderRadius: theme.spacing(1),
		boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
		"&:hover": {
			boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
		},
	},
	iconWrapper: {
		width: 40,
		height: 52,
		borderRadius: "50%",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		marginRight: theme.spacing(1.5),
	},
	greenIcon: {
		backgroundColor: "#E8F5E9",
		color: "#4CAF50",
	},
	redIcon: {
		backgroundColor: "#FFEBEE",
		color: "#F44336",
	},
	blueIcon: {
		backgroundColor: "#E3F2FD",
		color: "#2196F3",
	},
	purpleIcon: {
		backgroundColor: "#F3E5F5",
		color: "#9C27B0",
	},
	cardText: {
		flex: 1,
	},
	cardTitle: {
		fontWeight: "bold",
		fontSize: "0.9rem",
		whiteSpace: "nowrap",
    	textOverflow: "ellipsis",
		width:"100%"
	},
	cardValue: {
		fontSize: "1rem",
		fontWeight: "bold",
	},
	menuItem: {
		backgroundColor: "#FFEBEE",
		border: "1px solid #ffcae3",
		cursor: "pointer",
		transition: "background-color 0.3s ease, box-shadow 0.3s ease",
		"&:hover": {
			backgroundColor: "#ffcdd2", // Light pink on hover
			boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.15)",
		},
	},
}));

const UserRoleCard = (props) => {
	
	const classes = useStyles();

	const history = useHistory();

	const anchorRef = React.useRef(null);

	const adminData = localStorage.getItem("adminData") ? JSON.parse(localStorage.getItem("adminData")) : {};
	const { featureList = [] } = adminData;

	const filteredFeatureList = featureList.reduce((acc, feature) => {
		//acc.push(...(feature.items?.filter(option => option.id === 323 || option.id === 324 || option.id === 337 || option.id === 354) || []));
		acc.push(...(feature.items?.filter(option => option.id === 324 || option.id === 337 || option.id === 354) || []));
		return acc;
	}, []);

	// console.log(filteredFeatureList);
	
	const { handleLoginMenuReload, handleLoginMenu, handleOpenSnackbar, buttonRefNotiDrawerOpen } = props;
	
	const [isLoading, setIsLoading] = useState({attendance:false, notifications:false, pendingApprovals:false});

	const [data, setData] = useState(null);

	const [notiCounter, setNotiCounter] = useState("");

	const [open, setOpen] = React.useState(false);

	const [pendingApprovalCounter, setPendingApprovalCounter] = useState(0);

	const [approvalFeaturesList, setApprovalFeaturesList]  = useState(filteredFeatureList);
	
	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};
	
	const handleClose = (event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}
		setOpen(false);
	};

	const getEmployeeAttendance = async () => {
		setIsLoading((prevState) => ({ ...prevState, [`attendance`]: true }));
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonEmployeeDashboard/EmployeeAttendanceByDate`;
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
				const {CODE, DATA, SYSTEM_MESSAGE, USER_MESSAGE} = json;
				if (CODE === 1) {
					let data = DATA || [];
					let dataLength = data.length;
					if(dataLength>0){
						setData(data[0]);
					}
				} else {
					handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>,"error");
				}
				//console.log("getEmployeeAttendance", json);
			},
			(error) => {
				const { status } = error;
				if (status == 401) {
					handleLoginMenuReload(true);
					handleLoginMenu(true);
				} else {
					console.log(error);
					handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
				}
			}
		);
		setIsLoading((prevState) => ({ ...prevState, [`attendance`]: false }));
	};

	const getNotificationsForWebCount = async () => {
		setIsLoading((prevState) => ({ ...prevState, [`notifications`]: true }));
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/notifications/C00CommonEmployeesNotificationsForWebCountView`;
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
				const { CODE, DATA, SYSTEM_MESSAGE, USER_MESSAGE } = json;
				if (CODE === 1) {
					let data = DATA || [];
					if (data.length > 0) {
						const { unReadCountLabel } = data[0] || {};
						setNotiCounter(unReadCountLabel);
					}
				} else {
					handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>,"error");
				}
				//console.log("getNotificationsForWebCount", json);
			},
			(error) => {
				const { status } = error;
				if (status == 401) {
					handleLoginMenuReload(true);
					handleLoginMenu(true);
				} else {
					console.log(error);
					handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
				}
			}
		);
		setIsLoading((prevState) => ({ ...prevState, [`notifications`]: false }));
	};

	const handleButtonRefNotiDrawerOpen = () => {
		if(buttonRefNotiDrawerOpen){
			buttonRefNotiDrawerOpen.current.click();
		}
	}

	const getReportingUsersEmployeeAttendanceSheetsCount = async () => {
		setIsLoading((prevState) => ({ ...prevState, [`pendingApprovals`]: true }));
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonEmployeeDashboard/ReportingUsersEmployeeAttendanceSheetsCount`;
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
				const {CODE, DATA, SYSTEM_MESSAGE, USER_MESSAGE} = json;
				if (CODE === 1) {
					let data = DATA || [];
					let dataLength = data.length;
					if(dataLength>0){
						setPendingApprovalCounter((prevState)=> prevState + data[0].count);
						setApprovalFeaturesList((prevList) =>
							prevList.map((feature) =>
							  feature.id === 337 ? { ...feature, count: data[0].count } : feature
							)
						);
					}
				} else {
					handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>,"error");
				}
				//console.log("getReportingUsersEmployeeAttendanceSheetsCount", json);
			},
			(error) => {
				const { status } = error;
				if (status == 401) {
					handleLoginMenuReload(true);
					handleLoginMenu(true);
				} else {
					console.log(error);
					handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
				}
			}
		);
		setIsLoading((prevState) => ({...prevState,	[`pendingApprovals`]: false}));
	};

	const getAllReportingEmployeesLeavesApprovalsPendingCount = async () => {
		setIsLoading((prevState) => ({ ...prevState, [`pendingApprovals`]: true }));
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonEmployeeDashboard/AllReportingEmployeesLeavesApprovalsPendingCount`;
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
				const {CODE, DATA, SYSTEM_MESSAGE, USER_MESSAGE} = json;
				if (CODE === 1) {
					let data = DATA || [];
					let dataLength = data.length;
					if(dataLength>0){
						setPendingApprovalCounter((prevState)=> prevState + data[0].count );
						setApprovalFeaturesList((prevList) =>
							prevList.map((feature) =>
							  feature.id === 354 ? { ...feature, count: data[0].count } : feature
							)
						);
					}
				} else {
					handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>,"error");
				}
				//console.log("getAllReportingEmployeesLeavesApprovalsPendingCount", json);
			},
			(error) => {
				const { status } = error;
				if (status == 401) {
					handleLoginMenuReload(true);
					handleLoginMenu(true);
				} else {
					console.log(error);
					handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
				}
			}
		);
		setIsLoading((prevState) => ({...prevState,	[`pendingApprovals`]: false}));
	};

	const getHourlySheetsForHODCount = async () => {
		setIsLoading((prevState) => ({ ...prevState, [`pendingApprovals`]: true }));
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonEmployeeDashboard/CountApprovedHourlySheetForHOD`;
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
				const {CODE, DATA, SYSTEM_MESSAGE, USER_MESSAGE} = json;
				if (CODE === 1) {
					let data = DATA || [];
					let dataLength = data.length;
					if(dataLength>0){
						setPendingApprovalCounter((prevState)=> prevState + data[0].count );
						setApprovalFeaturesList((prevList) =>
							prevList.map((feature) =>
							  feature.id === 324 ? { ...feature, count: data[0].count } : feature
							)
						);
					}
				} else {
					handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>,"error");
				}
				//console.log("getHourlySheetsForHODCount", json);
			},
			(error) => {
				const { status } = error;
				if (status == 401) {
					handleLoginMenuReload(true);
					handleLoginMenu(true);
				} else {
					console.log(error);
					handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
				}
			}
		);
		setIsLoading((prevState) => ({...prevState,	[`pendingApprovals`]: false}));
	};

	const getHourlySheetsForHeadCount = async () => {
		setIsLoading((prevState) => ({ ...prevState, [`pendingApprovals`]: true }));
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonEmployeeDashboard/CountApprovedHourlySheetForHead`;
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
				const {CODE, DATA, SYSTEM_MESSAGE, USER_MESSAGE} = json;
				if (CODE === 1) {
					let data = DATA || [];
					let dataLength = data.length;
					if(dataLength>0){
						setPendingApprovalCounter((prevState)=> prevState + data[0].count );
						setApprovalFeaturesList((prevList) =>
							prevList.map((feature) =>
							  feature.id === 323 ? { ...feature, count: data[0].count } : feature
							)
						);
					}
				} else {
					handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>,"error");
				}
				//console.log("getHourlySheetsForHeadCount", json);
			},
			(error) => {
				const { status } = error;
				if (status == 401) {
					handleLoginMenuReload(true);
					handleLoginMenu(true);
				} else {
					console.log(error);
					handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
				}
			}
		);
		setIsLoading((prevState) => ({...prevState,	[`pendingApprovals`]: false}));
	};

	useEffect(() => {
		getEmployeeAttendance();
		getNotificationsForWebCount();
		let isEmployeeAttendanceSheetsCountExecute = filteredFeatureList?.some((data) => data.id===337);
		if(isEmployeeAttendanceSheetsCountExecute){
			getReportingUsersEmployeeAttendanceSheetsCount();
		}
		let isLeaveCountExecute = filteredFeatureList?.some((data) => data.id===354);
		if(isLeaveCountExecute){
			getAllReportingEmployeesLeavesApprovalsPendingCount();
		}
		let isHourlySheetsForHODCountExecute = filteredFeatureList?.some((data) => data.id===324);
		if(isHourlySheetsForHODCountExecute){
			getHourlySheetsForHODCount();
		}
		let isHourlySheetsForHeadCountExecute = filteredFeatureList?.some((data) => data.id===323);
		if(isHourlySheetsForHeadCountExecute){
			getHourlySheetsForHeadCount();
		}
	}, [filteredFeatureList.length]);
	
	return (
	 	<Card className={classes.container}>
			{/* Switch Role Section */}
			<Box className={classes.switchRole}>Today</Box>
			{/* Grid for Cards */}
			<Grid container spacing={2}>
				<Grid item xs={12} sm={6}>
					<Card className={classes.card} style={{backgroundColor:"#E8F5E9", border:"1px solid #a3e8bc"}}>
						<Box className={`${classes.iconWrapper} ${classes.greenIcon}`}>
							{/* <i className="material-icons">access_time</i> */}
							<IconButton size="small" variant="contained" style={{backgroundColor:"#4CAF50", color:"#ffffffb3"}}><AccessTimeIcon /></IconButton>
						</Box>
						<Box className={classes.cardText}>
							<Typography className={classes.cardTitle}>Time-In</Typography>
							<Typography className={classes.cardValue}>{!!isLoading?.attendance ? <Skeleton width="7rem"/> : data?.checkIn || "--:-- --" }</Typography>
						</Box>
					</Card>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Card className={classes.card} style={{backgroundColor:"#E3F2FD", border:"1px solid #bfc6ff"}}>
						<Box className={`${classes.iconWrapper} ${classes.blueIcon}`}>
							{/* <i className="material-icons">access_time</i> */}
							<IconButton size="small" variant="contained" style={{backgroundColor:"#4a3aff", color:"#ffffffb3"}}><AccessTimeIcon /></IconButton>
						</Box>
						<Box className={classes.cardText}>
							<Typography className={classes.cardTitle}>Time-Out</Typography>
							<Typography className={classes.cardValue}>{!!isLoading?.attendance ? <Skeleton width="7rem"/> : data?.checkOut || "--:-- --" }</Typography>
						</Box>
					</Card>
				</Grid>
				<Grid item xs={12} sm={6} style={{zIndex:1}}>
					<Card className={classes.card} style={{backgroundColor:"#FFEBEE", border:"1px solid #ffcae3", cursor: "pointer"}} onClick={ /* history.push("/dashboard/F337MonthlyEmployeeApproval") */  handleToggle }>
						<Box className={`${classes.iconWrapper} ${classes.redIcon}`}>
							{/* <i className="material-icons">assignment</i> */}
							<IconButton size="small" variant="contained" style={{backgroundColor:"#da001a", color:"#ffffffb3"}}><PlaylistAddCheckIcon /></IconButton>
						</Box>
						<Box className={classes.cardText} ref={anchorRef}>
							<Typography className={classes.cardTitle}>Pending Approvals</Typography>
							<Typography className={classes.cardValue}>{ !!isLoading?.pendingApprovals ? <Skeleton width="7rem"/> : pendingApprovalCounter ? pendingApprovalCounter : "- -"}</Typography>
						</Box>
						<Popper open={open} anchorEl={anchorRef?.current || null} role={undefined} transition disablePortal>
							{({ TransitionProps, placement }) => (
								<Grow
									{...TransitionProps}
									style={{
										transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
									}}
								>
									<Paper>
										<ClickAwayListener onClickAway={handleClose}>
											<MenuList id="split-button-menu" style={{backgroundColor:"#FFEBEE"}}>
												{approvalFeaturesList.map((option, index) => (
												<MenuItem
													key={option+index}
													className={classes.menuItem}
													//disabled={index === 2}
													//selected={index === selectedIndex}
													onClick={(event) =>{ history.push(option.webUrl) }}
												>
													<span>{option.label}{option?.count ? <b>&ensp;({option.count})</b> : ""}</span>
												</MenuItem>
												))}
											</MenuList>
										</ClickAwayListener>
									</Paper>
								</Grow>
							)}
						</Popper>
					</Card>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Card className={classes.card} style={{backgroundColor:"#F3E5F5", border:"1px solid #d4a9ff", cursor:"pointer"}} onClick={handleButtonRefNotiDrawerOpen}>
						<Box className={`${classes.iconWrapper} ${classes.purpleIcon}`}>
							{/* <i className="material-icons">group</i> */}
							<IconButton size="small" variant="contained" style={{backgroundColor:"#9C27B0", color:"#ffffffb3"}}>{notiCounter ? <NotificationsActiveIcon /> : <NotificationsIcon /> }</IconButton>
						</Box>
						<Box className={classes.cardText}>
							<Typography className={classes.cardTitle} noWrap>Announcements</Typography>
							<Typography className={classes.cardValue}>{!!isLoading?.notifications ? <Skeleton width="7rem"/> : notiCounter ? notiCounter : "- -"}</Typography>
						</Box>
					</Card>
				</Grid>
			</Grid>
			
		</Card>
	);
	};

export default UserRoleCard;

UserRoleCard.propTypes = {
	handleLoginMenuReload: PropTypes.func.isRequired,
	handleLoginMenu: PropTypes.func.isRequired, 
	handleOpenSnackbar: PropTypes.func.isRequired
};