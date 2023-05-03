import {
  Box,
  Card,
  Fade,
  IconButton,
  Menu,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { useState } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { ViewTransaction } from "./view";
import { AddBuying } from "./buying/stepper";
import { AddSelling } from "./selling/stepper";
import { useDispatch } from "react-redux";
import { storeTransaction, removeTransaction } from "src/store/reducers/transactionSlice";

export const TransactionsTable = (props) => {
  const dispatch = useDispatch();

  const { count, items = [], onPageChange, onRowsPerPageChange, page, rowsPerPage } = props;
  const options = [5, 10, 25, 50, 100];
  const rowsPerPageOptions = options.filter((option) => option <= count);
  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Profit</TableCell>
                <TableCell>Credit Amount</TableCell>
                <TableCell>Debit Amount</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((transaction) => {
                const singleItem = transaction.transactionItem.find(
                  (item) => item.type === (transaction.type === "Sale" ? "Credit" : "Debit")
                );
                const [anchorEl, setAnchorEl] = useState(null);
                const open = Boolean(anchorEl);
                const handleClick = (event) => setAnchorEl(event.currentTarget);
                const handleClose = () => setAnchorEl(null);

                return (
                  <TableRow hover key={transaction.id}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>{transaction?.status}</TableCell>
                    <TableCell>
                      {singleItem?.type &&
                        `${singleItem.type} from ${singleItem.from?.name} to ${singleItem.to?.name}`}
                    </TableCell>
                    <TableCell>{singleItem?.currency?.name}</TableCell>
                    <TableCell>{singleItem?.rate}</TableCell>
                    <TableCell>{singleItem?.profit}</TableCell>
                    <TableCell>{singleItem?.type === "Debit" ? singleItem?.amount : 0}</TableCell>
                    <TableCell>{singleItem?.type === "Credit" ? singleItem?.amount : 0}</TableCell>
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
                          {transaction.type === "Sale" && (
                            <AddSelling
                              update={true}
                              id={transaction.id}
                              type={transaction.type}
                              status={transaction.status}
                            />
                          )}
                          {transaction.type === "Buy" && (
                            <AddBuying
                              update={true}
                              id={transaction.id}
                              type={transaction.type}
                              status={transaction.status}
                            />
                          )}
                          <ViewTransaction transaction={transaction} />
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
