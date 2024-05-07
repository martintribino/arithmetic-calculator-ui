// StringGenerator.js
import React, { useState } from 'react';
import {
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Alert,
  Grid,
  CircularProgress
} from '@mui/material';
import { useAuth } from "../hooks/AuthProvider";

const StringGenerator = () => {
  const [result, setResult] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [length, setLength] = useState(10);
	const [error, setError] = useState(undefined);
  const auth = useAuth();

  const handleResult = async () => {
    try {
      setLoading(true);
      const response = await auth.generateStr(length);
      if (response) {
        setResult(response);
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
	};

  const handleChange = (event) => {
    setLength(event.target.value);
  };

  const handleClear = () => {
    setLoading(false);
    setResult(undefined);
    setError(undefined);
  };

	return (
    <div className="Generator">
    {result && <Alert className="alert" severity="success" onClose={() => {setResult(undefined)}}>Result: {result}</Alert>}
      <Box>
        <FormControl fullWidth>
          <InputLabel id="select-length-label">String Length</InputLabel>
          <Select
            labelId="select-length-label"
            id="select-length"
            value={length}
            label="String Length"
            onChange={handleChange}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box>
        <Card variant="outlined">
          <CardContent>
            {error && <Alert className="alert" severity="error" onClose={() => {setError(undefined)}}>{error}</Alert>}
            {
              !loading && <Grid container spacing={1}>
                <Grid item xs={6} sx={{ justifyContent: 'center' }}><Button variant="contained" onClick={() => handleResult()}>Generate</Button></Grid>
                <Grid item xs={6} sx={{ justifyContent: 'center' }}><Button variant="contained" onClick={() => handleClear()}>Clear</Button></Grid>
              </Grid>
            }
            {loading && <CircularProgress />}
          </CardContent>
        </Card>
      </Box>
    </div>
	);
};

export default StringGenerator;