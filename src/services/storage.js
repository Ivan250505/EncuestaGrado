const { pool } = require("./db");

async function guardarRespuesta(telefono, sesion) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.execute(
      `INSERT INTO encuestados (telefono, nombre, empresa, fecha)
       VALUES (?, ?, ?, NOW())`,
      [
        telefono,
        sesion.datos.nombre || null,
        sesion.datos.empresa || null,
      ]
    );

    const encuestadoId = result.insertId;

    for (const r of sesion.respuestas) {
      await conn.execute(
        `INSERT INTO respuestas (encuestado_id, numero_pregunta, respuesta_numerica, respuesta_texto)
         VALUES (?, ?, ?, ?)`,
        [encuestadoId, r.numero, r.respuesta_numerica ?? null, r.respuesta_texto ?? null]
      );
    }

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function obtenerTodasLasRespuestas() {
  const [encuestados] = await pool.execute(
    `SELECT * FROM encuestados ORDER BY fecha DESC`
  );

  const [respuestas] = await pool.execute(`SELECT * FROM respuestas`);

  return encuestados.map((e) => ({
    telefono: e.telefono,
    fecha: e.fecha,
    datos_empresa: {
      nombre: e.nombre,
      empresa: e.empresa,
    },
    respuestas: respuestas
      .filter((r) => r.encuestado_id === e.id)
      .map((r) => ({
        numero: r.numero_pregunta,
        respuesta_numerica: r.respuesta_numerica,
        respuesta_texto: r.respuesta_texto,
      })),
  }));
}

async function convertirACSV() {
  const datos = await obtenerTodasLasRespuestas();
  if (datos.length === 0) return "Sin datos aún";

  const cabecera = [
    "Telefono", "Fecha", "Nombre", "Empresa",
    "P1_Sector", "P2_Empleados", "P3_SistemaActual", "P4_AccesoRemoto",
    "P5_GastoLicencias", "P6_BuscoServicio", "P7_IA", "P8_Fabricas",
  ].join(",");

  const filas = datos.map((r) => {
    // Solo P1 a P8 en el CSV — P9 (texto abierto) se excluye del dashboard
    const cols = Array.from({ length: 8 }, (_, i) => {
      const p = r.respuestas.find((x) => x.numero === i + 1);
      if (!p) return "";
      if (p.respuesta_texto !== null) return `"${p.respuesta_texto}"`;
      return p.respuesta_numerica ?? "";
    });

    return [
      r.telefono,
      r.fecha,
      `"${r.datos_empresa.nombre || ""}"`,
      `"${r.datos_empresa.empresa || ""}"`,
      ...cols,
    ].join(",");
  });

  return [cabecera, ...filas].join("\n");
}

module.exports = { guardarRespuesta, obtenerTodasLasRespuestas, convertirACSV };
