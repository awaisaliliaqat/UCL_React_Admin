/* eslint-disable react/no-unescaped-entities */
import React, { Component, Fragment } from 'react';
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';
import Logo from '../../../../assets/Images/logo.png';
import CloseIcon from '@material-ui/icons/Close';
import {IconButton, Typography, CircularProgress} from '@material-ui/core';
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@material-ui/core';

const styles = (theme) => ({
		mainDiv: {
			margin: "10px 10px 0px 10px",
			"@media print": {
        minWidth: "7.5in",
        maxWidth: "11in"
      }
		},
    closeButton: {
        top: theme.spacing(1),
        right: theme.spacing(2),
        zIndex: 1,
        border: '1px solid #ff4040',
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
        marginTop: '300px',
        color: 'white',
        fontSize:48
    },
    headerContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    titleContainer: {
        display: 'black',
        marginLeft: 20
    },
    title: {
        fontSize: 36,
        fontWeight: 'bolder',
        fontFamily: 'sans-serif',
        color: '#2f57a5',
        letterSpacing: 1,
    },
    subTitle: {
        fontSize: 24,
        fontWeight: 600,
        color: '#2f57a5',
		},
		subTitle2: {
			fontSize: 18,
			fontWeight: 600,
			color: '#2f57a5',
	},
	flexColumn: {
			display: 'flex',
			flexDirection: 'column'
	},
	table: {
    minWidth: 700
	}
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

class DisplayAdmissionApplications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            documentData: [],
            data: {},
            isLoading: false,
            isLoginMenu: false,
            isReload: false,
            tableData:[]
        }
    }

    handleOpenSnackbar = (msg, severity) => {
      this.setState({
        isOpenSnackbar: true,
        snackbarMessage: msg,
        snackbarSeverity: severity,
      });
    };
  
    handleCloseSnackbar = (event, reason) => {
      if (reason === "clickaway") {  return; }
      this.setState({ isOpenSnackbar: false });
    };

    getData = async (sectionId, monthId, pageNumber) => {
      this.setState({isLoading: true});
      let data = new FormData();
      data.append("sectionId", sectionId);
      data.append("monthId", monthId);
      data.append("pageNumber", pageNumber);
      const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C59CommonStudentsView`;
      await fetch(url, {
        method: "POST",
        body:data,
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
              this.setState({tableData: json.DATA[0] || []});
            } else {
              //alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
              this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
            }
            console.log("getData", json);
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
      this.setState({isLoading: false});
    };

    componentDidMount() {
      const { id = "0&0&0" } = this.props.match.params;
      let ids = id.split("&");
      this.getData(ids[0],ids[1],ids[2]);
    }

    render() {
        const { classes } = this.props;
        const { tableData } = this.state;
        const { sessionLabel = "", monthName="", courseLabel="", totalStudents="", sectionLabel="", sectionTeacher="",noOfDays = [], studentNamesList=[] } = tableData;
        let noOfDays1 = [1,2,3,4,5,6,7,8,9,10,11];
        return (
            <Fragment>
                {this.state.isLoading &&
                    <div className={classes.overlay}>
                        <div className={classes.overlayContent}>
                            <CircularProgress style={{ marginBottom: 10, color: 'white' }} size={36} />
                            <span>Loading...</span>
                        </div>
                    </div>
                }
								<div
									className={classes.mainDiv}
								>
                    <IconButton onClick={() => window.close()} aria-label="close" className={classes.closeButton}>
                      <CloseIcon color="secondary"/>
                    </IconButton>
                    <div className={classes.headerContainer}>
                      <div className={classes.titleContainer}>
                        <span className={classes.title}>Universal College Lahore&emsp;&emsp;&emsp;&emsp;{sessionLabel}</span>
                        <br/>
                        <span className={classes.subTitle}>Attandance Sheet for the Month of&nbsp;&nbsp;{monthName}</span>
                        <br/>
                        <span className={classes.subTitle2}>SUBJECT :&emsp;{courseLabel}</span><span className={classes.subTitle2} style={{float:"right"}}>&nbsp;</span>
                        <br/>
                        <span className={classes.subTitle2}>LECTUREGROUP :&emsp;{sectionLabel}</span>
                        <br/>
                        <span className={classes.subTitle2}>TEACHERS NAME :&emsp;{sectionTeacher}</span><span className={classes.subTitle2} style={{float:"right"}}>TOTAL&nbsp;STRENGTH :&nbsp;{totalStudents}</span>
                      </div>
                    </div>
                    <div className={classes.flexColumn}>
											<br/>
											<TableContainer component={Paper} style={{overflowX:"inherit"}}>
													<Table size="small" className={classes.table} aria-label="customized table">
															<TableHead>
															  <TableRow>
                                  <StyledTableCell align="center" style={{ borderLeft: '1px solid rgb(47, 87, 165)' }}>Name</StyledTableCell>
                                  <StyledTableCell align="center" colSpan={noOfDays1.length} style={{minWidth:"70%"}}>Dates</StyledTableCell>
                                  <StyledTableCell align="center" style={{ borderRight: '1px solid rgb(47, 87, 165)' }}>Total</StyledTableCell>
                                </TableRow>
															</TableHead>
															<TableBody>
                              <TableRow>
                                <StyledTableCell align="center" style={{ borderLeft: '1px solid rgb(47, 87, 165)', height:40}}>&nbsp;</StyledTableCell>
                                {noOfDays1.length > 0 ?
                                  noOfDays1.map((item, index)=>
                                    <StyledTableCell key={"h"+item} align="center">&nbsp;</StyledTableCell>
                                  )
                                :
                                  <StyledTableCell align="center">&nbsp;</StyledTableCell>
                                }
                                <StyledTableCell align="center" style={{ borderRight: '1px solid rgb(47, 87, 165)'}}>&nbsp;</StyledTableCell>
                            </TableRow>
                              <TableRow>
                                <StyledTableCell align="center" style={{ borderLeft: '1px solid rgb(47, 87, 165)', height:40}}>&nbsp;</StyledTableCell>
                                {noOfDays1.length > 0 ?
                                  noOfDays1.map((item, index)=>
                                    <StyledTableCell key={"h"+item} align="center">&nbsp;</StyledTableCell>
                                  )
                                :
                                  <StyledTableCell align="center">&nbsp;</StyledTableCell>
                                }
                                <StyledTableCell align="center" style={{ borderRight: '1px solid rgb(47, 87, 165)'}}>&nbsp;</StyledTableCell>
                            </TableRow>
                            {studentNamesList.map((item, index)=>
                                <StyledTableRow key={index}>
                                    <StyledTableCell component="th" scope="row"><Typography component="span" variant="body1" style={{fontWeight:600}}>{item}</Typography></StyledTableCell>
                                    {noOfDays1.map((item2, index2)=>
                                      <StyledTableCell key={item+item2+index2} align="center">&nbsp;</StyledTableCell>
                                    )}
                                    <StyledTableCell align="center">&nbsp;</StyledTableCell>
                                </StyledTableRow>
                            )} 
                            </TableBody>
													</Table>
											</TableContainer>
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