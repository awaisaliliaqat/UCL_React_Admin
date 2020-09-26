import React, { Component, Fragment } from "react";
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import {Typography, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TablePagination, Paper, Divider, CircularProgress, Grid,
  List, ListItem, ListItemText, ListItemAvatar, Avatar, Tooltip, IconButton,
Badge} from "@material-ui/core";
import ImageIcon from '@material-ui/icons/Image';
import SpeakerNotesOutlinedIcon from '@material-ui/icons/SpeakerNotesOutlined';
import { color } from "highcharts";
import MailOutlineOutlinedIcon from '@material-ui/icons/MailOutlineOutlined';
import SmsOutlinedIcon from '@material-ui/icons/SmsOutlined';
import ForumOutlinedIcon from '@material-ui/icons/ForumOutlined';


const StyledTableCell = withStyles((theme) => ({
  head: {
    //backgroundColor: "rgb(29, 95, 152)", //theme.palette.common.black,
    backgroundColor:"#f6f8fa",
    color: theme.palette.common.white,
    fontWeight: 500,
    //border: '1px solid rgb(29, 95, 152)',
    border: '1px solid #e1e4e8',
    borderRadius:'5px 5px 0px 0px',
    color: "rgb(29, 95, 152)"
  },
  body: {
    fontSize: 14,
    //border: '1px solid rgb(29, 95, 152)',
    border: '1px solid #f6f8fa',
    "&:hover":{
      cursor:"pointer"
    }
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      //backgroundColor: theme.palette.action.hover,
      "&:hover":{
        //backgroundColor:"#bdbdbd"
        backgroundColor:"#f6f8fa"
      }
    },
    '&:nth-of-type(even)': {
      "&:hover":{
        //backgroundColor:"#bdbdbd"
        backgroundColor:"#f6f8fa"
      }
    },
  },
}))(TableRow);

const styles = ({
  table: {
    minWidth: 750,
    width: '100%',
  },
  tableContainer: {
    //maxHeight: 440,
  },
});

class F60FormTableComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showTableFilter: false,
      showSearchBar: false,
      isDownloadPdf: false,
      applicationStatusId: 1,
      isLoginMenu: false,
      isReload: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      snackbarSeverity: "",
      columns:[
        {id: 'name', label: 'Name', minWidth: 170 },
        {id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
        {id: 'population', label: 'Population', minWidth: 170,  align:'right', format: (value) => value.toLocaleString('en-US')},
        {id: 'size', label: 'Size\u00a0(km\u00b2)', minWidth: 170, align:'right', format: (value) => value.toLocaleString('en-US')},
        {id: 'density', label: 'Density', minWidth: 170, align:'right', format: (value) => value.toFixed(2)},
      ],
      rows:[
        this.createData('China', 'CN', 1403500365, 9596961),
        this.createData('Italy', 'IT', 60483973, 301340),
        this.createData('United States', 'US', 327167434, 9833520),
        this.createData('Canada', 'CA', 37602103, 9984670),
        this.createData('Australia', 'AU', 25475400, 7692024),
        this.createData('Germany', 'DE', 83019200, 357578),
        this.createData('Ireland', 'IE', 4857000, 70273),
        this.createData('Mexico', 'MX', 126577691, 1972550),
        this.createData('Japan', 'JP', 126317000, 377973),
        this.createData('France', 'FR', 67022000, 640679),
        this.createData('United Kingdom', 'GB', 67545757, 242495),
        this.createData('Russia', 'RU', 146793744, 17098246),
        this.createData('Nigeria', 'NG', 200962417, 923768),
        this.createData('Brazil', 'BR', 210147125, 8515767),
      ],
      popupBoxOpen:false,
      page:0,
      rowsPerPage:10,
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
    if (reason === "clickaway") {  return; }
    this.setState({ isOpenSnackbar: false });
  };

  handlePopupOpen = () => {
    this.setState({ 
      popupBoxOpen: true
    });
  };

  handlePopupClose = () => {
    this.setState({
      popupBoxOpen: false,
    });
  }

  handleChangePage = (event, newPage) => {
    this.setState({page:newPage});
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({rowsPerPage:+event.target.value});
    this.setState({page:0});
  };

  createData(name, code, population, size) {
    const density = population / size;
    return { name, code, population, size, density };
  }

  componentDidMount() {
  
  }

  render() {

    const { classes, handleReplyFormShow } = this.props;    

    //const { columns, rows } = this.state;
    //console.log("topic", rows);

    const {  rows=[] } = this.props;

    return (
      <Fragment>
        <Paper className={classes.table}>
          <TableContainer className={classes.tableContainer}>
            <Table stickyHeader size="small" aria-label="sticky table">
              <TableHead>
                <StyledTableRow>
                    <StyledTableCell 
                      colSpan={6}
                    >
                      <Typography component="span" variant="body1">Topics</Typography>
                    </StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {rows.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row) => {
                  return (
                    <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <StyledTableCell colSpan={6}>
                        <ListItem onClick={()=>handleReplyFormShow(row.id)}>
                          <ListItemAvatar>
                            <Avatar style={{backgroundColor:"#f6f8fa"}}>
                              {/* <ImageIcon /> */}
                              {/* <SpeakerNotesOutlinedIcon color="primary"/> */}
                              <ForumOutlinedIcon color="primary"/>
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText 
                            primary={
                              <Typography 
                                component="span"
                                color="primary"
                                style={{
                                  fontWeight:600,
                                  fontSize:18
                                }}
                              >
                                  {row.topic}
                              </Typography>
                            } 
                          secondary={<span>  by M Umar,&nbsp;{row.createdOn}</span>} 
                          />
                          <Badge color="secondary" badgeContent={10} style={{float:"right"}}>
                            <Tooltip title="Number of replies">
                              {/* <MailOutlineOutlinedIcon style={{color:"#b6babf"}} /> */}
                              <SmsOutlinedIcon style={{color:"#b6babf"}} />
                            </Tooltip>
                          </Badge>
                        </ListItem>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
      </Fragment>
    );
  }
}
export default withStyles(styles)(F60FormTableComponent);
