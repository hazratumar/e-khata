import { Typography } from "@mui/material";
import KhataPage from "src/sections/report/khataPage";

const KhataList = ({ data, error }) => {
  if (error) {
    return (
      <Typography variant="h6" align="center">
        Error fetching invoices: {error}
      </Typography>
    );
  }

  if (!data) {
    return null;
  }

  return <KhataPage invoice={data} />;
};

export const getServerSideProps = async ({ query }) => {
  const { customer, currency, startDate, endDate } = query;
  const BASE_URL = process.env.SERVER_URL;

  try {
    const res = await fetch(
      `${BASE_URL}/report/khata/${customer}/${currency}/${startDate}/${endDate}`
    );
    const data = await res.json();
    return { props: { data, error: null } };
  } catch (error) {
    console.error(error);
    return { props: { data: null, error } };
  }
};

export default KhataList;
