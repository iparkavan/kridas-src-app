const db = require("../utils/db");
const { v4: uuidv4 } = require("uuid");

const add = async (
  event_contacts,
  event_name,
  event_short_desc,
  event_desc,
  parent_event_id,
  event_startdate,
  event_enddate,
  event_reg_startdate,
  event_reg_lastdate,
  event_regfee,
  event_regfee_currency,
  event_banner,
  event_banner_meta,
  event_logo,
  event_logo_meta,
  event_status,
  event_rules,
  is_public_event,
  collect_pymt_online,
  collect_pymt_offline,
  event_venue,
  event_venue_other,
  virtual_venue_url,
  standard_playing_conditions,
  standard_event_rules,
  indemnity_clause,
  agree_to_terms,
  search_tags,
  location_code,
  event_doc,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO events (event_id,event_contacts, event_name , event_short_desc, event_desc,parent_event_id,event_startdate,event_enddate,event_reg_startdate,event_reg_lastdate,event_regfee,event_regfee_currency,event_banner,event_banner_meta,event_logo,event_logo_meta,event_status,event_rules,is_public_event,collect_pymt_online,collect_pymt_offline,event_venue,event_venue_other,virtual_venue_url,
      standard_playing_conditions,standard_event_rules,indemnity_clause,agree_to_terms,search_tags,location_code,event_doc,created_date,updated_date) 
        values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33) RETURNING *`;
    result = await transaction.one(query, [
      uuidv4,
      event_contacts !== null ? JSON.stringify(event_contacts) : null,
      event_name,
      event_short_desc,
      event_desc,
      parent_event_id,
      event_startdate,
      event_enddate,
      event_reg_startdate,
      event_reg_lastdate,
      event_regfee,
      event_regfee_currency,
      event_banner,
      event_banner_meta !== null ? JSON.stringify(event_banner_meta) : null,
      event_logo,
      event_logo_meta !== null ? JSON.stringify(event_logo_meta) : null,
      event_status,
      event_rules,
      is_public_event,
      collect_pymt_online,
      collect_pymt_offline,
      event_venue,
      event_venue_other,
      virtual_venue_url,
      standard_playing_conditions,
      standard_event_rules,
      indemnity_clause,
      agree_to_terms,
      search_tags,
      location_code,
      event_doc,
      currentDate,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in eventsDao add", error);
    throw error;
  }
};

const edit = async (
  event_contacts,
  event_name,
  event_short_desc,
  event_desc,
  parent_event_id,
  event_startdate,
  event_enddate,
  event_reg_startdate,
  event_reg_lastdate,
  event_regfee,
  event_regfee_currency,
  event_banner,
  event_banner_meta,
  event_logo,
  event_logo_meta,
  event_status,
  event_rules,
  is_public_event,
  collect_pymt_online,
  collect_pymt_offline,
  event_venue,
  event_venue_other,
  virtual_venue_url,
  standard_playing_conditions,
  standard_event_rules,
  indemnity_clause,
  agree_to_terms,
  search_tags,
  location_code,
  stream_url,
  event_doc,
  event_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update events  set event_contacts=$1,event_name=$2,event_short_desc=$3,event_desc=$4,
        parent_event_id=$5,event_startdate=$6,event_enddate=$7,event_reg_startdate=$8,event_reg_lastdate=$9,
        event_regfee=$10,event_regfee_currency=$11,event_banner=$12,event_banner_meta=$13,event_logo=$14,
        event_logo_meta=$15,event_status=$16,event_rules=$17,is_public_event=$18,collect_pymt_online=$19,
        collect_pymt_offline=$20,event_venue=$21::uuid[],event_venue_other=$22,virtual_venue_url=$23,standard_playing_conditions=$24,
        standard_event_rules=$25,indemnity_clause=$26,agree_to_terms=$27,search_tags=$28,location_code=$29,stream_url=$30,
        event_doc=$31,updated_date=$32
        where event_id=$33 RETURNING *`;
    result = await transaction.one(query, [
      event_contacts !== null ? JSON.stringify(event_contacts) : null,
      event_name,
      event_short_desc,
      event_desc,
      parent_event_id,
      event_startdate,
      event_enddate,
      event_reg_startdate,
      event_reg_lastdate,
      event_regfee,
      event_regfee_currency,
      event_banner,
      event_banner_meta !== null ? JSON.stringify(event_banner_meta) : null,
      event_logo,
      event_logo_meta !== null ? JSON.stringify(event_logo_meta) : null,
      event_status,
      event_rules,
      is_public_event,
      collect_pymt_online,
      collect_pymt_offline,
      event_venue,
      event_venue_other,
      virtual_venue_url,
      standard_playing_conditions,
      standard_event_rules,
      indemnity_clause,
      agree_to_terms,
      search_tags,
      location_code,
      stream_url,
      event_doc,
      currentDate,
      event_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in evensDao edit", error);
    throw error;
  }
};

const getById = async (event_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select 
    e.*,
    row_to_json(c.*) as company,
    cu.user_id as created_by,
    em.event_category_refid,
    c1.category_name,
    jsonb_agg(jsonb_build_object('sport_id', t.sports_refid , 'sport_name', s.sports_name , 'tournament_category', tc.tournament_category, 'tournament_format', tc.tournament_format, 'sport_desc', tc.tournament_category_desc, 'tournament_config', tc.tournament_config, 'reg_fee', tc.reg_fee , 'reg_fee_currency', tc.reg_fee_currency  , 'tournament_category_id', tc.tournament_category_id, 'tournament_category_prizes', tc.tournament_category_prizes, 'doc_list', tc.doc_list, 'tournament_id', t.tournament_id , 'sport_category', s.sports_category, 'is_delete', 'N')) as sport_list,
    row_to_json(v.*) as feed
  from	
    events e
  left join (select distinct event_refid,tournament_refid,organizer_refid,organizer_role from  event_organizer) eo on
    e.event_id = eo.event_refid
  left join organizer o on
    o.organizer_id = eo.organizer_refid
  left join company c on
    c.company_id = o.company_refid
  left join company_users cu on
    cu.company_id = c.company_id
    and cu.user_type ='p' 
  left join events_master em on
    em.event_master_id = e.parent_event_id
  left join category c1 on
    c1.category_id = em.event_category_refid
  left join tournaments t on
    t.event_refid = e.event_id
  left join sports s on
    t.sports_refid = s.sports_id
  left join tournament_categories tc on
    tc.tournament_refid = t.tournament_id
  left join (
    select
      f.* as feed,
      row_to_json(u)::jsonb as user,
      row_to_json(c)::jsonb as company
    from
      feeds f
    left join users u on
      u.user_id = f.feed_creator_user_id
    left join company c on
      c.company_id = f.feed_creator_company_id
    where
      f.event_id = $1
      and f.is_delete = 'false'
    order by
      f.created_date asc
    limit 1)v on
    v.event_id = e.event_id
  where
    e.event_id = $1
  group by
    e.event_id ,
    em.event_category_refid,
    c1.category_name,
    c.*,
    cu.user_id ,
    v.*
    `;
    result = await transaction.oneOrNone(query, [event_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in eventsDao getById", error);
    throw error;
  }
};

const updateIsFeature = async (is_featured, event_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update events set is_featured = $1,updated_date = $2 where event_id =$3 returning *`;
    result = await transaction.one(query, [is_featured, currentDate, event_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in eventsDao updateIsFeature", error);
    throw error;
  }
};

const getEventVenueCount = async (company_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
            count(*)
        from
            events e 
        where
            e.event_venue && array ['${company_id}']::uuid[]`;
    result = await transaction.oneOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in eventsDao getEventVenueCount", error);
    throw error;
  }
};

const getEventData = async (event_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select e.*,row_to_json(c.*) as company,cu.user_id as created_by, em.event_category_refid, c1.category_name from events e left join event_organizer eo on e.event_id = eo.event_refid left join organizer o on o.organizer_id = eo.organizer_refid left join company c on c.company_id = o.company_refid left join company_users cu on cu.company_id = c.company_id and cu.user_type ='p'  left join events_master em on em.event_master_id = e.parent_event_id left join category c1 on c1.category_id =em.event_category_refid where e.event_id ='${event_id}' group by e.event_id ,em.event_category_refid, c1.category_name,c.*, cu.user_id`;
    result = await transaction.oneOrNone(query, [event_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in eventsDao getEventData", error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
      e.* ,
      c.category_name
    from
      events e
    left join events_master em on
      em.event_master_id = e.parent_event_id
    left join category c on
      c.category_id = em.event_category_refid
    where
      e.event_status = 'PUB'
    order by
      e.updated_date desc
    `;

    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in eventsDao getAll", error);
    throw error;
  }
};

const deleteById = async (event_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "delete from events where event_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [event_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in eventsDao deleteById", error);
    throw error;
  }
};

const fetchEventFollowerList = async (event_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
        u.user_id as id,
        concat(u.first_name, ' ', u.last_name) as name,
        u.user_profile_img as avatar,
        u.user_img as banner,
        'U' as type,
        u.bio_details as bio,
        null as category_id,
        null as category_name,
        null as description
    from
        follower f
    inner join users u on
        u.user_id = f.follower_userid
    where
        f.following_event_id = '${event_id}'
        and f.is_delete = false`;
    result = await transaction.manyOrNone(query, [event_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in eventsDao fetchEventFollowerList", error);
    throw error;
  }
};

module.exports = {
  add,
  edit,
  getById,
  getEventVenueCount,
  getAll,
  deleteById,
  fetchEventFollowerList,
  getEventData,
  updateIsFeature,
};
