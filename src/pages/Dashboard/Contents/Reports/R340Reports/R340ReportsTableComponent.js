import React, { Component } from "react";
import { Paper } from "@material-ui/core";
import { FilteringState, IntegratedFiltering, IntegratedPaging, IntegratedSorting, PagingState, SortingState, } from "@devexpress/dx-react-grid";
import { Grid, PagingPanel, Table, TableFilterRow, TableHeaderRow, } from "@devexpress/dx-react-grid-material-ui";

class R66ReportsTableComponent extends Component {
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
        //{ columnName: "action", sortingEnabled: false },
      ],
      tableColumnExtensions: [
        { columnName: "SRNo", width: 100 },
        { columnName: "nucluesId", wordWrapEnabled: true },
        { columnName: "studentName", wordWrapEnabled: true },
        { columnName: "pathway", wordWrapEnabled: true },
        // { columnName: "schoolLabel", wordWrapEnabled: true },
        // { columnName: "programmeGroupLabel", wordWrapEnabled: true },
        // { columnName: "dateOfAdmission", width: 150},
        // { columnName: "statusLabel", width: 120}
      ],
      defaultColumnWidths: [],
      resizingMode: "widget",
      defaultFilters: [],
      filteringStateColumnExtensions: [
        //{ columnName: "action", filteringEnabled: false },
      ],
    };
  }

  render() {
    const {
      formatColumns,
      currencyColumns,
      availableFilterOperations,
      CurrencyEditor,
      tableColumnExtensions,
      resizingMode,
      defaultSorting,
      sortingStateColumnExtensions,
      filteringStateColumnExtensions,
      defaultFilters,
      defaultColumnWidths,
      columnBands,
      pageSizes,
    } = this.state;

    // const rows = this.props.data;
    const rows = this.props.data
      .sort((a, b) => {})
      .map((row, index) => ({ ...row, SRNo: index + 1 }));

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
          {/* <SelectionState />  */}
          {/* <GroupingState defaultGrouping={[{ columnName: 'product' }]} defaultExpandedGroups={['EnviroCare Max']} /> */}
          <PagingState defaultCurrentPage={0} defaultPageSize={10} />
          <IntegratedFiltering />
          <IntegratedSorting />
          <IntegratedPaging />
          {/* <IntegratedSelection /> */}
          {/* <DragDropProvider /> */}
          <Table columnExtensions={tableColumnExtensions} />
          {/* <TableColumnResizing columnExtensions={defaultColumnWidths}/> */}
          {/* <TableSelection showSelectAll={true} /> */}
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
          {/* <Toolbar /> */}
        </Grid>
      </Paper>
    );
  }
}

export default R66ReportsTableComponent;
