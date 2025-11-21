const mysql = require("mysql2");
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Servir archivos desde la carpeta raíz del proyecto
app.use(express.static(__dirname));

// ---- RUTA RAÍZ (CARGAR index.html correcto) ----
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Conexión a MySQL
const conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sebas123",
  database: "barberia"
});

conexion.connect(err => {
  if (err) {
    console.error("Error al conectar a MySQL:", err);
    return;
  }
  console.log("Conectado a la base de datos MySQL correctamente.");
});


app.post("/reservar", (req, res) => {
    const { nombre, telefono, fecha, hora } = req.body;

    // 1. Consulta para verificar si el turno (fecha y hora) ya está ocupado
    const sqlCheck = "SELECT COUNT(*) AS count FROM reservas WHERE fecha = ? AND hora = ?";
    
    conexion.query(sqlCheck, [fecha, hora], (err, results) => {
        if (err) {
            console.error("Error al verificar reserva:", err);
            return res.status(500).json({ error: "Error interno al verificar la reserva." });
        }

        // Extrae el resultado del conteo
        const reservationsCount = results[0].count;

        if (reservationsCount > 0) {
            // 2. Si count > 0, significa que el turno ya está reservado
            console.log(`Intento de reserva fallido: Turno (${fecha} a las ${hora}) ya reservado.`);
            
            // Envía el mensaje de error personalizado con código 409 (Conflicto)
            return res.status(409).json({ 
                error: "Turno ya reservado, cambia la hora por favor." 
            });
        }

        // 3. Si no hay conflicto (count es 0), procede con la inserción
        const sqlInsert = "INSERT INTO reservas (nombre, telefono, fecha, hora) VALUES (?, ?, ?, ?)";
        
        conexion.query(sqlInsert, [nombre, telefono, fecha, hora], (err) => {
            if (err) {
                console.error("Error al guardar reserva:", err);
                return res.status(500).json({ error: "Error al guardar la reserva en la base de datos." });
            }

            console.log("Nueva reserva guardada:", { nombre, telefono, fecha, hora });
            res.json({ message: "Reserva guardada con éxito en MySQL!" });
        });
    });
});


// Iniciar servidor
app.listen(3000, "0.0.0.0", () => {
  console.log("Servidor corriendo en http://0.0.0.0:3000");
});