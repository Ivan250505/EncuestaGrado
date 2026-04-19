const express = require("express");
const router = express.Router();
const { obtenerTodasLasRespuestas, convertirACSV } = require("../services/storage");

// Ver todas las respuestas en JSON
router.get("/respuestas", (req, res) => {
  const datos = obtenerTodasLasRespuestas();
  res.json({ total: datos.length, datos });
});

// Descargar respuestas en CSV
router.get("/respuestas/csv", (req, res) => {
  const csv = convertirACSV();
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=respuestas_encuesta.csv");
  res.send(csv);
});

module.exports = router;
