const { ENCABEZADO, PREGUNTAS } = require("../data/preguntas");
const { obtenerSesion, guardarSesion } = require("../store/sesiones");
const { enviarMensaje } = require("../services/whatsapp");
const { guardarRespuesta } = require("../services/storage");

async function procesarMensaje(telefono, textoRecibido) {
  const sesion = await obtenerSesion(telefono);
  const texto = textoRecibido.trim();

  if (sesion.completado) {
    await enviarMensaje(telefono, "Ya completaste la encuesta. ¡Muchas gracias por tu participación! 😊");
    return;
  }

  if (sesion.etapa === "encabezado") {
    await procesarEncabezado(telefono, sesion, texto);
  } else if (sesion.etapa === "preguntas") {
    await procesarPregunta(telefono, sesion, texto);
  }
}

async function procesarEncabezado(telefono, sesion, texto) {
  const campoActual = ENCABEZADO[sesion.paso];

  if (campoActual.tipo === "texto_libre") {
    if (!texto || texto.length < 2) {
      await enviarMensaje(telefono, "Por favor ingresa una respuesta válida. 🙏");
      return;
    }
    sesion.datos[campoActual.id] = texto;
  } else if (campoActual.tipo === "opcion") {
    const indice = parseInt(texto) - 1;
    if (isNaN(indice) || indice < 0 || indice >= campoActual.opciones.length) {
      await enviarMensaje(
        telefono,
        `Por favor responde con un número entre 1 y ${campoActual.opciones.length}. 🙏`
      );
      return;
    }
    sesion.datos[campoActual.id] = campoActual.opciones[indice];
  }

  sesion.paso++;
  await guardarSesion(telefono, sesion);

  if (sesion.paso < ENCABEZADO.length) {
    const siguiente = ENCABEZADO[sesion.paso];
    const mensajeSiguiente = siguiente.texto.replace("{{nombre}}", sesion.datos.nombre || "");
    await enviarMensaje(telefono, mensajeSiguiente);
  } else {
    sesion.etapa = "preguntas";
    sesion.paso = 0;
    await guardarSesion(telefono, sesion);

    await enviarMensaje(
      telefono,
      `Perfecto, ${sesion.datos.nombre}! 🎯\n\nAhora comenzaremos con *10 preguntas* sobre la tecnología en tu empresa *${sesion.datos.empresa}*.\n\nResponde escribiendo el *número* de tu opción.`
    );

    await enviarMensaje(telefono, PREGUNTAS[0].texto);
  }
}

async function procesarPregunta(telefono, sesion, texto) {
  const preguntaActual = PREGUNTAS[sesion.paso];
  const indice = parseInt(texto) - 1;

  if (isNaN(indice) || indice < 0 || indice >= preguntaActual.opciones.length) {
    await enviarMensaje(
      telefono,
      `Por favor responde con un número entre 1 y ${preguntaActual.opciones.length}. 🙏`
    );
    return;
  }

  sesion.respuestas.push({
    pregunta_id: preguntaActual.id,
    numero: preguntaActual.numero,
    respuesta: preguntaActual.opciones[indice],
  });

  sesion.paso++;
  await guardarSesion(telefono, sesion);

  if (sesion.paso < PREGUNTAS.length) {
    await enviarMensaje(telefono, PREGUNTAS[sesion.paso].texto);
  } else {
    sesion.completado = true;
    await guardarSesion(telefono, sesion);
    await guardarRespuesta(telefono, sesion);
    await enviarMensaje(
      telefono,
      `✅ *¡Encuesta completada!*\n\n¡Muchas gracias, ${sesion.datos.nombre}! 🎉\n\nHemos registrado tus respuestas exitosamente.\n\nTu opinión es muy valiosa para nosotros y para el crecimiento tecnológico de las empresas en Bucaramanga. 💡\n\n¡Que tengas un excelente día! 🚀`
    );
  }
}

module.exports = { procesarMensaje };
