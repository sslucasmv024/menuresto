import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { actualizarMenuPDF } from '../../utils/robot-pdf';

export async function POST({ request }) {
  try {
    const data = await request.formData();
    const id = data.get('id');
    const nuevoPrecio = data.get('precio');

    // 1. Actualizamos el JSON (Tu lógica actual)
    const jsonPath = path.resolve('./src/data/menu.json');
    const menu = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
    const index = menu.findIndex(item => item.id === id);
    
    if (index !== -1) {
      menu[index].precio = Number(nuevoPrecio);
      await fs.writeFile(jsonPath, JSON.stringify(menu, null, 2));

      // 2. LLAMAMOS AL ROBOT: Aquí es donde Puppeteer crea el PDF
      // IMPORTANTE: Esta función debe estar configurada para guardar en /tmp/menu.pdf
      await actualizarMenuPDF();
    }

    // 3. LA DESCARGA: Buscamos el archivo que el robot acaba de crear
    const pdfPath = '/tmp/menu.pdf';

    if (existsSync(pdfPath)) {
      const pdfBuffer = await fs.readFile(pdfPath);
      
      // Enviamos el PDF directamente al navegador
      return new Response(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="menu-actualizado.pdf"',
        }
      });
    } else {
      throw new Error("El archivo PDF no se encontró en /tmp/menu.pdf");
    }

  } catch (error) {
    console.error("Error en el servidor:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}