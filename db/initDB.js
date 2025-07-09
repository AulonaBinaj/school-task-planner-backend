const { sql, connectToDB } = require("../db");

async function initDB() {
  try {
    // Lidhu fillimisht te databaza "master" për të krijuar të renë
    await sql.connect({
      user: "sa",
      password: "Aulona2025!",
      server: "localhost",
      port: 1433,
      database: "master",
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    });

    // Krijo databazën nëse nuk ekziston
    await sql.query(`
      IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'SchoolTaskPlanner')
      BEGIN
        CREATE DATABASE SchoolTaskPlanner
      END
    `);

    console.log("Database checked/created.");

    // Lidhu me databazën e re
    await sql.connect({
      user: "sa",
      password: "Aulona2025!",
      server: "localhost",
      port: 1433,
      database: "SchoolTaskPlanner",
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    });

    // Krijo tabelën Tasks nëse nuk ekziston
    await sql.query(`
      IF NOT EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME = 'Tasks'
      )
      BEGIN
        CREATE TABLE Tasks (
          Id INT PRIMARY KEY IDENTITY(1,1),
          Title NVARCHAR(255) NOT NULL,
          Description NVARCHAR(MAX),
          DueDate DATETIME,
          IsCompleted BIT DEFAULT 0
        )
      END
    `);

    console.log("Table Tasks checked/created.");
  } catch (err) {
    console.error("Error during DB init:", err);
  } finally {
    sql.close();
  }
}

initDB();
