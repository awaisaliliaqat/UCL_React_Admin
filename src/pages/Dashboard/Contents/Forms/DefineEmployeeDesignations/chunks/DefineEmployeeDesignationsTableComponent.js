import React, { Component, Fragment } from "react";
import {Paper, IconButton} from "@material-ui/core";
import { FilteringState, IntegratedFiltering, IntegratedPaging, IntegratedSorting, PagingState, SortingState, } from "@devexpress/dx-react-grid";
import { Grid, PagingPanel, Table, TableFilterRow, TableHeaderRow, } from "@devexpress/dx-react-grid-material-ui";
import PropTypes from "prop-types";
import { Delete } from "@material-ui/icons";
import EditIcon from "@material-ui/icons/Edit";

class DefineEmployeeDesignationsTableComponent extends Component {
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
      pageSizes: [10, 25, 50, 100],
      defaultSorting: [{ columnName: "id", direction: "asc" }],
      sortingStateColumnExtensions: [
        { columnName: "action", sortingEnabled: false },
      ],
      tableColumnExtensions: [
        { columnName: "id", width: 100},
        { columnName: "action", width: 120}
      ],
      resizingMode: "widget",
      defaultFilters: [],
      filteringStateColumnExtensions: [
        { columnName: "action", filteringEnabled: false },
      ],
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Update only if `rows` or `columns` change
    if (nextProps.rows !== this.props.rows || nextProps.showFilter !== this.props.showFilter) {
      return true;
    }
    // Prevent updates for other props/state changes
    return false;
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const cellComponent = ({ cellProps, ...restProps }) => {
      return (
        <Table.Cell
          {...restProps}
          style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
        />
      );
    };

    const {
      tableColumnExtensions,
      defaultSorting,
      sortingStateColumnExtensions,
      filteringStateColumnExtensions,
      defaultFilters,
      pageSizes
    } = this.state;

    const { rows, columns, showFilter } = this.props;

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
          <PagingState defaultCurrentPage={0} defaultPageSize={100} />
          <IntegratedFiltering />
          <IntegratedSorting />
          <IntegratedPaging />
          <Table
            cellComponent={cellComponent}
            columnExtensions={tableColumnExtensions}
          />
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

DefineEmployeeDesignationsTableComponent.propTypes = {
  columns: PropTypes.array,
  rows: PropTypes.array,
  showFilter: PropTypes.bool,
};

DefineEmployeeDesignationsTableComponent.defaultProps = {
  columns: [],
  rows: [],
  showFilter: false,
};

export default DefineEmployeeDesignationsTableComponent;
