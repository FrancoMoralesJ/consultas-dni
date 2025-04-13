const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');
require('dotenv').config();

async function buscarDNI(dni) {
    if (!/^\d{8}$/.test(dni)) {
        return { error: "DNI inválido. Debe contener exactamente 8 dígitos numéricos." };
    }

    const url = "https://eldni.com/pe/buscar-datos-por-dni";

    try {
        const isProd = process.env.NODE_ENV === 'production';

        const executablePath = isProd
            ? await chromium.executablePath
            : 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

        const browser = await puppeteer.launch({
            headless: isProd ? chromium.headless : false,
            args: isProd ? chromium.args : [],
            executablePath,
        });

        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0");

        await page.goto(url, { waitUntil: 'networkidle2' });

        await page.type('input[name="dni"]', dni);

        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle2' })
        ]);

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
                return { error: "No se encontraron datos para el DNI ingresado." };
            }
        });
        console.log(resultado);
        await browser.close();
        return resultado;

    
        

    } catch (error) {
        console.error("Error al buscar DNI con Puppeteer:", error);
        return { error: "Error en la consulta del DNI." };
    }
}

module.exports = { buscarDNI };




