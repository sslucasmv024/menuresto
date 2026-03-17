import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { actualizarMenuPDF } from '../../utils/robot-pdf';

export async function POST({ request }) {
  try {
    const data = await request.formData();
    const id = data.get('id');
    const nuevoPrecio = Number(data.get('precio'));

    // 1. Ruta absoluta al JSON
    const jsonPath = path.resolve('./src/data/menu.json');
    
    // 2. Leer, modificar y GUARDAR
    const fileData = await fs.readFile(jsonPath, 'utf-8');
    let menu = JSON.parse(fileData);
    
    const index = menu.findIndex(item => item.id === id);
    if (index !== -1) {
      menu[index].precio = nuevoPrecio;
      
      // Escribimos el archivo y esperamos a que el sistema de archivos confirme (fsync)
      const jsonString = JSON.stringify(menu, null, 2);
      await fs.writeFile(jsonPath, jsonString, 'utf-8');
      
      console.log(`✅ Precio actualizado en JSON: ${nuevoPrecio}`);

      // 3. PEQUEÑA PAUSA: Damos 500ms para que el disco procese el cambio
      // antes de que el robot entre a la web.
      await new Promise(resolve => setTimeout(resolve, 500));

      // 4. EL ROBOT: Ahora sí saca la foto
      await actualizarMenuPDF();
    }

    // 5. RESPUESTA DE DESCARGA
    const pdfPath = '/tmp/menu.pdf';
    if (existsSync(pdfPath)) {
      const pdfBuffer = await fs.readFile(pdfPath);
      
      return new Response(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="menu-id-${id}.pdf"`,
          'Cache-Control': 'no-cache' // Evitamos que el navegador guarde versiones viejas
        }
      });
    }

    return new Response("Error: PDF no generado", { status: 500 });

  } catch (error) {
    console.error("❌ Error en Guardar:", error);
    return new Response(error.message, { status: 500 });
  }
}