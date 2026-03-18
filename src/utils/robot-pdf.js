import puppeteer from 'puppeteer';

export async function actualizarMenuPDF() {
  console.log('🤖 Robot: Iniciando proceso de captura...');
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage', // 🚨 Vital para servidores con poca RAM
        '--disable-gpu',            // No necesitamos gráficos
        '--no-first-run',
        '--no-zygote',
        '--single-process'          // 🚨 Ayuda a que Render no explote
      ],
    });

    const page = await browser.newPage();
    
    // Configuramos un puerto por defecto si no existe
    const port = process.env.PORT || 4321;
    const url = `http://localhost:${port}/menu-pdf?t=${Date.now()}`;
    
    console.log(`🔗 Robot: Visitando ${url}`);

    // Esperamos a que la red esté tranquila
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    // Pausa extra para asegurar que Tailwind y el JSON cargaron
    await new Promise(r => setTimeout(r, 1000));

    const outputPath = '/tmp/menu.pdf';
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true
    });

    console.log('✅ Robot: PDF generado con éxito en /tmp/menu.pdf');

  } catch (error) {
    console.error('❌ Robot Error:', error.message);
    throw error; // Esto hace que el error suba a guardar.js y lo veas en pantalla
  } finally {
    if (browser) await browser.close();
  }
}