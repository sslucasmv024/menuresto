// src/pages/api/guardar.js
import fs from 'node:fs/promises';
import path from 'node:path';
import { actualizarMenuPDF } from '../../utils/robot-pdf';

export async function POST({ request }) {
  try {
    const data = await request.formData();
    
    // Capturamos el ID y el nuevo precio que vienen del formulario
    const id = data.get('id');
    const nuevoPrecio = Number(data.get('precio'));

    // 1. Ruta absoluta al archivo de datos
    const jsonPath = path.resolve('./src/data/menu.json');
    
    // 2. Leer, modificar y GUARDAR en el disco
    const fileData = await fs.readFile(jsonPath, 'utf-8');
    let menu = JSON.parse(fileData);
    
    const index = menu.findIndex(item => item.id === id);
    
    if (index !== -1) {
      menu[index].precio = nuevoPrecio;
      
      const jsonString = JSON.stringify(menu, null, 2);
      // Escribimos el cambio físicamente en el servidor
      await fs.writeFile(jsonPath, jsonString, 'utf-8');
      
      console.log(`✅ Precio actualizado para ${id}: $${nuevoPrecio}`);

      // 3. PAUSA CRÍTICA: Esperamos a que Render asiente el archivo en el disco
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 4. EL ROBOT: Genera el PDF nuevo con el precio actualizado
      // Nota: Esto guarda el archivo en /tmp/menu.pdf
      await actualizarMenuPDF();
      
      console.log("🚀 Robot terminó de generar el PDF nuevo.");
    }

    // 5. REDIRECCIÓN (El secreto del éxito)
    // En lugar de devolver el archivo aquí (que es lo que te causaba confusión),
    // mandamos al usuario de vuelta al panel. 
    // Al recargarse el /admin, leerá el JSON y mostrará el precio nuevo.
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/admin?status=success', // Cambia '/admin' por la ruta de tu panel
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error("❌ Error en la API Guardar:", error);
    return new Response("Error al procesar los datos: " + error.message, { status: 500 });
  }
}