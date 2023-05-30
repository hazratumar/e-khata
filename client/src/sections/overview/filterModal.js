import React, { useState } from "react";
import {
  Button,
  Fade,
  Box,
  CardContent,
  CardHeader,
  IconButton,
  SvgIcon,
  Modal,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  CardActions,
} from "@mui/material";

import { XMarkIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import { AdapterDayjs, LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getDateRange, getCustomDate } from "src/utils/generic-functions";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  height: "80vh",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.2)",
  padding: "20px",
};

export const FilterModal = ({ filterDashboard }) => {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState("static");
  const [selectedOption, setSelectedOption] = useState(1);
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleApplyFilter = () => {
    const dateRange =
      selection === "static"
        ? getDateRange(selectedOption)
        : getCustomDate(customStartDate, customEndDate);
    filterDashboard(dateRange);
    handleOpen();
  };

  const onCustomStartDateChange = (date) => {
    setCustomStartDate(date);
  };

  const onCustomEndDateChange = (date) => {
    setCustomEndDate(date);
  };

  const onSelection = (event) => {
    setSelection(event.target.value);
  };

  return (
    <div>
      <Button onClick={handleOpen}>
        <SvgIcon>
          <AdjustmentsHorizontalIcon />
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
                  <RadioGroup
                    aria-label="date-option"
                    value={selection}
                    name="date-option"
                    onChange={onSelection}
                  >
                    <FormControlLabel value="static" control={<Radio />} label="Static Date" />
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <InputLabel id="demo-simple-select-label">Date Range</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedOption}
                        label="Date Range"
                        onChange={handleOptionChange}
                        sx={{ minWidth: "120px" }}
                      >
                        <MenuItem value={1}>Today</MenuItem>
                        <MenuItem value={7}>Last 7 Days</MenuItem>
                        <MenuItem value={30}>Last 30 Days</MenuItem>
                        <MenuItem value={365}>Last Year</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControlLabel value="custom" control={<Radio />} label="Custom Date" />
                    <Box>
                      <FormControl fullWidth sx={{ mt: 2 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker value={customStartDate} onChange={onCustomStartDateChange} />
                        </LocalizationProvider>
                      </FormControl>
                      <FormControl fullWidth sx={{ mt: 2 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker value={customEndDate} onChange={onCustomEndDateChange} />
                        </LocalizationProvider>
                      </FormControl>
                    </Box>
                  </RadioGroup>
                </FormControl>
              </Box>
            </CardContent>
            <CardActions style={{ justifyContent: "space-between" }}>
              <Button onClick={handleOpen}>Cancel</Button>
              <Button variant="contained" color="primary" onClick={handleApplyFilter}>
                Apply Filter
              </Button>
            </CardActions>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
