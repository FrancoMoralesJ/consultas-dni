
// =====================================================
// Para reniec 
const express = require("express");
const cors = require("cors");
var reniec = require('./dni.js');
// =====================================================

// =====================================================
// GENERAL
const app = express();
// const PORT = 3000;
const PORT = process.env.PORT || 3000;

// =====================================================
// ----- Middleware De nuestra app
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");


// Nueva ruta para obtener la ruta de Chromium


app.get("/check-chromium", (req, res) => {
    const path = chromium.executablePath || 'Chromium no encontrado';
    res.send(path);
});




// Rutas
app.get("/", (req, res) => {
    res.render("index");
});



app.post("/buscar", async (req, res) => {
    const dni = req.body.dni.trim();
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, data: 'Método no permitido' });
    }

    if (!/^\d{8}$/.test(dni)) {
        return res.json({ success: false, data: 'El DNI debe contener exactamente 8 dígitos numéricos.' });
    }
    try {
        const resultadoDNI = await reniec.buscarDNI(dni);

        res.json({ success: true, data: resultadoDNI });
        // if (resultadoDNI) {
        //     console.log(resultadoDNI);

        //     res.json({ success: true, data: resultadoDNI });
        // } else {
        //     res.json({ success: false, data: "El DNI ingresado no existe" });

        // }
    } catch (error) {
        res.json({ success: false, data: "Error al obtener los datos..!!", error: error.message });
    }
});




// Iniciar servidor =======
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

