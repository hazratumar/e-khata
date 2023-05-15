import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import {
  Badge,
  Box,
  Card,
  IconButton,
  MenuItem,
  Popover,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import { Scrollbar } from "src/components/scrollbar";
import { BalanceModal } from "./modal";
import moment from "moment";

export const BalanceTable = (props) => {
  const { count, items = [], onPageChange, onRowsPerPageChange, page, rowsPerPage } = props;
  const options = [5, 10, 25, 50, 100];
  const rowsPerPageOptions = options.filter((option) => option <= count);

  const [anchorElArr, setAnchorElArr] = useState(items.map(() => null));

  const handleClick = (event, index) => {
    const newAnchorElArr = [...anchorElArr];
    newAnchorElArr[index] = event.currentTarget;
    setAnchorElArr(newAnchorElArr);
  };

  const handleClose = (index) => {
    const newAnchorElArr = [...anchorElArr];
    newAnchorElArr[index] = null;
    setAnchorElArr(newAnchorElArr);
  };
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
                <TableCell>Updated</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
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
                  <TableCell>{item?.transaction?.amount}</TableCell>
                  <TableCell>{moment(item.updatedAt).fromNow()}</TableCell>
                  <TableCell>
                    <div>
                      <IconButton onClick={(event) => handleClick(event, index)}>
                        <SvgIcon>
                          <Cog6ToothIcon />
                        </SvgIcon>
                      </IconButton>
                      <Popover
                        open={Boolean(anchorElArr[index])}
                        anchorEl={anchorElArr[index]}
                        onClose={() => handleClose(index)}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                      >
                        <BalanceModal balanceId={item?.id} />
                        <MenuItem onClick={() => handleClose(index)}>Balance</MenuItem>
                      </Popover>
                    </div>
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
