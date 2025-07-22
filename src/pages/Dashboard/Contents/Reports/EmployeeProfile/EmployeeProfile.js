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
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import {Collapse, Divider, Grid, Table, Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress, Box, Card, CardActionArea, CardMedia, CardContent} from '@material-ui/core';
import classnames from 'classnames';
import { format } from 'date-fns';
import ProfilePlaceholder from "../../../../../assets/Images/ProfilePlaceholder.png";
import CustomizedSnackbar from "../../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";

const styles = (theme) => ({
    root : {
        width: "100%",
        overFlowX: "hidden",
        padding : `${theme.spacing(2)}px ${theme.spacing(0)}px ${theme.spacing(2)}px ${theme.spacing(2)}px`,
        "@media print": {
            transform: "scale(0.7)",
            transformOrigin: "top left",
            width: "142.857%", // 1 / 0.7 to offset the scale and still fill the page
            padding: 0,
            margin: 0,
        }
    },
    boxLabel: {
        backgroundColor : theme.palette.primary.main,
        color : theme.palette.primary.contrastText,
        padding : theme.spacing(0.75),
        textAlign : "center"
    },
    boxValue: {
        border : "1px solid black",
        padding : `${theme.spacing(0.6)}px ${theme.spacing(0)}px ${theme.spacing(0.6)}px ${theme.spacing(0.6)}px`
    },
    closeButton: {
        position: 'fixed',
        top: theme.spacing(1),
        right: theme.spacing(2),
        zIndex: 1,
        border: '1px solid #b43329',
        borderRadius: 5,
        padding: 3,
        '@media print': {
            display: 'none'
        }
    },
    headerContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
        fontWeight: 600,
        color: '#2f57a5',
    },
    image: {
        height: 140,
        width: 130,
        border: '1px solid',
        textAlign: 'center',
        marginTop: '-35px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        webkitPrintColorAdjust: 'exact',
        colorAdjust: 'exact',
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

const CustomLinearProgress = withStyles({
  root: {
    height: 24,
    backgroundColor: '#A9A9A9', // light pink background
  },
  bar: {
    backgroundColor: '#808080', // the actual progress bar color
  },
})(LinearProgress);

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.primary.main, //theme.palette.common.black,
      color: theme.palette.primary.contrastText,
      fontWeight: 500,
      border: '1px solid white'
    },
    body: {
      fontSize: 14,
      border: theme.palette.primary.main
    },
  }))(TableCell);
  
  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);


class EmployeeProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isLoginMenu: false,
            isReload: false,
            isOpenSnackbar: false,
            snackbarMessage: "",
            snackbarSeverity: "",
            isParmExist : false,
            data: {},
            rolesData: [],
            isRolesLoading : false,
            commentsData: [],
            isCommentsLoading: false,
            imageUrl : ProfilePlaceholder,
            documentsData : [],
            isDocumentsLoading: false,
            downloadingFileId: 0,
            expanded: [true, false, false, false, false, false]
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
        if (reason === "clickaway") { return; }
        this.setState({ isOpenSnackbar: false });
    };

    getUserId = async () => {
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonUserIdView`;
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
		.then((json) => {
				const { CODE, DATA=[], SYSTEM_MESSAGE, USER_MESSAGE} =  json;
				if (CODE === 1) {
                    if(DATA.length>0){
                        const id = parseInt(DATA[0]) || 0;
                        if(id > 0){
                            this.getData(id);
                            this.getComments(id);
                            this.getRoles(id);
                            this.getDocuments(id);
                        }
                    }
				} else {
					this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE} <br/> {USER_MESSAGE}</span>, "error" );
				}
			},
			(error) => {
				const { status } = error;
				if (status === 401) {
					this.setState({
						isLoginMenu: true,
						isReload: true,
					});
				} else {
					this.handleOpenSnackbar("Failed to fetch, Please try again later.", "error");
					console.log(error);
				}
			}
		);
	};

    getData = async (employeeId) => {
        const data = new FormData();
        data.append("employeeId", employeeId);
		this.setState({ isLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonEmployeeProfileView`;
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
		.then((json) => {
				const { CODE, DATA=[], SYSTEM_MESSAGE, USER_MESSAGE} =  json;
				if (CODE === 1) {
                    if(DATA.length>0){
                        let data = DATA[0] || {};
                        this.setState({ data });
                        if(!!data.profileImage){
                            this.getFile(data.id, data.profileImage)
                        }
                    }
				} else {
					this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE} <br/> {USER_MESSAGE}</span>, "error" );
				}
			},
			(error) => {
				const { status } = error;
				if (status === 401) {
					this.setState({
						isLoginMenu: true,
						isReload: true,
					});
				} else {
					this.handleOpenSnackbar("Failed to fetch, Please try again later.", "error");
					console.log(error);
				}
			}
		);
		this.setState({ isLoading: false });
	};

   getFile = (userId, fileName) => {
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonUsersDocumentsFileView?userId=${encodeURIComponent(userId)}&fileName=${encodeURIComponent(fileName)}`;
        fetch(url, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
            }
        })
        .then((res) => {
            if (res.ok) {
                return res.blob();
            } else if (res.status === 401) {
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
            const reader = new FileReader();
            reader.onloadend = () => {
                this.setState({ imageUrl: reader.result });
            };
            reader.readAsDataURL(blob);
        })
        .catch((error) => {
            if (error.name === "AbortError") {
                this.handleOpenSnackbar("Download cancelled.", "warning");
            } else {
                console.error("Download error:", error);
            }
        })
        .finally(() => {
            
        });
    };

    getComments = async (employeeId) => {
        const data = new FormData();
        data.append("employeeId", employeeId);
		this.setState({ isCommentsLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonEmployeeCommentsView`;
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
		.then((json) => {
				const { CODE, DATA=[], SYSTEM_MESSAGE, USER_MESSAGE} =  json;
				if (CODE === 1) {
                    let data = DATA || [];
                    this.setState({ commentsData : data });
				} else {
					this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE} <br/> {USER_MESSAGE}</span>, "error" );
				}
			},
			(error) => {
				const { status } = error;
				if (status === 401) {
					this.setState({
						isLoginMenu: true,
						isReload: true,
					});
				} else {
					this.handleOpenSnackbar("Failed to fetch, Please try again later.", "error");
					console.log(error);
				}
			}
		);
		this.setState({ isCommentsLoading: false });
	};

    getRoles = async (employeeId) => {
        const data = new FormData();
        data.append("employeeId", employeeId);
		this.setState({ isRolesLoading: true });
		const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonEmployeeRolesView`;
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
		.then((json) => {
				const { CODE, DATA=[], SYSTEM_MESSAGE, USER_MESSAGE} =  json;
				if (CODE === 1) {
                    let data = DATA || [];
                    this.setState({ rolesData : data });
				} else {
					this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE} <br/> {USER_MESSAGE}</span>, "error" );
				}
			},
			(error) => {
				const { status } = error;
				if (status === 401) {
					this.setState({
						isLoginMenu: true,
						isReload: true,
					});
				} else {
					this.handleOpenSnackbar("Failed to fetch, Please try again later.", "error");
					console.log(error);
				}
			}
		);
		this.setState({ isRolesLoading: false });
	};

    getDocuments = async (employeeId) => {
        const data = new FormData();
        data.append("employeeId", employeeId);
        this.setState({ isDocumentsLoading: true });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/CommonUserDocumentsView`;
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
        .then((json) => {
                const { CODE, DATA=[], SYSTEM_MESSAGE, USER_MESSAGE} =  json;
                if (CODE === 1) {                    
                    this.setState({ documentsData: DATA || [] });
                } else {
                    this.handleOpenSnackbar(<span>{SYSTEM_MESSAGE} <br/> {USER_MESSAGE}</span>, "error" );
                }
            },
            (error) => {
                if (error.status === 401) {
                    this.setState({
                        isLoginMenu: true,
                        isReload: true,
                    });
                } else {
                    this.handleOpenSnackbar( "Failed to fetch, Please try again later.", "error" );
                    console.log(error);
                }
            }
        );
        this.setState({ isDocumentsLoading: false });
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

    handleExpandClick = (index) => {
        let expanded = [...this.state.expanded];
        expanded[index] = !expanded[index];
        this.setState({expanded});
    };

    componentDidMount() {
        const id = parseInt(this.props.match?.params?.id, 10) || 0;
        if (id > 0) {
            this.setState({isParmExist: true});
            this.getData(id);
            this.getComments(id);
            this.getRoles(id);
            this.getDocuments(id);
        } else {
            this.getUserId();
        }
    }

    render() {
        
        const { classes } = this.props;

        const { isParmExist, data={}, commentsData=[], rolesData=[], documentsData=[] } = this.state;

        return (
            <Fragment>
                <LoginMenu
                    reload={this.state.isReload}
                    open={this.state.isLoginMenu}
                    handleClose={() => this.setState({ isLoginMenu: false })}
                />
                <Grid 
                    container
                    spacing={2}
                    justifyContent='center'
                    alignItems='center' 
                    className={classes.root}
                >
                    {isParmExist && 
                    <Grid item xs={12}>
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
                    </Grid>
                    }
                    <Grid item xs={12}>
                        <Box 
                            bgcolor="primary.main" 
                            color="primary.contrastText" 
                            display="flex" 
                            justifyContent="space-between" 
                            p={0.5} 
                            style={{
                                borderTopLeftRadius:5, 
                                borderTopRightRadius:5
                            }}
                        >
                            <Box component="span" fontSize={"1.2em"}>Personal Information</Box>
                            <Box>
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
                            </Box>
                        </Box>
                        <Collapse in={this.state.expanded[0]} timeout="auto" unmountOnExit>
                            <Grid container spacing={2} justifyContent='flex-start' alignItems='center'>
                                <Grid item xs={12} />
                                <Grid item xs={12}>
                                    <Grid container direction='row-reverse' justifyContent='space-evenly' alignItems='stretch' spacing={2}>
                                        <Grid item xs={12} sm lg xl={1}>
                                            <Box display="flex" justifyContent="flex-end" alignItems="center" >
                                                {/*
                                                <Box 
                                                    className={classes.image} 
                                                    style={{
                                                        backgroundImage: `url(${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C01AdmissionsProspectApplicationImageView?fileName=${data.imageName})`,
                                                    }}>
                                                </Box>
                                                <Box textAlign="center">{this.state.isLoading ? <LinearProgress style={{ height: 24}} /> : <span>{data.displayName || "N/A"}</span> }</Box>
                                                */}    
                                                <Card style={{width:"100%"}}>
                                                    <CardActionArea>
                                                        <CardMedia
                                                            component="img"
                                                            alt="No Profile Image"
                                                            //height="130"
                                                            height="170"
                                                            image={this.state.imageUrl}
                                                            title="Contemplative Reptile"
                                                        />
                                                        {/* 
                                                        <CardContent style={{padding: "4px 8px 0px 8px"}}>
                                                            <Typography gutterBottom variant="h6" component="h2" align='center'>
                                                                {this.state.isLoading ? <CustomLinearProgress style={{ height: 24}} /> : <span>{data.firstName || "N/A"}</span> }
                                                            </Typography>
                                                        </CardContent> 
                                                        */}
                                                    </CardActionArea>
                                                </Card>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={10} lg={10} xl={11}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={4} sm={2} md={2}>
                                                    <Box className={classes.boxLabel}>Name</Box>
                                                </Grid>
                                                <Grid item xs={8} sm={4} md={4}>
                                                    <Box display="flex" flexWrap="nowrap">
                                                        <Box className={classes.boxValue} style={{ flex: 1, textAlign: `${data.firstName ? 'left' : 'center'}` }}> {data.firstName || "-"} </Box>
                                                        <Box className={classes.boxValue} ml={1} style={{ flex: 1, textAlign: `${data.lastName ? 'left' : 'center'}` }}> {data.lastName || "-"} </Box>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={4} sm={2} md={2}>
                                                    <Box className={classes.boxLabel}>Display Name</Box>
                                                </Grid>
                                                <Grid item xs={8} sm={4} md={4}>
                                                    <Box className={classes.boxValue} style={{ textAlign: `${data.displayName ? 'left' : 'center'}` }}> {data.displayName || "-"} </Box>
                                                </Grid>
                                                <Grid item xs={4} sm={3} md={2}>
                                                    <Box className={classes.boxLabel}>Primary Email</Box>
                                                </Grid>
                                                <Grid item xs={8} sm={3} md={4}>
                                                    <Box className={classes.boxValue} style={{ textAlign: `${data.email ? 'left' : 'center'}` }}> {data.email || "-"} </Box>
                                                </Grid>
                                                <Grid item xs={4} sm={3} md={2}>
                                                    <Box className={classes.boxLabel}>Primary Mobile</Box>
                                                </Grid>
                                                <Grid item xs={8} sm={3} md={4}>
                                                    <Box className={classes.boxValue} style={{ textAlign: `${data.mobileNo ? 'left' : 'center'}` }}> {data.mobileNo || "-"} </Box>
                                                </Grid>
                                                <Grid item xs={4} sm={3} md={2}>
                                                    <Box className={classes.boxLabel}>Job Status</Box>
                                                </Grid>
                                                <Grid item xs={8} sm={3} md={4}>
                                                    <Box className={classes.boxValue} style={{ textAlign: `${data.jobStatusLabel ? 'left' : 'center'}` }}>  {data.jobStatusLabel || "-"} </Box>
                                                </Grid>
                                                <Grid item xs={4} sm={3} md={2}>
                                                    <Box className={classes.boxLabel}>Joining Date</Box>
                                                </Grid>
                                                <Grid item xs={8} sm={3} md={4}>
                                                    <Box className={classes.boxValue} style={{ textAlign: `${data.joiningDateLabel ? 'left' : 'center'}` }}>  {data.joiningDateLabel || "--/--/----"} </Box>
                                                </Grid>
                                                <Grid item xs={4} sm={2} md={2}>
                                                    <Box className={classes.boxLabel}>Shift</Box>
                                                </Grid>
                                                <Grid item xs={8} sm={3} md={4}>
                                                    <Box className={classes.boxValue} style={{ textAlign: `${data.shiftLabel ? 'left' : 'center'}` }}>   {data.shiftLabel || "-"} </Box>
                                                </Grid>
                                                <Grid item xs={4} sm={3} md={2}>
                                                    <Box className={classes.boxLabel}>Coordination With</Box>
                                                </Grid>
                                                <Grid item xs={8} sm={4} md={4}>
                                                    <Box className={classes.boxValue} style={{ textAlign: `${data.coordinationLabel ? 'left' : 'center'}` }}>   {data.coordinationLabel || "-"} </Box>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={4} sm={2}>
                                    <Box className={classes.boxLabel}>Discipline</Box>
                                </Grid>
                                <Grid item xs={8} sm={4}>
                                    <Box className={classes.boxValue} style={{textAlign: `${data.discipline ? 'left' : 'center'}` }}>   {data.discipline || "-"} </Box>
                                </Grid>
                                <Grid item xs={4} sm={2}>
                                    <Box className={classes.boxLabel}>Bank Account</Box>
                                </Grid>
                                <Grid item xs={8} sm={4}>
                                    <Box display="flex" flexWrap="nowrap">
                                        <Box className={classes.boxValue} style={{ flex:1 }}> {data.isBankAccount ? "Yes" : "No" } </Box>
                                        <Box className={classes.boxValue} ml={1} style={{ flex:2, textAlign: `${data.bankAccountNumber1 ? 'left' : 'center'}` }}> {data.bankAccountNumber1 || '-'} </Box>
                                        <Box className={classes.boxValue} ml={1} style={{ flex:2, textAlign: `${data.bankAccountNumber2 ? 'left' : 'center'}` }}> {data.bankAccountNumber2 || "-"} </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={4} sm={3} md={2}>
                                    <Box className={classes.boxLabel}>Primary Reporting To</Box>
                                </Grid>
                                <Grid item xs={8} sm={4} md={4}>
                                    <Box className={classes.boxValue} style={{textAlign: `${data.reportingToLabel ? 'left' : 'center'}` }}>   {data.reportingToLabel || "-"} </Box>
                                </Grid>
                                <Grid item xs={4} sm={2}>
                                    <Box className={classes.boxLabel}>Blood Group</Box>
                                </Grid>
                                <Grid item xs={8} sm={3} md={4}>
                                    <Box className={classes.boxValue} style={{textAlign: `${data.bloodGroup ? 'left' : 'center'}` }}>   {data.bloodGroup || "-"} </Box>
                                </Grid>
                                <Grid item xs={4} sm={3} md={2}>
                                    <Box className={classes.boxLabel}>Emergency Contact Name</Box>
                                </Grid>
                                <Grid item xs={8} sm={3} md={4}>
                                    <Box className={classes.boxValue} style={{textAlign: `${data.emergencyContactName ? 'left' : 'center'}` }}>   {data.emergencyContactName || "-"} </Box>
                                </Grid>
                                <Grid item xs={4} sm={3} md={2}>
                                    <Box className={classes.boxLabel}>Emergency Contact# </Box>
                                </Grid>
                                <Grid item xs={8} sm={3} md={4}>
                                    <Box className={classes.boxValue} style={{textAlign: `${data.emergencyContactNumber ? 'left' : 'center'}` }}>   {data.emergencyContactNumber || "-"} </Box>
                                </Grid>
                                <Grid item xs={4} sm={2}>
                                    <Box className={classes.boxLabel}>Address</Box>
                                </Grid>
                                <Grid item xs={8} sm={10}>
                                    <Box className={classes.boxValue} style={{textAlign: `${data.address ? 'left' : 'center'}` }}>   {data.address || "-"} </Box>
                                </Grid>
                            </Grid>
                        </Collapse>
                    </Grid>
                    <Grid item xs={12}>
                        <Box 
                            bgcolor="primary.main" 
                            color="primary.contrastText" 
                            display="flex" 
                            justifyContent="space-between" 
                            p={0.5} 
                            style={{
                                borderTopLeftRadius:5, 
                                borderTopRightRadius:5
                            }}
                        >
                            <Box component="span" fontSize={"1.2em"}>Employment History</Box>
                            <Box>
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
                            </Box>
                        </Box>
                        <Collapse in={this.state.expanded[1]} timeout="auto" unmountOnExit>
                            <Grid container spacing={2} justifyContent='center' alignItems='center'>
                                <Grid item xs={12}>
                                    <TableContainer component={Paper} style={{marginTop:8}}>
                                        <Table size="small">
                                            <TableHead>
                                                <StyledTableRow>
                                                    <StyledTableCell>Organization</StyledTableCell>
                                                    <StyledTableCell>Job Title</StyledTableCell>
                                                    <StyledTableCell>Employment Type</StyledTableCell>
                                                    <StyledTableCell>From Date</StyledTableCell>
                                                    <StyledTableCell>To Date</StyledTableCell>
                                                    <StyledTableCell>Key Responsibilities</StyledTableCell>
                                                </StyledTableRow>
                                            </TableHead>
                                            <TableBody>
                                                {(data.employmentHistories || []).length === 0 &&
                                                    <StyledTableRow><StyledTableCell colSpan={7} align="center">No Data</StyledTableCell></StyledTableRow>
                                                }
                                                {(data.employmentHistories || []).map((edu, idx) => (
                                                    <StyledTableRow key={idx}>
                                                        <StyledTableCell>{edu.organization}</StyledTableCell>
                                                        <StyledTableCell>{edu.jobTitle}</StyledTableCell>
                                                        <StyledTableCell>{edu.jobType}</StyledTableCell>
                                                        <StyledTableCell>{edu.fromDate ? format(edu.fromDate, "dd-MM-yyyy") : ""}</StyledTableCell>
                                                        <StyledTableCell>{edu.isCurrent ? "Current" : (edu.toDate ? format(edu.toDate, "dd-MM-yyyy") : "")}</StyledTableCell>
                                                        <StyledTableCell>{edu.description}</StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
                        </Collapse>
                    </Grid>
                    <Grid item xs={12}>
                        <Box 
                            bgcolor="primary.main" 
                            color="primary.contrastText" 
                            display="flex" 
                            justifyContent="space-between" 
                            p={0.5} 
                            style={{
                                borderTopLeftRadius:5, 
                                borderTopRightRadius:5
                            }}
                        >
                            <Box component="span" fontSize={"1.2em"}>Education History</Box>
                            <Box>
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
                            </Box>
                        </Box>
                        <Collapse in={this.state.expanded[2]} timeout="auto" unmountOnExit>
                            <Grid container spacing={2} justifyContent='center' alignItems='center'>
                                <Grid item xs={12}>
                                    <TableContainer component={Paper} style={{marginTop:8}}>
                                        <Table size="small">
                                            <TableHead>
                                                <StyledTableRow>
                                                    <StyledTableCell>Institution</StyledTableCell>
                                                    <StyledTableCell>Qualification</StyledTableCell>
                                                    <StyledTableCell>Field of Study</StyledTableCell>
                                                    <StyledTableCell>Level</StyledTableCell>
                                                    <StyledTableCell>Start</StyledTableCell>
                                                    <StyledTableCell>End</StyledTableCell>
                                                    <StyledTableCell>Result</StyledTableCell>
                                                </StyledTableRow>
                                            </TableHead>
                                            <TableBody>
                                                {(data.educationHistories || []).length === 0 &&
                                                    <StyledTableRow><StyledTableCell colSpan={7} align="center">No Data</StyledTableCell></StyledTableRow>
                                                }
                                                {(data.educationHistories || []).map((edu, idx) => (
                                                    <StyledTableRow key={idx}>
                                                        <StyledTableCell>{edu.institution}</StyledTableCell>
                                                        <StyledTableCell>{edu.qualification}</StyledTableCell>
                                                        <StyledTableCell>{edu.yearsOfQualification}</StyledTableCell>
                                                        <StyledTableCell>{edu.educationLevel}</StyledTableCell>
                                                        <StyledTableCell>{edu.fromDate ? format(edu.fromDate, "dd-MM-yyyy") : ""}</StyledTableCell>
                                                        <StyledTableCell>{edu.toDate ? format(edu.toDate, "dd-MM-yyyy") : ""}</StyledTableCell>
                                                        <StyledTableCell>{edu.result}</StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
                        </Collapse>
                    </Grid>
                    <Grid item xs={12}>
                        <Box 
                            bgcolor="primary.main" 
                            color="primary.contrastText" 
                            display="flex" 
                            justifyContent="space-between" 
                            p={0.5} 
                            style={{
                                borderTopLeftRadius:5, 
                                borderTopRightRadius:5
                            }}
                        >
                            <Box component="span" fontSize={"1.2em"}>Role & Department Assignment</Box>
                            <Box>
                                { 
                                this.state.isRolesLoading ? <CircularProgress style={{color:'white', marginTop:4, marginRight:8}} size={18} /> 
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
                            </Box>
                        </Box>
                        <Collapse in={this.state.expanded[3]} timeout="auto" unmountOnExit>
                            <Grid container spacing={2} justifyContent='center' alignItems='center'>
                                <Grid item xs={12}>
                                    <TableContainer component={Paper} style={{marginTop:8}}>
                                        <Table size="small">
                                            <TableHead>
                                                <StyledTableRow>
                                                    <StyledTableCell>From Date</StyledTableCell>
                                                    <StyledTableCell>Roles</StyledTableCell>
                                                    <StyledTableCell>Entities</StyledTableCell>
                                                    <StyledTableCell>Departments</StyledTableCell>
                                                    <StyledTableCell>Sub Departments</StyledTableCell>
                                                </StyledTableRow>
                                            </TableHead>
                                            <TableBody>
                                                {(rolesData || []).length === 0 &&
                                                    <StyledTableRow><StyledTableCell colSpan={5} align="center">No Data</StyledTableCell></StyledTableRow>
                                                }
                                                {(rolesData || []).map((role, idx) => (
                                                    <StyledTableRow key={idx}>
                                                        <StyledTableCell>{role.fromDateLabel}</StyledTableCell>
                                                        <StyledTableCell>{role.roles.map(obj=>obj.label).join(", ")}</StyledTableCell>
                                                        <StyledTableCell>{role.entities.map(obj=>obj.label).join(", ")}</StyledTableCell>
                                                        <StyledTableCell>{role.departments.map(obj=>obj.label).join(", ")}</StyledTableCell>
                                                        <StyledTableCell>{role.subDepartments.map(obj=>obj.label).join(", ")}</StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
                        </Collapse>
                    </Grid>
                    <Grid item xs={12}>
                        <Box 
                            bgcolor="primary.main" 
                            color="primary.contrastText" 
                            display="flex" 
                            justifyContent="space-between" 
                            p={0.5} 
                            style={{
                                borderTopLeftRadius:5, 
                                borderTopRightRadius:5
                            }}
                        >
                            <Box component="span" fontSize={"1.2em"}>Comments</Box>
                            <Box>
                                { 
                                this.state.isCommentsLoading ? <CircularProgress style={{color:'white', marginTop:4, marginRight:8}} size={18} /> 
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
                            </Box>
                        </Box>
                        <Collapse in={this.state.expanded[4]} timeout="auto" unmountOnExit>
                            <Grid container spacing={2} justifyContent='center' alignItems='center'>
                                <Grid item xs={12}>
                                    <TableContainer component={Paper} style={{marginTop:8}}>
                                        <Table size="small">
                                            <TableHead>
                                                <StyledTableRow>
                                                    <StyledTableCell width={150}>Date</StyledTableCell>
                                                    <StyledTableCell>Comments</StyledTableCell>
                                                </StyledTableRow>
                                            </TableHead>
                                            <TableBody>
                                                {(commentsData || []).length === 0 &&
                                                    <StyledTableRow><StyledTableCell colSpan={2} align="center">No Data</StyledTableCell></StyledTableRow>
                                                }
                                                {(commentsData || []).map((obj, index)=>
                                                    <StyledTableRow key={"commentData-"+index}>
                                                        <StyledTableCell component="th" scope="row" align='center'>{obj.commentDateDisplay}</StyledTableCell>
                                                        <StyledTableCell align="left">{obj.comment}</StyledTableCell>
                                                    </StyledTableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
                        </Collapse>
                    </Grid>
                    <Grid item xs={12}>
                        <Box 
                            bgcolor="primary.main" 
                            color="primary.contrastText" 
                            display="flex" 
                            justifyContent="space-between" 
                            p={0.5} 
                            style={{
                                borderTopLeftRadius:5, 
                                borderTopRightRadius:5
                            }}
                        >
                            <Box component="span" fontSize={"1.2em"}>Document Center</Box>
                            <Box>
                                { 
                                this.state.isDocumentsLoading ? <CircularProgress style={{color:'white', marginTop:4, marginRight:8}} size={18} /> 
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
                            </Box>
                        </Box>
                        <Collapse in={this.state.expanded[5]} timeout="auto" unmountOnExit>
                            <Grid container spacing={2} justifyContent='center' alignItems='center'>
                                <Grid item xs={12}>
                                    <TableContainer component={Paper} style={{marginTop:8}}>
                                        <Table size="small">
                                            <TableHead>
                                                <StyledTableRow>
                                                    <StyledTableCell width={50} align='center'>ID</StyledTableCell>
                                                    <StyledTableCell>File Name</StyledTableCell>
                                                     <StyledTableCell>Document Name</StyledTableCell>
                                                    <StyledTableCell>Label</StyledTableCell>
                                                    <StyledTableCell>Description</StyledTableCell>
                                                    <StyledTableCell align='center'>Uploaded On</StyledTableCell>
                                                    <StyledTableCell width={65} align='center'>Download</StyledTableCell>
                                                </StyledTableRow>
                                            </TableHead>
                                            <TableBody>
                                                {(documentsData || []).length === 0 &&
                                                    <StyledTableRow><StyledTableCell colSpan={7} align="center">No Data</StyledTableCell></StyledTableRow>
                                                }
                                                {(documentsData || []).map((obj, index)=>
                                                    <StyledTableRow key={"documentsData-"+index}>
                                                        <StyledTableCell component="th" scope="row" align='center'>{obj.id}</StyledTableCell>
                                                        <StyledTableCell align="left">{obj.fileName}</StyledTableCell>
                                                        <StyledTableCell align="left">{obj.documentName}</StyledTableCell>
                                                        <StyledTableCell align="left">{obj.label}</StyledTableCell>
                                                        <StyledTableCell align="left">{obj.description}</StyledTableCell>
                                                        <StyledTableCell align="center">{obj.uploadedOn ? format(obj.uploadedOn, "dd-MM-yyyy hh:mm a") : ""}</StyledTableCell>
                                                        <StyledTableCell align="center">
                                                            <Fragment>
                                                            {this.state.downloadingFileId === obj.id ? (
                                                                <CircularProgress size={24} color="primary" />
                                                            ) : (
                                                                <IconButton
                                                                    color="primary"
                                                                    onClick={() => this.downloadFile(obj.userId, obj.documentName, obj.id)}
                                                                    aria-label="download"
                                                                >
                                                                <CloudDownloadIcon />
                                                                </IconButton>
                                                            )}
                                                            </Fragment>
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
                        </Collapse>
                    </Grid>
                </Grid>
                <CustomizedSnackbar
                    isOpen={this.state.isOpenSnackbar}
                    message={this.state.snackbarMessage}
                    severity={this.state.snackbarSeverity}
                    handleCloseSnackbar={() => this.handleCloseSnackbar()}
                />
            </Fragment >
        );
    }
}

EmployeeProfile.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EmployeeProfile);