import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import {
  FilteringState,
  IntegratedFiltering,
  IntegratedPaging,
  IntegratedSorting,
  PagingState,
  SortingState,
} from "@devexpress/dx-react-grid";
import {
  Grid,
  PagingPanel,
  Table,
  TableFilterRow,
  TableHeaderRow,
} from "@devexpress/dx-react-grid-material-ui";

class F221FormAllStudentsTableComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { name: "studentId", title: "Nucleus\xa0ID" },
        { name: "displayName", title: "Student\xa0Name" },
        { name: "degreeLabel", title: "Programme" },
        { name: "pathwayLabel", title: "Pathway" },
        { name: "statusLabel", title: "Status" },
        {
          name: "WithDrawn",
          title: "WithDrawn",
          getCellValue: (rowData) =>
            rowData.statusLabel === "WithDrawn" ? (
              <Button
                variant="outlined"
                style={{
                  textTransform: "capitalize",
                  background: "#174A84",
                  color: "white",
                }}
                onClick={() => this.handleOpenDialog(rowData)}
              >
                Undo Withdrawal
              </Button>
            ) : null,
        },
      ],
      rows: [],
      openDialog: false,
      selectedStudent: null,
      undoReason: "", // State for the reason text area
      pageSizes: [5, 10, 25],
    };
  }

  handleUndo = async (undoReason) => {
    this.setState({ loading: true });
    const formData = new FormData();
    formData.append("reason", undoReason);
    formData.append("studentId", this.state.selectedStudent.id);
    const url = `${process.env.REACT_APP_API_DOMAIN}/${process.env.REACT_APP_SUB_API_NAME}/academics/C221CommonStudentsPromotionUndoWithdrawn`;
    await fetch(url, {
      method: "POST",
      body: formData,
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
            let data = json.DATA || [];

            // this.setState({
            //   employeePayrollsData: data,
            // });

            this.handleCloseDialog();

            window.location.reload();
          } else {
            // this.handleSnackbar(
            //   true,
            //   json.SYSTEM_MESSAGE + "\n" + json.USER_MESSAGE,
            //   "error"
            // );
          }
          console.log(json);
        },
        (error) => {
          if (error.status === 401) {
            this.setState({
              isLoginMenu: true,
              isReload: true,
            });
          } else {
            // this.handleSnackbar(
            //   true,
            //   "Failed to fetch, Please try again later.",
            //   "error"
            // );
            console.log(error);
          }
        }
      );
    this.setState({
      loading: false,
    });
  };

  componentDidUpdate(prevProps) {
    if (this.props.rows !== prevProps.rows) {
      this.setState({ rows: this.props.rows });
    }
  }

  handleOpenDialog = (student) => {
    this.setState({
      openDialog: true,
      selectedStudent: student,
      undoReason: "",
    });
  };

  handleCloseDialog = () => {
    this.setState({ openDialog: false, selectedStudent: null, undoReason: "" });
  };

  handleUndoWithdrawal = () => {
    const { selectedStudent, undoReason } = this.state;
    if (selectedStudent) {
      // Implement your undo logic here, passing along the reason if necessary
      console.log(
        "Undo Withdrawal for",
        selectedStudent,
        "with reason:",
        undoReason
      );
      this.handleUndo(undoReason);
    }
  };

  handleReasonChange = (event) => {
    this.setState({ undoReason: event.target.value });
  };

  render() {
    const {
      rows,
      columns,
      pageSizes,
      openDialog,
      selectedStudent,
      undoReason,
    } = this.state;

    return (
      <Paper>
        <Grid
          pagination={false}
          showPaginationBottom={false}
          rows={rows}
          columns={columns}
        >
          <FilteringState />
          <SortingState />
          <PagingState defaultCurrentPage={0} />
          <IntegratedFiltering />
          <IntegratedSorting />
          <Table />
          <TableHeaderRow showSortingControls />
          {this.props.showFilter && <TableFilterRow showFilterSelector />}
        </Grid>

        {/* Dialog for Undo Withdrawal Confirmation */}
        <Dialog open={openDialog} onClose={this.handleCloseDialog}>
          <DialogTitle>Undo Withdrawal</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to undo the withdrawal for{" "}
              {selectedStudent?.displayName}?
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Reason for Undoing Withdrawal"
              type="text"
              fullWidth
              multiline
              minRows={3}
              value={undoReason}
              onChange={this.handleReasonChange}
              variant="outlined"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.handleUndoWithdrawal}
              color="primary"
              variant="contained"
              disabled={!undoReason.trim()} // Disable button if no reason is provided
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }
}

F221FormAllStudentsTableComponent.propTypes = {
  showFilter: PropTypes.bool,
};

F221FormAllStudentsTableComponent.defaultProps = {
  showFilter: false,
};

export default F221FormAllStudentsTableComponent;
