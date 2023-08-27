import React from 'react'
import SensorsIcon from '@mui/icons-material/Sensors';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { IconButton, ListItemButton, ListItemText, Avatar, ListItemAvatar, Grid, Tooltip, CircularProgress } from '@mui/material';

import { type ForkStatusResponse } from '../type/api'

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
const POLL_INTERVAL = Number(process.env.REACT_APP_POLL_INTERVAL);

interface ContainerForkStatusProps {
    containerNum: number
}

type ForkStatus = 'FORKED' | 'NORMAL' | 'NOT_AVAILABLE' | 'LOADING'

const statusColorMapping: Record<string, "error" | "success" | "warning" | "secondary"> = {
    FORKED: 'error',
    NORMAL: 'success',
    NOT_AVAILABLE: 'warning',
    LOADING: 'secondary'
}

const statusIconMapping = {
    FORKED: (<ErrorOutlineIcon />),
    NORMAL: (<CheckCircleOutlineIcon />),
    NOT_AVAILABLE: (<HelpOutlineIcon />),
    LOADING: (<CircularProgress />)
}

const statusTooltipMapping = {
    FORKED: 'Forked',
    NORMAL: 'Normal',
    NOT_AVAILABLE: 'Disconnected',
    LOADING: 'Loading'
}

const ContainerForkStatus: React.FC<ContainerForkStatusProps> = ({ containerNum }) => {

    const [forkStatus, setForkStatus] = React.useState<ForkStatus>('LOADING');

    React.useEffect(() => {
        // Function to fetch data from the backend
        const fetchData = (): void => {

            // Create a new URL object with the base API endpoint
            const url = new URL(`${API_ENDPOINT}/forkStatus`);
    
            // Define the parameters
            const params = {
                containerNum: containerNum.toString()
            };
    
            // Use URLSearchParams to append the parameters to the URL
            url.search = new URLSearchParams(params).toString();
    
            void fetch(url)
                .then(async (response) => {
                    return await (response.json() as Promise<ForkStatusResponse>);
                })
                .then(data => {
                    setForkStatus(data.status)
                })
        };
    
        // Call fetchData immediately to load data when the component mounts
        fetchData();
    
        const intervalId = setInterval(fetchData, POLL_INTERVAL);
    
        // Clear the interval when the component is unmounted or if containerNum changes
        return () => { clearInterval(intervalId) };
    }, []);

    return (
        <Grid item xs={6}>
            <ListItemButton>

                {/* Sensor Icon in the left */}
                <ListItemAvatar>
                    <Avatar>
                        <SensorsIcon />
                    </Avatar>
                </ListItemAvatar>

                {/* Text in the centre */}
                <ListItemText primary={`Container ${containerNum}`} />

                {/* Status Icon in the centre */}
                <Tooltip title={statusTooltipMapping[forkStatus]}>
                    <IconButton edge="end" color={statusColorMapping[forkStatus]}>
                        {statusIconMapping[forkStatus]}
                    </IconButton>
                </Tooltip>

            </ListItemButton>
        </Grid>
    )
}

export default ContainerForkStatus