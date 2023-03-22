/* eslint-disable react/no-unescaped-entities */
import React, { Component, Fragment } from 'react';
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
// import MuiDialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Logo from '../assets/Images/logo.png';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { Link } from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';



const styles = (theme) => ({
    closeButton: {
        top: theme.spacing(1),
        right: theme.spacing(2),
        zIndex: 1,
        border: '1px solid #b3b3b3',
        borderRadius: 0,
        position: 'fixed',
        padding: 5,
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
    tagTitle: {
        padding: 6,
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 'larger',
        backgroundColor: '#2f57a5',
        color: 'white',
        '-webkit-print-color-adjust': 'exact',
        'color-adjust': 'exact',
    },
    image: {
        height: 140,
        width: 130,
        border: '1px solid',
        marginLeft: 50,
        textAlign: 'center',
        marginTop: '-25px',
        backgroundSize: 'cover',
        backgroundpPosition: 'center',
        backgroundRepeat: 'no-repeat',
        '-webkit-print-color-adjust': 'exact',
        'color-adjust': 'exact',
    },
    flexColumn: {
        display: 'flex',
        flexDirection: 'column'
    },
    valuesContainer: {
        backgroundColor: 'rgb(47, 87, 165)',
        color: 'white',
        '-webkit-print-color-adjust': 'exact',
        'color-adjust': 'exact',
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
        marginLeft: '3%',
        display: 'flex',
        alignItems: 'flex-start',
    }
});

class DisplayAdmissionApplications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            documentData: [],
            data: {},
            isLoading: false,
            isLoginMenu: false,
            isReload: false,
        }
    }

    componentDidMount() {
        // eslint-disable-next-line react/prop-types
        const { id = 0 } = this.props.match.params
        this.getAddmissionForm(id);
    }

    getAddmissionForm = async id => {
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C02AdmissionsProspectApplicationSubmittedApplicationsStudentProfileView?applicationId=${id}`;
        this.setState({
            isLoading: true
        })
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
            .then(
                json => {
                    if (json.CODE === 1) {
                        if (json.DATA) {
                            if (json.DATA.length > 0) {
                                this.setState({
                                    data: json.DATA[0] || {},
                                });
                            } else {
                                alert('Geting Data empty, Please try again later.')
                            }
                        } else {
                            alert('Geting Data empty, Please try again later.')
                        }
                    } else {
                        alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE)
                    }
                },
                error => {
                    if (error.status === 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: true
                        })
                    } else {
                        alert('Failed to fetch, Please try again later.');
                    }
                });

        const url2 = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C02AdmissionsProspectApplicationDocumentsView?applicationId=${id}`;
        await fetch(url2, {
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
            .then(
                json => {
                    if (json.DATA) {
                        this.setState({
                            documentData: json.DATA || []
                        })
                    }
                },
                error => {
                    if (error.status === 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: true
                        })
                    } else {
                        alert('Failed to fetch, Please try again later.');
                    }
                }
            );

        this.setState({
            isLoading: false,
        })

    }

    onDownload = (fileName) => {
        const url = `${process.env.REACT_APP_API_DOMAIN}/${
            process.env.REACT_APP_SUB_API_NAME
            }/common/CommonViewFile?fileName=${encodeURIComponent(fileName)}`;

        fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclAdminToken"),
            }),
        })
            .then((res) => {
                if (res.status === 200) {
                    return res.blob();
                } else if (res.status === 401) {
                    this.setState({
                        isLoginMenu: true,
                        isReload: false
                    })
                    return {}
                } else {
                    alert('Operation Failed, Please try again later.');
                    return {}
                }
            })
            .then((result) => {
                var csvURL = window.URL.createObjectURL(result);
                var tempLink = document.createElement("a");
                tempLink.href = csvURL;
                tempLink.setAttribute("download", fileName);
                tempLink.click();
                if (result.CODE === 1) {
                    //Code
                } else if (result.CODE === 2) {
                    alert(
                        "SQL Error (" +
                        result.CODE +
                        "): " +
                        result.USER_MESSAGE +
                        "\n" +
                        result.SYSTEM_MESSAGE
                    );
                } else if (result.CODE === 3) {
                    alert(
                        "Other Error (" +
                        result.CODE +
                        "): " +
                        result.USER_MESSAGE +
                        "\n" +
                        result.SYSTEM_MESSAGE
                    );
                } else if (result.error === 1) {
                    alert(result.error_message);
                } else if (result.success === 0 && result.redirect_url !== "") {
                    window.location = result.redirect_url;
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    render() {
        const { classes } = this.props;
        const { data, documentData } = this.state;
        const alevelData = data.alevelAcademicsSubjects || [];
        const interData = data.graduationAcademicsSubjectsInter || [];
        const bachData = data.graduationAcademicsSubjectsBachelors || [];
        const otherQualiications = data.otherQualifications || [];
        const activitiesData = data.coCurricularActivities || [];
        const workExperience = data.workExperience || [];
        const uclRelationData = data.relativesStatus || [];
        const aLevelSubjectData = data.alevelTakenSubjects || [];
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
                <div style={{
                    marginTop: 10,
                    marginLeft: 10,
                    marginRight: 10,
                }}>
                    <IconButton onClick={() => window.close()} aria-label="close" className={classes.closeButton}>
                        <CloseIcon />
                    </IconButton>
                    <div className={classes.headerContainer}>
                        <img alt="" src={Logo} width={100} />
                        <div className={classes.titleContainer}>
                            <span className={classes.title}>Universal College Lahore</span>
                            <span className={classes.subTitle}>(a project of UCL pvt Ltd)</span>
                        </div>
                    </div>
                    <div className={classes.tagTitleContainer}>
                        <div className={classes.flexColumn}>
                            <span className={classes.tagTitle}>Application for Admission</span>
                            <span className={classes.tagTitle}>{data.degreeId === 17 ? 'A Level Programme' : 'Undergraduate Programme'}</span>
                            <span className={classes.tagTitle}>Application ID: {data.id}</span>
                        </div>

                        <div className={classes.image} style={{
                            backgroundImage: `url(${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C01AdmissionsProspectApplicationImageView?fileName=${data.imageName})`,
                        }}>
                        </div>
                    </div>

                    <div className={classes.flexColumn}>
                        <div className={classes.valuesContainer}>
                            <span style={{
                                fontSize: 'larger'
                            }}>
                                Course Applied For
                        </span>
                        </div>

                        <div style={{
                            marginLeft: '3%',
                            marginTop: '2%',
                            marginBottom: '1%'
                        }}>
                            <span className={classes.tagValue}>{data.degreeLabel}</span>
                            <span style={{
                                marginLeft: "4%"
                            }} className={classes.tagValue}>{data.academicSessionLabel}</span>
                        </div>
                        {data.degreeId === 11 &&
                            <Fragment>
                                <div className={classes.valuesContainer}>
                                    <span style={{
                                        fontSize: 'larger'
                                    }}>
                                        Specify	the	degree	you	wish	to	transfer	to	after	completing	the	CHESS
                        </span>
                                </div>
                                <div style={{
                                    marginLeft: '3%',
                                    marginTop: '2%',
                                    marginBottom: '1%'
                                }}>
                                    <span className={classes.tagValue}>{data.chessDegreeTransferLabel}</span>
                                </div>
                            </Fragment>
                        }
                        {data.degreeId === 17 &&
                            <Fragment>
                                <div className={classes.flexColumn}>
                                    <div className={classes.valuesContainer}>
                                        <span style={{
                                            fontSize: 'larger'
                                        }}>
                                            Year for A Level Admission
                        </span>
                                    </div>
                                    <div style={{
                                        marginLeft: '3%',
                                        marginTop: '2%',
                                        marginBottom: '1%'
                                    }}>
                                        <span className={classes.tagValue}>{`${data.alevelAdmissionYear} Year`}</span>
                                    </div>
                                </div>
                            </Fragment>
                        }
                        <div className={classes.valuesContainer}>
                            <span style={{
                                fontSize: 'larger'
                            }}>
                                Category
                        </span>
                        </div>
                        <div style={{
                            marginLeft: '3%',
                            marginTop: '2%',
                            marginBottom: '1%'
                        }}>
                            <span className={classes.tagValue}>{data.isTransferCandidate === 1 ? 'Transfer' : 'New'}</span>
                        </div>
                        <div style={{
                            backgroundColor: 'rgb(47, 87, 165)',
                            color: 'white',
                            '-webkit-print-color-adjust': 'exact',
                            'color-adjust': 'exact',
                            padding: 6,
                            marginTop: 10
                        }}>
                            <span style={{
                                fontSize: 'larger'
                            }}>
                                Personal Information
                        </span>
                        </div>


                        <div className={classes.fieldValuesContainer} style={{
                            marginTop: '1%',
                        }}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                Name
                           </div>
                            <div className={classes.value} style={{
                                width: '25%',
                            }}>
                                {data.firstName}
                            </div>
                            <div className={classes.value} style={{
                                width: '25%',
                                textAlign: `${data.middleName ? 'left' : 'center'}`
                            }}>
                                {data.middleName || '-'}
                            </div>
                            <div className={classes.value} style={{
                                width: '25%',
                            }}>
                                {data.lastName}
                            </div>
                        </div>

                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                Date of Birth
                           </div>
                            <div className={classes.value}>
                                {data.dateOfBirth}
                            </div>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                marginLeft: 15,
                                textAlign: 'center'
                            }}>
                                Gender
                           </div>
                            <div className={classes.value}>
                                {data.genderLabel}
                            </div>
                        </div>

                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                Nationality
                           </div>
                            <div className={classes.value}>
                                {data.nationalityLabel}
                            </div>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                marginLeft: 15,
                                textAlign: 'center'
                            }}>
                                {data.studentIdentityLabel || 'CNIC'}
                            </div>
                            <div className={classes.value}>
                                {data.studentIdentity === 1 && data.cnicBform}
                                {data.studentIdentity === 2 && data.passportNumber}
                                {data.studentIdentity === 3 && data.nicopNumber}
                                {data.studentIdentity === 4 && data.cnicBform}
                            </div>
                        </div>

                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                Mobile Number
                           </div>
                            <div className={classes.value}>
                                {data.mobileNo}
                            </div>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                marginLeft: 15,
                                textAlign: 'center'
                            }}>
                                Email
                           </div>
                            <div className={classes.value}>
                                {data.email}
                            </div>
                        </div>

                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                Blood Group
                           </div>
                            <div className={classes.value}>
                                {data.bloodGroupLabel}
                            </div>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                marginLeft: 15,
                                textAlign: 'center'
                            }}>
                                Marital Status
                           </div>
                            <div className={classes.value}>
                                {data.maritalStatusLabel}
                            </div>
                        </div>

                        <div className={classes.valuesContainer} >
                            <span style={{
                                fontSize: 'larger',
                            }}>
                                Permanent Address
                        </span>
                        </div>

                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                Address
                           </div>
                            <div className={classes.value} style={{
                                width: '80%',
                            }}>
                                {data.permanentAddress}
                            </div>
                        </div>

                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                Country
                           </div>
                            <div className={classes.value}>
                                {data.permanentCountryLabel}
                            </div>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                marginLeft: 15,
                                textAlign: 'center'
                            }}>
                                Province
                           </div>
                            <div className={classes.value}>
                                {data.permanentProvinceLabel}
                            </div>
                        </div>


                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                City
                           </div>
                            <div className={classes.value}>
                                {data.permanentCityLabel}
                            </div>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                marginLeft: 15,
                                textAlign: 'center'
                            }}>
                                Postal Code
                           </div>
                            <div className={classes.value}>
                                {data.permanentPostalCode}
                            </div>
                        </div>
                        <div className={classes.valuesContainer}>
                            <span style={{
                                fontSize: 'larger',
                            }}>

                                Present Address
                        </span>
                        </div>
                        {data.mailingAddressTypeId === 1 && (
                            <div style={{
                                marginLeft: '3%',
                                marginTop: '2%',
                                marginBottom: '1%'
                            }}>
                                <span className={classes.tagValue}>{data.mailingAddressTypeLabel}</span>
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
                                }}>
                                    {data.mailingAddress}
                                </div>
                            </div>

                            <div className={classes.fieldValuesContainer}>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    textAlign: 'center'
                                }}>
                                    Country
                           </div>
                                <div className={classes.value}>
                                    {data.mailingCountryLabel}
                                </div>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    marginLeft: 15,
                                    textAlign: 'center'
                                }}>
                                    Province
                           </div>
                                <div className={classes.value}>
                                    {data.mailingProvinceLabel}
                                </div>
                            </div>


                            <div className={classes.fieldValuesContainer}>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    textAlign: 'center'
                                }}>
                                    City
                           </div>
                                <div className={classes.value}>
                                    {data.mailingCityLabel}
                                </div>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    marginLeft: 15,
                                    textAlign: 'center'
                                }}>
                                    Postal Code
                           </div>
                                <div className={classes.value}>
                                    {data.mailingPostalCode}
                                </div>
                            </div>
                        </Fragment>)}

                        <div className={classes.valuesContainer}>
                            <span style={{
                                fontSize: 'larger'
                            }}>
                                Father's Information
                        </span>
                        </div>

                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                Title
                           </div>
                            <div className={classes.value}>
                                {data.fatherTitleLabel}
                            </div>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                marginLeft: 15,
                                textAlign: 'center'
                            }}>
                                Name
                           </div>
                            <div className={classes.value}>
                                {data.fatherName}
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
                                <div className={classes.value}>
                                    {data.fatherCnicPassport}
                                </div>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    marginLeft: 15,
                                    textAlign: 'center'
                                }}>
                                    Mobile Number
                           </div>
                                <div className={classes.value}>
                                    {data.fatherMobileNo}
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
                                <div className={classes.value}>
                                    {data.fatherOccupationLabel}
                                </div>
                            </div>
                        </Fragment>)}

                        <div className={classes.valuesContainer}>
                            <span style={{
                                fontSize: 'larger'
                            }}>
                                Mother's Information
                        </span>
                        </div>

                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                Title
                           </div>
                            <div className={classes.value}>
                                {data.motherTitleLabel}
                            </div>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                marginLeft: 15,
                                textAlign: 'center'
                            }}>
                                Name
                           </div>
                            <div className={classes.value}>
                                {data.motherName}
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
                                <div className={classes.value}>
                                    {data.motherCnicPassport}
                                </div>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    marginLeft: 15,
                                    textAlign: 'center'
                                }}>
                                    Mobile Number
                           </div>
                                <div className={classes.value}>
                                    {data.motherMobileNo}
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
                                <div className={classes.value}>
                                    {data.motherOccupationLabel}
                                </div>
                            </div>

                        </Fragment>)}

                        <div className={classes.valuesContainer}>
                            <span style={{
                                fontSize: 'larger'
                            }}>
                                Guardian's Information
                        </span>
                        </div>

                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                Title
                           </div>
                            <div className={classes.value}>
                                {data.guardianTitleLabel}
                            </div>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                marginLeft: 15,
                                textAlign: 'center'
                            }}>
                                Name
                           </div>
                            <div className={classes.value}>
                                {data.guardianName}
                            </div>
                        </div>

                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                {data.guardianIdentityTypeLabel || 'CNIC'}
                            </div>
                            <div className={classes.value}>
                                {data.guardianCnicPassport}
                            </div>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                marginLeft: 15,
                                textAlign: 'center'
                            }}>
                                Mobile Number
                           </div>
                            <div className={classes.value}>
                                {data.guardianMobileNo}
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
                            <div className={classes.value}>
                                {data.guardianOccupationLabel}
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
                            }}>
                                {data.guardianRelationWithStudentLabel}
                            </div>
                        </div>
                        {data.degreeId === 17 && (<Fragment>
                            <div className={classes.valuesContainer}>
                                <span style={{
                                    fontSize: 'larger'
                                }}>
                                    Financial
                        </span>
                            </div>
                            <span style={{ marginBottom: 10 }}>Name/address/profession of the person(s) responsible for the payment of tuition fee and other expenses.</span>

                            <div className={classes.fieldValuesContainer}>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    textAlign: 'center'
                                }}>
                                    Name
                           </div>
                                <div className={classes.value}>
                                    {data.financialName || '-'}
                                </div>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    marginLeft: 15,
                                    textAlign: 'center'
                                }}>
                                    Profession
                           </div>
                                <div className={classes.value}>
                                    {data.financialProfession || '-'}
                                </div>
                            </div>

                            <div className={classes.fieldValuesContainer}>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    textAlign: 'center'
                                }}>
                                    Address
                           </div>
                                <div style={{ width: '80%' }} className={classes.value}>
                                    {data.financialAddress || '-'}
                                </div>
                            </div>
                        </Fragment>)}


                        <div className={classes.valuesContainer}>
                            <span style={{
                                fontSize: 'larger'
                            }}>
                                Academics
                        </span>
                        </div>
                        {data.degreeId === 17 && (<Fragment>
                            <span style={{ marginBottom: 10 }}>Name and address of school last attended.</span>


                            <div className={classes.fieldValuesContainer}>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    textAlign: 'center'
                                }}>
                                    Name
                           </div>
                                <div className={classes.value}>
                                    {data.olevelSchoolName || '-'}
                                </div>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    marginLeft: 15,
                                    textAlign: 'center'
                                }}>
                                    Address
                           </div>
                                <div className={classes.value}>
                                    {data.olevelSchoolAddress || '-'}
                                </div>
                            </div>

                            <div className={classes.valuesContainer}>
                                <span style={{
                                    fontSize: 'larger'
                                }}>
                                    ‘O’ Level (or equivalent) examination results. In the ‘Exam Grade’ column write RA if results are awaited and TBT if exams are yet to be taken.
                        </span>
                            </div>

                            <table style={{
                                borderCollapse: 'collapse', marginLeft: '3%', marginTop: '1%',
                                marginBottom: '1%'
                            }}>
                                <tr>
                                    <th style={{
                                        border: '1px solid',
                                        padding: 10,
                                    }}>Subject</th>
                                    <th style={{
                                        border: '1px solid',
                                        padding: 10
                                    }}>Exam Title</th>
                                    <th style={{
                                        border: '1px solid',
                                        padding: 10
                                    }}>Board</th>
                                    <th style={{
                                        border: '1px solid',
                                        padding: 10
                                    }}>Session</th>
                                    <th style={{
                                        border: '1px solid',
                                        padding: 10
                                    }}>Grade</th>
                                </tr>
                                {
                                    alevelData.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td style={{
                                                    border: '1px solid',
                                                    padding: 10
                                                }}>{item.subject}</td>
                                                <td style={{
                                                    border: '1px solid',
                                                    padding: 10
                                                }}>{item.examTitle}</td>
                                                <td style={{
                                                    border: '1px solid',
                                                    padding: 10
                                                }}>{item.board}</td>
                                                <td style={{
                                                    border: '1px solid',
                                                    padding: 10
                                                }}>{item.session}</td>
                                                <td style={{
                                                    border: '1px solid',
                                                    padding: 10
                                                }}>{item.grade}</td>
                                            </tr>
                                        );
                                    })
                                }
                            </table>
                        </Fragment>)}

                        {data.degreeId !== 17 && (<Fragment>

                            <div className={classes.valuesContainer} style={{
                                marginBottom: 5
                            }}>
                                <span style={{
                                    fontSize: 'larger'
                                }}>
                                    Section 1: O-Level/FA/FSc/ICom/ICS/High School Diploma (Grade 12) or equivalent
                        </span>
                            </div>
                            <span style={{ marginBottom: 10 }}>State below the results of your subjects. These must include English Language and Maths (if taken). Where applicable the overall grade/marks must also be stated. Tick where appropriate.</span>

                            <div style={{
                                marginLeft: '3%',
                                display: 'flex'
                            }}>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    textAlign: 'center'
                                }}>
                                    Name of Awarding Body
                           </div>
                                <div className={classes.value}>
                                    {data.interAwardingBody || '-'}
                                </div>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    marginLeft: 15,
                                    textAlign: 'center'
                                }}>
                                    Name of Institution
                           </div>
                                <div className={classes.value}>
                                    {data.interInstitution || '-'}
                                </div>
                            </div>


                            <div className={classes.fieldValuesContainer}>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    textAlign: 'center'
                                }}>
                                    Qualification
                           </div>
                                <div className={classes.value}>
                                    {data.interQualification || '-'}
                                </div>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    marginLeft: 15,
                                    textAlign: 'center'
                                }}>
                                    Year Awarded
                           </div>
                                <div className={classes.value}>
                                    {data.interYearAwarded || '-'}
                                </div>
                            </div>


                            <div className={classes.fieldValuesContainer}>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    textAlign: 'center'
                                }}>
                                    Result Awaited
                           </div>
                                <div className={classes.value}>
                                    {data.interIsResultAwaiting === 1 ? 'Yes' : 'No'}
                                </div>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    marginLeft: 15,
                                    textAlign: 'center'
                                }}>
                                    Overall Grade/Marks
                           </div>
                                <div className={classes.value}>
                                    {data.interMarks || '-'}
                                </div>
                            </div>

                            <table style={{
                                borderCollapse: 'collapse', marginLeft: '3%', marginTop: '1%',
                                marginBottom: '1%'
                            }}>
                                <tr>
                                    <th style={{
                                        border: '1px solid',
                                        padding: 10,
                                        width: '50%'
                                    }}>Subject</th>
                                    <th style={{
                                        border: '1px solid',
                                        padding: 10
                                    }}>Grade/Marks</th>
                                </tr>
                                <tbody>
                                    {interData.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td style={{
                                                    border: '1px solid',
                                                    padding: 10
                                                }}>{item.subject}</td>
                                                <td style={{
                                                    border: '1px solid',
                                                    padding: 10
                                                }}>{item.grade}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            <div className={classes.valuesContainer} style={{
                                marginBottom: 5
                            }}>
                                <span style={{
                                    fontSize: 'larger'
                                }}>
                                    Section 2: A-Level/BA/BSc/BCom/BCS/AP Exams after Grade 12 or equivalent
                        </span>
                            </div>
                            <span style={{ marginBottom: 10 }}>State below the results of your subjects.Where applicable the overall grade/marks must also be sated.</span>

                            <div className={classes.fieldValuesContainer}>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    textAlign: 'center'
                                }}>
                                    Name of Awarding Body
                           </div>
                                <div className={classes.value}>
                                    {data.bachelorsAwardingBody || '-'}
                                </div>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    marginLeft: 15,
                                    textAlign: 'center'
                                }}>
                                    Name of Institution
                           </div>
                                <div className={classes.value}>
                                    {data.bachelorsInstitution || '-'}
                                </div>
                            </div>


                            <div className={classes.fieldValuesContainer}>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    textAlign: 'center'
                                }}>
                                    Qualification
                           </div>
                                <div className={classes.value}>
                                    {data.bachelorsQualification || '-'}
                                </div>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    marginLeft: 15,
                                    textAlign: 'center'
                                }}>
                                    Year Awarded
                           </div>
                                <div className={classes.value}>
                                    {data.bachelorsYearAwarded || '-'}
                                </div>
                            </div>


                            <div className={classes.fieldValuesContainer}>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    textAlign: 'center'
                                }}>
                                    Result Awaited
                           </div>
                                <div className={classes.value}>
                                    {data.bachelorsIsResultAwaiting === 1 ? 'Yes' : 'No'}
                                </div>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    marginLeft: 15,
                                    textAlign: 'center'
                                }}>
                                    Overall Grade/Marks
                           </div>
                                <div className={classes.value}>
                                    {data.bachelorsGrade || '-'}
                                </div>
                            </div>

                            <table style={{
                                borderCollapse: 'collapse', marginLeft: '3%', marginTop: '1%',
                                marginBottom: '1%'
                            }}>
                                <tr>
                                    <th style={{
                                        border: '1px solid',
                                        padding: 10,
                                        width: '50%'
                                    }}>Subject</th>
                                    <th style={{
                                        border: '1px solid',
                                        padding: 10
                                    }}>Grade/Marks</th>
                                </tr>
                                {bachData.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td style={{
                                                border: '1px solid',
                                                padding: 10
                                            }}>{item.subject}</td>
                                            <td style={{
                                                border: '1px solid',
                                                padding: 10
                                            }}>{item.grade}</td>
                                        </tr>
                                    );
                                })}
                            </table>
                        </Fragment>)}

                        <div className={classes.valuesContainer}>
                            <span style={{
                                fontSize: 'larger'
                            }}>
                                Other Qualification
                        </span>
                        </div>

                        <table style={{
                            borderCollapse: 'collapse', marginLeft: '3%', marginTop: '1%',
                            marginBottom: '1%'
                        }}>
                            <tr>
                                <th style={{
                                    border: '1px solid',
                                    padding: 10,
                                }}>Name of Awarding Body</th>
                                <th style={{
                                    border: '1px solid',
                                    padding: 10
                                }}>Name of Institution</th>
                                <th style={{
                                    border: '1px solid',
                                    padding: 10
                                }}>Qualification</th>
                            </tr>
                            {otherQualiications.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={{
                                            border: '1px solid',
                                            padding: 10
                                        }}>{item.awardingBody}</td>
                                        <td style={{
                                            border: '1px solid',
                                            padding: 10
                                        }}>{item.institution}</td>
                                        <td style={{
                                            border: '1px solid',
                                            padding: 10
                                        }}>{item.qualification}</td>
                                    </tr>
                                );
                            })}
                        </table>

                        <div className={classes.valuesContainer}>
                            <span style={{
                                fontSize: 'larger'
                            }}>
                                Extra and Co-Curricular Activities
                        </span>
                        </div>

                        <table style={{
                            borderCollapse: 'collapse', marginLeft: '3%', marginTop: '1%',
                            marginBottom: '1%'
                        }}>
                            <tr>
                                <th style={{
                                    border: '1px solid',
                                    padding: 10,
                                    width: '20%'
                                }}>Name of Institution</th>
                                <th style={{
                                    border: '1px solid',
                                    padding: 10,
                                    width: '20%'
                                }}>Tenure (Months)</th>
                                <th style={{
                                    border: '1px solid',
                                    padding: 10,
                                    width: '20%'
                                }}>Activity</th>
                                <th style={{
                                    border: '1px solid',
                                    padding: 10,
                                    width: '20%'
                                }}>Position</th>
                                <th style={{
                                    border: '1px solid',
                                    padding: 10,
                                    width: '20%'
                                }}>Nature of Position Held</th>
                            </tr>
                            {activitiesData.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={{
                                            border: '1px solid',
                                            padding: 10
                                        }}>{item.institution}</td>
                                        <td style={{
                                            border: '1px solid',
                                            padding: 10
                                        }}>{item.tenureMonths}</td>
                                        <td style={{
                                            border: '1px solid',
                                            padding: 10
                                        }}>{item.activity}</td>
                                        <td style={{
                                            border: '1px solid',
                                            padding: 10
                                        }}>{item.position}</td>
                                        <td style={{
                                            border: '1px solid',
                                            padding: 10
                                        }}>{item.natureOfPositionHeld}</td>
                                    </tr>
                                );
                            })}
                        </table>
                        {data.degreeId !== 17 && (<Fragment>
                            <div className={classes.valuesContainer}>
                                <span style={{
                                    fontSize: 'larger'
                                }}>
                                    Work Experience
                        </span>
                            </div>

                            <table style={{
                                borderCollapse: 'collapse', marginLeft: '3%', marginTop: '1%',
                                marginBottom: '1%'
                            }}>
                                <tr>
                                    <th style={{
                                        border: '1px solid',
                                        padding: 10,
                                        width: '20%'
                                    }}>Organization</th>
                                    <th style={{
                                        border: '1px solid',
                                        padding: 10,
                                        width: '20%'
                                    }}>Tenure (Months)</th>
                                    <th style={{
                                        border: '1px solid',
                                        padding: 10,
                                        width: '20%'
                                    }}>Activity</th>
                                    <th style={{
                                        border: '1px solid',
                                        padding: 10,
                                        width: '20%'
                                    }}>Position</th>
                                    <th style={{
                                        border: '1px solid',
                                        padding: 10,
                                        width: '20%'
                                    }}>Nature of Position Held</th>
                                </tr>
                                {workExperience.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td style={{
                                                border: '1px solid',
                                                padding: 10
                                            }}>{item.organization}</td>
                                            <td style={{
                                                border: '1px solid',
                                                padding: 10
                                            }}>{item.tenureMonths}</td>
                                            <td style={{
                                                border: '1px solid',
                                                padding: 10
                                            }}>{item.activity}</td>
                                            <td style={{
                                                border: '1px solid',
                                                padding: 10
                                            }}>{item.position}</td>
                                            <td style={{
                                                border: '1px solid',
                                                padding: 10
                                            }}>{item.natureOfPositionHeld}</td>
                                        </tr>
                                    );
                                })}
                            </table>
                        </Fragment>)}
                        {data.degreeId === 17 && (<Fragment>
                            <div className={classes.valuesContainer}>
                                <span style={{
                                    fontSize: 'larger'
                                }}>
                                    Subject Combinations
                        </span>
                            </div>

                            <div style={{
                                marginLeft: '3%',
                                marginTop: '2%',
                                marginBottom: '1%',
                                display: 'flex'
                            }}>
                                {aLevelSubjectData.map((item, index) => {
                                    return (
                                        <span key={index} className={classes.tagValue} style={{
                                            marginRight: 15
                                        }}>{item.subjectLabel}</span>
                                    );
                                })}
                            </div>
                        </Fragment>)}
                        <div className={classes.valuesContainer}>
                            <span style={{
                                fontSize: 'larger'
                            }}>
                                State the Name(s) and Present status of any relative related to UCL or BHS
                        </span>
                        </div>

                        <table style={{
                            borderCollapse: 'collapse', marginLeft: '3%', marginTop: '1%',
                            marginBottom: '1%'
                        }}>
                            <tr>
                                <th style={{
                                    border: '1px solid',
                                    padding: 10,
                                }}>Institution</th>
                                <th style={{
                                    border: '1px solid',
                                    padding: 10,
                                }}>Relationship</th>
                                <th style={{
                                    border: '1px solid',
                                    padding: 10,
                                }}>Role</th>
                                <th style={{
                                    border: '1px solid',
                                    padding: 10,
                                }}>Name</th>
                                <th style={{
                                    border: '1px solid',
                                    padding: 10,
                                }}>Department</th>
                                <th style={{
                                    border: '1px solid',
                                    padding: 10,
                                }}>Designation</th>
                                <th style={{
                                    border: '1px solid',
                                    padding: 10,
                                }}>Programme</th>
                                <th style={{
                                    border: '1px solid',
                                    padding: 10,
                                }}>Graduation Year</th>
                            </tr>
                            {uclRelationData.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={{
                                            border: '1px solid',
                                            padding: 10
                                        }}>{item.institutionLabel}</td>
                                        <td style={{
                                            border: '1px solid',
                                            padding: 10
                                        }}>{item.relationship}</td>
                                        <td style={{
                                            border: '1px solid',
                                            padding: 10
                                        }}>{item.roleLabel}</td>
                                        <td style={{
                                            border: '1px solid',
                                            padding: 10
                                        }}>{item.name}</td>
                                        <td style={{
                                            border: '1px solid',
                                            padding: 10
                                        }}>{item.department}</td>
                                        <td style={{
                                            border: '1px solid',
                                            padding: 10
                                        }}>{item.designation}</td>
                                        <td style={{
                                            border: '1px solid',
                                            padding: 10
                                        }}>{item.programme}</td>
                                        <td style={{
                                            border: '1px solid',
                                            padding: 10
                                        }}>{item.graduationYear || ''}</td>
                                    </tr>
                                );
                            })
                            }
                        </table>

                        <div className={classes.valuesContainer}>
                            <span style={{
                                fontSize: 'larger'
                            }}>
                                Suffering from any medical condition/allergies
                        </span>
                        </div>


                        <div style={{
                            marginLeft: '3%',
                            marginTop: '2%',
                            marginBottom: '1%'
                        }}>
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
                        <div className={classes.valuesContainer}>
                            <span style={{
                                fontSize: 'larger'
                            }}>
                                How did you hear about UCL?
                        </span>
                        </div>

                        <div className={classes.fieldValuesContainer}>
                            <div className={classes.valuesContainer} style={{
                                width: '20%',
                                textAlign: 'center'
                            }}>
                                Source
                           </div>
                            <div className={classes.value}>
                                {data.uclSourceLabel}
                            </div>
                            {(data.uclSourceId === 1 || data.uclSourceId === 5) && (<Fragment>
                                <div className={classes.valuesContainer} style={{
                                    width: '20%',
                                    marginLeft: 15,
                                    textAlign: 'center'
                                }}>
                                    {data.uclSourceId === 1 ? 'Newspaper/Magzine Name' : 'Other Source Name'}
                                </div>
                                <div className={classes.value}>
                                    {data.uclSourceId === 1 ? data.uclSourceName || '-' : data.uclOtherSource || '-'}
                                </div>
                            </Fragment>)}
                        </div>

                        <div className={classes.valuesContainer}>
                            <span style={{
                                fontSize: 'larger'
                            }}>
                                Clearly state your reasons for applying to UCL in support of your application.
                        </span>
                        </div>

                        <div style={{
                            marginLeft: '3%',
                            marginTop: 10,
                            marginBottom: 10
                        }}>
                            <TextField
                                id="reasons"
                                value={data.reasonsForApplying}
                                disabled
                                InputProps={{
                                    style: {
                                        color: "black"
                                    }
                                }}
                                multiline
                                rows={8}
                                variant="outlined"
                                fullWidth
                            />

                        </div>

                        <div className={classes.valuesContainer}>
                            <span style={{
                                fontSize: 'larger'
                            }}>
                                Undertaking
                        </span>
                        </div>

                        <div style={{
                            marginLeft: '3%'
                        }}>
                            <div style={{
                                paddingBottom: 10,
                                marginTop: 10,
                                fontSize: 16
                            }}><strong style={{ paddingRight: 10 }}>1.</strong>
                            I confirm that the information contained in this form is accurate
                            and complete to the best of my knowledge and that the submission
                            of inaccurate information can be considered sufficient cause for
                            terminating my enrollment at Universal College Lahore (UCL).
                            </div>
                            <div style={{
                                paddingBottom: 10,
                                fontSize: 16
                            }}><strong style={{ paddingRight: 10 }}>2.</strong>
                            I also understand that if I am required to submit any information/document(s)
                            in support of my application, it is my responsibility to obtain it and
                            submit it before the closing date.
                            </div>
                            <div style={{
                                paddingBottom: 10,
                                fontSize: 16
                            }}><strong style={{ paddingRight: 10 }}>3.</strong>
                            I shall adhere to all the deadline dates set by UCL and keep UCL informed in writing about any changes
                            that might occur in my contact addresses, e.g., postal/residential, phone numbers (landline as well as cell numbers),
                            email, etc. I understand that UCL shall not accept any responsibility for any consequences that may arise
                            from my failure to comply with the aforesaid;
                            </div>
                            <div style={{
                                paddingBottom: 10,
                                fontSize: 16
                            }}><strong style={{ paddingRight: 10 }}>4.</strong>
                            I also understand that, while UCL takes all reasonable steps to ensure the safety of the person,
                             property and health of every student, UCL cannot and does not undertake to be responsible for any harm,
                              loss and or damage that may arise for reason of conditions or circumstances beyond the control of UCL.
                            </div>
                            <div style={{
                                paddingBottom: 10,
                                fontSize: 16
                            }}><strong style={{ paddingRight: 10 }}>5.</strong>
                            Furthermore, I understand that it is the responsibility of the owners of the vehicles to ensure the safety
                             of their vehicles and note that UCL cannot and does not undertake to be responsible in case of theft and or damage.
                            </div>
                            <div style={{
                                paddingBottom: 10,
                                fontSize: 16
                            }}><strong style={{ paddingRight: 10 }}>6.</strong>
                            As parent/guardian of the student, I undertake to have received the Fee Structure and Rules
                            and confirm that these have been carefully read, understood and found affordable.
                            </div>
                            <div style={{
                                paddingBottom: 10,
                                fontSize: 16
                            }}><strong style={{ paddingRight: 10 }}>7.</strong>
                            Tuition fee once paid is not refundable irrespective of whether the student leaves
                            the course voluntarily or is asked to leave the course on academic, discipline or any other grounds.
                            </div>
                            <div style={{
                                paddingBottom: 10,
                                fontSize: 16
                            }}><strong style={{ paddingRight: 10 }}>8.</strong>
                            We (the applicant and the parents including the guardians as the case may be) give
                            our unconditional consent to the Universal College Lahore to use any of the pictures
                             of the student taken during college events/functions for marketing purposes
                             In regard to the above, this serves to confirm that Universal College Lahore
                             is indemnified by the parent/guardian and the student or any other party representing the student.
                            </div>
                        </div>

                        <div style={{
                            marginLeft: '3%',
                            marginTop: '2%',
                            marginBottom: '1%',
                            display: 'flex'
                        }}>
                            <div className={classes.tagValue} style={{
                                width: '100%',
                                display: 'flex'
                            }}>
                                <CheckBoxIcon /> <div style={{
                                    marginLeft: 10,
                                    fontSize: 18
                                }}>I agree all terms and conditions.</div>
                            </div>
                        </div>

                    </div>
                    <div className={classes.valuesContainer}>
                        <span style={{
                            fontSize: 'larger'
                        }}>
                            Documents
                        </span>
                    </div>

                    <div style={{
                        marginTop: '2%',
                        marginLeft: '3%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {documentData.map((item, index) => {
                            return (
                                <Link key={index} onClick={() =>
                                    this.onDownload(item.fileName)
                                } style={{ marginTop: 15 }}>

                                    {item.documentTypeLabel}
                                </Link>
                            );
                        })}
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