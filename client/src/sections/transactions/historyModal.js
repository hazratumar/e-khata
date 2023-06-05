import React, { useState } from "react";
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
import { AdapterDayjs, LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { getDate, isNotTruthy } from "src/utils/generic-functions";
import { CloudDownload, RotateLeft } from "@material-ui/icons";
import { useDownloadHistoryMutation } from "src/store/services/reportService";
import download from "downloadjs";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "380px",
  maxHeight: "500px",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.2)",
  padding: "20px",
};

export const HistoryModal = () => {
  const startDate = new Date(1 - 1 - 1900);
  const endDate = new Date();

  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    customer: { id: 0, name: "All Customers" },
    currency: { id: 0, abbreviation: "All Currencies" },
    startDate,
    endDate,
  });

  const { customers, currencies } = useSelector((state) => state.option);

  const customersWithAllOption = [{ id: 0, name: "All Customers" }, ...customers];
  const currenciesWithAllOption = [{ id: 0, abbreviation: "All Currencies" }, ...currencies];

  const [getFileUrl, { isLoading }] = useDownloadHistoryMutation();

  const handleOpen = () => {
    if (open) {
      setState({
        customer: { id: 0, name: "All Customers" },
        currency: { id: 0, abbreviation: "All Currencies" },
        startDate,
        endDate,
      });
    }
    setOpen(!open);
  };

  const validateFields = (customer, currency, startDate, endDate) => {
    const validations = [
      [customer, "Please select a customer."],
      [currency, "Please select a currency."],
      [startDate, "Please select a start date."],
      [endDate, "Please select an end date."],
      [startDate <= endDate, "The start date must be before the end date."],
    ];

    for (const [field, errorMessage] of validations) {
      if (isNotTruthy(field)) {
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
      const nextPageUrl = `/history/${customer.id}/${currency.id}/${formattedStartDate}/${formattedEndDate}`;
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

  const onCustomerChange = async (e, value) => {
    setState((prevState) => ({ ...prevState, customer: value }));
  };

  const onCurrencyChange = (e, value) => {
    setState((prevState) => ({ ...prevState, currency: value }));
  };

  return (
    <div>
      <Button onClick={handleOpen}>History</Button>
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
                title="Customer History"
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
                  <Grid item xs={12}>
                    <Autocomplete
                      value={state.customer}
                      getOptionLabel={(option) => option?.name}
                      options={customersWithAllOption}
                      onChange={onCustomerChange}
                      renderInput={(params) => <TextField {...params} label="Customer" />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      value={state.currency}
                      getOptionLabel={(option) => option?.abbreviation}
                      options={currenciesWithAllOption}
                      onChange={onCurrencyChange}
                      renderInput={(params) => <TextField {...params} label="Currency" />}
                    />
                  </Grid>
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
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
                    size="small"
                    startIcon={isLoading ? <RotateLeft /> : <CloudDownload />}
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
