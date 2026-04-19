const MENSAJE_BIENVENIDA = `Bienvenido, en este chat descubrirá cómo capturar datos desde WhatsApp y convertirlos en información valiosa para tomar decisiones, iniciemos. Esta es la línea de transformación digital del programa fábricas de productividad.\n\n¿Desea participar en la encuesta?`;

const MENSAJE_RECHAZO = `Agradecemos su tiempo.\n\nSi en algún momento desea participar, con gusto lo atenderemos.\n\nQue tenga un excelente día.`;

const ENCABEZADO = [
  {
    id: "nombre",
    texto: "Perfecto. Para iniciar, por favor indíquenos su *nombre*.",
    tipo: "texto_libre",
  },
  {
    id: "empresa",
    texto: "Gracias, {{nombre}}. ¿A qué *empresa* representa?",
    tipo: "texto_libre",
  },
];

const PREGUNTAS = [
  {
    id: "p1",
    numero: 1,
    tipo: "opcion",
    texto: "📋 *Pregunta 1 de 9*\n\n¿A qué *sector económico* pertenece su empresa?\n\n1️⃣ Comercio\n2️⃣ Servicios\n3️⃣ Manufactura e Industria\n4️⃣ Salud\n5️⃣ Educación\n6️⃣ TI (Tecnología de la Información)\n7️⃣ Comercial\n8️⃣ Otro",
    opciones: ["Comercio", "Servicios", "Manufactura e Industria", "Salud", "Educación", "TI", "Comercial", "Otro"],
  },
  {
    id: "p2",
    numero: 2,
    tipo: "numero_libre",
    texto: "📋 *Pregunta 2 de 9*\n\n¿Cuántos *empleados* tiene su empresa?\n\nPor favor escriba el número exacto.",
  },
  {
    id: "p3",
    numero: 3,
    tipo: "opcion",
    texto: "📋 *Pregunta 3 de 9*\n\n¿Qué usa actualmente su empresa para manejar la información del negocio (ventas, inventario, contabilidad)?\n\n1️⃣ Excel u hojas de cálculo\n2️⃣ Un programa o sistema comprado\n3️⃣ Un programa hecho a la medida\n4️⃣ Registros en papel o de forma manual\n5️⃣ Otro",
    opciones: ["Excel u hojas de cálculo", "Un programa o sistema comprado", "Un programa hecho a la medida", "Registros en papel o de forma manual", "Otro"],
  },
  {
    id: "p4",
    numero: 4,
    tipo: "opcion",
    texto: "📋 *Pregunta 4 de 9*\n\n¿Puede usted o sus empleados consultar la información de la empresa desde fuera de la oficina?\n\n1️⃣ Sí, desde cualquier lugar con internet\n2️⃣ No, solo dentro de la empresa\n3️⃣ Algunas cosas sí y otras no\n4️⃣ No usamos ningún programa",
    opciones: ["Sí, desde cualquier lugar con internet", "No, solo dentro de la empresa", "Algunas cosas sí y otras no", "No usamos ningún programa"],
  },
  {
    id: "p5",
    numero: 5,
    tipo: "opcion",
    texto: "📋 *Pregunta 5 de 9*\n\n¿Con qué frecuencia su empresa gasta en *licencias de software*?\n\n1️⃣ Cada mes\n2️⃣ Cada seis meses\n3️⃣ Una vez al año\n4️⃣ Solo cuando algo se daña\n5️⃣ Nunca",
    opciones: ["Cada mes", "Cada seis meses", "Una vez al año", "Solo cuando algo se daña", "Nunca"],
  },
  {
    id: "p6",
    numero: 6,
    tipo: "opcion",
    texto: "📋 *Pregunta 6 de 9*\n\n¿Ha buscado o cotizado alguna vez un servicio para mejorar o cambiar el sistema de su empresa?\n\n1️⃣ Sí, y lo contraté\n2️⃣ Sí, pero no lo contraté\n3️⃣ Lo he pensado pero no he buscado\n4️⃣ Nunca lo he considerado",
    opciones: ["Sí, y lo contraté", "Sí, pero no lo contraté", "Lo he pensado pero no he buscado", "Nunca lo he considerado"],
  },
  {
    id: "p7",
    numero: 7,
    tipo: "opcion",
    texto: "📋 *Pregunta 7 de 9*\n\n¿Cuál herramienta de *inteligencia artificial* usa más en su empresa?\n\n1️⃣ ChatGPT\n2️⃣ Claude\n3️⃣ Gemini\n4️⃣ Perplexity\n5️⃣ Otra\n6️⃣ Ninguna",
    opciones: ["ChatGPT", "Claude", "Gemini", "Perplexity", "Otra", "Ninguna"],
  },
  {
    id: "p8",
    numero: 8,
    tipo: "boton",
    texto: "📋 *Pregunta 8 de 9*\n\n¿Ha participado anteriormente en el programa *Fábricas de Productividad y Sostenibilidad*?",
    opciones: ["Sí", "No"],
  },
  {
    id: "p9",
    numero: 9,
    tipo: "texto_libre",
    texto: "📋 *Pregunta 9 de 9*\n\n¿Cuál es el principal desafío de su empresa en el cual requiere ayuda del programa *Fábricas de Productividad*?\n\nEscriba su respuesta.",
  },
];

module.exports = { MENSAJE_BIENVENIDA, MENSAJE_RECHAZO, ENCABEZADO, PREGUNTAS };
