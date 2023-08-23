import React from 'react'
import { useTheme } from '@mui/material/styles'
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { Paper, Box, IconButton, Typography, Divider, CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { availableContainers } from '../config';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
});

interface ApprovedReading {
    txId : string,
    temperature : number,
    approvals: number,
    timestamp: number,
    [key: string]: string | number;
}

const ReadingVisualisation: React.FC = () => {

    // TODO: add start date and time

    const [data, setData] = React.useState<ApprovedReading[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [containerNum, setContainerNum] = React.useState<number>(5);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        // Function to fetch data from the backend
        const fetchData = (): void => {
            // Create a new URL object with the base API endpoint
            const url = new URL(`${API_ENDPOINT}/transaction/approvedTempReadings`);
    
            // Define the parameters
            const params = {
                containerNum: containerNum.toString()
            };
    
            // Use URLSearchParams to append the parameters to the URL
            url.search = new URLSearchParams(params).toString();
    
            fetch(url)
                .then(async (response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return await response.json();
                })
                .then(data => {
                    console.log(data);
                    setData(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error(error);
                    setError(error.message);
                    setLoading(false);
                });
        };
    
        // Call fetchData immediately to load data when the component mounts
        fetchData();
    
        // Set up an interval to fetch data every 2 seconds
        const intervalId = setInterval(fetchData, 2000);
    
        // Clear the interval when the component is unmounted or if containerNum changes
        return () => { clearInterval(intervalId) };
    }, [containerNum]);

    const theme = useTheme()

    return (
        <Paper sx={{p:2, height: 500}} >

            {/* Primary heading */}
            <Box display="flex" alignItems="center">
                <IconButton color="inherit">
                    <ShowChartIcon />
                </IconButton>
                <Typography variant="h6" sx={{color: theme.palette.text.primary}}>
                    Sensor Readings Live Monitoring
                </Typography>
            </Box>

            {/* Secondary heading */}
            <Typography variant="subtitle2" sx={{color: theme.palette.text.secondary}} gutterBottom>
                The live update of sensor readings in the BLOCC network
            </Typography>

            <Divider />

            <FormControl variant="standard" sx={{ minWidth: 120, mt: 2 }}>
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

            
            {loading && (
                <CircularProgress color="inherit"/>
            )}

            {!loading && data.length > 0 && (
                <LineChart
                xAxis={[
                    {
                    dataKey: 'timestamp',
                    // timestamp is epoch second, covert to epoch millisecond
                    valueFormatter: (timestamp) => timeFormatter.format(new Date(timestamp * 1000)),
                    },
                ]}
                series= {[
                    {
                    dataKey: 'temperature',
                    label: `Temperature (°C) at Container ${containerNum}`
                    }
                ]}
                dataset={data}
                height={350}
            />
            )}

            {!loading && data.length === 0 && (
                <Typography variant="subtitle1" sx={{color: theme.palette.text.disabled, mt: 3}} align="center">
                    No data available for the selected container.
                </Typography>
            )}

            {(error != null) && (
                <Typography variant="subtitle1" sx={{color: theme.palette.error.main, mt: 3}} align="center">
                    Error occurrer when fetching data for the selected container: {error}
                </Typography>
            )}

            
        </Paper>
    )
}

export default ReadingVisualisation