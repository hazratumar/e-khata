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

export const AccountProfile = () => {
  const user = useSelector((state) => state.authReducer.user);
  const [state, setState] = useState({
    name: user?.name,
    username: user?.username,
    email: user?.email,
    image: user?.image,
  });
  useEffect(() => {
    setState(user);
  }, [user]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImage(reader.result);
      };
    }
  };

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
            src={state.image}
            sx={{
              height: 80,
              mb: 2,
              width: 80,
            }}
          />
          <Typography gutterBottom variant="h5">
            {state.name}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {state.username}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {state.email}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: "center" }}>
        <label htmlFor="image-upload" style={{ width: "100%" }}>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImage}
          />
          <Button fullWidth component="span">
            Upload Picture
          </Button>
        </label>
      </CardActions>
    </Card>
  );
};
