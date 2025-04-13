const puppeteer = require('puppeteer-core');
require('dotenv').config();

async function buscarDNI(dni) {
    console.log("Ruta de Chrome:", process.env.PUPPETEER_EXECUTABLE_PATH);
    if (!/^\d{8}$/.test(dni)) {
        return { error: "DNI inválido. Debe contener exactamente 8 dígitos numéricos." };
    }

    const url = "https://eldni.com/pe/buscar-datos-por-dni";

    try {

        
const rutaChrome =
process.env.NODE_ENV === 'production' ? process.env.PUPPETEER_EXECUTABLE_PATH: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'; 

        const browser = await puppeteer.launch({
            // headless: true, executablePath: '/usr/bin/google-chrome',   args: ['--no-sandbox', '--disable-setuid-sandbox'] 
            headless: true, 
              args:
               [
                "--disable-setuid-sandbox",
                "--no-sandbox"
              ],
              executablePath: rutaChrome
             
        });

        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0");

        // Ir a la página
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Escribir el DNI en el input
       await page.type('input[name="dni"]', dni);
        var titulo =await page.title();
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

        console.log("probando.... "+process.env.PUPPETEER_EXECUTABLE_PATH);
        
        // if (resultado) {
        //     return resultado;
        // } else {
        //     return { error: "No se encontraron datos para el DNI ingresado." };
        // }
        return resultado;

    } catch (error) {
        console.error("Error al buscar DNI con Puppeteer:", error.message);
        return { error: "Error en la consulta del DNI." };
    }
}





module.exports = { buscarDNI };
