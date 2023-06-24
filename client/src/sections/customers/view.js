import React, { useState } from "react";
import {
  Button,
  Modal,
  Fade,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  SvgIcon,
  Box,
} from "@mui/material";
import { ArrowPathIcon, EyeIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useCustomerDetailMutation } from "src/store/services/customerService";
import { formatTwoDecimals } from "src/utils/generic-functions";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "400px",
  height: "550px",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.2)",
};

export const ViewCustomer = ({ id }) => {
  const [open, setOpen] = useState(false);
  const [getCustomerDetail, { isLoading, data }] = useCustomerDetailMutation();
  const handleOpen = () => {
    if (!open) {
      getCustomerDetail(id);
    }
    setOpen(!open);
  };

  if (isLoading) {
    return (
      <Button onClick={handleOpen}>
        <SvgIcon fontSize="small">
          <ArrowPathIcon />
        </SvgIcon>
      </Button>
    );
  }
  return (
    <div>
      <Button onClick={handleOpen}>
        <SvgIcon fontSize="small">
          <EyeIcon />
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
            <Card>
              <CardHeader
                title="Customer Details"
                subheader={data?.other}
                action={
                  <IconButton aria-label="close" onClick={handleOpen}>
                    <SvgIcon fontSize="small">
                      <XMarkIcon />
                    </SvgIcon>
                  </IconButton>
                }
              />
              <CardContent sx={{ pt: 0 }}>
                <h3>Full Name: {data?.name}</h3>
                <p>Nickname: {data?.nickname}</p>
                {/* <p>Type: {customer.isSelf ? "Self Customer" : "Customer"}</p> */}
                <p>Phone: {data?.phone}</p>
                <p>Address: {data?.address}</p>
                <h4>Currencies Stock:</h4>
                <ul>
                  {data?.stock.map((item) => (
                    <li key={item.currency}>
                      {item.currency} : {formatTwoDecimals(item.stock)}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardActions sx={{ pt: 0, justifyContent: "flex-end" }}>
                <Button onClick={handleOpen} color="primary">
                  Close
                </Button>
              </CardActions>
            </Card>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
