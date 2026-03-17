import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

async function crearPDF() {
  console.log('🚀 Iniciando proceso de PDF en el servidor...');
  
  const browser = await puppeteer.launch({
    // Estos argumentos son OBLIGATORIOS para que Linux no bloquee a Chrome
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--single-process'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Usamos la URL de Render o 0.0.0.0 si falla
    const url = process.env.RENDER_EXTERNAL_URL || 'http://0.0.0.0:10000';
    
    await page.goto(`${url}/menu-pdf`, {
      waitUntil: 'networkidle0',
      timeout: 60000 // Le damos 1 minuto por si el servidor está lento
    });

    // IMPORTANTE: En Render no podemos escribir en /public/
    // Usamos la carpeta /tmp/ que es para archivos temporales
    const outputPath = '/tmp/menu.pdf';

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
    });

    console.log(`✅ PDF generado con éxito en: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error fatal generando PDF:', error);
  } finally {
    await browser.close();
  }
}

crearPDF();