import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { FilteringState, IntegratedFiltering, IntegratedPaging, IntegratedSorting, PagingState, SortingState, DataTypeProvider } from '@devexpress/dx-react-grid';
import { Grid, PagingPanel, Table, TableFilterRow, TableHeaderRow } from '@devexpress/dx-react-grid-material-ui';
import PropTypes from "prop-types";

const CurrencyFormatter = ({ value }) => {
    const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    return safeValue.toLocaleString("en-US")
};

const CurrencyTypeProvider = (props) => (
    <DataTypeProvider formatterComponent={CurrencyFormatter} {...props} />
);

class F361ReportsTableComponent extends Component {

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
            defaultSorting: [
            ],
            sortingStateColumnExtensions: [
                { columnName: 'action', sortingEnabled: false },
            ],
            tableColumnExtensions: [
                { columnName:'id', width: 100 },
                { columnName:'payrollMonths', align:"right", width:110, wordWrapEnabled: true },
                { columnName:'perMonthSalary', align:"right", width:110, wordWrapEnabled: true },
                { columnName:'perHourRate', align:"right", width:110, wordWrapEnabled: true },
                 { columnName:'comments', align:"left", wordWrapEnabled: true },
                { columnName:'createdByLabel', align:"center", width:120, wordWrapEnabled: true },
                { columnName:'createdOn', align:"center", width:95, wordWrapEnabled: true },
                { columnName:'status', align:"center", width:95, wordWrapEnabled: true },
                { columnName:'statusByLabel', align:"center", width:120, wordWrapEnabled: true },
                { columnName:'statusOn', align:"center", width:95, wordWrapEnabled: true },
                { columnName:'action', width: 120 }
            ],

            resizingMode: "widget",
            defaultFilters: [],
            filteringStateColumnExtensions: [
                { columnName: 'action', filteringEnabled: false },
            ],
            currencyColumns : ["payrollMonths", "perMonthSalary", "perHourRate"]
        };
    }

    render() {

        const {
            tableColumnExtensions,
            defaultSorting,
            sortingStateColumnExtensions,
            filteringStateColumnExtensions,
            defaultFilters,
            pageSizes,
            currencyColumns
        } = this.state;

        const { rows, columns, showFilter } = this.props;

        return (
            <Paper>
                <Grid rows={rows} columns={columns}>
                    <FilteringState defaultFilters={defaultFilters} columnExtensions={filteringStateColumnExtensions} />
                    <SortingState defaultSorting={defaultSorting} columnExtensions={sortingStateColumnExtensions} />
                    <PagingState defaultCurrentPage={0} defaultPageSize={5} />
                    <IntegratedFiltering />
                    <IntegratedSorting />
                    <CurrencyTypeProvider
					    for={currencyColumns}
				    />
                    <IntegratedPaging />
                    <Table 
                        columnExtensions={tableColumnExtensions} 
                    />
                    <TableHeaderRow
                        showSortingControls={true}
                        titleComponent={(props) => (
                            props.children != "Action" ?
                                <b>{props.children}</b>
                                :
                                <b>&emsp;{props.children}</b>
                        )}
                    />
                    {showFilter ?
                        <TableFilterRow showFilterSelector={true} />
                        :
                        ""
                    }
                    <PagingPanel pageSizes={pageSizes} />
                </Grid>
            </Paper>
        );
    }
}

F361ReportsTableComponent.propTypes = {
    columns: PropTypes.array,
    rows: PropTypes.array,
    showFilter: PropTypes.bool
}

F361ReportsTableComponent.defaultProps = {
    columns: [],
    rows: [],
    showFilter: false
}

export default F361ReportsTableComponent;
