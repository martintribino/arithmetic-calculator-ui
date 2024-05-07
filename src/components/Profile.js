// Profile.js
import React, { useState } from 'react';
import { Alert, TextField, Button } from '@mui/material';
import { useAuth } from "../hooks/AuthProvider";
import Typography from '@mui/material/Typography';

const Profile = () => {
	const [amount, setAmount] = useState('');
	const [balance, setBalance] = useState(undefined);
	const [error, setError] = useState('');
  const auth = useAuth();

	const handleBuyBalance = async (event) => {
    event.preventDefault();
		try {
			const response = await auth.buyBalance(amount);
      if (response) {
        setBalance(response);
      }
		} catch (error) {
			setError(error.message);
		}
	};

	return (
    <form className="Profile" onSubmit={handleBuyBalance}>
      {balance && <Alert className="alert" severity="success">Balance: {balance}</Alert>}
      <Typography variant="h6" component="h6" sx={{ flexGrow: 1 }}>
        Profile - Buy Balance
      </Typography>
      <TextField
        className="amountField"
        label="amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      {error && <Alert className="alert" severity="error" onClose={() => {setError(undefined)}}>{error}</Alert>}
      <Button type="submit" variant="contained">Buy</Button>
    </form>
	);
};

export default Profile;