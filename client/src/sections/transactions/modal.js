import {
  CardContent,
  Button,
  Fade,
  Box,
  CardHeader,
  Grid,
  IconButton,
  SvgIcon,
  MenuItem,
  Modal,
  CardActions,
} from "@mui/material";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useRef, useState } from "react";
import { AddTransaction } from "./add";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  height: "90vh",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.2)",
  padding: "20px",
};

export const TransactionModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const addTransactionRef = useRef(null);

  const handleSubmit = () => {
    addTransactionRef.current.saveTransaction()
  };

  return (
    <div>
      <Button
        startIcon={
          <SvgIcon fontSize="small">
            <PlusIcon />
          </SvgIcon>
        }
        variant="contained"
        onClick={handleOpen}
      >
        Add Customer
      </Button>
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
              subheader="Please enter customer information"
              title="Add Customer"
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
                <AddTransaction ref={addTransactionRef} />
              </Box>
            </CardContent>
            <CardActions
              style={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Button onClick={handleOpen}>Cancel</Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
              >
                Add Transaction
              </Button>
            </CardActions>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};