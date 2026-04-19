const axios = require("axios");
const { MENSAJE_BIENVENIDA } = require("../data/preguntas");

const BASE_URL = "https://graph.facebook.com/v19.0";

function headers() {
  return {
    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
    "Content-Type": "application/json",
  };
}

async function enviar(payload) {
  try {
    await axios.post(
      `${BASE_URL}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      payload,
      { headers: headers() }
    );
  } catch (err) {
    console.error("❌ WhatsApp API error:", JSON.stringify(err.response?.data || err.message));
    throw err;
  }
}

async function enviarMensaje(telefono, texto) {
  await enviar({
    messaging_product: "whatsapp",
    to: telefono,
    type: "text",
    text: { body: texto },
  });
}

async function enviarBotonesBienvenida(telefono) {
  await enviar({
    messaging_product: "whatsapp",
    to: telefono,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: MENSAJE_BIENVENIDA },
      action: {
        buttons: [
          { type: "reply", reply: { id: "SI", title: "Sí, continuar" } },
          { type: "reply", reply: { id: "NO", title: "No participar" } },
        ],
      },
    },
  });
}

module.exports = { enviarMensaje, enviarBotonesBienvenida };
