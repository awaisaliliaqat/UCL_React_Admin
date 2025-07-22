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


class AttendanceTableComponent extends Component {

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
            defaultSorting: [
                { columnName: 'studentId', direction: 'asc' }
            ],
            tableColumnExtensions: [
                { columnName: 'studentId', width: 130 },
                { columnName: 'studentName', wordWrapEnabled: true },
                { columnName: 'sectionLabel', wordWrapEnabled: true },
                { columnName: 'sectionTypeLabel', wordWrapEnabled: true },
                { columnName: 'courseId', width: 130 },
                { columnName: 'courseLabel', wordWrapEnabled: true },
                { columnName: 'startTimestamp', wordWrapEnabled: true },
                { columnName: 'joinedOn', wordWrapEnabled: true },
                { columnName: 'lateMinutes', width: 150 },
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

AttendanceTableComponent.propTypes = {
    columns: PropTypes.array,
    rows: PropTypes.array,
    showFilter: PropTypes.bool


}

AttendanceTableComponent.defaultProps = {
    columns: [],
    rows: [],
    showFilter: false
}

export default AttendanceTableComponent;
