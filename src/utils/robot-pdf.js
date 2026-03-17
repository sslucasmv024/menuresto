// src/utils/robot-pdf.js
import puppeteer from 'puppeteer';

export async function actualizarMenuPDF() {
  console.log('🤖 El robot está despertando para capturar los nuevos precios...');

  let browser;
  try {
    // 1. Lanzamos el navegador en Render
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process'
      ],
    });

    const page = await browser.newPage();

    // 2. DESACTIVAR CACHÉ DEL NAVEGADOR
    await page.setCacheEnabled(false);

    // 3. Ruta de diseño con TIMESTAMP dinámico para romper caché de Astro
    const port = process.env.PORT || 4321;
    const timestamp = Date.now();
    // Apuntamos a /menu-pdf (la página de diseño)
    const url = `http://localhost:${port}/menu-pdf?t=${timestamp}`;
    
    console.log(`🔗 El robot está visitando: ${url}`);

    // 4. Navegación con espera total
    await page.goto(url, {
      waitUntil: 'networkidle0', // Espera a que cargue todo (imágenes, red, etc.)
      timeout: 60000 // 1 minuto de timeout
    });

    // --- 🚨 FUERZA BRUTA: ESPERA EXTRA DE 2 SEGUNDOS 🚨 ---
    // Le damos tiempo al servidor de Render para que termine de leer el JSON nuevo
    console.log('⏳ Esperando 2 segundos para asegurar datos frescos...');
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    // --------------------------------------------------------

    // 5. Generamos el PDF en la carpeta temporal /tmp/
    const outputPath = '/tmp/menu.pdf';

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true, // Captura los fondos de Tailwind
      margin: {
        top: '10px',
        bottom: '10px',
        left: '10px',
        right: '10px'
      }
    });

    console.log('✅ PDF actualizado y guardado en /tmp/menu.pdf');

  } catch (error) {
    console.error('❌ Error crítico del robot:', error.message);
    throw error; // Re-lanzamos el error para que menu.pdf.js lo capture
  } finally {
    if (browser) {
      await browser.close();
      console.log('🤖 Robot apagado.');
    }
  }
}