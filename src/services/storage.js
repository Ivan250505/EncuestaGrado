const { pool } = require("./db");

async function guardarRespuesta(telefono, sesion) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.execute(
      `INSERT INTO encuestados (telefono, nombre, empresa, sector, empleados, fecha)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        telefono,
        sesion.datos.nombre || null,
        sesion.datos.empresa || null,
        sesion.datos.sector || null,
        sesion.datos.empleados || null,
      ]
    );

    const encuestadoId = result.insertId;

    for (const r of sesion.respuestas) {
      await conn.execute(
        `INSERT INTO respuestas (encuestado_id, numero_pregunta, texto_respuesta)
         VALUES (?, ?, ?)`,
        [encuestadoId, r.numero, r.respuesta]
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
      sector: e.sector,
      empleados: e.empleados,
    },
    respuestas: respuestas
      .filter((r) => r.encuestado_id === e.id)
      .map((r) => ({ numero: r.numero_pregunta, respuesta: r.texto_respuesta })),
  }));
}

async function convertirACSV() {
  const datos = await obtenerTodasLasRespuestas();
  if (datos.length === 0) return "Sin datos aún";

  const cabecera = [
    "Telefono","Fecha","Nombre","Empresa","Sector","Empleados",
    "P1","P2","P3","P4","P5","P6","P7","P8","P9","P10",
  ].join(",");

  const filas = datos.map((r) => {
    const preguntas = Array.from({ length: 10 }, (_, i) => {
      const p = r.respuestas.find((x) => x.numero === i + 1);
      return p ? `"${p.respuesta}"` : "";
    });
    return [
      r.telefono,
      r.fecha,
      `"${r.datos_empresa.nombre || ""}"`,
      `"${r.datos_empresa.empresa || ""}"`,
      `"${r.datos_empresa.sector || ""}"`,
      `"${r.datos_empresa.empleados || ""}"`,
      ...preguntas,
    ].join(",");
  });

  return [cabecera, ...filas].join("\n");
}

module.exports = { guardarRespuesta, obtenerTodasLasRespuestas, convertirACSV };
