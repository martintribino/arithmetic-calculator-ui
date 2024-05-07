// Calculator.js

import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Typography
} from '@mui/material';
import { useAuth } from "../hooks/AuthProvider";

export const Calculator = () => {
  const [display, setDisplay] = useState('');
  const [loading, setLoading] = useState(false);
  const [num1, setNum1] = useState(undefined);
  const [num2, setNum2] = useState(undefined);
  const [result, setResult] = useState(undefined);
  const [op, setOp] = useState(undefined);
  const [error, setError] = useState('');
  const auth = useAuth();
  const opMap = {
    'addition': '+',
    'subtraction': '-',
    'multiplication': '*',
    'division': '/',
    'square-root': '√',
  }

  const getValueOp = (op) => {
    if (opMap[op] !== undefined) {
      return opMap[op];
    }
  };
  const handleNeg = () => {
    if (display.length > 0) {
      if (display.at(0) === '-') {
        setDisplay(display.slice(1));
      } else {
        setDisplay('-' + display);
      }
    }
  };
  const handlePoint = () => {
    if (display.length > 0 && display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };
  const handleOperation = (value) => {
    if (display.length > 0 && num1 === undefined && num2 === undefined && op === undefined) {
      setNum1(display);
      setOp(value);
      setDisplay('');
    }
  };
  const handleButton = (value) => {
    setDisplay(display + value);
  };
  const handleSquareRoot = async () => {
    if (display.length > 0) {
      try {
        setLoading(true);
        const response = await auth.operation('square-root', display, '');
        if (response) {
          setResult(response);
        }
      } catch (error) {
        setError(error.message);
      }
      handleClear();
    }
  };
  const handleResult = () => {
    setNum2(display);
    setDisplay('');
    handleCalculate(op, num1, display);
  };
  const handleCalculate = async (operation, n1, n2) => {
    if (display.length > 0 && num1 !== undefined && num2 === undefined && op !== undefined) {
      try {
        setLoading(true);
        const response = await auth.operation(operation, n1, n2);
        if (response) {
          setResult(response);
        }
      } catch (error) {
        setError(error.message);
      }
      handleClear();
    }
  };
  const handleClear = () => {
    setDisplay('');
    setNum1(undefined);
    setNum2(undefined);
    setOp(undefined);
    setLoading(false);
  };

  return (
    <Box className="Calculator">
      <Card variant="outlined">
        <CardContent>
          <span className='partialResult'>
            {num1 && <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>{num1}</Typography>}
            {op && <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>{getValueOp(op)}</Typography>}
            {num2 && <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>{num2}</Typography>}
          </span>
          <TextField
            className="display"
            variant="outlined"
            fullWidth
            value={display}
            InputProps={{
              readOnly: true,
            }}
          />
          {result && <Alert className="alert" severity="success" onClose={() => {setResult(undefined)}}>Result: {result}</Alert>}
          {error && <Alert className="alert" severity="error" onClose={() => {setError(undefined)}}>{error}</Alert>}
          {
            !loading && <Grid container spacing={1}>
              <Grid item xs={3} sx={{ justifyContent: 'center' }}><Button variant="contained" onClick={() => handleClear()}>C</Button></Grid>
              <Grid item xs={3} sx={{ justifyContent: 'center' }}><Button variant="contained" onClick={() => handleNeg()}>+/-</Button></Grid>
              <Grid item xs={3} sx={{ justifyContent: 'center' }}><Button variant="contained" onClick={() => handleSquareRoot()}>√</Button></Grid>
              <Grid item xs={3} sx={{ justifyContent: 'center' }}><Button variant="contained" color="primary" onClick={() => handleOperation('division')}>/</Button></Grid>
              <Grid item xs={3} sx={{ justifyContent: 'center' }}><Button variant="contained" onClick={() => handleButton('7')}>7</Button></Grid>
              <Grid item xs={3} sx={{ justifyContent: 'center' }}><Button variant="contained" onClick={() => handleButton('8')}>8</Button></Grid>
              <Grid item xs={3} sx={{ justifyContent: 'center' }}><Button variant="contained" onClick={() => handleButton('9')}>9</Button></Grid>
              <Grid item xs={3} sx={{ justifyContent: 'center' }}><Button variant="contained" color="primary" onClick={() => handleOperation('multiplication')}>*</Button></Grid>
              <Grid item xs={3} sx={{ justifyContent: 'center' }}><Button variant="contained" onClick={() => handleButton('4')}>4</Button></Grid>
              <Grid item xs={3} sx={{ justifyContent: 'center' }}><Button variant="contained" onClick={() => handleButton('5')}>5</Button></Grid>
              <Grid item xs={3} sx={{ justifyContent: 'center' }}><Button variant="contained" onClick={() => handleButton('6')}>6</Button></Grid>
              <Grid item xs={3} sx={{ justifyContent: 'center' }}><Button variant="contained" color="primary" onClick={() => handleOperation('subtraction')}>-</Button></Grid>
              <Grid item xs={3} sx={{ justifyContent: 'center' }}><Button variant="contained" onClick={() => handleButton('1')}>1</Button></Grid>
              <Grid item xs={3} sx={{ justifyContent: 'center' }}><Button variant="contained" onClick={() => handleButton('2')}>2</Button></Grid>
              <Grid item xs={3} sx={{ justifyContent: 'center' }}><Button variant="contained" onClick={() => handleButton('3')}>3</Button></Grid>
              <Grid item xs={3} sx={{ justifyContent: 'center' }}><Button variant="contained" color="primary" onClick={() => handleOperation('addition')}>+</Button></Grid>
              <Grid item xs={6} sx={{ justifyContent: 'center' }}><Button variant="contained" sx={{ width: '100%' }} onClick={() => handleButton('0')}>0</Button></Grid>
              <Grid item xs={3} sx={{ justifyContent: 'center' }}><Button variant="contained" onClick={() => handlePoint()}>.</Button></Grid>
              <Grid item xs={3} sx={{ justifyContent: 'center' }}><Button variant="contained" onClick={() => handleResult()}>=</Button></Grid>
            </Grid>
          }
          {loading && <CircularProgress />}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Calculator;
