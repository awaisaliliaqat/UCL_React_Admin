import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, Typography, Grid, Box, MenuItem, makeStyles, IconButton, TextField } from "@material-ui/core";
import AccessTimeIcon from '@material-ui/icons/AccessTimeTwoTone';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import NotificationsIcon from "@material-ui/icons/Notifications";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import { Request } from "../../../../../utils/request";

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
}));

const UserRoleCard = (props) => {
	
	const classes = useStyles();
	
	const { handleLoginMenuReload, handleLoginMenu, handleOpenSnackbar, buttonRefNotiDrawerOpen } = props;
	
	const [isLoading, setIsLoading] = useState(false);

	const [data, setData] = useState(null);

	const [roleMenuItems, setRoleMenuItems] = React.useState([]);

	const [role, setRole] = React.useState("");

	const [notiCounter, setNotiCounter] = useState("");
	
	const handleRoleChange = (event) => {
		setRole(event.target.value);
	};

	const getUserRoleCardData = async () => {
		setIsLoading(true);
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
				if (json.CODE === 1) {
					let data = json.DATA || [];
					let dataLength = data.length;
					if(dataLength>0){
						setData(data[0]);
					}
				} else {
					handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
				}
				console.log("getUserRoleCardData", json);
			},
			(error) => {
				if (error.status == 401) {
					handleLoginMenuReload(true);
					handleLoginMenu(true);
				} else {
					console.log(error);
					handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
				}
			}
		);
		setIsLoading(false);
	};

	const getEmployeeDesignations = async () => {
		setIsLoading(true);
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonEmployeeDashboard/EmployeeDesignationsView`;
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
					let dataLength = data.length;
					if(dataLength>0){
						setRoleMenuItems(data || []);
						setRole(data[0].designationId);
					}
				} else {
					handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
				}
				console.log("getEmployeeDesignations", json);
			},
			(error) => {
				if (error.status == 401) {
					handleLoginMenu(true);
					handleLoginMenuReload(true);
				} else {
					console.log(error);
					handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
				}
			}
		);
		setIsLoading(false);
	};

	const getCounterData = async () => {
		const endpoint = "/notifications/C00CommonEmployeesNotificationsForWebCountView";
		const res = await Request( "GET", `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}${endpoint}`, null, "authorizeJson" );
		if (res.isSuccess) {
			let data = res.data || [];
			if (data.length > 0) {
				const { unReadCountLabel } = data[0] || {};
				setNotiCounter(unReadCountLabel);
			}
		} else {
			if (res.statusCode == 401) {
				handleLoginMenu(true);
				handleLoginMenuReload(true);
			}
		}
		console.log("C00CommonEmployeesNotificationsForWebCountView", res);
	};

	const handleButtonRefNotiDrawerOpen = () => {
		if(buttonRefNotiDrawerOpen){
			buttonRefNotiDrawerOpen.current.click();
		}
	}

	useEffect(() => {
		//getUserRoleCardData();
		getCounterData();
		//getEmployeeDesignations();
	}, []);
	
	return (
	 	<Card className={classes.container}>
			{/* Switch Role Section */}
			<Box className={classes.switchRole}>
				Today
			</Box>
			{/* <Box className={classes.switchRole}>
				Switch Designation
				<TextField
					name="roleId"
					value={role}
					onChange={handleRoleChange}
					className={classes.select}
					variant="outlined"
					select
					size="small"
					inputProps={{
						id: "roleId"
					}}
				>
					{roleMenuItems.map((d, i)=>
						<MenuItem 
							key={`roleMenuItems-${d.designationId}`} 
							value={d.designationId}
						>
							{d.designationLabel}
						</MenuItem>
					)}
				</TextField>
			</Box> */}
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
							<Typography className={classes.cardValue}>{data?.checkIn || "--:-- --" }</Typography>
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
							<Typography className={classes.cardValue}>{data?.checkOut || "--:-- --" }</Typography>
						</Box>
					</Card>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Card className={classes.card} style={{backgroundColor:"#FFEBEE", border:"1px solid #ffcae3"}}>
						<Box className={`${classes.iconWrapper} ${classes.redIcon}`}>
							{/* <i className="material-icons">assignment</i> */}
							<IconButton size="small" variant="contained" style={{backgroundColor:"#da001a", color:"#ffffffb3"}}><PlaylistAddCheckIcon /></IconButton>
						</Box>
						<Box className={classes.cardText}>
							<Typography className={classes.cardTitle}>Pending Approvals</Typography>
							<Typography className={classes.cardValue}>- -</Typography>
						</Box>
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
							<Typography className={classes.cardValue}>{notiCounter ? notiCounter : "- -"}</Typography>
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