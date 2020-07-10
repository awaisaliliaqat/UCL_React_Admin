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
  

class F09ReportsTableComponent extends Component {

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
            defaultSorting:[
              { columnName: 'ID', direction: 'asc' }
            ],
            sortingStateColumnExtensions:[
              { columnName: 'action', sortingEnabled: false },
            ],
            tableColumnExtensions:[
              { columnName: 'ID', width:120},
              { columnName: "academicSessionLabel", wordWrapEnabled:true},
              { columnName: 'shortLabel', wordWrapEnabled:true},
              { columnName: 'label', wordWrapEnabled:true},
              { columnName: 'programmeCourseLabel', wordWrapEnabled:true},
              { columnName: 'action', width:120}
            ],
            defaultFilters:[],
            filteringStateColumnExtensions:[
              { columnName: 'action', filteringEnabled: false },
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
            tableColumnExtensions,
            defaultColumnWidths,
            filteringStateColumnExtensions,
            defaultFilters,
            columnBands,
            pageSizes
          } = this.state;

          const rows = this.props.data;
          const columns = this.props.columns;

          const showFilter = this.props.showFilter;

        return (
            <Paper>
              <Grid rows={rows} columns={columns}>
              <FilteringState defaultFilters={defaultFilters} columnExtensions={filteringStateColumnExtensions} />
                <SortingState defaultSorting={defaultSorting} columnExtensions={sortingStateColumnExtensions} />
                <PagingState 
                  defaultCurrentPage={1}
                  defaultPageSize={10} 
                />
                <IntegratedFiltering />
                <IntegratedSorting />
                <IntegratedPaging />
                <Table tableColumnExtensions={tableColumnExtensions}/>
                <TableHeaderRow 
                  showSortingControls={true} 
                  titleComponent={(props) => (
                    props.children!="Action" ?
                      <b>{props.children}</b>
                      :
                      <b>&emsp;{props.children}</b>
                  )}
                />
                {showFilter?
                  <TableFilterRow showFilterSelector={true} /> 
                  :
                  ""
                }
                <PagingPanel pageSizes={pageSizes}/>
              </Grid>
            </Paper>
        );
    }
}

export default F09ReportsTableComponent;
