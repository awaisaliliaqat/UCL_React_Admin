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


class AssignSectionToTeacherFormTableComponent extends Component {

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
            tableColumnExtensions: [
                { columnName: 'isAssign', width: 120 },
                { columnName: 'name', wordWrapEnabled: true },
            ],

            resizingMode: "widget",
            defaultFilters: [],
            filteringStateColumnExtensions: [
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

        console.log(rows);

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

AssignSectionToTeacherFormTableComponent.propTypes = {
    columns: PropTypes.array,
    rows: PropTypes.array,
    showFilter: PropTypes.bool,


}

AssignSectionToTeacherFormTableComponent.defaultProps = {
    columns: [],
    rows: [],
    showFilter: false,
}

export default AssignSectionToTeacherFormTableComponent;
