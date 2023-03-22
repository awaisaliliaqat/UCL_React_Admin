import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Paper } from "@material-ui/core";
import {FilteringState, IntegratedFiltering, IntegratedPaging, IntegratedSorting, PagingState, SortingState, } from "@devexpress/dx-react-grid";
import {Grid, PagingPanel, Table, TableFilterRow, TableHeaderRow} from "@devexpress/dx-react-grid-material-ui";

class F221FormTableComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { name: "studentId", title: "Nucleus\xa0ID" },
        { name: "displayName", title: "Student\xa0Name" },
        { name: "applicationStatusLabel", title: "Programme" },
        { name: "pathwayLabel", title: "Pathway" },
        { name: "changeStatusAction", title: "Promote\xa0Student"},
        { name: "action", title: <span>Withdrawn</span>},
        { name: "graduate", title: <span>Graduate</span>}
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
      sortingStateColumnExtensions: [
        { columnName: "changeStatusAction", sortingEnabled: false },
        { columnName: "action", sortingEnabled: false },
        { columnName: "graduate", sortingEnabled: false}
      ],
      tableColumnExtensions: [
        { columnName: "studentId"},
        { columnName: "displayName",  wordWrapEnabled: true },
        { columnName: "applicationStatusLabel", wordWrapEnabled: true },
        { columnName: "pathwayLabel",  wordWrapEnabled: true },
        { columnName: "changeStatusAction",  align:"center"},
        { columnName: "action", align:"center"},
        { columnName: "graduate", align:"center"}
      ],
      defaultColumnWidths: [],
      defaultFilters: [],
      filteringStateColumnExtensions: [
        { columnName: "changeStatusAction", filteringEnabled: false },
        { columnName: "action", filteringEnabled: false },
        { columnName: "graduate", filteringEnabled: false }
      ]
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

export default F221FormTableComponent;

F221FormTableComponent.propTypes = {
  showFilter: PropTypes.bool,
}

F221FormTableComponent.defaultProps = {
  showFilter: false,
}