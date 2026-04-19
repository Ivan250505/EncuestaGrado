const express = require("express");
const router = express.Router();
const { procesarMensaje } = require("../controllers/encuesta.controller");

// Verificación del webhook con Meta
router.get("/webhook", (req, res) => {
  const modo = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (modo === "subscribe" && token === process.env.VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente");
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// Recepción de mensajes
router.post("/webhook", async (req, res) => {
  res.sendStatus(200);

  try {
    const body = req.body;

    if (body.object !== "whatsapp_business_account") return;

    const entry = body.entry?.[0];
    const cambio = entry?.changes?.[0];
    const valor = cambio?.value;
    const mensajes = valor?.messages;

    if (!mensajes || mensajes.length === 0) return;

    const mensaje = mensajes[0];
    if (mensaje.type !== "text") return;

    const telefono = mensaje.from;
    const texto = mensaje.text.body;

    console.log(`📩 Mensaje de ${telefono}: ${texto}`);
    await procesarMensaje(telefono, texto);
  } catch (error) {
    console.error("❌ Error procesando mensaje:", error.message);
  }
});

module.exports = router;
