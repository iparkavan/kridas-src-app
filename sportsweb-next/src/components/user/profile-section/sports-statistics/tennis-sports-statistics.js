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
import { TextSmall } from "../../../ui/text/text";

const TennisSportsStatistics = ({ sportStat, tennisStat }) => {
  const matchType = tennisStat[0]["matches_type"];
  const uniqueFields = [];

  return (
    <AccordionItem border="none">
      <AccordionButton px={0}>
        <AccordionIcon />
        <TextSmall ml={2}>{matchType}</TextSmall>
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
                <Th textAlign="center">Surface</Th>
                {sportStat.items.map((item) => {
                  return tennisStat.map((stat) => {
                    const currentItem = Object.keys(stat).find(
                      (statKey) =>
                        statKey !== "matches_type" &&
                        statKey !== "surfaces_type" &&
                        item.name === statKey
                    );
                    if (
                      currentItem &&
                      stat[currentItem] &&
                      !uniqueFields.includes(currentItem)
                    ) {
                      uniqueFields.push(currentItem);
                      return (
                        <Th key={item.name} textAlign="center">
                          {item.label}
                        </Th>
                      );
                    }
                  });
                })}
              </Tr>
            </Thead>
            <Tbody>
              {tennisStat.map((stat, i) => {
                return (
                  <Tr key={i}>
                    <Th textAlign="center">{stat["surfaces_type"]}</Th>
                    {uniqueFields.map((field) => {
                      const cellContent = stat[field] || "-";
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

export default TennisSportsStatistics;
