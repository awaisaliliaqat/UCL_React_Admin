import React, { Component } from "react";
import PropTypes from 'prop-types';
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

class CreateRoomTableComponent extends Component {
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
      ],
      tableColumnExtensions: [
        { columnName: "ID", width: 120 },
        { columnName: "Label", wordWrapEnabled: true },
        { columnName: "studentCapacity", width: 300 },
        { columnName: "action", width: 150 },
      ],
      resizingMode: "widget",
      defaultFilters: [],
      filteringStateColumnExtensions: [
        { columnName: "action", filteringEnabled: false },
      ],
    };
  }

  render() {
    const {
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
          <PagingState defaultCurrentPage={1} defaultPageSize={10} />
          <IntegratedFiltering />
          <IntegratedSorting />
          <IntegratedPaging />
          <Table columnExtensions={this.state.tableColumnExtensions} />
          <TableHeaderRow
            showSortingControls={true}
            titleComponent={(props) =>
              props.children != "Action" ? (
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

CreateRoomTableComponent.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  showFilter: PropTypes.bool
}

CreateRoomTableComponent.propTypes = {
  data: [],
  columns: [],
  showFilter: false
}

export default CreateRoomTableComponent;
