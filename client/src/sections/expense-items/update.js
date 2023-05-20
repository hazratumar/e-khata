import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  MenuItem,
  SvgIcon,
  TextField,
} from "@mui/material";
import { PencilSquareIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useUpdateExpenseItemMutation } from "src/store/services/expenseItemService";
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

export const UpdateExpenseItem = (props) => {
  const { expenseItem } = props;
  console.log(expenseItem);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
    setState((prevValues) => ({
      ...prevValues,
      id: expenseItem.id,
      name: expenseItem.name,
      price: expenseItem.price,
      detail: expenseItem.detail,
    }));
  };

  const [state, setState] = useState({
    id: expenseItem.id,
    name: expenseItem.name,
    price: expenseItem.price,
    detail: expenseItem.detail,
  });
  const [UpdateExpenseItem, { isSuccess, isLoading, error }] = useUpdateExpenseItemMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await UpdateExpenseItem(state);
  };

  useEffect(() => {
    if (isSuccess) {
      handleOpen();
      console.log("Update data", state);
    }
    if (error) {
      const errorMessage = Array.isArray(error.data?.message)
        ? error.data.message[0]
        : error.data?.message;
      toast.error(errorMessage);
      console.log("Error Message", error);
    }
  }, [isSuccess, error]);
  return (
    <div>
      <Button onClick={handleOpen}>
        <SvgIcon fontSize="small">
          <PencilSquareIcon />
        </SvgIcon>
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
              subheader="Please update expense item information"
              title="Update Expense Item"
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
                      value={state.name}
                      label="Name"
                      name="name"
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      type="number"
                      fullWidth
                      value={state.price}
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
                      value={state.detail}
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
                {isLoading ? "Loading..." : "Update ExpenseItem"}
              </Button>
            </CardActions>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
