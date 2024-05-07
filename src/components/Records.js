import React, { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TablePagination,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import { useAuth } from "../hooks/AuthProvider";

const Records = () => {
  const [loading, setLoading] = useState(false);
  const [recordList, setRecordList] = useState([]);
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(0);
	const [error, setError] = useState(undefined);
  const [checks, setChecks] = useState([]);
  const [enableDel, setEnableDel] = useState(false);
  const auth = useAuth();
  const label = { inputProps: { 'aria-label': 'Delete' } };

  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      setLoading(true);
      getRecordList();
      setLoading(false);
    }
    return () => {
      ignore = true;
    }
  }, [page, orderBy, order]);

  const initialize = () => {
    setRecordList([]);
    setCount(0);
    setRowsPerPage(5);
    setPage(0);
    setOrderBy('createdAt')
    setOrder('desc')
  };

  const getRecordList = async () => {
    try {
      const offset = rowsPerPage * page;
      const res = await auth.getRecords(rowsPerPage, offset, orderBy, order);
      const { count, rows } = res;
      setRecordList(rows);
      setCount(count);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCheck = (event, id) => {
    const index = checks.indexOf(id);
    if (event.target.checked) {
      if (index === -1)
        checks.push(id);
    } else {
      if (index > -1)
        checks.splice(index, 1);
    }
    setChecks(checks);
    setEnableDel(checks.length > 0);
  };

  const handleDelRecords = async () => {
    setLoading(true);
    try {
      if (checks.length > 0) {
        const res = await auth.delRecords(checks);
        if (res === 200) {
          initialize();
          await getRecordList();
        } else {
          setError(error.message);
        }
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className='Operations'>
      {
        !loading && 
        <Box>
          {error && <Alert className="alert" severity="error" onClose={() => {setError(undefined)}}>{error}</Alert>}
          <TableContainer>
            <Table
              sx={{ maxWidth: 750 }}
              aria-labelledby="Operations"
            >
              <TableHead>
                <TableRow>
                  <TableCell sortDirection={orderBy === 'operationResponse'? order : false}>
                    <TableSortLabel
                      active={orderBy === 'operationResponse'}
                      direction={orderBy === 'operationResponse' ? order : 'asc'}
                      onClick={() => handleRequestSort('operationResponse')}
                    >
                      Operation
                      {orderBy === 'operationResponse' ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={orderBy === 'amount' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'amount'}
                      direction={orderBy === 'amount' ? order : 'asc'}
                      onClick={() => handleRequestSort('amount')}
                    >
                      Amount
                      {orderBy === 'amount' ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={orderBy === 'userBalance' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'userBalance'}
                      direction={orderBy === 'userBalance' ? order : 'asc'}
                      onClick={() => handleRequestSort('userBalance')}
                    >
                      Balance
                      {orderBy === 'userBalance' ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={orderBy === 'createdAt' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'createdAt'}
                      direction={orderBy === 'createdAt' ? order : 'asc'}
                      onClick={() => handleRequestSort('createdAt')}
                    >
                      Created At
                      {orderBy === 'createdAt' ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    {enableDel && <IconButton aria-label="delete" size="large" onClick={handleDelRecords}><DeleteIcon /></IconButton>}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recordList && recordList.map((row, index) => {
                  return (
                    <TableRow
                      key={index}
                      hover
                      role="checkbox"
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell align="right">{row.operationResponse}</TableCell>
                      <TableCell align="right">{row.amount}</TableCell>
                      <TableCell align="right">{row.userBalance}</TableCell>
                      <TableCell align="right">{row.createdAt}</TableCell>
                      <TableCell align="right"><Checkbox {...label} onChange={(event) => handleCheck(event, row.id)} /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      }
      {loading && <CircularProgress />}
    </div>
  );
}

export default Records;