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

export const DebitTable = ({ items }) => {
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
            {/* {items?.map((item, index) => ( */}
            <TableRow>
              <TableCell>gdf</TableCell>
              <TableCell>gdf</TableCell>
              <TableCell>gdf</TableCell>
              <TableCell>fg</TableCell>
              <TableCell>gd</TableCell>
              <TableCell>
                <IconButton color="error">
                  <SvgIcon>
                    <TrashIcon />
                  </SvgIcon>
                </IconButton>
              </TableCell>
            </TableRow>
            {/* ))} */}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};
