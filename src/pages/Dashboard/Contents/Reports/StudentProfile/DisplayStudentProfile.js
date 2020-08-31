/* eslint-disable react/no-unescaped-entities */
import React, { Component, Fragment } from 'react';
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';
import Logo from '../../../../../assets/Images/logo.png';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
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
        width: '100%',
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
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C48AdmissionsProspectApplicationSubmittedApplicationsStudentProfileView?studentId=${id}`;
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
                            }
                        }
                    } else {
                        alert(json.USER_MESSAGE + '\n' + json.SYSTEM_MESSAGE)
                    }
                    console.log(json);
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

        this.setState({
            isLoading: false,
        })

    }

    render() {
        const { classes } = this.props;
        const { data } = this.state;
        const { enrolledCourses = [], enrolledSections = [] } = data;
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
                            <span className={classes.title}>University College Lahore</span>
                            <span className={classes.subTitle}>(a project of UCL pvt Ltd)</span>
                        </div>
                    </div>
                    <div className={classes.tagTitleContainer}>
                        <div className={classes.flexColumn}>
                            <span className={classes.tagTitle}>{data.degreeLabel || "N/A"}</span>
                            <span className={classes.tagTitle}>Nucleus ID: {data.studentId || "N/A"}</span>
                        </div>

                        <div className={classes.image} style={{
                            backgroundImage: `url(${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C01AdmissionsProspectApplicationImageView?fileName=${data.imageName})`,
                        }}>
                        </div>
                    </div>
                    <div className={classes.flexColumn}>
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
                                textAlign: `${data.firstName ? 'left' : 'center'}`
                            }}>
                                {data.firstName || "-"}
                            </div>
                            <div className={classes.value} style={{
                                width: '25%',
                                textAlign: `${data.middleName ? 'left' : 'center'}`
                            }}>
                                {data.middleName || '-'}
                            </div>
                            <div className={classes.value} style={{
                                width: '25%',
                                textAlign: `${data.lastName ? 'left' : 'center'}`
                            }}>
                                {data.lastName || "-"}
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

                        <Fragment>
                            <div className={classes.valuesContainer}>
                                <span style={{
                                    fontSize: 'larger'
                                }}>
                                    Enrolled Courses
                        </span>
                            </div>

                            <div style={{
                                marginLeft: '3%',
                                marginTop: '2%',
                                marginBottom: '1%',
                                display: 'flex'
                            }}>
                                {enrolledCourses.map((item, index) => {
                                    return (
                                        <span key={index} className={classes.tagValue} style={{
                                            marginRight: 15
                                        }}>{item.courseLabel}</span>
                                    );
                                })}
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

                            <div style={{
                                marginLeft: '3%',
                                marginTop: '2%',
                                marginBottom: '1%',
                                display: 'flex'
                            }}>
                                {enrolledSections.map((item, index) => {
                                    return (
                                        <span key={index} className={classes.tagValue} style={{
                                            marginRight: 15
                                        }}>{item.sectionLabel}</span>
                                    );
                                })}
                            </div>
                        </Fragment>

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