import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  TableContainer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { softballFields } from "../../../../helper/constants/sport-statistics-constants";
import { TextSmall } from "../../../ui/text/text";

const BaseballSoftballSportsStatistics = (props) => {
  const { sportStat, userSportStat, fieldName } = props;
  const roleType = userSportStat[0][fieldName];
  const uniqueFields = [];

  const roleName = sportStat?.items
    .find((item) => item.name === fieldName)
    ?.options.find((option) => option.id === roleType)?.value;

  return (
    <AccordionItem border="none">
      <AccordionButton px={0}>
        <AccordionIcon />
        <TextSmall ml={2}>{roleName}</TextSmall>
      </AccordionButton>
      <AccordionPanel px={0} py={3}>
        <TableContainer
          border="1px solid"
          borderColor="gray.300"
          borderRadius="lg"
          p={3}
        >
          <Table size="sm" variant="unstyled">
            <Thead>
              <Tr>
                {softballFields[roleType].map((field) => {
                  return userSportStat.map((stat) => {
                    const currentField = Object.keys(stat.statsSubInfo).find(
                      (subStatKey) => field.name === subStatKey
                    );
                    if (
                      currentField &&
                      stat.statsSubInfo[currentField] &&
                      !uniqueFields.includes(currentField)
                    ) {
                      uniqueFields.push(currentField);
                      return (
                        <Th key={field.name} textAlign="center">
                          {field.label}
                        </Th>
                      );
                    }
                  });
                })}
              </Tr>
            </Thead>
            <Tbody>
              {userSportStat.map((stat, i) => {
                return (
                  <Tr key={i}>
                    {uniqueFields.map((field) => {
                      const cellContent = stat.statsSubInfo[field] || "-";
                      return (
                        <Td key={field} textAlign="center">
                          {cellContent}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default BaseballSoftballSportsStatistics;
