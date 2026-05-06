const { Pool } = require("pg")

const localConfig = {
  user: process.env.DB_LOCAL_USER || "postgres",
  host: process.env.DB_LOCAL_HOST || "localhost",
  database: process.env.DB_LOCAL_NAME || "ecommerce",
  password: process.env.DB_LOCAL_PASSWORD,
  port: Number(process.env.DB_LOCAL_PORT || 5432),
}


const pool = new Pool(
  process.env.DATABASE_URL_LOCAL
    ? localConfig
    : {
        connectionString: process.env.DATABASE_URL,
      }
)

module.exports = pool
