import React from 'react'
import TocIcon from '@mui/icons-material/Toc'
import clsx from 'clsx'
import { Box, CircularProgress, Divider, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { type GridColDef, type GridValueGetterParams, DataGrid, type GridRowParams, type GridCellParams } from '@mui/x-data-grid'

import { availableContainers } from '../config';
import { type SensorChaincodeTransaction } from '../type/api'
import FetchStatus from '../type/fetchStatus'
import TransactionDetail from './TransactionDetail'

const POLL_INTERVAL = Number(process.env.REACT_APP_POLL_INTERVAL);

const transactionDataGridColumnDefinitions: GridColDef[] = [
    { 
        field: 'txId',
        headerName: 'Transaction ID',
        width: 300,
    },
    {
        field: 'creator',
        headerName: 'Creator MSP ID',
        width: 130,
    },
    {
        field: 'createdTimestamp',
        headerName: 'Created At',
        type: 'dateTime',
        valueGetter: (params: GridValueGetterParams<SensorChaincodeTransaction>) =>
            new Date(params.row.createdTimestamp * 1000),
        width: 170,
    },
    {
        field: 'temperature',
        headerName: 'Temperature (°C)',
        type: 'number',
        valueGetter: (params: GridValueGetterParams<SensorChaincodeTransaction>) =>
            params.row.reading.temperature,
        width: 130,
    },
    {
        field: 'approvals',
        headerName: 'Approvals',
        type: 'number',
        valueGetter: (params: GridValueGetterParams<SensorChaincodeTransaction>) => 
            params.row.approvals.length,
        width: 120,
        cellClassName: (params: GridCellParams<any, number>) => {
            if (params.value == null) {
              return '';
            }
      
            return clsx('approvals-cell', {
              green: params.value >= 8,
              yellow: params.value < 8 && params.value >= 4,
              red: params.value < 4
            });
        },
    },
]

const TransactionTable: React.FC = () => {

    const theme = useTheme()

    const [containerNum, setContainerNum] = React.useState<number | null>(null);
    const [startDate, setStartDate] = React.useState<Date | null>(null);
    const [endDate, setEndDate] = React.useState<Date | null>(null);
    const [approvalWindow, setApprovalWindow] = React.useState<number | null>(null);
    const [data, setData] = React.useState<SensorChaincodeTransaction[]>([])
    const [fetchStatus, setFetchStatus] = React.useState<FetchStatus>(FetchStatus.Loading)
    const [errorMsg, setErrorMsg] = React.useState<string>('')
    const [selectedRow, setSelectedRow] = React.useState<SensorChaincodeTransaction | null>(null);
    const [isDialogOpen, toggleIsDialogOpen] = React.useState(false);

    React.useEffect(() => {
        // Function to fetch data from the backend
        const fetchData = (): void => {
    
            // Define the parameters
            const params: Record<string, string> = {};

            if (containerNum != null) {
                params.containerNum = containerNum.toString();
            }

            if (startDate != null) {
                const sinceValue = startDate.valueOf() / 1000 >> 0;
                params.sinceTimestamp = sinceValue.toString();
            }

            if (endDate != null) {
                const untilValue = endDate.valueOf() / 1000 >> 0;
                params.untilTimestamp = untilValue.toString();
            }

            if (approvalWindow != null) {
                params.approvalWindow = approvalWindow.toString();
            }

            fetch('/api/v1/transaction/sensorChaincodeTransactions?' + new URLSearchParams(params).toString())
                .then(async (response) => {
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message);
                    }
                    return await response.json();
                })
                .then(data => {
                    setData(data)
                    setFetchStatus(FetchStatus.Success)
                })
                .catch(error => {
                    setErrorMsg(error.message)
                    setFetchStatus(FetchStatus.Error)
                });
        };
    
        // Call fetchData immediately to load data when the component mounts
        fetchData();
    
        const intervalId = setInterval(fetchData, POLL_INTERVAL);
    
        // Clear the interval when the component is unmounted or if containerNum changes
        return () => { clearInterval(intervalId) };
    }, [containerNum, startDate, endDate, approvalWindow]);

    return (
        <Paper sx={{p:2}}>
            
            {/* Primary heading */}
            <Box display="flex" alignItems="center">
                <TocIcon sx={{mr:1}} />
                <Typography variant="h6" sx={{color: theme.palette.text.primary}}>
                    Sensor Chaincode Transactions
                </Typography>
            </Box>

            {/* Secondary heading */}
            <Typography variant="subtitle2" sx={{color: theme.palette.text.secondary}} gutterBottom>
                The list of all Sensor Chaincode transactions in the BLOCC network
            </Typography>

            <Divider />

            {/* Form Controls */}
            <Box sx={{ my: 2 }}>
                
                {/* Container Select */}
                <FormControl variant="standard" sx={{ minWidth: 170, mt: 2 }}>
                <InputLabel>Choose a container</InputLabel>
                <Select
                    value={containerNum}
                    onChange={(e) => { setContainerNum(Number(e.target.value)) }}
                >
                    {availableContainers.map((container) => (
                        <MenuItem key={container} value={container}>
                            {`Container ${container}`}
                        </MenuItem>
                    ))}
                </Select>
                </FormControl>

                
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    {/* Start Date and Time */}
                    <DateTimePicker
                        label="Start Date and Time"
                        value={startDate}
                        views={['year', 'day', 'hours', 'minutes', 'seconds']}
                        onChange={(newDate: Date | null) => { setStartDate(newDate) }}
                        sx={{ ml:2, mt: 2 }}
                    />

                    {/* End Date and Time */}
                    <DateTimePicker
                        label="End Date and Time"
                        value={endDate}
                        views={['year', 'day', 'hours', 'minutes', 'seconds']}
                        onChange={(newDate: Date | null) => { setEndDate(newDate) }}
                        sx={{ ml:1, mt: 2 }}
                    />
                </LocalizationProvider>

                {/* Approval Window (secs) */}
                <TextField
                    variant="standard"
                    sx={{ minWidth: 140, ml:2, mt: 2 }}
                    label="Approval Window"
                    type="number"
                    value={approvalWindow}
                    onChange={event => { setApprovalWindow(Number(event.target.value)) }}
                    InputProps={{ inputProps: { min: 0 } }}
                />
            </Box>

            <Divider />

            {fetchStatus === FetchStatus.Loading && (
                <CircularProgress color="inherit"/>
            )}

            {fetchStatus === FetchStatus.Error && (
                <Typography variant="subtitle1" sx={{color: theme.palette.error.main, mt: 3}} align="center">
                    Error occurred when fetching data for the selected container: {errorMsg}
                </Typography>
            )}

            {fetchStatus === FetchStatus.Success && (
                <Box
                    sx={{
                        '& .approvals-cell.green': {
                            backgroundColor: theme.palette.success.main,
                        },
                        '& .approvals-cell.yellow': {
                            backgroundColor: theme.palette.warning.main,
                        },
                        '& .approvals-cell.red': {
                            backgroundColor: theme.palette.error.main,
                        },
                    }}
                >
                    <DataGrid
                        rows={data}
                        columns={transactionDataGridColumnDefinitions}
                        initialState={{
                            pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                            },
                        }}
                        getRowId={(row) => row.txId}
                        autoHeight
                        onRowClick={(params: GridRowParams<SensorChaincodeTransaction>) => {
                            setSelectedRow(params.row)
                            toggleIsDialogOpen(true)
                        }}
                        disableRowSelectionOnClick
                    />
                </Box>
            )}

            {selectedRow !== null && (
                <TransactionDetail
                    transaction={selectedRow}
                    isDialogOpen={isDialogOpen}
                    toggleIsDialogOpen={toggleIsDialogOpen}
                />
            )}

            
        </Paper>
    )
}

export default TransactionTable