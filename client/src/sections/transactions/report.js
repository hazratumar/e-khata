import React, { useEffect, useState } from "react";
import {
  Button,
  Fade,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  SvgIcon,
  Modal,
  FormControl,
  CardActions,
  Autocomplete,
  Grid,
  TextField,
  Stack,
} from "@mui/material";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { Summarize } from "@mui/icons-material";
import { AdapterDayjs, LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { getDate, validate } from "src/utils/generic-functions";
import { CloudDownload, Downloading } from "@mui/icons-material";
import { useDownloadReportMutation } from "src/store/services/printerService";
import download from "downloadjs";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  maxHeight: "80vh",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.2)",
  padding: "20px",
  overflowY: "auto",
};

export const ReportModal = () => {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    customer: null,
    currency: null,
    startDate: null,
    endDate: null,
  });

  const { customers, currencies } = useSelector((state) => state.option);
  const [getFileUrl, { isSuccess, isLoading }] = useDownloadReportMutation();

  const handleOpen = () => setOpen(!open);

  const validateFields = (customer, currency, startDate, endDate) => {
    const validations = [
      [customer, "Please select a customer."],
      [currency, "Please select a currency."],
      [startDate, "Please select a start date."],
      [endDate, "Please select an end date."],
      [startDate <= endDate, "The start date must be before the end date."],
    ];

    for (const [field, errorMessage] of validations) {
      if (!validate(field)) {
        toast.error(errorMessage);
        return false;
      }
    }

    return true;
  };

  const onViewReport = () => {
    const { customer, currency, startDate, endDate } = state;

    if (validateFields(customer, currency, startDate, endDate)) {
      const formattedStartDate = getDate(startDate);
      const formattedEndDate = getDate(endDate);
      const nextPageUrl = `/report/${customer.id}/${currency.id}/${formattedStartDate}/${formattedEndDate}`;
      window.open(nextPageUrl, "_blank");
    }
  };

  const onDownloadReport = async () => {
    const { customer, currency, startDate, endDate } = state;

    if (validateFields(customer, currency, startDate, endDate)) {
      const params = {
        customer: customer.id,
        currency: currency.id,
        startDate: getDate(startDate),
        endDate: getDate(endDate),
      };

      try {
        const url = (await getFileUrl(params)).data.url;
        download(url);
      } catch (error) {
        toast.error("File downloading error:", error);
      }
    }
  };

  const onStartDateChange = (date) => {
    setState((prevState) => ({ ...prevState, startDate: date }));
  };

  const onEndDateChange = (date) => {
    setState((prevState) => ({ ...prevState, endDate: date }));
  };

  return (
    <div>
      <Button startIcon={<Summarize />} onClick={handleOpen}>
        Report
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleOpen}
        closeAfterTransition
      >
        <Fade in={open}>
          <Box sx={style}>
            <Card>
              <CardHeader
                title="Customer Report"
                action={
                  <IconButton aria-label="close" onClick={handleOpen}>
                    <SvgIcon fontSize="small">
                      <XMarkIcon />
                    </SvgIcon>
                  </IconButton>
                }
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      getOptionLabel={(option) => option.name}
                      options={customers}
                      onChange={(event, value) => setState({ ...state, customer: value })}
                      renderInput={(params) => <TextField {...params} label="Customer" />}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      getOptionLabel={(option) => option.abbreviation}
                      options={currencies}
                      onChange={(event, value) => setState({ ...state, currency: value })}
                      renderInput={(params) => <TextField {...params} label="Currency" />}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Start Date"
                          value={state?.startDate}
                          onChange={onStartDateChange}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="End Date"
                          value={state?.endDate}
                          onChange={onEndDateChange}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions sx={{ justifyContent: "space-between" }}>
                <Button onClick={handleOpen}>Cancel</Button>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={isLoading ? <Downloading /> : <CloudDownload />}
                    onClick={onDownloadReport}
                  >
                    {isLoading ? "Downloading..." : "Download"}
                  </Button>
                  <Box ml={1}>
                    <Button variant="contained" color="primary" onClick={onViewReport}>
                      View
                    </Button>
                  </Box>
                </Stack>
              </CardActions>
            </Card>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
