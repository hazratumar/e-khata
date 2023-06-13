import {
  Badge,
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
import { UpdateCustomer } from "src/sections/customers/update";
import { options } from "../../utils/constant";
import moment from "moment";
import { ViewCustomer } from "./view";

export const CustomersTable = (props) => {
  const { count, items = [], onPageChange, onRowsPerPageChange, page, rowsPerPage } = props;
  const rowsPerPageOptions = options.filter((option) => option <= count);

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>FullName</TableCell>
                <TableCell>Nickname</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Recent Updates</TableCell>
                <TableCell>Update</TableCell>
                <TableCell>View</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((customer) => (
                <TableRow hover key={customer.id}>
                  <TableCell>{customer.id}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.nickname}</TableCell>
                  <TableCell>
                    {customer.isSelf ? (
                      <Badge badgeContent={"Self"} color={"primary"} />
                    ) : (
                      <Badge badgeContent={"Other"} color={"secondary"} />
                    )}
                  </TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>{moment(customer.updatedAt).fromNow()}</TableCell>
                  <TableCell>
                    <UpdateCustomer customer={customer} />
                  </TableCell>
                  <TableCell>
                    <ViewCustomer id={customer.id} />
                  </TableCell>
                </TableRow>
              ))}
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
