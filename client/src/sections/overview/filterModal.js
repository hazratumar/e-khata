import React, { useState } from "react";
import {
  CardContent,
  Button,
  Fade,
  Box,
  CardHeader,
  IconButton,
  SvgIcon,
  Modal,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  CardActions,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { CalendarDaysIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  height: "70vh",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.2)",
  padding: "20px",
};

export const FilterModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  return (
    <div>
      <Button onClick={handleOpen}>
        <SvgIcon>
          <CalendarDaysIcon />
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
              subheader="Please provide the starting and ending dates."
              title="Filter Options"
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
                <FormControl component="fieldset">
                  <RadioGroup aria-label="date-option" defaultValue="static" name="date-option">
                    <FormControlLabel value="static" control={<Radio />} label="Select Option" />
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <InputLabel id="demo-simple-select-label">Date Range</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Date Range"
                        sx={{ minWidth: "120px" }}
                      >
                        <MenuItem value={1}>Today</MenuItem>
                        <MenuItem value={7}>Last 7 Days</MenuItem>
                        <MenuItem value={30}>Last 30 Days</MenuItem>
                        <MenuItem value={365}>Last Year</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControlLabel value="custom" control={<Radio />} label="Custom Date" />
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker />
                      </LocalizationProvider>
                    </FormControl>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker />
                      </LocalizationProvider>
                    </FormControl>
                  </RadioGroup>
                </FormControl>
              </Box>
            </CardContent>
            <CardActions style={{ justifyContent: "flex-end" }}>
              <Button onClick={handleOpen}>Cancel</Button>
              <Button variant="contained" color="primary">
                Apply Filter
              </Button>
            </CardActions>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
