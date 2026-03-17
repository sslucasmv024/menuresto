import puppeteer from 'puppeteer';

export async function actualizarMenuPDF() {
  console.log('🤖 El robot está despertando para capturar los nuevos precios...');

  let browser;
  try {
    // 1. Lanzamos el navegador usando el caché de Render
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process'
      ],
    });

    const page = await browser.newPage();

    // 2. Evitamos el Cache del Navegador
    // Esto obliga a Puppeteer a pedir una versión fresca de la página
    await page.setCacheEnabled(false);

    // 3. Construimos la URL con un "timestamp" para engañar al servidor
    // Esto asegura que Render no nos devuelva una versión guardada en memoria
    const port = process.env.PORT || 4321;
    const timestamp = Date.now();
    const url = `http://localhost:${port}/menu-pdf?t=${timestamp}`;
    
    console.log(`🔗 El robot está visitando: ${url}`);

    // 4. Navegación con espera total
    await page.goto(url, {
      waitUntil: 'networkidle0', // Espera a que no haya tráfico de red (imágenes cargadas)
      timeout: 60000 
    });

    // 5. Generamos el PDF en la carpeta temporal
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

    console.log('✅ PDF actualizado y guardado en /tmp/menu.pdf');

  } catch (error) {
    console.error('❌ Error crítico del robot:', error.message);
  } finally {
    if (browser) {
      await browser.close();
      console.log('🤖 Robot apagado.');
    }
  }
}