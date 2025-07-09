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

async function connectToDB() {
  try {
    await sql.connect(config);
    console.log("Connected to MSSQL");
  } catch (err) {
    console.error("DB Connection Failed:", err);
  }
}
connectToDB();

module.exports = {
  sql,
  connectToDB,
};
