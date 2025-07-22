import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, Avatar, Typography, Button, Box, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import BorderColorIcon from '@material-ui/icons/BorderColor';
import ContactsOutlinedIcon from '@material-ui/icons/ContactsOutlined';
import EventIcon from '@material-ui/icons/Event';
import Skeleton from '@material-ui/lab/Skeleton';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	card: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(2),
		borderRadius: theme.spacing(1),
		boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
		backgroundColor: "#ffffff8a",
		flexDirection: "row", // Default direction for larger screens
		[theme.breakpoints.down("sm")]: {
			flexDirection: "column", // Stack content vertically on small screens
		},
	},
	avatar: {
		width: 60,
		height: 60,
		marginRight: theme.spacing(2),
		[theme.breakpoints.down("sm")]: {
			marginRight: 0, // Remove margin on small screens
			marginBottom: theme.spacing(2),
		},
	},
	content: {
		flex: 1,
		[theme.breakpoints.down("sm")]: {
			textAlign: "center", // Center text on small screens
		},
	},
	header: {
		fontWeight: "bold",
		fontSize: "1.2rem",
	},
	subText: {
		color: theme.palette.text.secondary,
	},
	buttons: {
		display: "flex",
		gap: theme.spacing(1),
		[theme.breakpoints.down("sm")]: {
			marginTop: theme.spacing(2), // Add space above buttons
			flexDirection: "row", // Stack buttons vertically on small screens
			width: "100%", // Ensure buttons take full width
			alignItems: "center", // Center buttons
		},
		[theme.breakpoints.down("xs")]: {
			marginTop: theme.spacing(2), // Add space above buttons
			flexDirection: "column", // Stack buttons vertically on small screens
			width: "100%", // Ensure buttons take full width
			alignItems: "center", // Center buttons
		},
	},
	button: {
		textTransform: "none",
		[theme.breakpoints.down("sm")]: {
			width: "100%", // Buttons stretch full width on small screens
		}
	},
	circularProgress: {
		color: theme.palette.text.disabled
	}
}));

const ProfileCard = (props) => {

	const classes = useStyles();

	const history = useHistory();

	const { handleLoginMenuReload, handleLoginMenu, handleOpenSnackbar } = props;

	const [employee, setEmployee] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const getProfileCardData = async () => {
		setIsLoading(true);
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonEmployeeDashboard/ProfileView`;
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
						setEmployee(data[0]);
					}
				} else {
					handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
				}
				//console.log("getProfileCardData", json);
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

	useEffect(() => {
		getProfileCardData();
	}, []);

	return (
		<Card className={classes.card}>
			{ isLoading ? 
				<Box display="flex" flexGrow={1} marginRight={2} alignItems="center" width="55%">
					<Box marginRight={1}>
						<Skeleton variant="circle">
							<Avatar />
						</Skeleton>
					</Box>
					<Box width="100%">
						<Skeleton />					
						<Skeleton />
						<Skeleton />
					</Box>
				</Box>
				: 
				<Fragment>
					{/* <Avatar
						src="noImage" // Replace with actual image URL
						alt={employee?.displayName}
						className={classes.avatar}
					/> */}
					<Box className={classes.content}>
						<Typography className={classes.header} component="span">{employee?.displayName}&ensp;</Typography>
						<Typography className={classes.subText} component="span">
						{employee?.employeesDesignationsArray.map((d, index, arr) => (
							<span key={index}>
								{d.label}{index < arr.length - 1 && <span>,&ensp;</span>}
							</span>
						))}
						</Typography>
						<Typography className={classes.subText} component="span">
							{!!employee?.reportingToLabel ? <small>&ensp;|&ensp;Reporting to:&ensp;{employee?.reportingToLabel}</small> : ''}
						</Typography>
					</Box>
				</Fragment>
			}
			<Box className={classes.buttons}>
				<Button 
					variant="contained" 
					color="primary" 
					className={classes.button} 
					startIcon={ isLoading ? <CircularProgress className={classes.circularProgress} size={20} /> : <ContactsOutlinedIcon /> }
					disabled={isLoading}
					onClick={()=> history.push("/dashboard/EmployeeProfile") }
				>
					View Profile 
				</Button>
				<Button 
					variant="outlined" 
					color="primary" 
					className={classes.button}
					startIcon={ isLoading ? <CircularProgress className={classes.circularProgress} size={20} /> : <EventIcon /> }
					disabled={isLoading}
					onClick={()=> history.push("/dashboard/R338AttendanceDailyReport") }
				>
					Track Gate Attendance
				</Button>
			</Box>
		</Card>
	);
};

export default ProfileCard;

ProfileCard.propTypes = {
	handleLoginMenuReload: PropTypes.func.isRequired,
	handleLoginMenu: PropTypes.func.isRequired, 
	handleOpenSnackbar: PropTypes.func.isRequired
};