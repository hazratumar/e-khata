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
import { UpdateCurrency } from "src/sections/currencies/update";
import { options } from "../../utils/constant";
import moment from "moment";
export const CurrenciesTable = (props) => {
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
                <TableCell>Currency</TableCell>
                <TableCell>Abbreviation</TableCell>
                <TableCell>Recent Updates</TableCell>
                <TableCell>Update</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((currency) => (
                <TableRow hover key={currency.id}>
                  <TableCell>{currency.id}</TableCell>
                  <TableCell>{currency.name}</TableCell>
                  <TableCell>{currency.abbreviation}</TableCell>
                  <TableCell>{moment(currency.updatedAt).fromNow()}</TableCell>
                  <TableCell>
                    <UpdateCurrency currency={currency} />
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
