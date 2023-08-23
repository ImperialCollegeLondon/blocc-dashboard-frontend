import React from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { LineChart } from '@mui/x-charts/LineChart';
import channel5 from '../data/approved-reading-channel5.json'

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

    const containerNum = 5
    const [data, setData] = React.useState<ApprovedReading[]>(channel5)

    React.useEffect(() => {
        setData(channel5)
    }, [])

    const theme = useTheme()

    return (
        <Paper sx={{p:2}}>
        <Typography component="h2" variant="h6" sx={{color: theme.palette.text.primary}} gutterBottom>
            Sensor Readings
        </Typography>
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
                label: `Temperature (°C) at Container${containerNum}`
                }
            ]}
            dataset={data}
            height={300}
        />
        </Paper>
    )
}

export default ReadingVisualisation