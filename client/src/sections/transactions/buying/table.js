import {
  Grid,
  IconButton,
  Paper,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useAllCustomersQuery } from "src/store/services/customerService";
import { useAllCurrenciesQuery } from "src/store/services/currencyService";

export const CreditTable = ({ items, deleteItem }) => {
  const { data: customerOptions } = useAllCustomersQuery();
  const { data: currencyOptions } = useAllCurrenciesQuery();
  return (
    <Grid item xs={12} md={12} lg={12}>
      <TableContainer component={Paper} sx={{ height: "35vh" }}>
        <Table>
          <TableHead sx={{ position: "sticky", top: 0 }}>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index + 1}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{customerOptions.find((i) => i.id === item.creditFrom)?.name}</TableCell>
                <TableCell>{customerOptions.find((i) => i.id === item.creditTo)?.name}</TableCell>
                <TableCell> {currencyOptions.find((i) => i.id === item.currency)?.name}</TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => deleteItem(index)}>
                    <SvgIcon>
                      <TrashIcon />
                    </SvgIcon>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};
