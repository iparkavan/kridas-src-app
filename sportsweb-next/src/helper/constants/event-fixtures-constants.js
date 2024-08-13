import clone from "just-clone";

const errorMessages = {
  NO_OF_REG: "Please enter the no of registration",
  NO_OF_ROUND: "Please enter the no of rounds",
  MAX_REG: "Max registration has been exceeded",
  KNOCKOUT_FORMAT: "Please select the knockout format",
  NO_OF_QUALIFIERS: "Please enter the no of qualifiers",
  NO_OF_GROUP: "Please enter the no of groups",
  INVALID_QUALIFIERS: "No of qualifiers should be less than group size",
  SELECT_PLACE: "Please select the place",
  SELECT_PRIZE: "Please select the prize",
  SELECT_FORMAT: "Please select the format",
  SELECT_DATETIME: "Please select the date & time",
  SELECT_VENUE: "Please select the venue",
  ENTER_COURT_NO: "Please enter the court no",
  INVALID_FIXTURE_DATE: "Please select a date between event start & end dates",
  NO_OF_SETS: "Please enter the no of sets",
  REQUIRED: "Required",
  ENTER_RESULT: "Please enter the result",
  ENTER_POINTS_FOR_WIN: "Please enter the points for win",
  ENTER_POINTS_FOR_TIE: "Please enter the points for tie",
};

export const getParticipantsLabel = (type) => {
  switch (type) {
    case "Team":
      return "Teams";
    case "Individual":
    case "Doubles":
      return "Participants";
  }
};

const getParticipantsMessage = (type) => {
  return `Please generate the ${getParticipantsLabel(type)}`;
};

const getDuplicateParticipantsMessage = (type) => {
  return `${getParticipantsLabel(type)} should not be the same`;
};

const leagueYupSchema = (playersType, tournamentConfig, yup) => {
  return yup.object().shape({
    no_of_reg: yup
      .string()
      .required(errorMessages.NO_OF_REG)
      .test("is-below-max", errorMessages.MAX_REG, (no_of_reg) => {
        return (
          +no_of_reg <= +tournamentConfig.participant_criteria.max_registrations
        );
      }),
    no_of_rounds: yup.string().required(errorMessages.NO_OF_ROUND),
    participant_list: yup
      .array()
      .min(1, getParticipantsMessage(playersType))
      .test(
        "is-unique",
        getDuplicateParticipantsMessage(playersType),
        (participant_list) => {
          const participantNames = participant_list.map(
            (participant) => participant.participant_name
          );
          return participantNames.length === new Set(participantNames).size;
        }
      ),
  });
};

const knockoutYupSchema = (playersType, tournamentConfig, yup) => {
  return yup.object().shape({
    no_of_reg: yup
      .string()
      .required(errorMessages.NO_OF_REG)
      .test("is-below-max", errorMessages.MAX_REG, (no_of_reg) => {
        return (
          +no_of_reg <= +tournamentConfig.participant_criteria.max_registrations
        );
      }),
    participant_list: yup
      .array()
      .min(1, getParticipantsMessage(playersType))
      .test(
        "is-unique",
        getDuplicateParticipantsMessage(playersType),
        (participant_list) => {
          const participantNames = participant_list.map(
            (participant) => participant.participant_name
          );
          return participantNames.length === new Set(participantNames).size;
        }
      ),
  });
};

const leagueKnockoutYupSchema = (playersType, tournamentConfig, yup) => {
  return yup.object().shape({
    no_of_reg: yup
      .string()
      .required(errorMessages.NO_OF_REG)
      .test("is-below-max", errorMessages.MAX_REG, (no_of_reg) => {
        return (
          +no_of_reg <= +tournamentConfig.participant_criteria.max_registrations
        );
      }),
    no_of_rounds: yup.string().required(errorMessages.NO_OF_ROUND),
    knockout_format: yup.string().required(errorMessages.KNOCKOUT_FORMAT),
    no_of_qualifiers: yup.string().required(errorMessages.NO_OF_QUALIFIERS),
    participant_list: yup
      .array()
      .min(1, getParticipantsMessage(playersType))
      .test(
        "is-unique",
        getDuplicateParticipantsMessage(playersType),
        (participant_list) => {
          const participantNames = participant_list.map(
            (participant) => participant.participant_name
          );
          return participantNames.length === new Set(participantNames).size;
        }
      ),
  });
};

const groupKnockoutYupSchema = (playersType, tournamentConfig, yup) => {
  return yup.object().shape({
    no_of_reg: yup
      .string()
      .required(errorMessages.NO_OF_REG)
      .test("is-below-max", errorMessages.MAX_REG, (no_of_reg) => {
        return (
          +no_of_reg <= +tournamentConfig.participant_criteria.max_registrations
        );
      }),
    no_of_groups: yup.string().required(errorMessages.NO_OF_GROUP),
    knockout_format: yup.string().required(errorMessages.KNOCKOUT_FORMAT),
    no_of_rounds: yup.string().required(errorMessages.NO_OF_ROUND),
    no_of_qualifiers: yup
      .string()
      .required(errorMessages.NO_OF_QUALIFIERS)
      .test(
        "is-below-participants",
        errorMessages.INVALID_QUALIFIERS,
        function (no_of_qualifiers) {
          const { no_of_reg, no_of_groups } = this.parent;
          if (!no_of_reg || !no_of_groups) return false;
          const noOfParticipants = Math.ceil(+no_of_reg / +no_of_groups);
          return +no_of_qualifiers <= noOfParticipants;
        }
      ),
    groups: yup
      .array()
      .min(1, getParticipantsMessage(playersType))
      .of(
        yup.object().shape({
          participant_list: yup
            .array()
            .min(1, getParticipantsMessage(playersType)),
          // Tests unique names within same group only
          // .test(
          //   "is-unique",
          //   getDuplicateParticipantsMessage(playersType),
          //   (participant_list) => {
          //     const participantNames = participant_list.map(
          //       (participant) => participant.participant_name
          //     );
          //     return (
          //       participantNames.length === new Set(participantNames).size
          //     );
          //   }
          // ),
        })
      )
      .test(
        "is-unique",
        getDuplicateParticipantsMessage(playersType),
        (groups) => {
          const participantNames = [];
          groups.forEach((group) => {
            const groupParticipantNames = group.participant_list.map(
              (participant) => participant.participant_name
            );
            participantNames.push(...groupParticipantNames);
          });
          return participantNames.length === new Set(participantNames).size;
        }
      ),
    inner_format: yup
      .array()
      .when("knockout_format", (knockout_format, schema) => {
        if (knockout_format !== "CSP") return schema;
        return schema.of(
          yup.object().shape({
            level: yup.string().required(errorMessages.SELECT_PLACE),
            prize: yup.string().required(errorMessages.SELECT_PRIZE),
            format: yup.string().required(errorMessages.SELECT_FORMAT),
          })
        );
      }),
  });
};

export const getFixtureDetails = (
  fixtureFormat,
  playersType,
  tournamentConfig,
  yup
) => {
  switch (fixtureFormat) {
    case "LEAGUE":
      return {
        validationSchema: leagueYupSchema(playersType, tournamentConfig, yup),
        fixtureConfig: {
          no_of_reg: "",
          no_of_rounds: "",
          participant_list: [],
        },
      };
    case "KNOCK":
      return {
        validationSchema: knockoutYupSchema(playersType, tournamentConfig, yup),
        fixtureConfig: { no_of_reg: "", participant_list: [] },
      };
    case "LGEKNO":
      return {
        validationSchema: leagueKnockoutYupSchema(
          playersType,
          tournamentConfig,
          yup
        ),
        fixtureConfig: {
          no_of_reg: "",
          no_of_rounds: "",
          knockout_format: "",
          no_of_qualifiers: "",
          participant_list: [],
        },
      };
    case "GRPKNO":
      return {
        validationSchema: groupKnockoutYupSchema(
          playersType,
          tournamentConfig,
          yup
        ),
        fixtureConfig: {
          no_of_reg: "",
          no_of_groups: "",
          knockout_format: "",
          no_of_rounds: "",
          no_of_qualifiers: "",
          groups: [],
          inner_format: [],
        },
      };
  }
};

const shuffleArray = (array, isDoubles) => {
  if (isDoubles) {
    for (let i = array.length - 2; i > 0; i -= 2) {
      let randomIndex = Math.floor(Math.random() * i);
      let j =
        randomIndex % 2 !== 0 && randomIndex > 0
          ? randomIndex - 1
          : randomIndex;
      [array[i], array[j]] = [array[j], array[i]];
      [array[i + 1], array[j + 1]] = [array[j + 1], array[i + 1]];
    }
  } else {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
};

const getParticipantName = (registrationData, type, index) => {
  switch (type) {
    case "Team":
      if (registrationData[index]) {
        return registrationData[index].company.company_name;
      } else {
        return `Team ${index + 1}`;
      }
    case "Individual":
      if (registrationData[index]) {
        return `${registrationData[index].first_name} ${registrationData[index].last_name}`;
      } else {
        return `Participant ${index + 1}`;
      }
    case "Doubles":
      if (registrationData[index * 2] && registrationData[index * 2 + 1]) {
        return `${registrationData[index * 2].first_name} ${
          registrationData[index * 2].last_name
        } / ${registrationData[index * 2 + 1].first_name} ${
          registrationData[index * 2 + 1].last_name
        }`;
      } else {
        return `Participant ${index * 2 + 1} / Participant ${index * 2 + 2}`;
      }
  }
};

export const getParticipants = (
  noOfRegistrations,
  originalRegistrationData,
  type,
  isRandom = false
) => {
  const registrationData = clone(originalRegistrationData);
  if (isRandom) {
    const isDoubles = type === "Doubles";
    shuffleArray(registrationData, isDoubles);
  }
  const participants = new Array(noOfRegistrations).fill().map((_, index) => {
    return {
      reg_id: index + 1,
      participant_name: getParticipantName(registrationData, type, index),
    };
  });
  return participants;
};

export const getNumberSuffix = (n) => {
  const nString = String(n);
  const last = +nString.slice(-2);
  if (last > 3 && last < 21) return "th";
  switch (last % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const getEditMatchYupSchema = (
  playersType,
  eventStartDate,
  eventEndDate,
  yup
) => {
  return yup.object().shape({
    firstTeamName: yup
      .string()
      .required(`Please select the ${getParticipantsLabel(playersType)}`),
    secondTeamName: yup
      .string()
      .required(`Please select the ${getParticipantsLabel(playersType)}`),
    fixtureDate: yup
      .date()
      .required(errorMessages.SELECT_DATETIME)
      .typeError(errorMessages.SELECT_DATETIME)
      .min(eventStartDate, errorMessages.INVALID_FIXTURE_DATE)
      .max(eventEndDate, errorMessages.INVALID_FIXTURE_DATE),
    venueId: yup.string().required(errorMessages.SELECT_VENUE),
    courtNo: yup.string().required(errorMessages.ENTER_COURT_NO),
  });
};

export const getParticipantsRegex = (type) => {
  switch (type) {
    case "Team":
      return /^Team \d+$/;
    case "Individual":
      return /^Participant \d+$/;
    case "Doubles":
      return /^Participant \d+ \/ Participant \d+$/;
  }
};

const setsYupSchema = (yup) => {
  return yup.object().shape({
    no_of_sets: yup.string().trim().required(errorMessages.NO_OF_SETS),
    sets: yup
      .array()
      .of(
        yup.object().shape({
          first_team_points: yup
            .string()
            .trim()
            .required(errorMessages.REQUIRED),
          second_team_points: yup
            .string()
            .trim()
            .required(errorMessages.REQUIRED),
        })
      )
      .min(1, errorMessages.REQUIRED)
      .required(),
    first_team_score: yup.string().trim().required(errorMessages.REQUIRED),
    second_team_score: yup.string().trim().required(errorMessages.REQUIRED),
    result: yup.string().trim().required(errorMessages.ENTER_RESULT),
  });
};

const cricketYupSchema = (yup) => {
  return yup.object().shape({
    first_team_stats: yup.object().shape({
      score: yup.string().trim().required(errorMessages.REQUIRED),
      wickets: yup.string().trim().required(errorMessages.REQUIRED),
      overs: yup.string().trim().required(errorMessages.REQUIRED),
    }),
    second_team_stats: yup.object().shape({
      score: yup.string().trim().required(errorMessages.REQUIRED),
      wickets: yup.string().trim().required(errorMessages.REQUIRED),
      overs: yup.string().trim().required(errorMessages.REQUIRED),
    }),
    result: yup.string().trim().required(errorMessages.ENTER_RESULT),
  });
};

const footballYupSchema = (yup) => {
  return yup.object().shape({
    first_team_score: yup.string().trim().required(errorMessages.REQUIRED),
    first_team_goals_info: yup
      .array()
      .of(
        yup.object().shape({
          player_name: yup.string().trim().required(errorMessages.REQUIRED),
          goal_min: yup.string().trim().required(errorMessages.REQUIRED),
        })
      )
      .required(),
    second_team_score: yup.string().trim().required(errorMessages.REQUIRED),
    second_team_goals_info: yup
      .array()
      .of(
        yup.object().shape({
          player_name: yup.string().trim().required(errorMessages.REQUIRED),
          goal_min: yup.string().trim().required(errorMessages.REQUIRED),
        })
      )
      .required(),
    result: yup.string().trim().required(errorMessages.ENTER_RESULT),
  });
};

export const getFixtureResultDetails = (sportCode, yup) => {
  switch (sportCode) {
    case "SPOR05":
      return {
        validationSchema: cricketYupSchema(yup),
        matchScore: {
          first_team_stats: {
            score: "",
            wickets: "",
            overs: "",
          },
          second_team_stats: {
            score: "",
            wickets: "",
            overs: "",
          },
          result: "",
          first_team_score: "",
          second_team_score: "",
        },
      };
    case "SPOR07":
      return {
        validationSchema: footballYupSchema(yup),
        matchScore: {
          first_team_score: "",
          first_team_goals_info: [],
          second_team_score: "",
          second_team_goals_info: [],
          result: "",
        },
      };
    default:
      return {
        validationSchema: setsYupSchema(yup),
        matchScore: {
          no_of_sets: "",
          sets: [],
          first_team_score: "",
          second_team_score: "",
          result: "",
        },
      };
  }
};

export const getPointsTableYupSchema = (yup) => {
  return yup.object().shape({
    points_for_win: yup.string().required(errorMessages.ENTER_POINTS_FOR_WIN),
    points_for_tie: yup.string().required(errorMessages.ENTER_POINTS_FOR_TIE),
  });
};
