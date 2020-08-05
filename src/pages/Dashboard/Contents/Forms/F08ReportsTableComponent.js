import React, { Component } from "react";
import { Paper } from "@material-ui/core";
import {FilteringState, IntegratedFiltering, IntegratedPaging, IntegratedSorting, PagingState, 
  SortingState} from "@devexpress/dx-react-grid";
import { Grid, PagingPanel, Table, TableFilterRow, TableHeaderRow} from "@devexpress/dx-react-grid-material-ui";

class F08ReportsTableComponent extends Component {
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
        { columnName: "SRNo", width: 100 },
        { columnName: "label", wordWrapEnabled: true },
        { columnName: "programmeGroupsLabel", wordWrapEnabled: true },
        { columnName: "action", width: 120, align:"center" },
      ],
      defaultFilters: [],
      filteringStateColumnExtensions: [
        { columnName: "action", filteringEnabled: false },
      ],
    };
  }

  render() {
    const {
      formatColumns,
      currencyColumns,
      availableFilterOperations,
      CurrencyEditor,
      filter,
      tableColumnExtensions,
      defaultFilters,
      filteringStateColumnExtensions,
      defaultColumnWidths,
      sortingStateColumnExtensions,
      defaultSorting,
      columnBands,
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
          <PagingState 
            defaultCurrentPage={1} 
            defaultPageSize={10} 
          />
          <IntegratedFiltering />
          <IntegratedSorting />
          <IntegratedPaging />
          <Table 
            columnExtensions={tableColumnExtensions} 
          />
          <TableHeaderRow
            showSortingControls={true}
            titleComponent={(props) =>
              props.children != "Action" ? (
                <b>{props.children}</b>
              ) : (
                <b>{props.children}</b>
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

export default F08ReportsTableComponent;
