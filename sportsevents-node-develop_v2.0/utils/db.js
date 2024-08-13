const initOptions = {
  schema: ["public", "sportzplatform"] /* make both schemas visible */,
};
const pgp = require("pg-promise")(initOptions);
var db = pgp(process.env.DATABASE);

module.exports = db;
