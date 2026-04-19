require("dotenv").config();
const path = require("path");
const express = require("express");
const { inicializarTablas } = require("./src/services/db");
const webhookRouter = require("./src/routes/webhook");
const resultadosRouter = require("./src/routes/resultados");
const dashboardRouter = require("./src/routes/dashboard");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

app.use(express.json());

app.use("/", webhookRouter);
app.use("/api", resultadosRouter);
app.use("/dashboard", dashboardRouter);

app.get("/", (req, res) => {
  res.json({
    estado: "✅ Chatbot de encuesta activo",
    endpoints: {
      webhook_GET: "GET /webhook — verificación Meta",
      webhook_POST: "POST /webhook — recepción de mensajes",
      respuestas_JSON: "GET /api/respuestas",
      respuestas_CSV: "GET /api/respuestas/csv",
      dashboard: "GET /dashboard",
    },
  });
});

inicializarTablas()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📡 Webhook listo en http://localhost:${PORT}/webhook`);
    });
  })
  .catch((err) => {
    console.error("❌ Error conectando a MySQL:", err.message);
    process.exit(1);
  });
