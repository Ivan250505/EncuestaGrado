const { pool } = require("../services/db");

// Cache en RAM para no consultar la DB en cada mensaje
const cache = new Map();

async function obtenerSesion(telefono) {
  if (cache.has(telefono)) return cache.get(telefono);

  const [rows] = await pool.execute(
    `SELECT sesion_json FROM sesiones_activas WHERE telefono = ?`,
    [telefono]
  );

  if (rows.length > 0) {
    const sesion = JSON.parse(rows[0].sesion_json);
    cache.set(telefono, sesion);
    return sesion;
  }

  const nuevaSesion = {
    etapa: "encabezado",
    paso: 0,
    datos: {},
    respuestas: [],
    completado: false,
  };
  cache.set(telefono, nuevaSesion);
  return nuevaSesion;
}

async function guardarSesion(telefono, sesion) {
  cache.set(telefono, sesion);
  await pool.execute(
    `INSERT INTO sesiones_activas (telefono, sesion_json, actualizado_en)
     VALUES (?, ?, NOW())
     ON DUPLICATE KEY UPDATE sesion_json = VALUES(sesion_json), actualizado_en = NOW()`,
    [telefono, JSON.stringify(sesion)]
  );
}

async function eliminarSesion(telefono) {
  cache.delete(telefono);
  await pool.execute(
    `DELETE FROM sesiones_activas WHERE telefono = ?`,
    [telefono]
  );
}

function todasLasSesiones() {
  const resultado = [];
  for (const [telefono, sesion] of cache.entries()) {
    resultado.push({ telefono, ...sesion });
  }
  return resultado;
}

module.exports = { obtenerSesion, guardarSesion, eliminarSesion, todasLasSesiones };
