const db = require("../utils/db");

const add = async (
  sponsor_id,
  event_id,
  tournamentid,
  is_featured,
  seq_number,
  sponsor_type_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO event_sponsor (sponsor_id,event_id,tournamentid,is_featured,seq_number,sponsor_type_id,created_date) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
    result = await transaction.one(query, [
      sponsor_id,
      event_id,
      tournamentid,
      is_featured,
      seq_number,
      sponsor_type_id,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in event_sponsor Dao add", error);
    throw error;
  }
};

const edit = async (
  sponsor_id,
  event_id,
  tournamentid,
  is_featured,
  seq_number,
  sponsor_type_id,
  event_sponsor_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `UPDATE event_sponsor SET sponsor_id=$1, event_id=$2,tournamentid=$3,is_featured=$4,seq_number=$5,sponsor_type_id=$6 WHERE event_sponsor_id=$7 RETURNING *`;
    result = await transaction.one(query, [
      sponsor_id,
      event_id,
      tournamentid,
      is_featured,
      seq_number,
      sponsor_type_id,
      event_sponsor_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in event_sponsor Dao Update", error);
    throw error;
  }
};

const getById = async (event_sponsor_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from event_sponsor where event_sponsor_id = $1";
    result = await transaction.oneOrNone(query, [event_sponsor_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in event_sponsor Dao getById", error);
    throw error;
  }
};

const getByEventId = async (event_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
        row_to_json(est.*) as event_sponsor_type ,
        n.*
      from
        event_sponsor_type est
      left join (
        select
          row_to_json(es.*)as event_sponsor ,
          row_to_json(s.*) as sponsor,
          es.sponsor_type_id
        from
          event_sponsor es
        left join sponsor s on
          s.sponsor_id = es.sponsor_id
        where
          es.event_id = $1
        order by
          es.seq_number desc)n
            on
        n.sponsor_type_id = est.event_sponsor_type_id
      where
        est.event_id = $1
        and est.is_deleted = false
      order by
        est.sort_order asc`;
    result = await transaction.manyOrNone(query, [event_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in eventSponsorDao getByEventId ", error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
      es.*,
      jsonb_build_object('id',e.event_id,'name',e.event_name,'logo',e.event_logo,'banner',e.event_banner,'type','E') as event_details 
    from
      event_sponsor es
    left join events e on
      e.event_id = es.event_id
    group by
      es.event_sponsor_id,e.event_id `;
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in eventSponsor getAll", error);
    throw error;
  }
};

const deleteById = async (event_sponsor_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "delete from event_sponsor where event_sponsor_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [event_sponsor_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in event_sponsor deleteById", error);
    throw error;
  }
};

const getEventSponsorCount = async (
  event_id,
  sponsor_type_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "	select count(*) from event_sponsor es where es.event_id =$1 and es.sponsor_type_id =$2";
    result = await transaction.oneOrNone(query, [event_id, sponsor_type_id]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in event sponsor dao getEventSponsorCount",
      error
    );
    throw error;
  }
};

const getEventSponsorBySponsorId = async (
  event_id,
  sponsor_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "	select * from event_sponsor cs where cs.event_id =$1 and cs.sponsor_id =$2";
    result = await transaction.oneOrNone(query, [event_id, sponsor_id]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in event sponsor dao getEventSponsorBySponsorId",
      error
    );
    throw error;
  }
};

const updateBySponsorId = async (
  sponsor_id,
  event_id,
  tournamentid,
  is_featured,
  seq_number,
  sponsor_type_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `UPDATE event_sponsor SET event_id=$1,tournamentid=$2,is_featured=$3,seq_number=$4,sponsor_type_id=$5 WHERE sponsor_id=$6 RETURNING *`;
    result = await transaction.one(query, [
      event_id,
      tournamentid,
      is_featured,
      seq_number,
      sponsor_type_id,
      sponsor_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in event_sponsor Dao updateBySponsorId", error);
    throw error;
  }
};

const getBySponsorTypeId = async (sponsor_type_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from event_sponsor where sponsor_type_id = $1";
    result = await transaction.manyOrNone(query, [sponsor_type_id]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in company sponsor dao getBySponsorTypeId",
      error
    );
    throw error;
  }
};

const deleteBySponsorTypeId = async (sponsor_type_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "delete from event_sponsor where sponsor_type_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [sponsor_type_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in event sponsor dao delete", error);
    throw error;
  }
};

const updateSeqNoBySponsorId = async (
  sponsor_id,
  sponsor_type_id,
  seq_number,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `update event_sponsor set  seq_number=$1,sponsor_type_id=$2 where sponsor_id=$3 RETURNING *`;
    result = await transaction.one(query, [
      seq_number,
      sponsor_type_id,
      sponsor_id,
    ]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in company sponsor dao updateSeqNoBySponsorId",
      error
    );
    throw error;
  }
};

module.exports = {
  add,
  edit,
  getById,
  getByEventId,
  getAll,
  deleteById,
  getEventSponsorCount,
  getEventSponsorBySponsorId,
  updateBySponsorId,
  getBySponsorTypeId,
  deleteBySponsorTypeId,
  updateSeqNoBySponsorId,
};
