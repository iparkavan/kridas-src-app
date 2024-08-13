import { Divider, Grid, GridItem } from "@chakra-ui/react";
import { Fragment } from "react";
import SelectWithValidation from "../../../ui/select/select-with-validation";
import { getParticipantsLabel } from "../../../../helper/constants/event-fixtures-constants";

const GeneratedParticipants = (props) => {
  const { values, gridColumns, playersType, regOptions } = props;

  return (
    <Grid
      templateColumns={gridColumns}
      border="1px solid"
      borderColor="gray.300"
      alignItems="center"
    >
      <GridItem bg="navy" color="white" textAlign="center" p={3}>
        S.No
      </GridItem>
      <GridItem bg="navy" color="white" textAlign="center" p={3}>
        {getParticipantsLabel(playersType)}
      </GridItem>

      {values.participant_list.map((participant, index) => (
        <Fragment key={participant.reg_id}>
          <GridItem justifySelf="center" p={2}>
            {participant.reg_id}.
          </GridItem>
          <GridItem p={2}>
            <SelectWithValidation
              name={`participant_list[${index}].participant_name`}
            >
              {regOptions.map((participant) => (
                <option
                  key={participant.reg_id}
                  value={participant.participant_name}
                >
                  {participant.participant_name}
                </option>
              ))}
            </SelectWithValidation>
          </GridItem>
          <GridItem gridColumn="1 / -1">
            <Divider borderColor="gray.300" />
          </GridItem>
        </Fragment>
      ))}
    </Grid>
  );
};

export default GeneratedParticipants;
