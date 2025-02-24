import { Box, CircularProgress, Typography } from "@mui/material";

export const LoadingOrError: React.FunctionComponent<{
  isLoading: boolean;
  error: { message: string } | undefined;
}> = ({ isLoading, error }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      flexDirection: "column",
    }}
  >
    {isLoading ? (
      <>
        <CircularProgress />
        <Typography variant="h6">Loading...</Typography>
      </>
    ) : error ? (
      <>
        <CircularProgress color="error" />
        <Typography variant="h6" color="error">
          Error: {error.message}
        </Typography>
      </>
    ) : null}
  </Box>
);
