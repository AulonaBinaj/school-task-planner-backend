const sql = require("mssql");

const config = {
  user: "sa",
  password: "Aulona2025!",
  server: "localhost",
  port: 1433,
  database: "SchoolTaskPlanner",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

let pool;

async function connectToDB() {
  try {
    pool = await sql.connect(config);
    console.log("✅ Connected to MSSQL");
  } catch (err) {
    console.error("❌ DB Connection Failed:", err);
  }
}

// Krijojmë një funksion `query` që e përdor `pool`
async function query(queryText, params = {}) {
  if (!pool) throw new Error("Database connection not established");

  const request = pool.request();

  // Shtojmë parametrat në query nëse ka
  for (const key in params) {
    const param = params[key];
    request.input(key, param.type, param.value);
  }

  return await request.query(queryText);
}

// Eksportojmë objektin `db` që ka edhe funksionin query edhe tipet e sql
module.exports = {
  connectToDB,
  db: {
    query,
    Int: sql.Int,
    NVarChar: sql.NVarChar,
    DateTime: sql.DateTime,
    Bit: sql.Bit,
  },
};
