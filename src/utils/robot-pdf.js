import puppeteer from 'puppeteer';

export async function actualizarMenuPDF() {
  console.log('🤖 El robot está despertando...');

  let browser;
  try {
    // 1. Lanzamos Puppeteer
    // No definimos executablePath para que use el que descargamos en el Build
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process'
      ],
    });

    const page = await browser.newPage();

    // 2. Configuramos la URL dinámica
    // En Render, la app corre en el puerto de la variable PORT o 4321 por defecto
    const port = process.env.PORT || 4321;
    const url = `http://localhost:${port}/menu-pdf`;
    
    console.log(`🔗 El robot está visitando: ${url}`);

    // Navegamos a la ruta que genera el diseño del PDF
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 60000 // Le damos tiempo extra por si el servidor está lento
    });

    // 3. Generamos el PDF en la carpeta /tmp
    // Esta ruta es vital para que luego 'guardar.js' lo pueda leer
    const outputPath = '/tmp/menu.pdf';

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10px',
        bottom: '10px',
        left: '10px',
        right: '10px'
      }
    });

    console.log('✅ PDF generado con éxito en /tmp/menu.pdf');

  } catch (error) {
    console.error('❌ Error crítico del robot:', error.message);
    // No lanzamos el error con throw para evitar que el proceso de guardado 
    // se detenga por completo si el PDF falla.
  } finally {
    if (browser) {
      await browser.close();
      console.log('🤖 Robot apagado.');
    }
  }
}