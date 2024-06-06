import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Paper } from "@material-ui/core";
import {FilteringState, IntegratedFiltering, IntegratedPaging, IntegratedSorting, PagingState, SortingState, } from "@devexpress/dx-react-grid";
import {Grid, PagingPanel, Table, TableFilterRow, TableHeaderRow} from "@devexpress/dx-react-grid-material-ui";

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
      pageSizes: [5, 10, 25],
      defaultSorting: [],
      sortingStateColumnExtensions: [],
      tableColumnExtensions: [
        { columnName: "studentId"},
        { columnName: "displayName",  wordWrapEnabled: true },
        { columnName: "degreeLabel", wordWrapEnabled: true },
        { columnName: "pathwayLabel",  wordWrapEnabled: true },
        { columnName: "statusLabel",  wordWrapEnabled: true },
      ],
      defaultColumnWidths: [],
      defaultFilters: [],
      filteringStateColumnExtensions: []
    };
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.rows !== prevProps.rows) {
      this.setState({rows:this.props.rows});
    }
  }

  render() {
         
    const {
      rows,
      columns,
      tableColumnExtensions,
      defaultSorting,
      sortingStateColumnExtensions,
      filteringStateColumnExtensions,
      defaultFilters,
      pageSizes
    } = this.state;

    // const rowComponent = ({ tableRow, ...restProps }) => {
    //   return <Table.Row {...restProps} style={{ backgroundColor: "LightBlue" }} />;
    // };

    return (
      <Paper>
        <Grid 
        pagination={false}
        showPaginationBottom={false}
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
            // defaultPageSize={}
          />
          <IntegratedFiltering />
          <IntegratedSorting />
          {/* <IntegratedPaging /> */}
          <Table 
            columnExtensions={tableColumnExtensions} 
          />
          <TableHeaderRow
            //rowComponent={rowComponent}
            showSortingControls={true}
            showPaginationBottom={false}
            titleComponent={(props) =>
              props.children!="Action" ?
              <b>{props.children}</b>
              :
              <b>&emsp;{props.children}</b>
            }
          />
          {this.props.showFilter && <TableFilterRow showFilterSelector={true} />}
          {/* <PagingPanel  pageSizes={pageSizes} /> */}
        </Grid>
      </Paper>
    );
  }
}

export default F221FormAllStudentsTableComponent;

F221FormAllStudentsTableComponent.propTypes = {
  showFilter: PropTypes.bool,
}

F221FormAllStudentsTableComponent.defaultProps = {
  showFilter: false,
}