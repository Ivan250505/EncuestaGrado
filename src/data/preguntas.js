const ENCABEZADO = [
  {
    id: "nombre",
    texto: "¡Hola! 👋 Bienvenido/a a la encuesta de diagnóstico tecnológico.\n\n¿Cuál es tu *nombre completo*?",
    tipo: "texto_libre",
  },
  {
    id: "empresa",
    texto: "Gracias {{nombre}}. 😊\n\n¿A qué *empresa* representas?",
    tipo: "texto_libre",
  },
  {
    id: "sector",
    texto: "¿En qué *sector* trabaja tu empresa?\n\nEscribe el número de tu opción:\n\n1️⃣ Comercio\n2️⃣ Servicios\n3️⃣ Manufactura / Industria\n4️⃣ Salud\n5️⃣ Educación\n6️⃣ Otro",
    tipo: "opcion",
    opciones: ["Comercio", "Servicios", "Manufactura / Industria", "Salud", "Educación", "Otro"],
  },
  {
    id: "empleados",
    texto: "¿Cuántos *empleados* tiene aproximadamente tu empresa?\n\nEscribe el número de tu opción:\n\n1️⃣ 1 a 10 empleados\n2️⃣ 11 a 50 empleados\n3️⃣ 51 a 200 empleados\n4️⃣ Más de 200 empleados",
    tipo: "opcion",
    opciones: ["1 a 10 empleados", "11 a 50 empleados", "51 a 200 empleados", "Más de 200 empleados"],
  },
];

const PREGUNTAS = [
  {
    id: "p1",
    numero: 1,
    texto: "📋 *Pregunta 1 de 10*\n\n¿Qué usa actualmente su empresa para manejar la información del negocio (ventas, inventario, contabilidad)?\n\n1️⃣ Excel u hojas de cálculo\n2️⃣ Un programa o sistema comprado\n3️⃣ Un programa hecho a la medida\n4️⃣ Registros en papel o de forma manual\n5️⃣ Otro",
    opciones: ["Excel u hojas de cálculo", "Un programa o sistema comprado", "Un programa hecho a la medida", "Registros en papel o de forma manual", "Otro"],
  },
  {
    id: "p2",
    numero: 2,
    texto: "📋 *Pregunta 2 de 10*\n\n¿Puede usted o sus empleados consultar la información de la empresa desde la casa, el celular u otro lugar fuera de la oficina?\n\n1️⃣ Sí, desde cualquier lugar con internet\n2️⃣ No, solo dentro de la empresa\n3️⃣ Algunas cosas sí y otras no\n4️⃣ No usamos ningún programa",
    opciones: ["Sí, desde cualquier lugar con internet", "No, solo dentro de la empresa", "Algunas cosas sí y otras no", "No usamos ningún programa"],
  },
  {
    id: "p3",
    numero: 3,
    texto: "📋 *Pregunta 3 de 10*\n\n¿Qué tan satisfecho está con el sistema o programa que usa actualmente en su empresa?\n\n1️⃣ Muy satisfecho\n2️⃣ Satisfecho\n3️⃣ Más o menos\n4️⃣ Insatisfecho\n5️⃣ Muy insatisfecho",
    opciones: ["Muy satisfecho", "Satisfecho", "Más o menos", "Insatisfecho", "Muy insatisfecho"],
  },
  {
    id: "p4",
    numero: 4,
    texto: "📋 *Pregunta 4 de 10*\n\n¿Ha intentado cambiar o mejorar el programa principal de su empresa en los últimos 3 años?\n\n1️⃣ Sí, ya lo hicimos y nos fue bien\n2️⃣ Lo intentamos pero no pudimos\n3️⃣ Lo tenemos planeado pero no hemos empezado\n4️⃣ No lo hemos pensado",
    opciones: ["Sí, ya lo hicimos y nos fue bien", "Lo intentamos pero no pudimos", "Lo tenemos planeado pero no hemos empezado", "No lo hemos pensado"],
  },
  {
    id: "p5",
    numero: 5,
    texto: "📋 *Pregunta 5 de 10*\n\n¿Cuál ha sido la razón principal para no haber cambiado o mejorado el sistema de su empresa?\n\n1️⃣ Es muy costoso\n2️⃣ Miedo a que el negocio se pare durante el cambio\n3️⃣ No hemos encontrado una empresa de confianza en la región\n4️⃣ No sabemos cómo hacerlo ni por dónde empezar\n5️⃣ No lo hemos visto necesario\n6️⃣ Otro",
    opciones: ["Es muy costoso", "Miedo a que el negocio se pare durante el cambio", "No hemos encontrado una empresa de confianza en la región", "No sabemos cómo hacerlo ni por dónde empezar", "No lo hemos visto necesario", "Otro"],
  },
  {
    id: "p6",
    numero: 6,
    texto: "📋 *Pregunta 6 de 10*\n\nSi una empresa de acá de Bucaramanga le pudiera mejorar el sistema sin parar su negocio, ¿qué tanto le interesaría ese servicio?\n\nEscribe un número del 1 al 5:\n1️⃣ Muy poco probable\n2️⃣ Poco probable\n3️⃣ Ni lo uno ni lo otro\n4️⃣ Probable\n5️⃣ Muy probable",
    opciones: ["1 - Muy poco probable", "2 - Poco probable", "3 - Ni lo uno ni lo otro", "4 - Probable", "5 - Muy probable"],
  },
  {
    id: "p7",
    numero: 7,
    texto: "📋 *Pregunta 7 de 10*\n\n¿Con qué frecuencia cree que su empresa necesitaría ese tipo de servicio de mejora o actualización?\n\n1️⃣ Solo una vez (para hacer el cambio y ya)\n2️⃣ Cada 1 o 2 años\n3️⃣ De forma constante, con alguien que nos ayude todos los meses\n4️⃣ No lo necesitaríamos",
    opciones: ["Solo una vez", "Cada 1 o 2 años", "De forma constante mensual", "No lo necesitaríamos"],
  },
  {
    id: "p8",
    numero: 8,
    texto: "📋 *Pregunta 8 de 10*\n\n¿Con qué frecuencia su empresa gasta en tecnología (programas, licencias o mantenimiento de equipos)?\n\n1️⃣ Cada mes\n2️⃣ Cada seis meses\n3️⃣ Una vez al año\n4️⃣ Solo cuando algo se daña\n5️⃣ Nunca",
    opciones: ["Cada mes", "Cada seis meses", "Una vez al año", "Solo cuando algo se daña", "Nunca"],
  },
  {
    id: "p9",
    numero: 9,
    texto: "📋 *Pregunta 9 de 10*\n\n¿Ha buscado o cotizado alguna vez un servicio para mejorar o cambiar el sistema de su empresa?\n\n1️⃣ Sí, y lo contraté\n2️⃣ Sí, pero no lo contraté\n3️⃣ Lo he pensado pero no he buscado\n4️⃣ Nunca lo he considerado",
    opciones: ["Sí, y lo contraté", "Sí, pero no lo contraté", "Lo he pensado pero no he buscado", "Nunca lo he considerado"],
  },
  {
    id: "p10",
    numero: 10,
    texto: "📋 *Pregunta 10 de 10*\n\n¿Cómo preferiría pagar por el mantenimiento del sistema de su empresa?\n\n1️⃣ Un solo pago por el proyecto completo\n2️⃣ Una mensualidad fija con soporte y actualizaciones\n3️⃣ Solo pagar cuando algo falle\n4️⃣ No lo necesito",
    opciones: ["Un solo pago por el proyecto completo", "Una mensualidad fija con soporte y actualizaciones", "Solo pagar cuando algo falle", "No lo necesito"],
  },
];

module.exports = { ENCABEZADO, PREGUNTAS };
