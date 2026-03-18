// src/utils/robot-pdf.js
import puppeteer from 'puppeteer';

export async function actualizarMenuPDF() {
  console.log('🤖 El robot está iniciando la captura del menú...');

  let browser;
  try {
    // 1. Lanzamos el navegador configurado para el entorno de Render
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process'
      ],
    });

    const page = await browser.newPage();

    // 2. MATAMOS EL CACHÉ DEL NAVEGADOR INTERNO
    // Esto obliga al robot a pedir una versión nueva de la página cada vez
    await page.setCacheEnabled(false);

    // 3. Definimos la URL local de Astro
    const port = process.env.PORT || 4321;
    
    // Agregamos un "timestamp" (v=123456) para que Astro no sirva una página vieja
    const preventCache = Date.now();
    const url = `http://localhost:${port}/menu-pdf?v=${preventCache}`;
    
    console.log(`🔗 Robot visitando la ruta de diseño: ${url}`);

    // 4. Vamos a la página y esperamos a que no haya actividad de red
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 60000 
    });

    // --- 🚨 PAUSA DE SEGURIDAD 🚨 ---
    // Esperamos 2 segundos reales para que el sistema de archivos de Render 
    // termine de procesar el JSON antes de sacar la "foto".
    console.log('⏳ Pausa de 2 segundos para asegurar datos frescos...');
    await new Promise(resolve => setTimeout(resolve, 2000)); 

    // 5. Definimos la ruta de salida (Carpeta temporal de Render)
    const outputPath = '/tmp/menu.pdf';

    // 6. Generamos el PDF
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true, // Importante para que salgan los colores de Tailwind
      margin: {
        top: '20px',
        bottom: '20px',
        left: '20px',
        right: '20px'
      }
    });

    console.log('✅ PDF generado exitosamente en /tmp/menu.pdf');

  } catch (error) {
    console.error('❌ Error en el proceso del Robot:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
      console.log('🤖 Robot desconectado.');
    }
  }
}