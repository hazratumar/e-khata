import { Search } from "@mui/icons-material";
import { Card, InputAdornment, OutlinedInput } from "@mui/material";

export const CompaniesSearch = () => (
  <Card sx={{ p: 2 }}>
    <OutlinedInput
      defaultValue=""
      fullWidth
      placeholder="Search company"
      startAdornment={
        <InputAdornment position="start">
          <Search />
        </InputAdornment>
      }
      sx={{ maxWidth: 500 }}
    />
  </Card>
);
