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
  ArrowsUpDownIcon,
} from "@heroicons/react/24/solid";
import { useRef, useState } from "react";
import { AddBalance } from "./add";
import { UpdateBalance } from "./update";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "550px",
  maxHeight: "500px",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.2)",
  padding: "10px",
};

export const BalanceModal = ({ balanceId }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const addBalanceRef = useRef(null);
  const updateBalanceRef = useRef(null);

  const handleSubmit = async () => {
    const balanceRef = balanceId ? updateBalanceRef : addBalanceRef;
    const { data } = await balanceRef.current.saveBalance();
    if (data) {
      handleOpen();
    }
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
                <ArrowsUpDownIcon />
              </SvgIcon>
            }
            variant="contained"
            onClick={handleOpen}
          >
            Add Balance
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
              title={`${balanceId ? "Update" : "Add"} Balance`}
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
              <Box>
                {balanceId ? (
                  <UpdateBalance ref={updateBalanceRef} balanceId={balanceId} />
                ) : (
                  <AddBalance ref={addBalanceRef} />
                )}
              </Box>
            </CardContent>
            <CardActions style={{ justifyContent: "space-between", alignItems: "center" }}>
              <Button onClick={handleOpen}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                {balanceId ? "Update Balance" : "Add Balance"}
              </Button>
            </CardActions>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
