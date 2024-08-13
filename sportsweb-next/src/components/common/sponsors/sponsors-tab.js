import { useState } from "react";
import { Box, Skeleton } from "@chakra-ui/react";
import Button from "../../ui/button";
import { AddIcon, EditIcon } from "../../ui/icons";
import { usePageSponsors } from "../../../hooks/page-sponsor-hooks";
import { useEventSponsors } from "../../../hooks/event-hook";
import SponsorsView from "./sponsors-view";
import SponsorsEdit from "./sponsors-edit";

const SponsorsTab = (props) => {
  const { isCreator, type, id, sports } = props;
  const [mode, setMode] = useState("view");
  const {
    data: pageSponsorsData,
    isLoading: isPageSponsorsLoading,
    isSuccess: isPageSponsorsSuccess,
  } = usePageSponsors(type === "company" && id);
  const {
    data: eventSponsorsData,
    isLoading: isEventSponsorsLoading,
    isSuccess: isEventSponsorsSuccess,
  } = useEventSponsors(type === "event" && id);

  let sponsorsData, isLoading, isSuccess;
  if (type === "company") {
    sponsorsData = pageSponsorsData;
    isLoading = isPageSponsorsLoading;
    isSuccess = isPageSponsorsSuccess;
  } else if (type === "event") {
    sponsorsData = eventSponsorsData;
    isLoading = isEventSponsorsLoading;
    isSuccess = isEventSponsorsSuccess;
  }
  const areSponsorsPresent = Boolean(sponsorsData?.length);
  if (isSuccess && isCreator && !areSponsorsPresent && mode === "view") {
    setMode("edit");
  }

  return (
    <Box w="full" bg="white" p={5} borderRadius="md">
      {mode === "view" ? (
        <Skeleton isLoaded={!isLoading}>
          {isCreator && (
            <Button
              onClick={() => setMode("edit")}
              leftIcon={areSponsorsPresent ? <EditIcon /> : <AddIcon />}
            >
              {areSponsorsPresent ? "Edit Sponsors" : "Add Sponsors"}
            </Button>
          )}
          {isSuccess && (
            <SponsorsView
              sponsors={sponsorsData}
              isCreator={isCreator}
              type={type}
            />
          )}
        </Skeleton>
      ) : (
        <SponsorsEdit
          type={type}
          id={id}
          setMode={setMode}
          areSponsorsPresent={areSponsorsPresent}
          sports={sports}
        />
      )}
    </Box>
  );
};

export default SponsorsTab;
