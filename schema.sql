-- Tabla principal de encuestados
CREATE TABLE IF NOT EXISTS encuestados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  telefono VARCHAR(30) NOT NULL,
  nombre VARCHAR(150),
  empresa VARCHAR(150),
  sector VARCHAR(100),
  empleados VARCHAR(100),
  fecha DATETIME NOT NULL
);

-- Una fila por cada respuesta (P1 a P10)
CREATE TABLE IF NOT EXISTS respuestas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  encuestado_id INT NOT NULL,
  numero_pregunta TINYINT NOT NULL,   -- 1 a 10
  texto_respuesta VARCHAR(255) NOT NULL,
  FOREIGN KEY (encuestado_id) REFERENCES encuestados(id)
);

-- Sesiones en curso (para sobrevivir reinicios del servidor)
CREATE TABLE IF NOT EXISTS sesiones_activas (
  telefono VARCHAR(30) PRIMARY KEY,
  sesion_json TEXT NOT NULL,
  actualizado_en DATETIME NOT NULL
);
