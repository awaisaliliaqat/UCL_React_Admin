import React, { Component, Fragment } from "react";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

import TablePanel from "../../../../../components/ControlledTable/RerenderTable/TablePanel";
import Button from "@material-ui/core/Button";
import LoginMenu from "../../../../../components/LoginMenu/LoginMenu";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from "@material-ui/icons/Delete";
import CloudDownload from "@material-ui/icons/CloudDownload";
import ThumbDownAltSharpIcon from '@material-ui/icons/ThumbDownAltSharp';

class AllActiveClasses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      admallClassesItemsssionData: [],
      
      isLoginMenu: false,
      isReload: false,
     
    };
  }

  componentDidMount() {
    //this.getData();
    this.loadALLClasses();
   
  }

  onClearFilters = () => {
    this.setState({
      
    });
  };
  handleOpenSnackbar = (msg, severity) => {
    this.setState({
        isOpenSnackbar: true,
        snackbarMessage: msg,
        snackbarSeverity: severity
    });
};
onHandleChangeAS = e => {
  const { name, value } = e.target;
  this.setState({
      [name]: value
    })
  
 
}


  loadALLClasses = async () => {
    this.setState({ isLoading: true });
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C80CommonAcademicsTimeTableView`;
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
            let array = json.DATA || [];
            let arrayLength = array.length;
           
            this.setState({ allClassesItems: array });
            
          } else {
            this.handleOpenSnackbar(<span>{json.SYSTEM_MESSAGE}<br/>{json.USER_MESSAGE}</span>,"error");
          }
        },
        (error) => {
          if (error.status == 401) {
            this.setState({
              isLoginMenu: true,
              isReload: false,
            });
          } else {
            console.log(error);
            this.handleOpenSnackbar("Failed to fetch ! Please try Again later.","error");
          }
        }
      );
    this.setState({ isLoading: false });
  };


  onJoinClick = async (e, data = {}) => {
    console.log(data.meetingStartUrl);
    e.preventDefault();
    this.setState({ isLoading: true });
      window.open(data.meetingStartUrl, "_blank");
    this.setState({
      isLoading: false,
    });
  };
  
  render() {
    const columnsSubmitted = [
      {
        name: "Course sectionLabel",
        dataIndex: "title",
        sortable: false,
        customStyleHeader: { width: "20%", textAlign: "left" },
      },
      {
        name: "Section",
        dataIndex: "sectionLabel",
        sortable: false,
        customStyleHeader: { width: "20%", textAlign: "left" },
      },
      {
        name: "Start Time",
        dataIndex: "startTime",
        sortable: false,
        customStyleHeader: { width: "20%", textAlign: "left" },
      },
      {
        name: "End Time",
        dataIndex: "endTime",
        sortable: false,
        customStyleHeader: { width: "20%", textAlign: "left" },
      },
      {
        name: "Action",
        renderer: (rowData) => {

          return (
             
            <Fragment>
               <Button
                    disabled={!rowData.meetingStartUrl}
                    onClick={(e) => this.onJoinClick(e, rowData)}
                    color="primary"
                  >
                    Join
                </Button>  
            </Fragment>
              
           
            
          );
        },
        sortable: false,
        customStyleHeader: { width: "13%" },
      },
      

      
     
    ];

    return (
      <Fragment>
        <LoginMenu
          // reload={this.state.isReload}
          open={this.state.isLoginMenu}
          handleClose={() => this.setState({ isLoginMenu: false })}
        />
        <div
          style={{
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              style={{
                color: "#1d5f98",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
              variant="h5"
            >
              All Present Classes
            </Typography>
            
          </div>
          <Divider
            style={{
              backgroundColor: "rgb(58, 127, 187)",
              opacity: "0.3",
            }}
          />
          
          <div
            style={{
              marginTop: 15,
              marginBottom: 15,
              color: "#174A84",
              font: "Bold 16px Lato",
              letterSpacing: "1.8px",
            }}
          ></div>
          <TablePanel
            isShowIndexColumn
            data={this.state.allClassesItems}
            isLoading={this.state.isLoading}
            sortingEnabled
            columns={columnsSubmitted}
            
          />
        </div>
      </Fragment>
    );
  }
}
export default AllActiveClasses;
