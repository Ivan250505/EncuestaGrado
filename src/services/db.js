const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

async function inicializarTablas() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS encuestados (
      id INT AUTO_INCREMENT PRIMARY KEY,
      telefono VARCHAR(30) NOT NULL,
      nombre VARCHAR(150),
      empresa VARCHAR(150),
      sector VARCHAR(100),
      empleados VARCHAR(100),
      fecha DATETIME NOT NULL
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS respuestas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      encuestado_id INT NOT NULL,
      numero_pregunta TINYINT NOT NULL,
      texto_respuesta VARCHAR(255) NOT NULL,
      FOREIGN KEY (encuestado_id) REFERENCES encuestados(id)
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS sesiones_activas (
      telefono VARCHAR(30) PRIMARY KEY,
      sesion_json TEXT NOT NULL,
      actualizado_en DATETIME NOT NULL
    )
  `);

  console.log("✅ Tablas MySQL verificadas/creadas");
}

module.exports = { pool, inicializarTablas };
