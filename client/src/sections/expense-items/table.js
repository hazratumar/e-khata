import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { UpdateExpenseItem } from "src/sections/expense-items/update";
import moment from "moment";
import { options } from "src/utils/constant";
export const ExpenseItemsTable = (props) => {
  const { count, items = [], onPageChange, onRowsPerPageChange, page, rowsPerPage } = props;
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
                <TableCell>Recent Updates</TableCell>
                <TableCell>Update</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((expenseItem) => {
                return (
                  <TableRow hover key={expenseItem.id}>
                    <TableCell>{expenseItem.id}</TableCell>
                    <TableCell>{expenseItem.name}</TableCell>
                    <TableCell>{expenseItem.price}</TableCell>
                    <TableCell>{expenseItem.detail}</TableCell>
                    <TableCell>{moment(expenseItem.updatedAt).fromNow()}</TableCell>
                    <TableCell>
                      <UpdateExpenseItem expenseItem={expenseItem} />
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
