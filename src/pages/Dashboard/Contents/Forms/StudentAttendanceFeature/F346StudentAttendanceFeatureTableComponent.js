import React, { Component } from "react";
import { Paper } from "@material-ui/core";
import {
  Column,
  FilteringState,
  GroupingState,
  IntegratedFiltering,
  IntegratedGrouping,
  IntegratedPaging,
  IntegratedSelection,
  IntegratedSorting,
  PagingState,
  SelectionState,
  SortingState,
  DataTypeProvider,
  DataTypeProviderProps,
} from "@devexpress/dx-react-grid";
import {
  DragDropProvider,
  Grid,
  GroupingPanel,
  PagingPanel,
  Table,
  TableFilterRow,
  TableGroupRow,
  TableHeaderRow,
  TableSelection,
  Toolbar,
  VirtualTable,
  TableColumnResizing,
} from "@devexpress/dx-react-grid-material-ui";

class F346StudentAttendanceFeatureTableComponent extends Component {
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
        { columnName: "nucluesId", width: 100, align: "left" },
        { columnName: "studentName", wordWrapEnabled: true, align: "left" },
        { columnName: "programmeLabel", wordWrapEnabled: true, align: "left" },
        { columnName: "presentDays", wordWrapEnabled: true, align: "right" },
        { columnName: "scheduledDays", wordWrapEnabled: true, align: "right" },
        { columnName: "attendedDays", wordWrapEnabled: true, align: "right" },
        { columnName: "totalDays", width: 150, align: "right" },
        { columnName: "Actions", width: 120, align: "right" },
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

export default F346StudentAttendanceFeatureTableComponent;
