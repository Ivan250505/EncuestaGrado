const express = require("express");
const router = express.Router();
const ExcelJS = require("exceljs");
const { pool } = require("../services/db");
const { PREGUNTAS } = require("../data/preguntas");

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

    res.render("dashboard/index", { total, ultima_fecha, graficas, empStats });
  } catch (err) {
    console.error("❌ Dashboard error:", err.message);
    res.status(500).send("Error cargando el dashboard");
  }
});

router.get("/exportar", async (req, res) => {
  try {
    const [encuestados] = await pool.execute(
      "SELECT id, nombre, empresa, telefono, fecha FROM encuestados ORDER BY id"
    );
    const [respuestas] = await pool.execute(
      "SELECT encuestado_id, numero_pregunta, respuesta_numerica, respuesta_texto FROM respuestas ORDER BY encuestado_id, numero_pregunta"
    );

    const respPorEnc = {};
    for (const r of respuestas) {
      if (!respPorEnc[r.encuestado_id]) respPorEnc[r.encuestado_id] = {};
      respPorEnc[r.encuestado_id][r.numero_pregunta] = r;
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Respuestas");

    const columns = [
      { header: "Nombre",    key: "nombre",   width: 25 },
      { header: "Empresa",   key: "empresa",  width: 25 },
      { header: "Teléfono",  key: "telefono", width: 18 },
      { header: "Fecha",     key: "fecha",    width: 18 },
    ];

    for (const p of PREGUNTAS) {
      const textoLimpio = p.texto
        .replace(/📋 \*Pregunta \d+ de \d+\*\n\n/, "")
        .split("\n\n")[0]
        .replace(/\*/g, "");
      columns.push({ header: `P${p.numero} — ${textoLimpio}`, key: `p${p.numero}`, width: 40 });
    }

    sheet.columns = columns;

    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E7E34" } };
    headerRow.alignment = { vertical: "middle", wrapText: true };
    headerRow.height = 40;

    for (const enc of encuestados) {
      const resps = respPorEnc[enc.id] || {};
      const row = {
        nombre:   enc.nombre  || "",
        empresa:  enc.empresa || "",
        telefono: enc.telefono || "",
        fecha:    enc.fecha ? new Date(enc.fecha).toLocaleDateString("es-CO") : "",
      };

      for (const p of PREGUNTAS) {
        const r = resps[p.numero];
        if (!r) {
          row[`p${p.numero}`] = "";
        } else if (p.tipo === "opcion" || p.tipo === "boton") {
          const idx = r.respuesta_numerica;
          row[`p${p.numero}`] = idx && p.opciones[idx - 1] ? p.opciones[idx - 1] : (r.respuesta_texto || "");
        } else {
          row[`p${p.numero}`] = r.respuesta_texto || "";
        }
      }

      sheet.addRow(row);
    }

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=respuestas_encuesta.xlsx");
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("❌ Error exportando Excel:", err.message);
    res.status(500).send("Error generando el archivo Excel");
  }
});

module.exports = router;
