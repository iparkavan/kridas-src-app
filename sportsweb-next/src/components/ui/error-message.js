import { Box, Alert, AlertIcon, AlertDescription } from "@chakra-ui/react";

const ErrorMessage = ({ message }) => {
  return (
    <Box my={2} width="full">
      <Alert status="error" borderRadius={4}>
        <AlertIcon />
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </Box>
  );
};

export default ErrorMessage;
