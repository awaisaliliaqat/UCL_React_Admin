import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import {
    FilteringState, IntegratedFiltering, IntegratedPaging,
    IntegratedSorting, PagingState, SortingState
} from '@devexpress/dx-react-grid';
import {
    Grid, PagingPanel, Table, TableFilterRow,
    TableHeaderRow
} from '@devexpress/dx-react-grid-material-ui';
import PropTypes from "prop-types";


class CreateSectionReportsTableComponent extends Component {

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
                { columnName: 'ID', direction: 'asc' }
            ],
            sortingStateColumnExtensions: [
                { columnName: 'action', sortingEnabled: false },
            ],
            tableColumnExtensions: [
                { columnName: 'ID', width: 100 },
                { columnName: 'displayName', wordWrapEnabled: true },
                { columnName: 'mobileNumber', wordWrapEnabled: true },
                { columnName: 'email', wordWrapEnabled: true },
                { columnName: 'discipline', wordWrapEnabled: true },
                { columnName: 'jobStatus', wordWrapEnabled: true },
                { columnName: 'presentAddress', wordWrapEnabled: true },
                { columnName: 'action', width: 120 }
            ],

            resizingMode: "widget",
            defaultFilters: [],
            filteringStateColumnExtensions: [
                { columnName: 'action', filteringEnabled: false },
            ]
        };
    }

    render() {

        const {
            tableColumnExtensions,
            defaultSorting,
            sortingStateColumnExtensions,
            filteringStateColumnExtensions,
            defaultFilters,
            pageSizes
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
                    <IntegratedPaging />
                    <Table columnExtensions={tableColumnExtensions} />
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

CreateSectionReportsTableComponent.propTypes = {
    columns: PropTypes.array,
    rows: PropTypes.array,
    showFilter: PropTypes.bool


}

CreateSectionReportsTableComponent.defaultProps = {
    columns: [],
    rows: [],
    showFilter: false
}

export default CreateSectionReportsTableComponent;
