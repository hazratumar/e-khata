import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import {
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  SvgIcon,
  TextField,
} from "@mui/material";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useAddExpenseItemMutation } from "src/store/services/expenseItemService";
import toast from "react-hot-toast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.2)",
  padding: "10px",
};

export const AddExpenseItem = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  const [formValues, setFormValues] = useState({
    name: "",
    rate: "",
  });

  const [AddExpenseItem, { isSuccess, isLoading, error }] = useAddExpenseItemMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await AddExpenseItem(formValues);
  };

  useEffect(() => {
    if (isSuccess) {
      handleOpen();
      console.log("Add data", formValues);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      const errorMessage = Array.isArray(error.data?.message)
        ? error.data.message[0]
        : error.data?.message;
      toast.error(errorMessage);
      console.log("Error Message", error);
    }
  }, [error]);

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
        Add ExpenseItem
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
              subheader="Please enter expenseItem information"
              title="Add ExpenseItem"
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
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="Name"
                      name="name"
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Rate" name="rate" onChange={handleChange} />
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
            <CardActions style={{ justifyContent: "space-between", alignItems: "center" }}>
              <Button onClick={handleOpen}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                {isLoading ? "Loading..." : "Add ExpenseItem"}
              </Button>
            </CardActions>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
