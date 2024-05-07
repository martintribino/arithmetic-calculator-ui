import * as React from 'react';
import { NavLink } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useAuth } from "../hooks/AuthProvider";

const NavBar = () => {
  const auth = useAuth();

	const handleLogout = () => {
		auth.logout();
	};

	const handleActive = ({ isActive, isPending }) => {
		return isPending ? "pending" : isActive ? "active" : "";
	};

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography component="div" className='NavBar' sx={{ flexGrow: 1 }}>
            <NavLink to="/calculator" className={handleActive}>Calculator</NavLink>
            <NavLink to="/operations" className={handleActive}>Operations</NavLink>
            <NavLink to="/generator" className={handleActive}>Generator</NavLink>
            <NavLink to="/profile" className={handleActive}>Profile</NavLink>
            <NavLink to="" onClick={handleLogout}>Logout</NavLink>
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavBar;