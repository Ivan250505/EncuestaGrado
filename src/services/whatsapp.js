const axios = require("axios");

const BASE_URL = "https://graph.facebook.com/v19.0";

function headers() {
  return {
    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
    "Content-Type": "application/json",
  };
}

async function enviarMensaje(telefono, texto) {
  await axios.post(
    `${BASE_URL}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: telefono,
      type: "text",
      text: { body: texto },
    },
    { headers: headers() }
  );
}

async function enviarBotonesBienvenida(telefono) {
  const { MENSAJE_BIENVENIDA } = require("../data/preguntas");

  await axios.post(
    `${BASE_URL}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: telefono,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: MENSAJE_BIENVENIDA },
        action: {
          buttons: [
            { type: "reply", reply: { id: "SI", title: "Sí, deseo continuar" } },
            { type: "reply", reply: { id: "NO", title: "No, en este momento no" } },
          ],
        },
      },
    },
    { headers: headers() }
  );
}

module.exports = { enviarMensaje, enviarBotonesBienvenida };
