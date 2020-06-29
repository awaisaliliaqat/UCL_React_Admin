import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/styles';
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";
import LoginMenu from '../../../../components/LoginMenu/LoginMenu';
//import { alphabetExp, numberExp, emailExp } from '../../../../utils/regularExpression';
import { TextField, Grid, Button, CircularProgress } from '@material-ui/core';
import BottomBar from "../../../../components/BottomBar/BottomBar";

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

class F06Form extends Component {

    constructor(props) {
        super(props);
        this.state = {
            recordId: this.props.match.params.recordId,
            isLoading: false,
            isReload: false,
            label:"",
            labelError:"",
            shortLabel:"",
            shortLabelError:""
        }
    }

    loadData = async(index) => {
        const data = new FormData();
        data.append("id",index);
        this.setState({isLoading: true});
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C06CommonSchoolsView`;
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
                       this.setState({
                           label:json.DATA[0].label,
                           shortLabel:json.DATA[0].shortLabel
                       });
                    } else {
                        alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE)
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
                        alert("Failed to Save ! Please try Again later.")
                    }
                });
        this.setState({isLoading: false})
    }

    islabelValid = () => {
        let isValid = true;
        if (!this.state.label) {
            this.setState({labelError:"Please enter School Name."});
            document.getElementById("label").focus();
            isValid = false;
        } else {
            this.setState({labelError:""});
        }
        return isValid;
    }

    isshortLabelValid = () => {
        let isValid = true;        
        if (!this.state.shortLabel) {
            this.setState({shortLabelError:"Please enter Short Name."});
            document.getElementById("shortLabel").focus();
            isValid = false;
        } else {
            this.setState({shortLabelError:""});
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

    clickOnFormSubmit=()=>{
        this.onFormSubmit();
    }

     onFormSubmit = async(e) => {
        //e.preventDefault();
        if(
            !this.islabelValid() || 
            !this.isshortLabelValid()
        ){ return; }
        let myForm = document.getElementById('myForm');
        const data = new FormData(myForm);
        this.setState({isLoading: true});
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C06CommonSchoolsSave`;
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
                        alert(json.USER_MESSAGE);
                        if(this.state.recordId!=0){
                            window.location = "#/dashboard/F06Reports";
                        }else{
                            window.location.reload();
                        }
                    } else {
                        alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE)
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
                        alert("Failed to Save ! Please try Again later.")
                    }
                });
        this.setState({isLoading: false})
    }

    
    viewReport = () => {
        window.location = "#/dashboard/F06Reports";
    }

    componentDidMount() {
        if(this.state.recordId!=0){
            this.loadData(this.state.recordId);
        }
    }

    render() {

        const { classes } = this.props;

        return (
            <Fragment>
                <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })} />
                <form id="myForm" onSubmit={this.isFormValid}>
                    <TextField type="hidden" name="recordId" value={this.state.recordId}/>
                    <Grid container component="main" className={classes.root}>
                        <Typography style={{
                            color: '#1d5f98', fontWeight: 600, borderBottom: '1px solid #d2d2d2',
                            width: '98%', marginBottom: 25, fontSize: 20
                        }} variant="h5">
                            Define Schools 
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
                            {/*
                            <Grid xs={12}>
                                <span className={classes.sectionTitle}>
                                    Course Applied For
                                </span>
                            </Grid>
                            */}
                                <Grid item xs={6}>
                                    <TextField
                                        id="label"
                                        name="label"
                                        label="School Name"
                                        required
                                        fullWidth
                                        onKeyDown={this.StopEnter}
                                        onChange={this.onHandleChange}
                                        value={this.state.label}
                                        error={!!this.state.labelError}
                                        helperText={this.state.labelError}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="shortLabel"
                                        name="shortLabel"
                                        label="Short Name"
                                        required
                                        fullWidth
                                        onKeyDown={this.StopEnter}
                                        onChange={this.onHandleChange}
                                        value={this.state.shortLabel}
                                        error={!!this.state.shortLabelError}
                                        helperText={this.state.shortLabelError}
                                    />
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
                    right_button_text="Save"
                    bottomRightButtonAction={this.clickOnFormSubmit}
                    bottomLeftButtonAction={this.viewReport}
                    loading={this.state.isLoading}
                />
            </Fragment>
        );
    }
}
export default withStyles(styles)(F06Form);