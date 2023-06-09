import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { setToken } from "src/store/reducers/authSlice";
import { useUpdateUserMutation } from "src/store/services/userService";
import { toast } from "react-hot-toast";
import { getFirstLetters } from "src/utils/generic-functions";

export const ProfileImage = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const [state, setState] = useState({
    name: user?.name,
    email: user?.email,
    image: user?.image,
  });

  const [updateUser, { isSuccess, isLoading, error, data }] = useUpdateUserMutation();

  useEffect(() => {
    setState(user);
  }, [user]);

  const handleImage = async (e) => {
    await updateUser(state);

    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setState({
          ...state,
          image: reader.result,
        });
      };
    }
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setToken(data));
      toast.success("Picture successfully uploaded");
    }
    if (error) {
      const errorMessage = Array.isArray(error.data.message)
        ? error.data.message[0]
        : error.data.message;
      toast.error(errorMessage);
    }
  }, [isSuccess, error, data, dispatch]);
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Avatar
            sx={{
              fontSize: 30,
              height: 80,
              mb: 2,
              width: 80,
            }}
          >
            {getFirstLetters(state.name)}
          </Avatar>
          <Typography gutterBottom variant="h5">
            {state.name}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {state.email}
          </Typography>
        </Box>
      </CardContent>
      {/* <Divider />
      <CardActions>
        <label
          htmlFor="image-upload"
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImage}
          />
          <Button fullWidth component="span" sx={{ maxWidth: 400 }}>
            {isLoading ? "Uploading..." : "Upload Picture"}
          </Button>
        </label>
      </CardActions> */}
    </Card>
  );
};
