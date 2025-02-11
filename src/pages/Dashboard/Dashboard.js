/* eslint-disable react/prop-types */
import React, { Fragment, useState, Suspense, useEffect, createRef } from "react";
import clsx from "clsx";
import { HashRouter as Router, Switch, Route, Link, Redirect, } from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import NavBar from "../../components/NavBar/NavBar";
import Logo from "../../assets/Images/logo.png";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import WelcomePage from "./Contents/WelcomePage";
import DashboardPage from "./Contents/DashboardPage/DashboardPage";
import HomePage from "./Contents/LMS/HomePage/HomePage";
import Leaf from "../../assets/Images/svg/leaf.svg";
import AdmissionApplicationReports from "./Contents/Reports/AdmissionApplicationReports/AdmissionApplicationReports";
import AdmissionDecision from "./Contents/Decision/AdmissionDecision/AddmissionDecision";
import RegistrationFeeApprovel from "./Contents/Decision/RegistrationFeeApproval/RegistrationFeeApprovel";
import OfferLetter from "./Contents/Decision/OfferLetter/OfferLetter";
import AssignAcccountId from "./Contents/Decision/AssignAccountId/AssignAcccountId";
import UploadTutionFees from "./Contents/Decision/UploadTutionFee/UploadTutionFees";
import TutionFeeApproval from "./Contents/Decision/TutionFeeApproval/TutionFeeApproval";
import R303DueTuitionFee from "./Contents/Decision/R303DueTuitionFee/R303DueTuitionFee";
import UploadDocuments from "./Contents/Decision/DocumentRequest/DocumentRequest";
import DocumentRequestAction from "./Contents/Decision/DocumentRequest/Chunks/DocumentRequestAction";
import EditStudentInformation from "./Contents/Decision/EditStudentInformation/EditStudentInformation";
import EditStudentInformationAction from "./Contents/Decision/EditStudentInformation/Chunks/EditStudentInformationAction";
import DefineTeacherFrom from "./Contents/Forms/DefineTeacher/DefineTeacherForm";
import DefineTeacherReports from "./Contents/Forms/DefineTeacher/DefineTeacherReports";
import CreateSectionForm from "./Contents/Forms/CreateSection/CreateSectionForm";
import CreateSectionReports from "./Contents/Forms/CreateSection/CreateSectionReports";
import AssignSectionToStudentFrom from "./Contents/Forms/AssignSectionToStudent/AssignSectionToStudentForm";
import AssignSectionToTeacherForm from "./Contents/Forms/AssignSectionToTeacher/AssignSectionToTeacherForm";
import StudentCourseSelection from "./Contents/Forms/StudentCourseSelection/StudentCourseSelection";
import AssignSectionToStudentReport from "./Contents/Forms/AssignSectionToStudent/AssignSectionToStudentReports";
import AssignSectionToTeacherReport from "./Contents/Forms/AssignSectionToTeacher/AssignSectionToTeacherReports";
import F06Form from "./Contents/Forms/F06Form";
import F06Reports from "./Contents/Forms/F06Reports";
import F81Form from "./Contents/Forms/F81Form";
import F81Reports from "./Contents/Forms/F81Reports";
import F07Form from "./Contents/Forms/F07Form";
import F07Reports from "./Contents/Forms/F07Reports";
import F08Form from "./Contents/Forms/F08Form";
import F08Reports from "./Contents/Forms/F08Reports";
import F09Form from "./Contents/Forms/F09Form";
import F09Reports from "./Contents/Forms/F09Reports";
import F18Form from "./Contents/Forms/F18Form";
import F18Reports from "./Contents/Forms/F18Reports";
import F19Form from "./Contents/Forms/F19Form";
import F20Form from "./Contents/Forms/F20Form";
import F20Reports from "./Contents/Forms/F20Reports";
import F24Form from "./Contents/Forms/F24Form";
import F24Reports from "./Contents/Forms/F24Reports";
import F25Form from "./Contents/Forms/F25Form";
import F27Form from "./Contents/Forms/F27Form";
import F30Form from "./Contents/Forms/F30Form";
import F31Form from "./Contents/Forms/F31Form";
import F33Form from "./Contents/Forms/F33Form";
import F34Form from "./Contents/Forms/F34Form";
import F34Reports from "./Contents/Forms/F34Reports";
import F36Form from "./Contents/Forms/F36Form";
import ControlledDialog from "../../components/ControlledDialog/ControlledDialog";
import TeacherAttendance from "./Contents/LMS/TeacherAttendance/TeacherAttendance";
import MonthWiseTeacherTimeSheetReport from "./Contents/PayrollModule/Reports/MonthWiseTeacherTimeSheet/MonthWiseTeacherTimeSheetReport";
import StudentBritishCouncilReports from "./Contents/Reports/StudentBritishCouncilReports/StudentBritishCouncilReports";
import StudentReports from "./Contents/Reports/StudentReports/StudentReports";
import TeacherAttendanceReports from "./Contents/Reports/TeacherAttendanceReports/AttendanceReports";
import MonthWiseTeachersTimeSheetCoordinatorReport from "./Contents/PayrollModule/Reports/MonthWiseTeachersTimeSheetCoordinatorReport/MonthWiseTeachersTimeSheetCoordinatorReport";
import StudentAttendanceReports from "./Contents/Reports/StudentAttendanceReports/AttendanceReports";
import F39Form from "./Contents/Forms/F39Form";
import F39Reports from "./Contents/Forms/F39Reports";
import F40Form from "./Contents/LMS/F40GradedDiscussion/F40Form";
import F40Reports from "./Contents/LMS/F40GradedDiscussion/F40Reports";
import GradedDiscussionBoardList from "./Contents/LMS/GradedDiscussionBoardList/GradedDiscussionBoardList";
import GradedDiscussionBoardStudentList from "./Contents/LMS/GradedDiscussionBoardStudentList/GradedDiscussionBoardStudentList";
import GradedDiscussionSummary from "./Contents/Reports/GradedDiscussionSummary/GradedDiscussionSummary";
import R41Reports from "./Contents/Forms/R41Reports";
import R46Reports from "./Contents/Forms/R46Reports";
import R47Reports from "./Contents/Forms/R47Reports";
import R49Reports from "./Contents/Forms/R49Reports";
import R54Reports from "./Contents/Forms/R54Reports";
import R63Reports from "./Contents/Forms/R63Reports";
import F56Form from "./Contents/Forms/F56Form";
import R59Reports from "./Contents/Forms/R59Reports";
import F60Form from "./Contents/Forms/F60Form";
import R61Reports from "./Contents/Forms/R61Reports";
import F62Form from "./Contents/Forms/F62Form";
import F64Form from "./Contents/Forms/F64Form";
import F65Form from "./Contents/Forms/F65Form";
import F65Reports from "./Contents/Forms/F65Reports";
import R66Reports from "./Contents/Forms/R66Reports";
import R78Reports from "./Contents/Forms/R78Reports";
import F67Form from "./Contents/Forms/F67Form";
import F67Reports from "./Contents/Forms/F67Reports";
import R68Reports from "./Contents/Forms/R68Reports";
import F69Form from "./Contents/Forms/F69Form";
import F69Reports from "./Contents/Forms/F69Reports";
import F70Form from "./Contents/Forms/F70Form";
import F70Reports from "./Contents/Forms/F70Reports";
import R71Reports from "./Contents/Forms/R71Reports";
import F72Form from "./Contents/Forms/F72Form";
import F72Reports from "./Contents/Forms/F72Reports";
import R73Reports from "./Contents/Forms/R73Reports";
import R74Reports from "./Contents/Forms/R74Reports";
import F75Form from "./Contents/Forms/F75Form";
import R76Reports from "./Contents/Forms/R76Reports";
import F77Form from "./Contents/Forms/F77Form";
import F82Form from "./Contents/Forms/F82Form";
import F82Reports from "./Contents/Forms/F82Reports";
import F83Form from "./Contents/Forms/F83Form";
import F83Reports from "./Contents/Forms/F83Reports";
import StudentProfile from "./Contents/Reports/StudentProfile/StudentProfile";
import ChangeStudentProgramme from "./Contents/Reports/ChangeStudentProgramme/ChangeStudentProgramme";
import CovidVaccineCertificateApproval from "./Contents/Reports/CovidVaccineCertificateApproval/CovidVaccineCertificateApproval";
import ChangeStudentStatus from "./Contents/Decision/ChangeStudentStatus/ChangeStudentStatus";
import SyncTimeTable from "./Contents/LMS/SyncTimeTable/SyncTimeTable";
import SyncTimeTableToday from "./Contents/LMS/SyncTimeTable/SyncTimeTableToday";
import SyncZoomMeetings from "./Contents/LMS/SyncZoomMeetings/SyncZoomMeetings";
import CreateRoomForm from "./Contents/Forms/CreateRoom/CreateRoomFrom";
import CreateRoomReports from "./Contents/Forms/CreateRoom/CreateRoomReports";
import ClassSchedule from "./Contents/LMS/ClassSchedule/ClassSchedule";
import AnnouncementForm from "./Contents/LMS/Announcement/AnnouncementForm";
import AnnouncementReports from "./Contents/LMS/Announcement/AnnouncementReports";
import F201Form from "./Contents/Forms/F201Form";
import F201Reports from "./Contents/Forms/F201Reports";
import F202Form from "./Contents/Forms/F202Form";
import F202Reports from "./Contents/Forms/F202Reports";
import F203Form from "./Contents/Forms/F203Form";
import F203Reports from "./Contents/Forms/F203Reports";
import F204Form from "./Contents/Forms/F204Form";
import F204Reports from "./Contents/Forms/F204Reports";
import F205Form from "./Contents/Forms/F205Form";
import R206Reports from "./Contents/Forms/R206Reports";
import R79Reports from "./Contents/Forms/R79Reports";
import F207Form from "./Contents/Forms/F207Form";
import F207Reports from "./Contents/Forms/F207Reports";
import F208Form from "./Contents/Forms/F208Form";
import F208Reports from "./Contents/Forms/F208Reports";
import F209Form from "./Contents/Forms/F209Form";
import R210Reports from "./Contents/Forms/R210Reports";
import F211Form from "./Contents/Forms/F211Form";
import F211Reports from "./Contents/Forms/F211Reports";
import F212Form from "./Contents/Forms/F212Form";
import F212FormV2 from "./Contents/Forms/F212FormV2";
import F220Form from "./Contents/Forms/F220Form";
import F221Form from "./Contents/Forms/F221Form";
import R213Reports from "./Contents/Forms/R213Reports";
import R216Reports from "./Contents/Forms/R216Reports";
import R217FeedbackReports from "./Contents/Forms/R217FeedbackReports";
import R217Reports from "./Contents/Forms/R217Reports";
import R218Reports from "./Contents/Forms/R218Reports";
import F219Form from "./Contents/Forms/F219Form";
import R222Reports from "./Contents/Forms/R222Reports";
import F219Reports from "./Contents/Forms/F219Reports";
import R220Reports from "./Contents/Forms/R220Reports";
import AllActiveClasses from "./Contents/Reports/AllActiveClasses/AllActiveClasses";
import R80Reports from "./Contents/Forms/R80Reports";
import StudentDynamicColumnsReports from "./Contents/Reports/StudentDynamicColumnsReports/StudentDynamicColumnsReports";
import R244Report from "./Contents/Reports/AllGraduatedStudents/R224Report";
import F225Form from "./Contents/Forms/F225Form";
import F227UserLoginAs from "./Contents/Forms/F227UserLoginAs";
import F228StudentLoginAs from "./Contents/Forms/F228StudentLoginAs";
import F229Form from "./Contents/Forms/F229Form";
import F230Form from "./Contents/Forms/F230Form";
import F231Form from "./Contents/Forms/F231Form";
import R232Reports from "./Contents/Forms/R232Reports";
import F300Form from "./Contents/Forms/F300Form";
import R302Reports from "./Contents/Forms/R302Reports";
import F302Form from "./Contents/Forms/F302Form";
import F304Form from "./Contents/Forms/DegreeProgrammesActivation/F304Form";
import F306AnnouncementForEmployeeForm from "./Contents/LMS/AnnouncementForEmployee/F306AnnouncementForEmployeeForm";
import R307ApprovedProgressReportsFilter from "./Contents/Forms/ApprovedStudentsProgressReports/R307ApprovedProgressReportsFilter";
import DefineEmployeeForm from "./Contents/Forms/DefineEmployee/DefineEmployeeForm";
import DefineEmployeeReports from "./Contents/Forms/DefineEmployee/DefineEmployeeReports";
import AnnouncementForEmployeeReports from "./Contents/LMS/AnnouncementForEmployee/AnnouncementForEmployeeReports";
import F308DefineEmployeeRolesFrom from "./Contents/Forms/DefineEmployeeRoles/F308DefineEmployeeRolesFrom";
import F309DefineEmployeeEntitiesFrom from "./Contents/Forms/DefineEmployeeEntities/F309DefineEmployeeEntitiesFrom";
import F310DefineEmployeeDepartmentsFrom from "./Contents/Forms/DefineEmployeeDepartments/F310DefineEmployeeDepartmentsFrom";
import F311DefineEmployeeSubDepartmentsFrom from "./Contents/Forms/DefineEmployeeSubDepartments/F311DefineEmployeeSubDepartmentsFrom";
import F312DefineEmployeeDesignationsFrom from "./Contents/Forms/DefineEmployeeDesignations/F312DefineEmployeeDesignationsFrom";
import R313Reports from "./Contents/Reports/UOLEnrolment/F313Reports";
import R314StudentList from "./Contents/Forms/StudentCentricDashboard/R314StudentsList";
import R314StudentCentricDashboard from "./Contents/Forms/StudentCentricDashboard/R314StudentCentricDashboard";
import AssignSectionToStudentFormForCentricDashboard from "./Contents/Forms/AssignSectionToStudent/AssignSectionToStudentFormForCentricDashboard";
import F34ReportsForCentricDashboard from "./Contents/Forms/F34ReportsForCentricDashboard";
import F205ReportsForCentricDashboard from "./Contents/Forms/F205ReportsForCentricDashboard";
import F201FormForCentricDashboard from "./Contents/Forms/F201FormForCentricDashboard";
import F202FormForCentricDashboard from "./Contents/Forms/F202FormForCentricDashboard";
import F315DefineEmployeesPayroll from "./Contents/Forms/DefineEmployeesPayroll/F315DefineEmployeesPayroll";
import R316EmployeesPayrollView from "./Contents/Forms/DefineEmployeesPayroll/R316EmployeesPayrollView";
import R317TeacherCoursesHistory from "./Contents/Reports/TeacherCoursesHistory/R317TeacherCoursesHistory";
import R318EmployeeActivationHistory from "./Contents/Reports/EmployeeActivationHistory/R318EmployeeActivationHistory";
import F319DefineEmployeeSalaryAllowancesLabelFrom from "./Contents/Forms/DefineEmployeeSalaryAllowancesLabel/F319DefineEmployeeSalaryAllowancesLabelFrom";
import F320DefineEmployeeSalaryDeductionsLabelFrom from "./Contents/Forms/DefineEmployeeSalaryDeductionsLabel/F320DefineEmployeeSalaryDeductionsLabelFrom";
import F321DefineEmployeesMonthlySalary from "./Contents/Forms/DefineEmployeesMonthlySalary/F321DefineEmployeesMonthlySalary";
import F322HourlySheetsForCoordinators from "./Contents/Forms/HourlySheetsForCoordinators/F322HourlySheetsForCoordinators";
import F323HourlySheetsForHeads from "./Contents/Forms/HourlySheetsForHeads/F323HourlySheetsForHeads";
// import F324HourlySheetsForHOD from "./Contents/Forms/HourlySheetsForHOD/F324HourlySheetsForHOD";
import F322HourlySheetReportForCoordinator from "./Contents/Forms/HourlySheetsForCoordinators/Report/F322HourlySheetReportForCoordinator";
import F324HourlySheetsForHOD from "./Contents/Forms/HourlySheetsForHOD/F324HourlySheetReportForHOD";
import F322ViewRecordForCoordinators from "./Contents/Forms/HourlySheetsForCoordinators/View/F322ViewRecordForCoordinators";
import F324ViewRecordForHOD from "./Contents/Forms/HourlySheetsForHOD/View/F324ViewRecordForHOD";
import F323HourlySheetsForHead from "./Contents/Forms/HourlySheetsForHeads/F323HourlySheetReportForHead";
import F323ViewRecordForHead from "./Contents/Forms/HourlySheetsForHeads/View/F323ViewRecordForHead";
import R325PaidStudentList from "./Contents/Decision/R325PaidStudentList/R325PaidStudentList";
import F326ConsolitdatedSheetsForDirector from "./Contents/Forms/ConsolidatedSheetForDirector/F326ConsolitdatedSheetsForDirector";
import F321DefineEmployeesMonthlySalaryView from "./Contents/Forms/DefineEmployeesMonthlySalary/F321DefineEmployeesMonthlySalaryView/F321DefineEmployeesMonthlySalaryView";
import R327UploadedFeeVoucher from "./Contents/Decision/R327UploadedFeeVoucher/R327UploadedFeeVoucher";
import F327DefineEmployeesLoan from "./Contents/Forms/StudentLoanRequest/F327DefineEmployeesLoan";
import R327EmployeesLoanView from "./Contents/Forms/StudentLoanRequest/R327EmployeesLoanView";
import R328EmployeesLoanApprovalReview from "./Contents/Forms/LoanRecommendationReport/R328EmployeesLoanApprovalReview";
import R329EmployeesLoanApprovalReview from "./Contents/Forms/LoanApprovalReview/R329EmployeesLoanApprovalReview";
import F330ConsolitdatedSheetsForPayroll from "./Contents/Forms/ConsolidatedSheetForPayroll/F330ConsolitdatedSheetsForPayroll";
import F331EmployeeSalarySlipReport from "./Contents/Forms/EmployeeSalarySlipReport/F331EmployeeSalarySlipReport";
import F331EmployeeMonthlySallaryChallanView from "./Contents/Forms/EmployeeSalarySlipReport/F331EmployeeMonthlySallaryChallanView";
import F332EmployeeTaxCertificateView from "./Contents/Forms/EmployeeTaxCertificate/F332EmployeeTaxCertificateView";
import F332EmployeeTaxCertificateReport from "./Contents/Forms/EmployeeTaxCertificate/F332EmployeeTaxCertificateReport";
import F333ConsolitdatedSheetsForSalaryHistory from "./Contents/Forms/ConsolidatedSalaryHistory/F333ConsolitdatedSheetsForSalaryHistory";
import F333SalaryHistoryView from "./Contents/Forms/ConsolidatedSalaryHistory/Views/F333SalaryHistoryView";
// import F334MonthlyEmployeeAttendance from "./Contents/Forms/MonthlyEmployeeAttendance/F334MonthlyEmployeeAttendance";
import F334Form from "./Contents/Forms/F334ConsolidatedSheetsAccountsOffice/F334Form";
import F334Reports from "./Contents/Forms/F334ConsolidatedSheetsAccountsOffice/F334Reports";
import F335DefineShiftManagement from "./Contents/Forms/ShiftManagement/F335DefineShiftManagement";
import R335ShiftManagementReport from "./Contents/Forms/ShiftManagement/R335ShiftManagementReport";
import F336MonthlyEmployeeAttendance from "./Contents/Forms/MonthlyEmployeeAttendance/F336MonthlyEmployeeAttendance";
import F349MonthlyEmployeeAttendanceCo from "./Contents/Forms/MonthlyEmployeeAttendanceCo/F349MonthlyEmployeeAttendanceCo";
import F337MonthlyEmployeeApproval from "./Contents/Forms/MonthlyEmployeeApproval/F337MonthlyEmployeeApproval";
import F337ViewRecordForMonthlyApproval from "./Contents/Forms/MonthlyEmployeeApproval/View/F337ViewRecordForMonthlyApproval";
import R338AttendanceDailyReport from "./Contents/Forms/R338AttendanceDailyReport";
import F339AddManualAttendance from "./Contents/Forms/AddManualAttendance/F339AddManualAttendance";
import R340Reports from "./Contents/Forms/R340Reports";
import R341Reports from "./Contents/Forms/R341Reports";
import R342AllEmployeeGateAttendance from "./Contents/Forms/R342AllEmployeeGateAttendance";
import F343LinkEnrollmentIds from "./Contents/Forms/LinkEnrollmentIds/F343LinkEnrollmentIds";
import F343LinkEnrollmentIdsView from "./Contents/Forms/LinkEnrollmentIds/F343LinkEnrollmentIdsView";
import F344MonthlyAttendanceFeature from "./Contents/Forms/F344MonthlyAttendanceFeature";
import R345MasterAttendanceLogs from "./Contents/Forms/R345MasterAttendanceLogs";
import F346StudentAttendanceFeature from "./Contents/Forms/StudentAttendanceFeature/F346StudentAttendanceFeature";
import R346StudentDetailReport from "./Contents/Forms/StudentAttendanceFeature/R346StudentDetailReport/R346StudentDetailReport";
import F347ShiftReassignment from "./Contents/Forms/ShiftReassignment/F347ShiftReassignment";
import R347ShiftAssignmentView from "./Contents/Forms/ShiftReassignment/R347ShiftAssignmentView";
// import F348Form from "./Contents/Forms/F348Form";
import F348DefineTimetableActivation from "./Contents/Forms/Timetable Pause-Unpause/F348DefineTimetableActivation";
import R348TimeTableActivationView from "./Contents/Forms/Timetable Pause-Unpause/R348TimeTableActivationView";
import R350MonthlyEmployeeLateDaysReportforPayroll from "./Contents/Forms/MonthlyLateDaysForPayroll/R350MonthlyEmployeeLateDaysReportforPayroll";
import R350EmployeesWithFinalApproval from "./Contents/Forms/MonthlyLateDaysForPayroll/EmployeesWithFinalApproval/R350EmployeesWithFinalApproval";
import R350EmployeesNotSubmitted from "./Contents/Forms/MonthlyLateDaysForPayroll/EmployeesNotSubmitted/R350EmployeesNotSubmitted";
import R350EmployeesWithPendingForApproval from "./Contents/Forms/MonthlyLateDaysForPayroll/EmployeesWithPendingForApproval/R350EmployeesWithPendingForApproval";

const drawerWidth = 283;

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
  	},
  	menuTitle: {
		backgroundColor: "#103C6E",
		fontFamily: "sans-serif",
		display: "flex",
		cursor: "default",
		fontSize: 16,
		fontWeight: 600,
		padding: 5,
		marginTop: 15,
	},
	menuItemPadding: {
		padding: "0 !important",
		cursor: "pointer",
	},
	menuTitleIcon: {
		height: 25,
		width: 25,
		marginRight: 10,
		marginLeft: 15,
	},
	menuItemText: {
		textAlign: "left",
		paddingTop: 3,
		paddingBottom: 3,
		paddingLeft: 25,
		color: "white",
		width: drawerWidth - 70,
		textOverflow: "clip",
		whiteSpace: "break-spaces",
	},
	active: {
		backgroundColor: "#103C6E",
		paddingTop: 5,
		paddingBottom: 5,
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(1),
		transition: theme.transitions.create("margin", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
		}),
	},
	contentShift: {
		transition: theme.transitions.create("margin", {
		easing: theme.transitions.easing.easeOut,
		duration: theme.transitions.duration.enteringScreen,
		}),
		marginLeft: drawerWidth,
	},
	toolbar: theme.mixins.toolbar,
	drawer: {
		width: drawerWidth - 10,
	},
	drawerPaper: {
		width: drawerWidth,
		color: "#F5F5F5",
		backgroundColor: "#174A84",
	},
	drawerContainer: {
		overflow: "auto",
		justifyContent: "space-between",
		display: "flex",
		flexDirection: "column",
		height: "100%",
	},
	regular: {
		minHeight: 0,
	},
	menuListContainer: {
		borderLeft: "3px solid",
	},
}));

// userRoleIds
// 1 === Teacher
// 2 === Admin

const SetRoute = ({ name, setValue, ...rest }) => {
  	useEffect(() => {
		setValue(name);
  	},[name, setValue]);
  	return <Route {...rest} />;
};

const NoFound = () => {
  return <Redirect to="/dashboard" />;
};

const Dashboard = (props) => {
	const classes = useStyles();
	const [viewValue, setViewValue] = useState(props.match.params.value || "");
	const [isDrawerOpen, setDrawerOpen] = useState(false);
	const [isDialogOpen, setDialogOpen] = useState(false);
	const adminData = localStorage.getItem("adminData") ? JSON.parse(localStorage.getItem("adminData")) : {};
	const { featureList = [] } = adminData;

	useEffect(() => {
		const check = adminData.isZoomVerified === 0 && adminData.isTeacher === 1 && window.localStorage.getItem("isViewDialog") == 0;
		setDialogOpen(check);
	}, []);

	const handleValueChange = (value) => {
		setViewValue(value);
	};

	const setOpenMenu = (e) => {
		e.preventDefault();
		const prevFlag = isDrawerOpen;
		setDrawerOpen(!prevFlag);
	};

	const isUserDesignation = adminData?.employeeDesignations?.some((item) => item.dashboardId !== -1);
	const isUserTeacher = adminData?.employeeDesignations?.some((item) => item.dashboardId === -1);

	const buttonRefNotiDrawerOpen = createRef();

  	return (
		<Fragment>
		{/* <ControlledDialog
			open={isDialogOpen}
			handleClose={() => {
			setDialogOpen(false);
			localStorage.setItem("isViewDialog", 1);
			}}
			title={"Error"}
			content={
			"Please accept zoom invitation sent on your registered email id "
			}
		/> */}
		<NavBar
			setOpenMenu={(e) => setOpenMenu(e)}
			isOpenMenu={isDrawerOpen}
			logo={Logo}
			title="University College London"
			isAuthorize
			userName={adminData.displayName}
			ref={buttonRefNotiDrawerOpen}
		/>
		<Drawer
			open={isDrawerOpen}
			onClose={() => setDrawerOpen(false)}
			className={classes.drawer}
			variant="persistent"
			anchor="left"
			classes={{
			paper: classes.drawerPaper,
			}}
		>
			<Toolbar />
			<div className={classes.drawerContainer}>
		  		<div>
					{featureList.map((feature) => {
					const { items = [] } = feature;
					return (
						<div key={feature.typeId} className={classes.menuListContainer}>
						<Typography className={classes.menuTitle} noWrap variant="h6">
							<img alt="" className={classes.menuTitleIcon} src={Leaf} />{" "}
							<div>{feature.typeLabel}</div>
						</Typography>
						<MenuList
							style={{
							outline: "none",
							}}
						>
							{items.map((option) => {
								return (
									<MenuItem
										key={option.id}
										className={`${classes.menuItemPadding}`}
									>
										<Link
											style={{ textDecoration: "none" }}
											to={option.webUrl || ""}
										>
											<Typography
												className={`${classes.menuItemText} ${ viewValue === `${option.action}` && classes.active }`}
												noWrap
												variant="body2"
											>
												{option.label}
											</Typography>
										</Link>
									</MenuItem>
								);
							})}
				  		</MenuList>
					</div>
			  		);
				})}
		  		</div>
				<div
					style={{
					maxWidth: drawerWidth - 15,
					paddingBottom: 10,
					paddingTop: 20,
					}}
				>
					<Typography
						variant="body2"
						style={{ fontSize: 12, color: "white" }}
						align="center"
					>
			  			Copyright © {new Date().getFullYear()}. Universal College Lahore
			  			<br/>
						(UCL), Pakistan - All Rights Reserved
					</Typography>
		  		</div>
			</div>
	  	</Drawer>
		<main
			className={clsx(classes.content, { [classes.contentShift]: isDrawerOpen && viewValue != "home" })}
		>
		<div className={classes.toolbar} />
		<Router>
		  	<Suspense fallback={<p>Loading...</p>}>
				<Switch>
			  		<SetRoute
						setValue={(value) => handleValueChange(value)}
						name="home"
						exact
						path="/welcome"
						component={ WelcomePage }
			  		/>
					{isUserTeacher &&
					<SetRoute
						setValue={(value) => handleValueChange(value)}
						name="home"
						exact
						path="/dashboard"
						component={ HomePage }
			  		/>
					}
					
					<SetRoute
						setValue={(value) => handleValueChange(value)}
						name="admission-application-reports"
						exact
						path="/dashboard/admission-application-reports"
						component={AdmissionApplicationReports}
					/>
					{/* <SetRoute setValue={value => handleValueChange(value)} name="applicant-registration-analytics" exact path="/dashboard/applicant-registration-analytics" component={ApplicantRegistrationAnalytics} /> */}
					<SetRoute
						setValue={(value) => handleValueChange(value)}
						name="admission-decision"
						exact
						path="/dashboard/admission-decision"
						component={AdmissionDecision}
					/>
					<SetRoute
						setValue={(value) => handleValueChange(value)}
						name="registration-fee-approval"
						exact
						path="/dashboard/registration-fee-approval"
						component={RegistrationFeeApprovel}
					/>
					<SetRoute
						setValue={(value) => handleValueChange(value)}
						name="raise-document-requests"
						exact
						path="/dashboard/raise-document-requests"
						component={UploadDocuments}
					/>
					<SetRoute
						setValue={(value) => handleValueChange(value)}
						name="raise-document-requests"
						exact
						path="/dashboard/raise-document-requests/:id"
						component={DocumentRequestAction}
					/>
					<SetRoute
						setValue={(value) => handleValueChange(value)}
						name="offer-letter"
						exact
						path="/dashboard/offer-letter"
						component={OfferLetter}
					/>
					<SetRoute
						setValue={(value) => handleValueChange(value)}
						name="F06Form"
						exact
						path="/dashboard/F06Form/:recordId"
						render={(props) => {
							return (
								<F06Form
									{...props}
									isDrawerOpen={isDrawerOpen}
									setDrawerOpen={setDrawerOpen}
								/>
							);
						}}
					/>
					<SetRoute
						setValue={(value) => handleValueChange(value)}
						name="F324ViewRecordData"
						exact
						path="/dashboard/F324ViewRecordData/:recordId"
						render={(props) => {
							return (
								<F324ViewRecordForHOD
								{...props}
								isDrawerOpen={isDrawerOpen}
								setDrawerOpen={setDrawerOpen}
								/>
							);
						}}
					/>

					<SetRoute
						setValue={(value) => handleValueChange(value)}
						name="F323ViewRecordData"
						exact
						path="/dashboard/F323ViewRecordData/:recordId"
						render={(props) => {
							return (
								<F323ViewRecordForHead
									{...props}
									isDrawerOpen={isDrawerOpen}
									setDrawerOpen={setDrawerOpen}
								/>
							);
						}}
					/>

					<SetRoute
						setValue={(value) => handleValueChange(value)}
						name="F336MonthlyEmployeeAttendance"
						exact
						path="/dashboard/F336MonthlyEmployeeAttendance"
						render={(props) => {
							return (
								<F336MonthlyEmployeeAttendance
									{...props}
									isDrawerOpen={isDrawerOpen}
									setDrawerOpen={setDrawerOpen}
								/>
							);
						}}
					/>

					<SetRoute
						setValue={(value) => handleValueChange(value)}
						name="R350MonthlyEmployeeLateDaysReportforPayroll"
						exact
						path="/dashboard/R350MonthlyEmployeeLateDaysReportforPayroll"
						render={(props) => {
							return (
								<R350MonthlyEmployeeLateDaysReportforPayroll
									{...props}
									isDrawerOpen={isDrawerOpen}
									setDrawerOpen={setDrawerOpen}
								/>
							);
						}}
					/>

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R350EmployeesWithFinalApproval"
				exact
				path="/dashboard/R350EmployeesWithFinalApproval/:id"
				render={(props) => {
				  return (
					<R350EmployeesWithFinalApproval
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R350EmployeesWithPendingForApproval"
				exact
				path="/dashboard/R350EmployeesWithPendingForApproval/:id"
				render={(props) => {
				  return (
					<R350EmployeesWithPendingForApproval
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R350EmployeesNotSubmitted"
				exact
				path="/dashboard/R350EmployeesNotSubmitted/:id"
				render={(props) => {
				  return (
					<R350EmployeesNotSubmitted
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F349MonthlyEmployeeAttendanceCo"
				exact
				path="/dashboard/F349MonthlyEmployeeAttendanceCo"
				render={(props) => {
				  return (
					<F349MonthlyEmployeeAttendanceCo
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F335DefineShiftManagement"
				exact
				path="/dashboard/F335DefineShiftManagement/:id"
				render={(props) => {
				  return (
					<F335DefineShiftManagement
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F308DefineEmployeeRolesFrom"
				exact
				path="/dashboard/F308DefineEmployeeRolesFrom/:recordId"
				render={(props) => {
				  return (
					<F308DefineEmployeeRolesFrom
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F309DefineEmployeeEntitiesFrom"
				exact
				path="/dashboard/F309DefineEmployeeEntitiesFrom/:recordId"
				render={(props) => {
				  return (
					<F309DefineEmployeeEntitiesFrom
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F310DefineEmployeeDepartmentsFrom"
				exact
				path="/dashboard/F310DefineEmployeeDepartmentsFrom/:recordId"
				render={(props) => {
				  return (
					<F310DefineEmployeeDepartmentsFrom
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F311DefineEmployeeSubDepartmentsFrom"
				exact
				path="/dashboard/F311DefineEmployeeSubDepartmentsFrom/:recordId"
				render={(props) => {
				  return (
					<F311DefineEmployeeSubDepartmentsFrom
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F312DefineEmployeeDesignationsFrom"
				exact
				path="/dashboard/F312DefineEmployeeDesignationsFrom/:recordId"
				render={(props) => {
				  return (
					<F312DefineEmployeeDesignationsFrom
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F06Form"
				exact
				path="/dashboard/F06Reports"
				render={(props) => {
				  return (
					<F06Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F322Reports"
				exact
				path="/dashboard/F322Reports"
				render={(props) => {
				  return (
					<F322HourlySheetReportForCoordinator
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F322ViewRecordData"
				exact
				path="/dashboard/F322ViewRecordData/:recordId"
				render={(props) => {
				  return (
					<F322ViewRecordForCoordinators
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F324Reports"
				exact
				path="/dashboard/F324HourlySheetsForHOD"
				render={(props) => {
				  return (
					<F324HourlySheetsForHOD
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F07Form"
				exact
				path="/dashboard/F07Form/:recordId"
				render={(props) => {
				  return (
					<F07Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F07Reports"
				exact
				path="/dashboard/F07Reports"
				component={F07Reports}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F08Form"
				exact
				path="/dashboard/F08Form/:recordId"
				render={(props) => {
				  return (
					<F08Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F08Reports"
				exact
				path="/dashboard/F08Reports"
				component={F08Reports}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F09Form"
				exact
				path="/dashboard/F09Form/:recordId"
				render={(props) => {
				  return (
					<F09Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F09Reports"
				exact
				path="/dashboard/F09Reports"
				render={(props) => {
				  return (
					<F09Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F18Form"
				exact
				path="/dashboard/F18Form/:recordId"
				render={(props) => {
				  return (
					<F18Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F18Reports"
				exact
				path="/dashboard/F18Reports"
				render={(props) => {
				  return (
					<F18Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F19Form"
				exact
				path="/dashboard/F19Form/:recordId"
				render={(props) => {
				  return (
					<F19Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  {/* <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F348Form"
				exact
				path="/dashboard/F348Form/:recordId"
				render={(props) => {
				  return (
					<F348Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  /> */}
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F20Form"
				exact
				path="/dashboard/F20Form/:recordId"
				render={(props) => {
				  return (
					<F20Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F20Reports"
				exact
				path="/dashboard/F20Reports"
				component={F20Reports}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F24Form"
				exact
				path="/dashboard/F24Form/:recordId"
				render={(props) => {
				  return (
					<F24Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F24Reports"
				exact
				path="/dashboard/F24Reports"
				render={(props) => {
				  return (
					<F24Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F25Form"
				exact
				path="/dashboard/F25Form/:recordId"
				render={(props) => {
				  return (
					<F25Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F27Form"
				exact
				path="/dashboard/F27Form/:recordId"
				render={(props) => {
				  return (
					<F27Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F30Form"
				exact
				path="/dashboard/F30Form/:recordId"
				render={(props) => {
				  return (
					<F30Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F31Form"
				exact
				path="/dashboard/F31Form/:recordId"
				render={(props) => {
				  return (
					<F31Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F33Form"
				exact
				path="/dashboard/F33Form/:recordId"
				render={(props) => {
				  return (
					<F33Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F344MonthlyAttendanceFeature"
				exact
				path="/dashboard/F344MonthlyAttendanceFeature/:recordId"
				render={(props) => {
				  return (
					<F344MonthlyAttendanceFeature
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F346StudentAttendanceFeature"
				exact
				path="/dashboard/R346StudentAttendanceFeature"
				render={(props) => {
				  return (
					<F346StudentAttendanceFeature
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R346StudentDetailReport"
				exact
				path="/dashboard/R346StudentDetailReport/:id"
				render={(props) => {
				  return (
					<R346StudentDetailReport
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F34Form"
				exact
				path="/dashboard/F34Form/:recordId"
				render={(props) => {
				  return (
					<F34Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F34Form"
				exact
				path="/dashboard/F34Reports"
				render={(props) => {
				  return (
					<F34Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F36Form"
				exact
				path="/dashboard/F36Form/:recordId"
				render={(props) => {
				  return (
					<F36Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F39Form"
				exact
				path="/dashboard/F39Form/:recordId"
				render={(props) => {
				  return (
					<F39Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F39Reports"
				exact
				path="/dashboard/F39Reports"
				render={(props) => {
				  return (
					<F39Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F40Form"
				exact
				path="/dashboard/F40Form/:recordId"
				render={(props) => {
				  return (
					<F40Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F40Reports"
				exact
				path="/dashboard/F40Reports"
				render={(props) => {
				  return (
					<F40Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R41Reports"
				exact
				path="/dashboard/R41Reports"
				render={(props) => {
				  return (
					<R41Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R46Reports"
				exact
				path="/dashboard/R46Reports"
				render={(props) => {
				  return (
					<R46Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R47Reports"
				exact
				path="/dashboard/R47Reports"
				render={(props) => {
				  return (
					<R47Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R49Reports"
				exact
				path="/dashboard/R49Reports"
				render={(props) => {
				  return (
					<R49Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R54Reports"
				exact
				path="/dashboard/R54Reports"
				render={(props) => {
				  return (
					<R54Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R54Reports"
				exact
				path="/dashboard/R54Reports"
				render={(props) => {
				  return (
					<R54Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R63Reports"
				exact
				path="/dashboard/R63Reports"
				render={(props) => {
				  return (
					<R63Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F56Form"
				exact
				path="/dashboard/F56Form/:recordId"
				render={(props) => {
				  return (
					<F56Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R59Reports"
				exact
				path="/dashboard/R59Reports"
				render={(props) => {
				  return (
					<R59Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F60Form"
				exact
				path="/dashboard/F60Form/:recordId"
				render={(props) => {
				  return (
					<F60Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R61Reports"
				exact
				path="/dashboard/R61Reports"
				render={(props) => {
				  return (
					<R61Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F62Form"
				exact
				path="/dashboard/F62Form/:recordId"
				render={(props) => {
				  return (
					<F62Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F64Form"
				exact
				path="/dashboard/F64Form/:recordId"
				render={(props) => {
				  return (
					<F64Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F65Form"
				exact
				path="/dashboard/F65Form/:recordId"
				render={(props) => {
				  return (
					<F65Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F65Reports"
				exact
				path="/dashboard/F65Reports"
				render={(props) => {
				  return (
					<F65Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R66Reports"
				exact
				path="/dashboard/R66Reports"
				render={(props) => {
				  return (
					<R66Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R340Reports"
				exact
				path="/dashboard/R340Reports"
				render={(props) => {
				  return (
					<R340Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R341Reports"
				exact
				path="/dashboard/R341Reports"
				render={(props) => {
				  return (
					<R341Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R342AllEmployeeGateAttendance"
				exact
				path="/dashboard/R342AllEmployeeGateAttendance"
				render={(props) => {
				  return (
					<R342AllEmployeeGateAttendance
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R345MasterAttendanceLogs"
				exact
				path="/dashboard/R345MasterAttendanceLogs"
				render={(props) => {
				  return (
					<R345MasterAttendanceLogs
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R78Reports"
				exact
				path="/dashboard/R78Reports"
				render={(props) => {
				  return (
					<R78Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F67Form"
				exact
				path="/dashboard/F67Form/:recordId"
				render={(props) => {
				  return (
					<F67Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F67Form"
				exact
				path="/dashboard/F67Reports"
				render={(props) => {
				  return (
					<F67Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R68Reports"
				exact
				path="/dashboard/R68Reports"
				render={(props) => {
				  return (
					<R68Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F69Form"
				exact
				path="/dashboard/F69Form/:recordId"
				render={(props) => {
				  return (
					<F69Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F69Form"
				exact
				path="/dashboard/F69Reports"
				render={(props) => {
				  return (
					<F69Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F70Form"
				exact
				path="/dashboard/F70Form/:recordId"
				render={(props) => {
				  return (
					<F70Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F70Form"
				exact
				path="/dashboard/F70Reports"
				render={(props) => {
				  return (
					<F70Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R71Reports"
				exact
				path="/dashboard/R71Reports"
				render={(props) => {
				  return (
					<R71Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F72Form"
				exact
				path="/dashboard/F72Form/:recordId"
				render={(props) => {
				  return (
					<F72Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F72Form"
				exact
				path="/dashboard/F72Reports"
				render={(props) => {
				  return (
					<F72Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R73Reports"
				exact
				path="/dashboard/R73Reports"
				render={(props) => {
				  return (
					<R73Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R74Reports"
				exact
				path="/dashboard/R74Reports"
				render={(props) => {
				  return (
					<R74Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F75Form"
				exact
				path="/dashboard/F75Form/0"
				render={(props) => {
				  return (
					<F75Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F77Form"
				exact
				path="/dashboard/F77Form/:recordId"
				render={(props) => {
				  return (
					<F77Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F82Form"
				exact
				path="/dashboard/F82Form/:recordId"
				render={(props) => {
				  return (
					<F82Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F82Form"
				exact
				path="/dashboard/F82Reports"
				render={(props) => {
				  return (
					<F82Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F83Form"
				exact
				path="/dashboard/F83Form"
				render={(props) => {
				  return (
					<F83Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F83Form"
				exact
				path="/dashboard/F83Reports"
				render={(props) => {
				  return (
					<F83Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F219Form"
				exact
				path="/dashboard/F219Form/:recordId"
				render={(props) => {
				  return (
					<F219Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F219Form"
				exact
				path="/dashboard/F219Reports"
				render={(props) => {
				  return (
					<F219Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F219Form"
				exact
				path="/dashboard/F219Reports"
				render={(props) => {
				  return (
					<F219Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R216Reports"
				exact
				path="/dashboard/R216Reports/:recordId"
				render={(props) => {
				  return (
					<R216Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R217FeedbackReports"
				exact
				path="/dashboard/R217FeedbackReports/:recordId"
				render={(props) => {
				  return (
					<R217FeedbackReports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R217Reports"
				exact
				path="/dashboard/R217Reports"
				render={(props) => {
				  return (
					<R217Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R76Reports"
				exact
				path="/dashboard/R76Reports"
				render={(props) => {
				  return (
					<R76Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="assign-account-id"
				exact
				path="/dashboard/assign-account-id"
				component={AssignAcccountId}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="upload-tuition-fees"
				exact
				path="/dashboard/upload-tuition-fees"
				component={UploadTutionFees}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R303Due-Tuition-Fee"
				exact
				path="/dashboard/R303Due-Tuition-Fee"
				component={R303DueTuitionFee}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R327Uploaded-Fee-Voucher"
				exact
				path="/dashboard/R327Uploaded-Fee-Voucher/:id"
				component={R327UploadedFeeVoucher}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R325Paid-Student-List"
				exact
				path="/dashboard/R325Paid-Student-List"
				component={R325PaidStudentList}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="tuition-fee-approval"
				exact
				path="/dashboard/tuition-fee-approval"
				component={TutionFeeApproval}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="edit-student-information"
				exact
				path="/dashboard/edit-student-information"
				component={EditStudentInformation}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="edit-student-information"
				exact
				path="/dashboard/edit-student-information/:id"
				component={EditStudentInformationAction}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="define-teachers"
				exact
				path="/dashboard/define-teachers/:recordId"
				render={(props) => {
				  return (
					<DefineTeacherFrom {...props} isDrawerOpen={isDrawerOpen} />
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="define-employees"
				exact
				path="/dashboard/define-employees/:recordId"
				render={(props) => {
				  return (
					<DefineEmployeeForm
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F315DefineEmployeesPayroll"
				exact
				path="/dashboard/F315DefineEmployeesPayroll/:recordId"
				render={(props) => {
				  return (
					<F315DefineEmployeesPayroll
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F343LinkEnrollmentIds"
				exact
				path="/dashboard/F343LinkEnrollmentIds"
				render={(props) => {
				  return (
					<F343LinkEnrollmentIds
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F343LinkEnrollmentIdsView"
				exact
				path="/dashboard/F343LinkEnrollmentIdsView"
				render={(props) => {
				  return (
					<F343LinkEnrollmentIdsView
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F327DefineEmployeesLoan"
				exact
				path="/dashboard/F327DefineEmployeesLoan/:id"
				render={(props) => {
				  return (
					<F327DefineEmployeesLoan
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F348DefineTimetableActivation"
				exact
				path="/dashboard/F348DefineTimetableActivation/:id"
				render={(props) => {
				  return (
					<F348DefineTimetableActivation
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F347ShiftReassignment"
				exact
				path="/dashboard/F347ShiftReassignment/:id"
				render={(props) => {
				  return (
					<F347ShiftReassignment
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R347ShiftAssignmentView"
				exact
				path="/dashboard/R347ShiftAssignmentView"
				render={(props) => {
				  return (
					<R347ShiftAssignmentView
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R316EmployeesPayrollView"
				exact
				path="/dashboard/R316EmployeesPayrollView"
				render={(props) => {
				  return (
					<R316EmployeesPayrollView
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R327EmployeesLoanView"
				exact
				path="/dashboard/R327EmployeesLoanView"
				render={(props) => {
				  return (
					<R327EmployeesLoanView
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R348TimeTableActivationView"
				exact
				path="/dashboard/R348TimeTableActivationView"
				render={(props) => {
				  return (
					<R348TimeTableActivationView
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R335ShiftManagementReport"
				exact
				path="/dashboard/R335ShiftManagementReport"
				render={(props) => {
				  return (
					<R335ShiftManagementReport
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="define-teachers"
				exact
				path="/dashboard/teacher-reports"
				component={DefineTeacherReports}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="define-teachers"
				exact
				path="/dashboard/employee-reports"
				component={DefineEmployeeReports}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="create-sections"
				exact
				path="/dashboard/create-sections/:recordId"
				render={(props) => {
				  return (
					<CreateSectionForm {...props} isDrawerOpen={isDrawerOpen} />
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="create-sections"
				exact
				path="/dashboard/section-reports"
				component={CreateSectionReports}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="assign-section-to-students"
				exact
				path="/dashboard/assign-section-to-student-reports"
				component={AssignSectionToStudentReport}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="assign-section"
				exact
				path="/dashboard/assign-section/:id"
				component={AssignSectionToStudentFormForCentricDashboard}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="assign-section-to-students"
				exact
				path="/dashboard/assign-section-to-students/:recordId"
				render={(props) => {
				  return (
					<AssignSectionToStudentFrom
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="assign-section-to-teacher"
				exact
				path="/dashboard/assign-section-to-teacher-reports"
				component={AssignSectionToTeacherReport}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="assign-section-to-teacher"
				exact
				path="/dashboard/assign-section-to-teacher/:recordId"
				render={(props) => {
				  return (
					<AssignSectionToTeacherForm
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="student-course-selection"
				exact
				path="/dashboard/student-course-selection"
				component={StudentCourseSelection}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="teacher-attendance-report"
				exact
				path="/dashboard/teacher-attendance-report"
				component={TeacherAttendance}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="month-wise-teacher-time-sheet-report"
				exact
				path="/dashboard/month-wise-teacher-time-sheet-report"
				// component={MonthWiseTeacherTimeSheetReport}
				render={(props) => {
				  return (
					<MonthWiseTeacherTimeSheetReport
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="month-wise-teacher-time-sheet-coordinator-report"
				exact
				path="/dashboard/month-wise-teacher-time-sheet-coordinator-report"
				component={MonthWiseTeachersTimeSheetCoordinatorReport}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="students-excel-report"
				exact
				path="/dashboard/students-excel-report"
				component={StudentReports}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="students-british-council-excel-report"
				exact
				path="/dashboard/students-british-council-excel-report"
				component={StudentBritishCouncilReports}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="students-dynamic-excel-report"
				exact
				path="/dashboard/students-dynamic-excel-report"
				component={StudentDynamicColumnsReports}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="teacher-attendance-reports-admin"
				exact
				path="/dashboard/teacher-attendance-reports-admin"
				component={TeacherAttendanceReports}
			  />

			  {/* <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="month-wise-teachers-timesheet-reports"
				exact
				path="/dashboard/month-wise-teachers-timesheet-reports-admin"
				component={MonthWiseTeachersTimeSheetReports}
			  /> */}
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="student-attendance-reports-admin"
				exact
				path="/dashboard/student-attendance-reports-admin"
				component={StudentAttendanceReports}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="graded-discussion-board-list"
				exact
				path="/dashboard/graded-discussion-board-list"
				component={GradedDiscussionBoardList}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="graded-discussion-board-list"
				exact
				path="/dashboard/graded-discussion-board-list/:id"
				component={GradedDiscussionBoardStudentList}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="teacher-gdb-summary-report"
				exact
				path="/dashboard/teacher-gdb-summary-report"
				component={GradedDiscussionSummary}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="student-profile"
				exact
				path="/dashboard/student-profile"
				component={StudentProfile}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="covid-vaccine_certificate"
				exact
				path="/dashboard/covid-vaccine_certificate"
				component={CovidVaccineCertificateApproval}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="change_student_programme"
				exact
				path="/dashboard/change_student_programme"
				component={ChangeStudentProgramme}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="all-active-classes"
				exact
				path="/dashboard/all-active-classes"
				component={AllActiveClasses}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="sync-time-table"
				exact
				path="/dashboard/sync-time-table"
				component={SyncTimeTable}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="sync-time-table-today"
				exact
				path="/dashboard/sync-time-table-today"
				component={SyncTimeTableToday}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="sync-zoom-meetings"
				exact
				path="/dashboard/sync-zoom-meetings"
				component={SyncZoomMeetings}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="change-student-status"
				exact
				path="/dashboard/change-student-status"
				render={(props) => {
				  return (
					<ChangeStudentStatus
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="maintain-class-rooms"
				exact
				path="/dashboard/create-room-reports"
				component={CreateRoomReports}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="maintain-class-rooms"
				exact
				path="/dashboard/maintain-class-rooms/:recordId"
				render={(props) => {
				  return (
					<CreateRoomForm {...props} isDrawerOpen={isDrawerOpen} />
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="announcements"
				exact
				path="/dashboard/announcements"
				component={AnnouncementReports}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="announcements"
				exact
				path="/dashboard/announcements/:recordId"
				render={(props) => {
				  return (
					<AnnouncementForm {...props} isDrawerOpen={isDrawerOpen} />
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="announcements"
				exact
				path="/dashboard/announcements-for-employee-reports"
				component={AnnouncementForEmployeeReports}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="announcements for employee"
				exact
				path="/dashboard/F306Form/:recordId"
				render={(props) => {
				  return (
					<F306AnnouncementForEmployeeForm
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="reschedule-classes"
				exact
				path="/dashboard/reschedule-classes"
				component={ClassSchedule}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F201Form"
				exact
				path="/dashboard/F201Form/:recordId"
				render={(props) => {
				  return (
					<F201Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F201Form"
				exact
				path="/dashboard/F201Reports"
				render={(props) => {
				  return (
					<F201Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F202Form"
				exact
				path="/dashboard/F202Form/:recordId"
				render={(props) => {
				  return (
					<F202Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F202Form"
				exact
				path="/dashboard/F202Reports"
				render={(props) => {
				  return (
					<F202Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F203Form"
				exact
				path="/dashboard/F203Form/:recordId"
				render={(props) => {
				  return (
					<F203Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F203Form"
				exact
				path="/dashboard/F203Reports"
				render={(props) => {
				  return (
					<F203Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F204Form"
				exact
				path="/dashboard/F204Form/:recordId"
				render={(props) => {
				  return (
					<F204Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F204Form"
				exact
				path="/dashboard/F204Reports"
				render={(props) => {
				  return (
					<F204Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F205Form"
				exact
				path="/dashboard/F205Form/:recordId"
				render={(props) => {
				  return (
					<F205Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R206Reports"
				exact
				path="/dashboard/R206Reports"
				render={(props) => {
				  return (
					<R206Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R79Reports"
				exact
				path="/dashboard/R79Reports"
				render={(props) => {
				  return (
					<R79Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F207Form"
				exact
				path="/dashboard/F207Form/:recordId"
				render={(props) => {
				  return (
					<F207Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F207Form"
				exact
				path="/dashboard/F207Reports"
				render={(props) => {
				  return (
					<F207Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F208Form"
				exact
				path="/dashboard/F208Form/:recordId"
				render={(props) => {
				  return (
					<F208Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F208Form"
				exact
				path="/dashboard/F208Reports"
				render={(props) => {
				  return (
					<F208Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F209Form"
				exact
				path="/dashboard/F209Form/:recordId"
				render={(props) => {
				  return (
					<F209Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R210Reports"
				exact
				path="/dashboard/R210Reports"
				render={(props) => {
				  return (
					<R210Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F211Form"
				exact
				path="/dashboard/F211Form/:recordId"
				render={(props) => {
				  return (
					<F211Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F211Form"
				exact
				path="/dashboard/F211Reports"
				render={(props) => {
				  return (
					<F211Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F212Form"
				exact
				path="/dashboard/F212Form/:recordId"
				render={(props) => {
				  return (
					<F212Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F212FormV2"
				exact
				path="/dashboard/F212FormV2/:recordId"
				render={(props) => {
				  return (
					<F212FormV2
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F220Form"
				exact
				path="/dashboard/F220Form/:recordId"
				render={(props) => {
				  return (
					<F220Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F221Form"
				exact
				path="/dashboard/F221Form/:recordId"
				render={(props) => {
				  return (
					<F221Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R213Reports"
				exact
				path="/dashboard/R213Reports"
				render={(props) => {
				  return (
					<R213Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R218Reports"
				exact
				path="/dashboard/R218Reports"
				render={(props) => {
				  return (
					<R218Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R220Reports"
				exact
				path="/dashboard/R220Reports"
				render={(props) => {
				  return (
					<R220Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R307ApprovedProgressReportsFilter"
				exact
				path="/dashboard/R307ApprovedProgressReportsFilter"
				render={(props) => {
				  return (
					<R307ApprovedProgressReportsFilter
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R222Reports"
				exact
				path="/dashboard/R222Reports"
				render={(props) => {
				  return (
					<R222Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F221Form"
				exact
				path="/dashboard/F221Form/:recordId"
				render={(props) => {
				  return (
					<F221Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R80Reports"
				exact
				path="/dashboard/R80Reports"
				render={(props) => {
				  return (
					<R80Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F81Form"
				exact
				path="/dashboard/F81Form/:recordId"
				render={(props) => {
				  return (
					<F81Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F81Form"
				exact
				path="/dashboard/F81Reports"
				render={(props) => {
				  return (
					<F81Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R224Report"
				exact
				path="/dashboard/R244Report"
				render={(props) => {
				  return (
					<R244Report
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F225Form"
				exact
				path="/dashboard/F225Form/:recordId"
				render={(props) => {
				  return (
					<F225Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F227Form"
				exact
				path="/dashboard/F227Form/0"
				render={(props) => {
				  return (
					<F227UserLoginAs
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F228Form"
				exact
				path="/dashboard/F228Form/0"
				render={(props) => {
				  return (
					<F228StudentLoginAs
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F229Form"
				exact
				path="/dashboard/F229Form/:recordId"
				render={(props) => {
				  return (
					<F229Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F230Form"
				exact
				path="/dashboard/F230Form/:recordId"
				render={(props) => {
				  return (
					<F230Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F231Form"
				exact
				path="/dashboard/F231Form/:recordId"
				render={(props) => {
				  return (
					<F231Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  {/* Payroll Module */}
			  {/* <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F1001Form"
				exact
				path="/payroll/F1001Form"
				render={(props) => {
				  return (
					<F1001Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  /> */}
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R232Reports"
				exact
				path="/dashboard/R232Reports"
				render={(props) => {
				  return (
					<R232Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F300Form"
				exact
				path="/dashboard/F300Form/:recordId"
				render={(props) => {
				  return (
					<F300Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F302Form"
				exact
				path="/dashboard/F302Form/:recordId"
				render={(props) => {
				  return (
					<F302Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R302Reports"
				exact
				path="/dashboard/R302Reports"
				render={(props) => {
				  return (
					<R302Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F304Form"
				exact
				path="/dashboard/F304Form/0"
				component={F304Form}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F313Reports"
				exact
				path="/dashboard/R313Reports"
				render={(props) => {
				  return (
					<R313Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R314StudentsList"
				exact
				path="/dashboard/R314StudentsList"
				render={(props) => {
				  return (
					<R314StudentList
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R314StudentsList"
				exact
				path="/dashboard/R314StudentCentricDashboard/:id"
				render={(props) => {
				  return (
					<R314StudentCentricDashboard
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F34ReportsForCentricDashboard"
				exact
				path="/dashboard/F34ReportsForCentricDashboard/:id"
				render={(props) => {
				  return (
					<F34ReportsForCentricDashboard
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F205ReportsForCentricDashboard"
				exact
				path="/dashboard/F205ReportsForCentricDashboard/:id"
				render={(props) => {
				  return (
					<F205ReportsForCentricDashboard
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F201FormForCentricDashboard"
				exact
				path="/dashboard/F201FormForCentricDashboard/:id"
				render={(props) => {
				  return (
					<F201FormForCentricDashboard
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F202FormForCentricDashboard"
				exact
				path="/dashboard/F202FormForCentricDashboard/:id"
				render={(props) => {
				  return (
					<F202FormForCentricDashboard
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R317TeacherCoursesHistory"
				exact
				path="/dashboard/R317TeacherCoursesHistory"
				render={(props) => {
				  return (
					<R317TeacherCoursesHistory
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R318EmployeeActivationHistory"
				exact
				path="/dashboard/R318EmployeeActivationHistory"
				render={(props) => {
				  return (
					<R318EmployeeActivationHistory
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F319DefineEmployeeSalaryAllowanceLabelsFrom"
				exact
				path="/dashboard/F319DefineEmployeeSalaryAllowanceLabelsFrom/:id"
				render={(props) => {
				  return (
					<F319DefineEmployeeSalaryAllowancesLabelFrom
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F320DefineEmployeeSalaryDeductionLabelsFrom"
				exact
				path="/dashboard/F320DefineEmployeeSalaryDeductionLabelsFrom/:id"
				render={(props) => {
				  return (
					<F320DefineEmployeeSalaryDeductionsLabelFrom
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F321DefineEmployeesMonthlySalary"
				exact
				path="/dashboard/F321DefineEmployeesMonthlySalary/:id"
				render={(props) => {
				  return (
					<F321DefineEmployeesMonthlySalary
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F321DefineEmployeesMonthlySalaryView"
				exact
				path="/dashboard/F321DefineEmployeesMonthlySalaryView/:id"
				render={(props) => {
				  return (
					<F321DefineEmployeesMonthlySalaryView
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F322HourlySheetForCoordinators"
				exact
				path="/dashboard/F322HourlySheetForCoordinators"
				render={(props) => {
				  return (
					<F322HourlySheetsForCoordinators
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F333SalaryHistoryView"
				exact
				path="/dashboard/F333SalaryHistoryView/:id"
				render={(props) => {
				  return (
					<F333SalaryHistoryView
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R326ConsolidatedHourlySheetForDirector"
				exact
				path="/dashboard/R326ConsolidatedHourlySheetForDirector"
				render={(props) => {
				  return (
					<F326ConsolitdatedSheetsForDirector
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F330ConsolitdatedSheetsForPayroll"
				exact
				path="/dashboard/F330ConsolitdatedSheetsForPayroll"
				render={(props) => {
				  return (
					<F330ConsolitdatedSheetsForPayroll
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F333ConsolitdatedSheetsForSalaryHistory"
				exact
				path="/dashboard/F333ConsolitdatedSheetsForSalaryHistory"
				render={(props) => {
				  return (
					<F333ConsolitdatedSheetsForSalaryHistory
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F334Form"
				exact
				path="/dashboard/F334Form"
				render={(props) => {
				  return (
					<F334Form
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F334Reports"
				exact
				path="/dashboard/F334Reports"
				render={(props) => {
				  return (
					<F334Reports
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F331EmployeeSalarySlipReport"
				exact
				path="/dashboard/F331EmployeeSalarySlipReport"
				render={(props) => {
				  return (
					<F331EmployeeSalarySlipReport
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F332EmployeeTaxCertificateReport"
				exact
				path="/dashboard/F332EmployeeTaxCertificateReport"
				render={(props) => {
				  return (
					<F332EmployeeTaxCertificateReport
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F331EmployeeMonthlySallaryChallanView"
				exact
				path="/dashboard/F331GeneratedSalarySlip/:id"
				render={(props) => {
				  return (
					<F331EmployeeMonthlySallaryChallanView
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F331EmployeeMonthlySallaryChallanView"
				exact
				path="/dashboard/F332GeneratedTaxCertificate/:id"
				// :id
				render={(props) => {
				  return (
					<F332EmployeeTaxCertificateView
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  {/* <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F324HourlySheetsForHOD"
				exact
				path="/dashboard/F324HourlySheetsForHOD"
				render={(props) => {
				  return (
					<F324HourlySheetsForHOD
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  /> */}

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F323HourlySheetForHeads"
				exact
				path="/dashboard/F323HourlySheetForDirector"
				render={(props) => {
				  return (
					<F323HourlySheetsForHead
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F337MonthlyEmployeeApproval"
				exact
				path="/dashboard/F337MonthlyEmployeeApproval"
				render={(props) => {
				  return (
					<F337MonthlyEmployeeApproval
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F337ViewRecordForMonthlyApproval"
				exact
				path="/dashboard/F337ViewRecordForMonthlyApproval/:recordId"
				render={(props) => {
				  return (
					<F337ViewRecordForMonthlyApproval
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F323HourlySheetForHeads"
				exact
				path="/dashboard/F329EmployeesLoanApproval"
				render={(props) => {
				  return (
					<R329EmployeesLoanApprovalReview
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F323HourlySheetForHeads"
				exact
				path="/dashboard/F328EmployeesLoanRecommendation"
				render={(props) => {
				  return (
					<R328EmployeesLoanApprovalReview
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="R338AttendanceDailyReport"
				exact
				path="/dashboard/R338AttendanceDailyReport"
				render={(props) => {
				  return (
					<R338AttendanceDailyReport
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />

			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="F339AddManualAttendance"
				exact
				path="/dashboard/F339EmployeeManualAttendance"
				render={(props) => {
				  return (
					<F339AddManualAttendance
					  {...props}
					  isDrawerOpen={isDrawerOpen}
					  setDrawerOpen={setDrawerOpen}
					/>
				  );
				}}
			  />
			  {isUserDesignation &&
				<SetRoute
					setValue={(value) => handleValueChange(value)}
					name="home"
					exact
					path="/dashboard/:dashboardId"
					//component={ DashboardPage }
					render={(props) => {
						return (
						  <DashboardPage
							{...props}
							isDrawerOpen={isDrawerOpen}
							setDrawerOpen={setDrawerOpen}
							buttonRefNotiDrawerOpen={buttonRefNotiDrawerOpen}
						  />
						);
					  }}
				/>
			  }
			  <SetRoute
				setValue={(value) => handleValueChange(value)}
				name="home"
				exact
				path="*"
				component={NoFound}
			  />
			</Switch>
		  </Suspense>
		</Router>
	  </main>
	</Fragment>
  );
};

export default Dashboard;
