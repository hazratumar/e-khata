import PropTypes from "prop-types";
import { Card, Stack, Typography } from "@mui/material";
import { formatTwoDecimals, formatWithAbbreviation } from "src/utils/generic-functions";

export const OverviewBudget = (props) => {
  const { type, abbreviation, value } = props;

  return (
    <Card>
      <Stack alignItems="flex-start" justifyContent="center" spacing={1} sx={{ p: 2 }}>
        <Typography variant="body1" color="text.secondary">
          {type}
        </Typography>
        <Typography variant="h4">{formatWithAbbreviation(value)}</Typography>
        <Typography variant="body2" color="text.secondary">
          {`${abbreviation}: ${formatTwoDecimals(value)}`}
        </Typography>
      </Stack>
    </Card>
  );
};

OverviewBudget.propTypes = {
  type: PropTypes.string.isRequired,
  abbreviation: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};
