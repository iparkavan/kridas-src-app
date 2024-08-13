import {
  Accordion,
  Box,
  TableContainer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import {
  cricketFields,
  softballFields,
  sportsStats,
} from "../../../helper/constants/sport-statistics-constants";
import CricketSportsStatistics from "./sports-statistics/cricket-sports-statistics";
import TennisSportsStatistics from "./sports-statistics/tennis-sports-statistics";
import BaseballSoftballSportsStatistics from "./sports-statistics/baseball-softball-sports-statistics";
import LabelText from "../../ui/text/label-text";

const UserProfileSportsStatistics = ({ statistic }) => {
  const sportStat = sportsStats.find(
    (stats) => stats.sportsCode === statistic["sports_code"]
  );

  const userSportStat = statistic["sportwise_statistics"].statsInfo;
  const uniqueFields = [];

  const statisticsText = <LabelText mb={2}>Statistics</LabelText>;

  if (statistic["sports_code"] === "SPOR05") {
    const cricketStats = [];
    Object.keys(cricketFields).map((key) => {
      const arr = userSportStat.filter((stat) => stat["role_type"] === key);
      cricketStats.push(arr);
    });

    return cricketStats.flat().length > 0 ? (
      <Box w="full">
        {statisticsText}
        <Accordion allowMultiple allowToggle w="full">
          {cricketStats.map((cricketStat, index) => {
            return (
              cricketStat.length > 0 && (
                <CricketSportsStatistics
                  key={index}
                  cricketStat={cricketStat}
                />
              )
            );
          })}
        </Accordion>
      </Box>
    ) : (
      <></>
    );
  }

  if (statistic["sports_code"] === "SPOR08") {
    const tennisStats = [];
    const matchTypes = sportStat.items.find(
      (item) => item.name === "matches_type"
    );
    matchTypes.options.forEach((option) => {
      const arr = userSportStat.filter(
        (stat) => stat["matches_type"] === option.value
      );
      tennisStats.push(arr);
    });

    return tennisStats.flat().length > 0 ? (
      <Box w="full">
        {statisticsText}
        <Accordion allowMultiple allowToggle w="full">
          {tennisStats.map((tennisStat, index) => {
            return (
              tennisStat.length > 0 && (
                <TennisSportsStatistics
                  key={index}
                  tennisStat={tennisStat}
                  sportStat={sportStat}
                />
              )
            );
          })}
        </Accordion>
      </Box>
    ) : (
      <></>
    );
  }

  if (
    statistic["sports_code"] === "SPOR12" ||
    statistic["sports_code"] === "SPOR13"
  ) {
    let fieldName;
    if (statistic["sports_code"] === "SPOR12") {
      fieldName = "softBallStatic";
    } else if (statistic["sports_code"] === "SPOR13") {
      fieldName = "baseBallStatic";
    }
    const stats = [];
    Object.keys(softballFields).map((key) => {
      const arr = userSportStat.filter((stat) => stat[fieldName] === key);
      stats.push(arr);
    });

    return stats.flat().length > 0 ? (
      <Box w="full">
        {statisticsText}
        <Accordion allowMultiple allowToggle w="full">
          {stats.map((stat, index) => {
            return (
              stat.length > 0 && (
                <BaseballSoftballSportsStatistics
                  key={index}
                  userSportStat={stat}
                  fieldName={fieldName}
                  sportStat={sportStat}
                />
              )
            );
          })}
        </Accordion>
      </Box>
    ) : (
      <></>
    );
  }

  const isStatisticsPresent = userSportStat.some(
    (stat) =>
      stat &&
      Object.keys(stat).some(
        (statKey) => statKey !== "statsSubInfo" && stat[statKey]
      )
  );

  return isStatisticsPresent ? (
    <Box w="full">
      {statisticsText}
      <TableContainer
        border="1px solid"
        borderColor="gray.300"
        borderRadius="lg"
        p={3}
      >
        <Table size="sm" variant="unstyled">
          <Thead>
            <Tr>
              {sportStat.items.map((item) => {
                userSportStat.forEach((sportStat) => {
                  Object.keys(sportStat).map((statKey) => {
                    if (
                      statKey === item.name &&
                      sportStat[statKey] &&
                      typeof sportStat[statKey] === "string" &&
                      !uniqueFields.includes(statKey)
                    ) {
                      uniqueFields.push(statKey);
                    }
                  });
                });
                if (uniqueFields.includes(item.name)) {
                  return <Th textAlign="center">{item.label}</Th>;
                }
              })}
            </Tr>
          </Thead>
          <Tbody>
            {userSportStat.map((userStat, i) => {
              return (
                <Tr key={i}>
                  {uniqueFields.map((field) => {
                    const cellContent = userStat[field] || "-";
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
    </Box>
  ) : (
    <></>
  );
};

export default UserProfileSportsStatistics;
