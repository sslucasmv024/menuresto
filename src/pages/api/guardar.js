// src/pages/api/guardar.js
import fs from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer';
import { miDisenoHtml } from '../../utils/template-pdf';

export const prerender = false; // Importante: Las APIs siempre deben ser dinámicas

export async function POST({ request }) {
  let browser = null;

  try {
    const formData = await request.formData();
    const itemsActualizados = [];
    
    // 1. RECOLECTAR DATOS DEL FORMULARIO (Mapeo de items[n])
    let i = 0;
    while (formData.has(`items[${i}][nombre]`)) {
      itemsActualizados.push({
        nombre: formData.get(`items[${i}][nombre]`),
        descripcion: formData.get(`items[${i}][descripcion]`) || '',
        precio: formData.get(`items[${i}][precio]`)
      });
      i++;
    }

    // 2. ACTUALIZAR EL ARCHIVO JSON EN EL DISCO
    const jsonPath = path.resolve('./src/data/menu.json');
    await fs.writeFile(jsonPath, JSON.stringify(itemsActualizados, null, 2), 'utf-8');

    // 3. CONFIGURAR E INICIAR EL ROBOT (PUPPETEER V24)
    console.log("🤖 Iniciando generación de PDF...");
    
    browser = await puppeteer.launch({
      // En Render, Puppeteer necesita estos argumentos para no fallar
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
      headless: "shell", // Formato recomendado para versiones 22+
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--single-process', 
        '--disable-dev-shm-usage',
        '--no-zygote'
      ]
    });

    const page = await browser.newPage();

    // 4. INYECTAR EL DISEÑO HTML DIRECTAMENTE
    // Usamos la función de tu template pasándole los datos frescos
    const htmlFinal = miDisenoHtml(itemsActualizados);
    
    // setContent es la clave: el robot no navega a ninguna URL, lee el texto directo
    await page.setContent(htmlFinal, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    // 5. GENERAR EL BUFFER DEL ARCHIVO PDF
    const pdfBuffer = await page.pdf({ 
      format: 'A4', 
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
    });

    // Cerramos el navegador para liberar la RAM de Render inmediatamente
    await browser.close();
    browser = null;

    // 6. RESPONDER CON EL ARCHIVO PARA DESCARGA
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="menu-la-rambla-actualizado.pdf"',
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error("❌ ERROR EN GUARDAR.JS:", error);
    
    // Si el navegador quedó abierto por el error, lo cerramos
    if (browser) await browser.close();

    return new Response(
      JSON.stringify({ error: "No se pudo generar el PDF", detalle: error.message }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}