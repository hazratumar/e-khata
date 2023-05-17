import PropTypes from "prop-types";
import ArrowDownIcon from "@heroicons/react/24/solid/ArrowDownIcon";
import ArrowUpIcon from "@heroicons/react/24/solid/ArrowUpIcon";
import CurrencyDollarIcon from "@heroicons/react/24/solid/CurrencyDollarIcon";
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from "@mui/material";
import numeral from "numeral";

export const OverviewBudget = (props) => {
  const { type, name, abbreviation, value } = props;

  return (
    <Card>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              {type}
            </Typography>
            <Typography variant="h4">{numeral(value).format("0,0.0a")}</Typography>
          </Stack>
        </Stack>
        <Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
          <Typography color="text.secondary" variant="caption">
            {`${abbreviation}: ${`(${numeral(value).format("0,0.00")})`}`}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewBudget.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  abbreviation: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};
