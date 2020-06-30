import React, { Component } from 'react';
import {Paper, Input, Typography} from '@material-ui/core';
import { createStyles, withStyles, WithStyles, Theme, responsiveFontSizes } from '@material-ui/core/styles';
import { Column, FilteringState, GroupingState, IntegratedFiltering, IntegratedGrouping, IntegratedPaging, 
    IntegratedSelection, IntegratedSorting, PagingState, SelectionState, SortingState, DataTypeProvider, 
    DataTypeProviderProps} from '@devexpress/dx-react-grid';
import { DragDropProvider, Grid, GroupingPanel, PagingPanel, Table, TableFilterRow, TableGroupRow,
    TableHeaderRow, TableSelection, Toolbar, VirtualTable, TableColumnResizing} from '@devexpress/dx-react-grid-material-ui';

  
  const getInputValue = (value) =>
    (value === undefined ? '' : value);
  
  const getColor = (amount) => {
    if (amount < 3000) {
      return '#F44336';
    }
    if (amount < 5000) {
      return '#FFC107';
    }
    if (amount < 8000) {
      return '#FF5722';
    }
    return '#009688';
  };
  

class F06ReportsTableComponent extends Component {

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
            sortingStateColumnExtensions:[
              { columnName: 'action', sortingEnabled: false },
            ],
            tableColumnExtensions:[],
            defaultColumnWidths:[
              // { columnName: 'ID', width:100},
              // { columnName: 'shortLabel', width:350},
              // { columnName: 'label', width:400},
              // { columnName: 'action', width:150}
            ]
        };
    }

    render() {
        
        const {
            formatColumns,
            currencyColumns,
            availableFilterOperations,
            CurrencyEditor,
            tableColumnExtensions,
            sortingStateColumnExtensions,
            defaultColumnWidths,
            columnBands,
            pageSizes
          } = this.state;

          const rows = this.props.data;
          const columns = this.props.columns;

          const showFilter = this.props.showFilter;

        return (
            <Paper>
              <Grid rows={rows} columns={columns}>
                <FilteringState
                  //defaultFilters={[{ columnName: 'saleDate', value: '2016-02' }]}
                />
                
                <SortingState
                  defaultSorting={[
                    { columnName: 'ID', direction: 'asc' }
                  ]}
                  columnExtensions={sortingStateColumnExtensions}
                />
                {/* 
                  <SelectionState /> 
                */}
                {/* 
                <GroupingState
                  defaultGrouping={[{ columnName: 'product' }]}
                  defaultExpandedGroups={['EnviroCare Max']}
                /> 
                */}
                <PagingState 
                  defaultCurrentPage={0}
                  defaultPageSize={5} 
                />
                <IntegratedFiltering />
                <IntegratedSorting />
                <IntegratedPaging />
                {/* 
                  <IntegratedSelection /> 
                */}
                {/* 
                  <DragDropProvider /> 
                */}
                <Table columnExtensions={tableColumnExtensions}/>
                <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
                {/* 
                  <TableSelection showSelectAll={true} /> 
                */}
                <TableHeaderRow showSortingControls={true} />
                {showFilter?
                  <TableFilterRow showFilterSelector={true} /> 
                  :
                  ""
                }
                <PagingPanel pageSizes={pageSizes}/>
                {/* 
                  <Toolbar /> 
                */}
              </Grid>
            </Paper>
        );
    }
}

export default F06ReportsTableComponent;
