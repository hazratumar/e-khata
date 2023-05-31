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
  width: "400px",
  height: "460px",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.2)",
  padding: "20px",
};

export const AddExpenseItem = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  const [formValues, setFormValues] = useState({
    name: "",
    price: "",
    detail: "",
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
        starticon={
          <SvgIcon fontSize="small">
            <PlusIcon />
          </SvgIcon>
        }
        variant="contained"
        onClick={handleOpen}
      >
        Add Expense Item
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
              subheader="Please enter expense item information"
              title="Add Expense Item"
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
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Name" name="name" onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      type="number"
                      fullWidth
                      label="Price"
                      name="price"
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Detail"
                      name="detail"
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
            <CardActions style={{ justifyContent: "space-between", alignItems: "center" }}>
              <Button onClick={handleOpen}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                {isLoading ? "Loading..." : "Add Expense Item"}
              </Button>
            </CardActions>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
