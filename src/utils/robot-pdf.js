import puppeteer from 'puppeteer';

export async function actualizarMenuPDF() {
  console.log('🤖 El robot está arrancando...');

  // 1. Configuración para RENDER (Usando el Chrome del sistema)
  const browser = await puppeteer.launch({
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
    
    // 2. Usar la URL real de tu web en Render (o 0.0.0.0 que es el estándar de servidores)
    const url = process.env.RENDER_EXTERNAL_URL || 'http://0.0.0.0:10000';
    console.log(`🔗 El robot está visitando: ${url}/menu-pdf`);

    await page.goto(`${url}/menu-pdf`, { 
      waitUntil: 'networkidle0',
      timeout: 60000 
    });
    
    // 3. GUARDAR EN /tmp (Vital para que 'guardar.js' lo encuentre)
    const outputPath = '/tmp/menu.pdf';

    await page.pdf({ 
      path: outputPath, 
      format: 'A4', 
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
    });

    console.log('✅ PDF generado con éxito en /tmp/menu.pdf');

  } catch (error) {
    console.error('❌ Error del robot Puppeteer:', error);
    throw error; // Re-lanzamos el error para que 'guardar.js' sepa que falló
  } finally {
    await browser.close();
  }
}