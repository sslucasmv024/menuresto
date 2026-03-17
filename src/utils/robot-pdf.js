import puppeteer from 'puppeteer';

export async function actualizarMenuPDF() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // El robot visita tu página de menú
  await page.goto('http://localhost:4321/menu-pdf', { waitUntil: 'networkidle0' });
  
  // Guarda el PDF sobreescribiendo el anterior
  await page.pdf({ 
    path: './public/menu.pdf', 
    format: 'A4', 
    printBackground: true 
  });

  await browser.close();
  console.log('--- PDF Autoregenerado ---');
}