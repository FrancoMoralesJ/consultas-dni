const puppeteer = require('puppeteer');

async function buscarDNI(dni) {
   
    if (!/^\d{8}$/.test(dni)) {
        return { error: "DNI inválido. Debe contener exactamente 8 dígitos numéricos." };
    }

    const url = "https://eldni.com/pe/buscar-datos-por-dni";

    try {
        const browser = await puppeteer.launch({
            headless: true, executablePath: '/usr/bin/google-chrome',   args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        });

        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0");

        // Ir a la página
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Escribir el DNI en el input
        var mi_dni =await page.type('input[name="dni"]', dni);

        // Hacer clic en el botón de búsqueda
        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle2' })
        ]);

        // Evaluar y extraer datos del resultado
        const resultado = await page.evaluate(() => {
            const celdas = document.querySelectorAll("tbody tr td");
            if (celdas.length >= 4) {
                return {
                    dni: celdas[0].innerText.trim(),
                    nombres: celdas[1].innerText.trim(),
                    apellidoPaterno: celdas[2].innerText.trim(),
                    apellidoMaterno: celdas[3].innerText.trim()
                };
            } else {
                return null;
            }
        });

        await browser.close();

        console.log(resultado);
        
        // if (resultado) {
        //     return resultado;
        // } else {
        //     return { error: "No se encontraron datos para el DNI ingresado." };
        // }
        return mi_dni;

    } catch (error) {
        console.error("Error al buscar DNI con Puppeteer:", error.message);
        return { error: "Error en la consulta del DNI." };
    }
}





module.exports = { buscarDNI };
