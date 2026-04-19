const express = require("express");
const router = express.Router();
const { pool } = require("../services/db");

const OPCIONES = {
  1: ["Comercio", "Servicios", "Manufactura e Industria", "Salud", "Educación", "TI", "Comercial", "Otro"],
  3: ["Excel / hojas de cálculo", "Programa comprado", "Programa a medida", "Papel o manual", "Otro"],
  4: ["Sí, desde cualquier lugar", "Solo dentro de la empresa", "Algunas sí, otras no", "No usamos ningún programa"],
  5: ["Cada mes", "Cada 6 meses", "Una vez al año", "Solo cuando algo falla", "Nunca"],
  6: ["Sí, y lo contraté", "Sí, pero no lo contraté", "Lo he pensado", "Nunca lo consideré"],
  7: ["ChatGPT", "Claude", "Gemini", "Perplexity", "Otra", "Ninguna"],
  8: ["Sí", "No"],
};

router.get("/", async (req, res) => {
  try {
    const [[{ total }]] = await pool.execute("SELECT COUNT(*) as total FROM encuestados");
    const [[{ ultima_fecha }]] = await pool.execute("SELECT MAX(fecha) as ultima_fecha FROM encuestados");

    const graficas = {};
    for (const num of [1, 3, 4, 5, 6, 7, 8]) {
      const [rows] = await pool.execute(
        `SELECT respuesta_numerica, COUNT(*) as cantidad
         FROM respuestas
         WHERE numero_pregunta = ? AND respuesta_numerica IS NOT NULL
         GROUP BY respuesta_numerica
         ORDER BY respuesta_numerica`,
        [num]
      );
      const opciones = OPCIONES[num];
      graficas[num] = {
        labels: opciones,
        data: opciones.map((_, i) => {
          const found = rows.find((r) => r.respuesta_numerica === i + 1);
          return found ? Number(found.cantidad) : 0;
        }),
      };
    }

    const [[empStats]] = await pool.execute(
      `SELECT
        ROUND(AVG(CAST(respuesta_texto AS UNSIGNED)), 1) as promedio,
        MIN(CAST(respuesta_texto AS UNSIGNED)) as minimo,
        MAX(CAST(respuesta_texto AS UNSIGNED)) as maximo,
        SUM(CAST(respuesta_texto AS UNSIGNED)) as total_emp
       FROM respuestas WHERE numero_pregunta = 2 AND respuesta_texto IS NOT NULL`
    );

    const [encuestados] = await pool.execute(
      `SELECT e.id, e.nombre, e.empresa, e.fecha,
        (SELECT r.respuesta_numerica FROM respuestas r WHERE r.encuestado_id = e.id AND r.numero_pregunta = 1 LIMIT 1) as sector_num,
        (SELECT r.respuesta_texto FROM respuestas r WHERE r.encuestado_id = e.id AND r.numero_pregunta = 2 LIMIT 1) as empleados
       FROM encuestados e ORDER BY e.fecha DESC`
    );

    const sectores = OPCIONES[1];
    const lista = encuestados.map((e) => ({
      ...e,
      sector: e.sector_num ? sectores[e.sector_num - 1] : "—",
      fecha_fmt: new Date(e.fecha).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" }),
    }));

    res.render("dashboard/index", { total, ultima_fecha, graficas, empStats, lista });
  } catch (err) {
    console.error("❌ Dashboard error:", err.message);
    res.status(500).send("Error cargando el dashboard");
  }
});

module.exports = router;
