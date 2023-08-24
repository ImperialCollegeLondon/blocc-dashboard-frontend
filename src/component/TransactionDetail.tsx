import type React from 'react'
import { Box, Dialog, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DataGrid, type GridColDef, type GridValueGetterParams } from '@mui/x-data-grid'

import { type ApprovalTransaction, type SensorChaincodeTransaction } from '../type/api'

interface TransactionDetailProps {
    transaction: SensorChaincodeTransaction
    isDialogOpen: boolean,
    toggleIsDialogOpen: (status: boolean) => void
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({ transaction, isDialogOpen, toggleIsDialogOpen}) => {

    const approvalTrasnsactionslDataGridColumnDefinitions: GridColDef[] = [
        { 
            field: 'txId',
            headerName: 'Transaction ID',
            width: 180,
        },
        {
            field: 'creator',
            headerName: 'Approved By',
            width: 130,
        },
        {
            field: 'createdTimestamp',
            headerName: 'Created At',
            valueGetter: (params: GridValueGetterParams<ApprovalTransaction>) => {
                const date: Date = new Date(params.row.createdTimestamp * 1000)
                return date.toLocaleString()
            },
            width: 150,
        },
        {
            field: 'window',
            headerName: 'Delay',
            valueGetter: (params: GridValueGetterParams<ApprovalTransaction>) => params.row.createdTimestamp - transaction.createdTimestamp,
            width: 80,
        }
    ]


    return (
        <Dialog
            open={isDialogOpen}
            onClose={() => { toggleIsDialogOpen(false) }}
        >
            <DialogTitle>
                Sensor Chaincodo Transaction details
            </DialogTitle>

            <DialogContent dividers>
            
                <TextField
                    label="Transaction ID"
                    defaultValue={transaction.txId}
                    InputProps={{
                        readOnly: true,
                    }}
                    variant='standard'
                    fullWidth
                    color='primary'
                    sx={{ mb : 2 }}
                />

                <Box display='flex' sx={{ mb : 2 }}>
                    <TextField
                        label="Creator MSP ID"
                        defaultValue={transaction.creator}
                        InputProps={{
                            readOnly: true,
                        }}
                        variant='standard'
                        sx={{ mr : 2 }}
                    />

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label="Transaction Created Date and Time"
                            views={['year', 'day', 'hours', 'minutes', 'seconds']}
                            value={new Date(transaction.createdTimestamp * 1000)}
                            readOnly
                        />
                    </LocalizationProvider>
                </Box>

                <Box display='flex' sx={{ mb : 2 }}>
                    <TextField
                        label="Temperature (°C)"
                        defaultValue={transaction.reading.temperature}
                        InputProps={{
                            readOnly: true,
                        }}
                        variant='standard'
                        sx={{ mr : 2 }}
                    />

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label="Reading Taken Date and Time"
                            views={['year', 'day', 'hours', 'minutes', 'seconds']}
                            value={new Date(transaction.reading.timestamp * 1000)}
                            readOnly
                        />
                    </LocalizationProvider>
                </Box>

            </DialogContent>

            <DialogContent dividers>

                <Typography variant='h6' gutterBottom>
                    Approval Transactions
                </Typography>

                <DataGrid
                    rows={transaction.approvals}
                    columns={approvalTrasnsactionslDataGridColumnDefinitions}
                    initialState={{
                        pagination: {
                          paginationModel: {
                            pageSize: 10,
                          },
                        },
                      }}
                    getRowId={(row) => row.txId}
                    autoHeight
                    disableRowSelectionOnClick
                />

                <Typography variant='caption'>
                    Delay refers to the seconds elapsed between a sensor reading is taken and an associated Approval Transaction is added to the ledger
                </Typography>


            </DialogContent>

        </Dialog>
    )
}

export default TransactionDetail