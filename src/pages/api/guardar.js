import fs from 'node:fs/promises';
import path from 'node:path';
import { actualizarMenuPDF } from '../../utils/robot-pdf';

export async function POST({ request }) {
  try {
    const data = await request.formData();
    const id = data.get('id');
    const nuevoPrecio = Number(data.get('precio'));

    // 1. Ruta al JSON
    const jsonPath = path.resolve('./src/data/menu.json');
    
    // 2. Leer y Modificar
    const fileData = await fs.readFile(jsonPath, 'utf-8');
    let menu = JSON.parse(fileData);
    
    const index = menu.findIndex(item => item.id === id);
    if (index !== -1) {
      menu[index].precio = nuevoPrecio;
      
      // Escribir cambios
      await fs.writeFile(jsonPath, JSON.stringify(menu, null, 2), 'utf-8');
      console.log(`✅ JSON actualizado: ${id} -> ${nuevoPrecio}`);

      // 3. PAUSA PARA RENDER (1.5 segundos)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 4. EJECUTAR ROBOT Y ESPERAR QUE TERMINE
      console.log("🤖 Iniciando Robot...");
      await actualizarMenuPDF(); 
      console.log("✅ Robot finalizó la creación del PDF");
    }

    const pdfPath = '/tmp/menu.pdf';

    // 5. VERIFICACIÓN ANTES DE LEER
    try {
      await fs.access(pdfPath); // Esto chequea si el archivo EXISTE
    } catch (e) {
      throw new Error("El Robot no generó el archivo /tmp/menu.pdf. Revisa los logs de Puppeteer.");
    }

    // 6. LEER Y ENVIAR
    const pdfBuffer = await fs.readFile(pdfPath);
    
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Menu-Actualizado.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error("❌ ERROR CRÍTICO EN GUARDAR:", error.message);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}