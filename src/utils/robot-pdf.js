import puppeteer from 'puppeteer';
import fs from 'node:fs';

export async function actualizarMenuPDF() {
  console.log('🤖 Robot: Iniciando proceso...');
  let browser;

  try {
    // 1. Lanzamos el navegador con los ajustes para Render
    browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
      headless: "new",
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--disable-dev-shm-usage', 
        '--single-process'
      ]
    });

    const page = await browser.newPage();
    
    // 2. Definimos el puerto (Render usa PORT, local usa 4321)
    const port = process.env.PORT || 4321;
    
    // 3. Usamos 127.0.0.1 para ir directo al grano internamente
    const url = `http://127.0.0.1:${port}/menu-pdf`;
    
    console.log(`🔗 Robot intentando conectar a: ${url}`);

    // 4. Vamos a la página y esperamos a que cargue todo (Tailwind incluído)
    await page.goto(url, { 
      waitUntil: 'networkidle0', 
      timeout: 30000 
    });

    // 5. Generamos el PDF en la carpeta temporal de Render
    const outputPath = '/tmp/menu.pdf';
    await page.pdf({ 
      path: outputPath, 
      format: 'A4', 
      printBackground: true 
    });

    // 6. Verificación de seguridad
    if (fs.existsSync(outputPath)) {
      console.log('✅ Robot: ARCHIVO CREADO EN /tmp/menu.pdf');
    } else {
      console.error('❌ Robot: El comando PDF terminó pero el archivo NO ESTÁ.');
    }

  } catch (error) {
    console.error('❌ Error Interno del Robot:', error.message);
    throw new Error("Fallo de Puppeteer: " + error.message);
  } finally {
    // 7. Cerramos siempre el navegador para no agotar la RAM de Render
    if (browser) await browser.close();
  }
}