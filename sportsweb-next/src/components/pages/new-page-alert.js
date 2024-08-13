import { useState } from "react";
import { useRouter } from "next/router";
import {
  Alert,
  AlertTitle,
  AlertDescription,
  Box,
  CloseButton,
} from "@chakra-ui/react";

import { usePage } from "../../hooks/page-hooks";
import { ErrorIcon } from "../ui/icons";

function NewPageAlert() {
  const router = useRouter();
  const { pageId, newPage } = router.query;
  const { data: pageData = {} } = usePage(pageId);
  const [showAlert, setShowAlert] = useState(Boolean(newPage));

  return (
    showAlert && (
      <Alert
        status="warning"
        borderRadius={50}
        bg="#F0F1B5"
        borderWidth="1px"
        borderColor="gray.300"
      >
        <ErrorIcon size={30} />
        <Box ml={10}>
          <AlertTitle>
            Page created. Complete your page profile details and verify your{" "}
            {pageData["company_name"]} page.
          </AlertTitle>
          <AlertDescription>
            Verified pages are eligible to get sponsorship benefits, host
            tournaments and more.
          </AlertDescription>
        </Box>
        <CloseButton marginLeft="auto" onClick={() => setShowAlert(false)} />
      </Alert>
    )
  );
}

export default NewPageAlert;
