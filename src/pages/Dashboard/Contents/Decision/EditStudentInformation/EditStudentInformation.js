import React, { Component, Fragment, useState } from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import EditStudentInformationFilter from './Chunks/EditStudentInformationFilter';
import TablePanel from '../../../../../components/ControlledTable/RerenderTable/TablePanel';
import Button from '@material-ui/core/Button';
import LoginMenu from '../../../../../components/LoginMenu/LoginMenu';
import { Link } from 'react-router-dom';
import { useDropzone } from "react-dropzone";
import CircularProgress from '@material-ui/core/CircularProgress';
import AddAPhotoOutlinedIcon from '@material-ui/icons/AddAPhotoOutlined';

function MyDropzone(props) {

    const [isFileSelected, setIsFileSelected] = useState(false);
   
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ accept: 'image/jpeg, image/png, image/jpg', multiple:false });

    const files = acceptedFiles.map((file, index) => {
      const size = file.size > 0 ? (file.size / 1000).toFixed(2) : file.size;
      if(!isFileSelected){ 
        setIsFileSelected(true);
        setTimeout(()=>{
          props.onFormSubmit("form"+props.studentId);
        }, 250);
      }
      return (
          <Typography key={index} variant="subtitle1" color="primary">
              {/* {file.path} - {size} Kb */}
              <input type="hidden" name="file_name" value={file.path}></input>
          </Typography>
      );
    });
  
    let msg = files || [];
    if(msg.length<=0) {
        //msg = <Typography variant="subtitle1">Please click here to  select and upload an file</Typography>;
        msg = (
              <Tooltip title="Upload">
                <IconButton  
                  aria-label="Upload"
                >
                  <AddAPhotoOutlinedIcon color="primary"/>
                </IconButton>
              </Tooltip>
        );
    }
    
    return (
        <Fragment>
          {isFileSelected && <div style={{ textAlign: "center"}}><CircularProgress size={24} /></div>}
          <form id={"form"+props.studentId} hidden={isFileSelected} style={{display:"inline-block"}}>
            <div style={{ textAlign: "center"}} {...getRootProps({ className: "dropzone", onChange: event => props.onChange(event) })}>
              <input name="studentId" type="hidden" value={props.studentId} />
              <input name="contained-button-file" {...getInputProps()} disabled={props.disabled} />
              {msg}
            </div>
          </form>
        </Fragment>
    );
  }

class EditStudentInformation extends Component {

    constructor(props) {
			super(props);
			this.state = {
				isLoading: false,
				isFileUploading:false,
				files: [],
				admissionData: [],
				studentId: "",
				studentId: "",
				studentName: "",
				studentStatus: 1,
        pictureStatus: 0,
				applicationId: "",
				isLoginMenu: false,
				isReload: false,
				eventDate: null,
				programmeGroupId:"",
        programmeGroupsMenuItems:[],
        totalStudents: []
			}
    }

    onClearFilters = () => {
        this.setState({
            studentId: "",
            applicationId: "",
            studentName:"",
            programmeGroupId:"",
            studentStatus: 1,
            pictureStatus: 0,
        })
    }

    getProgrammeGroups = async () => {
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C21CommonOfferedSessionProgrammesGroupView`;
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
          .then(
            (json) => {
              if (json.CODE === 1) {
                this.setState({programmeGroupsMenuItems: json.DATA || []});
              } else {
                alert(json.SYSTEM_MESSAGE+'\n'+json.USER_MESSAGE);
              }
              console.log("getProgrammeGroups",json);
            },
            (error) => {
              if (error.status === 401) {
                this.setState({
                  isLoginMenu: true,
                  isReload: true,
                });
              } else {
                alert("Failed to load Students Data ! Please try Again later.");
                console.log(error);
              }
            }
          );
      };

    getData = async () => {
        this.setState({isLoading: true});
        const reload = this.state.studentId === "" && this.state.applicationId === "";
        const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C21CommonStudentsView?applicationId=${this.state.applicationId}&studentId=${this.state.studentId}&studentName=${this.state.studentName}&programmeGroupId=${this.state.programmeGroupId}&isActive=${this.state.studentStatus}&isPicture=${this.state.pictureStatus}`;
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
                        this.setState({
                            admissionData: json.DATA || [],
                        })
                        let totalStudents = this.state.admissionData.length;
                        this.setState({totalStudents: totalStudents});
                    } else {
                        alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
                    }
                    console.log(json);
                },
                error => {
                    if (error.status === 401) {
                        this.setState({
                            isLoginMenu: true,
                            isReload: reload
                        })
                    } else {
                        alert('Failed to fetch, Please try again later.');
                        console.log(error);
                    }
                });
        this.setState({
            isLoading: false
        })


    }

    handleFileChange = event => {
			const { files = [] } = event.target;
			if (files.length==1) {
				if ( (files[0].type === "image/jpeg" || files[0].type === "image/png" || files[0].type === "image/jpg") && files[0].size/1000<10000) {
					this.setState({
						files,
						filesError: ""
					});
				}else {
					alert("Please select only png, jpg or jpeg file with size less than 10 MBs.");
				}
			} else {
				alert("Please select only one file at a time.");
			}
    }

    onHandleChange = e => {
			const { name, value } = e.target;
			this.setState({[name]: value});
    }

    isFileValid = () => {
        let isValid = true;
        if (this.state.files.length<1) {
            alert("Please select file.");
            isValid = false;
        } else {
            
        }
        return isValid;
    }

    onFormSubmit = async (formId) => {
			if ( !this.isFileValid() ) { return; }
			let myForm = document.getElementById(formId);
			const data = new FormData(myForm);
			this.setState({ isLoading: true });
			const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C21CommonStudentsUpdateProfilePhoto`;
			await fetch(url, {
				method: "POST",
				body: data,
				headers: new Headers({Authorization:"Bearer "+localStorage.getItem("uclAdminToken")}),
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
							alert(json.USER_MESSAGE);
						} else {
							alert(json.SYSTEM_MESSAGE + '\n' + json.USER_MESSAGE);
						}
						console.log(json);
					},
					(error) => {
						if (error.status == 401) {
							this.setState({
								isLoginMenu: true,
								isReload: true,
							});
						} else {
							console.log(error);
							alert("Failed to Save ! Please try Again later.");
						}
					}
				);
			
				let admissionData = [...this.state.admissionData];
				this.setState({admissionData: []});
				let tableData = admissionData.map( (data) => data );
				this.setState({
					admissionData:tableData,
					isLoading: false
				});

      };

    componentDidMount() {
        this.getProgrammeGroups();
        // this.getData();
    }

    render() {

        const columnsSubmitted = [
            { name: "Nucleus Id", dataIndex: "studentId", sortable: false, customStyleHeader: { width: '13%', textAlign: 'center' } },
            { name: "Application Id", dataIndex: "applicationId", sortable: false, customStyleHeader: { width: '13%', textAlign: 'center' } },
            { name: "Name", renderer: rowData => { return (<Fragment>{`${rowData.firstName} ${rowData.lastName}`}</Fragment>) }, sortable: false, customStyleHeader: { width: '15%' } },
            { name: "Gender", dataIndex: "genderLabel", sortIndex: "genderLabel", sortable: true, customStyleHeader: { width: '13%' } },
            { name: "Degree Programme", dataIndex: "degreeLabel", sortIndex: "degreeLabel", sortable: true, customStyleHeader: { width: '20%', textAlign: 'center' }, align: 'center' },
            { name: "Mobile No", dataIndex: "mobileNo", sortable: false, customStyleHeader: { width: '15%' } },
            { name: "Email", dataIndex: "email", sortable: false, customStyleHeader: { width: '17%' } },
            { name: "Profile Image", 
							renderer: rowData => { return ( <MyDropzone	studentId={rowData.id} onChange={event => this.handleFileChange(event)} onFormSubmit={this.onFormSubmit}/>)}, 
							sortable: false, 
							customStyleHeader: { width: 40, textAlign: 'center' }
            },
            { name: "Action", 
              renderer: rowData => { 
								//console.log(rowData); 
								return ( 
									<Button style={{ fontSize: 12, textTransform: 'capitalize'}} variant="outlined">
										<Link style={{ textDecoration: 'none', color: 'black' }} to={`/dashboard/edit-student-information/${rowData.id}`}>
											Edit Profile
										</Link>
									</Button>
								)
              }, 
              sortable: false, 
              customStyleHeader: { width: 100, textAlign: 'center' }
            }
        ]

        return (
            <Fragment>
                <LoginMenu reload={this.state.isReload} open={this.state.isLoginMenu} handleClose={() => this.setState({ isLoginMenu: false })} />
                <div style={{
                    padding: 20
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <Typography style={{ color: '#1d5f98', fontWeight: 600, textTransform: 'capitalize' }} variant="h5">
                            Edit Student Profile
                        </Typography>
                        {this.state.totalStudents>1? 
                         <Typography
                           style={{
                              color: "#1d5f98",
                              fontWeight: 600,
                              textTransform: "capitalize",
                              textAlign: "right"
                                  }}
                              variant="h6"
                          >
                              Total Students: {this.state.totalStudents}
                          </Typography>
                          :
                          ""
                          }
                    </div>

                    <Divider style={{
                        backgroundColor: 'rgb(58, 127, 187)',
                        opacity: '0.3',
                    }} />
                    <EditStudentInformationFilter isLoading={this.state.isLoading} onClearFilters={this.onClearFilters} values={this.state} getDataByStatus={() => this.getData()} onHandleChange={e => this.onHandleChange(e)} />
                    <div style={{
                        marginTop: 15,
                        marginBottom: 15,
                        color: '#174A84',
                        font: 'Bold 16px Lato',
                        letterSpacing: '1.8px'
                    }}>
                    </div><TablePanel isShowIndexColumn data={this.state.admissionData} isLoading={this.state.isLoading} sortingEnabled columns={columnsSubmitted} />
                </div>
            </Fragment>
        );
    }
}
export default EditStudentInformation;