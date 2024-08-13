import { useBreakpointValue } from "@chakra-ui/react";
import React from "react";
import { useTeams } from "../../../hooks/team-hooks";
import IconButton from "../../ui/icon-button";
import { DeleteIcon } from "../../ui/icons";
import DeletePopover from "../../ui/popover/delete-popover";
import { TextSmall } from "../../ui/text/text";
import { Tooltip } from "@chakra-ui/react";
function DeleteSport({ sport, formik, arrayHelpers, sportindex }) {
  const iconButtonSize = useBreakpointValue({ base: "sm", md: "md" });
  const { data: EvenTeamData = [], isLoading } = useTeams(
    sport?.tournament_category_id
  );

  return (
    <DeletePopover
      title={<TextSmall color="black">Delete Sport</TextSmall>}
      trigger={
        <IconButton
          size={iconButtonSize}
          icon={<DeleteIcon fontSize="18px" />}
          // colorScheme="primary"
          tooltipLabel={
            EvenTeamData?.length > 0 &&
            "Unable to delete when teams are enrolled"
          }
          tooltipProps={{ shouldWrapChildren: true }}
          disabled={EvenTeamData?.length > 0}
          isLoading={isLoading}
        />
      }
      handleDelete={() => {
        arrayHelpers.replace(sportindex, {
          ...formik?.values?.sports_list[sportindex],
          is_delete: "Y",
        });
        formik.handleSubmit();
      }}
    >
      <TextSmall color="black">
        Are you sure you want to delete this sport?
      </TextSmall>
    </DeletePopover>
  );
}

export default DeleteSport;
