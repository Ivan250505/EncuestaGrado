const sesiones = new Map();

function obtenerSesion(telefono) {
  if (!sesiones.has(telefono)) {
    sesiones.set(telefono, {
      etapa: "encabezado",
      paso: 0,
      datos: {},
      respuestas: [],
      completado: false,
    });
  }
  return sesiones.get(telefono);
}

function guardarSesion(telefono, sesion) {
  sesiones.set(telefono, sesion);
}

function eliminarSesion(telefono) {
  sesiones.delete(telefono);
}

function todasLasSesiones() {
  const resultado = [];
  for (const [telefono, sesion] of sesiones.entries()) {
    resultado.push({ telefono, ...sesion });
  }
  return resultado;
}

module.exports = { obtenerSesion, guardarSesion, eliminarSesion, todasLasSesiones };
