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
import { BalanceModal } from "./modal";
import moment from "moment";
import { options } from "src/utils/constant";
import { getNewUpdate } from "src/utils/generic-functions";
import { formatTwoDecimals } from "src/utils/generic-functions";

export const BalanceTable = (props) => {
  const { count, items = [], onPageChange, onRowsPerPageChange, page, rowsPerPage } = props;
  const rowsPerPageOptions = options.filter((option) => option <= count);

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Recent Updates</TableCell>
                <TableCell>Update</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow hover key={item.id}>
                  <TableCell>{item?.id}</TableCell>
                  <TableCell>{item?.customer?.name}</TableCell>
                  <TableCell>
                    <Badge
                      badgeContent={item?.type}
                      color={item?.type === "Withdraw" ? "error" : "primary"}
                    />
                  </TableCell>
                  <TableCell>{item?.transaction?.currency?.abbreviation}</TableCell>
                  <TableCell>{formatTwoDecimals(item?.transaction?.amount)}</TableCell>
                  <TableCell>
                    {moment(getNewUpdate(item?.updatedAt, item?.transaction?.updatedAt)).fromNow()}
                  </TableCell>
                  <TableCell>
                    <BalanceModal item={item} />
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
