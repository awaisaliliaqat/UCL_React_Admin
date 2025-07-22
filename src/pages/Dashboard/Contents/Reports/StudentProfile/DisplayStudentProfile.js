/* eslint-disable react/no-unescaped-entities */
import React, { Component, Fragment,useState } from 'react';
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';
import Logo from '../../../../../assets/Images/logo.png';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Collapse, Divider, Grid, Table, Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress} from '@material-ui/core';
// import StudentProgressReport from '../../../../Dashboard/Contents/Reports/StudentProfile/Chunks/StudentProgressReport';
// import StudentProgressReport from './Chunks/StudentProgressReport';
import StudentProgressSingleSessionReport from './Chunks/StudentProgressSingleSessionReport';
import classnames from 'classnames';

const styles = (theme) => ({
    closeButton: {
        top: theme.spacing(1),
        right: theme.spacing(2),
        zIndex: 1,
        border: '1px solid #b43329',
        borderRadius: 5,
        position: 'fixed',
        padding: 3,
        '@media print': {
            display: 'none'
        }
    },
    bottomSpace: {
        marginBottom: 40,
        '@media print': {
            display: 'none'
        }
    },
    overlay: {
        display: 'flex',
        justifyContent: 'start',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'fixed',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.2)',
        zIndex: 2,
    },
    overlayContent: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '200px',
        color: 'white'
    },
    headerContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '-80px'
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: 20
    },
    title: {
        fontSize: 40,
        fontWeight: 'bolder',
        fontFamily: 'sans-serif',
        color: '#2f57a5',
        letterSpacing: 1,
    },
    subTitle: {
        fontSize: 20,
        textAlign: 'center',
        marginLeft: '-40px',
        fontWeight: 600,
        color: '#2f57a5',
    },
    tagTitleContainer: {
        display: 'flex',
        marginLeft: '38%',
        justifyContent: 'space-between'
    },
    tagTitleDoubleColumnContainer: {
        display: 'flex',
        marginTop: "1em",
        //marginLeft: '20%',
        justifyContent: 'space-evenly'
    },
    tagTitle: {
        padding: 6,
        marginBottom: 10,
        width: '100%',
        textAlign: 'center',
        fontSize: 'larger',
        backgroundColor: '#2f57a5',
        color: 'white',
        'WebkitPrintColorAdjust': 'exact',
        'colorAdjust': 'exact',
    },
    image: {
        height: 140,
        width: 130,
        border: '1px solid',
        marginLeft: 20,
        marginBottom: 10,
        textAlign: 'center',
        //marginTop: '-25px',
        marginTop: '-35px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        webkitPrintColorAdjust: 'exact',
        colorAdjust: 'exact',
    },
    flexColumn: {
        display: 'flex',
        flexDirection: 'column'
    },
    valuesContainer: {
        backgroundColor: 'rgb(47, 87, 165)',
        color: 'white',
        'WebkitPrintColorAdjust': 'exact',
        'colorAdjust': 'exact',
        padding: 6,
        marginTop: 10,
        marginBottom: 10,
    },
    tagValue: {
        border: '1px solid',
        paddingLeft: 15,
        paddingBottom: 7,
        paddingTop: 7,
        paddingRight: 15
    },
    value: {
        border: '1px solid',
        padding: 6,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        width: '28%',
        textAlign: 'Left',
        wordBreak: 'break-all',
    },
    fieldValuesContainer: {
        //marginLeft: '3%',
        margin: "0em 1em",
        display: 'flex',
        alignItems: 'flex-start',
    },
    collapseSectionHeader:{
        backgroundColor: 'rgb(47, 87, 165)',
        color: 'white',
        webkitPrintColorAdjust: 'exact',
        colorAdjust: 'exact',
        padding: 6,
        marginTop: 10,
        borderTopRightRadius: "0.5em",
        borderTopLeftRadius: "0.5em"
    },
    expand: {
        color:'white',
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
          duration: theme.transitions.duration.shortest,
        }),
      },
      expandOpen: {
        transform: 'rotate(180deg)',
      },
});


const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: "rgb(47, 87, 165)", //theme.palette.common.black,
      color: theme.palette.common.white,
      fontWeight: 500,
      border: '1px solid white'
    },
    body: {
      fontSize: 14,
      border: '1px solid rgb(29, 95, 152)'
    },
  }))(TableCell);
  
  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

  function AcademicSessionStudentAchievements(props){

    const { classes, data, isOpen } = props;
  
    const [state, setState] = useState({"expanded": isOpen });
    
    const handleExpandClick = () => {
      setState({expanded:!state.expanded});
    }
  
    return (
      <Grid item xs={12} >
        <Typography color="primary" component="div" style={{fontWeight: 600,fontSize:18, color:"rgb(47 87 165)"}}>
          <IconButton
            className={clsx(classes.expand, {[classes.expandOpen]: state.expanded,})}
            onClick={handleExpandClick}
            aria-expanded={state.expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon color="primary" style={{color:"rgb(47 87 165)"}}/>
          </IconButton>
          {data.sessionLabel}
          <Divider
            style={{
              backgroundColor: "rgb(47 87 165)", //"rgb(58, 127, 187)",
              opacity: "0.3",
              marginLeft: 50,
              marginTop: -10
            }}
          />
        </Typography>
        <Collapse in={state.expanded} timeout="auto" unmountOnExit>
          <div style={{paddingLeft:50}}>
            <TableContainer component={Paper}>
              <Table className={classes.table} size="small" aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center" style={{backgroundColor:"rgb(47 87 165)"}}>Module</StyledTableCell>
                    <StyledTableCell align="center" style={{backgroundColor:"rgb(47 87 165)"}}>Courses</StyledTableCell>
                    <StyledTableCell align="center" style={{backgroundColor:"rgb(47 87 165)"}}>Original Marks</StyledTableCell>
                    <StyledTableCell align="center" style={{backgroundColor:"rgb(47 87 165)"}}>Resit Marks</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    {data.achivementDetail.length > 0 ?
                      data.achivementDetail.map((dt, i) => (
                        <StyledTableRow key={"row"+data.sessionLabel+i}>
                          <StyledTableCell component="th" scope="row" align="center" style={{borderColor:"rgb(47 87 165)"}}>{dt.moduleNumber}</StyledTableCell>
                          <StyledTableCell scope="row" align="center" style={{borderColor:"rgb(47 87 165)"}}>{dt.coursesObject.Label}</StyledTableCell>
                          <StyledTableCell scope="row" align="center" style={{borderColor:"rgb(47 87 165)"}}>{dt.marks}</StyledTableCell>
                          <StyledTableCell scope="row" align="center" style={{borderColor:"rgb(47 87 165)"}}>{dt.resetMarks}</StyledTableCell>
                        </StyledTableRow>
                      ))
                    :
                    this.state.isLoading ?
                      <StyledTableRow>
                        <StyledTableCell component="th" scope="row" colSpan={4}><center><CircularProgress/></center></StyledTableCell>
                      </StyledTableRow>
                      :
                      <StyledTableRow>
                        <StyledTableCell component="th" scope="row" colSpan={4}><center><b>No Data</b></center></StyledTableCell>
                      </StyledTableRow>
                    }
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Collapse>
      </Grid>
    );
  }

  function EnrolledCourses(props){

    const { classes, data, isOpen } = props;
  
    const [state, setState] = useState({"expanded": isOpen });
    
    const handleExpandClick = () => {
      setState({expanded:!state.expanded});
    }
  
    return (
      <Grid item xs={12} >
        <Typography color="primary" component="div" style={{fontWeight: 600,fontSize:18, color:"rgb(47 87 165)"}}>
          <IconButton
            className={clsx(classes.expand, {[classes.expandOpen]: state.expanded,})}
            onClick={handleExpandClick}
            aria-expanded={state.expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon color="primary" style={{color:"rgb(47 87 165)"}}/>
          </IconButton>
          {data.sessionLabel}
          <Divider
            style={{
              backgroundColor: "rgb(47 87 165)", //"rgb(58, 127, 187)",
              opacity: "0.3",
              marginLeft: 50,
              marginTop: -10
            }}
          />
        </Typography>
        <Collapse in={state.expanded} timeout="auto" unmountOnExit>
          <div style={{paddingLeft:50}}>
            <div style={{
                marginLeft: '3%',
                marginTop: '2%',
                marginBottom: '1%',
                display: 'flex'
            }}>
                {data.enrolledCourses.map((item, index) => {
                    return (
                        <span key={index} className={classes.tagValue} style={{
                            marginRight: 15
                        }}>{item.courseLabel}</span>
                    );
                })}
            </div>
          </div>
        </Collapse>
      </Grid>
    );
  }


  function AllCategoriesYearWise(props){

    const { classes, data, isOpen } = props;
  
    const [state, setState] = useState({expanded: false });
    
    const handleExpandClick = () => {
      setState({expanded:!state.expanded});
    }
  
    return (
      <Grid item xs={12} >
        <Typography color="primary" component="div" style={{color:"rgb(47 87 165)"}}>
          <div className={classes.collapseSectionHeader}>
            <span style={{fontSize: 'large'}}>
               {data.sessionLabel}
            </span>
            <span style={{float:"right"}}>
                <IconButton
                    className={clsx(classes.expand, {[classes.expandOpen]: state.expanded,})}
                    onClick={handleExpandClick}
                    aria-expanded={state.expanded}
                    aria-label="show more"
                    size='small'
                >
                    <ExpandMoreIcon />
                </IconButton>
            </span>
        </div>
        </Typography>
        <Collapse in={state.expanded} timeout="auto" unmountOnExit>
          <div 
            style={{
                paddingLeft:"1em",
                marginTop:10
            }}
          >
          {/*
          {data.enrolledCoursesTitle}
          <Divider
            style={{
            backgroundColor: "rgb(47 87 165)", //"rgb(58, 127, 187)",
            opacity: "0.3",
            marginLeft: "1em",
            marginRight: "1em",
            marginTop: 10
            }}
          />
            <div 
                style={{
                    marginLeft: '3%',
                    marginTop: 10,
                    marginBottom: '1%',
                    display: 'flex'
                }}
            >
                {data.enrolledCourses.map((item, index) => {
                    return (
                        <span 
                            key={index} 
                            className={classes.tagValue} 
                            style={{
                                marginRight: 15
                            }}
                        >
                            {item.courseLabel}
                        </span>
                    );
                })}
            </div>
            {data.enrolledSectionsTitle}
            <Divider
                style={{
                backgroundColor: "rgb(47 87 165)", //"rgb(58, 127, 187)",
                opacity: "0.3",
                marginLeft: "1em",
                marginTop: 10,
                marginBottom: '1em',
                }}
            />
            <div style={{
                marginLeft: '1em',
                marginTop: '1em',
                marginBottom: '1em',
                display: 'flex'
            }}>
            {data.enrolledSections.map((item, index) => {
                return (
                    <span key={index} className={classes.tagValue} style={{
                        marginRight: 15
                    }}>{item.sectionLabel}</span>
                );
            })}
            </div>
            */}
            {data.studentProgressReportTitle}
            <Divider
                style={{
                backgroundColor: "rgb(47 87 165)", //"rgb(58, 127, 187)",
                opacity: "0.3",
                marginLeft: "1em",
                marginTop: 10
                }}
            />
            {data.studentProgressReport.map((data1, index)=> 
                <StudentProgressSingleSessionReport 
                    key={"studentProgressReportt"+data1.academicsSessionLabel+index}
                    data={[data1]}
                    //isOpen={ 0==0 ? true : false}
                />
            )}
            {/*
            {data.achivementDetailTitle}
            <Divider
                style={{
                    backgroundColor: "rgb(47 87 165)", //"rgb(58, 127, 187)",
                    opacity: "0.3",
                    marginLeft: "1em",
                    marginTop: 10,
                    marginBottom: '1em',
                }}
            />
             <TableContainer component={Paper}>
              <Table className={classes.table} size="small" aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center" style={{backgroundColor:"rgb(47 87 165)"}}>Module</StyledTableCell>
                    <StyledTableCell align="center" style={{backgroundColor:"rgb(47 87 165)"}}>Courses</StyledTableCell>
                    <StyledTableCell align="center" style={{backgroundColor:"rgb(47 87 165)"}}>Original Marks</StyledTableCell>
                    <StyledTableCell align="center" style={{backgroundColor:"rgb(47 87 165)"}}>Resit Marks</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    {
                      data.achivementDetail.map((dt, i) => (
                        <StyledTableRow key={"row"+data.sessionLabel+i}>
                          <StyledTableCell component="th" scope="row" align="center" style={{borderColor:"rgb(47 87 165)"}}>{dt.moduleNumber}</StyledTableCell>
                          <StyledTableCell scope="row" align="center" style={{borderColor:"rgb(47 87 165)"}}>{dt.coursesObject.Label}</StyledTableCell>
                          <StyledTableCell scope="row" align="center" style={{borderColor:"rgb(47 87 165)"}}>{dt.marks}</StyledTableCell>
                          <StyledTableCell scope="row" align="center" style={{borderColor:"rgb(47 87 165)"}}>{dt.resetMarks}</StyledTableCell>
                        </StyledTableRow>
                      ))
                  
                    }
                </TableBody>
              </Table>
            </TableContainer>
            */}
           {/*
           <div
                style={{
                    marginTop: '1%',
                    marginBottom: '1%',
                }}
            >
            {data.assignmentSubmittedListTitle}
           </div>
            <Divider
                style={{
                    backgroundColor: "rgb(47 87 165)", //"rgb(58, 127, 187)",
                    opacity: "0.3",
                    marginLeft: "1em",
                    marginTop: '10',
                    marginBottom: '1em',
                }}
            />
            {data.assignmentSubmittedList.length ? 
				<TableContainer component={Paper}>
					<Table size="small" aria-label="customized table">
						<TableHead>
							<TableRow>
								<StyledTableCell align="center" style={{ borderLeft: '1px solid rgb(47, 87, 165)' }}>Title</StyledTableCell>
								<StyledTableCell align="center">Section</StyledTableCell>
								<StyledTableCell align="center">Marks</StyledTableCell>
								<StyledTableCell align="center" style={{ borderRight: '1px solid rgb(47, 87, 165)' }}>Remarks</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
						{data.assignmentSubmittedList.map((item, index)=>
							<StyledTableRow key={index}>
								<StyledTableCell component="th" scope="row">{item.assignmentLabel}</StyledTableCell>
								<StyledTableCell align="center">{item.sectionLabel}</StyledTableCell>
								<StyledTableCell align="center">{item.marks}</StyledTableCell>
								<StyledTableCell align="center">{item.remarks}</StyledTableCell>
							</StyledTableRow>
						)} 
						</TableBody>
					</Table>
				</TableContainer>
				:
				""
				}
            */}
          </div>
        </Collapse>
      </Grid>
    );
  }

  function EnrolledSections(props){

    const { classes, data, isOpen } = props;
  
    const [state, setState] = useState({"expanded": isOpen });
    
    const handleExpandClick = () => {
      setState({expanded:!state.expanded});
    }
  
    return (
      <Grid item xs={12} >
        <Typography color="primary" component="div" style={{fontWeight: 600,fontSize:18, color:"rgb(47 87 165)"}}>
          <IconButton
            className={clsx(classes.expand, {[classes.expandOpen]: state.expanded,})}
            onClick={handleExpandClick}
            aria-expanded={state.expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon color="primary" style={{color:"rgb(47 87 165)"}}/>
          </IconButton>
          {data.sessionLabel}
          <Divider
            style={{
              backgroundColor: "rgb(47 87 165)", //"rgb(58, 127, 187)",
              opacity: "0.3",
              marginLeft: 50,
              marginTop: -10
            }}
          />
        </Typography>
        <Collapse in={state.expanded} timeout="auto" unmountOnExit>
          <div style={{paddingLeft:50}}>
            <div style={{
                marginLeft: '3%',
                marginTop: '2%',
                marginBottom: '1%',
                display: 'flex'
            }}>
                {data.enrolledSections.map((item, index) => {
                    return (
                        <span key={index} className={classes.tagValue} style={{
                            marginRight: 15
                        }}>{item.sectionLabel}</span>
                    );
                })}
            </div>
          </div>
        </Collapse>
      </Grid>
    );
  }


  function AssignmentsSubmmited(props){

    const { classes, data, isOpen } = props;
  
    const [state, setState] = useState({"expanded": isOpen });
    
    const handleExpandClick = () => {
      setState({expanded:!state.expanded});
    }
  
    return (
      <Grid item xs={12} >
        <Typography color="primary" component="div" style={{fontWeight: 600,fontSize:18, color:"rgb(47 87 165)"}}>
          <IconButton
            className={clsx(classes.expand, {[classes.expandOpen]: state.expanded,})}
            onClick={handleExpandClick}
            aria-expanded={state.expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon color="primary" style={{color:"rgb(47 87 165)"}}/>
          </IconButton>
          {data.sessionLabel}
          <Divider
            style={{
              backgroundColor: "rgb(47 87 165)", //"rgb(58, 127, 187)",
              opacity: "0.3",
              marginLeft: 50,
              marginTop: -10
            }}
          />
        </Typography>
        <Collapse in={state.expanded} timeout="auto" unmountOnExit>
			<div style={{
				marginLeft: '3%',
				marginRight: '3%',
				marginTop: '2%',
				marginBottom: '1%',
				display: 'flex'
			}}>
				{data.assignmentSubmittedList.length ? 
				<TableContainer component={Paper}>
					<Table size="small" aria-label="customized table">
						<TableHead>
							<TableRow>
								<StyledTableCell align="center" style={{ borderLeft: '1px solid rgb(47, 87, 165)' }}>Title</StyledTableCell>
								<StyledTableCell align="center">Section</StyledTableCell>
								<StyledTableCell align="center">Marks</StyledTableCell>
								<StyledTableCell align="center" style={{ borderRight: '1px solid rgb(47, 87, 165)' }}>Remarks</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
						{data.assignmentSubmittedList.map((item, index)=>
							<StyledTableRow key={index}>
								<StyledTableCell component="th" scope="row">{item.assignmentLabel}</StyledTableCell>
								<StyledTableCell align="center">{item.sectionLabel}</StyledTableCell>
								<StyledTableCell align="center">{item.marks}</StyledTableCell>
								<StyledTableCell align="center">{item.remarks}</StyledTableCell>
							</StyledTableRow>
						)} 
						</TableBody>
					</Table>
				</TableContainer>
				:
				""
				}
			</div>
     </Collapse>
      </Grid>
    );
  }

//   function YearEndStatus(props){

//     const { classes, data, isOpen } = props;
  
//     const [state, setState] = useState({"expanded": isOpen });
    
//     const handleExpandClick = () => {
//       setState({expanded:!state.expanded});
//     }
  
//     return (
//       <Grid item xs={12} >
//         <Typography color="primary" component="div" style={{fontWeight: 600,fontSize:18, color:"rgb(47 87 165)"}}>
//           <IconButton
//             className={clsx(classes.expand, {[classes.expandOpen]: state.expanded,})}
//             onClick={handleExpandClick}
//             aria-expanded={state.expanded}
//             aria-label="show more"
//           >
//             <ExpandMoreIcon color="primary" style={{color:"rgb(47 87 165)"}}/>
//           </IconButton>
//           {data.sessionLabel}
//           <Divider
//             style={{
//               backgroundColor: "rgb(47 87 165)", //"rgb(58, 127, 187)",
//               opacity: "0.3",
//               marginLeft: 50,
//               marginTop: -10
//             }}
//           />
//         </Typography>
//         <Collapse in={state.expanded} timeout="auto" unmountOnExit>
//           <div style={{paddingLeft:50}}>
//             <TableContainer component={Paper}>
//               <Table className={classes.table} size="small" aria-label="customized table">
//                 <TableHead>
//                   <TableRow>
//                     <StyledTableCell align="center" style={{backgroundColor:"rgb(47 87 165)"}}>Module</StyledTableCell>
//                     <StyledTableCell align="center" style={{backgroundColor:"rgb(47 87 165)"}}>Courses</StyledTableCell>
//                     <StyledTableCell align="center" style={{backgroundColor:"rgb(47 87 165)"}}>Original Marks</StyledTableCell>
//                     <StyledTableCell align="center" style={{backgroundColor:"rgb(47 87 165)"}}>Resit Marks</StyledTableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {data.endStatusArray.length > 0 ?
//                       data.endStatusArray.map((dt, i) => (
//                         <StyledTableRow key={"row"+data.sessionLabel+i}>
//                           <StyledTableCell component="th" scope="row" align="center" style={{borderColor:"rgb(47 87 165)"}}>{dt.moduleNumber}</StyledTableCell>
//                           <StyledTableCell scope="row" align="center" style={{borderColor:"rgb(47 87 165)"}}>{dt.coursesObject.Label}</StyledTableCell>
//                           <StyledTableCell scope="row" align="center" style={{borderColor:"rgb(47 87 165)"}}>{dt.marks}</StyledTableCell>
//                           <StyledTableCell scope="row" align="center" style={{borderColor:"rgb(47 87 165)"}}>{dt.resetMarks}</StyledTableCell>
//                         </StyledTableRow>
//                       ))
//                     :
//                     this.state.isLoading ?
//                       <StyledTableRow>
//                         <StyledTableCell component="th" scope="row" colSpan={4}><center><CircularProgress/></center></StyledTableCell>
//                       </StyledTableRow>
//                       :
//                       <StyledTableRow>
//                         <StyledTableCell component="th" scope="row" colSpan={4}><center><b>No Data</b></center></StyledTableCell>
//                       </StyledTableRow>
//                     }
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </div>
//         </Collapse>
//       </Grid>
//     );
//   }
class DisplayAdmissionApplications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            documentData: [],
            data: {},
            isLoading: false,
            isLoginMenu: false,
            isReload: false,
            tableData: [],
            totalPOS: "_ _",
            totalAchieved: "_ _",
            totalPercentage: "_ _",
            resultClassification: "_ _ _",
            studentProgressReport: [],
            uolEnrollmentMarks: [],
            tableHeaderData: [],
            tableData: [],
            uolAllAchived: [],
            yearEndStatus: [],
            achivementDetail: [],
            isTrue: false,
            expanded: [false,false,false,false,false,false,false,false]
        }
    }

    handleChange=()=>{
        this.setState({
            isTrue: !this.state.isTrue,
        });
    }

    studentAttendanceData = async (id) => {
        this.setState({ isLoading: true });
        let data = new FormData();
        data.append("studentId", id);
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C48CommonStudentsAttendanceView`;
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
          .then( (json) => {
              if (json.CODE === 1) {
                this.setState({ tableData: json.DATA || [] });
                //console.log(this.state.tableData);
              } else {
                //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
                this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
              }
              //console.log("getData", json);
            },
            (error) => {
              if (error.status === 401) {
                this.setState({
                  isLoginMenu: true,
                  isReload: true,
                });
              } else {
                //alert('Failed to fetch, Please try again later.');
                this.handleOpenSnackbar("Failed to fetch, Please try again later.","error");
                console.log(error);
              }
            }
          );
        //this.setState({ isLoading: false });
      };

    getAddmissionForm = async (id) => {
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C48AdmissionsProspectApplicationSubmittedApplicationsStudentProfileView?studentId=${id}`;
        this.setState({isLoading: true});
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclAdminToken")
            })
        })
        .then(res => {
            if (!res.ok) {
                throw res;
            }
            return res.json();
        })
        .then( json => {
            if (json.CODE === 1) {
                let studentProgressReport = json.DATA[0].studentProgressAllSessionsReport || [];
                this.setState({studentProgressReport: studentProgressReport});
                //console.log("studentProgressReport", studentProgressReport);
                let uolEnrollmentMarks = json.DATA[0].uolEnrollmentMarks || [];
                this.setState({uolEnrollmentMarks: uolEnrollmentMarks});
                //console.log("uolEnrollmentMarks", uolEnrollmentMarks);
                let uolAllAchived = json.DATA[0].uolAllAchived || [];
                this.setState({uolAllAchived: uolAllAchived});
                let yearEndStatus = json.DATA[0].yearEndStatus || [];
                this.setState({yearEndStatus: yearEndStatus});
                if (json.DATA) {
                    if (json.DATA.length > 0) {
                        this.setState({
                            data: json.DATA[0] || {},
                        });
                    }
                }
                //Start
                // let tableHeaderData = [];
                // let attendanceRecordCol = ["Del", "Att", "%Att", "Credits"];
                // tableHeaderData = tableHeaderData.concat(attendanceRecordCol);
                // let assignmentGraders = ["1", "2", "3", "4", "5", "6", "7", "8", "Credits"];
                // tableHeaderData = tableHeaderData.concat(assignmentGraders);
                // let seminarGrades = ["1", "2", "Credits"];
                // tableHeaderData = tableHeaderData.concat(seminarGrades);
                // let subjectiveEvalGradesCol = ["1", "2","3", "4", "Credits"];
                // tableHeaderData = tableHeaderData.concat(subjectiveEvalGradesCol);
                // let examMarksCol = ["1", "2", "Credits"];
                // tableHeaderData = tableHeaderData.concat(examMarksCol);
                // let creditsCol = ["Poss", "Ach", "%Age"];
                // tableHeaderData = tableHeaderData.concat(creditsCol);
                // this.setState({tableHeaderData: tableHeaderData});

                // let tableData = [];
                // let data = json.DATA[0].studentProgressReport || [];
                // let dataLength = data.length;
                // if(dataLength){
                //   this.setState({
                //     studentLabel: data[0].studentLabel,
                //     programmeLabel: data[0].programmeLabel,
                //     academicSessionLabel: data[0].academicsSessionLabel,
                //     // uptoDate: this.getDateInString(),
                //     totalPOS: data[0].totalPOS,
                //     totalAchieved: data[0].totalAchieved,
                //     totalPercentage: data[0].totalPercentage,
                //     resultClassification:  data[0].resultClassification,
                //   });
                //   let coursesData = data[0].studentCoursesData || [];
                //   let coursesDataLength = coursesData.length;
                //   if(coursesDataLength){
                //     for(let i=0; i<coursesDataLength; i++){
                //       let tableDataRow = [];
                //       tableDataRow.push(coursesData[i].courseLabel);  // col-1
                //       let attendance = coursesData[i].attendance[0];
                //       tableDataRow.push(attendance.deliveredLectures);  // col-2
                //       tableDataRow.push(attendance.attendenedlectures);  // col-3
                //       tableDataRow.push(attendance.attandancePercentage);  // col-4
                //       tableDataRow.push(attendance.attandanceCredit);  // col-5
                //       let assignment = coursesData[i].assignment;
                //       assignment.map((data, index) =>
                //         data.grade ? tableDataRow.push(data.grade) : tableDataRow.push(data.credit) // col-6 => col-14
                //       );
                //       let seminarEvaluation = coursesData[i].seminarEvaluation;
                //       seminarEvaluation.map((data, index) =>
                //         data.grade ? tableDataRow.push(data.grade) : tableDataRow.push(data.totalCredits) // col-15 => col-17
                //       );
                //       let subjectiveEvaluation = coursesData[i].subjectiveEvaluation;
                //       subjectiveEvaluation.map((data, index) =>
                //         data.grade ? tableDataRow.push(data.grade) : tableDataRow.push(data.totalCredits) // col-18 => col-22
                //       );
                //       let examsEvaluation = coursesData[i].examsEvaluation;
                //       examsEvaluation.map((data, index) =>
                //         data.marks ? tableDataRow.push(data.marks) : tableDataRow.push(data.totalCredits) // col-23 => col-25
                //       );
                //       let credits = coursesData[i].credits[0];
                //       tableDataRow.push(credits.poss); // col-26
                //       tableDataRow.push(credits.achieved); // col-27
                //       tableDataRow.push(credits.totalCredits); // col-28
                //       let transcriptGrade = coursesData[i].internalGrade[0].grade;
                //       tableDataRow.push(transcriptGrade); // col-29
                //       tableData[i] = tableDataRow; 
                //     }
                //   }
                //   this.setState({tableData: tableData});
                // }          
                //End
            } else {
                alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE)
            }
            //console.log(json);
        },
        error => {
            if (error.status === 401) {
                this.setState({
                    isLoginMenu: true,
                    isReload: true
                })
            } else {
                alert('Failed to fetch, Please try again later.');
                console.log(error);
            }
        });

        this.setState({isLoading: false});

    }

    handleExpandClick = (index) => {
        let expanded = [...this.state.expanded];
        expanded[index] = !expanded[index];
        this.setState({expanded});
    };

    componentDidMount() {
        const { id = 0 } = this.props.match.params;
        this.getAddmissionForm(id);
        this.studentAttendanceData(id);
    }

    render() {
        const { classes } = this.props;
        const { data } = this.state;
        const { studentProgressReport } = data;
        const { allCategoriesYearWise = [],enrolledCourses = [], enrolledSections = [], assignmentsSubmitted=[], gradedDiscussionsBoard=[], studentAttendance=[], uolEnrollmentMarks=[], uolAllAchived=[], yearEndStatus=[], studentStatusSummary=[]} = data;
        return (
            <Fragment>
                {/* 
                {this.state.isLoading &&
                    <div className={classes.overlay}>
                        <div className={classes.overlayContent}>
                            <CircularProgress style={{ marginBottom: 10, color: 'white' }} size={36} />
                            <span>Loading...</span>
                        </div>
                    </div>
                } 
                */}
                <div 
                    style={{
                        margin:"10px 10px 0px 10px"
                    }}
                >
                    <IconButton onClick={() => window.close()} aria-label="close" className={classes.closeButton}>
                        <CloseIcon color="secondary"/>
                    </IconButton>
                    <div className={classes.headerContainer}>
                        <img alt="" src={Logo} width={100} />
                        <div className={classes.titleContainer}>
                            <span className={classes.title}>Universal College Lahore</span>
                            <span className={classes.subTitle}>(a project of UCL pvt Ltd)</span>
                        </div>
                    </div>
                    <div className={classes.tagTitleDoubleColumnContainer}>
                        <div className={classes.flexColumn} style={this.state.isLoading ? { width:"14em"} : null}>
                            <span className={classes.tagTitle}>{this.state.isLoading ? <LinearProgress style={{height:24}} /> : <span>{data.degreeLabel || "N/A"}</span> }</span>
                            <span className={classes.tagTitle}>{this.state.isLoading ? <LinearProgress style={{height:24}} /> : <span>Joining Date: {data.joiningDate || "--/--/----" }</span> }</span>
                            <span className={classes.tagTitle}>{this.state.isLoading ? <LinearProgress style={{height:24}} /> : <span>{data.isActive==1? "Active": "Deactive"}</span> }</span>
                        </div>
                        <div className={classes.flexColumn} style={this.state.isLoading ? { width:"14em"} : null}>
                            <span className={classes.tagTitle}>{this.state.isLoading ? <LinearProgress style={{height:24}} /> : <span>Uol #: {data.uolNumber || "N/A"}</span> }</span>
                            <span className={classes.tagTitle}>{this.state.isLoading ? <LinearProgress style={{height:24}} /> : <span>Last Attended Date: {data.lastAttendedDate || "--/--/----" }</span> }</span>
                            {data.isActive==0 && data.statusChangeReason!==""?
                                <span className={classes.tagTitle}>Reason: { data.statusChangeReason}</span>
                                :
                                ""
                            }
                        </div>
                        <div className={classes.flexColumn} style={this.state.isLoading ? { width:"14em"} : null}>
                            <span className={classes.tagTitle}>{this.state.isLoading ? <LinearProgress style={{height:24}} /> : <span>Nucleus ID: {data.studentId || "N/A"}</span> }</span>
                            <span className={classes.tagTitle}>{this.state.isLoading ? <LinearProgress style={{height:24}} /> : <span>Exit Date: {data.exitDate || "--/--/----"} </span> }</span>
                            {data.isActive==0 && data.statusChangeDate!==""?
                                <span className={classes.tagTitle}>Deactived On: {data.statusChangeDate}</span>
                                :
                                ""
                            }
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "column"
                        }}>
                        <div className={classes.image} style={{
                            backgroundImage: `url(${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C01AdmissionsProspectApplicationImageView?fileName=${data.imageName})`,
                        }}>
                        </div>    
                        <span className={classes.tagTitle}>{this.state.isLoading ? <LinearProgress style={{ height: 24}} /> : <span>{data.displayName || "N/A"}</span> }</span>
                        </div>
                        
                    </div>
                    <div className={classes.flexColumn}>
                        <div className={classes.collapseSectionHeader}>
                            <span style={{
                                fontSize: 'larger'
                            }}>
                                Account Active / Inactive Summary
                            </span>
                            <span
                                style={{
                                    float: "right"
                                }}
                            >
                                { 
                                this.state.isLoading ? <CircularProgress style={{color:'white', marginTop:4, marginRight:8}} size={18} /> 
                                :
                                <IconButton
                                    size='small'
                                    className={classnames(classes.expand, {[classes.expandOpen]:this.state.expanded[8]})}
                                    onClick={()=>this.handleExpandClick(8)}
                                    aria-expanded={this.state.expanded[8]}
                                    aria-label="Show more"
                                >
                                    <ExpandMoreIcon />
                                </IconButton>
                                }
                            </span>
                        </div>
                        <Collapse in={this.state.expanded[8]} timeout="auto" unmountOnExit>
                            <div style={{margin:"1em"}}>
                                <Typography variant='body1' color='primary'>Status Logs</Typography>
                                <Divider
                                    style={{
                                    backgroundColor: "rgb(47 87 165)", //"rgb(58, 127, 187)",
                                    opacity: "0.3",
                                    marginLeft: "1em",
                                    marginTop: 10,
                                    marginBottom: '1em',
                                    }}
                                />
                                <TableContainer component={Paper}>
                                    <Table className={classes.table} size="small" aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="center" style={{backgroundColor:"rgb(47 87 165)"}}>Session</StyledTableCell>
                                                <StyledTableCell align="center" style={{backgroundColor:"rgb(47 87 165)"}}>Status</StyledTableCell>
                                                <StyledTableCell align="center" style={{backgroundColor:"rgb(47 87 165)"}}>Changed On</StyledTableCell>
                                                <StyledTableCell align="center" style={{backgroundColor:"rgb(47 87 165)"}}>Changed By</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {studentStatusSummary.map((dt, i) => (
                                            <StyledTableRow key={"studentStatusSummaryDetail"+i}>
                                            <StyledTableCell component="th" scope="row" align="center" style={{borderColor:"rgb(47 87 165)"}}>{dt.sessionLabel}</StyledTableCell>
                                            <StyledTableCell scope="row" align="center" style={{borderColor:"rgb(47 87 165)"}}>{dt.isActive ? "Active":"Inactive"}</StyledTableCell>
                                            <StyledTableCell scope="row" align="center" style={{borderColor:"rgb(47 87 165)"}}>{dt.isActive ? dt.activatedOnDisplay : dt.deactivatedOnDisplay}</StyledTableCell>
                                            <StyledTableCell scope="row" align="center" style={{borderColor:"rgb(47 87 165)"}}>{dt.activatedByLabel}</StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer> 
                                <br/>
                            </div>
                        </Collapse>
                        <div className={classes.collapseSectionHeader}>
                            <span style={{
                                fontSize: 'larger'
                            }}>
                                UOL Achievment
                            </span>
                            <span
                                style={{
                                    float: "right"
                                }}
                            >
                                { 
                                this.state.isLoading ? <CircularProgress style={{color:'white', marginTop:4, marginRight:8}} size={18} /> 
                                :
                                <IconButton
                                    size='small'
                                    className={classnames(classes.expand, {[classes.expandOpen]:this.state.expanded[7]})}
                                    onClick={()=>this.handleExpandClick(7)}
                                    aria-expanded={this.state.expanded[7]}
                                    aria-label="Show more"
                                >
                                    <ExpandMoreIcon />
                                </IconButton>
                                }
                            </span>
                        </div>
                        <Collapse in={this.state.expanded[7]} timeout="auto" unmountOnExit>
                        <div style={{margin:"1em"}}>
                            {allCategoriesYearWise.map( (data, index) =>
                            <Fragment key={"allCategoriesYearWise"+index}>
                            {/* <div>{data.achivementDetailTitle+" "+data.sessionLabel}</div> */}
                            <Typography variant='body1' color='primary'>{data.sessionLabel}</Typography>
                            <Divider
                              style={{
                                backgroundColor: "rgb(47 87 165)", //"rgb(58, 127, 187)",
                                opacity: "0.3",
                                marginLeft: "1em",
                                marginTop: 10,
                                marginBottom: '1em',
                              }}
                            />
                               <TableContainer component={Paper}>
                                <Table className={classes.table} size="small" aria-label="customized table">
                                  <TableHead>
                                    <TableRow>
                                      <StyledTableCell align="center" style={{backgroundColor:"rgb(47 87 165)"}}>Module</StyledTableCell>
                                      <StyledTableCell align="center" style={{backgroundColor:"rgb(47 87 165)"}}>Courses</StyledTableCell>
                                      <StyledTableCell align="center" style={{backgroundColor:"rgb(47 87 165)"}}>Original Marks</StyledTableCell>
                                      <StyledTableCell align="center" style={{backgroundColor:"rgb(47 87 165)"}}>Resit Marks</StyledTableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                        {data.achivementDetail.map((dt, i) => (
                                          <StyledTableRow key={"achivementDetail"+i}>
                                            <StyledTableCell component="th" scope="row" align="center" style={{borderColor:"rgb(47 87 165)"}}>{dt.moduleNumber}</StyledTableCell>
                                            <StyledTableCell scope="row" align="center" style={{borderColor:"rgb(47 87 165)"}}>{dt.coursesObject.Label}</StyledTableCell>
                                            <StyledTableCell scope="row" align="center" style={{borderColor:"rgb(47 87 165)"}}>{dt.marks}</StyledTableCell>
                                            <StyledTableCell scope="row" align="center" style={{borderColor:"rgb(47 87 165)"}}>{dt.resetMarks}</StyledTableCell>
                                          </StyledTableRow>
                                        ))}
                                  </TableBody>
                                </Table>
                              </TableContainer> 
                              <br/>
                              </Fragment>
                            )}
                        </div>
                        </Collapse>
                        <Fragment>
                          <div>
                          {allCategoriesYearWise.map( (data, index) =>
                            <AllCategoriesYearWise 
                                key={"allCategoriesYearWise"+index}
                                classes={classes}
                                data={data}
                                isOpen={ index==0 ? true : false}
                            />
                            )}
                           </div>     
                        </Fragment>
                        <div className={classes.collapseSectionHeader}>
                            <span style={{
                                fontSize: 'larger'
                            }}>
                                Personal Information
                            </span>
                            <span
                                style={{
                                    float: "right"
                                }}
                            >
                                { 
                                this.state.isLoading ? <CircularProgress style={{color:'white', marginTop:4, marginRight:8}} size={18} /> 
                                :
                                <IconButton
                                    size='small'
                                    className={classnames(classes.expand, {[classes.expandOpen]:this.state.expanded[0]})}
                                    onClick={()=>this.handleExpandClick(0)}
                                    aria-expanded={this.state.expanded[0]}
                                    aria-label="Show more"
                                >
                                    <ExpandMoreIcon />
                                </IconButton>
                                }
                            </span>
                        </div>
                        <Collapse in={this.state.expanded[0]} timeout="auto" unmountOnExit>
                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                Admission Session
                           </div>
                            <div style={{
                                textAlign: `${data.admissionSessionLabel ? 'left' : 'center'}`
                            }} className={classes.value}>
                                {data.admissionSessionLabel || "-"}
                            </div>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                marginLeft: 15,
                                textAlign: 'center'
                            }}>
                               Current Session
                           </div>
                            <div style={{
                                textAlign: `${data.sessionLabel ? 'left' : 'center'}`
                            }} className={classes.value}>
                                {data.sessionLabel || "-"}
                            </div>
                        </div>
                        {/* 
                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                Joining Date
                           </div>
                            <div style={{
                                textAlign: `${data.joiningDate ? 'left' : 'center'}`
                            }} className={classes.value}>
                                {data.joiningDate || "-"}
                            </div>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                marginLeft: 15,
                                textAlign: 'center'
                            }}>
                               Exit Date
                           </div>
                            <div style={{
                                textAlign: `${data.exitDate ? 'left' : 'center'}`
                            }} className={classes.value}>
                                {data.exitDate || "-"}
                            </div>
                        </div>    
                        */}
                        <div className={classes.fieldValuesContainer} >
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                Name
                           </div>
                            <div className={classes.value} style={{
                                width: '8.5%',
                                textAlign: `${data.firstName ? 'left' : 'center'}`
                            }}>
                                {data.firstName || "-"}
                            </div>
                            <div className={classes.value} style={{
                                width: '7%',
                                textAlign: `${data.middleName ? 'left' : 'center'}`
                            }}>
                                {data.middleName || '-'}
                            </div>
                            <div className={classes.value} style={{
                                width: '8.5%',
                                textAlign: `${data.lastName ? 'left' : 'center'}`
                            }}>
                                {data.lastName || "-"}
                            </div>
                            <div 
                                className={classes.valuesContainer}
                                style={{
                                    width: '20%',
                                    marginLeft: 15,
                                    textAlign: 'center'
                                }}
                            >
                                Name as per CNIC/Passport
                           </div>
                            <div className={classes.value} style={{
                                // width: '30%',
                                textAlign: `${data.displayName ? 'left' : 'center'}`
                            }}>
                                {data.displayName || "-"}
                            </div>
                        </div>
                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                Date of Birth
                           </div>
                            <div style={{
                                textAlign: `${data.dateOfBirth ? 'left' : 'center'}`
                            }} className={classes.value}>
                                {data.dateOfBirth || "-"}
                            </div>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                marginLeft: 15,
                                textAlign: 'center'
                            }}>
                                Gender
                           </div>
                            <div style={{
                                textAlign: `${data.genderLabel ? 'left' : 'center'}`
                            }} className={classes.value}>
                                {data.genderLabel || "-"}
                            </div>
                        </div>

                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                Nationality
                           </div>
                            <div style={{
                                textAlign: `${data.nationalityLabel ? 'left' : 'center'}`
                            }} className={classes.value}>
                                {data.nationalityLabel || "-"}
                            </div>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                marginLeft: 15,
                                textAlign: 'center'
                            }}>
                                {data.studentIdentityTypeLabel || 'CNIC'}
                            </div>
                            <div style={{
                                textAlign: `${data.studentIdentityNo ? 'left' : 'center'}`
                            }} className={classes.value}>
                                {data.studentIdentityNo || "-"}
                            </div>
                        </div>

                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                Mobile Number
                           </div>
                            <div style={{
                                textAlign: `${data.mobileNo ? 'left' : 'center'}`
                            }} className={classes.value}>
                                {data.mobileNo || "-"}
                            </div>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                marginLeft: 15,
                                textAlign: 'center'
                            }}>
                                Email
                           </div>
                            <div style={{
                                textAlign: `${data.email ? 'left' : 'center'}`
                            }} className={classes.value}>
                                {data.email || "-"}
                            </div>
                        </div>
                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                Blood Group
                           </div>
                            <div style={{
                                textAlign: `${data.bloodGroupLabel ? 'left' : 'center'}`
                            }} className={classes.value}>
                                {data.bloodGroupLabel || "-"}
                            </div>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                marginLeft: 15,
                                textAlign: 'center'
                            }}>
                                Marital Status
                           </div>
                            <div style={{
                                textAlign: `${data.maritalStatusLabel ? 'left' : 'center'}`
                            }} className={classes.value}>
                                {data.maritalStatusLabel || "-"}
                            </div>
                            {/* <div className={classes.valuesContainer} style={{
                                width: '20%',
                                marginLeft: 15,
                                textAlign: 'center'
                            }}>
                                 Suffering from any medical condition/allergies
                           </div>
                            <div style={{
                                textAlign: `${data.maritalStatusLabel ? 'left' : 'center'}`
                            }} className={classes.value}>
                                {data.maritalStatusLabel || "-"}
                            </div> */}
                        </div>
                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                Suffering from any medical condition/allergies
                           </div>
                            <div className={classes.value} style={{
                                width: '80%',
                                textAlign: `${data.guardianRelationWithStudentLabel ? 'left' : 'left'}`
                            }}>
                                <div 
                                    style={{
                                        marginTop: '0.5em',
                                        marginBottom: '0.5em'
                                    }}
                                >
                                    <span className={classes.tagValue}>{data.isAnyMedicalCondition === 1 ? 'Yes' : 'No'}</span>
                                </div>
                        {data.isAnyMedicalCondition === 1 && (<Fragment>
                            <div className={classes.valuesContainer}>
                                <span style={{
                                    fontSize: 'larger'
                                }}>
                                    Emergency Contact Details
                        </span>
                            </div>

                            <div className={classes.fieldValuesContainer}>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    textAlign: 'center'
                                }}>
                                    Medical Condition
                           </div>
                                <div className={classes.value} style={{
                                    width: '80%',
                                }}>
                                    {data.medicalCondition}
                                </div>
                            </div>


                            <div className={classes.fieldValuesContainer}>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    textAlign: 'center'
                                }}>
                                    Name
                           </div>
                                <div className={classes.value}>
                                    {data.emergencyContactPersonName || '-'}
                                </div>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    marginLeft: 15,
                                    textAlign: 'center'
                                }}>
                                    Relationship
                           </div>
                                <div className={classes.value}>
                                    {data.emergencyContactRelationshipLabel || '-'}
                                </div>
                            </div>
                            <div className={classes.fieldValuesContainer}>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    textAlign: 'center'
                                }}>
                                    Mobile Number
                           </div>
                                <div className={classes.value} style={{
                                    width: '80%',
                                }}>
                                    {data.emergencyContactNumber || '-'}
                                </div>
                            </div>
                        </Fragment>)}
                            </div>
                        </div>
                        </Collapse>
                        <div className={classes.collapseSectionHeader} >
                            <span style={{
                                fontSize: 'larger',
                            }}>
                                Permanent Address
                            </span>
                            <span
                                style={{
                                    float: "right"
                                }}
                            >
                                { 
                                this.state.isLoading ? <CircularProgress style={{color:'white', marginTop:4, marginRight:8}} size={18} /> 
                                :
                                <IconButton
                                    size='small'
                                    className={classnames(classes.expand, {[classes.expandOpen]:this.state.expanded[1]})}
                                    onClick={()=>this.handleExpandClick(1)}
                                    aria-expanded={this.state.expanded[1]}
                                    aria-label="Show more"
                                >
                                    <ExpandMoreIcon />
                                </IconButton>
                                }
                            </span>
                        </div>
                        <Collapse in={this.state.expanded[1]} timeout="auto" unmountOnExit>
                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                Address
                           </div>
                            <div className={classes.value} style={{
                                width: '80%',
                                textAlign: `${data.permanentAddress ? 'left' : 'center'}`
                            }}>
                                {data.permanentAddress || "-"}
                            </div>
                        </div>

                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                Country
                           </div>
                            <div style={{
                                textAlign: `${data.permanentCountryLabel ? 'left' : 'center'}`
                            }} className={classes.value}>
                                {data.permanentCountryLabel || "-"}
                            </div>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                marginLeft: 15,
                                textAlign: 'center'
                            }}>
                                Province
                           </div>
                            <div style={{
                                textAlign: `${data.permanentProvinceLabel ? 'left' : 'center'}`
                            }} className={classes.value}>
                                {data.permanentProvinceLabel || "-"}
                            </div>
                        </div>
                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                City
                           </div>
                            <div style={{
                                textAlign: `${data.permanentCityLabel ? 'left' : 'center'}`
                            }} className={classes.value}>
                                {data.permanentCityLabel || "-"}
                            </div>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                marginLeft: 15,
                                textAlign: 'center'
                            }}>
                                Postal Code
                           </div>
                            <div style={{
                                textAlign: `${data.permanentPostalCode ? 'left' : 'center'}`
                            }} className={classes.value}>
                                {data.permanentPostalCode || "-"}
                            </div>
                        </div>
                        </Collapse>
                        <div className={classes.collapseSectionHeader}>
                            <span style={{
                                fontSize: 'larger',
                            }}>
                                Present Address
                            </span>
                            <span
                                style={{
                                    float: "right"
                                }}
                            >
                                { 
                                this.state.isLoading ? <CircularProgress style={{color:'white', marginTop:4, marginRight:8}} size={18} /> 
                                :
                                <IconButton
                                    size='small'
                                    className={classnames(classes.expand, {[classes.expandOpen]:this.state.expanded[2]})}
                                    onClick={()=>this.handleExpandClick(2)}
                                    aria-expanded={this.state.expanded[2]}
                                    aria-label="Show more"
                                >
                                    <ExpandMoreIcon />
                                </IconButton>
                                }
                            </span>
                        </div>
                        <Collapse in={this.state.expanded[2]} timeout="auto" unmountOnExit>
                        {data.mailingAddressTypeId === 1 && (
                            <div style={{
                                marginLeft: '3%',
                                marginTop: '2%',
                                marginBottom: '1%'
                            }}>
                                <span style={{
                                    textAlign: `${data.mailingAddressTypeLabel ? 'left' : 'center'}`
                                }} className={classes.tagValue}>{data.mailingAddressTypeLabel || "-"}</span>
                            </div>
                        )}
                        {data.mailingAddressTypeId !== 1 && (<Fragment>
                            <div className={classes.fieldValuesContainer}>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    textAlign: 'center'
                                }}>
                                    Address
                           </div>
                                <div className={classes.value} style={{
                                    width: '80%',
                                    textAlign: `${data.mailingAddress ? 'left' : 'center'}`
                                }}>
                                    {data.mailingAddress || "-"}
                                </div>
                            </div>

                            <div className={classes.fieldValuesContainer}>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    textAlign: 'center'
                                }}>
                                    Country
                           </div>
                                <div style={{
                                    textAlign: `${data.mailingCountryLabel ? 'left' : 'center'}`
                                }} className={classes.value}>
                                    {data.mailingCountryLabel || "-"}
                                </div>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    marginLeft: 15,
                                    textAlign: 'center'
                                }}>
                                    Province
                           </div>
                                <div style={{
                                    textAlign: `${data.mailingProvinceLabel ? 'left' : 'center'}`
                                }} className={classes.value}>
                                    {data.mailingProvinceLabel || "-"}
                                </div>
                            </div>
                            <div className={classes.fieldValuesContainer}>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    textAlign: 'center'
                                }}>
                                    City
                           </div>
                                <div style={{
                                    textAlign: `${data.mailingCityLabel ? 'left' : 'center'}`
                                }} className={classes.value}>
                                    {data.mailingCityLabel || "-"}
                                </div>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    marginLeft: 15,
                                    textAlign: 'center'
                                }}>
                                    Postal Code
                           </div>
                                <div style={{
                                    textAlign: `${data.mailingPostalCode ? 'left' : 'center'}`
                                }} className={classes.value}>
                                    {data.mailingPostalCode || "-"}
                                </div>
                            </div>
                        </Fragment>)}
                        </Collapse>
                        <div className={classes.collapseSectionHeader}>
                            <span style={{
                                fontSize: 'larger'
                            }}>
                                Father's Information
                            </span>
                            <span
                                style={{
                                    float: "right"
                                }}
                            >
                                { 
                                this.state.isLoading ? <CircularProgress style={{color:'white', marginTop:4, marginRight:8}} size={18} /> 
                                :
                                <IconButton
                                    size='small'
                                    className={classnames(classes.expand, {[classes.expandOpen]:this.state.expanded[3]})}
                                    onClick={()=>this.handleExpandClick(3)}
                                    aria-expanded={this.state.expanded[3]}
                                    aria-label="Show more"
                                >
                                    <ExpandMoreIcon />
                                </IconButton>
                                }
                            </span>
                        </div>
                        <Collapse in={this.state.expanded[3]} timeout="auto" unmountOnExit>
                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                Title
                           </div>
                            <div style={{
                                textAlign: `${data.fatherTitleLabel ? 'left' : 'center'}`
                            }} className={classes.value}>
                                {data.fatherTitleLabel || "-"}
                            </div>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                marginLeft: 15,
                                textAlign: 'center'
                            }}>
                                Name
                           </div>
                            <div style={{
                                textAlign: `${data.fatherName ? 'left' : 'center'}`
                            }} className={classes.value}>
                                {data.fatherName || "-"}
                            </div>
                        </div>

                        {data.fatherTitleId !== 6 && (<Fragment>

                            <div className={classes.fieldValuesContainer}>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    textAlign: 'center'
                                }}>
                                    {data.fatherIdentityTypeLabel || 'CNIC'}
                                </div>
                                <div style={{
                                    textAlign: `${data.fatherCnicPassport ? 'left' : 'center'}`
                                }} className={classes.value}>
                                    {data.fatherCnicPassport || "-"}
                                </div>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    marginLeft: 15,
                                    textAlign: 'center'
                                }}>
                                    Mobile Number
                           </div>
                                <div style={{
                                    textAlign: `${data.fatherMobileNo ? 'left' : 'center'}`
                                }} className={classes.value}>
                                    {data.fatherMobileNo || "-"}
                                </div>
                            </div>

                            <div className={classes.fieldValuesContainer}>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    textAlign: 'center'
                                }}>
                                    Email
                           </div>
                                <div style={{
                                    textAlign: `${data.fatherEmail ? 'left' : 'center'}`
                                }} className={classes.value}>
                                    {data.fatherEmail || '-'}
                                </div>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    marginLeft: 15,
                                    textAlign: 'center'
                                }}>
                                    Occupation
                           </div>
                                <div style={{
                                    textAlign: `${data.fatherOccupationLabel ? 'left' : 'center'}`
                                }} className={classes.value}>
                                    {data.fatherOccupationLabel || "-"}
                                </div>
                            </div>
                        </Fragment>)}
                        </Collapse>
                        <div className={classes.collapseSectionHeader}>
                            <span style={{
                                fontSize: 'larger'
                            }}>
                                Mother's Information
                            </span>
                            <span
                                style={{
                                    float: "right"
                                }}
                            >
                                { 
                                this.state.isLoading ? <CircularProgress style={{color:'white', marginTop:4, marginRight:8}} size={18} /> 
                                :
                                <IconButton
                                    size='small'
                                    className={classnames(classes.expand, {[classes.expandOpen]:this.state.expanded[4]})}
                                    onClick={()=>this.handleExpandClick(4)}
                                    aria-expanded={this.state.expanded[4]}
                                    aria-label="Show more"
                                >
                                    <ExpandMoreIcon />
                                </IconButton>
                                }
                            </span>
                        </div>
                        <Collapse in={this.state.expanded[4]} timeout="auto" unmountOnExit>
                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                Title
                           </div>
                            <div style={{
                                textAlign: `${data.motherTitleLabel ? 'left' : 'center'}`
                            }} className={classes.value}>
                                {data.motherTitleLabel || "-"}
                            </div>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                marginLeft: 15,
                                textAlign: 'center'
                            }}>
                                Name
                           </div>
                            <div style={{
                                textAlign: `${data.motherName ? 'left' : 'center'}`
                            }} className={classes.value}>
                                {data.motherName || "-"}
                            </div>
                        </div>

                        {data.motherTitleId !== 6 && (<Fragment>

                            <div className={classes.fieldValuesContainer}>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    textAlign: 'center'
                                }}>
                                    {data.motherIdentityTypeLabel || 'CNIC'}
                                </div>
                                <div style={{
                                    textAlign: `${data.motherCnicPassport ? 'left' : 'center'}`
                                }} className={classes.value}>
                                    {data.motherCnicPassport || "-"}
                                </div>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    marginLeft: 15,
                                    textAlign: 'center'
                                }}>
                                    Mobile Number
                           </div>
                                <div style={{
                                    textAlign: `${data.motherMobileNo ? 'left' : 'center'}`
                                }} className={classes.value}>
                                    {data.motherMobileNo || "-"}
                                </div>
                            </div>

                            <div className={classes.fieldValuesContainer}>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    textAlign: 'center'
                                }}>
                                    Email
                           </div>
                                <div style={{
                                    textAlign: `${data.motherEmail ? 'left' : 'center'}`
                                }} className={classes.value}>
                                    {data.motherEmail || '-'}
                                </div>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    marginLeft: 15,
                                    textAlign: 'center'
                                }}>
                                    Occupation
                           </div>
                                <div style={{
                                    textAlign: `${data.motherOccupationLabel ? 'left' : 'center'}`
                                }} className={classes.value}>
                                    {data.motherOccupationLabel || "-"}
                                </div>
                            </div>

                        </Fragment>)}
                        </Collapse>
                        <div className={classes.collapseSectionHeader}>
                            <span style={{
                                fontSize: 'larger'
                            }}>
                                Guardian's Information
                            </span>
                            <span
                                style={{
                                    float: "right"
                                }}
                            >
                                { 
                                this.state.isLoading ? <CircularProgress style={{color:'white', marginTop:4, marginRight:8}} size={18} /> 
                                :
                                <IconButton
                                    size='small'
                                    className={classnames(classes.expand, {[classes.expandOpen]:this.state.expanded[5]})}
                                    onClick={()=>this.handleExpandClick(5)}
                                    aria-expanded={this.state.expanded[5]}
                                    aria-label="Show more"
                                >
                                    <ExpandMoreIcon />
                                </IconButton>
                                }
                            </span>
                        </div>
                        <Collapse in={this.state.expanded[5]} timeout="auto" unmountOnExit>
                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                Title
                           </div>
                            <div style={{
                                textAlign: `${data.guardianTitleLabel ? 'left' : 'center'}`
                            }} className={classes.value}>
                                {data.guardianTitleLabel || "-"}
                            </div>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                marginLeft: 15,
                                textAlign: 'center'
                            }}>
                                Name
                           </div>
                            <div style={{
                                textAlign: `${data.guardianName ? 'left' : 'center'}`
                            }} className={classes.value}>
                                {data.guardianName || "-"}
                            </div>
                        </div>

                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                {data.guardianIdentityTypeLabel || 'CNIC'}
                            </div>
                            <div style={{
                                textAlign: `${data.guardianCnicPassport ? 'left' : 'center'}`
                            }} className={classes.value}>
                                {data.guardianCnicPassport || "-"}
                            </div>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                marginLeft: 15,
                                textAlign: 'center'
                            }}>
                                Mobile Number
                           </div>
                            <div style={{
                                textAlign: `${data.guardianMobileNo ? 'left' : 'center'}`
                            }} className={classes.value}>
                                {data.guardianMobileNo || "-"}
                            </div>
                        </div>

                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                Email
                           </div>
                            <div style={{
                                textAlign: `${data.guardianEmail ? 'left' : 'center'}`
                            }} className={classes.value}>
                                {data.guardianEmail || '-'}
                            </div>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                marginLeft: 15,
                                textAlign: 'center'
                            }}>
                                Occupation
                           </div>
                            <div style={{
                                textAlign: `${data.guardianOccupationLabel ? 'left' : 'center'}`
                            }} className={classes.value}>
                                {data.guardianOccupationLabel || "-"}
                            </div>
                        </div>

                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                Relationship
                           </div>
                            <div className={classes.value} style={{
                                width: '80%',
                                textAlign: `${data.guardianRelationWithStudentLabel ? 'left' : 'center'}`
                            }}>
                                {data.guardianRelationWithStudentLabel || "-"}
                            </div>
                        </div>
                        </Collapse>

                        {/* <div className={classes.valuesContainer}>
                            <span style={{
                                fontSize: 'larger'
                            }}>
                                
                        </span>
                        </div> */}

                        {/* <Fragment>
                            <div className={classes.valuesContainer}>
                                <span style={{
                                    fontSize: 'larger'
                                }}>
                                    Enrolled Courses
                                </span>
                            </div>

                            <div 
                            >
                            {enrolledCourses.map( (data, index) =>
                            <EnrolledCourses 
                                key={"sessionEnrolledCoursesData"+index}
                                classes={classes}
                                data={data}
                                isOpen={ index==0 ? true : false}
                            />
                            )}
                            </div>
                        </Fragment>

                        <Fragment>
                            <div className={classes.valuesContainer}>
                                <span style={{
                                    fontSize: 'larger'
                                }}>
                                    Enrolled Sections
                                </span>
                            </div>
                            <div 
                            >
                            {enrolledSections.map( (data, index) =>
                            <EnrolledSections 
                                key={"sessionEnrolledSectionsData"+index}
                                classes={classes}
                                data={data}
                                isOpen={ index==0 ? true : false}
                            />
                            )}
                            </div>
                           
                        </Fragment> */}

                        {/* <Fragment>
                            <div className={classes.valuesContainer}>
                                <span 
                                    style={{
                                        fontSize: 'larger'
                                    }}
                                >
                                    Submitted Assignments
                                </span>
                            </div>
                            <Typography color="primary" component="div" style={{fontWeight: 600,fontSize:18, color:"rgb(47 87 165)"}}>

                           
                        <Divider
                            style={{
                            backgroundColor: "rgb(47 87 165)", //"rgb(58, 127, 187)",
                            opacity: "0.3",
                            marginLeft: 50,
                            marginTop: -10
                            }}
                        />
                            </Typography>
                          
                             {assignmentsSubmitted.map( (data, index) =>
                                <AssignmentsSubmmited 
                                    key={"AssignmentsSubmmitedData"+index}
                                    classes={classes}
                                    data={data}
                                    isOpen={ index==0 ? true : false}
                                />
                                )}
                        </Fragment> */}

                        {/* <Fragment>
                            <div className={classes.valuesContainer}>
                                <span 
                                    style={{
                                        fontSize: 'larger'
                                    }}
                                >
                                    Graded Discussion Board
                                </span>
                            </div>
                            <div style={{
                                marginLeft: '3%',
                                marginRight: '3%',
                                marginTop: '2%',
                                marginBottom: '1%',
                                display: 'flex'
                            }}>
                                {gradedDiscussionsBoard.length ? 
                                <TableContainer component={Paper}>
                                    <Table size="small" aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="center" style={{ borderLeft: '1px solid rgb(47, 87, 165)' }}>Title</StyledTableCell>
                                                <StyledTableCell align="center">Section</StyledTableCell>
                                                <StyledTableCell align="center">Marks</StyledTableCell>
                                                <StyledTableCell align="center" style={{ borderRight: '1px solid rgb(47, 87, 165)' }}>Discussion&nbsp;Essay</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {gradedDiscussionsBoard.map((item, index)=>
                                            <StyledTableRow key={index}>
                                                <StyledTableCell component="th" scope="row">{item.discussionLabel}</StyledTableCell>
                                                <StyledTableCell align="center">{item.sectionLabel}</StyledTableCell>
                                                <StyledTableCell align="center">{item.marks}</StyledTableCell>
                                                <StyledTableCell align="center">{item.discussionEssay}</StyledTableCell>
                                            </StyledTableRow>
                                        )} 
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                :
                                ""
                                }
                            </div>
                        </Fragment> */}

                        <Fragment>
                            <div className={classes.collapseSectionHeader}>
                                <span 
                                    style={{
                                        fontSize: 'larger'
                                    }}
                                >
                                    Student Attendance Summary
                                </span>
                                <span
                                    style={{
                                        float: "right"
                                    }}
                                    >
                                    { 
                                    this.state.isLoading ? <CircularProgress style={{color:'white', marginTop:4, marginRight:8}} size={18} /> 
                                    :
                                    <IconButton
                                        size='small'
                                        className={classnames(classes.expand, {[classes.expandOpen]:this.state.expanded[6]})}
                                        onClick={()=>this.handleExpandClick(6)}
                                        aria-expanded={this.state.expanded[6]}
                                        aria-label="Show more"
                                    >
                                        <ExpandMoreIcon />
                                    </IconButton>
                                    }
                                </span>
                            </div>
                            <Collapse in={this.state.expanded[6]} timeout="auto" unmountOnExit>
                            <div 
                                className={classes.fieldValuesContainer}
                                style={{
                                    // marginLeft: '3%',
                                    // marginRight: '3%',
                                    marginTop: '10px',
                                    // marginBottom: '1%',
                                    // display: 'flex'
                                }}
                            >
                                {studentAttendance.length > 0 ?
                                <TableContainer component={Paper} style={{ overflowX: "inherit" }}>
                                    <Table
                                        size="small"
                                        className={classes.table}
                                        aria-label="customized table"
                                    >
                                        <TableHead>
                                        <TableRow>
                                            <StyledTableCell rowSpan="2" style={{borderLeft: "1px solid rgb(47, 87, 165)" }}>Course</StyledTableCell>
                                            <StyledTableCell align="center" colSpan="2">Lectures</StyledTableCell>
                                            <StyledTableCell align="center" colSpan="2">Tutorials</StyledTableCell>
                                            <StyledTableCell align="center" colSpan="2">Total</StyledTableCell>
                                            <StyledTableCell rowSpan="2" align="center" style={{ borderRight: "1px solid rgb(47, 87, 165)" }}>%</StyledTableCell>
                                        </TableRow>
                                        <TableRow>
                                            {/* <StyledTableCell style={{ borderLeft: "1px solid rgb(47, 87, 165)" }}>&nbsp;</StyledTableCell> */}
                                            <StyledTableCell align="center">Schedule</StyledTableCell>
                                            <StyledTableCell align="center">Attended</StyledTableCell>
                                            <StyledTableCell align="center">Schedule</StyledTableCell>
                                            <StyledTableCell align="center">Attended</StyledTableCell>
                                            <StyledTableCell align="center">Schedule</StyledTableCell>
                                            <StyledTableCell align="center">Attended</StyledTableCell>
                                            {/* <StyledTableCell align="center" style={{ borderRight: "1px solid rgb(47, 87, 165)" }}>&nbsp;</StyledTableCell> */}
                                        </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {studentAttendance.length > 0 ? (
                                            studentAttendance.map((row, index) => (
                                            <Fragment key={"row" + row.studentId + index}>
                                                {/* <TableRow>
                                                <StyledTableCell colSpan="8" style={{ backgroundColor: "#e1e3e8" }}><b>{row.studentLabel}</b></StyledTableCell>
                                                </TableRow> */}
                                                {row.teacherCourseData.map((row2, index2) => 
                                                <TableRow key={"row" + row2.courseId + index2}>
                                                    <StyledTableCell style={{borderLeft: "1px solid rgb(47, 87, 165)"}}>{row2.courseLabel}</StyledTableCell>
                                                    <StyledTableCell align="center">{row2.attandanceCountScheduledLectures}</StyledTableCell>
                                                    <StyledTableCell align="center">{row2.attandanceCountAttendedLectures}</StyledTableCell>
                                                    <StyledTableCell align="center">{row2.attandanceCountScheduledTutorials}</StyledTableCell>
                                                    <StyledTableCell align="center">{row2.attandanceCountAttendedTutorials}</StyledTableCell>
                                                    <StyledTableCell align="center">{row2.attandanceCountScheduledLectures + row2.attandanceCountScheduledTutorials}</StyledTableCell>
                                                    <StyledTableCell align="center">{row2.attandanceCountAttendedLectures + row2.attandanceCountAttendedTutorials}</StyledTableCell>
                                                    <StyledTableCell align="center" style={{borderRight: "1px solid rgb(47, 87, 165)"}}>{row2.attandancePercentage}</StyledTableCell>
                                                </TableRow>
                                                )}
                                            </Fragment>
                                            ))
                                        ) : (
                                            <TableRow>
                                            <StyledTableCell colSpan="8">&nbsp;</StyledTableCell>
                                            </TableRow>
                                        )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                                        :
                                                        ""
                                  }
                            </div>
                            </Collapse>
                        </Fragment>



                        {/* <Fragment>
                            <div className={classes.valuesContainer}>
                                <span 
                                    style={{
                                        fontSize: 'larger'
                                    }}
                                >
                                    Student Progress Report
                                </span>
                            </div>
                            { this.state.studentProgressReport.map((data, index)=>
                                <StudentProgressReport 
                                key={"studentProgressReport"+index}
                                data={data}
                                isOpen={ index==0 ? true : false}
                                // studentProgressReport={this.state.studentProgressReport}
                                />
                            )}
                            
                                
                           
                        </Fragment> */}
                        {/* <Fragment>
                            <div className={classes.valuesContainer}>
                                <span 
                                    style={{
                                        fontSize: 'larger'
                                    }}
                                >
                                    UOL Achievement
                                </span>
                            </div>
                            <div 
                            >
                            {this.state.uolAllAchived.map( (data, index) =>
                            <AcademicSessionStudentAchievements 
                                key={"sessionAchievementsData"+index}
                                classes={classes}
                                data={data}
                                isOpen={ index==0 ? true : false}
                            />
                            )}
                            </div>
                        </Fragment> */}
                        {/* <Fragment>
                            <div className={classes.valuesContainer}>
                                <span 
                                    style={{
                                        fontSize: 'larger'
                                    }}
                                >
                                    Year End Status
                                </span>
                            </div>
                            <div 
                            >
                            {this.state.yearEndStatus.map( (data, index) =>
                            <YearEndStatus 
                                key={"sessionAchievementsData"+index}
                                classes={classes}
                                data={data}
                                isOpen={ index==0 ? true : false}
                            />
                            )}
                            </div>
                        </Fragment> */}

                    </div>
                    <div className={classes.bottomSpace}></div>
                </div>
            </Fragment >
        );
    }
}

DisplayAdmissionApplications.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DisplayAdmissionApplications);