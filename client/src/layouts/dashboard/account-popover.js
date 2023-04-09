import router from "next/router";
import PropTypes from "prop-types";
import { Box, Divider, MenuItem, MenuList, Popover, Typography } from "@mui/material";
import { useLogOutMutation } from "src/store/services/authService";
import { useEffect, useState } from "react";
import { removeToken } from "../../store/reducers/authSlice";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export const AccountPopover = (props) => {
  const dispatch = useDispatch();

  const { anchorEl, onClose, open, user } = props;
  const [state, setState] = useState(user);
  useEffect(() => {
    setState(
      {
        ...state,
        ...user,
      },
      [user]
    );
  });
  const [logOut, { isSuccess, data, error, isLoading }] = useLogOutMutation();
  const handleSignOut = async () => {
    await logOut();
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(removeToken("AT_Token"));
      router.push("/auth/login");
      console.log("Logout data", data);
    }
    if (error) {
      const errorMessage = Array.isArray(error.data.message)
        ? error.data.message[0]
        : eerror.data.message;
      toast.error(errorMessage);
      console.log("Error Message", error.data);
    }
  }, [isSuccess]);
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
        <Typography variant="overline">{user?.name}</Typography>
        <Typography color="text.secondary" variant="body2">
          {user?.role}
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
        <MenuItem onClick={() => router.push("/account")}>Account Settings</MenuItem>
        <Divider />
        <MenuItem onClick={handleSignOut}>{isLoading ? "Loading..." : "Sign out"}</MenuItem>
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};
