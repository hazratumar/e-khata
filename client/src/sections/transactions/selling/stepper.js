import {
  CardContent,
  Button,
  Fade,
  Modal,
  Box,
  CardHeader,
  Grid,
  IconButton,
  Stepper,
  SvgIcon,
  Step,
  StepLabel,
  Stack,
  MenuItem,
} from "@mui/material";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useRef, useState } from "react";
import { AddCredit } from "./credit";
import { AddDebit } from "./debit";
import { useDispatch } from "react-redux";
import { storeTransaction, removeTransaction } from "src/store/reducers/transactionSlice";
import { Done } from "./done";
const steps = ["Add Credits", "Add Debits", "Done"];

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

export const AddSelling = (props) => {
  const { update, id, type, status } = props;

  const dispatch = useDispatch();
  const creditRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleOpen = async () => {
    (await update) && dispatch(storeTransaction({ isCreated: true, id, type, status }));
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    resetFrom();
  };
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = async () => {
    if (activeStep === 0) {
      const isSuccess = await creditRef.current.saveCredit();
      if (isSuccess) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
    if (activeStep === 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    if (activeStep === 2) {
      handleOpen();
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const resetFrom = () => {
    setActiveStep(0);
    dispatch(removeTransaction());
  };

  return (
    <div>
      {update ? (
        <MenuItem
          starticon={
            <SvgIcon fontSize="small">
              <PlusIcon />
            </SvgIcon>
          }
          variant="contained"
          onClick={handleOpen}
        >
          Update
        </MenuItem>
      ) : (
        <Button
          starticon={
            <SvgIcon fontSize="small">
              <PlusIcon />
            </SvgIcon>
          }
          variant="contained"
          onClick={handleOpen}
        >
          Sale
        </Button>
      )}
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
              subheader={`Please ${update ? "update" : "enter"} Selling information`}
              title={`${update ? "Update" : "Add"} Selling`}
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
                  <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                      const stepProps = {};
                      const labelProps = {};
                      return (
                        <Step key={label} {...stepProps}>
                          <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                      );
                    })}
                  </Stepper>
                  <Stack sx={{ mt: 2 }}>
                    {activeStep === 0 && <AddCredit ref={creditRef} />}
                    {activeStep === 1 && <AddDebit />}
                    {activeStep === 2 && <Done resetFrom={resetFrom} handleOpen={handleOpen} />}
                  </Stack>
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Button onClick={handleNext}>
                      {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </CardContent>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
