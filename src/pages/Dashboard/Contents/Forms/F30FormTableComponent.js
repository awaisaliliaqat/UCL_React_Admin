import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Paper } from "@material-ui/core";
import {FilteringState, IntegratedFiltering, IntegratedPaging, IntegratedSorting, PagingState, SortingState, } from "@devexpress/dx-react-grid";
import {Grid, PagingPanel, Table, TableFilterRow, TableHeaderRow} from "@devexpress/dx-react-grid-material-ui";

class F30FormTableComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { name: "SRNo", title: "SR#" },
        { name: "nucleusId", title: "Nucleus\xa0ID" },
        { name: "studentName", title: "Student\xa0Name" },
        { name: "programmeLabel", title: "Programme" },
        { name: "action", title: "Action"}
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
      pageSizes: [5, 10, 15, 20],
      defaultSorting: [],
      sortingStateColumnExtensions: [
        { columnName: "action", sortingEnabled: false },
      ],
      tableColumnExtensions: [
        { columnName: "SRNo", width: 100 },
        { columnName: "nucleusId"},
        { columnName: "studentName", wordWrapEnabled: true },
        { columnName: "programmeLabel", wordWrapEnabled: true },
        { columnName: "action", width: 120, align:"center"},
      ],
      defaultColumnWidths: [],
      resizingMode: "widget",
      defaultFilters: [],
      filteringStateColumnExtensions: [
        { columnName: "action", filteringEnabled: false },
      ]
    };
  }

  
  render() {
         
    const {
      //rows,
      columns,
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
      pageSizes
    } = this.state;

    const rows = this.props.rows || [];

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
            defaultCurrentPage={0} 
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

export default F30FormTableComponent;

F30FormTableComponent.propTypes = {
  showFilter: PropTypes.bool,
}

F30FormTableComponent.defaultProps = {
  showFilter: false,
}



