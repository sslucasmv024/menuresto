// src/pages/menu.pdf.js
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { actualizarMenuPDF } from '../utils/robot-pdf';

// 1. IMPORTANTE: Esto le dice a Astro que genere el contenido en el momento (SSR)
export const prerender = false;

export async function GET() {
  try {
    console.log('📡 Iniciando generación de PDF desde ruta pública...');

    // 2. Llamamos al robot para que capture el estado actual del JSON
    // El robot entrará a /menu-pdf, sacará la foto y la guardará en /tmp/menu.pdf
    await actualizarMenuPDF();

    const pdfPath = '/tmp/menu.pdf';

    // 3. Verificamos si el robot terminó su trabajo
    if (existsSync(pdfPath)) {
      const pdfBuffer = await fs.readFile(pdfPath);

      return new Response(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          // 'attachment' fuerza la descarga con el nombre elegido
          'Content-Disposition': 'attachment; filename="Menu-La-Rambla.pdf"',
          // Estos headers matan cualquier intento de Cache (memoria vieja)
          'Cache-Control': 'no-cache, no-store, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Last-Modified': new Date().toUTCString()
        }
      });
    }

    return new Response("Error: El archivo PDF no pudo ser generado por el sistema.", { status: 500 });

  } catch (error) {
    console.error("❌ Error crítico en menu.pdf.js:", error);
    return new Response("Error interno al procesar el PDF.", { status: 500 });
  }
}