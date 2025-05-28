import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import {
    FilteringState, IntegratedFiltering,
    IntegratedSorting, SortingState
} from '@devexpress/dx-react-grid';
import {
    Grid, Table, TableFilterRow,
    TableHeaderRow
} from '@devexpress/dx-react-grid-material-ui';
import PropTypes from "prop-types";


class CreateSectionReportsReportsTableComponent extends Component {

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
                { columnName: 'sr', direction: 'asc' }
            ],
            sortingStateColumnExtensions: [
                { columnName: 'action', sortingEnabled: false },
            ],
            tableColumnExtensions: [
                { columnName: 'sr', width: 100 },
                { columnName: 'name', wordWrapEnabled: true },
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
        } = this.state;

        const { rows, columns, showFilter } = this.props;

        return (
            <Paper>
                <Grid rows={rows} columns={columns}>
                    <FilteringState defaultFilters={defaultFilters} columnExtensions={filteringStateColumnExtensions} />
                    <SortingState defaultSorting={defaultSorting} columnExtensions={sortingStateColumnExtensions} />
                    <IntegratedFiltering />
                    <IntegratedSorting />
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
                </Grid>
            </Paper>
        );
    }
}

CreateSectionReportsReportsTableComponent.propTypes = {
    columns: PropTypes.array,
    rows: PropTypes.array,
    showFilter: PropTypes.bool,


}

CreateSectionReportsReportsTableComponent.defaultProps = {
    columns: [],
    rows: [],
    showFilter: false,
}

export default CreateSectionReportsReportsTableComponent;
