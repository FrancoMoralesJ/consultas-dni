
const axios = require("axios");
const cheerio = require("cheerio");

//==========================  función para obtener token y cookies ==========================
// async function obtenerTokenYCookies() {
//     const url = "https://eldni.com/pe/buscar-datos-por-dni";

//     try {
//         const response = await axios.get(url, { withCredentials: true, headers: { 'User-Agent': 'Mozilla/5.0' } });

//         const $ = cheerio.load(response.data);
//         const token = $('input[name="_token"]').val();
//         const cookies = response.headers['set-cookie'];

//         return { token, cookies };
//     } catch (error) {
//         console.error("Error al obtener token y cookies:", error.message);
//         return null;
//     }
// }

async function obtenerTokenYCookies() {
    const url = "https://eldni.com/pe/buscar-datos-por-dni";

    try {
        const response = await axios.get(url, { withCredentials: true, headers: { 'User-Agent': 'Mozilla/5.0' } });

        const $ = cheerio.load(response.data);
        const token = $('input[name="_token"]').val();  // Extrae el token CSRF
        const cookies = response.headers['set-cookie'];  // Extrae las cookies

        console.log("Token:", token);  // Verifica si el token se obtiene correctamente
        console.log("Cookies:", cookies);  // Verifica las cookies

        return { token, cookies };
    } catch (error) {
        console.error("Error al obtener token y cookies:", error.message);
        return null;
    }
}

// ============ esta función para buscar DNI ==========================
async function buscarDNI(dni) {
    if (!/^\d{8}$/.test(dni)) {
        return { error: "DNI inválido. Debe contener exactamente 8 dígitos numéricos." };
    }

    const url = "https://eldni.com/pe/buscar-datos-por-dni";
    const datos = await obtenerTokenYCookies();

    if (!datos) {
        return { error: "No se pudo obtener el token." };
    }

    const { token, cookies } = datos;

    const headers = {
        'User-Agent': 'Mozilla/5.0',
        'X-CSRF-TOKEN': token,
        'Cookie': cookies.join('; '),
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    const postData = `dni=${dni}&_token=${token}`;

    try {
        const response = await axios.post(url, postData, { headers });

        const $ = cheerio.load(response.data);

        if ($('tbody tr td:nth-child(1)').text().trim() != "" ||
            ($('tbody tr td:nth-child(2)').text().trim() != "" ||
                $('tbody tr td:nth-child(3)').text().trim() != "" ||
                $('tbody tr td:nth-child(4)').text().trim() != "")
        ) {
            return {
                dni: $('tbody tr td:nth-child(1)').text().trim(),
                nombres: $('tbody tr td:nth-child(2)').text().trim(),
                apellidoPaterno: $('tbody tr td:nth-child(3)').text().trim(),
                apellidoMaterno: $('tbody tr td:nth-child(4)').text().trim()
            };

        } else {
            return false;
        }




    } catch (error) {
        console.error("Error en la búsqueda del DNI:", error.message);
        return { error: "Error en la consulta del DNI" };
    }
}

exports.buscarDNI= buscarDNI;