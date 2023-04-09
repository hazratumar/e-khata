import router from "next/router";
import PropTypes from "prop-types";
import { Box, Divider, MenuItem, MenuList, Popover, Typography } from "@mui/material";
import { useLogOutMutation } from "src/store/services/authService";
import { useEffect } from "react";
import { removeToken } from "../../store/reducers/authSlice";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export const AccountPopover = (props) => {
  const dispatch = useDispatch();

  const { anchorEl, onClose, open } = props;
  const [logOut, res] = useLogOutMutation();
  const handleSignOut = async () => {
    await logOut();
  };
  const {
    user: { name, role },
  } = useSelector((state) => state.authReducer);
  useEffect(() => {
    if (res?.isSuccess) {
      dispatch(removeToken("AT_Token"));
      router.push("/auth/login");
      console.log("Logout res", res);
    }
    if (res?.error) {
      const errorMessage = Array.isArray(res.error.data.message)
        ? res.error.data.message[0]
        : res.error.data.message;
      toast.error(errorMessage);
      console.log("Error Message", res.error.data);
    }
  }, [res]);
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2,
        }}
      >
        <Typography variant="overline">{name}</Typography>
        <Typography color="text.secondary" variant="body2">
          {role}
        </Typography>
      </Box>
      <MenuList
        disablePadding
        dense
        sx={{
          p: "8px",
          "& > *": {
            borderRadius: 1,
          },
        }}
      >
        <MenuItem onClick={() => router.push("/account")}>User Account</MenuItem>
        <Divider />
        <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};
