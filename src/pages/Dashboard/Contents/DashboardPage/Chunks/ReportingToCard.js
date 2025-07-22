import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, Typography, Box, makeStyles, Button} from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { Skeleton } from "@material-ui/lab";
import { format, addDays, subDays } from 'date-fns';
import ReportingEmployeesGateAttendanceDialog from "./ReportingEmployeesGateAttendanceDialog";

const useStyles = makeStyles((theme) => ({
	container: {
		padding: theme.spacing(2),
		borderRadius: theme.spacing(1),
		boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
		backgroundColor:"#ffffff8a",
	},
	header: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: theme.spacing(2),
	},
	dateNavigator: {
		display: "flex",
		alignItems: "center",
	},
	baxItem: {
		overflow: "auto",
    	height: 152, // Default fixed height for larger screens
		paddingRight: 8,
    	[theme.breakpoints.down("sm")]: {
			maxHeight: 152,
      		height: "auto", // Adjust height dynamically for small screens
    	},
		/* width */
		'&::-webkit-scrollbar' : {
			width: 5,
		  },
		/* Track */
		'&::-webkit-scrollbar-track' : {
		  background: "rgba(0, 0, 0, 0.05)", 
		}, 
		/* Handle */
		"&::-webkit-scrollbar-thumb" : {
		  background: "rgba(0, 0, 0, 0.1)", 
		},
		/* Handle on hover */
		'&::-webkit-scrollbar-thumb:hover' : {
		  background: "rgba(0, 0, 0, 0.2)",
		}
	},
	listItem: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		// backgroundColor: "#F9F9F9",
		backgroundColor: "#f1f1f159",
		padding: theme.spacing(1.5),
		borderRadius: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	name: {
		fontWeight: 600,
	},
	status: {
		display: "flex",
		alignItems: "center",
		borderRadius: theme.spacing(0.5),
		padding: "2px 8px",
		fontSize: "0.8rem",
		fontWeight: 600,
	},
	timeIn: {
		backgroundColor: "#EDE7F6",
		color: "#5E35B1",
	},
	timeOut: {
		backgroundColor: "#FFEBEE",
		color: "#D32F2F",
	},
	absent: {
		backgroundColor: "#FFEBEE",
		color: "#F44336",
	},
	onLeave: {
		backgroundColor: "#FFF8E1",
		color: "#F9A825",
	},
	viewAll: {
		textAlign: "center",
		color: theme.palette.primary.main,
		cursor: "pointer",
		fontWeight: 600,
		marginTop: theme.spacing(1),
	},
}));

const ReportingToCard = (props) => {

	const classes = useStyles();

	const { handleLoginMenuReload, handleLoginMenu, handleOpenSnackbar } = props;

	const [isLoading, setIsLoading] = useState(false);

	let demoData = [
		// { name: "Ruqqaya Hafeez", status: "Time-In", time: "9:08 AM", class: "timeIn" },
		// { name: "Muhammad Ahmad", status: "Time-In", time: "9:20 AM", class: "timeIn" },
		// { name: "Haris Akram", status: "Absent", time: "", class: "absent" },
		// { name: "Awais Ali", status: "On Leave", time: "", class: "onLeave" },
		// { name: "Haseeb Ali", status: "Time-In", time: "9:00 AM", class: "timeIn" },
		// { name: "Aqib Azhar", status: "Time-In", time: "9:00 AM", class: "timeIn" },
		// { name: "Abubakar Ali", status: "Time-In", time: "9:21 AM", class: "timeIn" },
		// { name: "Hassan Raza", status: "Time-Out", time: "1:00 PM", class: "timeOut" },
	];

	const [data, setData] = useState(demoData);

	const [date, setDate] = useState(new Date());

	// Function to set the next date
	const handleNextDate = () => {
		setDate((prevDate) => addDays(prevDate, 1)); // Increment date by 1 day
	};
	
	// Function to set the previous date
	const handlePreviousDate = () => {
		setDate((prevDate) => subDays(prevDate, 1)); // Decrement date by 1 day
	};
	
	const getReportingToCardData = async () => {
		setIsLoading(true);
		let data = new FormData();
		data.append("date", `${format(date, "dd/MM/yyyy")}`);
		//const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonEmployeeDashboard/ReportingEmployeesAttendanceInOutByDate`;
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonEmployeeDashboard/ReportingEmployeesAttendanceLastStatusByDate`;
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
				const {CODE, DATA, SYSTEM_MESSAGE, USER_MESSAGE} = json;
				if (CODE === 1) {
					let data = DATA || [];
					let dataLength = data.length;
					for(let i=0; i<dataLength ;i++){
						data[i].name = data[i].userName;
						if(data[i].checkIn) {
							data[i].status = "Time-In";
							data[i].class =  "timeIn";
							data[i].time = data[i].checkIn;
						} else if (data[i].checkOut){
							data[i].status = "Time-Out";
							data[i].class =  "timeOut";
							data[i].time = data[i].checkOut;
						} else {
							data[i].status = "Absent";
							data[i].class =  "absent";
							data[i].time = "";
						}
					}
					if(dataLength>0){
						setData(data);
					}
				} else {
					handleOpenSnackbar(<span>{SYSTEM_MESSAGE}<br/>{USER_MESSAGE}</span>,"error");
				}
				//console.log("getReportingToCardData", json);
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
		setIsLoading(false);
	};

	useEffect(() => {
		getReportingToCardData();
	}, [date]);

	return (
		<Card className={classes.container}>
			{/* Header */}
			<Box className={classes.header}>
				<Typography variant="h6" component="div" style={{ fontWeight: 600, fontSize:"1.1rem" }}>
					Reporting To Me
				</Typography>
				<Box className={classes.dateNavigator}>
					<Button size="small" onClick={handlePreviousDate} disabled={isLoading} style={{padding:"4px 0px 4px 8px", minWidth:0}}>
						<ArrowBackIosIcon fontSize="small" />
					</Button>
					&nbsp;<Typography style={{ fontWeight: 600 }}>{`${format(date, "dd-MMM-yyyy")}`}</Typography>&nbsp;
					<Button size="small" onClick={handleNextDate} disabled={isLoading} style={{padding:"4px", minWidth:0}}>
						<ArrowForwardIosIcon fontSize="small" />
					</Button>
				</Box>
			</Box>
			{/* List */}
			<Box className={classes.baxItem}>
			{!isLoading && data.length>0 ?  
				data?.map((item, index) => (
				<Box key={index} className={classes.listItem}>
					<Typography className={classes.name}>{item.userName}</Typography>
					<Box className={`${classes.status} ${classes[item.class]}`}>
						{item.status !== "Absent" && item.status !== "On Leave" ? (
							<>
								{item.status} <span>&nbsp;{item.time}</span>
							</>
						) : (
							<>{item.status}</>
						)}
					</Box>
				</Box>
				
			))
			: isLoading ?
				Array(3).fill(0).map((d, i)=> <Skeleton key={`Array-Skeleton-${i}`} height={"3rem"} />)
				:
				<Box
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "100%", // Ensure it takes the full height of the container
					}}
				>
					<Typography variant="h6" align="center">No Data</Typography>
				</Box> 
			}
			</Box>
			{/* View All */}
			{/* <Typography className={classes.viewAll}>View All</Typography> */}
			<ReportingEmployeesGateAttendanceDialog />
		</Card>
	);
};

export default ReportingToCard;

ReportingToCard.propTypes = {
	handleLoginMenuReload: PropTypes.func.isRequired,
	handleLoginMenu: PropTypes.func.isRequired, 
	handleOpenSnackbar: PropTypes.func.isRequired
};