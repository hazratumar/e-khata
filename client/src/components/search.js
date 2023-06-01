import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { Box, Card, InputAdornment, OutlinedInput, SvgIcon } from "@mui/material";
import { useState } from "react";

export const Search = ({ onSearch, item, historyModal, khataModal }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    onSearch(newSearchTerm);
  };

  return (
    <Card sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
      <Box sx={{ display: "flex", justifyContent: "space-between", marginLeft: 2 }}>
        {historyModal}
        {khataModal}
      </Box>
    </Card>
  );
};
