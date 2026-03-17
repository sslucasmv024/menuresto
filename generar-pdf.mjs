import puppeteer from 'puppeteer';
import fs from 'fs';

async function crearPDF() {
  console.log('🚀 Iniciando generación de PDF...');
  
  const browser = await puppeteer.launch({
    // Usamos el Chrome del sistema que instalamos en el Build Command
    executablePath: '/usr/bin/google-chrome-stable',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--single-process'
    ]
  });

  try {
    const page = await browser.newPage();
    const url = process.env.RENDER_EXTERNAL_URL || 'http://localhost:10000';
    
    await page.goto(`${url}/menu-pdf`, { waitUntil: 'networkidle0' });

    // Guardamos en /tmp para evitar errores de permisos
    const outputPath = '/tmp/menu.pdf';
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true
    });

    console.log('✅ PDF creado en /tmp/menu.pdf');
    
    // Aquí es donde "se lo das" al usuario (esto depende de tu ruta API)
    // Si este script es solo un proceso de build, termina acá.
    
  } catch (e) {
    console.error('❌ Error:', e);
  } finally {
    await browser.close();
  }
}

crearPDF();