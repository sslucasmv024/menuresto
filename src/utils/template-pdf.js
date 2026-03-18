// src/utils/template-pdf.js
export function miDisenoHtml(menu) {
  const itemsHtml = menu.map(item => `
    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #ddd; padding: 8px 0;">
      <span>${item.nombre}</span>
      <span style="font-weight: bold;">$${item.precio}</span>
    </div>
  `).join('');

  return `
    <html>
      <head>
        <meta charset="UTF-8">
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body style="padding: 40px; font-family: Arial, sans-serif;">
        <h1 class="text-3xl font-bold mb-4">Cerradura Electrónica</h1>
        <div class="max-w-xl mx-auto">${itemsHtml}</div>
      </body>
    </html>
  `;
}