import { Grid, GridItem } from "@chakra-ui/react";
import GeneratedGroup from "./generated-group";

const GeneratedGroups = (props) => {
  const { values, playersType, regOptions } = props;

  return (
    <Grid templateColumns="auto auto auto" rowGap={5}>
      {values.groups.map((group, groupIndex) => (
        <GridItem key={groupIndex}>
          <GeneratedGroup
            group={group}
            groupIndex={groupIndex}
            playersType={playersType}
            regOptions={regOptions}
          />
        </GridItem>
      ))}
    </Grid>
  );
};

export default GeneratedGroups;
