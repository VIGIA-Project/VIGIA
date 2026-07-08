import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

export interface Column<T> {
  id: string;
  label: string;
  render: (row: T) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'right' | 'center';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  searchPlaceholder?: string;
  searchKeys?: (row: T) => string;
  initialRowsPerPage?: number;
  onRowClick?: (row: T) => void;
  rowActions?: (row: T) => { icon: React.ReactNode; label: string; onClick: (row: T) => void; color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }[];
  headerActions?: React.ReactNode;
}

export default function DataTable<T extends { id: string | number }>({
  columns,
  rows,
  searchPlaceholder = 'Buscar...',
  searchKeys,
  initialRowsPerPage = 10,
  onRowClick,
  rowActions,
  headerActions,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const filtered = useMemo(() => {
    if (!search || !searchKeys) return rows;
    const q = search.toLowerCase();
    return rows.filter((r) => searchKeys(r).toLowerCase().includes(q));
  }, [rows, search, searchKeys]);

  const paged = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage],
  );

  return (
    <Paper sx={{ border: '1px solid rgba(13, 92, 207, 0.08)', borderRadius: 2, overflow: 'hidden' }}>
      {(searchKeys || headerActions) && (
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(13, 92, 207, 0.06)', display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          {searchKeys && (
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              sx={{ width: { xs: '100%', sm: 320 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />
          )}
          <Box sx={{ flexGrow: 1 }} />
          {headerActions}
        </Box>
      )}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.id} align={col.align} sx={{ width: col.width }}>
                  {col.label}
                </TableCell>
              ))}
              {rowActions && <TableCell align="right" sx={{ width: 120 }}>Acciones</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (rowActions ? 1 : 0)} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No hay registros para mostrar
                </TableCell>
              </TableRow>
            ) : (
              paged.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  sx={{ cursor: onRowClick ? 'pointer' : 'default', '&:last-child td': { border: 0 } }}
                >
                  {columns.map((col) => (
                    <TableCell key={col.id} align={col.align}>
                      {col.render(row)}
                    </TableCell>
                  ))}
                  {rowActions && (
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                        {rowActions(row).map((action, i) => (
                          <Tooltip key={i} title={action.label}>
                            <IconButton
                              size="small"
                              color={action.color || 'default'}
                              onClick={() => action.onClick(row)}
                            >
                              {action.icon}
                            </IconButton>
                          </Tooltip>
                        ))}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
      />
    </Paper>
  );
}
