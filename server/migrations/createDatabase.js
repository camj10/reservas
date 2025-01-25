import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true, 
});

const sqlScript = `
  CREATE DATABASE IF NOT EXISTS abm3;
  USE abm3;

  CREATE TABLE IF NOT EXISTS habitacion (
    id INT(11) NOT NULL AUTO_INCREMENT,
    habitacionpiso INT(11) NOT NULL,
    habitacionnro INT(11) NOT NULL,
    cantcamas INT(11) NOT NULL,
    tienetelevision TINYINT(1) DEFAULT NULL,
    tienefrigobar TINYINT(1) DEFAULT NULL,
    PRIMARY KEY (id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

  INSERT INTO habitacion (id, habitacionpiso, habitacionnro, cantcamas, tienetelevision, tienefrigobar)
  VALUES (12, 1, 1, 1, 0, 0)
  ON DUPLICATE KEY UPDATE id=id;

  CREATE TABLE IF NOT EXISTS persona (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombrecompleto VARCHAR(255) NOT NULL,
    nrodocumento VARCHAR(20) NOT NULL UNIQUE,
    correo VARCHAR(255) DEFAULT NULL UNIQUE,
    telefono VARCHAR(20) DEFAULT NULL,
    PRIMARY KEY (id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

  INSERT INTO persona (id, nombrecompleto, nrodocumento, correo, telefono)
  VALUES
  (14, 'Juan Perez', '5678911', 'asdf@email.com', '45678092'),
  (16, 'Juancito Perez', '65432', 'ytrew@email.com', '9876'),
  (18, 'Juana Perez', '367543', 'fdw@fds.com', '987654'),
  (19, 'Juanita Perez', '9876543', 'kjhgfd@email.com', '0987654'),
  (20, 'Juan Juanito Perez', '458790', 'aabc@email.com', '809789675864')
  ON DUPLICATE KEY UPDATE id=id;

  CREATE TABLE IF NOT EXISTS reserva (
    id INT(11) NOT NULL AUTO_INCREMENT,
    fechareserva DATETIME NOT NULL,
    fechaentrada DATE NOT NULL,
    fechasalida DATE NOT NULL,
    habitacionid INT(11) NOT NULL,
    personaid INT(11) NOT NULL,
    montoreserva DECIMAL(10,3) NOT NULL,
    PRIMARY KEY (id),
    KEY fk_habitacion (habitacionid),
    KEY fk_persona (personaid),
    CONSTRAINT fk_habitacion FOREIGN KEY (habitacionid) REFERENCES habitacion (id) ON UPDATE CASCADE,
    CONSTRAINT fk_persona FOREIGN KEY (personaid) REFERENCES persona (id) ON UPDATE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

  INSERT INTO reserva (id, fechareserva, fechaentrada, fechasalida, habitacionid, personaid, montoreserva)
  VALUES (13, '2025-01-25 00:25:02', '2025-02-02', '2025-03-02', 12, 14, 3360000.000)
  ON DUPLICATE KEY UPDATE id=id;
`;

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err.message);
    return;
  }
  console.log('Conexión a MySQL establecida.');

  connection.query(sqlScript, (error, results) => {
    if (error) {
      console.error('Error ejecutando el script SQL:', error.message);
    } else {
      console.log('Base de datos y tablas creadas correctamente.');
    }
    connection.end();
  });
});