const pageStatisticsErrorMessages = {
  INVALID_LINK: "Please enter a valid link",
  ENTER_VENUE_NAME: "Please enter the venue name",
  ENTER_TEAM_NAME: "Please enter the team name",
  ENTER_ACADEMY_NAME: "Please enter the academy name",
  SELECT_SPORT: "Please select a sport",
  SELECT_SKILL_LEVEL: "Please select the skill level",
  SELECT_GENDER: "Please select the gender",
  SELECT_AGE_GROUP: "Please select the age group",
};

export const CreateTeamStatisticsYupSchema = (yup) => {
  return yup.object().shape({
    categorywise_statistics: yup.object({
      sports_id: yup
        .number()
        .required(pageStatisticsErrorMessages.SELECT_SPORT),
      team_name: yup
        .string()
        .required(pageStatisticsErrorMessages.ENTER_TEAM_NAME),
    }),
    statistics_links: yup.array().of(
      yup.object().shape({
        link: yup
          .string(pageStatisticsErrorMessages.INVALID_LINK)
          .url(pageStatisticsErrorMessages.INVALID_LINK),
      })
    ),
  });
};

export const getCreateVenueStatisticsYupSchema = (yup) => {
  return yup.object().shape({
    categorywise_statistics: yup.object({
      venue_name: yup
        .string()
        .required(pageStatisticsErrorMessages.ENTER_VENUE_NAME),
      sports_id: yup
        .string()
        .required(pageStatisticsErrorMessages.SELECT_SPORT),
    }),
  });
};

export const getCreateAcademyStatisticsYupSchema = (yup) => {
  return yup.object().shape({
    categorywise_statistics: yup.object({
      // academy_name: yup
      //   .string()
      //   .trim()
      //   .required(pageStatisticsErrorMessages.ENTER_ACADEMY_NAME),
      sports_id: yup
        .string()
        .required(pageStatisticsErrorMessages.SELECT_SPORT),
      skill_level: yup
        .string()
        .required(pageStatisticsErrorMessages.SELECT_SKILL_LEVEL),
      gender: yup.string().required(pageStatisticsErrorMessages.SELECT_GENDER),
      age_group: yup
        .string()
        .required(pageStatisticsErrorMessages.SELECT_AGE_GROUP),
    }),
  });
};
