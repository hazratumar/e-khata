import React, { useState } from "react";
import {
  Button,
  Fade,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Modal,
  FormControl,
  CardActions,
  Autocomplete,
  Grid,
  TextField,
  Stack,
} from "@mui/material";

import { Close } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { getDate, isNotTruthy, getProjectStartDate } from "src/utils/generic-functions";
import { CloudDownload, RotateLeft } from "@mui/icons-material";
import { useDownloadKhataMutation } from "src/store/services/reportService";
import { useCustomerKhataMutation } from "src/store/services/customerService";
import download from "downloadjs";
import { useEffect } from "react";

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

export const KhataModal = () => {
  const startDate = getProjectStartDate();
  const endDate = new Date();

  const [disabled, setDisabled] = useState(true);
  const [currencies, setCurrencies] = useState([]);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    customer: null,
    currency: null,
    startDate,
    endDate,
  });

  const { customers } = useSelector((state) => state.option);
  const [getFileUrl, { isLoading }] = useDownloadKhataMutation();
  const [getCustomerKhata, { data }] = useCustomerKhataMutation();

  const handleOpen = () => {
    if (open) {
      setState({
        customer: null,
        currency: null,
        startDate,
        endDate,
      });
      setDisabled(true);
      setCurrencies([]);
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
      const nextPageUrl = `/khata/${customer.id}/${currency.id}/${formattedStartDate}/${formattedEndDate}`;
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
    await setCurrencies([]);
    setState((prevState) => ({ ...prevState, customer: value }));

    getCustomerKhata(value?.id);
  };

  const onCurrencyChange = (e, value) => {
    setState((prevState) => ({ ...prevState, currency: value }));
  };

  useEffect(() => {
    setDisabled(false);
    setCurrencies(data);
  }, [data]);

  return (
    <div>
      <Button onClick={handleOpen}>Khata</Button>
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
                title="Customer Khata"
                action={
                  <IconButton aria-label="close" onClick={handleOpen}>
                    <Close />
                  </IconButton>
                }
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Autocomplete
                      disableClearable={true}
                      getOptionLabel={(option) => option?.name || ""}
                      options={customers}
                      onChange={onCustomerChange}
                      renderInput={(params) => <TextField {...params} label="Customer" />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      disabled={disabled}
                      getOptionLabel={(option) => option?.abbreviation || ""}
                      options={currencies}
                      onChange={onCurrencyChange}
                      renderInput={(params) => <TextField {...params} label="Khata" />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <DatePicker
                        label="Start Date"
                        value={state?.startDate}
                        onChange={onStartDateChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <DatePicker
                        label="End Date"
                        value={state?.endDate}
                        onChange={onEndDateChange}
                      />
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
