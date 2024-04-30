import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Paper } from "@material-ui/core";
import {FilteringState, IntegratedFiltering, IntegratedPaging, IntegratedSorting, PagingState, SortingState, } from "@devexpress/dx-react-grid";
import {Grid, PagingPanel, Table, TableFilterRow, TableHeaderRow} from "@devexpress/dx-react-grid-material-ui";
import {CircularProgress} from '@material-ui/core';

const LoadingState = ({ loading, columnCount }) => (
  <td colSpan={columnCount} style={{ textAlign:'center', verticalAlign:'middle', padding:"1em" }}>
    <big>
      {loading ? <CircularProgress size={28} /> : <span>No data</span>}
    </big>
  </td>
)

class F212FormTableComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : true,
      columns: [
        { name: "SRNo", title: "SR#" },
        { name: "studentId", title: "Nucleus\xa0ID" },
        { name: "displayName", title: "Student\xa0Name" },
        { name: "sessionLabel", title: "Session" },
        { name: "programmeLabel", title: "Programme" },
        { name: "applicationStatusLabel", title: "Application\xa0Status" },
        { name: "renewalStatusLabel", title: "Renewal\xa0Status" },
        { name: "examEntryStatusLabel", title: "Exam\xa0Entry\xa0Status" },
        { name: "courseCompletionStatusLabel", title: "Course\xa0Completion Status"},
        { name: "endYearAchievementIdLabel", title: <span>Year End<br/>Achievement</span> },
        { name: "pathwayLabel", title: "Pathway" },
        { name: "uolNumber", title: "UOL#" },
        { name: "candidateNo", title: "Candidate No" },
        // { name: "changeStatusAction", title: <span>Enrolment<br/>Status</span>},
        { name: "action", title: <span>Student<br/>Achievements</span>}
      ],
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
      pageSizes: [5, 10, 25, 50, 100],
      defaultSorting: [],
      sortingStateColumnExtensions: [
        { columnName: "changeStatusAction", sortingEnabled: false },
        { columnName: "action", sortingEnabled: false },
      ],
      tableColumnExtensions: [
        { columnName: "SRNo", width: 100 },
        { columnName: "studentId", width: 100},
        { columnName: "displayName", wordWrapEnabled: true },
        { columnName: "programmeLabel", wordWrapEnabled: true },
        { columnName: "applicationStatusLabel", wordWrapEnabled: true },
        { columnName: "renewalStatusLabel", wordWrapEnabled: true },
        { columnName: "examEntryStatusLabel", wordWrapEnabled: true },
        { columnName: "courseCompletionStatusLabel", width: 130, wordWrapEnabled: true, align:"center" },
        { columnName: "endYearAchievementIdLabel", wordWrapEnabled: true, align:"center" },
        { columnName: "pathwayLabel", wordWrapEnabled: true },
        { columnName: "uolNumber", width: 110, wordWrapEnabled: true },
        { columnName: "candidateNo", width: 110, wordWrapEnabled: true, align:"center" },
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

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.rows !== prevProps.rows) {
      this.setState({rows:this.props.rows});
    }
    if (this.props.loading !== prevProps.loading) {
      this.setState({loading:this.props.loading});
    }
  }

  render() {
         
    const {
      loading,
      rows,
      columns,
      tableColumnExtensions,
      defaultSorting,
      sortingStateColumnExtensions,
      filteringStateColumnExtensions,
      defaultFilters,
      pageSizes
    } = this.state;

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
            defaultPageSize={50}
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
            titleComponent={(props) =>
              props.children!="Action" ?
              <b>{props.children}</b>
              :
              <b>&emsp;{props.children}</b>
            }
          />
          {this.props.showFilter && <TableFilterRow showFilterSelector={true} />}
          <PagingPanel pageSizes={pageSizes} />
        </Grid>
      </Paper>
    );
  }
}

export default F212FormTableComponent;

F212FormTableComponent.propTypes = {
  showFilter: PropTypes.bool,
}

F212FormTableComponent.defaultProps = {
  showFilter: false,
}