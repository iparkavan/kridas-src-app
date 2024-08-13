const db = require("../utils/db");
const { v4: uuidv4 } = require("uuid");

const add = async (
  tournament_refid,
  tournament_category,
  parent_category_id,
  tournament_format,
  reg_fee,
  reg_fee_currency,
  minimum_players,
  maximum_players,
  min_reg_count,
  max_reg_count,
  seeded_teams,

  age_restriction,
  sex_restriction,
  average_age,
  tournament_config,
  participant_dob_startdate,
  participant_dob_enddate,
  tournament_category_name,
  tournament_category_prizes,
  tournament_category_desc,
  max_age,
  min_age,
  min_male,
  max_male,
  min_female,
  max_female,
  doc_list,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `INSERT INTO tournament_categories (tournament_refid , tournament_category, parent_category_id, tournament_format,  reg_fee, reg_fee_currency, minimum_players, maximum_players,

            min_reg_count,max_reg_count,seeded_teams,age_restriction,sex_restriction,average_age,tournament_config,participant_dob_startdate,participant_dob_enddate,tournament_category_name,tournament_category_prizes,tournament_category_desc, max_age, min_age,
            min_male,max_male,min_female,max_female,doc_list)
            
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27) RETURNING *`;

    result = await transaction.one(query, [
      tournament_refid,
      tournament_category,
      parent_category_id,
      tournament_format,
      reg_fee,
      reg_fee_currency,
      minimum_players,
      maximum_players,
      min_reg_count,

      max_reg_count,
      seeded_teams,
      age_restriction,
      sex_restriction,
      average_age,
      JSON.stringify(tournament_config),
      participant_dob_startdate,
      participant_dob_enddate,
      tournament_category_name,
      tournament_category_prizes,
      tournament_category_desc,
      max_age,
      min_age,
      min_male,
      max_male,
      min_female,
      max_female,
      JSON.stringify(doc_list),
    ]);

    return result;
  } catch (error) {
    console.log("Error occurred in tournament category add", error);
    throw error;
  }
};

const edit = async (
  tournament_refid,
  tournament_category,
  parent_category_id,
  tournament_format,
  reg_fee,
  reg_fee_currency,
  minimum_players,
  maximum_players,
  min_reg_count,
  max_reg_count,
  seeded_teams,

  age_restriction,
  sex_restriction,
  average_age,
  // tournament_config,
  participant_dob_startdate,
  participant_dob_enddate,
  tournament_category_name,
  tournament_category_prizes,
  tournament_category_desc,
  tournament_category_id,
  max_age,
  min_age,
  min_male,
  max_male,
  min_female,
  max_female,
  doc_list,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `UPDATE tournament_categories SET tournament_refid = $1, tournament_category =$2, parent_category_id =$3, tournament_format =$4,  reg_fee =$5, reg_fee_currency =$6, minimum_players =$7, maximum_players = $8,

            min_reg_count = $9,max_reg_count= $10,seeded_teams= $11,age_restriction= $12,sex_restriction= $13,average_age= $14,participant_dob_startdate= $15,participant_dob_enddate= $16,tournament_category_name= $17,tournament_category_prizes= $18,tournament_category_desc= $19, max_age=$21, min_age=$22,
            min_male=$23,max_male=$24,min_female=$25,max_female=$26,doc_list=$27 WHERE tournament_category_id =$20 RETURNING *`;

    result = await transaction.one(query, [
      tournament_refid,
      tournament_category,
      parent_category_id,
      tournament_format,
      reg_fee,
      reg_fee_currency,
      minimum_players,
      maximum_players,
      min_reg_count,

      max_reg_count,
      seeded_teams,
      age_restriction,
      sex_restriction,
      average_age,
      // JSON.stringify(tournament_config),
      participant_dob_startdate,
      participant_dob_enddate,
      tournament_category_name,
      tournament_category_prizes,
      tournament_category_desc,
      tournament_category_id,
      max_age,
      min_age,
      min_male,
      max_male,
      min_female,
      max_female,
      JSON.stringify(doc_list),
    ]);

    return result;
  } catch (error) {
    console.log("Error occurred in tournament category edit", error);
    throw error;
  }
};

const getById = async (tournament_category_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select * from tournament_categories where tournament_category_id = $1";
    result = await transaction.oneOrNone(query, [tournament_category_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in tournament_categories getById", error);
    throw error;
  }
};

const getParticipantCatByTournCatId = async (
  tournament_category_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
        tc.participant_category
      from
        tournament_categories tc
      where
        tc.tournament_category_id = ${tournament_category_id}`;
    result = await transaction.oneOrNone(query, [tournament_category_id]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in tournament_categories getParticipantCatByTournCatId",
      error
    );
    throw error;
  }
};

const getSportsIdByTournCatId = async (
  tournament_category_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
      t.sports_refid
    from
      tournament_categories tc
    left join tournaments t on
      t.tournament_id = tc.tournament_refid
    where
      tc.tournament_category_id = ${tournament_category_id}`;
    result = await transaction.oneOrNone(query, [tournament_category_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in tournament_categories getById", error);
    throw error;
  }
};

const getByTournamentId = async (tournament_refid, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select * from tournament_categories where tournament_refid = $1";
    result = await transaction.manyOrNone(query, [tournament_refid]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in tournament_categories getByTournamentId",
      error
    );
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from tournament_categories;";
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in TournamentCategoriesDao getAll", error);
    throw error;
  }
};

const deleteById = async (tournament_category_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;

    let query =
      "delete from tournament_categories where tournament_category_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [tournament_category_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in TournamentCategoriesDao deleteById", error);
    throw error;
  }
};

const deleteByEventId = async (event_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;

    let query =
      "delete from tournament_categories tc where tc.tournament_refid in (select t.tournament_id from tournaments t where t.event_refid=$1) RETURNING *";
    result = await transaction.manyOrNone(query, [event_id]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in TournamentCategoriesDao deleteByEventId",
      error
    );
    throw error;
  }
};

const getTournamentCategoryPrize = async (
  category_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select count(*) from tournament_categories tc where tc.tournament_category_prizes && array [${category_id}]`;
    result = await transaction.oneOrNone(query, []);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in tournament_categories getTornamentCategoryPrize",
      error
    );
    throw error;
  }
};

const getDetailsForOrganizerEmail = async (
  tournament_category_id,
  team_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
      c3.company_name as parent_page_name,
      c2.company_name as second_level_page_name,
      array_agg(c.company_name) as third_level_page_name,
      e.event_name ,
      e.event_contacts ,
      s.sports_name ,
      s.sports_category ,
      tc.tournament_category,
      c.company_email as third_level_page_email,
      c3.company_email as parent_page_email,
      u.user_email
    from
      tournament_categories tc
    left join tournament_player_registration tpr on
      tpr.tournament_category_id = tc.tournament_category_id
    left join teams t on
      t.team_id = tpr.team_id
    left join company c on
      c.company_id = t.company_id
    left join company c2 on
      c.parent_company_id = c2.company_id
    left join company c3 on
      c2.parent_company_id = c3.company_id
    left join tournaments t2 on
      t2.tournament_id = tc.tournament_refid
    left join events e on 
      e.event_id = t2.event_refid
    left join company_users cu on
      cu.company_id = c.company_id
    left join users u on
      u.user_id = cu.user_id
    left join sports s on
      s.sports_id = t2.sports_refid
    where
      tc.tournament_category_id = ${tournament_category_id}
      and t.team_id = '${team_id}'
    group by
      tc.tournament_category_id ,
      c3.company_name ,
      c2.company_name,
      e.event_name ,
      e.event_contacts ,
      s.sports_name ,
      s.sports_category ,
      c.company_email ,
      c3.company_email,
      u.user_email `;
    result = await transaction.oneOrNone(query, [
      tournament_category_id,
      team_id,
    ]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in Tournament Categories getDetailsForOrganizerEmail",
      error
    );
    throw error;
  }
};

const getEventOrganizerDetails = async (
  tournament_category_id,
  id,
  type = null,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let typeName = type;
    let query = `select
      c3.company_name as parent_page_name,
      c2.company_name as second_level_page_name,
      array_agg(c.company_name) as third_level_page_name,
      e.event_name ,
      e.event_contacts ,
      s.sports_name ,
      s.sports_category ,
      tc.tournament_category,
      c.company_email as third_level_page_email,
      c3.company_email as parent_page_email,
      c3.company_contact_no as parent_page_contact_number,
      u.user_email as team_page_owner_email,
      concat(u.first_name, ' ', u.last_name)as team_page_owner_name,
      u.user_phone as team_page_owner_contact_number,
      c4.company_name as event_owner_page_name,
      u2.user_email as event_owner_user_email,
      c4.company_email as event_owner_page_email,
      c4.company_contact_no as event_owner_page_contact_no,
      u2.user_phone as event_owner_user_contact_no,
      concat(u2.first_name, ' ', u2.last_name)as event_owner_user_name,
      c3.company_email as parent_page_email,
      c3.company_contact_no as parent_page_contact_no
    from
      tournament_categories tc
    left join tournament_player_registration tpr on
      tpr.tournament_category_id = tc.tournament_category_id
    left join teams t on
      t.team_id = tpr.team_id
    left join company c on
      c.company_id = t.company_id
    left join company c2 on
      c.parent_company_id = c2.company_id
    left join company c3 on
      c2.parent_company_id = c3.company_id
    left join tournaments t2 on
      t2.tournament_id = tc.tournament_refid
    left join events e on
      e.event_id = t2.event_refid
    left join event_organizer eo on
      eo.event_refid = e.event_id
    left join organizer o on
      eo.organizer_refid = o.organizer_id
    left join company c4 on
      c4.company_id = o.company_refid
    left join company_users cu2 on
      cu2.company_id = c4.company_id
    left join users u2 on
      u2.user_id = cu2.user_id
    left join company_users cu on
      cu.company_id = c.company_id
    left join users u on
      u.user_id = cu.user_id
    left join sports s on
      s.sports_id = t2.sports_refid
    where
      tc.tournament_category_id = ${tournament_category_id}
       ${
         typeName === "player"
           ? " and tpr.player_id "
           : typeName === "team"
           ? " and tpr.team_id "
           : " and 1 "
       } = '${id}'
    group by
      tc.tournament_category_id ,
      c3.company_name ,
      c2.company_name,
      e.event_name ,
      e.event_contacts ,
      s.sports_name ,
      s.sports_category ,
      c.company_email ,
      c3.company_email,
      u.user_email,
      c4.company_name,
      u2.user_email ,
      c4.company_email,
      c4.company_contact_no,
      u2.user_phone,
      u2.first_name,
      u2.last_name,
      c3.company_email,
      c3.company_contact_no,
      u.first_name ,
      u.last_name ,
      u.user_phone `;
    result = await transaction.oneOrNone(query, [tournament_category_id, id]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in Tournament Categories getEventOrganizerDetails",
      error
    );
    throw error;
  }
};

module.exports = {
  add,
  getById,
  getAll,
  deleteById,
  deleteByEventId,
  edit,
  getTournamentCategoryPrize,
  getByTournamentId,
  getSportsIdByTournCatId,
  getParticipantCatByTournCatId,
  getDetailsForOrganizerEmail,
  getEventOrganizerDetails,
};
