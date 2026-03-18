// src/utils/template-pdf.js
export function miDisenoHtml(menu) {
  const itemsHtml = menu.map(item => `
    <div class="flex justify-between items-baseline border-b border-gray-100 py-3">
      <div class="flex-1">
        <h3 class="font-bold text-gray-900">${item.nombre}</h3>
        <p class="text-xs text-gray-500 italic">${item.descripcion || ''}</p>
      </div>
      <span class="font-black text-xl text-black ml-4">$${item.precio}</span>
    </div>
  `).join('');

  return `
    <html>
      <head>
        <meta charset="UTF-8">
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="p-12 bg-white min-h-screen">
        <div class="max-w-2xl mx-auto border-t-8 border-black pt-6">
          <h1 class="text-4xl font-black uppercase tracking-tighter mb-2 text-center">Catálogo de Precios</h1>
          <p class="text-center text-gray-400 text-xs mb-10 uppercase tracking-widest">Cerradura Electrónica</p>
          
          <div class="space-y-1">
            ${itemsHtml}
          </div>
        </div>
      </body>
    </html>
  `;
}