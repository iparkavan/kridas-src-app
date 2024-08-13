const db = require("../utils/db");
const { v4: uuidv4 } = require("uuid");
// const { result } = require('../utils/db');

const add = async (
  company_name,
  company_reg_no,
  companyProfileImage,
  company_email,
  company_contact_no,
  company_website,
  company_desc,
  alternate_name,
  imageUrl,
  social,
  address,
  identity_docs,
  reset_token,
  parent_company_id,
  company_type,
  company_profile_verified,
  company_public_url_name,
  main_category_type,
  company_contacts,
  company_tax_info,
  company_bank_details,
  connectionObj = null,
  category_id = 0,
  company_category = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let company_referral_code = await transaction.one(
      `select concat('PAG',lpad(nextval('page_sequence')::text,8,'0'))`,
      []
    );
    let query = `INSERT INTO company (company_id,company_name,company_reg_no,company_profile_img,
      company_email,company_contact_no,company_website,company_desc,alternate_name,company_img,
      social,address,company_identity_docs,reset_token,parent_company_id,company_type,created_date,
      updated_date,company_profile_verified,company_public_url_name,company_referral_code,
      main_category_type,company_contacts,company_tax_info,company_bank_details,category_id,company_category) 
        values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,
          $16::integer[],$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27::integer[]) RETURNING *`;
    result = await transaction.one(query, [
      uuidv4(),
      company_name,
      company_reg_no,
      companyProfileImage,
      company_email,
      company_contact_no,
      company_website,
      company_desc,
      alternate_name,
      imageUrl,
      social,
      address,
      identity_docs,
      reset_token,
      parent_company_id,
      company_type,
      currentDate,
      currentDate,
      company_profile_verified,
      company_public_url_name.toLowerCase(),
      company_referral_code.concat,
      main_category_type,
      company_contacts,
      company_tax_info,
      company_bank_details,
      category_id,
      company_category,
    ]);
    return result;
  } catch (error) {
    console.log("Error occurred in company add", error);
    throw error;
  }
};

const edit = async (
  company_name,
  company_reg_no,
  companyProfileImage,
  company_email,
  company_contact_no,
  company_website,
  company_desc,
  alternate_name,
  imageUrl,
  social,
  address,
  identity_docs,
  parent_company_id,
  company_type,
  company_profile_verified,
  company_status,
  company_id,
  company_profile_img_meta,
  company_img_meta,
  // company_public_url_name,
  main_category_type,
  // is_featured,
  company_contacts,
  company_tax_info,
  company_bank_details,
  category_id,
  company_category,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update company set company_name=$1,company_reg_no=$2,company_profile_img=$3,
    company_email=$4,company_contact_no=$5,company_website=$6,company_desc=$7,alternate_name=$8,
    company_img=$9,social=$10,address=$11,company_identity_docs=$12,parent_company_id=$13,
    company_type=$14::integer[],updated_date=$15,company_profile_verified=$16,company_status=$17,
    company_profile_img_meta =$19, company_img_meta =$20 ,main_category_type=$21,
    company_contacts=$22,company_tax_info=$23,company_bank_details=$24,category_id=$25,company_category=$26::integer[]
     where company_id =$18 RETURNING *`;
    result = await transaction.one(query, [
      company_name,
      company_reg_no,
      companyProfileImage,
      company_email,
      company_contact_no,
      company_website,
      company_desc,
      alternate_name,
      imageUrl,
      social,
      address,
      identity_docs,
      parent_company_id,
      company_type,
      currentDate,
      company_profile_verified,
      company_status,
      company_id,
      company_profile_img_meta,
      company_img_meta,
      // company_public_url_name,
      main_category_type,
      company_contacts,
      company_tax_info,
      company_bank_details,
      category_id,
      company_category,
    ]);
    return result;
  } catch (error) {
    // if (error.constraint === 'company_public_url_name_unique') {
    //     result = { message: "Company Public Url Name Already Exists." }
    //     return result;
    // }
    console.log("Error occurred in companyDao edit", error);
    throw error;
  }
};

const updateByToken = async (company_status, token, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let token_data = null;
    let query = `update company set company_status=$1,reset_token=$2,updated_date=$3 where reset_token=$4 RETURNING *`;
    result = await transaction.one(query, [
      company_status,
      token_data,
      currentDate,
      token,
    ]);

    return result;
  } catch (error) {
    console.log("Error occurred in companyDao updateByToken", error);
    throw error;
  }
};

const getById = async (company_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from company where company_id = $1";
    result = await transaction.oneOrNone(query, [company_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyDao getById", error);
    throw error;
  }
};

const getByIdWithCatDetails = async (company_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
    c.*,
    t.*,
    u.user_id as created_by ,
    a.sports_interested,
    cat.category_name as parent_category_name,
    cat.parent_category_id,
    cat.category_type as parent_category_type,
    case
      when c.parent_company_id is null then jsonb_build_object('company_type', 'Parent Page', 'parent_page_id', c.company_id)
      when c2.company_id is not null
      and c4.company_id is null then jsonb_build_object('company_type', 'Child Page', 'parent_page_id', c.parent_company_id)
      when c2.company_id is not null
      and c4.company_id is not null then jsonb_build_object('company_type', 'SubTeam Page', 'parent_page_id', c4.company_id)
    end as company_type_name,
    p.sports_interested_name
  from
    company c
  left join category cat on
    cat.category_id = c.main_category_type
  left join (
    select
      t.company_id as page_id,
      ARRAY_AGG(row_to_json(c3.*)) as category_arr
    from
      (
      select
        company_id,
        unnest(c.company_type) category_id
      from
        company c) t
    left join category c3 on
      c3.category_id = t.category_id
    group by
      t.company_id ) t on
    c.company_id = t.page_id
  left join company_users cu on
    cu.company_id = c.company_id
    and cu.user_type = 'p'
  left join users u on
    u.user_id = cu.user_id
  left join (
    select
      array_agg(cs.sports_refid) as sports_interested,
      cs.company_id
    from
      company_sport cs
    where
      cs.company_id = '${company_id}'
      and cs.is_deleted = false
    group by
      cs.company_id)a on
    a.company_id = c.company_id
  left join company c2 on
    c2.company_id = c.parent_company_id
  left join company c4 on
    c4.company_id = c2.parent_company_id
  left join (
    select
      array_agg(s.sports_name) as sports_interested_name,
      v.company_id
    from
      sports s
    inner join (
      select
        cs.sports_refid as sports_interested,
        cs.company_id
      from
        company_sport cs
      where
        cs.company_id = '${company_id}'
        and cs.is_deleted = false
  )v
  on
      v.sports_interested = s.sports_id
    group by
      v.company_id)p on
    p.company_id = c.company_id
  where
    c.company_id = '${company_id}'`;
    result = await transaction.oneOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in companyDao getByIdWithCatDetails", error);
    throw error;
  }
};

const fetchCompanyName = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select ARRAY_AGG(c.company_name),  s1.sports_name from company c   left join (select UNNEST(s.sports_brand) sports_brand_name , s.* from sports s) s1  on s1.sports_brand_name=c.company_id where s1.sports_brand_name is not null group by s1.sports_name";
    result = await transaction.oneOrNone(query);
    return result;
  } catch (error) {
    console.log("Error occurred in companyDao getById", error);
    throw error;
  }
};

const getCompanyByUserId = async (user_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select c.*,cu2.user_id from company c ,company_users cu2 where cu2.user_id =$1 and cu2.company_id =c.company_id ";

    //   let query = `select
    //   c.*,
    //   cu.user_id ,
    //   s.pages as parent_company
    // from
    //   company_users cu
    // left join company c on
    //   c.company_id = cu.company_id
    // left join (
    //   select
    //     array_agg(c.*) as pages,
    //     c.company_id
    //   from
    //     company_users cu
    //   left join company c on
    //     cu.company_id = c.company_id
    //   left join company_team_players ctp on
    //     ctp.company_id = c.company_id
    //   left join users u on
    //     u.user_id = ctp.user_id
    //   where
    //     c.company_type <@ (
    //     select
    //       array_agg(c2.category_id)
    //     from
    //       category c2
    //     where
    //       c2.category_type = 'TEA'
    //       and c2.parent_category_id in (
    //       select
    //         c3.category_id
    //       from
    //         category c3
    //       where
    //         c3.category_type = 'CLB'))
    //     and c.parent_company_id is null
    //     and cu.user_id = '${user_id}'
    //     and (cu.user_role = 'ADM'
    //       or cu.user_role = 'PDM')
    //     and c.main_category_type =(
    //     select
    //       c3.category_id
    //     from
    //       category c3
    //     where
    //       c3.category_type = 'CLB')
    //   group by
    //     c.company_id )s on
    //     s.company_id = c.company_id
    // where
    //   cu.user_id = '${user_id}'`;

    result = await transaction.manyOrNone(query, [user_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyDao getById", error);
    throw error;
  }
};

const getByEmail = async (email, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from company where company_email = $1";
    result = await transaction.manyOrNone(query, [email]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyDao getByEmail", error);
    throw error;
  }
};

const getByType = async (type, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "SELECT company_name,company_id ,company_type from company where  company_type && array[$1];";
    result = await transaction.manyOrNone(query, [type]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyDao getByType", error);
    throw error;
  }
};

const getByToken = async (token, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from company where reset_token = $1";
    result = await transaction.oneOrNone(query, [token]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyDao getByToken", error);
    throw error;
  }
};

const getAll = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
      c.*,
      CONCAT(u.first_name, ' ', u.last_name) as name,
      c2.category_name
    from
      company c
    left join company_users cu on
      c.company_id = cu.company_id
      and cu.user_type = 'p'
    left join users u on
      u.user_id = cu.user_id
    left join category c2 
            on
      c2.category_id = c.main_category_type
    order by
      updated_date desc`;
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in companyDao getAll", error);
    throw error;
  }
};

const deleteById = async (company_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "delete from company where company_id = $1 RETURNING *";
    result = await transaction.oneOrNone(query, [company_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyDao deleteById", error);
    throw error;
  }
};

const checkDuplicate = async (sport_name, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select count(*) from sports where sports_name = $1";
    result = await transaction.oneOrNone(query, [sport_name]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyDao checkDuplicate", error);
    throw error;
  }
};

const fetchCompanyByName = async (company_name, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from company where lower(company_name) = lower($1)";
    result = await transaction.oneOrNone(query, [company_name]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyDao getcompanyname", error);
    throw error;
  }
};

const fetchCompaniesByName = async (company_name, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from company where lower(company_name) = lower($1)";
    result = await transaction.manyOrNone(query, [company_name]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyDao getcompanyname", error);
    throw error;
  }
};

const fetchCompanyByNameandUserId = async (
  company_name,
  user_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
            *
        from
            company c
        left join company_users cu on
            cu.company_id = c.company_id
            and cu.user_type ='p' 
        where
            lower(c.company_name) = lower($1)
            and cu.user_id = $2`;

    result = await transaction.oneOrNone(query, [company_name, user_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyDao getcompanyname", error);
    throw error;
  }
};

const getCompanyNameCount = async (company_name, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select count(*) from company c where replace(lower(c.company_name), ' ', '') = replace(lower($1), ' ', '')`;
    result = await transaction.manyOrNone(query, [company_name]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyDao getcompanyname", error);
    throw error;
  }
};

const getAllCompanyCount = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select count(*) from company";
    result = await transaction.one(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in companyDao getAllCompanyCount", error);
    throw error;
  }
};

const getByParentId = async (parent_company_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query =
      "select * from company where parent_company_id = $1 or company_id = $1 order by parent_company_id desc, company_id";
    result = await transaction.manyOrNone(query, [parent_company_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyDao getByParentId", error);
    throw error;
  }
};

const fetchCompanyUser = async (company_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select cu.user_id from company_users cu where cu.company_id = '${company_id}' and cu.user_type ='p' `;
    result = await transaction.oneOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in companyDao fetchCompanyUser", error);
    throw error;
  }
};

const fetchAllParentCompany = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from company where parent_company_id is null";
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in companyDao fetchAllParentCompany", error);
    throw error;
  }
};

const companyDocumentUppdate = async (
  doc,
  company_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update company set company_identity_docs=$1,updated_date=$2 where company_id=$3 RETURNING *`;
    result = await transaction.oneOrNone(query, [doc, currentDate, company_id]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyDao documentUppdate", error);
    throw error;
  }
};

const getCompanyFollower = async (company_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select c.company_id as id, c.company_name as name, c.company_profile_img as avatar,c.company_img as banner, 'C' as type,
        null as bio,
        c3.category_id,
        c3.category_name,
        c.company_desc as description
         from follower f 
            inner join company c  on
            c.company_id = f.follower_companyid 
            left join category c3 on 
    c.main_category_type = c3.category_id
            where f.following_companyid = '${company_id}' and f.is_delete = false
            union all 
            select u.user_id as id, concat(u.first_name, ' ', u.last_name) as name, u.user_profile_img as avatar,u.user_img as banner, 'U' as type,  u.bio_details as bio,
        null as category_id,
        null as category_name,
        null as description from follower f 
            inner join users u on
            u.user_id = f.follower_userid 
            where f.following_companyid = '${company_id}' and f.is_delete = false
    `;
    result = await transaction.manyOrNone(query);
    return result;
  } catch (error) {
    console.log("Error occurred in companyDao getCompanyFollower", error);
    throw error;
  }
};

const getCompanyFollowing = async (company_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select c.company_id as id, c.company_name as name, c.company_profile_img as avatar,c.company_img as banner, 'C' as type,
        null as bio,
           c3.category_id,
           c3.category_name,
           c.company_desc as description from follower f 
               inner join company c 
               on c.company_id =f.following_companyid
                left join category c3 on 
       c.main_category_type = c3.category_id
               where f.follower_companyid = '${company_id}' and f.follower_companyid notnull and f.is_delete=false`;
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in companyDao getCompanyFollowing", error);
    throw error;
  }
};

const companyProfileVerified = async (company_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `update company set company_profile_verified = true where company_id ='${company_id}'`;
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in companyDao companyProfileVerified", error);
    throw error;
  }
};

const getPublicUrlNameCount = async (
  company_public_url_name,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select count(*) from company where company_public_url_name=$1`;
    result = await transaction.oneOrNone(query, [company_public_url_name]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyDao getById", error);
    throw error;
  }
};

const getCompanyUrlName = async (
  company_public_url_name,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = "select * from company where company_public_url_name = $1";
    result = await transaction.oneOrNone(query, [company_public_url_name]);
    return result;
  } catch (error) {
    console.log("Error occurred in companyDao getCompanyUrlName", error);
    throw error;
  }
};

const getCompanyType = async (category_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select count(*) from company c where array[c.company_type] <@ array [${category_id}]`;
    result = await transaction.oneOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in companyDao getCompanyType", error);
    throw error;
  }
};

const getByParentCompanyId = async (company_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;

    let query = `select
        c.*,
        t.*,
        cat.category_type as parent_category_type,
        jsonb_build_object('company_type', 'Child Page', 'parent_page_id', c.parent_company_id) as company_type_name
    from
        company c
    left join (
      select
        t.company_id as page_id,
        ARRAY_AGG(row_to_json(c3.*)) as category_arr
      from
        (
        select
          company_id,
          unnest(c.company_type) category_id
        from
          company c) t
      left join category c3 on
        c3.category_id = t.category_id
      group by
        t.company_id ) t on
      c.company_id = t.page_id
    left join category cat on
      cat.category_id = c.main_category_type
    where
        c.parent_company_id = '${company_id}'`;
    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in companyDao getByParentCompanyId", error);
    throw error;
  }
};

const getAllChildAndSubPagesByParentPageId = async (
  company_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
      c.company_id as parent_page_id ,
      array_agg( c2.company_id) as child_page_id,
      array_agg(c3.company_id) as sub_team_page_id
    from
      company c
    left join company c2 on
      c2.parent_company_id = c.company_id
    left join company c3 on
      c3.parent_company_id = c2.company_id
    where
      c.company_id = '${company_id}'
      group by c.company_id `;
    result = await transaction.oneOrNone(query, []);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in companyDao getAllChildAndSubPagesByParentPageId",
      error
    );
    throw error;
  }
};

const getByCompanyPublicURLName = async (
  companyPublicURLName,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select count(*) from company c where c.company_public_url_name =lower($1)`;

    result = await transaction.oneOrNone(query, [companyPublicURLName]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in companyDao getByCompanyPublicURLName",
      error
    );
    throw error;
  }
};

const getParentTeamPagesByUserId = async (user_id, connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
        c.* as pages
    from
        company_users cu
    left join company c on
        cu.company_id = c.company_id
    left join company_team_players ctp on
        ctp.company_id = c.company_id
    left join users u on
        u.user_id = ctp.user_id
    where
        c.company_type <@ (
      select
          array_agg(c2.category_id)
      from
          category c2
      where
          c2.category_type = 'TEA'
        and c2.parent_category_id in (
        select
            c3.category_id
        from
            category c3
        where
            c3.category_type = 'CLB'))
      and c.parent_company_id is null
      and cu.user_id = '${user_id}'
      and (cu.user_role = 'ADM'
        or cu.user_role = 'PDM')
      and c.main_category_type =(
      select
            c3.category_id
      from
            category c3
      where
            c3.category_type = 'CLB')
    group by
      c.company_id`;

    result = await transaction.manyOrNone(query, [user_id]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in companyDao getParenTeamPagesByUserId",
      error
    );
    throw error;
  }
};

const getParentCompanyByChildCompanyId = async (
  company_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `SELECT
      c.company_id
    FROM
      company c
    LEFT JOIN company c1
      ON
      c1.parent_company_id = c.company_id
    WHERE
      c1.company_id = '${company_id}'`;

    result = await transaction.oneOrNone(query, [company_id]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in companyDao getParentCompanyByChildCompanyId",
      error
    );
    throw error;
  }
};

const getAllCities = async (connectionObj = null) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let query = `select
      distinct c.address ->>'city' as city
    from
      company c
    where
      c.address ->>'city' is not null
      and c.address ->>'city' != ''`;

    result = await transaction.manyOrNone(query, []);
    return result;
  } catch (error) {
    console.log("Error occurred in companyDao getAllCities", error);
    throw error;
  }
};

const companyProfileVerification = async (
  company_profile_verified,
  company_id,
  connectionObj = null
) => {
  try {
    let transaction = connectionObj !== null ? connectionObj : db;
    let currentDate = new Date();
    let query = `update company set company_profile_verified=$1,updated_date=$2 where company_id =$3 RETURNING *`;
    result = await transaction.one(query, [
      company_profile_verified,
      currentDate,
      company_id,
    ]);
    return result;
  } catch (error) {
    console.log(
      "Error occurred in companyDao companyProfileVerification",
      error
    );
    throw error;
  }
};

module.exports = {
  add,
  edit,
  getById,
  getAll,
  deleteById,
  checkDuplicate,
  getByEmail,
  getByType,
  getByToken,
  updateByToken,
  fetchCompanyByName,
  getByParentId,
  fetchAllParentCompany,
  fetchCompanyName,
  getCompanyByUserId,
  getByIdWithCatDetails,
  companyDocumentUppdate,
  getCompanyFollower,
  getCompanyFollowing,
  companyProfileVerified,
  getCompanyNameCount,
  getAllCompanyCount,
  getPublicUrlNameCount,
  getCompanyUrlName,
  getCompanyType,
  fetchCompanyUser,
  fetchCompanyByNameandUserId,
  getByParentCompanyId,
  getAllChildAndSubPagesByParentPageId,
  getByCompanyPublicURLName,
  getParentTeamPagesByUserId,
  getParentCompanyByChildCompanyId,
  getAllCities,
  fetchCompaniesByName,
  companyProfileVerification,
};
