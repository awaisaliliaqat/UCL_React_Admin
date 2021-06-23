import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import {FilteringState, IntegratedFiltering, IntegratedSorting, SortingState} from '@devexpress/dx-react-grid';
import {Grid, Table, TableFilterRow, TableHeaderRow} from '@devexpress/dx-react-grid-material-ui';
import PropTypes from "prop-types";

class ChangeStatusTableComponent extends Component {

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
            resizingMode: "widget",
            defaultFilters: [],
            filteringStateColumnExtensions: [
                { columnName: 'action', filteringEnabled: false },
            ],
            tableColumnExtensions: [
                { columnName: 'studentId', width: 120 },
                { columnName: 'firstName', wordWrapEnabled: true },
                { columnName: 'middleName', wordWrapEnabled: true },
                { columnName: 'lastName', wordWrapEnabled: true },
                { columnName: 'genderLabel', wordWrapEnabled: true, width: 130 },
                { columnName: 'degreeLabel', wordWrapEnabled: true, width: 250 },
                { columnName: 'mobileNo', wordWrapEnabled: true },
                { columnName: 'email', wordWrapEnabled: true, width: 200 },
                { columnName: 'sessionLabel', wordWrapEnabled: true },
                { columnName: 'action', width: 130, align:"center" },
                { columnName: 'statusChangeDate', width: 130, wordWrapEnabled: true },
            ],
            defaultSorting: [],
            sortingStateColumnExtensions: [
                { columnName: "action", sortingEnabled: false },
            ],
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
                            props.children != "Selection" ?
                                <b>{props.children}</b>
                                :
                                <b>&emsp;{props.children}</b>
                        )}
                    />
                    {showFilter ? <TableFilterRow showFilterSelector={true} /> : ""}
                </Grid>
            </Paper>
        );
    }
}

ChangeStatusTableComponent.propTypes = {
    columns: PropTypes.array,
    rows: PropTypes.array,
    showFilter: PropTypes.bool
}

ChangeStatusTableComponent.defaultProps = {
    columns: [],
    rows: [],
    showFilter: false
}

export default ChangeStatusTableComponent;
