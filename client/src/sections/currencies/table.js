import {
  Box,
  Card,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { useState } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { UpdateCurrency } from "src/sections/currencies/update";
export const CurrenciesTable = (props) => {
  const { count, items = [], onPageChange, onRowsPerPageChange, page, rowsPerPage } = props;
  const options = [5, 10, 25, 50, 100];
  const rowsPerPageOptions = options.filter((option) => option <= count);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Currency</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((currency) => {
                return (
                  <TableRow hover key={currency.id}>
                    <TableCell>
                      <Typography variant="subtitle2">{currency.name}</Typography>
                    </TableCell>
                    <TableCell>{currency.rate}</TableCell>
                    <TableCell>
                      <div>
                        <IconButton onClick={handleClick}>
                          <SvgIcon>
                            <Cog6ToothIcon />
                          </SvgIcon>
                        </IconButton>
                        <Menu
                          id="fade-menu"
                          MenuListProps={{ "aria-labelledby": "fade-button" }}
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                          TransitionComponent={Fade}
                        >
                          <UpdateCurrency currency={currency} />
                          <MenuItem onClick={handleClose}>Transition</MenuItem>
                          <MenuItem onClick={handleClose}>Delete "disable"</MenuItem>
                        </Menu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
      />
    </Card>
  );
};
