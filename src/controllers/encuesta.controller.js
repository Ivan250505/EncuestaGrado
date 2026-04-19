const { MENSAJE_BIENVENIDA, MENSAJE_RECHAZO, ENCABEZADO, PREGUNTAS } = require("../data/preguntas");
const { obtenerSesion, guardarSesion } = require("../store/sesiones");
const { enviarMensaje, enviarBotonesBienvenida, enviarBotonesYesNo } = require("../services/whatsapp");
const { guardarRespuesta } = require("../services/storage");

async function enviarPregunta(telefono, pregunta) {
  if (pregunta.tipo === "boton") {
    await enviarBotonesYesNo(telefono, pregunta.texto);
  } else {
    await enviarMensaje(telefono, pregunta.texto);
  }
}

async function procesarMensaje(telefono, textoRecibido) {
  const sesion = await obtenerSesion(telefono);
  const texto = textoRecibido.trim();

  if (sesion.completado) {
    const sesionNueva = {
      etapa: "bienvenida",
      paso: 1,
      datos: {},
      respuestas: [],
      completado: false,
    };
    await guardarSesion(telefono, sesionNueva);
    await enviarBotonesBienvenida(telefono);
    return;
  }

  if (sesion.etapa === "bienvenida") {
    await procesarBienvenida(telefono, sesion, texto);
  } else if (sesion.etapa === "encabezado") {
    await procesarEncabezado(telefono, sesion, texto);
  } else if (sesion.etapa === "preguntas") {
    await procesarPregunta(telefono, sesion, texto);
  }
}

async function procesarBienvenida(telefono, sesion, texto) {
  if (sesion.paso === 0) {
    sesion.paso = 1;
    await guardarSesion(telefono, sesion);
    await enviarBotonesBienvenida(telefono);
    return;
  }

  const textoNorm = texto.toLowerCase().trim();

  if (texto === "1" || texto === "SI" || textoNorm === "si" || textoNorm === "sí") {
    sesion.etapa = "encabezado";
    sesion.paso = 0;
    await guardarSesion(telefono, sesion);
    await enviarMensaje(telefono, ENCABEZADO[0].texto);
    return;
  }

  if (texto === "2" || texto === "NO" || textoNorm === "no") {
    sesion.completado = true;
    await guardarSesion(telefono, sesion);
    await enviarMensaje(telefono, MENSAJE_RECHAZO);
    return;
  }

  await enviarBotonesBienvenida(telefono);
}

async function procesarEncabezado(telefono, sesion, texto) {
  const campoActual = ENCABEZADO[sesion.paso];

  if (!texto || texto.length < 2) {
    await enviarMensaje(telefono, "Por favor ingrese una respuesta válida. 🙏");
    return;
  }
  sesion.datos[campoActual.id] = texto;

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
      `Gracias, ${sesion.datos.nombre}. A continuación encontrará *9 preguntas* relacionadas con el uso de tecnología en *${sesion.datos.empresa}*.\n\nPor favor responda cada una con el *número* de la opción que mejor describa su situación.`
    );

    await enviarPregunta(telefono, PREGUNTAS[0]);
  }
}

async function procesarPregunta(telefono, sesion, texto) {
  const preguntaActual = PREGUNTAS[sesion.paso];
  let respuestaNumerica = null;
  let respuestaTexto = null;

  if (preguntaActual.tipo === "opcion") {
    const indice = parseInt(texto) - 1;
    if (isNaN(indice) || indice < 0 || indice >= preguntaActual.opciones.length) {
      await enviarMensaje(telefono, `Por favor responda con un número entre 1 y ${preguntaActual.opciones.length}. 🙏`);
      return;
    }
    respuestaNumerica = indice + 1;

  } else if (preguntaActual.tipo === "boton") {
    if (texto === "1") {
      respuestaNumerica = 1;
    } else if (texto === "2") {
      respuestaNumerica = 2;
    } else {
      await enviarBotonesYesNo(telefono, preguntaActual.texto);
      return;
    }

  } else if (preguntaActual.tipo === "numero_libre") {
    const num = parseInt(texto);
    if (isNaN(num) || num <= 0) {
      await enviarMensaje(telefono, "Por favor ingrese un número válido mayor a cero. 🙏");
      return;
    }
    respuestaTexto = String(num);

  } else if (preguntaActual.tipo === "texto_libre") {
    if (!texto || texto.length < 2) {
      await enviarMensaje(telefono, "Por favor ingrese una respuesta válida. 🙏");
      return;
    }
    respuestaTexto = texto;
  }

  sesion.respuestas.push({
    pregunta_id: preguntaActual.id,
    numero: preguntaActual.numero,
    respuesta_numerica: respuestaNumerica,
    respuesta_texto: respuestaTexto,
  });

  sesion.paso++;
  await guardarSesion(telefono, sesion);

  if (sesion.paso < PREGUNTAS.length) {
    await enviarPregunta(telefono, PREGUNTAS[sesion.paso]);
  } else {
    sesion.completado = true;
    await guardarSesion(telefono, sesion);
    await guardarRespuesta(telefono, sesion);
    await enviarMensaje(
      telefono,
      `✅ ¡Encuesta completada!\n\nMuchas gracias, ${sesion.datos.empresa}. Hemos registrado sus respuestas exitosamente.\n\n*En un momento mostraremos los resultados consolidados en la presentación*.`
    );
  }
}

module.exports = { procesarMensaje };
