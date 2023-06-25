import {
  CardContent,
  Button,
  Fade,
  Box,
  CardHeader,
  IconButton,
  Modal,
  CardActions,
} from "@mui/material";
import { Add, Edit, Close } from "@mui/icons-material";
import { useRef, useState } from "react";
import { AddTransaction } from "./add";
import { UpdateTransaction } from "./update";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "500px",
  height: "550px",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.2)",
  padding: "20px",
};

export const TransactionModal = ({ transactionId }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const addTransactionRef = useRef(null);
  const updateTransactionRef = useRef(null);

  const handleSubmit = async () => {
    const transactionRef = transactionId ? updateTransactionRef : addTransactionRef;
    const { data } = await transactionRef.current.saveTransaction();
    if (data) {
      handleOpen();
    }
  };

  return (
    <div>
      {transactionId ? (
        <Button onClick={handleOpen}>
          <Edit />
        </Button>
      ) : (
        <Button startIcon={<Add />} variant="contained" onClick={handleOpen}>
          Add Transaction
        </Button>
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
              subheader={`Please ${transactionId ? "Update" : "enter"} transaction information`}
              title={`${transactionId ? "Update" : "Add"} Transaction`}
              action={
                <IconButton aria-label="close" onClick={handleOpen}>
                  <Close />
                </IconButton>
              }
              sx={{ width: "100%" }}
            />
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ m: -1.5 }}>
                {transactionId ? (
                  <UpdateTransaction ref={updateTransactionRef} transactionId={transactionId} />
                ) : (
                  <AddTransaction ref={addTransactionRef} />
                )}
              </Box>
            </CardContent>
            <CardActions style={{ justifyContent: "space-between", alignItems: "center" }}>
              <Button onClick={handleOpen}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                {transactionId ? "Update Transaction" : "Add Transaction"}
              </Button>
            </CardActions>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
