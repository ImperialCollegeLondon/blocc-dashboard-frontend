import React from 'react'
import { useTheme } from '@mui/material/styles'
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { Paper, Box, Typography, Divider, CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { availableContainers } from '../config';
import { type ApprovedReading } from '../type/api'

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
const POLL_INTERVAL = Number(process.env.REACT_APP_POLL_INTERVAL);

const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
});

const ReadingVisualisation: React.FC = () => {

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
                containerNum: containerNum.toString(),
                // Get the time for 10 mins ago in epoch second
                sinceTimestamp: ((Date.now() / 1000 >> 0) - 600).toString() 
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
                    setData(data);
                    setLoading(false);
                })
                .catch(error => {
                    setError(error.message);
                    setLoading(false);
                });
        };
    
        // Call fetchData immediately to load data when the component mounts
        fetchData();
    
        const intervalId = setInterval(fetchData, POLL_INTERVAL);
    
        // Clear the interval when the component is unmounted or if containerNum changes
        return () => { clearInterval(intervalId) };
    }, [containerNum]);

    const theme = useTheme()

    return (
        <Paper sx={{p:2, height: 600}} >

            {/* Primary heading */}
            <Box display="flex" alignItems="center">
                <ShowChartIcon sx={{mr: 1}} />
                <Typography variant="h6" sx={{color: theme.palette.text.primary}}>
                    Sensor Readings Live Monitoring
                </Typography>
            </Box>

            {/* Secondary heading */}
            <Typography variant="subtitle2" sx={{color: theme.palette.text.secondary}} gutterBottom>
                The live update of sensor readings in last 10 minutes
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

            {!loading && error == null && data.length === 0 && (
                <Typography variant="subtitle1" sx={{color: theme.palette.text.disabled, mt: 3}} align="center">
                    No data available for the selected container.
                </Typography>
            )}

            {(!loading && error != null) && (
                <Typography variant="subtitle1" sx={{color: theme.palette.error.main, mt: 3}} align="center">
                    Error occurrer when fetching data for the selected container: {error}
                </Typography>
            )}

            
        </Paper>
    )
}

export default ReadingVisualisation