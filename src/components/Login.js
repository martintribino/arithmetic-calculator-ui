// Login.js
import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useAuth } from "../hooks/AuthProvider";
import config from '../config';
import Typography from '@mui/material/Typography';

const Login = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
  const auth = useAuth();

	const handleLogin = async (event) => {
    event.preventDefault();
		try {
			await auth.login(username, password);
		} catch (error) {
			setError(error.message);
		}
	};

	return (
    <form className="Login" onSubmit={handleLogin}>
      <Typography variant="h6" component="h6" sx={{ flexGrow: 1 }}>
        Login
      </Typography>
      <TextField
        className="loginField"
        label="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <TextField
        className="loginField"
        type="password"
        label="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      {error && <div className="error">{error}</div>}
      <Button type="submit" variant="contained">Login</Button>
      <p>API URL: {config[process.env.NODE_ENV].apiUrl}</p>
    </form>
	);
};

export default Login;