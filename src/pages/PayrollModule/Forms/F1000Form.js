/* eslint-disable react/prop-types */
import React, { Fragment, Component } from 'react';
import { format } from 'date-fns'
import Autocomplete from '@material-ui/lab/Autocomplete';
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';
import {Switch} from '@material-ui/core';
import Typography from "@material-ui/core/Typography";
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import { DatePicker } from "@material-ui/pickers";
import CircularProgress from '@material-ui/core/CircularProgress';
import { alphabetExp, numberExp, emailExp } from '../../../utils/regularExpression';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Card, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';
import LoginMenu from '../../../components/LoginMenu/LoginMenu';

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


function isEmpty(obj) {

    if (obj == null) return true;

    if (typeof obj !== "object") return true;

    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}


function Switches(props) {

    const [open, setOpen] = React.useState(false);
    const [dialogMsg, setDialogMsg] = React.useState("");
    const [switchState, setSwitchState] = React.useState(props.isChecked);
    
    const handleClickOpen = () => {
        if(switchState){
           console.log("M Opened Now");
           
        }else{
            console.log("M Closed Now");
        }
        setOpen(true);
    };

    


    return (
        <Fragment>
            <Switch
                checked={switchState}
                //onChange={handleChange}
                onClick={handleClickOpen}
                color="primary"
                name="switch"
                inputProps={{ 'aria-label': 'primary checkbox' }}
            />
           
        </Fragment>
    );
  }



class F1000Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            /////////////////Applying for State///////////////////

            appliedFor: parseInt(window.localStorage.getItem("degreeId")),
            appliedForError: "",
            category: 0,
            categoryError: "",
            yearAlevel: "",
            yearAlevelError: "",
            chessSubDegree: "",
            chessSubDegreeError: "",

            /////////////////Personal Information State///////////////////

            firstName: window.localStorage.getItem("firstName"),
            firstNameError: "",
            middleName: "",
            middleNameError: "",
            lastName: window.localStorage.getItem("lastName"),
            lastNameError: "",
            dateOfBirth: new Date( window.localStorage.getItem("convertedDate")),
            dateOfBirthError: "",
            genderId: window.localStorage.getItem("genderId"),
            genderIdError: "",
            nationalityId: "",
            nationalityIdObject: {},
            nationalityIdError: "",
            email: window.localStorage.getItem("email"),
            emailError: "",
            mobileNo: window.localStorage.getItem("mobileNo"),
            mobileNoError: "",
            userDocumentTypeId: "",
            userDocumentTypeIdError: "",
            userNicopCnicBform: "",
            userNicopCnicBformError: "",
            userPassport: "",
            userPassportError: "",
            userBform: "",
            userBformError: "",
            userNicop: "",
            userNicopError: "",
            userMaterialStatusId: "",
            userMaterialStatusIdError: "",
            userBloodGroupId: "",
            userBloodGroupIdError: "",

            /////////////////Father Information State///////////////////

            fatherTitleId: "",
            fatherTitleIdError: "",
            fatherDocumentTypeId: "",
            fatherDocumentTypeIdError: "",
            fatherCnic: "",
            fatherCnicError: "",
            fatherPassport: "",
            fatherPassportError: "",
            fatherNicop: "",
            fatherNicopError: "",
            fatherOccupation: "",
            fatherOccupationError: "",
            fatherMobileNo: "",
            fatherMobileNoError: "",
            fatherName: "",
            fatherNameError: "",
            fatherEmail: "",
            fatherEmailError: "",

            /////////////////Mother Information State///////////////////

            motherTitleId: "",
            motherTitleIdError: "",
            motherDocumentTypeId: "",
            motherDocumentTypeIdError: "",
            motherCnic: "",
            motherCnicError: "",
            motherPassport: "",
            motherPassportError: "",
            motherNicop: "",
            motherNicopError: "",
            motherOccupation: "",
            motherOccupationError: "",
            motherMobileNo: "",
            motherMobileNoError: "",
            motherName: "",
            motherNameError: "",
            motherEmail: "",
            motherEmailError: "",

            /////////////////Guardian Information State///////////////////

            guardianInformationId: "",
            guardianInformationIdError: "",
            guardianDocumentTypeId: "",
            guardianDocumentTypeIdError: "",
            guardianTitleId: "",
            guardianTitleIdError: "",
            guardianCnic: "",
            guardianCnicError: "",
            guardianPassport: "",
            guardianPassportError: "",
            guardianNicop: "",
            guardianNicopError: "",
            guardianOccupation: "",
            guardianOccupationError: "",
            guardianMobileNo: "",
            guardianMobileNoError: "",
            guardianName: "",
            guardianNameError: "",
            guardianEmail: "",
            guardianEmailError: "",
            guardianRelationId: "",
            guardianRelationIdError: "",
            guardianRelationOther: "",
            guardianRelationOtherError: "",

            /////////////////Present Mailing Information State///////////////////

            mailingAddressId: "",
            mailingAddressIdError: "",
            presentAddress: "",
            presentAddressError: "",
            presentPostalCode: "",
            presentPostalCodeError: "",
            presentCountryId: "",
            presentCountryIdObject: {},
            presentCountryIdError: "",
            presentProvinceId: "",
            presentProvinceIdObject: {},
            presentProviceIdError: "",
            presentCityId: "",
            presentCityIdObject: {},
            presentCityIdError: "",

            permanentAddress: "",
            permanentAddressError: "",
            permanentPostalCode: "",
            permanentPostalCodeError: "",
            permanentCountryId: "",
            permanentCountryIdObject: {},
            permanentCountryIdError: "",
            permanentProvinceId: "",
            permanentProvinceIdObject: {},
            permanentProviceIdError: "",
            permanentCityId: "",
            permanentCityIdObject: {},
            permanentCityIdError: "",


            /////////////////Academics Information State///////////////////

            academicsNameOfAwardingBodySec1: "",
            academicsNameOfAwardingBodySec1Error: "",
            academicsNameOfInstitutionSec1: "",
            academicsNameOfInstitutionSec1Error: "",
            academicsQualificationSec1: "",
            academicsQualificationSec1Error: "",
            academicsYearAwardedSec1: "",
            academicsYearAwardedSec1Error: "",
            academicsIsResultAwaitedSec1: 0,
            academicsIsResultAwaitedSec1Error: "",
            academicsOverallMarksSec1: "",
            academicsOverallMarksSec1Error: "",
            academicSubjectSec1: "",
            academicSubjectSec1Error: "",
            academicGradeMarksSec1: "",
            academicGradeMarksSec1Error: "",
            academicRecordsArray: [],
            academicSec1Error: "",


            academicsNameOfAwardingBodySec2: "",
            academicsNameOfAwardingBodySec2Error: "",
            academicsNameOfInstitutionSec2: "",
            academicsNameOfInstitutionSec2Error: "",
            academicsQualificationSec2: "",
            academicsQualificationSec2Error: "",
            academicsYearAwardedSec2: "",
            academicsYearAwardedSec2Error: "",
            academicsIsResultAwaitedSec2: 0,
            academicsIsResultAwaitedSec2Error: "",
            academicsOverallMarksSec2: "",
            academicsOverallMarksSec2Error: "",
            academicSubjectSec2: "",
            academicSubjectSec2Error: "",
            academicGradeMarksSec2: "",
            academicGradeMarksSec2Error: "",
            academicSec2RecordsArray: [],
            academicSec2Error: "",

            qualificationRecordsArray: [],
            nameOfQualificationSec3: "",
            nameOfQualificationSec3Error: "",
            nameOfInstitutionSec3: "",
            nameOfInstitutionSec3Error: "",
            nameOfAwardingSec3: "",
            nameOfAwardingSec3Error: "",


            /////////////////Extra Activity Information State///////////////////

            nameOfInstitutionActivity: "",
            nameOfInstitutionActivityError: "",
            tenureActivity: "",
            tenureActivityError: "",
            mainActivity: "",
            mainActivityError: "",
            positionActivity: "",
            positionActivityError: "",
            natureOfPositionActivity: "",
            natureOfPositionActivityError: "",
            activityRecordsArray: [],

            /////////////////work Activity Information State///////////////////

            organizationWork: "",
            organizationError: "",
            tenureWork: "",
            tenureWorkError: "",
            mainWork: "",
            mainWorkError: "",
            positionWork: "",
            positionWorkError: "",
            natureOfPositionWork: "",
            natureOfPositionWorkError: "",
            workRecordsArray: [],

            /////////////////ucl relation Information State///////////////////

            relationInstitutionUcl: "",
            relationInstitutionUclError: "",
            relationIdUcl: "",
            relationIdUclError: "",
            currentStatusUcl: "",
            currentStatusUclError: "",
            relationDesignationUcl: "",
            relationDesignationUclError: "",
            relationNameUcl: "",
            relationNameUclError: "",
            relationDepartmentUcl: "",
            relationDepartmentUclError: "",
            relationProgramUcl: "",
            relationProgramUclError: "",
            relationGraduationYearUcl: "",
            relationGraduationYearUclError: "",
            uclRelationRecordsArray: [],

            ////////////////////Check Subject //////////////////////////////////
            LastEnteredIndex:0,
            checkSubjects: [],
            checkSubjectsError: "",
            checkSubjectsGroup19: [],
            checkSubjectsGroup19Error: "",

            /////////////////A/OLevel Academics Information State///////////////////


            nameOfSchoolAlevel: "",
            nameOfSchoolAlevelError: "",
            addressOfSchoolAlevel: "",
            addressOfSchoolAlevelError: "",

            subjectAcademicAlevel: "",
            subjectAcademicAlevelError: "",
            examAcademicAlevel: "",
            examAcademicAlevelError: "",
            boardAcademicAlevel: "",
            boardAcademicAlevelError: "",
            sessionAcademicAlevel: "",
            sessionAcademicAlevelError: "",
            gradeAcademicAlevel: "",
            gradeAcademicAlevelError: "",
            aLevelAcademicError: "",
            aLevelAcademicRecordsArray: [],

            /////////////////o/A level financial State///////////////////

            nameOfPersonAlevel: "",
            nameOfPersonAlevelError: "",
            addressOfPersonAlevel: "",
            addressOfPersonAlevelError: "",
            professionOfPersonAlevel: "",
            professionOfPersonAlevelError: "",

            /////////////////Medical Data State///////////////////

            checkMedical: 0,
            medicalCondition: "",
            medicalConditionError: "",
            medicalName: "",
            medicalNameError: "",
            medicalRelationshipId: "",
            medicalRelationshipIdError: "",
            medicalMobileNumber: "",
            medicalMobileNumberError: "",

            /////////////////Other Data State///////////////////

            hearFrom: "",
            hearFromError: "",

            hearMagzineName: "",
            hearMagzineNameError: "",
            hearOtherSource: "",
            hearOtherSourceError: "",
            reasons: "",
            reasonsError: "",
            iAgreeCheck: false,
            iAgreeCheckError: "",

            isLoading: false,
            loadingData: false,
            openReview: false,
            data: {},
            genderData: [],
            degreeData: [],
            bloodGroupData: [],
            nationalityData: [],
            materialStatusData: [],
            guardianTitleData: [],
            fatherTitleData: [],
            motherTitleData: [],
            relationshipData: [],
            qualificationData: [],
            maleOccupationData: [],
            allOccupationData: [],
            transportationData: [],
            countriesData: [],
            permanentProvinceData: [],
            permanentCitiesData: [],
            presentProvinceData: [],
            presentCitiesData: [],
            documentTypeData: [],
            GuardianRelationshipData: [],
            guardianInformationData: [],
            presentAddressData: [],
            chessSubDegreeData: [],
            uclRelativeRolesData: [],
            uclRelativeInstitutionData: [],
            uclHearAboutData: [],
            aLevelSubjectCombinationData: [],
            successDialog: false,
            isLoginMenu: false,
            isReload: false,


            switchSateGroupId: 0

        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = async () => {
        this.setState({
            loadingData: true
        })

        this.otherData();
        if (localStorage.getItem("isSaved") == 1) {
            await this.getData();
        }
        this.setState({
            loadingData: false
        })
    }

    otherData = () => {
        this.getGenderData();
        this.getDegreesData();
        this.getBloodGroupData();
        this.getNationalitiesData();
        this.getMaterialStatusData();
        this.getRelationTitleDataById(1);
        this.getRelationTitleDataById(2);
        this.getRelationTitleDataById(3);
        this.getRelationshipData();
        this.getQualificationData();
        this.getOccupationsData(0);
        this.getOccupationsData(1);
        this.getCountriesData();
        this.getDocumentTypeData();
        this.getGuardianRelationshipData();
        this.getGuardianInformationData();
        this.getPresentAddressData();
        this.getChessSubDegreeData();
        this.getUclRelativeRoleData();
        this.getUclRelativeInstitutionData();
        this.getUclHearAboutData();
        this.getALevelSubjectCombinationData();
    }

    handleSuccessDialog = () => {
        this.setState({
            successDialog: !this.state.successDialog,
        });
    }
    StopEnter(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    }

    //onSwitchChangedSave = async(id, isActive, changeSwitch) => {
    onSwitchChangedSave = (groupId) => {
       
        this.setState({
            switchSateGroupId:groupId,
            checkSubjects:[]
        });
    }

    getALevelSubjectCombinationData = async () => {

        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C01AdmissionsProspectApplicationALevelSubjectTypesView`;
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclToken")
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
                    this.setState({
                        aLevelSubjectCombinationData: json.DATA || []
                    });
                },
                error => {
                    console.log(error);
                });

    }

    getUclHearAboutData = async () => {

        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C01AdmissionsProspectApplicationInstitutionSourceTypesView`;
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclToken")
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
                    this.setState({
                        uclHearAboutData: json.DATA || []
                    });
                },
                error => {
                    console.log(error);
                });

    }

    getUclRelativeInstitutionData = async () => {

        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C01AdmissionsProspectApplicationInstitutionsView`;
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclToken")
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
                    this.setState({
                        uclRelativeInstitutionData: json.DATA || []
                    });
                },
                error => {
                    console.log(error);
                });

    }


    getUclRelativeRoleData = async () => {

        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C01AdmissionsProspectApplicationRelativesRolesView`;
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclToken")
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
                    this.setState({
                        uclRelativeRolesData: json.DATA || []
                    });
                },
                error => {
                    console.log(error);
                });

    }

    getChessSubDegreeData = async () => {

        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C01CommonAcademicsDegreeProgramsCHESSView`;
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclToken")
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
                    this.setState({
                        chessSubDegreeData: json.DATA || []
                    });
                },
                error => {
                    console.log(error);
                });

    }

    getPresentAddressData = async () => {

        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C01AdmissionsProspectApplicationMailingAddressTypesView`;
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclToken")
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
                    this.setState({
                        presentAddressData: json.DATA || []
                    });
                },
                error => {
                    console.log(error);
                });

    }

    getGuardianInformationData = async () => {

        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C01AdmissionsProspectApplicationGuardianTypesView`;
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclToken")
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
                    this.setState({
                        guardianInformationData: json.DATA || []
                    });
                },
                error => {
                    console.log(error);
                });

    }

    getGuardianRelationshipData = async () => {

        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C01CommonPersonalRelationsGuardianView`;
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclToken")
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
                    this.setState({
                        GuardianRelationshipData: json.DATA || []
                    });
                },
                error => {
                    console.log(error);
                });

    }

    getDocumentTypeData = async () => {

        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C01CommonIdentityDocumentTypesView`;
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclToken")
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
                    this.setState({
                        documentTypeData: json.DATA || []
                    });
                },
                error => {
                    console.log(error);
                });

    }

    getTransportationReasonData = async () => {

        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C01AdmissionsProspectApplicationTransportReasonsView`;
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclToken")
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
                    this.setState({
                        transportationData: json.DATA || []
                    });
                },
                error => {
                    console.log(error);
                });

    }

    getCountriesData = async () => {

        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C01CommonCountriesView`;

        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclToken")
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
                async json => {
                    const countryObject = json.DATA.find(item => item.ID === 165);
                    this.setState({
                        permanentCountryId: 165,
                        permanentCountryIdObject: countryObject,
                        countriesData: json.DATA || []

                    })
                    await this.getProvinceData(165, "permanent", '');
                },
                error => {
                    console.log(error);
                });

    }

    getProvinceData = async (id, type, value = '') => {

        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C01CommonCountriesProvincesView?countryId=${id}`;
        const name = `${type}ProvinceData`
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclToken")
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
                    const valueName = `${type}ProvinceId`;
                    const valueObjName = `${type}ProvinceIdObject`;
                    const data = json.DATA || [];
                    const id = value || '';
                    const obj = value ? data.find(item => item.ID === value) : {};
                    this.setState({
                        [name]: data,
                        [valueName]: id,
                        [valueObjName]: obj
                    });
                },
                error => {
                    console.log(error);
                });

    }
    getCitiesData = async (id, type, value = '') => {

        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C01CommonCitiesView?provinceId=${id}`;
        const name = `${type}CitiesData`
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclToken")
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
                    const valueName = `${type}CityId`;
                    const valueObjName = `${type}CityIdObject`;
                    const data = json.DATA || [];
                    const id = value || '';
                    const obj = value ? data.find(item => item.ID === value) : {};
                    this.setState({
                        [name]: data,
                        [valueName]: id,
                        [valueObjName]: obj
                    });
                },
                error => {
                    console.log(error);
                });

    }

    getQualificationData = async () => {

        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C01AdmissionsProspectApplicationFamilyQualificationsView`;
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclToken")
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
                    this.setState({
                        qualificationData: json.DATA || []
                    });
                },
                error => {
                    console.log(error);
                });

    }

    getOccupationsData = async isMale => {

        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C01AdmissionsProspectApplicationOccupationsView?isMale=${isMale}`;
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclToken")
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
                    if (isMale === 1) {
                        this.setState({
                            maleOccupationData: json.DATA || []
                        });
                    } else {
                        this.setState({
                            allOccupationData: json.DATA || []
                        });
                    }
                },
                error => {
                    console.log(error);
                });

    }

    getGenderData = async () => {
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C01CommonGendersView`;
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclToken")
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
                    this.setState({
                        genderData: json.DATA || []
                    });
                })
            .catch((error) => {
                if (error.status == 401 && localStorage.getItem("isSaved") != 1) {
                    this.setState({
                        isLoginMenu: true,
                        isReload: true
                    })
                }
                console.log(error);
            });
    }

    getRelationTitleDataById = async id => {
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C01CommonHonorificsView?typeId=${id}`;
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclToken")
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
                    if (id === 1) {
                        this.setState({
                            fatherTitleData: json.DATA || []
                        });
                    }
                    if (id === 2) {
                        this.setState({
                            motherTitleData: json.DATA || []
                        });
                    }
                    if (id === 3) {
                        this.setState({
                            guardianTitleData: json.DATA || []
                        });

                    }
                },
                error => {
                    console.log(error);
                });

    }

    getBloodGroupData = async () => {
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C01CommonBloodGroupsView`;
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclToken")
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
                    this.setState({
                        bloodGroupData: json.DATA || []
                    });
                },
                error => {
                    console.log(error);
                });

    }

    getRelationshipData = async () => {
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C01CommonPersonalRelationsView`;
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclToken")
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
                    this.setState({
                        relationshipData: json.DATA || []
                    });
                },
                error => {
                    console.log(error);
                });

    }

    getNationalitiesData = async () => {
        // const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C01CommonNationalitiesView`;
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C01CommonCountriesView`;

        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclToken")
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
                    const countryObject = json.DATA.find(item => item.ID === 165);
                    this.setState({
                        nationalityId: 165,
                        nationalityIdObject: countryObject,
                        nationalityData: json.DATA || []

                    })
                },
                error => {
                    console.log(error);
                });

    }

    getMaterialStatusData = async () => {
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C01CommonMaritalStatusView`;
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclToken")
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
                    this.setState({
                        materialStatusData: json.DATA || []
                    });
                },
                error => {
                    console.log(error);
                });

    }

    getDegreesData = async () => {
        let data = [];
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/common/C01CommonAcademicsDegreeProgramsView`;
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclToken")
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
                    const resData = json.DATA || [];
                    if (resData.length > 0) {
                        for (let i = 0; i < resData.length; i++) {
                            if (!isEmpty(resData[i])) {
                                data.push({ id: "", label: resData[i].department })
                            }
                            for (let j = 0; j < resData[i].degrees.length; j++) {
                                if (!isEmpty(resData[i].degrees[j])) {
                                    data.push({ id: resData[i].degrees[j].id, label: resData[i].degrees[j].label })
                                }
                            }
                        }
                    }
                },
                error => {
                    console.log('myData', error);
                });
        this.setState({
            degreeData: data
        });
    }

    handleChange = e => {
        const { name, value } = e.target;
        const errName = `${name}Error`;
        let regex = "";
        switch (name) {
            case "firstName":
            case "middleName":
            case "lastName":
            case "fatherName":
            case "motherName":
            case "guardianName":
            case "relativeNameUcl":
            case "nameOfPersonAlevel":
                regex = new RegExp(alphabetExp);
                if (value && !regex.test(value)) {
                    return;
                }
                break;
            case "relationshipAge":
            case "mobileNo":
            case "fatherMobileNo":
            case "motherMobileNo":
            case "guardianMobileNo":
            case "userNicopCnicBform":
            case "userNicop":
            case "fatherCnic":
            case "motherCnic":
            case "guardianCnic":
            case "fatherNicop":
            case "motherNicop":
            case "guardianNicop":
            case "permanentMobileNumber":
            case "permanentPostalCode":
            case "presentMobileNumber":
            case "presentPostalCode":
            case "medicalMobileNumber":
            case "academicsYearAwardedSec1":
            case "academicsYearAwardedSec2":
            case "relationGraduationYearUcl":
            case "tenureActivity":
            case "tenureWork":
                regex = new RegExp(numberExp);
                if (value && !regex.test(value)) {
                    return;
                }
                break;
            default:
                break;
        }
        if (name === "fatherTitleId" && value === 6) {
            this.setState({
                fatherEmail: "",
                fatherEmailError: "",
                fatherMobileNo: "",
                fatherMobileNoError: "",
                fatherOccupation: "",
                fatherOccupationError: "",
                fatherDocumentTypeId: "",
                fatherDocumentTypeIdError: "",
                fatherCnic: "",
                fatherCnicError: "",
                fatherPassport: "",
                fatherPassportError: "",
                fatherNicop: "",
                fatherNicopError: ""
            })
        }
        if (name === "motherTitleId" && value === 6) {
            this.setState({
                motherEmail: "",
                motherEmailError: "",
                motherMobileNo: "",
                motherMobileNoError: "",
                motherOccupation: "",
                motherOccupationError: "",
                motherDocumentTypeId: "",
                motherDocumentTypeIdError: "",
                motherCnic: "",
                motherCnicError: "",
                motherPassport: "",
                motherPassportError: "",
                motherNicop: "",
                motherNicopError: ""
            })
        }
        if (name === "guardianInformationId" && value !== 3) {
            this.setState({
                guardianName: "",
                guardianNameError: "",
                guardianRelationId: "",
                guardianRelationIdError: "",
                guardianTitleId: "",
                guardianTitleIdError: "",
                guardianEmail: "",
                guardianEmailError: "",
                guardianMobileNo: "",
                guardianMobileNoError: "",
                guardianOccupation: "",
                guardianOccupationError: "",
                guardianDocumentTypeId: "",
                guardianDocumentTypeIdError: "",
                guardianCnic: "",
                guardianCnicError: "",
                guardianPassport: "",
                guardianPassportError: "",
                guardianNicop: "",
                guardianNicopError: ""
            })
        }

        if (name === "currentStatusUcl" && value === 1) {
            this.setState({
                relationDesignationUcl: "",
                relationDesignationUclError: ""
            })
        }
        if (name === "currentStatusUcl" && value !== 1) {
            this.setState({
                relationProgramUcl: "",
                relationProgramUclError: ""
            })
        }

        if (name === "hearFrom") {
            this.setState({
                hearOtherSource: "",
                hearOtherSourceError: "",
                hearMagzineName: "",
                hearMagzineNameError: ""
            })
        }

        if (name === "fatherDocumentTypeId") {
            this.setState({
                fatherCnic: "",
                fatherCnicError: "",
                fatherPassport: "",
                fatherPassportError: "",
                fatherNicop: "",
                fatherNicopError: ""
            })
        }

        if (name === "userDocumentTypeId") {
            this.setState({
                userNicopCnicBform: "",
                userNicopCnicBformError: "",
                userPassport: "",
                userPassportError: "",
                userNicop: "",
                userNicopError: ""
            })
        }

        if (name === "motherDocumentTypeId") {
            this.setState({
                motherCnic: "",
                motherCnicError: "",
                motherPassport: "",
                motherPassportError: "",
                motherNicop: "",
                motherNicopError: ""
            })
        }

        if (name === "guardianDocumentTypeId") {
            this.setState({
                guardianCnic: "",
                guardianCnicError: "",
                guardianPassport: "",
                guardianPassportError: "",
                guardianNicop: "",
                guardianNicopError: ""
            })
        }

        if (name === "appliedFor") {
            if (value !== 32) {
                this.setState({
                    aLevelAcademicError: "",
                    aLevelAcademicRecordsArray: [],
                    yearAlevel: "",
                    yearAlevelError: "",
                    subjectAcademicAlevel: "",
                    subjectAcademicAlevelError: "",
                    gradeAcademicAlevel: "",
                    gradeAcademicAlevelError: "",
                    nameOfSchoolAlevel: "",
                    nameOfSchoolAlevelError: "",
                    addressOfSchoolAlevel: "",
                    addressOfSchoolAlevelError: "",
                    nameOfPersonAlevel: "",
                    nameOfPersonAlevelError: "",
                    addressOfPersonAlevel: "",
                    addressOfPersonAlevelError: "",
                    professionOfPersonAlevel: "",
                    professionOfPersonAlevelError: "",
                    chessSubDegree: "",
                    chessSubDegreeError: "",
                    checkSubjects: [],
                    checkSubjectsGroup19: []

                })
            } else {
                this.setState({
                    academicsNameOfAwardingBodySec1: "",
                    academicsNameOfAwardingBodySec1Error: "",
                    academicsNameOfInstitutionSec1: "",
                    academicsNameOfInstitutionSec1Error: "",
                    academicsQualificationSec1: "",
                    academicsQualificationSec1Error: "",
                    academicsYearAwardedSec1: "",
                    academicsYearAwardedSec1Error: "",
                    academicsIsResultAwaitedSec1: 0,
                    academicsIsResultAwaitedSec1Error: "",
                    academicsOverallMarksSec1: "",
                    academicsOverallMarksSec1Error: "",
                    academicSubjectSec1: "",
                    academicSubjectSec1Error: "",
                    academicGradeMarksSec1: "",
                    academicGradeMarksSec1Error: "",
                    academicRecordsArray: [],
                    academicSec1Error: "",


                    academicsNameOfAwardingBodySec2: "",
                    academicsNameOfAwardingBodySec2Error: "",
                    academicsNameOfInstitutionSec2: "",
                    academicsNameOfInstitutionSec2Error: "",
                    academicsQualificationSec2: "",
                    academicsQualificationSec2Error: "",
                    academicsYearAwardedSec2: "",
                    academicsYearAwardedSec2Error: "",
                    academicsIsResultAwaitedSec2: 0,
                    academicsIsResultAwaitedSec2Error: "",
                    academicsOverallMarksSec2: "",
                    academicsOverallMarksSec2Error: "",
                    academicSubjectSec2: "",
                    academicSubjectSec2Error: "",
                    academicGradeMarksSec2: "",
                    academicGradeMarksSec2Error: "",
                    academicSec2RecordsArray: [],
                    academicSec2Error: "",

                    organizationWork: "",
                    organizationError: "",
                    tenureWork: "",
                    tenureWorkError: "",
                    mainWork: "",
                    mainWorkError: "",
                    positionWork: "",
                    positionWorkError: "",
                    natureOfPositionWork: "",
                    natureOfPositionWorkError: "",
                    workRecordsArray: [],
                    chessSubDegree: "",
                    chessSubDegreeError: ""

                })
            }
        }

        if (name === "currentStatusUcl") {
            if (value === 1 || value === 4) {
                this.setState({
                    relationDesignationUcl: "",
                    relationDesignationUclError: "",
                    relationDepartmentUcl: "",
                    relationDepartmentUclError: ""
                })
            }
            if (value !== 4) {
                this.setState({
                    relationGraduationYearUcl: "",
                    relationGraduationYearUclError: "",
                })
            }
            if (value !== 1 && value !== 4) {
                this.setState({
                    relationProgramUcl: "",
                    relationProgramUclError: "",
                })
            }
        }

        this.setState({
            [name]: value,
            [errName]: ""
        })
    }

    handleAutoComplete = (name) => (e, value) => {
        const errName = `${name}Error`;
        const objState = `${name}Object`;
        if (isEmpty(value)) {
            switch (name) {
                case "permanentCountryId":
                    this.setState({
                        permanentProvinceData: [],
                        permanentProviceIdError: "",
                        permanentProvinceIdObject: {},
                        permanentProvinceId: "",

                        permanentCitiesData: [],
                        permanentCityId: "",
                        permanentCityIdError: "",
                        permanentCityIdObject: {}
                    });
                    break;
                case "permanentProvinceId":
                    this.setState({
                        permanentCitiesData: [],
                        permanentCityId: "",
                        permanentCityIdError: "",
                        permanentCityIdObject: {}
                    });
                    break;
                case "presentCountryId":
                    this.setState({
                        presentProvinceData: [],
                        presentProviceIdError: "",
                        presentProvinceIdObject: {},
                        presentProvinceId: "",

                        presentCitiesData: [],
                        presentCityId: "",
                        presentCityIdError: "",
                        presentCityIdObject: {}
                    });
                    break;
                case "presentProvinceId":
                    this.setState({
                        presentCitiesData: [],
                        presentCityId: "",
                        presentCityIdError: "",
                        presentCityIdObject: {}
                    });
                    break;
                default:
                    break;
            }
            this.setState({
                [name]: "",
                [errName]: "",
                [objState]: {}
            })
        } else {
            const { ID } = value;
            switch (name) {
                case "permanentCountryId":
                    this.setState({
                        permanentProvinceData: [],
                        permanentProviceIdError: "",
                        permanentProvinceIdObject: {},
                        permanentProvinceId: "",

                        permanentCitiesData: [],
                        permanentCityId: "",
                        permanentCityIdError: "",
                        permanentCityIdObject: {}
                    });
                    this.getProvinceData(ID, "permanent", "");
                    break;
                case "permanentProvinceId":
                    this.setState({
                        permanentCitiesData: [],
                        permanentCityId: "",
                        permanentCityIdError: "",
                        permanentCityIdObject: {}
                    });
                    this.getCitiesData(ID, "permanent", '');
                    break;
                case "presentCountryId":
                    this.setState({
                        presentProvinceData: [],
                        presentProviceIdError: "",
                        presentProvinceIdObject: {},
                        presentProvinceId: "",

                        presentCitiesData: [],
                        presentCityId: "",
                        presentCityIdError: "",
                        presentCityIdObject: {}
                    });
                    this.getProvinceData(ID, "present", "");
                    break;
                case "presentProvinceId":
                    this.setState({
                        presentCitiesData: [],
                        presentCityId: "",
                        presentCityIdError: "",
                        presentCityIdObject: {}
                    });
                    this.getCitiesData(ID, "present", '');
                    break;
                default:
                    break;
            }
            this.setState({
                [name]: ID,
                [errName]: "",
                [objState]: value
            })
        }
    }

    handleDateChange = date => {
        this.setState({
            dateOfBirth: date,
            dateOfBirthError: ""
        })
        console.log(date);
    }

    onRelationShipRemoveClick = (event, index) => {
        let { relationshipRecordsArray } = this.state;
        relationshipRecordsArray.splice(index, 1);
        this.setState({
            relationshipRecordsArray
        })
    }

    onAlevelAcademicRemoveClick = (event, index) => {
        let { aLevelAcademicRecordsArray } = this.state;
        aLevelAcademicRecordsArray.splice(index, 1);
        this.setState({
            aLevelAcademicRecordsArray
        })
    }

    onUclRelationRemoveClick = (event, index) => {
        let { uclRelationRecordsArray } = this.state;
        uclRelationRecordsArray.splice(index, 1);
        this.setState({
            uclRelationRecordsArray
        })
    }

    onAcademicsRemoveClick = (event, index) => {
        let { academicRecordsArray } = this.state;
        academicRecordsArray.splice(index, 1);
        this.setState({
            academicRecordsArray
        })
    }

    onActivityRemoveClick = (event, index) => {
        let { activityRecordsArray } = this.state;
        activityRecordsArray.splice(index, 1);
        this.setState({
            activityRecordsArray
        })
    }

    onAcademicsSec2RemoveClick = (event, index) => {
        let { academicSec2RecordsArray } = this.state;
        academicSec2RecordsArray.splice(index, 1);
        this.setState({
            academicSec2RecordsArray
        })
    }

    onQualificationRemoveClick = (event, index) => {
        let { qualificationRecordsArray } = this.state;
        qualificationRecordsArray.splice(index, 1);
        this.setState({
            qualificationRecordsArray
        })
    }

    onWorkRemoveClick = (event, index) => {
        let { workRecordsArray } = this.state;
        workRecordsArray.splice(index, 1);
        this.setState({
            workRecordsArray
        })
    }

    onRelationShipAddClick = () => {
        const { relationshipData, qualificationData } = this.state;
        let { userRelationshipId, relationshipQualificationId,
            relationshipAge, relationshipSalary,
            userRelationshipIdError, relationshipSalaryError, relationshipAgeError,
            relationshipQualificationIdError, relationshipRecordsArray } = this.state;
        if (!userRelationshipId) {
            userRelationshipIdError = "Please select a relation.";
        } else if (!relationshipQualificationId) {
            relationshipQualificationIdError = "Please select a qualification.";
        } else if (!relationshipAge) {
            relationshipAgeError = "Please enter age";
        } else if (!relationshipSalary) {
            relationshipSalaryError = "Please enter salary";
        } else {
            const findRRecord = relationshipData.find(item => item.ID === userRelationshipId);
            const findQRecord = qualificationData.find(item => item.ID === relationshipQualificationId);
            const obj = {
                relationship: findRRecord.Label,
                qualification: findQRecord.Label,
                age: relationshipAge,
                salary: relationshipSalary,
                qualificationId: findQRecord.ID,
                relationshipId: findRRecord.ID
            }
            relationshipRecordsArray.push(obj);
            userRelationshipId = "";
            relationshipSalary = "";
            relationshipAge = "";
            relationshipQualificationId = "";
        }
        this.setState({
            relationshipRecordsArray,
            userRelationshipIdError, relationshipSalaryError, relationshipAgeError,
            relationshipQualificationIdError,
            relationshipSalary, relationshipAge, relationshipQualificationId, userRelationshipId
        })

    }

    onUclRelationAddClick = () => {
        let { relationInstitutionUcl,
            relationInstitutionUclError,
            relationIdUcl,
            relationIdUclError,
            currentStatusUcl,
            currentStatusUclError,
            relationDesignationUcl,
            relationDesignationUclError,
            relationNameUcl,
            relationNameUclError,
            relationDepartmentUcl,
            relationDepartmentUclError,
            relationProgramUcl,
            relationProgramUclError,
            uclRelationRecordsArray,
            relationGraduationYearUcl,
            relationGraduationYearUclError
        } = this.state;
        if (!relationInstitutionUcl) {
            relationInstitutionUclError = "Please select institution.";
        } else if (!relationIdUcl) {
            relationIdUclError = "Please enter relationship.";
        } else if (!currentStatusUcl) {
            currentStatusUclError = "Please select status";
        } else if (!relationDesignationUcl && (currentStatusUcl !== 1 && currentStatusUcl !== 4)) {
            relationDesignationUclError = "Please enter designation.";
        } else if (!relationNameUcl) {
            relationNameUclError = "Please enter name";
        } else if (!relationDepartmentUcl && (currentStatusUcl !== 1 && currentStatusUcl !== 4)) {
            relationDepartmentUclError = "Please enter department";
        } else if (!relationProgramUcl && (currentStatusUcl === 1 || currentStatusUcl === 4)) {
            relationProgramUclError = "Please enter Programme";
        } else if (!relationGraduationYearUcl && currentStatusUcl === 4) {
            relationGraduationYearUclError = "Please enter graduation year";
        } else {
            const { uclRelativeRolesData, uclRelativeInstitutionData } = this.state;
            const findRole = uclRelativeRolesData.find(item => item.ID === currentStatusUcl) || {};
            const findInstitution = uclRelativeInstitutionData.find(item => item.ID === relationInstitutionUcl) || {};
            const obj = {
                institution: findInstitution.Label,
                relationship: relationIdUcl,
                status: findRole.Label,
                designation: relationDesignationUcl || "",
                name2: relationNameUcl,
                department: relationDepartmentUcl || "",
                program: relationProgramUcl || "",
                year: relationGraduationYearUcl || "",
                uclRoleId: findRole.ID,
                uclInstitutionId: findInstitution.ID

            }
            uclRelationRecordsArray.push(obj);
            relationInstitutionUcl = "";
            relationIdUcl = "";
            currentStatusUcl = "";
            relationDesignationUcl = "";
            relationNameUcl = "";
            relationDepartmentUcl = "";
            relationProgramUcl = "";
            relationGraduationYearUcl = "";
        }
        this.setState({
            relationInstitutionUcl,
            relationInstitutionUclError,
            relationIdUcl,
            relationIdUclError,
            currentStatusUcl,
            currentStatusUclError,
            relationDesignationUcl,
            relationDesignationUclError,
            relationNameUcl,
            relationNameUclError,
            relationDepartmentUcl,
            relationDepartmentUclError,
            relationProgramUcl,
            relationProgramUclError,
            relationGraduationYearUcl,
            relationGraduationYearUclError
        })

    }

    onAcademicAddClick = () => {
        let { academicRecordsArray, academicSubjectSec1, academicSubjectSec1Error,
            academicGradeMarksSec1, academicGradeMarksSec1Error } = this.state;
        if (!academicSubjectSec1) {
            academicSubjectSec1Error = "Please enter subject.";
        } else if (!academicGradeMarksSec1) {
            academicGradeMarksSec1Error = "Please enter grade / marks.";
        } else {
            const obj = {
                subject: academicSubjectSec1,
                gradeMarks: academicGradeMarksSec1
            }
            academicRecordsArray.push(obj);
            academicSubjectSec1 = "";
            academicGradeMarksSec1 = "";
        }
        this.setState({
            academicRecordsArray, academicSubjectSec1, academicSubjectSec1Error,
            academicGradeMarksSec1, academicGradeMarksSec1Error,
            academicSec1Error: "",
        })

    }

    onAlevelAcademicAddClick = () => {
        let { subjectAcademicAlevel,
            subjectAcademicAlevelError,
            examAcademicAlevel,
            examAcademicAlevelError,
            boardAcademicAlevel,
            boardAcademicAlevelError,
            sessionAcademicAlevel,
            sessionAcademicAlevelError,
            gradeAcademicAlevel,
            gradeAcademicAlevelError,
            aLevelAcademicRecordsArray, } = this.state;

        if (!subjectAcademicAlevel) {
            subjectAcademicAlevelError = "Please enter subject.";
        } else if (!examAcademicAlevel) {
            examAcademicAlevelError = "Please enter exam title.";
        } else if (!boardAcademicAlevel) {
            boardAcademicAlevelError = "Please enter board.";
        } else if (!sessionAcademicAlevel) {
            sessionAcademicAlevelError = "Please enter session.";
        } else if (!gradeAcademicAlevel) {
            gradeAcademicAlevelError = "Please enter grade.";
        } else {
            const obj = {
                subject: subjectAcademicAlevel,
                exam: examAcademicAlevel,
                board: boardAcademicAlevel,
                session: sessionAcademicAlevel,
                grade: gradeAcademicAlevel
            }
            aLevelAcademicRecordsArray.push(obj);
            subjectAcademicAlevel = "";
            examAcademicAlevel = "";
            boardAcademicAlevel = "";
            sessionAcademicAlevel = "";
            gradeAcademicAlevel = "";
        }
        this.setState({
            subjectAcademicAlevel,
            subjectAcademicAlevelError,
            examAcademicAlevel,
            examAcademicAlevelError,
            boardAcademicAlevel,
            boardAcademicAlevelError,
            sessionAcademicAlevel,
            sessionAcademicAlevelError,
            gradeAcademicAlevel,
            gradeAcademicAlevelError,
            aLevelAcademicRecordsArray,
            aLevelAcademicError: ""
        })

    }

    onAcademicSec2AddClick = () => {
        let { academicSec2RecordsArray, academicSubjectSec2, academicSubjectSec2Error,
            academicGradeMarksSec2, academicGradeMarksSec2Error } = this.state;
        if (!academicSubjectSec2) {
            academicSubjectSec2Error = "Please enter subject.";
        } else if (!academicGradeMarksSec2) {
            academicGradeMarksSec2Error = "Please enter grade / marks.";
        } else {
            const obj = {
                subject: academicSubjectSec2,
                gradeMarks: academicGradeMarksSec2
            }
            academicSec2RecordsArray.push(obj);
            academicSubjectSec2 = "";
            academicGradeMarksSec2 = "";
        }
        this.setState({
            academicSec2RecordsArray, academicSubjectSec2, academicSubjectSec2Error,
            academicGradeMarksSec2, academicGradeMarksSec2Error,
            academicSec2Error: ""
        })

    }

    onQualificationAddClick = () => {
        let { qualificationRecordsArray, nameOfQualificationSec3, nameOfQualificationSec3Error,
            nameOfInstitutionSec3, nameOfInstitutionSec3Error, nameOfAwardingSec3, nameOfAwardingSec3Error } = this.state;
        if (!nameOfAwardingSec3) {
            nameOfAwardingSec3Error = "Please enter name of awarding.";
        } else if (!nameOfInstitutionSec3) {
            nameOfInstitutionSec3Error = "Please enter institution.";
        } else if (!nameOfQualificationSec3) {
            nameOfQualificationSec3Error = "Please enter qualification.";
        } else {
            const obj = {
                nameAward: nameOfAwardingSec3,
                nameInstitution: nameOfInstitutionSec3,
                qualification: nameOfQualificationSec3
            }
            qualificationRecordsArray.push(obj);
            nameOfAwardingSec3 = "";
            nameOfInstitutionSec3 = "";
            nameOfQualificationSec3 = "";
        }
        this.setState({
            qualificationRecordsArray, nameOfQualificationSec3, nameOfQualificationSec3Error,
            nameOfInstitutionSec3, nameOfInstitutionSec3Error, nameOfAwardingSec3, nameOfAwardingSec3Error
        })

    }

    onActivityAddClick = () => {
        let { nameOfInstitutionActivity,
            nameOfInstitutionActivityError,
            tenureActivity,
            tenureActivityError,
            mainActivity,
            mainActivityError,
            positionActivity,
            positionActivityError,
            natureOfPositionActivity,
            natureOfPositionActivityError,
            activityRecordsArray } = this.state;
        if (!nameOfInstitutionActivity) {
            nameOfInstitutionActivityError = "Please enter name of institution.";
        } else if (!tenureActivity) {
            tenureActivityError = "Please enter tenure.";
        } else if (!mainActivity) {
            mainActivityError = "Please enter activity.";
        } else if (!positionActivity) {
            positionActivityError = "Please enter position.";
        } else if (!natureOfPositionActivity) {
            natureOfPositionActivityError = "Please enter  nature of position held.";
        } else {
            const obj = {
                institution: nameOfInstitutionActivity,
                tenure: tenureActivity,
                activity: mainActivity,
                position: positionActivity,
                nature: natureOfPositionActivity,
            }
            activityRecordsArray.push(obj);
            nameOfInstitutionActivity = "";
            tenureActivity = "";
            mainActivity = "";
            positionActivity = "";
            natureOfPositionActivity = "";
        }
        this.setState({
            nameOfInstitutionActivity,
            nameOfInstitutionActivityError,
            tenureActivity,
            tenureActivityError,
            mainActivity,
            mainActivityError,
            positionActivity,
            positionActivityError,
            natureOfPositionActivity,
            natureOfPositionActivityError,
            activityRecordsArray
        })

    }

    onWorkAddClick = () => {
        let { organizationWork,
            organizationWorkError,
            tenureWork,
            tenureWorkError,
            mainWork,
            mainWorkError,
            positionWork,
            positionWorkError,
            natureOfPositionWork,
            natureOfPositionWorkError,
            workRecordsArray } = this.state;
        if (!organizationWork) {
            organizationWorkError = "Please enter organization.";
        } else if (!tenureWork) {
            tenureWorkError = "Please enter tenure.";
        } else if (!mainWork) {
            mainWorkError = "Please enter Work.";
        } else if (!positionWork) {
            positionWorkError = "Please enter position.";
        } else if (!natureOfPositionWork) {
            natureOfPositionWorkError = "Please enter nature of position held.";
        } else {
            const obj = {
                organization: organizationWork,
                tenure: tenureWork,
                activity: mainWork,
                position: positionWork,
                nature: natureOfPositionWork,
            }
            workRecordsArray.push(obj);
            organizationWork = "";
            tenureWork = "";
            mainWork = "";
            positionWork = "";
            natureOfPositionWork = "";
        }
        this.setState({
            organizationWork,
            organizationWorkError,
            tenureWork,
            tenureWorkError,
            mainWork,
            mainWorkError,
            positionWork,
            positionWorkError,
            natureOfPositionWork,
            natureOfPositionWorkError,
            workRecordsArray
        })

    }

    handleCustomChange = (e, type) => {
        this.setState({
            checkMedical: type,
            medicalMobileNumber: "",
            medicalMobileNumberError: "",
            medicalName: "",
            medicalNameError: "",
            medicalRelationshipId: "",
            medicalRelationshipIdError: "",
            medicalCondition: "",
            medicalConditionError: ""

        })
    }

    /*WORKING CODE COMMENTED BY FARHAN*/
    handleCheckGroupHandleChange = (e, i, sId, sLabel) => {
        const { checked } = e.target;
        console.log(checked, i, sId, sLabel);
        let { checkSubjectsGroup19 } = this.state;
        let t = -1;
        if (checked) {
            t = sId;
        }


        var arrayLenght=0;
        for(var j=0;j<this.state.checkSubjects.length;j++){
        
            if(this.state.checkSubjects[j].checked!==-1){
                arrayLenght++;
            }
        }
       

        if(arrayLenght<=3){
            const index = checkSubjectsGroup19.findIndex(item => item.grpId === i)
            if (index != -1) {
                checkSubjectsGroup19[index].id = sId;
                checkSubjectsGroup19[index].checked = t;
                checkSubjectsGroup19[index].label = sLabel;
            } else {
                checkSubjectsGroup19.push({
                    id: sId, checked: t, label: sLabel, grpId: i
                })
            }
        }


        this.setState({
            checkSubjectsGroup19
        })
    }

    // handleCheckGroup1HandleChange = (e, i, sId, sLabel) => {

    //     console.log("BEFORE this.state.checkSubjects ==>> ",[...this.state.checkSubjects]);
    //         const { checked } = e.target;


         
    //         let { checkSubjects } = this.state;
    //         let t = -1;
    //         if (checked) {
    //             t = sId;
    //         }

           

    //         const index = checkSubjects.findIndex(item => item.checked === sId)
            
           
    //         if (index != -1) {
                

    //                 checkSubjects.splice(index,1);
                
                    
    //         } else {
    //             var arrayLenght=0;
    //             for(var j=0;j<this.state.checkSubjects.length;j++){
                   
    //                 if(this.state.checkSubjects[j].grpId==1){
    //                     arrayLenght++;
    //                 }
    //             }
               
    //             if(arrayLenght<3 && i==1){
                   
    //                 checkSubjects.push({
    //                     id: sId, checked: t, label: sLabel, grpId: i
    //                 })

    //             }else if(arrayLenght>=3 && i==1){
                   
    //                 checkSubjects.splice(this.state.LastEnteredIndex,1);
    //                 checkSubjects.push({
    //                     id: sId, checked: t, label: sLabel, grpId: i
    //                 })
    //             }
                
    //         }
        
            
    //         const indexCurrentlyEntered = checkSubjects.findIndex(item => item.checked === sId)

            
    
    //         this.setState({
    //             checkSubjects,
    //             LastEnteredIndex:indexCurrentlyEntered
    //         })
    // }

    handleCheckGroup2HandleChange = (e, i, sId, sLabel) => {

        // console.log("BEFORE this.state.checkSubjects ==>> ",[...this.state.checkSubjects]);
            const { checked } = e.target;


         
            let  checkSubjects  = [...this.state.checkSubjects];
            let t = -1;
            if (checked) {
                t = sId;
            }

           

            const indexOfSepecificSubject = checkSubjects.findIndex(item => item.checked === sId && item.grpId === i)
            

            console.log("AFTER this.state.checkSubjects ==>> ",this.state.checkSubjects);
            if(this.state.checkSubjects.length==0){
                checkSubjects.push({
                    id: sId, checked: t, label: sLabel, grpId: i
                })
            }else{

                const index = checkSubjects.findIndex(item => item.grpId === i);
               
                if(index!=-1){
                  
                    var arrayLenght=0;
                    for(var j=0;j<checkSubjects.length;j++){
                    
                        if(checkSubjects[j].grpId==i){
                            arrayLenght++;
                        }
                    }
                   

                    var arrayLenghtGroup19=0;
                  
                    for(var j=0;j<this.state.checkSubjectsGroup19.length;j++){
                    
                        if(this.state.checkSubjectsGroup19[j].checked!==-1){
                            arrayLenghtGroup19++;
                        }
                    }

                 
                  
                    if(arrayLenght<3){
                        if(indexOfSepecificSubject!=-1){
                            checkSubjects[indexOfSepecificSubject].id = sId;
                            checkSubjects[indexOfSepecificSubject].checked = t;
                            checkSubjects[indexOfSepecificSubject].label = sLabel;
                        }else{
                            
                            checkSubjects.push({
                                id: sId, checked: t, label: sLabel, grpId: i
                            })
                        }
                        
    
                    }else if(arrayLenght>=3){
                       
                        // if(arrayLenghtGroup19>0){
                        //     checkSubjects.splice(this.state.LastEnteredIndex,1);
                        // }
                        
                       
                        if(indexOfSepecificSubject!=-1){
                            checkSubjects[indexOfSepecificSubject].id = sId;
                            checkSubjects[indexOfSepecificSubject].checked = t;
                            checkSubjects[indexOfSepecificSubject].label = sLabel;
                        }else{

                            if(arrayLenghtGroup19>0){
                               // checkSubjects[this.state.LastEnteredIndex].checked = -1;
                                     checkSubjects.splice(this.state.LastEnteredIndex,1);
                            }
                            checkSubjects.push({
                                id: sId, checked: t, label: sLabel, grpId: i
                            })
                        }
                    }
                    
                   

                }else{
                    
                    checkSubjects=[];
                    
                    
                    checkSubjects.push({
                        id: sId, checked: t, label: sLabel, grpId: i
                    })
                }
            }

           
            // if (index != -1) {
                

            //         checkSubjects.splice(index,1);
                
                    
            // } else {
            //     var arrayLenght=0;
            //     for(var j=0;j<this.state.checkSubjects.length;j++){
                   
            //         if(this.state.checkSubjects[j].grpId==i){
            //             arrayLenght++;
            //         }
            //     }
               
            //     if(arrayLenght<3 ){
                   
            //         checkSubjects.push({
            //             id: sId, checked: t, label: sLabel, grpId: i
            //         })

            //     }else if(arrayLenght>=3 ){
                   
            //         checkSubjects.splice(this.state.LastEnteredIndex,1);
            //         checkSubjects.push({
            //             id: sId, checked: t, label: sLabel, grpId: i
            //         })
            //     }
                
            // }
        
            
            const indexCurrentlyEntered = checkSubjects.findIndex(item => item.checked === sId &&  item.grpId === i)
           
            console.log("AFTER this.state.checkSubjects ==>> ",checkSubjects);
    
            this.setState({checkSubjects,LastEnteredIndex:indexCurrentlyEntered});
    }

    cnicCheckHandling = (event) => {
        const { name } = event.target;
        const errorName = `${name}Error`;
        let val = event.target.value.replace(/\D/g, "");
        val = val.substr(0, 13);
        let len = val.length;
        let formatedValue = val;
        if (len >= 6) {
            formatedValue = val.substr(0, 5) + "-" + val.substr(5, len);
        }
        if (len >= 13) {
            formatedValue = formatedValue.substr(0, 13) + "-" + val.substr(12, 1);
        }
        if (len <= 13) {
            this.setState({ [name]: formatedValue, [errorName]: "" });
        }
    };

    isFormValid = () => {
        let isValid = true;
        let regex = "";
        let { iAgreeCheckError, reasonsError, hearFromError, hearMagzineNameError, hearOtherSourceError
            , checkMedicalError, medicalMobileNumberError, medicalRelationshipIdError, medicalNameError
            , medicalConditionError, academicSec2Error, academicsOverallMarksSec2Error, academicsIsResultAwaitedSec2Error,
            academicsYearAwardedSec2Error, academicsQualificationSec2Error, academicsNameOfInstitutionSec2Error, academicsNameOfAwardingBodySec2Error,
            academicSec1Error, academicsOverallMarksSec1Error, academicsIsResultAwaitedSec1Error, academicsYearAwardedSec1Error,
            academicsQualificationSec1Error, academicsNameOfInstitutionSec1Error, academicsNameOfAwardingBodySec1Error,
            guardianInformationIdError, guardianOccupationError, guardianEmailError, guardianMobileNoError, guardianRelationIdError,
            guardianRelationOtherError, guardianDocumentTypeIdError, guardianCnicError, guardianPassportError,
            guardianNicopError, guardianNameError, guardianTitleIdError, motherOccupationError, motherEmailError,
            motherMobileNoError, motherDocumentTypeIdError, motherCnicError, motherPassportError, motherNicopError,
            motherNameError, motherTitleIdError, fatherOccupationError, fatherEmailError, fatherMobileNoError,
            fatherDocumentTypeIdError, fatherCnicError, fatherPassportError, fatherNicopError, fatherNameError,
            fatherTitleIdError, mailingAddressIdError, presentAddressError, presentCityIdError, presentCountryIdError,
            presentPostalCodeError, presentProvinceIdError, permanentAddressError, permanentCityIdError,
            permanentCountryIdError, permanentPostalCodeError, permanentProvinceIdError, userMaterialStatusIdError,
            userBloodGroupIdError, userDocumentTypeIdError, userNicopCnicBformError, userPassportError,
            userNicopError, nationalityIdError, mobileNoError, emailError, genderIdError, dateOfBirthError,
            firstNameError, lastNameError, appliedForError, yearAlevelError, chessSubDegreeError, aLevelAcademicError,
            nameOfSchoolAlevelError, checkSubjectsError,
            addressOfSchoolAlevelError,
            nameOfPersonAlevelError,
            addressOfPersonAlevelError,
            professionOfPersonAlevelError,checkSubjectsGroup19Error } = this.state;
        if (!this.state.iAgreeCheck) {
            iAgreeCheckError = "Please check to agree our terms and condition."
            document.getElementById("iAgreeCheck").focus();
            isValid = false;
        } else {
            iAgreeCheckError = ""
        }

        if (!this.state.reasons) {
            reasonsError = "Please specify the reason for applying under 1000 characters."
            document.getElementById("reasons").focus();
            isValid = false;
        } else {
            reasonsError = ""
        }

        if (!this.state.hearFrom) {
            hearFromError = "Please select the source."
            document.getElementById("hearFrom").focus();
            isValid = false;
        } else {
            hearFromError = ""
            if (this.state.hearFrom === 1 && !this.state.hearMagzineName) {
                hearMagzineNameError = "Please enter the news / magzine name."
                document.getElementById("hearMagzineName").focus();
                isValid = false;
            } else {
                hearMagzineNameError = ""
            }
            if (this.state.hearFrom === 5 && !this.state.hearOtherSource) {
                hearOtherSourceError = "Please specify the other source."
                document.getElementById("hearOtherSource").focus();
                isValid = false;
            } else {
                hearOtherSourceError = ""
            }
        }

        if (this.state.checkMedical === 1) {
            if (!this.state.medicalMobileNumber) {
                medicalMobileNumberError = "Please enter valid mobile number e.g 03001234567.";
                document.getElementById("medicalMobileNumber").focus();
                isValid = false;
            } else {
                medicalMobileNumberError = "";
                if (!this.state.medicalMobileNumber.startsWith("03") || this.state.medicalMobileNumber.split('').length !== 11) {
                    medicalMobileNumberError = "Please enter a valid mobile number e.g 03001234567"
                    document.getElementById("medicalMobileNumber").focus();
                    isValid = false;
                } else {
                    medicalMobileNumberError = ""
                }
            }
            if (!this.state.medicalRelationshipId) {
                medicalRelationshipIdError = "Please select relation.";
                document.getElementById("medicalRelationshipId").focus();
                isValid = false;
            } else {
                medicalRelationshipIdError = "";
            }
            if (!this.state.medicalName) {
                medicalNameError = "Please enter name.";
                document.getElementById("medicalName").focus();
                isValid = false;
            } else {
                medicalNameError = "";
            }
            if (!this.state.medicalCondition) {
                medicalNameError = "Please specify the medical condition.";
                document.getElementById("medicalCondition").focus();
                isValid = false;
            } else {
                medicalNameError = "";
            }
        } else {
            checkMedicalError = ""
        }
        if (this.state.appliedFor === 32) {

            // if (this.state.checkSubjectsGroup19.length <= 0) {
            //     //checkSubjectsGroup19Error = "Please select 1 subject."
            //     //document.getElementById("checkSubjects0").focus();
            //     alert("Please select  one subject  from Subject Combinations Section 1.");
            //     isValid = false;
            //     return false;
                
            // } else {
            //     let counter = 0;
            //     checkSubjectsGroup19Error = ""
            //     if (this.state.checkSubjectsGroup19.length < 1) {
            //       //  checkSubjectsGroup19Error = "Please select  1 subject."
            //         alert("Please select  one subject  from Subject Combinations Section 1. ");
            //         //document.getElementById("checkSubjects0").focus();
            //         isValid = false;
            //         return false;
            //     } else {
            //         checkSubjectsGroup19Error = ""
            //         for (let i = 0; i < this.state.checkSubjectsGroup19.length; i++) {
            //             if (this.state.checkSubjectsGroup19[i].checked != -1) {
            //                 counter++;
            //             }
            //         }
            //         if (counter < 1) {
            //            // checkSubjectsGroup19Error = "Please select one subject."
            //             alert("Please select  one subject from Subject Combinations Section 1. ");
            //            // document.getElementById("checkSubjects0").focus();
            //             isValid = false;
            //             return false;
            //         } else if (counter > 1) {
            //            // checkSubjectsGroup19Error = "Please select one subject only."
            //             alert("Please select  one subject from Subject Combinations Section 1.");
            //             //document.getElementById("checkSubjects0").focus();
            //             isValid = false;
            //             return false;
            //         } else {
            //             checkSubjectsGroup19Error = ""
            //         }
            //     }
            // }



            let Group19Counter=0;

            for (let i = 0; i < this.state.checkSubjectsGroup19.length; i++) {
                if (this.state.checkSubjectsGroup19[i].checked != -1) {
                    Group19Counter++;
                }
            }

            if (this.state.checkSubjects.length <= 0) {
               // checkSubjectsError = "Please select two to three subjects."
               if(Group19Counter!=0){
                alert("Please select two to three subjects from Subject Combinations Section 2. ");
               }else{
                alert("Please select at least three subjects from Subject Combinations Section 2. ");
               }
                
               // document.getElementById("gIdError18").focus();
                isValid = false;
            } else {
                let counter = 0;
                checkSubjectsError = ""
                let totalValuesToCheck=0;
                let isAnySelectedFromGroup19=false;
                if(Group19Counter==0){
                    totalValuesToCheck=3
                   
                }else{
                    totalValuesToCheck=2
                    isAnySelectedFromGroup19=true;
                }

                if (this.state.checkSubjects.length < totalValuesToCheck) {
                    //checkSubjectsError = "Please select minimum 2 subjects."
                    if(isAnySelectedFromGroup19){
                        alert("Please select minimum two subjects from Subject Combinations Section 2. ");
                    }else{
                        alert("Please select minimum three subjects from Subject Combinations Section 2. ");
                    }
                   
                   // document.getElementById("gIdError18").focus();
                    isValid = false;
                } else {
                    checkSubjectsError = ""
                    for (let i = 0; i < this.state.checkSubjects.length; i++) {
                        if (this.state.checkSubjects[i].checked != -1) {
                            counter++;
                        }
                    }
                    if (counter < totalValuesToCheck) {
                       
                        if(isAnySelectedFromGroup19){
                            alert("Please select at least two to three subjects from Subject Combinations Section 2. ");
                        }else{
                            alert("Please select at least three to four subjects from Subject Combinations Section 2. ");
                        }
                       
                        // alert("Please select at least two to three subjects from Subject Combinations Section 2. ");
                        // checkSubjectsError = "Please select at least 2 to 3 subjects."
                        // document.getElementById("gIdError18").focus();
                        isValid = false;
                    } else if (counter > 3) {
                        // alert("Please select at least 3 subjects from Subject Combinations Section 2.  ");
                        // // checkSubjectsError = "Please select 2 to 3 subjects only."
                        // // document.getElementById("gIdError18").focus();
                        // isValid = false;
                    } else {
                        checkSubjectsError = ""
                    }
                }
            }


           


            if (this.state.aLevelAcademicRecordsArray.length <= 0) {
                aLevelAcademicError = "Please add examination results."
                document.getElementById("subjectAcademicAlevel").focus();
                isValid = false;
            } else {
                aLevelAcademicError = ""
            }

            if (!this.state.addressOfSchoolAlevel) {
                addressOfSchoolAlevelError = "Please enter the name of school."
                document.getElementById("addressOfSchoolAlevel").focus();
                isValid = false;
            } else {
                addressOfSchoolAlevelError = ""
            }

            if (!this.state.nameOfSchoolAlevel) {
                nameOfSchoolAlevelError = "Please enter the name of school."
                document.getElementById("nameOfSchoolAlevel").focus();
                isValid = false;
            } else {
                nameOfSchoolAlevelError = ""
            }

            if (!this.state.professionOfPersonAlevel) {
                professionOfPersonAlevelError = "Please enter the address."
                document.getElementById("professionOfPersonAlevel").focus();
                isValid = false;
            } else {
                professionOfPersonAlevelError = ""
            }

            if (!this.state.addressOfPersonAlevel) {
                addressOfPersonAlevelError = "Please enter the address."
                document.getElementById("addressOfPersonAlevel").focus();
                isValid = false;
            } else {
                addressOfPersonAlevelError = ""
            }

            if (!this.state.nameOfPersonAlevel) {
                nameOfPersonAlevelError = "Please enter the name."
                document.getElementById("nameOfPersonAlevel").focus();
                isValid = false;
            } else {
                nameOfPersonAlevelError = ""
            }

        } else {
            if (this.state.academicSec2RecordsArray.length <= 0 && this.state.academicsIsResultAwaitedSec2 == 0) {
                academicSec2Error = "Please add subject and grade/marks."
                document.getElementById("academicSubjectSec2").focus();
                isValid = false;
            } else {
                academicSec2Error = ""
            }

            // if (!this.state.academicsOverallMarksSec2) {
            //     academicsOverallMarksSec2Error = "Please enter overall grade/marks."
            //     document.getElementById("academicsOverallMarksSec2").focus();
            //     isValid = false;
            // } else {
            //     academicsOverallMarksSec2Error = ""
            // }

            if (!this.state.academicsIsResultAwaitedSec2 && this.state.academicsIsResultAwaitedSec2 != 0) {
                academicsIsResultAwaitedSec2Error = "Please select result awaited or not."
                document.getElementById("academicsIsResultAwaitedSec2").focus();
                isValid = false;
            } else {
                academicsIsResultAwaitedSec2Error = ""
            }

            if (!this.state.academicsYearAwardedSec2) {
                academicsYearAwardedSec2Error = "Please enter the year."
                document.getElementById("academicsYearAwardedSec2").focus();
                isValid = false;
            } else {
                academicsYearAwardedSec2Error = ""
            }

            if (!this.state.academicsQualificationSec2) {
                academicsQualificationSec2Error = "Please enter qualification."
                document.getElementById("academicsQualificationSec2").focus();
                isValid = false;
            } else {
                academicsQualificationSec2Error = ""
            }

            if (!this.state.academicsNameOfInstitutionSec2) {
                academicsNameOfInstitutionSec2Error = "Please enter the name of institution."
                document.getElementById("academicsNameOfInstitutionSec2").focus();
                isValid = false;
            } else {
                academicsNameOfInstitutionSec2Error = ""
            }

            if (!this.state.academicsNameOfAwardingBodySec2) {
                academicsNameOfAwardingBodySec2Error = "Please enter the name of awarding body ."
                document.getElementById("academicsNameOfAwardingBodySec2").focus();
                isValid = false;
            } else {
                academicsNameOfAwardingBodySec2Error = ""
            }

            if (this.state.academicRecordsArray.length <= 0 && this.state.academicsIsResultAwaitedSec1 == 0) {
                academicSec1Error = "Please add subject and grade/marks."
                document.getElementById("academicSubjectSec1").focus();
                isValid = false;
            } else {
                academicSec1Error = ""
            }

            // if (!this.state.academicsOverallMarksSec1) {
            //     academicsOverallMarksSec1Error = "Please enter overall grade/marks."
            //     document.getElementById("academicsOverallMarksSec1").focus();
            //     isValid = false;
            // } else {
            //     academicsOverallMarksSec1Error = ""
            // }

            if (!this.state.academicsIsResultAwaitedSec1 && this.state.academicsIsResultAwaitedSec1 != 0) {
                academicsIsResultAwaitedSec1Error = "Please select result awaited or not."
                document.getElementById("academicsIsResultAwaitedSec1").focus();
                isValid = false;
            } else {
                academicsIsResultAwaitedSec1Error = ""
            }

            if (!this.state.academicsYearAwardedSec1) {
                academicsYearAwardedSec1Error = "Please enter the year."
                document.getElementById("academicsYearAwardedSec1").focus();
                isValid = false;
            } else {
                academicsYearAwardedSec1Error = ""
            }

            if (!this.state.academicsQualificationSec1) {
                academicsQualificationSec1Error = "Please enter qualification."
                document.getElementById("academicsQualificationSec1").focus();
                isValid = false;
            } else {
                academicsQualificationSec1Error = ""
            }

            if (!this.state.academicsNameOfInstitutionSec1) {
                academicsNameOfInstitutionSec1Error = "Please enter name of institution."
                document.getElementById("academicsNameOfInstitutionSec1").focus();
                isValid = false;
            } else {
                academicsNameOfInstitutionSec1Error = ""
            }

            if (!this.state.academicsNameOfAwardingBodySec1) {
                academicsNameOfAwardingBodySec1Error = "Please enter name of awarding body."
                document.getElementById("academicsNameOfAwardingBodySec1").focus();
                isValid = false;
            } else {
                academicsNameOfAwardingBodySec1Error = ""
            }
        }
        if (!this.state.guardianInformationId) {
            guardianInformationIdError = "Please select guardian."
            document.getElementById("guardianInformationId").focus();
            isValid = false;
        } else {
            guardianInformationIdError = ""
            if (this.state.guardianInformationId === 3) {
                if (!this.state.guardianOccupation) {
                    guardianOccupationError = "Please select guardian occupation."
                    document.getElementById("guardianOccupation").focus();
                    isValid = false;
                } else {
                    guardianOccupationError = ""
                }
                /**
                regex = new RegExp(emailExp);
                if (!this.state.guardianEmail || !regex.test(this.state.guardianEmail)) {
                    guardianEmailError = "Please enter a valid email e.g name@domain.com"
                    document.getElementById("guardianEmail").focus();
                    isValid = false;
                } else {
                    guardianEmailError = ""
                }
                 */
                if (!this.state.guardianMobileNo) {
                    guardianMobileNoError = "Please enter a valid mobile number e.g 03001234567"
                    document.getElementById("guardianMobileNo").focus();
                    isValid = false;
                } else {
                    guardianMobileNoError = ""
                    if (!this.state.guardianMobileNo.startsWith("03") || this.state.guardianMobileNo.split('').length !== 11) {
                        guardianMobileNoError = "Please enter a valid mobile number e.g 03001234567"
                        document.getElementById("guardianMobileNo").focus();
                        isValid = false;
                    } else {
                        guardianMobileNoError = ""
                    }
                }
                if (!this.state.guardianRelationId) {
                    guardianRelationIdError = "Please select relationship";
                    document.getElementById("guardianRelationId").focus();
                    isValid = false;
                } else {
                    guardianRelationIdError = "";
                    if (this.state.guardianRelationId === 101 && !this.state.guardianRelationOther) {
                        guardianRelationOtherError = "Please specify the relationship"
                        document.getElementById("guardianRelationOther").focus();
                        isValid = false;
                    } else {
                        guardianRelationOtherError = "";
                    }
                }

                if (!this.state.guardianDocumentTypeId) {
                    guardianDocumentTypeIdError = "Please select document type";
                    document.getElementById("guardianDocumentTypeId").focus();
                    isValid = false;
                } else {
                    guardianDocumentTypeIdError = "";
                    if (this.state.guardianDocumentTypeId === 1 && !this.state.guardianCnic) {
                        guardianCnicError = "Please enter CNIC number."
                        document.getElementById("guardianCnic").focus();
                        isValid = false;
                    } else {
                        guardianCnicError = "";
                        if (this.state.guardianDocumentTypeId === 1 && this.state.guardianCnic.split('').length !== 15) {
                            guardianCnicError = "Please enter valid CNIC number e.g xxxxx-xxxxxxx-x."
                            document.getElementById("guardianCnic").focus();
                            isValid = false;
                        } else {
                            guardianCnicError = "";
                        }
                    }
                    if (this.state.guardianDocumentTypeId === 2 && !this.state.guardianPassport) {
                        guardianPassportError = "Please enter passport number."
                        document.getElementById("guardianPassport").focus();
                        isValid = false;
                    } else {
                        guardianPassportError = "";
                        if (this.state.guardianDocumentTypeId === 2 && this.state.guardianPassport.split('').length !== 9) {
                            guardianPassportError = "Please enter valid passport number e.g xxxxxxxxx"
                            document.getElementById("guardianPassport").focus();
                            isValid = false;
                        } else {
                            guardianPassportError = "";
                        }
                    }
                    if (this.state.guardianDocumentTypeId === 3 && !this.state.guardianNicop) {
                        guardianNicopError = "Please enter NICOP number."
                        document.getElementById("guardianNicop").focus();
                        isValid = false;
                    } else {
                        guardianNicopError = "";
                        if (this.state.guardianDocumentTypeId === 3 && this.state.guardianNicop.split('').length !== 15) {
                            guardianNicopError = "Please enter valid NICOP number e.g xxxxx-xxxxxxx-x."
                            document.getElementById("guardianNicop").focus();
                            isValid = false;
                        } else {
                            guardianNicopError = "";
                        }

                    }
                }
                if (!this.state.guardianName) {
                    guardianNameError = "Please enter name."
                    document.getElementById("guardianName").focus();
                    isValid = false;
                } else {
                    guardianNameError = "";
                }
                if (!this.state.guardianTitleId) {
                    guardianTitleIdError = "Please select title."
                    document.getElementById("guardianTitleId").focus();
                    isValid = false;
                } else {
                    guardianTitleIdError = "";
                }
            }
        }
        if (this.state.motherTitleId !== 6) {
            if (!this.state.motherOccupation) {
                motherOccupationError = "Please select mother occupation."
                document.getElementById("motherOccupation").focus();
                isValid = false;
            } else {
                motherOccupationError = ""
            }
            /**
                        regex = new RegExp(emailExp);
                        if (!this.state.motherEmail || !regex.test(this.state.motherEmail)) {
                            motherEmailError = "Please enter a valid email e.g name@domain.com"
                            document.getElementById("motherEmail").focus();
                            isValid = false;
                        } else {
                            motherEmailError = ""
                        }
             */
            if (!this.state.motherMobileNo) {
                motherMobileNoError = "Please enter a valid mobile number e.g 03001234567"
                document.getElementById("motherMobileNo").focus();
                isValid = false;
            } else {
                motherMobileNoError = ""
                if (!this.state.motherMobileNo.startsWith("03") || this.state.motherMobileNo.split('').length !== 11) {
                    motherMobileNoError = "Please enter a valid mobile number e.g 03001234567"
                    document.getElementById("motherMobileNo").focus();
                    isValid = false;
                } else {
                    motherMobileNoError = ""
                }
            }

            if (!this.state.motherDocumentTypeId) {
                motherDocumentTypeIdError = "Please select document type";
                document.getElementById("motherDocumentTypeId").focus();
                isValid = false;
            } else {
                motherDocumentTypeIdError = "";
                if (this.state.motherDocumentTypeId === 1 && !this.state.motherCnic) {
                    motherCnicError = "Please enter CNIC number."
                    document.getElementById("motherCnic").focus();
                    isValid = false;
                } else {
                    motherCnicError = "";
                    if (this.state.motherDocumentTypeId === 1 && this.state.motherCnic.split('').length !== 15) {
                        motherCnicError = "Please enter valid CNIC number e.g xxxxx-xxxxxxx-x."
                        document.getElementById("motherCnic").focus();
                        isValid = false;
                    } else {
                        motherCnicError = "";
                    }

                }
                if (this.state.motherDocumentTypeId === 2 && !this.state.motherPassport) {
                    motherPassportError = "Please enter passport number."
                    document.getElementById("motherPassport").focus();
                    isValid = false;
                } else {
                    motherPassportError = "";
                    if (this.state.motherDocumentTypeId === 2 && this.state.motherPassport.split('').length !== 9) {
                        motherPassportError = "Please enter valid passport number e.g xxxxxxxxx"
                        document.getElementById("motherPassport").focus();
                        isValid = false;
                    } else {
                        motherPassportError = "";
                    }
                }
                if (this.state.motherDocumentTypeId === 3 && !this.state.motherNicop) {
                    motherNicopError = "Please enter NICOP number."
                    document.getElementById("motherNicop").focus();
                    isValid = false;
                } else {
                    motherNicopError = "";
                    if (this.state.motherDocumentTypeId === 3 && this.state.motherNicop.split('').length !== 15) {
                        motherNicopError = "Please enter valid NICOP number e.g xxxxx-xxxxxxx-x."
                        document.getElementById("motherNicop").focus();
                        isValid = false;
                    } else {
                        motherNicopError = "";
                    }
                }
            }
        }

        if (!this.state.motherName) {
            motherNameError = "Please enter name."
            document.getElementById("motherName").focus();
            isValid = false;
        } else {
            motherNameError = "";
        }

        if (!this.state.motherTitleId) {
            motherTitleIdError = "Please select title."
            document.getElementById("motherTitleId").focus();
            isValid = false;
        } else {
            motherTitleIdError = "";
        }

        if (this.state.fatherTitleId !== 6) {
            if (!this.state.fatherOccupation) {
                fatherOccupationError = "Please select father occupation."
                document.getElementById("fatherOccupation").focus();
                isValid = false;
            } else {
                fatherOccupationError = ""
            }
            /*
                        regex = new RegExp(emailExp);
                        if (!this.state.fatherEmail || !regex.test(this.state.fatherEmail)) {
                            fatherEmailError = "Please enter a valid email e.g name@domain.com"
                            document.getElementById("fatherEmail").focus();
                            isValid = false;
                        } else {
                            fatherEmailError = ""
                        }
            */
            if (!this.state.fatherMobileNo) {
                fatherMobileNoError = "Please enter a valid mobile number e.g 03001234567"
                document.getElementById("fatherMobileNo").focus();
                isValid = false;
            } else {
                fatherMobileNoError = ""
                if (!this.state.fatherMobileNo.startsWith("03") || this.state.fatherMobileNo.split('').length !== 11) {
                    fatherMobileNoError = "Please enter a valid mobile number e.g 03001234567"
                    document.getElementById("fatherMobileNo").focus();
                    isValid = false;
                } else {
                    fatherMobileNoError = ""
                }
            }

            if (!this.state.fatherDocumentTypeId) {
                fatherDocumentTypeIdError = "Please select document type";
                document.getElementById("fatherDocumentTypeId").focus();
                isValid = false;
            } else {
                fatherDocumentTypeIdError = "";
                if (this.state.fatherDocumentTypeId === 1 && !this.state.fatherCnic) {
                    fatherCnicError = "Please enter CNIC number."
                    document.getElementById("fatherCnic").focus();
                    isValid = false;
                } else {
                    fatherCnicError = "";
                    if (this.state.fatherDocumentTypeId === 1 && this.state.fatherCnic.split('').length < 15) {
                        fatherCnicError = "Please enter valid CNIC number e.g xxxxx-xxxxxxx-x."
                        document.getElementById("fatherCnic").focus();
                        isValid = false;
                    } else {
                        fatherCnicError = "";
                    }
                }
                if (this.state.fatherDocumentTypeId === 2 && !this.state.fatherPassport) {
                    fatherPassportError = "Please enter passport number."
                    document.getElementById("fatherPassport").focus();
                    isValid = false;
                } else {
                    fatherPassportError = "";
                    if (this.state.fatherDocumentTypeId === 2 && this.state.fatherPassport.split('').length !== 9) {
                        fatherPassportError = "Please enter valid passport number e.g xxxxxxxxx"
                        document.getElementById("fatherPassport").focus();
                        isValid = false;
                    } else {
                        fatherPassportError = "";
                    }
                }
                if (this.state.fatherDocumentTypeId === 3 && !this.state.fatherNicop) {
                    fatherNicopError = "Please enter NICOP number."
                    document.getElementById("fatherNicop").focus();
                    isValid = false;
                } else {
                    fatherNicopError = "";
                    if (this.state.fatherDocumentTypeId === 3 && this.state.fatherNicop.split('').length !== 15) {
                        fatherNicopError = "Please enter valid NICOP number e.g xxxxx-xxxxxxx-x."
                        document.getElementById("fatherNicop").focus();
                        isValid = false;
                    } else {
                        fatherNicopError = "";
                    }
                }
            }
        }

        if (!this.state.fatherName) {
            fatherNameError = "Please enter name."
            document.getElementById("fatherName").focus();
            isValid = false;
        } else {
            fatherNameError = "";
        }

        if (!this.state.fatherTitleId) {
            fatherTitleIdError = "Please select title."
            document.getElementById("fatherTitleId").focus();
            isValid = false;
        } else {
            fatherTitleIdError = "";
        }
        if (this.state.mailingAddressId === 2) {
            if (!this.state.presentPostalCode) {
                presentPostalCodeError = "Please enter postal code."
                document.getElementById("presentPostalCode").focus();
                isValid = false;
            } else {
                presentPostalCodeError = "";
            }
            if (!this.state.presentCityId) {
                presentCityIdError = "Please select city."
                document.getElementById("presentCityId").focus();
                isValid = false;
            } else {
                presentCityIdError = "";
            }

            if (!this.state.presentProvinceId) {
                presentProvinceIdError = "Please select province."
                document.getElementById("presentProvinceId").focus();
                isValid = false;
            } else {
                presentProvinceIdError = "";
            }

            if (!this.state.presentCountryId) {
                presentCountryIdError = "Please select country."
                document.getElementById("presentCountryId").focus();
                isValid = false;
            } else {
                presentCountryIdError = "";
            }

            if (!this.state.presentAddress) {
                presentAddressError = "Please enter address."
                document.getElementById("presentAddress").focus();
                isValid = false;
            } else {
                presentAddressError = "";
            }

        }


        if (!this.state.mailingAddressId) {
            mailingAddressIdError = "Please select Mailing address type."
            document.getElementById("mailingAddressId").focus();
            isValid = false;
        } else {
            mailingAddressIdError = "";
        }

        if (!this.state.permanentPostalCode) {
            permanentPostalCodeError = "Please enter postal code."
            document.getElementById("permanentPostalCode").focus();
            isValid = false;
        } else {
            permanentPostalCodeError = "";
        }
        if (!this.state.permanentCityId) {
            permanentCityIdError = "Please select city."
            document.getElementById("permanentCityId").focus();
            isValid = false;
        } else {
            permanentCityIdError = "";
        }

        if (!this.state.permanentProvinceId) {
            permanentProvinceIdError = "Please select province."
            document.getElementById("permanentProvinceId").focus();
            isValid = false;
        } else {
            permanentProvinceIdError = "";
        }

        if (!this.state.permanentCountryId) {
            permanentCountryIdError = "Please select country."
            document.getElementById("permanentCountryId").focus();
            isValid = false;
        } else {
            permanentCountryIdError = "";
        }

        if (!this.state.permanentAddress) {
            permanentAddressError = "Please enter address."
            document.getElementById("permanentAddress").focus();
            document.body.scrollTop = 10;
            isValid = false;
        } else {
            permanentAddressError = "";
        }

        /*
        if (!this.state.userBloodGroupId) {
            userBloodGroupIdError = "Please select blood group."
            document.getElementById("userBloodGroupId").focus();
            document.body.scrollTop = 0;
            isValid = false;
        } else {
            userBloodGroupIdError = "";
        }*/

        if (!this.state.userMaterialStatusId) {
            userMaterialStatusIdError = "Please select marital status."
            document.getElementById("userMaterialStatusId").focus();
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            isValid = false;
        } else {
            userMaterialStatusIdError = "";
        }

        if (!this.state.userDocumentTypeId) {
            userDocumentTypeIdError = "Please select document type";
            document.getElementById("userDocumentTypeId").focus();
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            isValid = false;
        } else {
            userDocumentTypeIdError = "";
            if (this.state.userDocumentTypeId === 1 && !this.state.userNicopCnicBform) {
                userNicopCnicBformError = "Please enter CNIC / B Form number."
                document.getElementById("userNicopCnicBform").focus();
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
                isValid = false;
            } else {
                userNicopCnicBformError = "";
                if ((this.state.userDocumentTypeId === 1 || this.state.userDocumentTypeId === 4) && this.state.userNicopCnicBform.split('').length !== 15) {
                    userNicopCnicBformError = "Please enter valid CNIC / B Form number e.g xxxxx-xxxxxxx-x."
                    document.getElementById("userNicopCnicBform").focus();
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                    isValid = false;
                } else {
                    userNicopCnicBformError = "";
                }
            }
            if (this.state.userDocumentTypeId === 2 && !this.state.userPassport) {
                userPassportError = "Please enter passport number."
                document.getElementById("userPassport").focus();
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
                isValid = false;
            } else {
                userPassportError = "";
                if (this.state.userDocumentTypeId === 2 && this.state.userPassport.split('').length !== 9) {
                    userPassportError = "Please enter valid passport number e.g xxxxxxxxx"
                    document.getElementById("userPassport").focus();
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                    isValid = false;
                } else {
                    userPassportError = "";
                }
            }
            if (this.state.userDocumentTypeId === 3 && !this.state.userNicop) {
                userNicopError = "Please enter NICOP number."
                document.getElementById("userNicop").focus();
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
                isValid = false;
            } else {
                userNicopError = "";
                if (this.state.userDocumentTypeId === 3 && this.state.userNicop.split('').length !== 15) {
                    userNicopError = "Please enter valid NICOP number e.g xxxxx-xxxxxxx-x."
                    document.getElementById("userNicop").focus();
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                    isValid = false;
                } else {
                    userNicopError = "";
                }

            }
        }

        if (!this.state.nationalityId) {
            nationalityIdError = "Please select nationality"
            document.getElementById("nationalityId").focus();
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            isValid = false;
        } else {
            nationalityIdError = "";
        }

        if (!this.state.mobileNo) {
            mobileNoError = "Please enter mobile number"
            document.getElementById("mobileNo").focus();
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            isValid = false;
        } else {
            mobileNoError = "";
            if (!this.state.mobileNo.startsWith("03") || this.state.mobileNo.split('').length !== 11) {
                mobileNoError = "Please enter a valid mobile number e.g 03001234567"
                document.getElementById("mobileNo").focus();
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
                isValid = false;
            } else {
                mobileNoError = ""
            }
        }

        regex = new RegExp(emailExp);
        if (!this.state.email || !regex.test(this.state.email)) {
            emailError = "Please enter a valid email e.g name@domain.com"
            document.getElementById("email").focus();
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            isValid = false;
        } else {
            emailError = ""
        }

        if (!this.state.genderId) {
            genderIdError = "Please select gender"
            document.getElementById("genderId").focus();
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            isValid = false;
        } else {
            genderIdError = "";
        }

        if (!this.state.dateOfBirth) {
            dateOfBirthError = "Please select date of birth"
            document.getElementById("dateOfBirth").focus();
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            isValid = false;
        } else {
            dateOfBirthError = "";
        }

        if (!this.state.lastName) {
            lastNameError = "Please enter last name"
            document.getElementById("lastName").focus();
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            isValid = false;
        } else {
            lastNameError = "";
        }

        if (!this.state.firstName) {
            firstNameError = "Please enter first name"
            document.getElementById("firstName").focus();
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            isValid = false;
        } else {
            firstNameError = "";
        }

        if (this.state.appliedFor === 8 && !this.state.chessSubDegree) {
            chessSubDegreeError = "Please select degree"
            document.getElementById("chessSubDegree").focus();
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            isValid = false;
        } else {
            chessSubDegreeError = "";
        }

        if (this.state.appliedFor === 32 && !this.state.yearAlevel) {
            yearAlevelError = "Please select A level year"
            document.getElementById("yearAlevel").focus();
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            isValid = false;
        } else {
            yearAlevelError = "";
        }

        if (!this.state.appliedFor) {
            appliedForError = "Please select programme"
            document.getElementById("appliedFor").focus();
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            isValid = false;
        } else {
            appliedForError = "";
        }

        this.setState({
            iAgreeCheckError,
            reasonsError,
            hearFromError,
            hearMagzineNameError,
            hearOtherSourceError,
            checkMedicalError,
            medicalMobileNumberError,
            medicalRelationshipIdError,
            medicalNameError,
            medicalConditionError,
            academicSec2Error,
            academicsOverallMarksSec2Error,
            academicsIsResultAwaitedSec2Error,
            academicsYearAwardedSec2Error,
            academicsQualificationSec2Error,
            academicsNameOfInstitutionSec2Error,
            academicsNameOfAwardingBodySec2Error,
            academicSec1Error,
            academicsOverallMarksSec1Error,
            academicsIsResultAwaitedSec1Error,
            academicsYearAwardedSec1Error,
            academicsQualificationSec1Error,
            academicsNameOfInstitutionSec1Error,
            academicsNameOfAwardingBodySec1Error,
            guardianInformationIdError,
            guardianOccupationError,
            guardianEmailError,
            guardianMobileNoError,
            guardianRelationIdError,
            guardianRelationOtherError,
            guardianDocumentTypeIdError,
            guardianCnicError,
            guardianPassportError,
            guardianNicopError,
            guardianNameError,
            guardianTitleIdError,
            motherOccupationError,
            motherEmailError,
            motherMobileNoError,
            motherDocumentTypeIdError,
            motherCnicError,
            motherPassportError,
            motherNicopError,
            motherNameError,
            motherTitleIdError,
            fatherOccupationError,
            fatherEmailError,
            fatherMobileNoError,
            fatherDocumentTypeIdError,
            fatherCnicError,
            fatherPassportError,
            fatherNicopError,
            fatherNameError,
            fatherTitleIdError,
            mailingAddressIdError,
            presentAddressError,
            presentCityIdError,
            presentCountryIdError,
            presentPostalCodeError,
            presentProvinceIdError,
            permanentAddressError,
            permanentCityIdError,
            permanentCountryIdError,
            permanentPostalCodeError,
            permanentProvinceIdError,
            userMaterialStatusIdError,
            userBloodGroupIdError,
            userDocumentTypeIdError,
            userNicopCnicBformError,
            userPassportError,
            userNicopError,
            nationalityIdError,
            mobileNoError,
            emailError,
            genderIdError,
            dateOfBirthError,
            firstNameError,
            lastNameError,
            categoryError: "",
            appliedForError,
            yearAlevelError,
            chessSubDegreeError,
            aLevelAcademicError,
            nameOfSchoolAlevelError,
            addressOfSchoolAlevelError,
            nameOfPersonAlevelError,
            addressOfPersonAlevelError,
            professionOfPersonAlevelError,
            checkSubjectsError,
            checkSubjectsGroup19Error
        })

        return isValid;
    }

    handleOnClick = () => {
        if (this.isFormValid()) {
            document.getElementById('submit-button').click();
        }
    }

    onFormSubmit = async e => {
        e.preventDefault();
        const data = new FormData(e.target);
        this.setState({
            isLoading: true
        })
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C01AdmissionsProspectApplication`;
        await fetch(url, {
            method: "POST", body: data, headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclToken")
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
                        window.localStorage.setItem("isSaved", 1);
                        window.localStorage.setItem("applicationId", json.DATA[0].ApplicationId);
                        document.body.scrollTop = 0;
                        document.documentElement.scrollTop = 0;
                        this.handleSuccessDialog();
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
        this.setState({
            isLoading: false
        })
    }

    setData = (data = {}) => {
        const nationalityObject = this.state.nationalityData.find(item => item.ID === data.nationalityId);
        const permanentCountriesObject = this.state.countriesData.find(item => item.ID === data.permanentCountryId);
        const presentCountriesObject = this.state.countriesData.find(item => item.ID === data.mailingCountryId);
        const otherQua = data.otherQualifications || [];
        const academicSec1 = data.graduationAcademicsSubjectsInter || [];
        const academicSec2 = data.graduationAcademicsSubjectsBachelors || [];
        const extraActivity = data.coCurricularActivities || [];
        const workExperience = data.workExperience || [];
        const uclRelation = data.relativesStatus || [];
        const olevelAcademics = data.alevelAcademicsSubjects || [];
        const takenSubjects = data.alevelTakenSubjects || [];
        let otherQualificationArr = [];
        let sec1Record = [];
        let sec2Record = [];
        let activityRecord = [];
        let workRecord = [];
        let uclRelationRecord = [];
        let olevelAcademicsRecord = [];
        let takenSubjectsRecord = [];
        let takenSubjectsGroup19Record = [];

        if (otherQua.length > 0) {
            for (let i = 0; i < otherQua.length; i++) {
                otherQualificationArr.push({
                    nameAward: otherQua[i].awardingBody,
                    nameInstitution: otherQua[i].institution,
                    qualification: otherQua[i].qualification
                });
            }
        }

        if (academicSec1.length > 0) {
            for (let i = 0; i < academicSec1.length; i++) {
                sec1Record.push({
                    subject: academicSec1[i].subject,
                    gradeMarks: academicSec1[i].grade || academicSec1[i].marks
                });
            }
        }

        if (academicSec2.length > 0) {
            for (let i = 0; i < academicSec2.length; i++) {
                sec2Record.push({
                    subject: academicSec2[i].subject,
                    gradeMarks: academicSec2[i].grade || academicSec2[i].marks
                });
            }
        }

        if (extraActivity.length > 0) {
            for (let i = 0; i < extraActivity.length; i++) {
                activityRecord.push({
                    institution: extraActivity[i].institution,
                    tenure: extraActivity[i].tenureMonths,
                    activity: extraActivity[i].activity,
                    position: extraActivity[i].position,
                    nature: extraActivity[i].natureOfPositionHeld
                });
            }
        }

        if (workExperience.length > 0) {
            for (let i = 0; i < workExperience.length; i++) {
                workRecord.push({
                    organization: workExperience[i].organization,
                    tenure: workExperience[i].tenureMonths,
                    activity: workExperience[i].activity,
                    position: workExperience[i].position,
                    nature: workExperience[i].natureOfPositionHeld
                });
            }
        }

        if (uclRelation.length > 0) {
            for (let i = 0; i < uclRelation.length; i++) {
                uclRelationRecord.push({
                    institution: uclRelation[i].institutionLabel,
                    relationship: uclRelation[i].relationship,
                    status: uclRelation[i].roleLabel,
                    designation: uclRelation[i].designation,
                    name2: uclRelation[i].name,
                    department: uclRelation[i].department,
                    program: uclRelation[i].programme,
                    year: uclRelation[i].graduationYear || "",
                    uclRoleId: uclRelation[i].roleId,
                    uclInstitutionId: uclRelation[i].institutionId,

                });
            }
        }

        if (olevelAcademics.length > 0) {
            for (let i = 0; i < olevelAcademics.length; i++) {
                olevelAcademicsRecord.push({
                    subject: olevelAcademics[i].subject,
                    exam: olevelAcademics[i].examTitle,
                    board: olevelAcademics[i].board,
                    session: olevelAcademics[i].session,
                    grade: olevelAcademics[i].grade
                });
            }
        }

        if (takenSubjects.length > 0) {

            this.setState({
                switchSateGroupId:takenSubjects[0].aLevelTakenSubjectGroupId
            });
            
            for (let i = 0; i < takenSubjects.length; i++) {
                if(takenSubjects[i].aLevelTakenSubjectGroupId==19){
                    takenSubjectsGroup19Record.push({
                        id: takenSubjects[i].subjectId,
                        checked: takenSubjects[i].subjectId,
                        label: takenSubjects[i].subjectLabel,
                        //grpId: takenSubjects[i].groupId
                        grpId: takenSubjects[i].aLevelTakenSubjectGroupId
                    })
                }else{
                    takenSubjectsRecord.push({
                        id: takenSubjects[i].subjectId,
                        checked: takenSubjects[i].subjectId,
                        label: takenSubjects[i].subjectLabel,
                        //grpId: takenSubjects[i].groupId
                        grpId: takenSubjects[i].aLevelTakenSubjectGroupId
                    })
                }
                
            }
        }

        const dob = data.dateOfBirthWithOutConversion ? new Date(data.dateOfBirthWithOutConversion) : new Date();

        this.setState({
            appliedFor: data.degreeId || "",
            category: data.isTransferCandidate || 0,
            yearAlevel: data.alevelAdmissionYear || "",
            chessSubDegree: data.chessDegreeTransferId || "",
            firstName: data.firstName || "",
            middleName: data.middleName || "",
            lastName: data.lastName || "",
            dateOfBirth: dob,
            genderId: data.genderId || "",
            nationalityId: data.nationalityId || "",
            nationalityIdObject: nationalityObject || {},
            mobileNo: data.mobileNo || "",
            userDocumentTypeId: data.studentIdentity || "",
            userNicopCnicBform: data.cnicBform || "",
            userPassport: data.passportNumber || "",
            userBform: data.cnicBform || "",
            userNicop: data.nicopNumber || "",
            userMaterialStatusId: data.maritalStatusId || "",
            userBloodGroupId: data.bloodGroupId || "",

            mailingAddressId: data.mailingAddressTypeId || "",
            presentAddress: data.mailingAddress || "",
            presentPostalCode: data.mailingPostalCode || "",
            presentCountryId: data.mailingCountryId || "",
            presentCountryIdObject: presentCountriesObject || {},

            permanentAddress: data.permanentAddress || "",
            permanentPostalCode: data.permanentPostalCode || "",
            permanentCountryId: data.permanentCountryId || "",
            permanentCountryIdObject: permanentCountriesObject || {},

            fatherTitleId: data.fatherTitleId || "",
            fatherDocumentTypeId: data.fatherIdentityType || "",
            fatherCnic: data.fatherIdentityType === 1 ? data.fatherCnicPassport : "",
            fatherPassport: data.fatherIdentityType === 2 ? data.fatherCnicPassport : "",
            fatherNicop: data.fatherIdentityType === 3 ? data.fatherCnicPassport : "",
            fatherOccupation: data.fatherOccupationId || "",
            fatherMobileNo: data.fatherMobileNo || "",
            fatherName: data.fatherName || "",
            fatherEmail: data.fatherEmail || "",

            motherTitleId: data.motherTitleId || "",
            motherDocumentTypeId: data.motherIdentityType || "",
            motherCnic: data.motherIdentityType === 1 ? data.motherCnicPassport : "",
            motherPassport: data.motherIdentityType === 2 ? data.motherCnicPassport : "",
            motherNicop: data.motherIdentityType === 3 ? data.motherCnicPassport : "",
            motherOccupation: data.motherOccupationId || "",
            motherMobileNo: data.motherMobileNo || "",
            motherName: data.motherName || "",
            motherEmail: data.motherEmail || "",

            guardianInformationId: data.guardianId || "",
            guardianDocumentTypeId: data.guardianIdentity || "",
            guardianTitleId: data.guardianTitleId || "",
            guardianCnic: data.guardianIdentity === 1 ? data.guardianCnicPassport : "",
            guardianPassport: data.guardianIdentity === 2 ? data.guardianCnicPassport : "",
            guardianNicop: data.guardianIdentity === 3 ? data.guardianCnicPassport : "",
            guardianOccupation: data.guardianOccupationId || "",
            guardianMobileNo: data.guardianMobileNo || "",
            guardianName: data.guardianName || "",
            guardianEmail: data.guardianEmail || "",
            guardianRelationId: data.guardianRelationWithStudentId || "",
            guardianRelationOther: "",

            nameOfPersonAlevel: data.financialName || "",
            addressOfPersonAlevel: data.financialAddress || "",
            professionOfPersonAlevel: data.financialProfession || "",

            nameOfSchoolAlevel: data.olevelSchoolName || "",
            addressOfSchoolAlevel: data.olevelSchoolAddress || "",
            aLevelAcademicRecordsArray: olevelAcademicsRecord,

            academicsNameOfAwardingBodySec1: data.interAwardingBody || "",
            academicsNameOfInstitutionSec1: data.interInstitution || "",
            academicsQualificationSec1: data.interQualification || "",
            academicsYearAwardedSec1: data.interYearAwarded || "",
            academicsIsResultAwaitedSec1: data.interIsResultAwaiting || 0,
            academicsOverallMarksSec1: data.interMarks || "",
            academicRecordsArray: sec1Record,


            academicsNameOfAwardingBodySec2: data.bachelorsAwardingBody || "",
            academicsNameOfInstitutionSec2: data.bachelorsInstitution || "",
            academicsQualificationSec2: data.bachelorsQualification || "",
            academicsYearAwardedSec2: data.bachelorsYearAwarded || "",
            academicsIsResultAwaitedSec2: data.bachelorsIsResultAwaiting || 0,
            academicsOverallMarksSec2: data.bachelorsGrade || "",
            academicSec2RecordsArray: sec2Record,

            qualificationRecordsArray: otherQualificationArr,

            activityRecordsArray: activityRecord,

            checkSubjects: takenSubjectsRecord,

            checkSubjectsGroup19:takenSubjectsGroup19Record,
            workRecordsArray: workRecord,

            uclRelationRecordsArray: uclRelationRecord,

            checkMedical: data.isAnyMedicalCondition || 0,
            medicalCondition: data.medicalCondition || "",
            medicalName: data.emergencyContactPersonName || "",
            medicalRelationshipId: data.emergencyContactRelationshipId || "",
            medicalMobileNumber: data.emergencyContactNumber || "",

            hearFrom: data.uclSourceId || "",
            hearMagzineName: data.uclSourceName || "",
            hearOtherSource: data.uclOtherSource || "",

            reasons: data.reasonsForApplying || "",



            data,

        })
    }

    getData = async () => {
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C01AdmissionsProspectApplicationView`;
        await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer " + localStorage.getItem("uclToken")
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
                                this.getProvinceData(json.DATA[0].mailingCountryId, "present", json.DATA[0].mailingProvinceId);
                                this.getProvinceData(json.DATA[0].permanentCountryId, "permanent", json.DATA[0].permanentProvinceId);
                                this.getCitiesData(json.DATA[0].mailingProvinceId, "present", json.DATA[0].mailingCityId);
                                this.getCitiesData(json.DATA[0].permanentProvinceId, "permanent", json.DATA[0].permanentCityId);
                                this.setData(json.DATA[0]);
                            }
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
                            isReload: true
                        })
                    } else {
                        alert('Failed to fetch, Please try again later.');
                        console.log(error);
                    }
                });

    }

    handleClose = () => {
        this.setState({
            openReview: false,
        })
    }

    render() {
        const { classes } = this.props;
        let fatherDBCnic = "";
        switch (this.state.fatherDocumentTypeId) {
            case 1:
                fatherDBCnic = this.state.fatherCnic;
                break;
            case 2:
                fatherDBCnic = this.state.fatherPassport;
                break;
            case 3:
                fatherDBCnic = this.state.fatherNicop;
                break;
            default:
                break;
        }
        let motherDBCnic = "";
        switch (this.state.motherDocumentTypeId) {
            case 1:
                motherDBCnic = this.state.motherCnic;
                break;
            case 2:
                motherDBCnic = this.state.motherPassport;
                break;
            case 3:
                motherDBCnic = this.state.motherNicop;
                break;
            default:
                break;
        }
        let guardianDBCnic = "";
        switch (this.state.guardianDocumentTypeId) {
            case 1:
                guardianDBCnic = this.state.guardianCnic;
                break;
            case 2:
                guardianDBCnic = this.state.guardianPassport;
                break;
            case 3:
                guardianDBCnic = this.state.guardianNicop;
                break;
            default:
                break;
        }
       // alert(this.state.dateOfBirth);
        const userDob = format(this.state.dateOfBirth || new Date('2000-01-01'), 'dd/MM/yyyy');
        console.log(this.state.nationalityIdObject);
        return (
            <Fragment>
                <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })} />

                <Dialog
                    open={this.state.loadingData}
                    backdropClick
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <CircularProgress />
                        <span style={{
                            marginTop: 15,
                            marginBottom: 15
                        }}>Please Wait...</span>
                    </DialogContent>
                </Dialog>


                <Dialog
                    open={this.state.successDialog}
                    onClose={this.handleSuccessDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Success"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Your admission application is now complete. Please click OK to upload the required documents.
            </DialogContentText>
                    </DialogContent>
                    <DialogActions>

                        <Button color="primary" >
                            <Link style={{ textDecoration: 'none' }} to='/dashboard/documents'>
                                OK
                            </Link>
                        </Button>
                    </DialogActions>
                </Dialog>
                <Grid container component="main" className={classes.root}>
                    <Typography style={{
                        color: '#1d5f98', fontWeight: 600, borderBottom: '1px solid #d2d2d2',
                        width: '98%', marginBottom: 25, fontSize: 20
                    }} variant="h5">
                        Add Employee
                    </Typography>
                    <Divider style={{
                        backgroundColor: 'rgb(58, 127, 187)',
                        opacity: '0.3'
                    }} />
                     <Grid container spacing={2} style={{ marginLeft: 5, marginRight: 10 }}>
                    {/*<Grid xs={12}>
                            <span className={classes.sectionTitle}>
                                Course Applied For
                            </span>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl error={!!this.state.appliedForError} className={classes.formControl}>
                                <InputLabel htmlFor="appliedFor">Programme</InputLabel>
                                <Select name="appliedFor" id="appliedFor" value={this.state.appliedFor} onChange={this.handleChange}>
                                    {this.state.degreeData.map((item, index) => {
                                        return (<MenuItem key={index} disabled={!item.id} value={item.id}>{item.label}</MenuItem>);
                                    })
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        {this.state.appliedFor === 32 && <Grid item xs={12} sm={6}>
                            <FormControl error={!!this.state.yearAlevelError} className={classes.formControl}>
                                <InputLabel htmlFor="yearAlevel">Select Year for ‘A’ Level Admission</InputLabel>
                                <Select value={this.state.yearAlevel} onChange={this.handleChange} name="yearAlevel" id="yearAlevel">
                                    <MenuItem value={1}>Year 1</MenuItem>
                                    <MenuItem value={2}>Year 2</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        }

                        {this.state.appliedFor === 8 && <Grid item xs={12} sm={6}>
                            <FormControl error={!!this.state.chessSubDegreeError} className={classes.formControl}>
                                <InputLabel htmlFor="chessSubDegree">Specify the degree to	transfer after completing  the CHESS</InputLabel>
                                <Select onChange={this.handleChange} value={this.state.chessSubDegree} name="chessSubDegree" id="chessSubDegree">
                                    {this.state.chessSubDegreeData.map((item, index) => {
                                        return (<MenuItem key={index} value={item.id}>{item.label}</MenuItem>);
                                    })
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        }

                        <Grid style={{ marginBottom: 10 }} item xs={12} sm={6}>
                            <FormControl error={!!this.state.categoryError} className={classes.formControl}>
                                <InputLabel htmlFor="category">Category</InputLabel>
                                <Select value={this.state.category} onChange={this.handleChange} name="category" id="category">
                                    <MenuItem value={0}>New Admission</MenuItem>
                                    <MenuItem value={1}>Transfer</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid> */}
                        {/* <Grid xs={12}>
                            <span className={classes.sectionTitle}>
                                Personal Information
                            </span>
                        </Grid> */}
                        <Grid item xs={6}>
                            <TextField
                                id="firstName"
                                name="firstName"
                                label="Employee Code"
                                required
                                fullWidth
                                onKeyDown={this.StopEnter}
                                onChange={this.handleChange}
                                value={this.state.firstName}
                                error={!!this.state.firstNameError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <DatePicker
                                format="dd-MMM-yyyy"
                                views={["year", "month", "date"]}
                                openTo={"year"}
                                autoOk
                                invalidDateMessage=""
                                label="Joining Date"
                                name="dateOfBirth"
                                id="dateOfBirth"
                                value={this.state.dateOfBirth}
                                // onChange={this.handleDateChange}
                                required
                                disableFuture
                                error={!!this.state.dateOfBirthError}
                                disableOpenOnEnter
                                animateYearScrolling={false}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="mobileNo"
                                name="mobileNo"
                                label="Card No"
                                type="text"
                                inputProps={{
                                    maxLength: 11
                                }}
                                onChange={this.handleChange}
                                placeholder="e.g 03XXXXXXXXX"
                                helperText={this.state.mobileNo ? this.state.mobileNoError : ""}
                                value={this.state.mobileNo}
                                error={!!this.state.mobileNoError}
                                required
                                fullWidth
                                onKeyDown={this.StopEnter}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <DatePicker
                                format="dd-MMM-yyyy"
                                views={["year", "month", "date"]}
                                openTo={"year"}
                                autoOk
                                invalidDateMessage=""
                                label="Date of Birth"
                                name="dateOfBirth"
                                id="dateOfBirth"
                                value={this.state.dateOfBirth}
                                // onChange={this.handleDateChange}
                                required
                                disableFuture
                                error={!!this.state.dateOfBirthError}
                                disableOpenOnEnter
                                animateYearScrolling={false}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="firstName"
                                name="firstName"
                                label="Employee Name"
                                required
                                fullWidth
                                // onKeyDown={this.StopEnter}
                                // onChange={this.handleChange}
                                value={this.state.firstName}
                                error={!!this.state.firstNameError}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl error={!!this.state.appliedForError} className={classes.formControl}>
                                <InputLabel htmlFor="appliedFor">Employee Type</InputLabel>
                                <Select name="appliedFor" id="appliedFor" value={this.state.appliedFor} onChange={this.handleChange}>
                                    {this.state.degreeData.map((item, index) => {
                                        return (<MenuItem key={index} disabled={!item.id} value={item.id}>{item.label}</MenuItem>);
                                    })
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="firstName"
                                name="firstName"
                                label="Password"
                                required
                                fullWidth
                                type="password"
                                onKeyDown={this.StopEnter}
                                onChange={this.handleChange}
                                // value={this.state.firstName}
                                // error={!!this.state.firstNameError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                                <InputLabel htmlFor="academicsIsResultAwaitedSec2">Status</InputLabel>
                                <Select
                                    name="academicsIsResultAwaitedSec2"
                                    id="academicsIsResultAwaitedSec2"
                                    fullWidth
                                    required
                                    value={this.state.academicsIsResultAwaitedSec2}
                                    onChange={this.handleChange}
                                    inputProps={{
                                        name: "academicsIsResultAwaitedSec2",
                                        id: "academicsIsResultAwaitedSec2"
                                    }}
                                >
                                    <MenuItem value={1}>Active</MenuItem>
                                    <MenuItem value={0}>Deactive</MenuItem>
                                </Select>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="firstName"
                                name="firstName"
                                label="Father Name"
                                required
                                fullWidth
                                // onKeyDown={this.StopEnter}
                                // onChange={this.handleChange}
                                // value={this.state.firstName}
                                // error={!!this.state.firstNameError}
                            />
                        </Grid>
                        <Grid item xs={6}>
                        <TextField
                                id="time"
                                label="Duty Start Time"
                                type="time"
                                defaultValue="07:30"
                                fullWidth
                                InputLabelProps={{
                                shrink: true,
                                }}
                                inputProps={{
                                step: 300, // 5 min
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl error={!!this.state.appliedForError} className={classes.formControl}>
                                <InputLabel htmlFor="appliedFor">Company Name</InputLabel>
                                <Select name="appliedFor" id="appliedFor" value={this.state.appliedFor} onChange={this.handleChange}>
                                    {this.state.degreeData.map((item, index) => {
                                        return (<MenuItem key={index} disabled={!item.id} value={item.id}>{item.label}</MenuItem>);
                                    })
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                        <TextField
                                id="time"
                                label="End Start Time"
                                type="time"
                                defaultValue="07:30"
                                fullWidth
                                InputLabelProps={{
                                shrink: true,
                                }}
                                inputProps={{
                                step: 300, // 5 min
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl error={!!this.state.appliedForError} className={classes.formControl}>
                                <InputLabel htmlFor="appliedFor">Department</InputLabel>
                                <Select name="appliedFor" id="appliedFor" value={this.state.appliedFor} onChange={this.handleChange}>
                                    {this.state.degreeData.map((item, index) => {
                                        return (<MenuItem key={index} disabled={!item.id} value={item.id}>{item.label}</MenuItem>);
                                    })
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                        <TextField
                                id="time"
                                label="Break Start Time"
                                type="time"
                                defaultValue="07:30"
                                fullWidth
                                InputLabelProps={{
                                shrink: true,
                                }}
                                inputProps={{
                                step: 300, // 5 min
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl error={!!this.state.appliedForError} className={classes.formControl}>
                                <InputLabel htmlFor="appliedFor">Designation</InputLabel>
                                <Select name="appliedFor" id="appliedFor" value={this.state.appliedFor} onChange={this.handleChange}>
                                    {this.state.degreeData.map((item, index) => {
                                        return (<MenuItem key={index} disabled={!item.id} value={item.id}>{item.label}</MenuItem>);
                                    })
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                        <TextField
                                id="time"
                                label="Break End Time"
                                type="time"
                                defaultValue="07:30"
                                fullWidth
                                InputLabelProps={{
                                shrink: true,
                                }}
                                inputProps={{
                                step: 300, // 5 min
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                id="permanentCityId"
                                getOptionLabel={(option) => option.Label}
                                fullWidth
                                options={this.state.permanentCitiesData}
                                onChange={this.handleAutoComplete("permanentCityId")}
                                value={this.state.permanentCityIdObject}
                                renderInput={(params) => <TextField label="City" error={!!this.state.permanentCityIdError} {...params}
                                />}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Autocomplete
                                id="nationalityId"
                                getOptionLabel={(option) => option.Label}
                                fullWidth
                                options={this.state.nationalityData}
                                onChange={this.handleAutoComplete("nationalityId")}
                                value={this.state.nationalityIdObject}
                                renderInput={(params) => <TextField label="Nationality" error={!!this.state.nationalityIdError} {...params}
                                />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="permanentAddress"
                                name="permanentAddress"
                                label="Address"
                                value={this.state.permanentAddress}
                                error={!!this.state.permanentAddressError}
                                onChange={this.handleChange}
                                type="text"
                                onKeyDown={this.keyPress}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl error={!!this.state.userMaterialStatusIdError} className={classes.formControl}>
                                <InputLabel htmlFor="userMaterialStatusId">Marital Status</InputLabel>
                                <Select
                                    name="userMaterialStatusId"
                                    id="userMaterialStatusId"
                                    fullWidth
                                    required
                                    label="Marital Status"
                                    onChange={this.handleChange}
                                    value={this.state.userMaterialStatusId}
                                    inputProps={{
                                        name: "userMaterialStatusId",
                                        id: "userMaterialStatusId"
                                    }}
                                >
                                    {
                                        this.state.materialStatusData.map(item => {
                                            return (
                                                <MenuItem key={item.ID} value={item.ID}>{item.Label}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="mobileNo"
                                name="mobileNo"
                                label="Phone"
                                type="number"
                                inputProps={{
                                    maxLength: 11
                                }}
                                onChange={this.handleChange}
                                placeholder="e.g 03XXXXXXXXX"
                                helperText={this.state.mobileNo ? this.state.mobileNoError : ""}
                                value={this.state.mobileNo}
                                error={!!this.state.mobileNoError}
                                required
                                fullWidth
                                onKeyDown={this.StopEnter}
                            />
                        </Grid>
                        <Grid item xs={6} style={{
                            marginTop: "20px"
                        }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        id="checkMedical"
                                        name="checkMedical"
                                        onChange={(e) => this.handleCustomChange(e, 0)}
                                        checked={this.state.checkMedical === 0}
                                        color="primary"
                                    />
                                }
                                label="Head of the Department"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="mobileNo"
                                name="mobileNo"
                                label="Mobile"
                                type="number"
                                inputProps={{
                                    maxLength: 11
                                }}
                                onChange={this.handleChange}
                                placeholder="e.g 03XXXXXXXXX"
                                helperText={this.state.mobileNo ? this.state.mobileNoError : ""}
                                value={this.state.mobileNo}
                                error={!!this.state.mobileNoError}
                                required
                                fullWidth
                                onKeyDown={this.StopEnter}
                            />
                        </Grid>
                        <Grid item xs={6} style={{
                            marginTop: "20px"
                        }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        id="checkMedical"
                                        name="checkMedical"
                                        onChange={(e) => this.handleCustomChange(e, 0)}
                                        checked={this.state.checkMedical === 0}
                                        color="primary"
                                    />
                                }
                                label="Disable Time Monitoring"
                            />
                        </Grid>
                        <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    id="userNicopCnicBform"
                                    name="userNicopCnicBform"
                                    label="CNIC"
                                    type="text"
                                    required
                                    placeholder="e.g xxxxx-xxxxxxx-x"
                                    helperText={this.state.userNicopCnicBform ? this.state.userNicopCnicBformError : ""}
                                    onChange={this.cnicCheckHandling}
                                    value={this.state.userNicopCnicBform}
                                    error={!!this.state.userNicopCnicBformError}
                                    onKeyDown={this.StopEnter}
                                />
                            </Grid>
                            <Grid item xs={6} style={{
                            marginTop: "20px"
                        }}>
                            <FormControlLabel
                                label="Payroll Options"
                                control={
                                    <Checkbox
                                        id="checkMedical"
                                        name="checkMedical"
                                        onChange={(e) => this.handleCustomChange(e, 0)}
                                        checked={this.state.checkMedical === 0}
                                        color="primary"
                                        slot="end"
                                    />
                                }
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl error={!!this.state.genderIdError} className={classes.formControl}>
                                <InputLabel htmlFor="genderId">Gender</InputLabel>
                                <Select
                                    label="Select Gender"
                                    name="genderId"
                                    id="genderId"
                                    fullWidth
                                    required
                                    onChange={this.handleChange}
                                    value={this.state.genderId}
                                    inputProps={{
                                        name: "genderId",
                                        id: "genderId",
                                        ref: this.selectRef
                                    }}
                                >
                                    {this.state.genderData.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl error={!!this.state.userBloodGroupIdError} className={classes.formControl}>
                                <InputLabel htmlFor="userBloodGroupId">Blood Group</InputLabel>
                                <Select
                                    name="userBloodGroupId"
                                    id="userBloodGroupId"
                                    fullWidth
                                    required
                                    onChange={this.handleChange}
                                    value={this.state.userBloodGroupId}
                                    inputProps={{
                                        name: "userBloodGroupId",
                                        id: "userBloodGroupId"
                                    }}
                                >
                                    {
                                        this.state.bloodGroupData.map(item => {
                                            return (
                                                <MenuItem key={item.ID} value={item.ID}>{item.Label}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                onKeyDown={this.StopEnter}
                                id="email"
                                name="email"
                                label="Email Address"
                                type="email"
                                onChange={this.handleChange}
                                placeholder="e.g name@domain.com"
                                helperText={this.state.email ? this.state.emailError : ""}
                                value={this.state.email}
                                error={!!this.state.emailError}
                                disabled
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Autocomplete
                                id="nationalityId"
                                getOptionLabel={(option) => option.Label}
                                fullWidth
                                options={this.state.nationalityData}
                                onChange={this.handleAutoComplete("nationalityId")}
                                value={this.state.nationalityIdObject}
                                renderInput={(params) => <TextField label="Reporting to" error={!!this.state.nationalityIdError} {...params}
                                />}
                            />
                        </Grid>
                        <Grid item xs={2} justify="center">
                            <Button disabled={this.state.isLoading} onClick={this.handleOnClick} color="primary" variant="contained" style={{ width: '100%', backgroundColor: '#174A84' }}>
                                {this.state.isLoading ? <CircularProgress style={{ color: 'white' }} size={24} /> : "Submit"}
                            </Button>
                        </Grid>
                        <Grid item xs={2} justify="center">
                            <Button disabled={this.state.isLoading} onClick={this.handleOnClick} color="primary" variant="contained" style={{ width: '100%', backgroundColor: '#174A84' }}>
                                {this.state.isLoading ? <CircularProgress style={{ color: 'white' }} size={24} /> : "Reset"}
                            </Button>
                        </Grid>

                    </Grid>
                </Grid>

                <form onSubmit={this.onFormSubmit}>
                    <input type="hidden" value={this.state.appliedFor} name="degreeId" />
                    <input type="hidden" value={this.state.chessSubDegree} name="chessDegreeTransferId" />
                    <input type="hidden" value={this.state.yearAlevel} name="alevelAdmissionYear" />
                    <input type="hidden" value={this.state.category} name="isTransferCandidate" />

                    <input type="hidden" value={this.state.firstName} name="firstName" />
                    <input type="hidden" value={this.state.middleName} name="middleName" />
                    <input type="hidden" value={this.state.lastName} name="lastName" />
                    <input type="hidden" value={userDob} name="dateOfBirth" />
                    <input type="hidden" value={this.state.genderId} name="genderId" />
                    <input type="hidden" value={this.state.email} name="email" />
                    <input type="hidden" value={this.state.mobileNo} name="mobileNo" />
                    <input type="hidden" value={this.state.nationalityId} name="nationalityId" />
                    <input type="hidden" value={this.state.userMaterialStatusId} name="maritalStatusId" />
                    <input type="hidden" value={this.state.userDocumentTypeId} name="studentIdentity" />
                    <input type="hidden" value={this.state.userNicopCnicBform} name="cnicBform" />
                    <input type="hidden" value={this.state.userNicop} name="nicopNumber" />
                    <input type="hidden" value={this.state.userPassport} name="passportNumber" />
                    <input type="hidden" value={this.state.userBloodGroupId} name="bloodGroupId" />

                    <input type="hidden" value={this.state.permanentAddress} name="permanentAddress" />
                    <input type="hidden" value={this.state.permanentCountryId} name="permanentCountryId" />
                    <input type="hidden" value={this.state.permanentProvinceId} name="permanentProvinceId" />
                    <input type="hidden" value={this.state.permanentCityId} name="permanentCityId" />
                    <input type="hidden" value={this.state.permanentPostalCode} name="permanentPostalCode" />

                    <input type="hidden" value={this.state.mailingAddressId} name="mailingAddressTypeId" />
                    <input type="hidden" value={this.state.presentAddress} name="mailingAddress" />
                    <input type="hidden" value={this.state.presentCountryId} name="mailingCountryId" />
                    <input type="hidden" value={this.state.presentProvinceId} name="mailingProvinceId" />
                    <input type="hidden" value={this.state.presentCityId} name="mailingCityId" />
                    <input type="hidden" value={this.state.presentPostalCode} name="mailingPostalCode" />

                    <input type="hidden" value={this.state.fatherTitleId} name="fatherTitleId" />
                    <input type="hidden" value={this.state.fatherName} name="fatherName" />
                    <input type="hidden" value={this.state.fatherDocumentTypeId} name="fatherIdentityType" />
                    <input type="hidden" value={fatherDBCnic} name="fatherCnicPassport" />
                    <input type="hidden" value={this.state.fatherMobileNo} name="fatherMobileNo" />
                    <input type="hidden" value={this.state.fatherEmail} name="fatherEmail" />
                    <input type="hidden" value={this.state.fatherOccupation} name="fatherOccupationId" />

                    <input type="hidden" value={this.state.motherTitleId} name="motherTitleId" />
                    <input type="hidden" value={this.state.motherName} name="motherName" />
                    <input type="hidden" value={this.state.motherDocumentTypeId} name="motherIdentityType" />
                    <input type="hidden" value={motherDBCnic} name="motherCnicPassport" />
                    <input type="hidden" value={this.state.motherMobileNo} name="motherMobileNo" />
                    <input type="hidden" value={this.state.motherEmail} name="motherEmail" />
                    <input type="hidden" value={this.state.motherOccupation} name="motherOccupationId" />

                    <input type="hidden" value={this.state.guardianInformationId} name="guardianId" />
                    <input type="hidden" value={this.state.guardianTitleId} name="guardianTitleId" />
                    <input type="hidden" value={this.state.guardianName} name="guardianName" />
                    <input type="hidden" value={this.state.guardianRelationId} name="guardianRelationWithStudentId" />
                    <input type="hidden" value={this.state.guardianDocumentTypeId} name="guardianIdentity" />
                    <input type="hidden" value={guardianDBCnic} name="guardianCnicPassport" />
                    <input type="hidden" value={this.state.guardianMobileNo} name="guardianMobileNo" />
                    <input type="hidden" value={this.state.guardianEmail} name="guardianEmail" />
                    <input type="hidden" value={this.state.guardianOccupation} name="guardianOccupationId" />

                    <input type="hidden" value={this.state.academicsNameOfAwardingBodySec1} name="interAwardingBody" />
                    <input type="hidden" value={this.state.academicsNameOfInstitutionSec1} name="interInstitution" />
                    <input type="hidden" value={this.state.academicsQualificationSec1} name="interQualification" />
                    <input type="hidden" value={this.state.academicsYearAwardedSec1} name="interYearAwarded" />
                    <input type="hidden" value={this.state.academicsOverallMarksSec1} name="interGradeMarks" />
                    <input type="hidden" value={this.state.academicsIsResultAwaitedSec1} name="interIsResultAwaiting" />
                    {
                        this.state.academicRecordsArray.map((item, index) => {
                            return (
                                <Fragment key={index}>
                                    <input type="hidden" value={item.subject} name="interSubject" />
                                    <input type="hidden" value={item.gradeMarks} name="interSubjectGradeMarks" />
                                </Fragment>
                            );
                        })
                    }


                    <input type="hidden" value={this.state.academicsNameOfAwardingBodySec2} name="bachelorsAwardingBody" />
                    <input type="hidden" value={this.state.academicsNameOfInstitutionSec2} name="bachelorsInstitution" />
                    <input type="hidden" value={this.state.academicsQualificationSec2} name="bachelorsQualification" />
                    <input type="hidden" value={this.state.academicsYearAwardedSec2} name="bachelorsYearAwarded" />
                    <input type="hidden" value={this.state.academicsOverallMarksSec2} name="bachelorsGradeMarks" />

                    <input type="hidden" value={this.state.academicsIsResultAwaitedSec2} name="bachelorsIsResultAwaiting" />
                    {
                        this.state.academicSec2RecordsArray.map((item, index) => {
                            return (
                                <Fragment key={index}>
                                    <input type="hidden" value={item.subject} name="bachelorsSubject" />
                                    <input type="hidden" value={item.gradeMarks} name="bachelorsSubjectGradeMarks" />
                                </Fragment>
                            );
                        })
                    }

                    <input type="hidden" value={this.state.nameOfSchoolAlevel} name="olevelSchoolName" />
                    <input type="hidden" value={this.state.addressOfSchoolAlevel} name="olevelSchoolAddress" />
                    {
                        this.state.aLevelAcademicRecordsArray.map((item, index) => {
                            return (
                                <Fragment key={index}>
                                    <input type="hidden" value={item.subject} name="oLevelSubject" />
                                    <input type="hidden" value={item.exam} name="oLevelExamTitle" />
                                    <input type="hidden" value={item.board} name="oLevelBoard" />
                                    <input type="hidden" value={item.session} name="oLevelSession" />
                                    <input type="hidden" value={item.grade} name="oLevelGrade" />
                                </Fragment>
                            );
                        })
                    }

                    {
                        this.state.workRecordsArray.map((item, index) => {
                            return (
                                <Fragment key={index}>
                                    <input type="hidden" value={item.activity} name="workExperienceActivity" />
                                    <input type="hidden" value={item.organization} name="workExperienceOrganization" />
                                    <input type="hidden" value={item.position} name="workExperiencePosition" />
                                    <input type="hidden" value={item.tenure} name="workExperienceTenureMonths" />
                                    <input type="hidden" value={item.nature} name="workExperienceNatureOfPositionHeld" />
                                </Fragment>
                            );
                        })
                    }

                    {
                        this.state.activityRecordsArray.map((item, index) => {
                            return (
                                <Fragment key={index}>
                                    <input type="hidden" value={item.activity} name="coCurricularActivity" />
                                    <input type="hidden" value={item.institution} name="coCurricularInstitution" />
                                    <input type="hidden" value={item.position} name="coCurricularPosition" />
                                    <input type="hidden" value={item.tenure} name="coCurricularTenureMonths" />
                                    <input type="hidden" value={item.nature} name="coCurricularNatureOfPositionHeld" />
                                </Fragment>
                            );
                        })
                    }

                    {
                        this.state.qualificationRecordsArray.map((item, index) => {
                            return (
                                <Fragment key={index}>
                                    <input type="hidden" value={item.nameAward} name="otherQualificationAwardingBody" />
                                    <input type="hidden" value={item.nameInstitution} name="otherQualificationInstitution" />
                                    <input type="hidden" value={item.qualification} name="otherQualification" />
                                </Fragment>
                            );
                        })
                    }

                    {
                        this.state.uclRelationRecordsArray.map((item, index) => {
                            return (
                                <Fragment key={index}>
                                    <input type="hidden" value={item.uclInstitutionId} name="relativeStatusInstitutionId" />
                                    <input type="hidden" value={item.relationship} name="relativeStatusRelationship" />
                                    <input type="hidden" value={item.uclRoleId} name="relativeStatusRoleId" />
                                    <input type="hidden" value={item.name2} name="relativeStatusName" />
                                    <input type="hidden" value={item.department} name="relativeStatusDepartment" />
                                    <input type="hidden" value={item.program} name="relativeStatusProgramme" />
                                    <input type="hidden" value={item.designation} name="relativeStatusDesignation" />
                                    <input type="hidden" value={item.year || 0} name="relativeStatusGraduationYear" />
                                </Fragment>
                            );
                        })
                    }

                    <input type="hidden" value={this.state.nameOfPersonAlevel} name="financialName" />
                    <input type="hidden" value={this.state.addressOfPersonAlevel} name="financialAddress" />
                    <input type="hidden" value={this.state.professionOfPersonAlevel} name="financialProfession" />

                    {
                        this.state.checkSubjects.map((item, index) => {
                            if (item.checked != -1) {
                                return (
                                    <Fragment key={index}>
                                        <input key={index} type="hidden" value={item.id} name="aLevelTakenSubjectId" />
                                        <input key={index} type="hidden" value={this.state.switchSateGroupId} name="aLevelTakenSubjectGroupId" />
                                    </Fragment>
                                )
                            }
                        })

                        
                    }

                    {
                        this.state.checkSubjectsGroup19.map((item, index) => {
                            if (item.checked != -1) {
                                return (
                                    <Fragment key={index}>
                                        <input key={index} type="hidden" value={item.id} name="aLevelTakenSubjectId" />
                                        <input key={index} type="hidden" value={item.grpId} name="aLevelTakenSubjectGroupId" />
                                    </Fragment>
                                )
                            }
                        })

                        
                    }

                    <input type="hidden" value={this.state.checkMedical} name="isAnyMedicalCondition" />
                    <input type="hidden" value={this.state.medicalCondition} name="medicalCondition" />
                    <input type="hidden" value={this.state.medicalName} name="emergencyContactPersonName" />
                    <input type="hidden" value={this.state.medicalRelationshipId} name="emergencyContactRelationshipId" />
                    <input type="hidden" value={this.state.medicalMobileNumber} name="emergencyContactNumber" />


                    <input type="hidden" value={this.state.hearFrom} name="uclSourceId" />
                    <input type="hidden" value={this.state.hearOtherSource} name="uclOtherSource" />
                    <input type="hidden" value={this.state.hearMagzineName} name="uclSourceName" />

                    <input type="hidden" value={this.state.reasons} name="reasonsForApplying" />

                    <button style={{ display: 'none' }} id="submit-button" type="submit" />
                </form>

            </Fragment >
        );
    }
}

F1000Form.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(F1000Form);