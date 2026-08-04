require("dotenv").config();
const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

const database =
  process.env.NODE_ENV === "test"
    ? process.env.POSTGRES_DB_TEST
    : process.env.POSTGRES_DB;

const connectionString = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${database}`;

console.log("========== DATABASE DEBUG ==========");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("POSTGRES_HOST:", process.env.POSTGRES_HOST);
console.log("POSTGRES_PORT:", process.env.POSTGRES_PORT);
console.log("POSTGRES_DB:", process.env.POSTGRES_DB);
console.log("POSTGRES_USER:", process.env.POSTGRES_USER);
console.log("Connection String:", connectionString);
console.log("====================================");

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

const originalQuery = pool.query.bind(pool);

pool.query = async (...args) => {
  console.log("========== QUERY DEBUG ==========");

  console.log("Pool options:");
  console.dir(pool.options, { depth: null });

  if (pool.options && pool.options.connectionParameters) {
    console.log("Connection parameters:");
    console.dir(pool.options.connectionParameters, { depth: null });
  }

  console.log("SQL:");
  console.log(args[0]);

  console.log("PARAMS:");
  console.dir(args[1], { depth: null });

  try {
    const result = await originalQuery(...args);
    console.log("QUERY SUCCESS");
    return result;
  } catch (err) {
    console.error("QUERY FAILED");
    console.error(err);
    throw err;
  }
};

pool.on("error", (err) => {
  console.error("POOL ERROR:");
  console.error(err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  end: () => pool.end(),
};
