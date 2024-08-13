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
import { cricketFields } from "../../../../helper/constants/sport-statistics-constants";
import { TextSmall } from "../../../ui/text/text";

const CricketSportsStatistics = ({ cricketStat }) => {
  const roleType = cricketStat[0]["role_type"];
  const uniqueFields = [];

  return (
    <AccordionItem border="none">
      <AccordionButton px={0}>
        <AccordionIcon />
        <TextSmall ml={2}>{roleType}</TextSmall>
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
                <Th textAlign="center">Format</Th>
                {cricketFields[roleType].map((field) => {
                  return cricketStat.map((stat) => {
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
              {cricketStat.map((stat, i) => {
                return (
                  <Tr key={i}>
                    <Th textAlign="center">{stat["innings_type"]}</Th>
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

export default CricketSportsStatistics;
