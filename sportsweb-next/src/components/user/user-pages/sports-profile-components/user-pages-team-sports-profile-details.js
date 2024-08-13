import TeamStatistics from "./user-pages-team-statistics-detail";

const TeamStatisticsData = ({ pageTeamStatisticsData, type }) => {
  return pageTeamStatisticsData.map((data, idx) => (
    <TeamStatistics
      data={data}
      key={data.company_statistics_id}
      idx={idx}
      type={type}
    />
  ));
};

export default TeamStatisticsData;
