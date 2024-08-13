const db = require("../utils/db");

const add = async (
  sponsor_id,
  company_id,
  sponsor_type_id,
  is_featured,
  seq_number,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `INSERT INTO company_sponsor (sponsor_id,company_id,sponsor_type_id, is_featured,seq_number,created_date, updated_date) 
        values ($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
    result = await transaction.one(query, [
      sponsor_id,
      company_id,
      sponsor_type_id,
      is_featured,
      seq_number,
      currentDate,
      currentDate,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in company sponsor dao add", error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from company_sponsor";
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in company sponsor dao getAll", error);
    throw error;
  }
};

const getById = async (company_sponsor_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from company_sponsor where company_sponsor_id = $1";
    result = await transaction.oneOrNone(query, [company_sponsor_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in company sponsor dao getById", error);
    throw error;
  }
};

const getBySponsorTypeId = async (sponsor_type_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from company_sponsor where sponsor_type_id = $1";
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

const getCompanySponsorCount = async (
  company_id,
  sponsor_type_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "	select count(*) from company_sponsor cs where cs.company_id =$1 and cs.sponsor_type_id =$2";
    result = await transaction.oneOrNone(query, [company_id, sponsor_type_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in company sponsor dao getById", error);
    throw error;
  }
};

const getCompanySponsorBySponsorId = async (
  company_id,
  sponsor_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "	select * from company_sponsor cs where cs.company_id =$1 and cs.sponsor_id =$2";
    result = await transaction.oneOrNone(query, [company_id, sponsor_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in company sponsor dao getById", error);
    throw error;
  }
};

const getByCompanyId = async (company_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
        row_to_json(cst.*) as company_sponsor_type ,
        n.*
    from
        company_sponsor_type cst
    left join (
      select
        row_to_json(cs.*)as company_sponsor ,
        row_to_json(s.*) as sponsor,
        cs.sponsor_type_id 
      from
        company_sponsor cs
      left join sponsor s on
        s.sponsor_id = cs.sponsor_id
      where
        cs.company_id = $1
      order by
        cs.seq_number desc)n
      on
      n.sponsor_type_id =cst.company_sponsor_type_id 
    where
        cst.company_id = $1
        and cst.is_deleted = false
    order by
        cst.sort_order asc`;
    result = await transaction.manyOrNone(query, [company_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in company sponsor dao getByCompanyId", error);
    throw error;
  }
};

const getByIsFeature = async (
  is_featured,
  sort_order,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
      s.* ,
      row_to_json(c.*) as company ,
      row_to_json(cst.*)as company_sponsor_type 
    from
      company_sponsor cs
    left join sponsor s on
      s.sponsor_id = cs.sponsor_id
    left join company c on
    c.company_id =cs.company_id 
    left join company_sponsor_type cst on
    cst.company_id =cs.company_id 
    where
      cs.is_featured = ${is_featured}
      order by cst.sort_order ${sort_order}`;
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in company sponsor dao getByIsFeature", error);
    throw error;
  }
};

const edit = async (
  sponsor_id,
  company_id,
  sponsor_type_id,
  is_featured,
  seq_number,
  company_sponsor_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update company_sponsor set sponsor_id=$1, company_id=$2,sponsor_type_id=$3, is_featured=$4,seq_number=$5, updated_date=$6 where company_sponsor_id=$7 RETURNING *`;
    result = await transaction.one(query, [
      sponsor_id,
      company_id,
      sponsor_type_id,
      is_featured,
      seq_number,
      currentDate,
      company_sponsor_id,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in company sponsor  dao edit", error);
    throw error;
  }
};

const updateBySponsorId = async (
  sponsor_id,
  company_id,
  sponsor_type_id,
  is_featured,
  seq_number,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update company_sponsor set  company_id=$1,sponsor_type_id=$2, is_featured=$3,seq_number=$4, updated_date=$5 where sponsor_id=$6 RETURNING *`;
    result = await transaction.one(query, [
      company_id,
      sponsor_type_id,
      is_featured,
      seq_number,
      currentDate,
      sponsor_id,
    ]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in company sponsor dao updateBySponsorId",
      error
    );
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
    let currentDate = new Date();
    let query = `update company_sponsor set  seq_number=$1,sponsor_type_id=$2, updated_date=$3 where sponsor_id=$4 RETURNING *`;
    result = await transaction.one(query, [
      seq_number,
      sponsor_type_id,
      currentDate,
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

const deleteById = async (company_sponsor_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;

    let query =
      "delete from company_sponsor where company_sponsor_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [company_sponsor_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in company sponsor dao delete", error);
    throw error;
  }
};

const deleteBySponsorTypeId = async (sponsor_type_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "delete from company_sponsor where sponsor_type_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [sponsor_type_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in company sponsor dao delete", error);
    throw error;
  }
};

module.exports = {
  getAll,
  add,
  getById,
  getByIsFeature,
  getByCompanyId,
  edit,
  deleteById,
  updateBySponsorId,
  getCompanySponsorCount,
  updateSeqNoBySponsorId,
  deleteBySponsorTypeId,
  getCompanySponsorBySponsorId,
  getBySponsorTypeId,
};
