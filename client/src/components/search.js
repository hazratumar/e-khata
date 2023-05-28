import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { Card, InputAdornment, OutlinedInput, SvgIcon } from "@mui/material";
import { useState } from "react";

export const Search = ({ onSearch, item, report }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    onSearch(newSearchTerm);
  };

  return (
    <Card sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
      <OutlinedInput
        value={searchTerm}
        fullWidth
        placeholder={`Search ${item}...`}
        onChange={handleSearch}
        startAdornment={
          <InputAdornment position="start">
            <SvgIcon color="action" fontSize="small">
              <MagnifyingGlassIcon />
            </SvgIcon>
          </InputAdornment>
        }
        sx={{ maxWidth: 500 }}
      />
      {report}
    </Card>
  );
};
