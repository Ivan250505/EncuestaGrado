require("dotenv").config();
const express = require("express");
const webhookRouter = require("./src/routes/webhook");
const resultadosRouter = require("./src/routes/resultados");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/", webhookRouter);
app.use("/api", resultadosRouter);

app.get("/", (req, res) => {
  res.json({
    estado: "✅ Chatbot de encuesta activo",
    endpoints: {
      webhook_GET: "GET /webhook — verificación Meta",
      webhook_POST: "POST /webhook — recepción de mensajes",
      respuestas_JSON: "GET /api/respuestas",
      respuestas_CSV: "GET /api/respuestas/csv",
    },
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 Webhook listo en http://localhost:${PORT}/webhook`);
});
