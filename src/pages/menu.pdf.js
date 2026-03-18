import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { actualizarMenuPDF } from '../utils/robot-pdf';

// 1. IMPORTANTE: Esto le dice a Astro que no guarde una versión estática
export const prerender = false;

export async function GET() {
  try {
    console.log('📡 Petición de menú PDF recibida. Iniciando actualización...');

    // 2. LLAMAMOS AL ROBOT: Aquí es donde se hace la magia.
    // El robot entrará a /menu-pdf, verá los precios nuevos y sacará la foto.
    await actualizarMenuPDF();

    const pdfPath = '/tmp/menu.pdf';

    // 3. Verificamos que el robot haya terminado de escribir el archivo
    if (existsSync(pdfPath)) {
      const pdfBuffer = await fs.readFile(pdfPath);

      return new Response(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="Menu-La-Rambla.pdf"',
          // Estos headers obligan al navegador a NO usar memoria vieja
          'Cache-Control': 'no-cache, no-store, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Last-Modified': new Date().toUTCString()
        }
      });
    }

    return new Response("Error: El robot no pudo generar el archivo a tiempo.", { status: 500 });

  } catch (error) {
    console.error("❌ Error en el endpoint menu.pdf.js:", error);
    return new Response("Error interno del servidor", { status: 500 });
  }
}