import fs from 'node:fs/promises';
import path from 'node:path';
import { actualizarMenuPDF } from '../../utils/robot-pdf';

export async function POST({ request }) {
  const data = await request.formData();
  const id = data.get('id');
  const nuevoPrecio = data.get('precio');

  // 1. Leemos el JSON actual
  const jsonPath = path.resolve('./src/data/menu.json');
  const menu = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));

  // 2. Buscamos el plato y cambiamos el precio
  const index = menu.findIndex(item => item.id === id);
  if (index !== -1) {
    menu[index].precio = Number(nuevoPrecio);
    
    // 3. Guardamos el JSON con el nuevo dato
    await fs.writeFile(jsonPath, JSON.stringify(menu, null, 2));

    // 4. LA MAGIA: Llamamos al robot para que actualice el PDF solo
    await actualizarMenuPDF();
  }

  // Redirigimos de vuelta a la app
  return new Response(null, {
    status: 302,
    headers: { 'Location': '/admin?success=true' }
  });
}