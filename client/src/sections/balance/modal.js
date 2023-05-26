import {
  CardContent,
  Button,
  Fade,
  Box,
  CardHeader,
  IconButton,
  SvgIcon,
  Modal,
  CardActions,
  Stack,
} from "@mui/material";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useRef, useState } from "react";
import { DepositBalance } from "./deposit";
import { UpdateBalance } from "./update";
import { WithdrawBalance } from "./withdraw";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  height: "85vh",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.2)",
  padding: "20px",
};

export const BalanceModal = ({ balanceId }) => {
  const [modalType, setModalType] = useState();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const depositBalanceRef = useRef(null);
  const withdrawBalanceRef = useRef(null);
  const updateBalanceRef = useRef(null);

  const handleSubmit = async () => {
    const balanceRef = balanceId
      ? updateBalanceRef
      : modalType === "deposit"
      ? depositBalanceRef
      : withdrawBalanceRef;
    const { data } = await balanceRef.current.saveBalance();
    if (data) {
      handleOpen();
    }
  };
  const handleDepositOpen = () => {
    setModalType("deposit");
    handleOpen();
  };
  const handleWithdrawOpen = () => {
    setModalType("withdraw");
    handleOpen();
  };
  return (
    <div>
      {balanceId ? (
        <Button onClick={handleOpen}>
          <SvgIcon fontSize="small">
            <PencilSquareIcon />
          </SvgIcon>
        </Button>
      ) : (
        <Stack direction="row" spacing={2}>
          <Button
            startIcon={
              <SvgIcon fontSize="small">
                <ArrowDownTrayIcon />
              </SvgIcon>
            }
            variant="contained"
            onClick={handleDepositOpen}
          >
            Deposit
          </Button>
          <Button
            startIcon={
              <SvgIcon fontSize="small">
                <ArrowUpTrayIcon />
              </SvgIcon>
            }
            variant="contained"
            onClick={handleWithdrawOpen}
          >
            Withdraw
          </Button>
        </Stack>
      )}

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleOpen}
        closeAfterTransition
      >
        <Fade in={open}>
          <Box sx={{ ...style, overflowY: "auto" }}>
            <CardHeader
              subheader={`Please ${balanceId ? "Update" : "enter"} balance information`}
              title={`${
                balanceId ? "Update" : modalType === "deposit" ? "Deposit" : "Withdraw"
              } Balance`}
              action={
                <IconButton aria-label="close" onClick={handleOpen}>
                  <SvgIcon fontSize="small">
                    <XMarkIcon />
                  </SvgIcon>
                </IconButton>
              }
              sx={{ width: "100%" }}
            />
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ m: -1.5 }}>
                {balanceId ? (
                  <UpdateBalance ref={updateBalanceRef} balanceId={balanceId} />
                ) : modalType === "deposit" ? (
                  <DepositBalance ref={depositBalanceRef} />
                ) : (
                  <WithdrawBalance ref={withdrawBalanceRef} />
                )}
              </Box>
            </CardContent>
            <CardActions style={{ justifyContent: "space-between", alignItems: "center" }}>
              <Button onClick={handleOpen}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                {balanceId
                  ? "Update Balance"
                  : modalType === "deposit"
                  ? "Deposit Balance"
                  : "Withdraw Balance"}
              </Button>
            </CardActions>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
