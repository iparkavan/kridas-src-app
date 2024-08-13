const errorMessages = {
  ENTER_TEAM_NAME: "Please enter the team name",
  ENTER_VENUE_NAME: "Please enter the venue name",
  ENTER_ACADEMY_NAME: "Please enter the academy name",
  SELECT_SPORT: "Please select the sport",
  SELECT_SPORTS: "Please select atleast one sport",
  SELECT_SKILL_LEVEL: "Please select the skill level",
  SELECT_GENDER: "Please select the gender",
  SELECT_AGE_GROUP: "Please select the age group",
  ENTER_CONTACT_NO: "Please enter your contact number",
  ENTER_VALID_CONTACT: "Please enter a valid contact number",
  ENTER_EMAIL: "Please enter your email",
  ENTER_VALID_EMAIL: "Please enter a valid email",
};

export const getCreateTeamYupSchema = (yup) => {
  return yup.object().shape({
    team_name: yup.string().trim().required(errorMessages.ENTER_TEAM_NAME),
    sports_id: yup.string().required(errorMessages.SELECT_SPORT),
    skill_level: yup.string().required(errorMessages.SELECT_SKILL_LEVEL),
    gender: yup.string().required(errorMessages.SELECT_GENDER),
    age_group: yup.string().required(errorMessages.SELECT_AGE_GROUP),
  });
};

export const getCreateVenueYupSchema = (yup) => {
  return yup.object().shape({
    venue_name: yup.string().trim().required(errorMessages.ENTER_VENUE_NAME),
    sports_interest: yup.array().compact().min(1, errorMessages.SELECT_SPORTS),
  });
};

export const getCreateAcademyYupSchema = (yup) => {
  return yup.object().shape({
    academy_name: yup
      .string()
      .trim()
      .required(errorMessages.ENTER_ACADEMY_NAME),
    sports_interest: yup.array().compact().min(1, errorMessages.SELECT_SPORTS),
  });
};
