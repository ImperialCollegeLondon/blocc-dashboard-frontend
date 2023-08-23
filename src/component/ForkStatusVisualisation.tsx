import type React from 'react'
import { useTheme } from '@mui/material/styles'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import { Paper, Box, Typography, Divider, Grid } from '@mui/material';

import ContainerForkStatus from './ContainerForkStatus';
import { availableContainers } from '../config';

const ForkStatusVisualisation: React.FC = () => {

    const theme = useTheme()

    return (
        <Paper sx={{p:2, height: 500}}>

            {/* Primary heading */}
            <Box display="flex" alignItems="center">
                <AccountTreeIcon sx={{mr: 1}} />
                <Typography variant="h6" sx={{color: theme.palette.text.primary}}>
                    Blockchains Fork Status
                </Typography>
            </Box>

            {/* Secondary heading */}
            <Typography variant="subtitle2" sx={{color: theme.palette.text.secondary}} gutterBottom>
                The live detection of forking of chains in the BLOCC network 
            </Typography>

            <Divider />

            <Grid container spacing={2}>

            {availableContainers.map(
                (containerNum, index) => (
                    <ContainerForkStatus key={`container-fork-status${index}`} containerNum={containerNum} />
                )    
            )}

            </Grid>

            
        </Paper>
    )
}

export default ForkStatusVisualisation