import puppeteer from 'puppeteer';

export async function actualizarMenuPDF() {
  console.log('🤖 Iniciando robot...');

  const browser = await puppeteer.launch({
    // Eliminamos la ruta fija de /usr/bin y dejamos que Puppeteer use su cache
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--single-process'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // IMPORTANTE: En Render, Astro corre internamente en el puerto 10000 o el que asigne PORT
    const port = process.env.PORT || 4321;
    const url = `http://localhost:${port}`;
    
    console.log(`🔗 Visitando: ${url}/menu-pdf`);
    await page.goto(`${url}/menu-pdf`, { waitUntil: 'networkidle0', timeout: 60000 });
    
    await page.pdf({ 
      path: '/tmp/menu.pdf', 
      format: 'A4', 
      printBackground: true 
    });

    console.log('✅ PDF guardado en /tmp/menu.pdf');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await browser.close();
  }
}