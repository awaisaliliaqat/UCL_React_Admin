import React, { Component, Fragment, useState } from 'react';
import { withStyles } from '@material-ui/styles';
import LoginMenu from '../../../../components/LoginMenu/LoginMenu';
import { TextField, Grid, Button, CircularProgress, Divider, Typography, MenuItem} from '@material-ui/core';
import BottomBar from "../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const styles = () => ({
    root: {
      padding: 20,
    }
});

function TermRow (props) {

	let { termId, rowData } = props;

	let id = "";
	let label = "";
	let noOfAssessmentData = "";
	let gradingPointsData = "";

	if(rowData){
		id = rowData.rubricId;
		label = rowData.rubricLabel;
		noOfAssessmentData = rowData.noOfAssessment;
		gradingPointsData = rowData.gradingPoints;
	}
	
	let [noOfAssessment, setNoOfAssessment] = useState(noOfAssessmentData);
	let [gradePoint, setGradePoint] = useState(gradingPointsData);

	const onNoOfAssessmentChange = (e) => {
		let {name, value} = e.target;
		setNoOfAssessment(value);
	}

	const onGradePointChange = (e) => {
		let {name, value} = e.target;
		setGradePoint(value);
	}

	return (
		<Fragment>
			<Grid item xs={12} md={4}>
				<Card style={{height:55}}>
					<CardContent>
						<Typography variant="body2" color="primary" style={{textAlign:"center", fontWeight:"bold"}}>
							{label}
						</Typography>
					</CardContent>
				</Card>
			</Grid>
			<TextField type="hidden" name="termId" defaultValue={termId}/>
			<TextField type="hidden" name="rubricId" defaultValue={id}/>
			<Grid item xs={12} md={4}>
				<TextField
					id={"noOfAssessment"+`${termId+id}`}
					name="noOfAssessment"
					type="number"
					label="No Of Assessment"
					required
					fullWidth
					variant="outlined"
					onChange={onNoOfAssessmentChange}
					value={noOfAssessment}
					// error={!!this.state.labelError}
					// helperText={this.state.labelError}
				/>
			</Grid>
			<Grid item xs={12} md={4}>
				<TextField
					id={"gradePoint"+`${termId+id}`}
					name="gradePoints"
					label="Grade Point"
					type="number"
					required
					fullWidth
					variant="outlined"
					onChange={onGradePointChange}
					value={gradePoint}
				// 	error={!!this.state.labelError}
				// 	helperText={this.state.labelError}
				/>
			</Grid>
		</Fragment>
	);

}

class F209Form extends Component {

  constructor(props) {
		super(props);
		this.state = {
			recordId: this.props.match.params.recordId,
			isLoading: false,
			isReload: false,
			label:"",
			labelError:"",
			shortLabel:"",
			shortLabelError:"",
			isOpenSnackbar:false,
			snackbarMessage:"",
			snackbarSeverity:"",
			academicSessionMenuItems: [],
			academicSessionId: "",
			academicSessionIdError: "",
			rubricsMenuItems: [],
    }
	}

	handleOpenSnackbar = (msg, severity) => {
		this.setState({
			isOpenSnackbar:true,
			snackbarMessage:msg,
			snackbarSeverity:severity
		});
	};

	handleCloseSnackbar = (event, reason) => {
			if (reason === 'clickaway') {	return;	}
			this.setState({	isOpenSnackbar:false });
	};
		
	loadAcademicSession = async () => {
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C209CommonAcademicSessionsView`;
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
						let data =  json.DATA || [];
						let dataLength = data.length;
						for (var i=0;	i<dataLength;	i++) {
							if (data[i].isActive == "1") {
								this.setState({academicSessionId: data[i].ID});
								this.loadRubrics(data[i].ID);
							}
						}
						this.setState({ academicSessionMenuItems: data });
					} else {
						this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
					}
					console.log("loadAcademicSession", json);
				},
				(error) => {
					if (error.status == 401) {
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

	loadRubrics = async (academicSessionId) => {
		let data =  new FormData();
		data.append("academicSessionId", academicSessionId);
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C209CommonAcademicSessionsRubricsView`;
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
						let data =  json.DATA || [];
						this.setState({ rubricsMenuItems : data });
					} else {
						this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
					}
					console.log("loadRubrics", json);
				},
				(error) => {
					if (error.status == 401) {
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

	onHandleChange = e => {
		const { name, value } = e.target;
		const errName = `${name}Error`;
		let regex = "";
		switch (name) {
				case "academicSessionId":
					this.setState({ rubricsMenuItems : [] });
					this.loadRubrics(value);
				break;
		default:
				break;
		}
		this.setState({
				[name]: value,
				[errName]: ""
		});
	}

	clickOnFormSubmit = () => {

		let noOfAssessment = document.getElementsByName("noOfAssessment");
		let noOfAssessmentLength = noOfAssessment.length || 0;
		let gradePoints = document.getElementsByName("gradePoints");
		let gradePointsLength = gradePoints.length || 0;

		if(noOfAssessmentLength!=gradePointsLength){
			this.handleOpenSnackbar("Missing values! Please try again after refreshing the page.","error");
			return;
		}

		for(let i=0; i<noOfAssessmentLength; i++){
			if(noOfAssessment[i].value.trim() == ""){
					let eleId = noOfAssessment[i].id;
					this.handleOpenSnackbar("Please enter all number of assessment.","error");
					document.getElementById(eleId).focus();
					return;
			 }
			if(gradePoints[i].value.trim() == ""){ 
					let eleId = gradePoints[i].id;
					this.handleOpenSnackbar("Please enter all grade point.","error");
					document.getElementById(eleId).focus();
					return;
			 }
		}

		this.onFormSubmit();

	}

	onFormSubmit = async() => {

		let myForm = document.getElementById('myForm');
		const data = new FormData(myForm);
		this.setState({isLoading: true});
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C209CommonAcademicSessionsRubricsSave`;
		await fetch(url, {
			method: "POST", 
			body: data, 
			headers: new Headers({
					Authorization: "Bearer "+localStorage.getItem("uclAdminToken")
			})
		})
		.then(res => {
				if (!res.ok) {
						throw res;
				}
				return res.json();
		})
		.then(
				json => {
						if (json.CODE === 1) {
								//alert(json.USER_MESSAGE);
								this.handleOpenSnackbar(json.USER_MESSAGE,"success");
								this.loadRubrics(this.state.academicSessionId);
								// setTimeout(()=>{
								// 		if(this.state.recordId!=0){
								// 				window.location="#/dashboard/F209Reports";
								// 		}else{
								// 				window.location.reload();
								// 		}
								// }, 2000);
						} else {
								//alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE)
								this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
						}
						console.log(json);
				},
				error => {
						if (error.status == 401) {
								this.setState({
										isLoginMenu: true,
										isReload: false
								})
						} else {
								console.log(error);
								//alert("Failed to Save ! Please try Again later.");
								this.handleOpenSnackbar("Failed to Save ! Please try Again later.","error");
						}
				});
		this.setState({isLoading: false})
	}

	viewReport = () => {
			window.location = "#/dashboard/F209Reports";
	}

	componentDidMount() {
		this.props.setDrawerOpen(false);
		this.loadAcademicSession();
		// if(this.state.recordId!=0){
		
		// }
	}

	componentWillReceiveProps(nextProps){
			if(this.props.match.params.recordId!=nextProps.match.params.recordId){
					if(nextProps.match.params.recordId!=0){
							this.props.setDrawerOpen(false);
							this.loadAcademicSession();
					}else{
							window.location.reload();
					}
			}
	}

  render() {

    const { classes } = this.props;

    return (
      <Fragment>
        <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })} />
        <form id="myForm">
					<Grid 
						container 
						component="main"
						justify="center"
						spacing={2}
						className={classes.root}
					>
						<Grid item xs={12}>
							<Typography 
								style={{
									color: '#1d5f98', 
									fontWeight: 600,
									fontSize: 20,
									borderBottom: '1px solid rgb(58, 127, 187, 0.3)'
								}} 
							>
								Pending
							</Typography>
						</Grid>
						<TextField type="hidden" name="recordId" value={this.state.recordId}/>
						<Grid item xs={12} md={12}>
							<TextField
								id="academicSessionId"
								name="academicSessionId"
								variant="outlined"
								label="Academic Session"
								onChange={this.onHandleChange}
								value={this.state.academicSessionId}
								error={!!this.state.academicSessionIdError}
								helperText={this.state.academicSessionIdError}
								required
								fullWidth
								select
							>
								{this.state.academicSessionMenuItems.map((dt, i) => (
									<MenuItem
										key={"academicSessionMenuItems" + dt.ID}
										value={dt.ID}
									>
										{dt.Label}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						{this.state.rubricsMenuItems.length > 0 ?
							this.state.rubricsMenuItems.map( (headerRow, HeaderIndex) => 
								<Fragment key={"HeaderRow"+HeaderIndex}>
									<Grid item xs={12} md={12}>
										<Card style={{height:55, backgroundColor:"#174a84"}}>
											<CardContent>
												<Typography variant="body1" style={{color:"#fff", textAlign:"center", fontWeight:"bold"}}>
												{headerRow.termLabel}
												</Typography>
											</CardContent>
										</Card>
									</Grid>
									{headerRow.rubrics.length > 0 ?
										headerRow.rubrics.map( (row, index) => 
											<TermRow 
												key={"1stTremRow"+index}
												termId={headerRow.termId}
												rowData={row}
											/>
										)
										:
										""
									}
								</Fragment>
							)
							:
							this.state.isLoading 
								&& 
									<CircularProgress disableShrink />
						}
						<Grid item xs={12}>
							<br/>
							<br/>
						</Grid>	
					</Grid>
				</form>
				<BottomBar
						left_button_text="View"
						left_button_hide={true}
						bottomLeftButtonAction={this.viewReport}
						right_button_text="Save"
						bottomRightButtonAction={this.clickOnFormSubmit}
						loading={this.state.isLoading}
						isDrawerOpen={ this.props.isDrawerOpen}
				/>
				<CustomizedSnackbar
						isOpen={this.state.isOpenSnackbar}
						message={this.state.snackbarMessage}
						severity={this.state.snackbarSeverity}
						handleCloseSnackbar={() => this.handleCloseSnackbar()}
				/>
      </Fragment>
    );
  }
}
export default withStyles(styles)(F209Form);