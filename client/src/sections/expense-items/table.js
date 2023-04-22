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
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { useState } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { UpdateExpenseItem } from "src/sections/expense-items/update";
export const ExpenseItemsTable = (props) => {
  const { count, items = [], onPageChange, onRowsPerPageChange, page, rowsPerPage } = props;
  console.log(items);
  const options = [5, 10, 25, 50, 100];
  const rowsPerPageOptions = options.filter((option) => option <= count);

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Serial No</TableCell>
                <TableCell>Expense Item</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Detail</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((expenseItem) => {
                const [anchorEl, setAnchorEl] = useState(null);
                const open = Boolean(anchorEl);
                const handleClick = (event) => {
                  setAnchorEl(event.currentTarget);
                };
                const handleClose = () => {
                  setAnchorEl(null);
                };
                return (
                  <TableRow hover key={expenseItem.id}>
                    <TableCell>{expenseItem.id}</TableCell>
                    <TableCell>{expenseItem.name}</TableCell>
                    <TableCell>{expenseItem.price}</TableCell>
                    <TableCell>{expenseItem.detail}</TableCell>
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
                          <UpdateExpenseItem expenseItem={expenseItem} />
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
