import React, { Component } from 'react';
import {Paper} from '@material-ui/core';
import { Column, FilteringState, GroupingState, IntegratedFiltering,  IntegratedPaging, 
  IntegratedSorting, PagingState, SortingState, IntegratedGrouping} from '@devexpress/dx-react-grid';
import { DragDropProvider, Grid, PagingPanel, Table, TableFilterRow, TableGroupRow,
  GroupingPanel, TableHeaderRow, Toolbar} from '@devexpress/dx-react-grid-material-ui';
  
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
              //{ columnName: 'programmeCourseLabel', direction: 'asc' }
            ],
            sortingStateColumnExtensions:[
              { columnName: 'action', sortingEnabled: false },
              { columnName: 'programmeCourseIdPrereq', sortingEnabled: false },
              { columnName: 'programmeCourseIdExclusions', sortingEnabled: false }
            ],
            tableColumnExtensions:[
              { columnName: 'SRNo', width:100},
              { columnName: 'programmeGroupLabel', wordWrapEnabled:true},
              { columnName: 'programmeCourseLabel', wordWrapEnabled:true},
              { columnName: 'programmeCourseIdPrereq', wordWrapEnabled:true},
              { columnName: 'programmeCourseIdExclusions', wordWrapEnabled:true},
              { columnName: 'action', width:120, align:"center"}
            ],
            defaultGrouping:[
              //{ columnName: 'programmeGroupLabel'},
            ],
            groupingStateColumnExtensions:[
              { columnName: 'SRNo', groupingEnabled: false},
              { columnName: 'programmeCourseLabel', groupingEnabled: false },
              { columnName: 'programmeCourseIdPrereq', groupingEnabled: false },
              { columnName: 'programmeCourseIdExclusions', groupingEnabled:true},
              { columnName: 'action', groupingEnabled: false }
            ],
            tableGroupColumnExtension:[
              { columnName:"programmeGroupLabel", showWhenGrouped: false }
            ],
            resizingMode:"widget",
            defaultFilters:[],
            filteringStateColumnExtensions:[
              { columnName: 'action', filteringEnabled: false },
              { columnName: 'programmeCourseIdPrereq', filteringEnabled: false },
              { columnName: 'programmeCourseIdExclusions', filteringEnabled: false }
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
          pageSizes,
          defaultGrouping,
          tableGroupColumnExtension,
          groupingStateColumnExtensions
        } = this.state;

        const rows = this.props.data;
        const columns = this.props.columns;
        const showFilter = this.props.showFilter;

        return (
            <Paper>
              <Grid rows={rows} columns={columns}>
                <FilteringState defaultFilters={defaultFilters} columnExtensions={filteringStateColumnExtensions} />
                <SortingState defaultSorting={defaultSorting} columnExtensions={sortingStateColumnExtensions} />
                <GroupingState defaultGrouping={defaultGrouping} columnExtensions={groupingStateColumnExtensions}/>
                <DragDropProvider />
                <PagingState defaultCurrentPage={1} defaultPageSize={10}/>
                <IntegratedFiltering />
                <IntegratedSorting />
                <IntegratedPaging />
                <IntegratedGrouping />
                <Table columnExtensions={tableColumnExtensions} />
                <TableHeaderRow showGroupingControls
                  showSortingControls={true} 
                  titleComponent={(props) => (
                    props.children!="Action" ?
                      <b>{props.children}</b>
                      :
                      <b>{props.children}</b>
                  )}
                />
                <TableGroupRow icon columnExtensions={tableGroupColumnExtension}/>
                <Toolbar />
                <GroupingPanel showGroupingControls/>
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

export default F06ReportsTableComponent;
