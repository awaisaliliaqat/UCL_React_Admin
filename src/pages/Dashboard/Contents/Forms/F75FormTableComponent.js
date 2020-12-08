import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Paper } from "@material-ui/core";
import {FilteringState, IntegratedFiltering, IntegratedPaging, IntegratedSorting, PagingState, SortingState, } from "@devexpress/dx-react-grid";
import {Grid, PagingPanel, Table, TableFilterRow, TableHeaderRow} from "@devexpress/dx-react-grid-material-ui";

class F75FormTableComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { name: "SRNo", title: "SR#" },
        { name: "email", title: "Email" },
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
      pageSizes: [5, 10, 25],
      defaultSorting: [],
      sortingStateColumnExtensions: [
        { columnName: "changeStatusAction", sortingEnabled: false },
        { columnName: "action", sortingEnabled: false },
      ],
      tableColumnExtensions: [
        { columnName: "SRNo", width: 100 },
        { columnName: "email", wordWrapEnabled: true},
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
            defaultPageSize={10}
          />
          <IntegratedFiltering />
          <IntegratedSorting />
          <IntegratedPaging />
          <Table 
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

export default F75FormTableComponent;

F75FormTableComponent.propTypes = {
  showFilter: PropTypes.bool,
}

F75FormTableComponent.defaultProps = {
  showFilter: false,
}