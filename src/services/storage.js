const fs = require("fs");
const path = require("path");

const DIRECTORIO = path.join(__dirname, "../../respuestas");

function asegurarDirectorio() {
  if (!fs.existsSync(DIRECTORIO)) {
    fs.mkdirSync(DIRECTORIO, { recursive: true });
  }
}

async function guardarRespuesta(telefono, sesion) {
  asegurarDirectorio();

  const registro = {
    telefono,
    fecha: new Date().toISOString(),
    datos_empresa: sesion.datos,
    respuestas: sesion.respuestas,
  };

  const nombreArchivo = `${telefono}_${Date.now()}.json`;
  const rutaArchivo = path.join(DIRECTORIO, nombreArchivo);
  fs.writeFileSync(rutaArchivo, JSON.stringify(registro, null, 2), "utf8");
}

function obtenerTodasLasRespuestas() {
  asegurarDirectorio();

  const archivos = fs.readdirSync(DIRECTORIO).filter((f) => f.endsWith(".json"));
  return archivos.map((archivo) => {
    const contenido = fs.readFileSync(path.join(DIRECTORIO, archivo), "utf8");
    return JSON.parse(contenido);
  });
}

function convertirACSV() {
  const respuestas = obtenerTodasLasRespuestas();
  if (respuestas.length === 0) return "Sin datos aún";

  const cabecera = [
    "Telefono",
    "Fecha",
    "Nombre",
    "Empresa",
    "Sector",
    "Empleados",
    "P1","P2","P3","P4","P5","P6","P7","P8","P9","P10",
  ].join(",");

  const filas = respuestas.map((r) => {
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
