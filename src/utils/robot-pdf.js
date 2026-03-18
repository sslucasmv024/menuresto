// src/utils/robot-pdf.js
import puppeteer from 'puppeteer';
import fs from 'node:fs';

export async function actualizarMenuPDF() {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process']
    });

    const page = await browser.newPage();
    const port = process.env.PORT || 4321;
    const url = `http://127.0.0.1:${port}/menu-pdf`;

    console.log(`🤖 Robot: Intentando capturar ${url}...`);

    // Reintento: A veces el servidor interno tarda en responder
    let intentos = 0;
    while (intentos < 3) {
      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 });
        break; // Si tiene éxito, sale del bucle
      } catch (e) {
        intentos++;
        console.log(`⚠️ Intento ${intentos} fallido, reintentando...`);
        await new Promise(r => setTimeout(r, 2000)); // Espera 2 segundos
        if (intentos === 3) throw e;
      }
    }

    const outputPath = '/tmp/menu.pdf';
    await page.pdf({ path: outputPath, format: 'A4', printBackground: true });

    if (fs.existsSync(outputPath)) {
      console.log('✅ Robot: PDF generado con éxito.');
    }

  } catch (error) {
    console.error('❌ Error del Robot:', error.message);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
}