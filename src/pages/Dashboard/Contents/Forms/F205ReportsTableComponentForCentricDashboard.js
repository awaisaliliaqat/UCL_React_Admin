import React, { Component } from "react";
import PropTypes from "prop-types";
import { Paper } from "@material-ui/core";
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

class F205ReportsTableComponentForCentricDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [],
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
      pageSizes: [5, 10, 15, 20],
      defaultSorting: [],
      sortingStateColumnExtensions: [
        { columnName: "action", sortingEnabled: false },
        { columnName: "fileDownload", sortingEnabled: false },
      ],
      tableColumnExtensions: [
        { columnName: "SRNo", width: 100 },
        { columnName: "sectionLabel", wordWrapEnabled: true },
        { columnName: "courseLabel", wordWrapEnabled: true },
        { columnName: "label", wordWrapEnabled: true },
      ],
      defaultColumnWidths: [],
      resizingMode: "widget",
      defaultFilters: [],
      filteringStateColumnExtensions: [
        { columnName: "fileDownload", filteringEnabled: false },
      ],
    };
  }

  render() {
    const {
      tableColumnExtensions,
      defaultSorting,
      sortingStateColumnExtensions,
      filteringStateColumnExtensions,
      defaultFilters,
      pageSizes,
    } = this.state;

    const rows = this.props.data;
    const columns = this.props.columns;
    const showFilter = this.props.showFilter;

    return (
      <Paper>
        <Grid rows={rows} columns={columns}>
          <FilteringState
            defaultFilters={defaultFilters}
            columnExtensions={filteringStateColumnExtensions}
          />
          <SortingState
            defaultSorting={defaultSorting}
            columnExtensions={sortingStateColumnExtensions}
          />
          <PagingState defaultCurrentPage={0} defaultPageSize={10} />
          <IntegratedFiltering />
          <IntegratedSorting />
          <IntegratedPaging />
          <Table columnExtensions={tableColumnExtensions} />
          <TableHeaderRow
            showSortingControls={true}
            titleComponent={(props) =>
              props.children!="Action" && props.children!="Solution" ? (
                <b>{props.children}</b>
              ) : (
                <b>&emsp;{props.children}</b>
              )
            }
          />
          {showFilter ? <TableFilterRow showFilterSelector={true} /> : ""}
          <PagingPanel pageSizes={pageSizes} />
        </Grid>
      </Paper>
    );
  }
}


F205ReportsTableComponentForCentricDashboard.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  showFilter: PropTypes.bool
};

F205ReportsTableComponentForCentricDashboard.defaultProps = {
  data: [],
  columns: [],
  showFilter: false
};

export default F205ReportsTableComponentForCentricDashboard;
