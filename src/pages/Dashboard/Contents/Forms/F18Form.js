import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/styles';
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";
import LoginMenu from '../../../../components/LoginMenu/LoginMenu';
import { TextField, Grid, Button, CircularProgress ,  InputLabel, Select, Input, Chip, Switch, FormControlLabel, Checkbox,} from '@material-ui/core';
import BottomBar from "../../../../components/BottomBar/BottomBar";
import CustomizedSnackbar from "../../../../components/CustomizedSnackbar/CustomizedSnackbar";
import MenuItem from "@material-ui/core/MenuItem";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { green } from '@material-ui/core/colors';

const styles = () => ({
    root: {
        padding: 20,
    },
    formControl: {
        minWidth: '100%',
    },
    sectionTitle: {
        fontSize: 19,
        color: '#174a84',
    },
    checkboxDividerLabel: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 20,
        fontSize: 16,
        fontWeight: 600
    },
    rootProgress: {
        width: '100%',
        textAlign: 'center',
    },
});


function ProgrGroupCheckboxes(props) {
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
    
    function showValue(e){
                console.log("abc",e.target.ID);
    }
    return (
      <div>
        <Grid item xs={5}>
            {/* <Typography style={{
                width: '98%', marginBottom: 5, fontSize: 18
            }}  className={classes.title} color="textSecondary" gutterBottom>
                School Of Economics and Management
            </Typography> */}
             <div> 
                
                <FormControlLabel
                    control={
                        <Checkbox
                            id={props.valueID}
                            name="abc"
                            onClick={e=>showValue(e)}
                            color="primary"
                            inputProps={{ 'aria-valeu': 'secondary checkbox','value':props.valueID }}
                            value={props.valueID}
                        />
                    }
                    
                    style={{
                        color: '#1d5f98', fontWeight: 600,
                        width: '98%', marginBottom: 5, fontSize: 12
                    }} 
                    label={props.value}
                />

            </div>
        </Grid>
      </div>
    );
  }

class F18Form extends Component {

    constructor(props) {
        super(props);
        this.state = {
            recordId: this.props.match.params.recordId,
            isLoading: false,
            isReload: false,
            label: "",
            labelError: "",
            shortLabel: "",
            shortLabelError: "",
            isOpenSnackbar: false,
            snackbarMessage: "",
            snackbarSeverity: "",
            AcademicSessions: [],
            AcademicSessionsId: "",
            AcademicSessionsIdError: "",
            ProgrammesGroup: [],
            
        }
    }

    handleOpenSnackbar = (msg, severity) => {
        this.setState({
            isOpenSnackbar: true,
            snackbarMessage: msg,
            snackbarSeverity: severity
        });
    };

    handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            isOpenSnackbar: false
        });
    };

    loadData = async (index) => {
        const data = new FormData();
        data.append("id", index);
        this.setState({ isLoading: true });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C09CommonCourseSelectionGroupView`;
        await fetch(url, {
            method: "POST",
            body: data,
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
            .then(
                json => {
                    if (json.CODE === 1) {
                        this.setState({
                            label: json.DATA[0].label,
                            shortLabel: json.DATA[0].shortLabel
                        });
                    } else {
                        this.handleOpenSnackbar(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE, "error");
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
                        this.handleOpenSnackbar("Failed to Save ! Please try Again later.", "error");
                    }
                });
        this.setState({ isLoading: false })
    }

    islabelValid = () => {
        let isValid = true;
        if (!this.state.label) {
            this.setState({ labelError: "Please enter Course Selection Group." });
            document.getElementById("label").focus();
            isValid = false;
        } else {
            this.setState({ labelError: "" });
        }
        return isValid;
    }

    isshortLabelValid = () => {
        let isValid = true;
        if (!this.state.shortLabel) {
            this.setState({ shortLabelError: "Please enter Short Name." });
            document.getElementById("shortLabel").focus();
            isValid = false;
        } else {
            this.setState({ shortLabelError: "" });
        }
        return isValid;
    }

    onHandleChange = e => {
        const { name, value } = e.target;
        const errName = `${name}Error`;
        //let regex = "";
        // switch (name) {
        //     case "label":
        //     case "shortLabel":
        //         regex = new RegExp(alphabetExp);
        //         if (value && !regex.test(value)) {
        //             return;
        //         }
        //         break;
        // default:
        //     break;
        // }
        this.setState({
            [name]: value,
            [errName]: ""
        })
    }

    clickOnFormSubmit = () => {
        this.onFormSubmit();
    }

    onFormSubmit = async (e) => {
        //e.preventDefault();
        if (
            !this.islabelValid() ||
            !this.isshortLabelValid()
        ) { return; }
        let myForm = document.getElementById('myForm');
        const data = new FormData(myForm);
        this.setState({ isLoading: true });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C09CommonCourseSelectionGroupSave`;
        await fetch(url, {
            method: "POST",
            body: data,
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
            .then(
                json => {
                    if (json.CODE === 1) {
                        this.handleOpenSnackbar(json.USER_MESSAGE, "success");
                        setTimeout(() => {
                            if (this.state.recordId != 0) {
                                window.location = "#/dashboard/F09Reports";
                            } else {
                                window.location.reload();
                            }
                        }, 2000);
                    } else {
                        this.handleOpenSnackbar(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE, "error");
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
                        this.handleOpenSnackbar("Failed to Save ! Please try Again later.", "error");
                    }
                });
        this.setState({ isLoading: false })
    }

    getSessionData = async (index) => {
        const data = new FormData();
        data.append("id", index);
        this.setState({ isLoading: true });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C08CommonProgrammeGroupsView`;
        await fetch(url, {
            method: "POST",
            body: data,
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
            .then(
                json => {
                    if (json.CODE === 1) {
                        // this.handleOpenSnackbar(json.USER_MESSAGE,"success");
                        this.setState({
                            AcademicSessions: json.DATA,

                        });
                    } else {
                        this.handleOpenSnackbar(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE, "error");
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
                        this.handleOpenSnackbar("Failed to Save ! Please try Again later.", "error");
                    }
                });
        this.setState({ isLoading: false })
    }

    getProgrammesGroupData = async (index) => {
        const data = new FormData();
       
        this.setState({ isLoading: true });
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C18CommonProgrammeGroupsView`;
        await fetch(url, {
            method: "POST",
            // body: data,
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
            .then(
                json => {
                    if (json.CODE === 1) {
                        // this.handleOpenSnackbar(json.USER_MESSAGE,"success");
                        this.setState({
                            ProgrammesGroup: json.DATA,

                        });
                    } else {
                        this.handleOpenSnackbar(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE, "error");
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
                        this.handleOpenSnackbar("Failed to Save ! Please try Again later.", "error");
                    }
                });
        this.setState({ isLoading: false })
    }


    viewReport = () => {
        window.location = "#/dashboard/F18Reports";
    }

    componentDidMount() {
        if (this.state.recordId != 0) {
            this.loadData(this.state.recordId);
        }
        this.getProgrammesGroupData();
    }

    render() {

        const { classes } = this.props;

        return (
            <Fragment>
                <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })} />
                <form id="myForm" onSubmit={this.isFormValid}>
                    <TextField type="hidden" name="recordId" value={this.state.recordId} />
                    <Grid container component="main" className={classes.root}>
                        <Typography style={{
                            color: '#1d5f98', fontWeight: 600, borderBottom: '1px solid #d2d2d2',
                            width: '98%', marginBottom: 25, fontSize: 20
                        }} variant="h5">
                            Define Session & Offer Programmes
                        </Typography>
                        <Divider style={{
                            backgroundColor: 'rgb(58, 127, 187)',
                            opacity: '0.3'
                        }}
                        />
                        <Grid
                            container
                            spacing={2}
                            style={{
                                marginLeft: 5,
                                marginRight: 10
                            }}
                        >

                            <Grid item xs={12}>
                                <TextField
                                    id="academicSessionsId"
                                    name="academicSessionsId"
                                    required
                                    fullWidth
                                    select
                                    // size="small"
                                    label="Academics Session"
                                    variant="outlined"
                                    onChange={this.onHandleChange}
                                    value={this.state.AcademicSessionsId}
                                    error={this.state.AcademicSessionsIdError}
                                    helperText={this.state.AcademicSessionsIdError}
                                >
                                    {this.state.AcademicSessions.map((item) => (
                                        <MenuItem key={item.ID} value={item.ID}>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Divider style={{
                                backgroundColor: 'rgb(58, 127, 187)',
                                opacity: '0.3',
                                marginTop: 100
                            }}
                            />
                            <Typography style={{
                                color: '#1d5f98', fontWeight: 600,
                                width: '98%', marginBottom: 5, fontSize: 18
                            }} variant="h6">
                                Offer Programme
                                    </Typography>

                            <Grid  item xs={12}>
                                <Card className={classes.root}>
                                    <CardContent>
                                        <Grid  item xs={12}>
                                          
                                            {/* <ProgrGroupCheckboxes ProgrammesGroup={this.state.ProgrammesGroup}/>
                                                         */}
                                               {this.state.ProgrammesGroup.map((item) => (
                                                // <ProgrGroupCheckboxes key={item.ID} value={item.ID}/>
                                                <ProgrGroupCheckboxes  key={item.ID} value={item.label}  valueID={item.ID} /> 
                                            ))}                    
                                            <Grid item xs={5}>
                                                <Typography style={{
                                                           
                                                            width: '98%', marginBottom: 5, fontSize: 18
                                                        }}  className={classes.title} color="textSecondary" gutterBottom>
                                                    School Of Law
                                                 </Typography>
                                                 <div>
                                                    <input 
                                                    type="hidden" 
                                                    name="isEntryTestApplicable"
                                                    value="1"
                                                    disabled={!this.state.entry_test_applicable}
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                //defaultChecked
                                                                color="primary"
                                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                            />
                                                        }
                                                        style={{
                                                            color: '#1d5f98', fontWeight: 600,
                                                            width: '98%', marginBottom: 5, fontSize: 12
                                                        }} 
                                                        label="LLB"
                                                    />
                                                     <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                //defaultChecked
                                                                color="primary"
                                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                            />
                                                        }
                                                        style={{
                                                            color: '#1d5f98', fontWeight: 600,
                                                            width: '98%', marginBottom: 5, fontSize: 12
                                                        }} 
                                                        label="CertHE Common Law "
                                                    />
                                                     <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                //defaultChecked
                                                                color="primary"
                                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                            />
                                                        }
                                                        style={{
                                                            color: '#1d5f98', fontWeight: 600,
                                                            width: '98%', marginBottom: 5, fontSize: 12
                                                        }} 
                                                        label="Graduate Diploma in Commercial Law"
                                                    />


                                                </div>
                                                
                                                
                                                <Typography style={{
                                                           
                                                           width: '98%', marginBottom: 5, fontSize: 18
                                                       }}   className={classes.title} color="textSecondary" gutterBottom>
                                                    School of GCE
                                                 </Typography>
                                                 <div>
                                                   
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                //defaultChecked
                                                                color="primary"
                                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                            />
                                                        }
                                                        label="A-Level"
                                                        style={{
                                                            color: '#1d5f98', fontWeight: 600,
                                                            width: '98%', marginBottom: 5, fontSize: 12
                                                        }} 
                                                    />
                                                    
                                                   


                                                </div>
                                               
                                                
                                            </Grid>
                                        </Grid>
                                    </CardContent>

                                </Card>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                style={{
                                    paddingBottom: 20,
                                    paddingTop: 20,
                                    display: 'flex'
                                }}
                            >
                                {/* 
                                <Button 
                                    disabled={this.state.isLoading} 
                                    onClick={this.onFormSubmit}
                                    color="primary" 
                                    variant="contained" 
                                    fullWidth={true}
                                    style={{ 
                                        backgroundColor: '#174A84' 
                                    }}
                                >
                                    {this.state.isLoading ? 
                                        <CircularProgress style={{ color: 'white' }} size={24} /> 
                                        : 
                                        "Save"
                                    }
                                </Button>  
                                */}
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
                <BottomBar
                    left_button_text="View"
                    left_button_hide={false}
                    bottomLeftButtonAction={this.viewReport}
                    right_button_text="Save"
                    bottomRightButtonAction={this.clickOnFormSubmit}
                    loading={this.state.isLoading}
                    isDrawerOpen={this.props.isDrawerOpen}
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
export default withStyles(styles)(F18Form);