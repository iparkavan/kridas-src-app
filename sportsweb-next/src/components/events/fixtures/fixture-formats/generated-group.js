import { Fragment, useState } from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import { getParticipantsLabel } from "../../../../helper/constants/event-fixtures-constants";
import SelectWithValidation from "../../../ui/select/select-with-validation";
import { TextMedium } from "../../../ui/text/text";

const GeneratedGroup = (props) => {
  const { group, groupIndex, playersType, regOptions } = props;

  // Previous where only participants in that group were in options
  // const [regOptions, setRegOptions] = useState(group.participant_list);
  // const [prevGroup, setPrevGroup] = useState(group);
  // if (prevGroup !== group) {
  //   setPrevGroup(group);
  //   setRegOptions(group.participant_list);
  // }

  const { touched, errors } = useFormikContext();

  return (
    <Grid
      // templateColumns="auto auto"
      templateColumns="auto minmax(200px, 1fr)"
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
      <GridItem
        gridColumn="1 / -1"
        justifySelf="center"
        my={2}
        fontWeight="medium"
      >
        {group.group_name}
      </GridItem>
      {group.participant_list.map((participant, participantIndex) => (
        <Fragment key={participant.reg_id}>
          <GridItem justifySelf="center" p={2}>
            {participant.reg_id}.
          </GridItem>
          <GridItem p={2} pr={3}>
            <SelectWithValidation
              name={`groups[${groupIndex}].participant_list[${participantIndex}].participant_name`}
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
        </Fragment>
      ))}
      {touched?.groups?.[groupIndex]?.participant_list &&
        errors?.groups?.[groupIndex]?.participant_list && (
          <GridItem gridColumn="1 / -1" p={2} justifySelf="center">
            <TextMedium color="red.500">
              {errors.groups[groupIndex].participant_list}
            </TextMedium>
          </GridItem>
        )}
    </Grid>
  );
};

export default GeneratedGroup;
