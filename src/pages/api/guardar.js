// src/pages/api/guardar.js
import fs from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer';
import { miDisenoHtml } from '../../utils/template-pdf';

export async function POST({ request }) {
  try {
    const formData = await request.formData();
    const itemsActualizados = [];
    
    // 1. RECOLECTAR DATOS DEL FORMULARIO
    // Buscamos items[0], items[1]... hasta que no haya más
    let i = 0;
    while (formData.has(`items[${i}][nombre]`)) {
      itemsActualizados.push({
        nombre: formData.get(`items[${i}][nombre]`),
        descripcion: formData.get(`items[${i}][descripcion]`),
        precio: formData.get(`items[${i}][precio]`)
      });
      i++;
    }

    // 2. ACTUALIZAR EL ARCHIVO JSON
    const jsonPath = path.resolve('./src/data/menu.json');
    await fs.writeFile(jsonPath, JSON.stringify(itemsActualizados, null, 2), 'utf-8');

    // 3. INICIAR EL ROBOT (PUPPETEER)
    console.log("🤖 Generando PDF...");
    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--single-process', 
        '--no-zygote'
      ]
    });

    const page = await browser.newPage();

    // 4. INYECTAR EL HTML (Sin usar URLs externas)
    // Le pasamos los 'itemsActualizados' directamente a tu plantilla
    const htmlFinal = miDisenoHtml(itemsActualizados);
    
    await page.setContent(htmlFinal, { 
      waitUntil: 'networkidle0' // Espera a que cargue Tailwind si lo usas con script
    });

    // Generamos el buffer del PDF
    const pdfBuffer = await page.pdf({ 
      format: 'A4', 
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
    });

    await browser.close();

    // 5. ENVIAR EL ARCHIVO AL NAVEGADOR
    // Esto disparará la descarga automática en el admin
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="menu-actualizado.pdf"',
      }
    });

  } catch (error) {
    console.error("❌ Error Crítico:", error);
    return new Response(`Hubo un error: ${error.message}`, { status: 500 });
  }
}