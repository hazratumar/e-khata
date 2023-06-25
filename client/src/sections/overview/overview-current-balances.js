import { formatDistanceToNow } from "date-fns";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { ArrowForward, MoreVert } from "@mui/icons-material";

export const OverviewCurrentBalances = (props) => {
  const { products = [], sx } = props;

  return (
    <Card sx={sx}>
      <CardHeader title="Current Balances" />
      <List>
        {products.map((currency, index) => {
          const hasDivider = index < products.length - 1;

          return (
            <ListItem divider={hasDivider} key={currency.id}>
              <ListItemText
                primary={currency.name}
                primaryTypographyProps={{ variant: "subtitle1" }}
                secondary={currency.amount}
                secondaryTypographyProps={{ variant: "body2" }}
              />
              {/* <IconButton edge="end">
                  <MoreVert />
              </IconButton> */}
            </ListItem>
          );
        })}
      </List>
      <Divider />
      {/* <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button color="inherit" endIcon={<ArrowForward />} size="small" variant="text">
          View all
        </Button>
      </CardActions> */}
    </Card>
  );
};

OverviewCurrentBalances.propTypes = {
  products: PropTypes.array,
  sx: PropTypes.object,
};
