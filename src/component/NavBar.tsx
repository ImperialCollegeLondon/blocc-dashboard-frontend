import type React from 'react'
import { useTheme } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AnalyticsIcon from '@mui/icons-material/Analytics';

interface NavBarProps {
  toggleColorMode: () => void
}

const NavBar: React.FC<NavBarProps> = ({ toggleColorMode }) => {

  const theme = useTheme()

  return (
      <AppBar position="sticky" component="nav">
        <Toolbar>
          <IconButton size="large" color="inherit" >
            <AnalyticsIcon />
          </IconButton>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            Blockchain Logistics Optimising Chain of Custody (BLOCC) Dashboard
          </Typography>
          <IconButton onClick={toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
  )
}

export default NavBar
