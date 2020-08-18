import React, { Component } from 'react';
import {Paper, Input, Typography} from '@material-ui/core';
import { createStyles, withStyles, WithStyles, Theme, responsiveFontSizes } from '@material-ui/core/styles';
import { Column, FilteringState, GroupingState, IntegratedFiltering, IntegratedGrouping, IntegratedPaging, 
    IntegratedSelection, IntegratedSorting, PagingState, SelectionState, SortingState, DataTypeProvider, 
    DataTypeProviderProps, TreeDataState, CustomTreeData} from '@devexpress/dx-react-grid';
import { DragDropProvider, Grid, GroupingPanel, PagingPanel, Table, TableFilterRow, TableGroupRow,
    TableHeaderRow, TableBandHeader} from '@devexpress/dx-react-grid-material-ui';

const BandCellBase = ({ children, tableRow, tableColumn, column, classes, ...restProps }) => {
  return (
    <TableBandHeader.Cell
      {...restProps}
      column={column}
    >
      <strong style={{color:"rgb(29, 95, 152)", whiteSpace:"initial"}}>
        {children}
      </strong>
    </TableBandHeader.Cell>
  );
};

const BandCell = withStyles({ name: 'BandCell' })(BandCellBase);

class F18ReportsTableComponent extends Component {

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
            pageSizes:[5,10,15,20],
            defaultSorting:[
              { columnName: 'SR#', direction: 'asc' }
            ],
            sortingStateColumnExtensions:[
              { columnName: 'Action', sortingEnabled: false },
            ],
            tableColumnExtensions:[
              // { columnName: 'SR#',width:100},
              // // { columnName: 'sessionLabel', wordWrapEnabled:true},
              // // { columnName: 'type1', wordWrapEnabled:true},
              // // { columnName: 'type2', wordWrapEnabled:true},
              // // { columnName: 'type3', wordWrapEnabled:true},
              // { columnName: 'action',width:120}
            ],
            defaultFilters:[],
            filteringStateColumnExtensions:[
              { columnName: 'Action', filteringEnabled: false },
            ]
        };
    }

    render() {
        
        const {
            formatColumns,
            currencyColumns,
            availableFilterOperations,
            CurrencyEditor,
            defaultSorting,
            sortingStateColumnExtensions,
            //tableColumnExtensions,
            defaultColumnWidths,
            filteringStateColumnExtensions,
            defaultFilters,
            pageSizes
          } = this.state;

          const rows = this.props.data;
          const columns = this.props.columns;
          const showFilter = this.props.showFilter;
          const tableColumnExtensions = this.props.tableColumnExtensions;
          const columnBands = this.props.columnBands;

        return (
            <Paper>
              <Grid rows={rows} columns={columns}>
                <FilteringState defaultFilters={defaultFilters} columnExtensions={filteringStateColumnExtensions} />
                <SortingState defaultSorting={defaultSorting} columnExtensions={sortingStateColumnExtensions} />
                {/* <SelectionState />  */}
                {/* <GroupingState defaultGrouping={[{ columnName: 'product' }]} defaultExpandedGroups={['EnviroCare Max']} /> */}
                <PagingState defaultCurrentPage={0} defaultPageSize={10}/>
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
                  titleComponent={(props) => (
                    props.children!="Action" ?
                      <b>{props.children}</b>
                      :
                      <b>&emsp;{props.children}</b>
                  )}
                />
                <TableBandHeader
                  columnBands={columnBands}
                  cellComponent={BandCell}
                />
                {showFilter?
                  <TableFilterRow showFilterSelector={true} /> 
                  :
                  ""
                }
                <PagingPanel pageSizes={pageSizes}/>
                {/* <Toolbar /> */}
              </Grid>
            </Paper>
        );
    }
}

export default F18ReportsTableComponent;
