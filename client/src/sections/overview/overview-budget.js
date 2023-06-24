import PropTypes from "prop-types";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import { formatTwoDecimals, formatWithAbbreviation } from "../../utils/generic-functions";

export const OverviewBudget = (props) => {
  const { type, abbreviation, value } = props;

  return (
    <Card>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              {type}
            </Typography>
            <Typography variant="h4">{formatWithAbbreviation(value)}</Typography>
          </Stack>
        </Stack>
        <Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
          <Typography color="text.secondary" variant="caption">
            {`${abbreviation}: ${formatTwoDecimals(value)}`}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewBudget.propTypes = {
  type: PropTypes.string.isRequired,
  abbreviation: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};
