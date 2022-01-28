import Box from "@mui/material/Box";
import ErrorIcon from "@mui/icons-material/Error";
export default function ErrorMsg({ error }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "60vh",
        width: "100%",
      }}
    >
      <ErrorIcon sx={{ width: "100px", height: 100 }} color="grey" />
      <br />
      <br />
      <h2>
        {error.status === "FETCH_ERROR"
          ? "Something went wrong, please try again later..."
          : error.data.message}
      </h2>
    </Box>
  );
}
