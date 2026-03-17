import puppeteer from 'puppeteer';

async function crearPDF() {
  console.log('🚀 Iniciando el robot de PDF...');
  
  // 1. El robot abre un navegador invisible
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // 2. Entra a tu página de menú (asegúrate que tu server esté corriendo)
  // Usamos el puerto por defecto de Astro: 4321
  await page.goto('http://localhost:4321/menu-pdf', {
    waitUntil: 'networkidle0', // Espera a que no haya más peticiones de red (fotos, etc.)
  });

  // 3. Genera el PDF con configuración de página
  await page.pdf({
    path: './public/menu.pdf', // Se guardará en la carpeta public
    format: 'A4',
    printBackground: true,     // Para que se vean los colores de fondo de Tailwind
    margin: {
      top: '20px',
      bottom: '20px',
      left: '20px',
      right: '20px'
    }
  });

  await browser.close();
  console.log('✅ ¡Menú actualizado con éxito en /public/menu.pdf!');
}

crearPDF();