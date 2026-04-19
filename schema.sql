-- Ejecutar esto si ya existen las tablas con el schema anterior:
-- DROP TABLE IF EXISTS respuestas;
-- DROP TABLE IF EXISTS encuestados;
-- DROP TABLE IF EXISTS sesiones_activas;

CREATE TABLE IF NOT EXISTS encuestados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  telefono VARCHAR(30) NOT NULL,
  nombre VARCHAR(150),
  empresa VARCHAR(150),
  fecha DATETIME NOT NULL
);

-- respuesta_numerica: preguntas de opcion fija y boton (guarda el numero 1,2,3...)
-- respuesta_texto: P2 (empleados digitados) y P10 (texto libre)
CREATE TABLE IF NOT EXISTS respuestas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  encuestado_id INT NOT NULL,
  numero_pregunta TINYINT NOT NULL,
  respuesta_numerica SMALLINT NULL,
  respuesta_texto TEXT NULL,
  FOREIGN KEY (encuestado_id) REFERENCES encuestados(id)
);

CREATE TABLE IF NOT EXISTS sesiones_activas (
  telefono VARCHAR(30) PRIMARY KEY,
  sesion_json TEXT NOT NULL,
  actualizado_en DATETIME NOT NULL
);
