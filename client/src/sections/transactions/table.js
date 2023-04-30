import {
  Box,
  Card,
  Divider,
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
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { Fragment, useState } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { UpdateTransaction } from "src/sections/transactions/update";
import { useAllCustomersQuery } from "src/store/services/customerService";
import { useAllCurrenciesQuery } from "src/store/services/currencyService";

export const TransactionsTable = (props) => {
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
  const { data: customerOptions } = useAllCustomersQuery();
  const { data: currencyOptions } = useAllCurrenciesQuery();
  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Profit</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            {/* <TableBody>
              {items.map((transaction) => {
                return (
                  <TableRow hover key={transaction.id}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{transaction.debitFrom.name}</TableCell>
                    <TableCell>{transaction.debitTo.name}</TableCell>
                    <TableCell>{transaction.currency.name}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>{transaction.rate}</TableCell>
                    <TableCell>{transaction.profit}</TableCell>
                    <TableCell>
                      {transaction.credits.map((item, index) => (
                        <Fragment key={item.id}>
                          {customerOptions.find((i) => i.id === item.creditFrom)?.name}
                          {index < transaction.credits.length - 1 && <Divider />}
                        </Fragment>
                      ))}
                    </TableCell>
                    <TableCell>
                      {transaction.credits.map((item, index) => (
                        <Fragment key={item.id}>
                          {customerOptions.find((i) => i.id === item.creditTo)?.name}
                          {index < transaction.credits.length - 1 && <Divider />}
                        </Fragment>
                      ))}
                    </TableCell>
                    <TableCell>
                      {transaction.credits.map((item, index) => (
                        <Fragment key={item.id}>
                          {currencyOptions.find((i) => i.id === item.currency)?.name}
                          {index < transaction.credits.length - 1 && <Divider />}
                        </Fragment>
                      ))}
                    </TableCell>
                    <TableCell>
                      {transaction.credits.map((item, index) => (
                        <Fragment key={item.id}>
                          {item.amount}
                          {index < transaction.credits.length - 1 && <Divider />}
                        </Fragment>
                      ))}
                    </TableCell>
                    <TableCell>{transaction.status}</TableCell>
                    <TableCell>
                      <div>
                        <IconButton onClick={handleClick}>
                          <SvgIcon>
                            <Cog6ToothIcon />
                          </SvgIcon>
                        </IconButton>
                        <Menu
                          id="fade-menu"
                          MenuListProps={{
                            "aria-labelledby": "fade-button",
                          }}
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                          TransitionComponent={Fade}
                        >
                          <UpdateTransaction transaction={transaction} />
                          <MenuItem onClick={handleClose}>Transition</MenuItem>
                          <MenuItem onClick={handleClose}>Delete "disable"</MenuItem>
                        </Menu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody> */}
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
