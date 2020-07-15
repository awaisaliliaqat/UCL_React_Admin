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
            defaultSorting:[
              { columnName: 'ID', direction: 'asc' }
            ],
            sortingStateColumnExtensions:[
              { columnName: 'action', sortingEnabled: false },
            ],
            tableColumnExtensions:[
              { columnName: 'ID', width:100, align:"center"},
              { columnName: 'academicsSessionLabel', wordWrapEnabled: true, align:"center"},
              { columnName: 'programmeGroupLabel', wordWrapEnabled: true, align:"center"},
              { columnName: "courseId", wordWrapEnabled: true, align:"center"},
              { columnName: 'courseCode', wordWrapEnabled: true, align:"center"},
              { columnName: 'courseTitle', wordWrapEnabled: true, align:"center"},
              { columnName: 'courseCreditLabel', wordWrapEnabled: true, align:"center"},
              { columnName: 'courseLabel', wordWrapEnabled: true, align:"center"},
              { columnName: 'action', width:120}
            ],
            resizingMode:"widget",
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

        const rows = this.props.data;
        const columns = this.props.columns;
        const showFilter = this.props.showFilter;

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

export default F06ReportsTableComponent;
