import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Paper, CircularProgress, withStyles } from "@material-ui/core";
import {FilteringState, IntegratedFiltering, IntegratedPaging, IntegratedSorting, PagingState, SortingState, } from "@devexpress/dx-react-grid";
import {Grid, PagingPanel, Table, TableFilterRow, TableHeaderRow} from "@devexpress/dx-react-grid-material-ui";

const styles = theme => ({
  root: {
    backgroundColor:"#1d5f98", 
    color:"white", 
    paddingTop:"0.5em", 
    paddingBottom:"0.5em",
    "&:hover": {
      opacity : "0.9",
    }
  }
});


const LoadingState = ({ loading, columnCount }) => (
  <td colSpan={columnCount} style={{ textAlign:'center', verticalAlign:'middle', padding:"2em 1em 0.5em 1em" }}>
    <big>
      {loading ? <CircularProgress /> : <span>No data</span>}
    </big>
  </td>
)

class F314FormTableComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      columns: [
        { name: "SRNo", title: "SR#" },
        { name: "studentId", title: "Nucleus\xa0ID" },
        { name: "uolNumber", title: "UOL#" },
        { name: "displayName", title: "Student\xa0Name" },
        { name: "statusLabel", title: "Status"},
        /*
        { name: "candidateNo", title: "Candidate#" },
        { name: "applicationStatusLabel", title: "Application\xa0Status" },
        { name: "renewalStatusLabel", title: "Renewal\xa0Status" },
        { name: "examEntryStatusLabel", title: "Exam\xa0Entry\xa0Status" },
        { name: "courseCompletionStatusLabel", title: "Course\xa0Completion Status"},
        { name: "endYearAchievementIdLabel", title: <span>Year End<br/>Achievement</span> },
        { name: "pathwayLabel", title: "Pathway" },
        { name: "candidateNo", title: "Candidate No" },
        */
        { name: "changeStatusAction", title: <span>Action</span>},
        { name: "action", title: <span>Action</span>}
      ],
      showFilter: false,
      rows: [],
      formatColumns: [],
      currencyColumns: [],
      availableFilterOperations: [
        "equal",
        "notEqual",
        "greaterThan",
        "greaterThanOrEqual",
        "lessThan",
        "lessThanOrEqual",
      ],
      pageSizes: [10, 25, 50, 100],
      defaultSorting: [],
      sortingStateColumnExtensions: [
        { columnName: "changeStatusAction", sortingEnabled: false },
        { columnName: "action", sortingEnabled: false },
      ],
      tableColumnExtensions: [
        { columnName: "SRNo", width: 100 },
        { columnName: "studentId", width: 100},
        { columnName: "uolNumber", width: 110, wordWrapEnabled: true },
        { columnName: "displayName", wordWrapEnabled: true },
        { columnName: "statusLabel", width: 100},
        /*
        { columnName: "candidateNo", width: 110, wordWrapEnabled: true, align:"center" },
        { columnName: "applicationStatusLabel", wordWrapEnabled: true },
        { columnName: "renewalStatusLabel", wordWrapEnabled: true },
        { columnName: "examEntryStatusLabel", wordWrapEnabled: true },
        { columnName: "courseCompletionStatusLabel", width: 130, wordWrapEnabled: true, align:"center" },
        { columnName: "endYearAchievementLabel", wordWrapEnabled: true, align:"center" },
        { columnName: "pathwayLabel", wordWrapEnabled: true },
        */
        { columnName: "changeStatusAction", width: 90, align:"center"},
        { columnName: "action", width: 110, align:"center"},
      ],
      defaultColumnWidths: [],
      defaultFilters: [],
      filteringStateColumnExtensions: [
        { columnName: "changeStatusAction", filteringEnabled: false },
        { columnName: "action", filteringEnabled: false },
      ]
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.loading !== prevProps.loading) {
      this.setState({loading:this.props.loading});
    }
    // Typical usage (don't forget to compare props):
    if (this.props.showFilter != prevProps.showFilter || this.props.rows !== prevProps.rows) {
      this.setState({
        showFilter : this.props.showFilter,
        rows : this.props.rows
      });
    }
  }

  render() {

    const { classes } = this.props;
         
    const { loading, columns, showFilter, rows, tableColumnExtensions, defaultSorting, sortingStateColumnExtensions, filteringStateColumnExtensions, defaultFilters, pageSizes } = this.state;

    // const rowComponent = ({ tableRow, ...restProps }) => {
    //   return <Table.Row {...restProps} style={{ backgroundColor: "LightBlue" }} />;
    // };

    const cellComponent = ({ tableRow, ...restProps }) => {
      console.log("...restProps: ", restProps);
      return (
        <Table.Cell {...restProps} 
          className={classes.root} 
          //style={{ backgroundColor:"#1d5f98", color:"white", paddingTop:"0.5em", paddingBottom:"0.5em" }} 
        />);
    };

    return (
      <Paper>
        <Grid 
          rows={rows} 
          columns={columns}
        >
          <FilteringState
            defaultFilters={defaultFilters}
            columnExtensions={filteringStateColumnExtensions}
          />
          <SortingState
            defaultSorting={defaultSorting}
            columnExtensions={sortingStateColumnExtensions}
          />
          <PagingState 
            defaultCurrentPage={0} 
            defaultPageSize={25}
          />
          <IntegratedFiltering />
          <IntegratedSorting />
          <IntegratedPaging />
          <Table
            noDataCellComponent={() => <LoadingState columnCount={columns.length} loading={loading} />}
            columnExtensions={tableColumnExtensions} 
          />
          <TableHeaderRow
            //rowComponent={rowComponent}
            showSortingControls={true}
            titleComponent={(props) => props.children!="Action" ? <b>{props.children}</b> : <b>&emsp;{props.children}</b> }
            cellComponent={cellComponent}
          />
          {showFilter && <TableFilterRow showFilterSelector={true} /> }
          <PagingPanel pageSizes={pageSizes} />
        </Grid>
      </Paper>
    );
  }
}

export default withStyles(styles)(F314FormTableComponent);

F314FormTableComponent.propTypes = {
  showFilter: PropTypes.bool,
}

F314FormTableComponent.defaultProps = {
  showFilter: false,
}