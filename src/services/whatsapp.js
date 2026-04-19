const axios = require("axios");

const BASE_URL = "https://graph.facebook.com/v19.0";

async function enviarMensaje(telefono, texto) {
  const { WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = process.env;

  await axios.post(
    `${BASE_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: telefono,
      type: "text",
      text: { body: texto },
    },
    {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}

module.exports = { enviarMensaje };
