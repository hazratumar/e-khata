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
import { Add, Edit, Close } from "@mui/icons-material";
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

export const BalanceModal = ({ item }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const addBalanceRef = useRef(null);
  const updateBalanceRef = useRef(null);

  const handleSubmit = async () => {
    const balanceRef = item ? updateBalanceRef : addBalanceRef;
    const { data } = await balanceRef.current.saveBalance();
    if (data) {
      handleOpen();
    }
  };

  return (
    <div>
      {item ? (
        <Button onClick={handleOpen}>
          <Edit />
        </Button>
      ) : (
        <Stack direction="row" spacing={2}>
          <Button startIcon={<Add />} variant="contained" onClick={handleOpen}>
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
              subheader={`Please ${item ? "Update" : "enter"} balance information`}
              title={`${item ? "Update" : "Add"} Balance`}
              action={
                <IconButton aria-label="close" onClick={handleOpen}>
                  <Close />
                </IconButton>
              }
              sx={{ width: "100%" }}
            />
            <CardContent sx={{ pt: 0 }}>
              <Box>
                {item ? (
                  <UpdateBalance ref={updateBalanceRef} item={item} />
                ) : (
                  <AddBalance ref={addBalanceRef} />
                )}
              </Box>
            </CardContent>
            <CardActions style={{ justifyContent: "space-between", alignItems: "center" }}>
              <Button onClick={handleOpen}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                {item ? "Update Balance" : "Add Balance"}
              </Button>
            </CardActions>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
