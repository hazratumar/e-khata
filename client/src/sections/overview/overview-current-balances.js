import { formatDistanceToNow } from "date-fns";
import PropTypes from "prop-types";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import EllipsisVerticalIcon from "@heroicons/react/24/solid/EllipsisVerticalIcon";
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
  ListItemAvatar,
  ListItemText,
  SvgIcon,
} from "@mui/material";

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
                <SvgIcon>
                  <EllipsisVerticalIcon />
                </SvgIcon>
              </IconButton> */}
            </ListItem>
          );
        })}
      </List>
      <Divider />
      {/* <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          color="inherit"
          endIcon={
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          }
          size="small"
          variant="text"
        >
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
