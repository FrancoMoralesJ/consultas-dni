const puppeteer = require('puppeteer');

async function buscarDNI(dni) {
    if (!/^\d{8}$/.test(dni)) {
        return { error: "DNI inválido. Debe contener exactamente 8 dígitos numéricos." };
    }

    const url = "https://eldni.com/pe/buscar-datos-por-dni";
    const browser = await puppeteer.launch({
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
        ],
        executablePath:
            process.env.NODE_ENV === "production"
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath(),
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0");
        await page.goto(url, { waitUntil: 'domcontentloaded' });

    
        await page.waitForSelector('input[name="dni"]');
        await page.waitForSelector('button[type="submit"]');

        await page.type('input[name="dni"]', dni);

        
        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForSelector('tbody tr td', { timeout: 5000 }), // Esperar a que se cargue la tabla
        ]);

       
        const resultado = await page.evaluate(() => {
            const celdas = document.querySelectorAll("tbody tr td");
            if (celdas.length >= 4) {
                return {
                    dni: celdas[0].innerText.trim(),
                    nombres: celdas[1].innerText.trim(),
                    apellidoPaterno: celdas[2].innerText.trim(),
                    apellidoMaterno: celdas[3].innerText.trim(),
                };
            } else {
                return null;
            }
        });
        console.log(resultado);
        
        if (resultado) {
            return resultado;
        } else {
            return { error: "No se encontraron datos para el DNI ingresado." };
        }
    } catch (error) {
        console.error("Error al buscar DNI con Puppeteer:", error.message);
        return { error: "Error en la consulta del DNI..." };
    } finally {
        await browser.close();
    }
}

 module.exports = { buscarDNI };


