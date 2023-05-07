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
} from "@mui/material";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
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
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>

      <Button
        starticon={
          <SvgIcon fontSize="small">
            <PlusIcon />
          </SvgIcon>
        }
        variant="contained"
        onClick={handleOpen}
      >
        Add Transacion
      </Button>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
      >
        <Fade in={open}>
          <Box sx={{ ...style, overflowY: "auto" }}>
            <CardHeader
              subheader="Please enter trasaction information"
              title="Add Trasaction"
              action={
                <IconButton aria-label="close" onClick={handleClose}>
                  <SvgIcon fontSize="small">
                    <XMarkIcon />
                  </SvgIcon>
                </IconButton>
              }
              sx={{ width: "100%", padding: "10px" }}
            />
            <CardContent>
              <Grid container direction="row" spacing={2}>
                <Box sx={{ width: "100%" }}>
                  <AddTransaction />
                </Box>
              </Grid>
            </CardContent>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
