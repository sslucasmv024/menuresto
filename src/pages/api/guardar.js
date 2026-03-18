// src/pages/api/guardar.js
import fs from 'node:fs/promises';
import path from 'node:path';
import { actualizarMenuPDF } from '../../utils/robot-pdf';

export async function POST({ request }) {
  try {
    const data = await request.formData();
    const id = data.get('id');
    const nuevoPrecio = Number(data.get('precio'));

    // 1. Ruta al JSON (Aseguramos que sea absoluta)
    const jsonPath = path.resolve('./src/data/menu.json');
    
    // 2. LEER Y ESCRIBIR EL JSON
    const fileData = await fs.readFile(jsonPath, 'utf-8');
    let menu = JSON.parse(fileData);
    
    const index = menu.findIndex(item => item.id === id);
    if (index !== -1) {
      menu[index].precio = nuevoPrecio;
      
      // Forzamos la escritura inmediata en el disco
      await fs.writeFile(jsonPath, JSON.stringify(menu, null, 2), 'utf-8');
      console.log(`✅ Disco: Precio de ${id} actualizado a ${nuevoPrecio}`);

      // 3. ESPERA TÉCNICA (Fundamental en Render)
      // Esperamos 1.5 segundos para que el sistema de archivos de Render se actualice
      // y la página /menu-pdf pueda leer el nuevo valor.
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 4. EL ROBOT GENERA EL PDF NUEVO
      await actualizarMenuPDF();
    }

    // 5. ENVIAR EL ARCHIVO PARA DESCARGA (Como antes)
    const pdfPath = '/tmp/menu.pdf';
    
    // Leemos el archivo que el robot acaba de crear en la carpeta temporal
    const pdfBuffer = await fs.readFile(pdfPath);
    
    console.log("📤 Enviando PDF actualizado al navegador...");

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        // Esto fuerza la descarga inmediata
        'Content-Disposition': `attachment; filename="Menu-Actualizado-${id}.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error("❌ Error Crítico:", error);
    return new Response("Error: " + error.message, { status: 500 });
  }
}