import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

async function crearPDF() {
  console.log('🚀 Iniciando el proceso de generación de PDF...');

  let browser;
  try {
    // 1. Configuración de lanzamiento para Render
    browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process'
      ],
    });

    const page = await browser.newPage();

    // 2. Definir la URL (usa la de Render o la local como respaldo)
    const url = process.env.RENDER_EXTERNAL_URL || 'http://localhost:4321';
    console.log(`🔗 Navegando a: ${url}/menu-pdf`);

    await page.goto(`${url}/menu-pdf`, {
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    // 3. Definir la ruta de salida en la carpeta temporal /tmp
    // Render NO permite escribir en ./public/ durante la ejecución
    const outputPath = '/tmp/menu.pdf';

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        bottom: '20px',
        left: '20px',
        right: '20px'
      }
    });

    console.log(`✅ ¡Éxito! PDF generado en: ${outputPath}`);

    // OPCIONAL: Si necesitas moverlo o leerlo después, 
    // recordá que vive en la memoria temporal del servidor.
    
  } catch (error) {
    console.error('❌ ERROR generando el PDF:', error);
  } finally {
    if (browser) {
      await browser.close();
      console.log('🤖 Robot de Puppeteer cerrado.');
    }
  }
}

crearPDF();