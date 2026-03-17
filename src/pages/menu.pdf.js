// src/pages/menu.pdf.js
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { actualizarMenuPDF } from '../utils/robot-pdf';

// 1. IMPORTANTE: Evita que Render guarde una versión vieja
export const prerender = false;

export async function GET() {
  try {
    console.log('📡 Petición de menú PDF recibida. Generando...');

    // 2. Ejecutamos el robot (él ya sabe ir a /menu-pdf y sacar la foto)
    await actualizarMenuPDF();

    const pdfPath = '/tmp/menu.pdf';

    if (existsSync(pdfPath)) {
      const pdfBuffer = await fs.readFile(pdfPath);

      // 3. Devolvemos el archivo directamente al navegador
      return new Response(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          // 'inline' hace que se abra en el navegador, 'attachment' que se descargue
          'Content-Disposition': 'inline; filename="Menu-La-Rambla.pdf"',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }

    return new Response("El archivo no pudo ser generado", { status: 500 });

  } catch (error) {
    console.error("❌ Error en el generador de PDF:", error);
    return new Response("Error interno del servidor", { status: 500 });
  }
}